import { useCallback, useEffect, useState } from "react";
import { Check, ChevronRight, RotateCcw, Volume2 } from "lucide-react";
import { courseSides } from "@/lib/courseLanguages";
import { ui, uiFmt, uiNumber } from "@/lib/i18n";
import type { UserProfile } from "@/lib/profileStorage";
import {
  advanceTopicIndex,
  buildTopicRound,
  currentTopicIndex,
  gradeTopicRound,
  TOPICS,
  type TopicRound,
} from "@/lib/topicRounds";
import type { Part } from "@/lib/types";
import { cn } from "@/lib/utils";
import { tts } from "@/lib/voice";

/**
 * A subject goes up, a board of the language goes up under it, and the
 * learner picks out everything they would use for that subject.
 *
 * The board shows the language being learned and nothing else until it is
 * checked. That is the whole exercise: a card that said "der Bruder — brother"
 * would be answering its own question. The meanings appear on the check,
 * beside what was found, what was missed and what did not belong, so the
 * round teaches on the way out as well.
 *
 * Nothing here writes a grade. Picking cards with the answers on screen is
 * recognition, and the app keeps recognition passive — see the Matcher for
 * the same line drawn for the same reason.
 */
export function TopicRoundView({
  apiParts,
  catalogueReady,
  profile,
}: {
  apiParts: Record<string, Part>;
  catalogueReady: boolean;
  profile: UserProfile | null;
}) {
  const [topicIndex, setTopicIndex] = useState(() => currentTopicIndex(profile));
  const [round, setRound] = useState<TopicRound | null>(null);
  const [picked, setPicked] = useState<ReadonlySet<string>>(() => new Set());
  const [checked, setChecked] = useState(false);
  const topic = TOPICS[topicIndex] ?? TOPICS[0];
  const sides = courseSides();

  const deal = useCallback(() => {
    setRound(catalogueReady ? buildTopicRound(apiParts, topic.id, profile) : null);
    setPicked(new Set());
    setChecked(false);
  }, [apiParts, catalogueReady, profile, topic.id]);

  useEffect(() => { deal(); }, [deal]);

  const toggle = (id: string) => {
    setPicked((current) => {
      const next = new Set(current);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const nextSubject = () => setTopicIndex(advanceTopicIndex(profile));

  const result = round && checked ? gradeTopicRound(round, picked) : null;

  return (
    <section className="np-topic">
      <header className="np-topic-head">
        <div>
          <span className="np-topic-kicker">{ui("Topic round")}</span>
          <h2>{ui(topic.label)}</h2>
          <p className="np-topic-ask">
            {uiFmt("Which of these would you use when talking about {subject}?", { subject: ui(topic.about) })}
          </p>
          {!checked && <p className="np-topic-hint">{ui("Tap everything that fits, then check.")}</p>}
        </div>
        <span className="np-topic-where">
          {uiFmt("Subject {n} of {total}", { n: uiNumber(topicIndex + 1), total: uiNumber(TOPICS.length) })}
        </span>
      </header>

      {!catalogueReady ? (
        <p className="np-topic-loading">{ui("Getting the course ready…")}</p>
      ) : !round ? (
        <div className="np-topic-foot">
          <p className="np-topic-result">{ui("Nothing to show for this subject in this course yet.")}</p>
          <button className="accent-btn px-5 py-2.5 text-sm" onClick={nextSubject} type="button">
            {ui("Next subject")} <ChevronRight aria-hidden="true" className="ml-1 inline h-4 w-4" />
          </button>
        </div>
      ) : (
        <>
          <div className="np-topic-board">
            {round.cards.map((card) => {
              const isPicked = picked.has(card.id);
              const state = !checked
                ? (isPicked ? "picked" : "idle")
                : card.belongs
                  ? (isPicked ? "found" : "missed")
                  : (isPicked ? "wrong" : "quiet");
              return (
                <button
                  key={card.id}
                  type="button"
                  aria-pressed={checked ? undefined : isPicked}
                  title={checked ? ui("Hear it") : undefined}
                  className={cn("np-topic-card", `is-${state}`)}
                  onClick={() => {
                    if (checked) void tts(card.de, 0.9, sides.target.voice);
                    else toggle(card.id);
                  }}
                >
                  <span className="np-topic-card-de" lang={sides.target.htmlLang}>{card.de}</span>
                  {checked && <span className="np-topic-card-en" lang={sides.meaning.htmlLang}>{card.en}</span>}
                  {checked && state === "missed" && <span className="np-topic-card-tag">{ui("Missed")}</span>}
                  {checked && state === "wrong" && <span className="np-topic-card-tag">{ui("Not this one")}</span>}
                  {checked && <Volume2 aria-hidden="true" className="np-topic-card-speaker" />}
                  {!checked && isPicked && <Check aria-hidden="true" className="np-topic-card-speaker" />}
                </button>
              );
            })}
          </div>

          <footer className="np-topic-foot">
            {result ? (
              <p className="np-topic-result">
                {result.missed.length === 0
                  ? ui("You found them all.")
                  : uiFmt("You found {found} of {total}.", {
                    found: uiNumber(result.found.length),
                    total: uiNumber(round.wanted),
                  })}
                {result.wrong.length > 0
                  ? ` ${uiFmt("{count} didn't belong.", { count: uiNumber(result.wrong.length) })}`
                  : ""}
              </p>
            ) : (
              <span className="np-topic-count">{uiFmt("{count} picked", { count: uiNumber(picked.size) })}</span>
            )}

            <div className="np-topic-actions">
              {checked ? (
                <>
                  <button className="ghost-btn px-4 py-2.5 text-sm" onClick={deal} type="button">
                    <RotateCcw aria-hidden="true" className="mr-1 inline h-4 w-4" /> {ui("Try this subject again")}
                  </button>
                  <button className="accent-btn px-5 py-2.5 text-sm" onClick={nextSubject} type="button">
                    {ui("Next subject")} <ChevronRight aria-hidden="true" className="ml-1 inline h-4 w-4" />
                  </button>
                </>
              ) : (
                <button
                  className="accent-btn px-5 py-2.5 text-sm disabled:opacity-50"
                  disabled={picked.size === 0}
                  onClick={() => setChecked(true)}
                  type="button"
                >
                  {ui("Check")}
                </button>
              )}
            </div>
          </footer>
        </>
      )}
    </section>
  );
}
