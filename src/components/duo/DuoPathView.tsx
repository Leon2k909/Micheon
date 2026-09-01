import { ChevronRight, Layers, MessagesSquare, Play, Rocket } from "lucide-react";
import { ui, uiFmt } from "@/lib/i18n";

/**
 * Four ways to start, side by side.
 *
 * Continue learning hands you the next thing you should see. It is efficient
 * and it is opaque — you cannot tell where you are, what this unit is called,
 * or what comes after it. The answer to that question used to be a path drawn
 * underneath these cards, and it is not here any more: it was a second picture
 * of the same catalogue the lesson list already shows, so it moved into
 * Lessons as a view of it. Two screens of one course is how the two drift.
 *
 * The fast track answers a different question again: not where am I in the
 * course, but what do I need to hold a conversation. The curriculum has the
 * rooms of a house and the things on a desk in it, and somebody who wants to
 * talk to a person this month should not have to walk past them.
 *
 * The third is not a drill at all — it opens Conversation, which is a screen
 * of its own now that it holds both halves of understanding somebody.
 */
export function DuoPathView({
  onGuidedSession,
  onFastTrack,
  onConversation,
  onTopicRound,
  lessonsCompleted,
}: {
  onGuidedSession: () => void;
  onFastTrack: () => void;
  /**
   * Opens Conversation, which is a destination of its own now.
   *
   * It used to render here behind a `conversing` flag with a hand-rolled back
   * button, while the reading half of the same idea sat in the sidebar as
   * Passages. The two are one screen now, so this card points at it rather
   * than keeping a second copy of it inside Learn.
   */
  onConversation: () => void;
  /**
   * Opens the topic round, which stays inside Learn: it is one of the ways
   * in rather than a destination, so it needs no row in the sidebar.
   */
  onTopicRound: () => void;
  lessonsCompleted: number;
}) {
  return (
    <div className="space-y-4">
      {/*
        The ways in, side by side.

        Four of them now: the quick path came out for being a second teacher
        of one course, the fast track went in beside Continue learning, the
        Matcher moved to Games — it grades nothing, so sitting among the ways
        to LEARN overstated what it does — and the topic round came in, which
        asks the one question none of the others do: not what a phrase means,
        but what you have for a subject. The widest row has to seat them all,
        or whichever was added last sits alone underneath.
      */}
      <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <button
          type="button"
          onClick={onGuidedSession}
          className="card card-hover flex flex-col items-start gap-3 p-5 text-left"
        >
          <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[var(--accent-dim)] text-[var(--accent)]">
            <Play className="h-5 w-5" />
          </span>
          <span>
            <span className="block text-[11px] font-black uppercase tracking-wide text-[var(--text-3)]">
              {ui("Guided session")}
            </span>
            <strong className="mt-1 block text-lg font-black tracking-tight text-[var(--text-1)]">
              {ui("Continue learning")}
            </strong>
            <span className="mt-1 block text-xs font-semibold leading-5 text-[var(--text-3)]">
              {uiFmt("Lesson {n}. Seven stages on one phrase at a time — read, choose, type, translate, recall.", { n: lessonsCompleted + 1 })}
            </span>
          </span>
          <span className="mt-auto inline-flex items-center gap-1 pt-2 text-xs font-black text-[var(--accent)]">
            {ui("Start")} <ChevronRight className="h-3.5 w-3.5" />
          </span>
        </button>

        {/*
          The second way in, and the one that skips the rest of the course.
          Continue learning walks the curriculum in order, which is right for
          somebody working through it and slow for somebody who wants to talk
          to a person this month — the order has the rooms of a house and the
          things on a desk in it. This draws on the conversational packs only:
          greetings, repairing a conversation, reacting, plans, then family,
          food, money, health. Same seven stages, much smaller course.
        */}
        <button
          type="button"
          onClick={onFastTrack}
          className="card card-hover flex flex-col items-start gap-3 p-5 text-left"
        >
          <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[var(--accent-dim)] text-[var(--accent)]">
            <Rocket className="h-5 w-5" />
          </span>
          <span>
            <span className="block text-[11px] font-black uppercase tracking-wide text-[var(--text-3)]">
              {ui("Fast track")}
            </span>
            <strong className="mt-1 block text-lg font-black tracking-tight text-[var(--text-1)]">
              {ui("Straight to talking")}
            </strong>
            <span className="mt-1 block text-xs font-semibold leading-5 text-[var(--text-3)]">
              {ui("Only what a conversation needs — greetings, reactions, plans, family, food. No rooms, no furniture.")}
            </span>
          </span>
          <span className="mt-auto inline-flex items-center gap-1 pt-2 text-xs font-black text-[var(--accent)]">
            {ui("Start")} <ChevronRight className="h-3.5 w-3.5" />
          </span>
        </button>

        {/*
          The third: a conversation rather than a drill. The other two teach a
          phrase; this one puts somebody in front of you saying something and
          asks what you say back, which is the only one of the three that is
          about knowing WHEN to use what you know — and, on the same screen,
          somebody writing to you and you saying what they meant.
        */}
        <button
          type="button"
          onClick={onConversation}
          className="card card-hover flex flex-col items-start gap-3 p-5 text-left"
        >
          <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[var(--accent-dim)] text-[var(--accent)]">
            <MessagesSquare className="h-5 w-5" />
          </span>
          <span>
            <span className="block text-[11px] font-black uppercase tracking-wide text-[var(--text-3)]">
              {ui("Conversation")}
            </span>
            <strong className="mt-1 block text-lg font-black tracking-tight text-[var(--text-1)]">
              {ui("Say something back")}
            </strong>
            <span className="mt-1 block text-xs font-semibold leading-5 text-[var(--text-3)]">
              {ui("A shop, a station, a doctor — they speak, you choose your reply, one turn at a time.")}
            </span>
          </span>
          <span className="mt-auto inline-flex items-center gap-1 pt-2 text-xs font-black text-[var(--accent)]">
            {ui("Start")} <ChevronRight className="h-3.5 w-3.5" />
          </span>
        </button>

        {/*
          The fourth asks the question the other way round. Every other way in
          hands you a phrase and asks about it; a conversation hands you a
          SUBJECT and asks what you have for it. A board of the language goes
          up under a subject like family or food, half of it belonging and
          half from somewhere else, and you pick out what you would use.
          Nothing typed, nothing graded — a board a minute.
        */}
        <button
          type="button"
          onClick={onTopicRound}
          className="card card-hover flex flex-col items-start gap-3 p-5 text-left"
        >
          <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[var(--accent-dim)] text-[var(--accent)]">
            <Layers className="h-5 w-5" />
          </span>
          <span>
            <span className="block text-[11px] font-black uppercase tracking-wide text-[var(--text-3)]">
              {ui("Topic round")}
            </span>
            <strong className="mt-1 block text-lg font-black tracking-tight text-[var(--text-1)]">
              {ui("Words for a subject")}
            </strong>
            <span className="mt-1 block text-xs font-semibold leading-5 text-[var(--text-3)]">
              {ui("A subject like family or food — pick every word and phrase you'd use for it, then see what you missed.")}
            </span>
          </span>
          <span className="mt-auto inline-flex items-center gap-1 pt-2 text-xs font-black text-[var(--accent)]">
            {ui("Start")} <ChevronRight className="h-3.5 w-3.5" />
          </span>
        </button>
      </section>
    </div>
  );
}
