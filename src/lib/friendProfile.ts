/**
 * What one app tells another about the person using it.
 *
 * Deliberately small. This travels to somebody else's computer, so it carries
 * the figures the Friends list actually prints and nothing else — no email, no
 * lesson history, no word list, no account id. Anything not on this type
 * cannot leak, because there is no code path that sends it.
 *
 * Every figure here is one the app already shows the learner about themselves
 * on the home page. Nothing is computed specially for other people to see.
 */
export type FriendProfile = {
  /** Protocol version, so an old build meeting a new one can say so. */
  v: 1;
  /** The sender's own code, which is how the receiver files the snapshot. */
  code: string;
  name: string;
  /** The level label the app already derives from total XP. */
  level: string;
  streak: number;
  totalXp: number;
  learningDays: number;
  /** Epoch ms on the SENDER's clock — see freshness handling in friendStore. */
  sentAt: number;
};

/** Everything the protocol will send down the wire, in one place. */
export type FriendMessage =
  | { type: "profile"; profile: FriendProfile }
  | { type: "pair-request"; profile: FriendProfile }
  | { type: "pair-accepted"; profile: FriendProfile }
  | { type: "pair-declined" };

const MAX_NAME = 40;
const MAX_LEVEL = 60;

/** A number from somebody else's computer is input, not data. */
function safeCount(value: unknown): number {
  const n = Number(value);
  if (!Number.isFinite(n) || n < 0) return 0;
  return Math.min(Math.floor(n), 100_000_000);
}

function safeText(value: unknown, limit: number): string {
  return String(value ?? "").replace(/\s+/g, " ").trim().slice(0, limit);
}

/**
 * A timestamp, which is not a count.
 *
 * `sentAt` went through safeCount at first, whose ceiling of a hundred million
 * is right for a streak and three orders of magnitude below any real epoch
 * millisecond — so every timestamp that ever arrived was silently flattened to
 * 1970. Nothing broke visibly, because nothing on screen reads sentAt: it is
 * carried for a future "their clock says" line, and freshness is judged on the
 * receiving machine's clock instead. It would have broken whenever something
 * did start reading it.
 */
function safeTime(value: unknown): number {
  const n = Number(value);
  if (!Number.isFinite(n) || n < 0) return 0;
  // Year 9999, which is past anything a wrong clock will plausibly claim and
  // short of the values that make date arithmetic misbehave.
  return Math.min(Math.floor(n), 253_402_300_799_000);
}

/**
 * Parse what arrived, or refuse it.
 *
 * The sender is another copy of this app, which is exactly why this cannot
 * assume it is: a peer connection is reachable by anything that speaks
 * WebRTC. So the payload is rebuilt field by field from the wire rather than
 * spread into the store, and a message that does not produce a usable profile
 * is dropped rather than half-applied.
 */
export function readFriendProfile(input: unknown): FriendProfile | null {
  if (!input || typeof input !== "object") return null;
  const raw = input as Record<string, unknown>;
  if (raw.v !== 1) return null;
  const code = safeText(raw.code, 32).toUpperCase().replace(/[^A-Z0-9]/g, "");
  const name = safeText(raw.name, MAX_NAME);
  if (!code || !name) return null;
  return {
    v: 1,
    code,
    name,
    level: safeText(raw.level, MAX_LEVEL),
    streak: safeCount(raw.streak),
    totalXp: safeCount(raw.totalXp),
    learningDays: safeCount(raw.learningDays),
    sentAt: safeTime(raw.sentAt),
  };
}

export function readFriendMessage(input: unknown): FriendMessage | null {
  if (!input || typeof input !== "object") return null;
  const raw = input as Record<string, unknown>;
  if (raw.type === "pair-declined") return { type: "pair-declined" };
  if (raw.type !== "profile" && raw.type !== "pair-request" && raw.type !== "pair-accepted") return null;
  const profile = readFriendProfile(raw.profile);
  if (!profile) return null;
  return { type: raw.type, profile };
}

/** The initials the avatar shows, from whatever name arrived. */
export function initialsFor(name: string): string {
  const parts = String(name ?? "").trim().split(/\s+/).filter(Boolean);
  if (!parts.length) return "?";
  if (parts.length === 1) return parts[0].slice(0, 1).toUpperCase();
  return (parts[0].slice(0, 1) + parts[parts.length - 1].slice(0, 1)).toUpperCase();
}
