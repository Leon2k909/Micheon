import type { DataConnection, Peer as PeerType } from "peerjs";
import { getFriendCode, normaliseFriendCode, peerIdForCode } from "@/lib/friendCode";
import {
  readFriendMessage,
  type FriendMessage,
  type FriendProfile,
} from "@/lib/friendProfile";
import { isFriend, recordFriendProfile } from "@/lib/friendStore";

/**
 * The connection between two copies of Micheon.
 *
 * The learning data goes directly between the two computers over an encrypted
 * WebRTC data channel. What the internet is needed for is the introduction:
 * two apps behind two routers cannot find each other unaided, so a broker
 * holds the address book and passes the connection details across. It sees
 * that two codes want to talk. It does not see what they say — the channel is
 * encrypted end to end, and the broker is not a party to it.
 *
 * That is the whole of the online part. No account, no profile on anybody's
 * server, and nothing about the course leaves these two machines.
 *
 * THE DOOR IS SHUT BY DEFAULT. A peer id is reachable by anything that speaks
 * WebRTC, so an incoming connection proves nothing about who is on the other
 * end. Anyone not already a friend gets a pairing request handed to the person
 * using the app, and no profile until they say yes.
 */

/** Overridable so this can be pointed at a self-hosted broker later. */
export const DEFAULT_BROKER = { host: "0.peerjs.com", port: 443, path: "/", secure: true } as const;

export type PeerStatus = "idle" | "connecting" | "online" | "offline" | "error";

export type PairRequest = { code: string; profile: FriendProfile };

export type FriendPeerEvents = {
  onStatus?: (status: PeerStatus, detail?: string) => void;
  /** A stranger is asking. Nothing is stored until the app answers. */
  onPairRequest?: (request: PairRequest) => void;
  onConnectedChange?: (codes: string[]) => void;
};

/**
 * One peer per app, because the broker gives one id per connection and a
 * second would take the same id and evict the first.
 */
let peer: PeerType | null = null;
let live: typeof import("peerjs") | null = null;
const open = new Map<string, DataConnection>();
const pending = new Map<string, DataConnection>();
/**
 * Listeners, plural, because the peer now outlives the screen that used to
 * own it.
 *
 * It used to be a single handler set, replaced by whoever started the peer.
 * That was fine while Friends was the only thing that ever started it, and
 * wrong the moment the app itself does: opening Friends would have taken the
 * events away from whatever was holding them, and closing it would have put
 * back nothing.
 */
const listeners = new Set<FriendPeerEvents>();
const events = {
  onStatus(status: PeerStatus, detail?: string) {
    for (const listener of listeners) listener.onStatus?.(status, detail);
  },
  onPairRequest(request: PairRequest) {
    for (const listener of listeners) listener.onPairRequest?.(request);
  },
  onConnectedChange(codes: string[]) {
    for (const listener of listeners) listener.onConnectedChange?.(codes);
  },
};

/** Listen while a screen is open, and stop without taking the peer down. */
export function addFriendPeerListener(handlers: FriendPeerEvents): () => void {
  listeners.add(handlers);
  return () => { listeners.delete(handlers); };
}

/**
 * Requests that arrived while nothing was listening.
 *
 * Being reachable all the time means a stranger can ask at a moment when no
 * screen is open to put the question. The connection is held, nothing is
 * stored, and Friends asks when it opens — which is the same answer as
 * before, just not lost in between.
 */
export function waitingPairRequests(): string[] {
  return [...pending.keys()];
}
/** The last thing the peer said about itself, for a screen that opens later. */
let lastStatus: PeerStatus = "idle";
let lastDetail: string | undefined;
export function friendPeerStatus(): { status: PeerStatus; detail?: string } {
  return { status: lastStatus, detail: lastDetail };
}

let mine: () => FriendProfile = () => {
  throw new Error("friendPeer.start was not given a profile source");
};

function announce() {
  events.onConnectedChange([...open.keys()]);
}

function send(connection: DataConnection, message: FriendMessage) {
  try { connection.send(message); } catch { /* a closed channel is not an error worth raising */ }
}

function codeFromPeerId(id: string): string {
  return normaliseFriendCode(String(id ?? "").replace(/^micheon-/, ""));
}

/** What an arriving message earns, given whether we already know the sender. */
export type IncomingAction = "greet-back" | "ask-the-person" | "accept" | "ignore";

/**
 * The whole of the trust rule, in one place with no I/O.
 *
 * It lived inline in the data handler, spread over three `isFriend` calls, and
 * the check that was supposed to guard it could only look for that text.
 * Deleting one of the three left the string present elsewhere and the check
 * green — a stranger's profile would have been filed and nothing would have
 * said so. As a function it can simply be called with every combination.
 */
export function decideIncoming(type: FriendMessage["type"], known: boolean): IncomingAction {
  if (type === "pair-request") return known ? "greet-back" : "ask-the-person";
  if (type === "profile" || type === "pair-accepted") return known ? "accept" : "ignore";
  return "ignore";
}

function wire(connection: DataConnection) {
  const code = codeFromPeerId(connection.peer);
  if (!code) { try { connection.close(); } catch {} return; }

  connection.on("data", (raw: unknown) => {
    const message = readFriendMessage(raw);
    if (!message) return;

    // Taken first because it is the one message with nothing attached, which
    // is also what lets the rest be read as carrying a profile.
    if (message.type === "pair-declined") return;

    switch (decideIncoming(message.type, isFriend(code))) {
      case "greet-back":
        // Already known — them saying hello again, not a question the person
        // has already answered.
        recordFriendProfile(message.profile);
        send(connection, { type: "pair-accepted", profile: mine() });
        open.set(code, connection);
        announce();
        return;
      case "ask-the-person":
        pending.set(code, connection);
        events.onPairRequest?.({ code, profile: message.profile });
        return;
      case "accept":
        recordFriendProfile(message.profile);
        open.set(code, connection);
        announce();
        return;
      default:
        // A stranger, or a message that earns nothing. Dropped rather than
        // stored — recordFriendProfile would refuse it too, but an unpaired
        // peer should not be able to reach the store at all.
        return;
    }
  });

  connection.on("open", () => {
    if (isFriend(code)) {
      open.set(code, connection);
      send(connection, { type: "profile", profile: mine() });
      announce();
    }
  });

  const drop = () => {
    if (open.get(code) === connection) open.delete(code);
    if (pending.get(code) === connection) pending.delete(code);
    announce();
  };
  connection.on("close", drop);
  connection.on("error", drop);
}

export async function startFriendPeer(
  profileSource: () => FriendProfile,
  handlers: FriendPeerEvents = {}
): Promise<string> {
  if (handlers.onStatus || handlers.onPairRequest || handlers.onConnectedChange) listeners.add(handlers);
  mine = profileSource;
  const code = getFriendCode();
  if (peer) return code;

  lastStatus = "connecting";
  events.onStatus("connecting");
  // Imported here rather than at module load: it opens a socket to the broker,
  // and an app started offline should not pay for that before Friends is even
  // opened.
  live = live ?? (await import("peerjs"));
  const created = new live.Peer(peerIdForCode(code), { ...DEFAULT_BROKER });
  peer = created;

  created.on("open", () => { lastStatus = "online"; events.onStatus("online"); });
  created.on("connection", (connection: DataConnection) => wire(connection));
  created.on("disconnected", () => { lastStatus = "offline"; events.onStatus("offline"); });
  created.on("error", (error: Error) => {
    lastStatus = "error";
    lastDetail = error?.message;
    events.onStatus("error", error?.message);
  });
  return code;
}

export function stopFriendPeer() {
  for (const connection of [...open.values(), ...pending.values()]) {
    try { connection.close(); } catch {}
  }
  open.clear();
  pending.clear();
  try { peer?.destroy(); } catch {}
  peer = null;
  announce();
}

/** Reach out to a code, whether to pair with it or to refresh a friend. */
export function connectToCode(code: string) {
  const clean = normaliseFriendCode(code);
  if (!peer || !clean || clean === getFriendCode()) return;
  if (open.has(clean)) { send(open.get(clean)!, { type: "profile", profile: mine() }); return; }
  const connection = peer.connect(peerIdForCode(clean), { reliable: true });
  wire(connection);
  connection.on("open", () => {
    send(connection, isFriend(clean)
      ? { type: "profile", profile: mine() }
      : { type: "pair-request", profile: mine() });
  });
}

/** The person said yes. Only now does the other side get anything. */
export function acceptPair(code: string) {
  const clean = normaliseFriendCode(code);
  const connection = pending.get(clean);
  pending.delete(clean);
  if (!connection) return;
  send(connection, { type: "pair-accepted", profile: mine() });
  open.set(clean, connection);
  announce();
}

export function declinePair(code: string) {
  const clean = normaliseFriendCode(code);
  const connection = pending.get(clean);
  pending.delete(clean);
  if (!connection) return;
  send(connection, { type: "pair-declined" });
  try { connection.close(); } catch {}
}

/** Push the current figures to everyone connected, after a lesson say. */
export function broadcastProfile() {
  for (const connection of open.values()) send(connection, { type: "profile", profile: mine() });
}

export function connectedCodes(): string[] {
  return [...open.keys()];
}
