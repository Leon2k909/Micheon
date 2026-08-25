import { useCallback, useEffect, useMemo, useState } from "react";
import { Check, Copy, Search, UserPlus, X } from "lucide-react";
import { ui, uiFmt, uiNumber } from "@/lib/i18n";
import { formatFriendCode, getFriendCode, normaliseFriendCode } from "@/lib/friendCode";
import { initialsFor, type FriendProfile } from "@/lib/friendProfile";
import {
  addFriend,
  FRIENDS_EVENT,
  loadFriends,
  presenceFor,
  removeFriend,
  type StoredFriend,
} from "@/lib/friendStore";
import {
  acceptPair,
  broadcastProfile,
  connectToCode,
  declinePair,
  startFriendPeer,
  stopFriendPeer,
  type PairRequest,
  type PeerStatus,
} from "@/lib/friendPeer";

/**
 * The Friends list, with real people in it.
 *
 * What it shows is what the other person's app said about them, sent straight
 * from their computer to this one. Nothing is stored anywhere else and there
 * is no account: two apps introduce themselves through a broker and then talk
 * directly. See friendPeer for what that introduction does and does not
 * involve.
 *
 * Two things this has to get right, because both fail quietly:
 *
 * A friend who is offline still has to appear. Their last figures are kept
 * and shown with when they were last heard from, because a list that empties
 * when somebody closes their laptop reads as "you have no friends" rather
 * than "nobody is online right now".
 *
 * And a stranger has to get nothing. Anyone can reach a peer id, so an
 * incoming request is a question put to the person using the app, never an
 * automatic exchange.
 */
const PRESENCE_LABEL: Record<string, string> = {
  online: "Learning now",
  today: "Active today",
  recent: "Active yesterday",
  away: "Not seen recently",
};

const TONES = ["rose", "blue", "gold", "violet", "green"] as const;

/** Stable per person, so a friend does not change colour when the list moves. */
function toneFor(code: string): string {
  let total = 0;
  for (const character of code) total += character.charCodeAt(0);
  return TONES[total % TONES.length];
}

export function FriendsPanel({
  levelLabel,
  onNotice,
  stats,
  userName,
}: {
  levelLabel: string;
  onNotice: (message: string) => void;
  stats: { streak: number; totalXp: number; learningDays: number };
  userName: string;
}) {
  const [friends, setFriends] = useState<StoredFriend[]>(() => loadFriends());
  const [connected, setConnected] = useState<string[]>([]);
  const [status, setStatus] = useState<PeerStatus>("idle");
  const [statusDetail, setStatusDetail] = useState<string | undefined>(undefined);
  const [requests, setRequests] = useState<PairRequest[]>([]);
  const [query, setQuery] = useState("");
  const [entry, setEntry] = useState("");
  const [copied, setCopied] = useState(false);
  const myCode = useMemo(() => getFriendCode(), []);

  /**
   * Read fresh rather than threaded through: the store is also written by the
   * peer connection, which knows nothing about React.
   */
  useEffect(() => {
    const sync = () => setFriends(loadFriends());
    window.addEventListener(FRIENDS_EVENT, sync);
    return () => window.removeEventListener(FRIENDS_EVENT, sync);
  }, []);

  // Built on every send rather than captured once, so a lesson finished while
  // Friends is open goes out with the new numbers instead of the old ones.
  const profileSource = useCallback((): FriendProfile => ({
    v: 1,
    code: myCode,
    name: userName,
    level: levelLabel,
    streak: stats.streak,
    totalXp: stats.totalXp,
    learningDays: stats.learningDays,
    sentAt: Date.now(),
  }), [levelLabel, myCode, stats.learningDays, stats.streak, stats.totalXp, userName]);

  useEffect(() => {
    let live = true;
    void startFriendPeer(profileSource, {
      onStatus: (next, detail) => { if (live) { setStatus(next); setStatusDetail(detail); } },
      onConnectedChange: (codes) => { if (live) setConnected(codes); },
      onPairRequest: (request) => {
        if (!live) return;
        setRequests((current) => (
          current.some((r) => r.code === request.code) ? current : [...current, request]
        ));
      },
    });
    return () => { live = false; stopFriendPeer(); };
    // Started once. profileSource is read through the closure on every send.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Say hello to everyone once the broker is up, so their figures are current
  // rather than whatever was last seen.
  useEffect(() => {
    if (status !== "online") return;
    for (const friend of friends) connectToCode(friend.code);
    // Only on the transition to online, not on every list change.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status]);

  useEffect(() => { if (status === "online") broadcastProfile(); }, [status, stats.totalXp, stats.streak]);

  const shown = useMemo(() => {
    const needle = query.trim().toLocaleLowerCase();
    if (!needle) return friends;
    return friends.filter((friend) => `${friend.name} ${friend.code}`.toLocaleLowerCase().includes(needle));
  }, [friends, query]);

  const submitCode = () => {
    const clean = normaliseFriendCode(entry);
    if (!clean) { onNotice(ui("That code is not complete. It is twenty letters and numbers.")); return; }
    if (clean === myCode) { onNotice(ui("That is your own code.")); return; }
    if (friends.some((friend) => friend.code === clean)) { onNotice(ui("They are already in your list.")); return; }
    addFriend(clean, formatFriendCode(clean));
    setFriends(loadFriends());
    connectToCode(clean);
    setEntry("");
    onNotice(ui("Asked them to connect. They have to say yes on their side."));
  };

  const answer = (request: PairRequest, yes: boolean) => {
    setRequests((current) => current.filter((r) => r.code !== request.code));
    if (!yes) { declinePair(request.code); return; }
    addFriend(request.code, request.profile.name);
    acceptPair(request.code);
    setFriends(loadFriends());
  };

  const statusLine = status === "online" ? ui("Connected")
    : status === "connecting" ? ui("Connecting…")
    : status === "error" ? (statusDetail ? uiFmt("Not connected: {why}", { why: statusDetail }) : ui("Not connected"))
    : ui("Not connected");

  return (
    <section className="np-social-panel np-friends-panel">
      <div className="np-social-panel-heading">
        <div>
          <span>{ui("Your circle")}</span>
          <h2>{ui("Friends")}</h2>
          <p>{ui("Their figures come straight from their app to yours. There is no account and no server holding them.")}</p>
        </div>
        <span className={`np-friend-net np-friend-net--${status}`}>{statusLine}</span>
      </div>

      {/* Somebody has to go first, so both halves are here: the code to give
          out, and somewhere to put the one you were given. */}
      <div className="np-friend-pairing">
        <div className="np-friend-mycode">
          <small>{ui("Your code")}</small>
          <strong>{formatFriendCode(myCode)}</strong>
          <button
            onClick={() => {
              void navigator.clipboard?.writeText(formatFriendCode(myCode));
              setCopied(true);
              window.setTimeout(() => setCopied(false), 1600);
            }}
            type="button"
          >
            {copied ? <Check aria-hidden="true" /> : <Copy aria-hidden="true" />}
            {copied ? ui("Copied") : ui("Copy")}
          </button>
        </div>
        <form
          className="np-friend-addcode"
          onSubmit={(event) => { event.preventDefault(); submitCode(); }}
        >
          <label>
            <small>{ui("Add by code")}</small>
            <input
              autoComplete="off"
              onChange={(event) => setEntry(event.target.value)}
              placeholder={ui("Paste their code")}
              spellCheck={false}
              value={entry}
            />
          </label>
          <button className="np-social-primary-button" type="submit"><UserPlus aria-hidden="true" /> {ui("Add friend")}</button>
        </form>
      </div>

      {requests.map((request) => (
        <div className="np-friend-request" key={request.code} role="alertdialog">
          <strong>{uiFmt("{name} wants to connect", { name: request.profile.name })}</strong>
          <small>{formatFriendCode(request.code)}</small>
          <div>
            <button onClick={() => answer(request, true)} type="button">{ui("Accept")}</button>
            <button onClick={() => answer(request, false)} type="button">{ui("Decline")}</button>
          </div>
        </div>
      ))}

      {friends.length > 0 && (
        <label className="np-social-search">
          <Search aria-hidden="true" />
          <input
            aria-label={ui("Search friends")}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={ui("Search your friends")}
            type="search"
            value={query}
          />
          {query && <button aria-label={ui("Clear friend search")} onClick={() => setQuery("")} type="button"><X /></button>}
        </label>
      )}

      <div className="np-friend-list">
        {shown.length > 0 ? shown.map((friend) => {
          const isOn = connected.includes(friend.code);
          const presence = presenceFor(friend, isOn);
          return (
            <article className="np-friend-row" key={friend.code}>
              <span aria-hidden="true" className={`np-social-avatar np-social-avatar--${toneFor(friend.code)}`}>
                {initialsFor(friend.profile?.name ?? friend.name)}
              </span>
              <div className="np-friend-identity">
                <strong>{friend.profile?.name ?? friend.name}</strong>
                <span className={`np-social-presence np-social-presence--${presence}`}>
                  <i />{ui(PRESENCE_LABEL[presence])}
                </span>
                <small>{friend.profile?.level ? ui(friend.profile.level) : formatFriendCode(friend.code)}</small>
              </div>
              <div className="np-friend-stat">
                <span>
                  <strong>{uiFmt("{n} days", { n: uiNumber(friend.profile?.streak ?? 0) })}</strong>
                  <small>{ui("Current streak")}</small>
                </span>
              </div>
              <div className="np-friend-stat">
                <span>
                  <strong>{uiFmt("{n} XP", { n: uiNumber(friend.profile?.totalXp ?? 0) })}</strong>
                  <small>{ui("Total XP")}</small>
                </span>
              </div>
              <button
                className="np-social-secondary-button"
                onClick={() => { removeFriend(friend.code); setFriends(loadFriends()); }}
                type="button"
              >
                <X aria-hidden="true" /><span>{ui("Remove")}</span>
              </button>
            </article>
          );
        }) : (
          <div className="np-social-empty">
            <UserPlus aria-hidden="true" />
            <strong>{friends.length ? ui("No friend matches that search") : ui("Nobody here yet")}</strong>
            <span>{friends.length
              ? ui("Try another name or clear the search.")
              : ui("Send someone your code, or paste theirs above.")}</span>
            {friends.length > 0 && <button onClick={() => setQuery("")} type="button">{ui("Clear search")}</button>}
          </div>
        )}
      </div>
    </section>
  );
}
