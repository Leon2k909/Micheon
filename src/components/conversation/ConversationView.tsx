import { useCallback, useEffect, useMemo, useState } from "react";
import { ArrowLeft, Check, Eye, EyeOff, MessageSquareText, RotateCcw, Volume2, X } from "lucide-react";
import { ui, uiFmt, uiNumber } from "@/lib/i18n";
import { cn } from "@/lib/utils";
import {
  buildScenarios,
  learnerLines,
  replyOptions,
  type Scenario,
  type ScenarioTurn,
} from "@/lib/conversationScenarios";
import { tts, stopTts } from "@/lib/voice";
import { courseSides } from "@/lib/courseLanguages";
import {
  CONVERSATION_TRANSLATION_EVENT,
  getConversationTranslationHidden,
  setConversationTranslationHidden,
} from "@/lib/conversationTranslation";
import { MuteButton } from "@/components/MuteButton";

/**
 * Conversation — somebody talks to you, and you answer.
 *
 * The rest of the app teaches a phrase on its own. You can finish a lesson
 * able to recite "Ja, ich suche Wasser." and still say nothing when a cashier
 * asks "Kann ich Ihnen helfen?", because the phrase was never attached to the
 * moment that calls for it. This attaches it.
 *
 * Every scenario is an authored dialogue from the course — nothing here is
 * invented. The other side's turns are given and spoken; yours are chosen from
 * four, one of which is what the dialogue says next. Getting it right does not
 * score a point, it continues the conversation, which is the reward a
 * conversation has anyway.
 */
export function ConversationView({ apiParts }: { apiParts?: Record<string, unknown> }) {
  const scenarios = useMemo(
    () => buildScenarios((apiParts ?? {}) as Record<string, any>),
    [apiParts]
  );
  const pool = useMemo(() => learnerLines(scenarios), [scenarios]);

  const [openId, setOpenId] = useState<string | null>(null);
  /** How far through the script we are. Their turns play; yours wait. */
  const [at, setAt] = useState(0);
  const [wrong, setWrong] = useState<string[]>([]);
  const [missteps, setMissteps] = useState(0);
  const [query, setQuery] = useState("");
  /**
   * Whether the meaning line under each turn is shown.
   *
   * Read from the stored preference rather than defaulting, and kept in step
   * with the event, because the same setting can be changed from another
   * window — and a scene showing the translation while the setting says hide
   * would look like the button had not worked.
   */
  const [translationHidden, setTranslationHidden] = useState(getConversationTranslationHidden);
  useEffect(() => {
    const sync = () => setTranslationHidden(getConversationTranslationHidden());
    window.addEventListener(CONVERSATION_TRANSLATION_EVENT, sync);
    return () => window.removeEventListener(CONVERSATION_TRANSLATION_EVENT, sync);
  }, []);

  const scenario = scenarios.find((s) => s.id === openId) ?? null;

  // The line on top is whichever language the course teaches — see
  // buildScenarios, which puts it there. The voice has to follow it.
  const sides = courseSides();
  const say = useCallback((text: string) => {
    if (!text) return;
    // tts() is the one door to the mixer: it checks the master and per-language
    // volumes itself, so this needs no mute logic of its own.
    void tts(text, 0.9, sides.target.voice);
  }, [sides.target.voice]);

  const open = useCallback((next: Scenario) => {
    stopTts();
    setOpenId(next.id);
    setAt(0);
    setWrong([]);
    setMissteps(0);
    const first = next.turns[0];
    if (first?.side === "them") say(first.de);
  }, [say]);

  const leave = useCallback(() => {
    stopTts();
    setOpenId(null);
  }, []);

  /**
   * Advance past their turns automatically.
   *
   * Their lines are not a question, so stopping on them would be asking the
   * learner to press Next to hear somebody else talk. Yours are where it
   * waits.
   */
  const advanceFrom = useCallback((from: number, turns: ScenarioTurn[]) => {
    let next = from;
    while (next < turns.length && turns[next].side === "them") {
      say(turns[next].de);
      next += 1;
    }
    setAt(next);
  }, [say]);

  const choose = useCallback((option: ScenarioTurn, answer: ScenarioTurn) => {
    if (!scenario) return;
    if (option.de !== answer.de) {
      setWrong((current) => (current.includes(option.de) ? current : [...current, option.de]));
      setMissteps((n) => n + 1);
      return;
    }
    say(answer.de);
    setWrong([]);
    advanceFrom(at + 1, scenario.turns);
  }, [advanceFrom, at, say, scenario]);

  // ── the list ───────────────────────────────────────────────────────────────
  if (!scenario) {
    const needle = query.trim().toLocaleLowerCase();
    const shown = needle
      ? scenarios.filter((s) => `${s.title} ${s.setting ?? ""}`.toLocaleLowerCase().includes(needle))
      : scenarios;
    return (
      <div className="mx-auto w-full max-w-5xl space-y-4">
        <section className="card p-5">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div className="min-w-0">
              <h2 className="text-xl font-black tracking-tight text-[var(--text-1)]">
                {ui("Conversation")}
              </h2>
              <p className="mt-1 max-w-xl text-sm font-semibold leading-6 text-[var(--text-3)]">
                {ui("Somebody says something to you and you choose what to say back. Every scene is a real conversation from the course, played one turn at a time.")}
              </p>
            </div>
            <span className="shrink-0 rounded-full bg-[var(--surface-2)] px-3 py-1.5 text-xs font-black text-[var(--text-3)]">
              {uiFmt("{n} scenes", { n: uiNumber(scenarios.length) })}
            </span>
          </div>
          <label className="mt-4 flex h-11 items-center gap-2 rounded-xl border border-[var(--border)] bg-[var(--surface-2)] px-3">
            <MessageSquareText className="h-4 w-4 shrink-0 text-[var(--text-3)]" aria-hidden="true" />
            <input
              className="min-w-0 flex-1 bg-transparent text-sm font-bold text-[var(--text-1)] outline-none"
              onChange={(event) => setQuery(event.target.value)}
              placeholder={ui("Search")}
              value={query}
            />
          </label>
        </section>

        <section className="grid gap-3 sm:grid-cols-2">
          {shown.slice(0, 60).map((entry) => (
            <button
              className="card p-4 text-left transition-colors hover:border-[var(--accent)]"
              key={entry.id}
              onClick={() => open(entry)}
              type="button"
            >
              <p className="text-sm font-black text-[var(--text-1)]">{entry.title}</p>
              <p className="mt-1 text-xs font-bold text-[var(--text-3)]">
                {uiFmt("{n} turns · you speak {mine}", {
                  n: uiNumber(entry.turns.length),
                  mine: uiNumber(entry.turns.filter((t) => t.side === "you").length),
                })}
                {entry.level ? ` · ${entry.level}` : ""}
              </p>
              <p className="mt-2 line-clamp-2 text-xs font-semibold leading-5 text-[var(--text-3)]" lang={sides.target.htmlLang}>
                {entry.turns[0]?.de}
              </p>
            </button>
          ))}
        </section>
      </div>
    );
  }

  // ── one conversation ───────────────────────────────────────────────────────
  const done = at >= scenario.turns.length;
  const current = done ? null : scenario.turns[at];
  const options = current && current.side === "you"
    ? replyOptions(current, pool, 4, at)
    : [];

  return (
    <div className="mx-auto w-full max-w-3xl space-y-4">
      <section className="card p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <button
            className="inline-flex h-9 items-center gap-2 rounded-xl bg-[var(--surface-2)] px-3.5 text-xs font-black text-[var(--text-2)] transition-colors hover:bg-[var(--surface-3)] hover:text-[var(--text-1)]"
            onClick={leave}
            type="button"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            {ui("All scenes")}
          </button>
          <div className="flex items-center gap-2">
            {missteps > 0 && (
              <span className="conversation-missteps">
                <X aria-hidden="true" className="h-3.5 w-3.5" />
                {uiNumber(missteps)}
              </span>
            )}
            {/* The icon is the state, the label is what pressing it does —
                the same way the mute control beside it reads. */}
            <button
              aria-pressed={translationHidden}
              className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-xl border border-[var(--border)] bg-[var(--surface-2)] text-[var(--text-2)] transition-colors hover:bg-[var(--surface-3)] hover:text-[var(--text-1)]"
              data-testid="conversation-translation-toggle"
              aria-label={translationHidden ? ui("Show the translation") : ui("Hide the translation")}
              onClick={() => setConversationTranslationHidden(!translationHidden)}
              title={translationHidden ? ui("Show the translation") : ui("Hide the translation")}
              type="button"
            >
              {translationHidden
                ? <EyeOff aria-hidden="true" className="h-3.5 w-3.5" />
                : <Eye aria-hidden="true" className="h-3.5 w-3.5" />}
            </button>
            <MuteButton
              className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-xl border border-[var(--border)] bg-[var(--surface-2)] text-[var(--text-2)] transition-colors hover:bg-[var(--surface-3)]"
              iconClassName="h-3.5 w-3.5"
            />
          </div>
        </div>

        <h2 className="mt-4 text-lg font-black text-[var(--text-1)]">{scenario.title}</h2>
        {scenario.setting && (
          <p className="mt-1 text-xs font-semibold leading-5 text-[var(--text-3)]">{scenario.setting}</p>
        )}

        {/* What has been said so far, so the conversation reads as one thing
            rather than a series of unrelated questions. */}
        <div className="conversation-script mt-4">
          {scenario.turns.slice(0, at).map((turn, index) => (
            <div
              className={cn("conversation-line", turn.side === "you" && "is-you")}
              key={`${turn.de}-${index}`}
            >
              <button
                aria-label={ui("Hear it")}
                className="conversation-line__play"
                onClick={() => say(turn.de)}
                type="button"
              >
                <Volume2 className="h-3 w-3" aria-hidden="true" />
              </button>
              <div className="min-w-0">
                <p className="conversation-line__de" lang={sides.target.htmlLang}>{turn.de}</p>
                {!translationHidden && <p className="conversation-line__en">{turn.en}</p>}
              </div>
            </div>
          ))}
        </div>

        {done ? (
          <div className="mt-5 text-center">
            <p className="text-sm font-black text-[var(--success-text)]">
              <Check className="mr-1 inline h-4 w-4" aria-hidden="true" />
              {missteps === 0
                ? ui("Straight through, no wrong turns.")
                : uiFmt("Got there — {n} wrong turns on the way.", { n: uiNumber(missteps) })}
            </p>
            <div className="mt-3 flex flex-wrap justify-center gap-2">
              <button className="accent-btn inline-flex h-10 items-center gap-2 px-4 text-sm" onClick={() => open(scenario)} type="button">
                <RotateCcw className="h-4 w-4" />
                {ui("Again")}
              </button>
              <button
                className="inline-flex h-10 items-center gap-2 rounded-xl border border-[var(--border)] bg-[var(--surface-2)] px-4 text-sm font-black text-[var(--text-1)] transition-colors hover:bg-[var(--surface-3)]"
                onClick={leave}
                type="button"
              >
                {ui("Another scene")}
              </button>
            </div>
          </div>
        ) : current?.side === "you" ? (
          <div className="mt-5">
            <p className="text-center text-xs font-black uppercase tracking-wide text-[var(--text-3)]">
              {ui("What do you say?")}
            </p>
            <div className="mt-3 grid gap-2.5 sm:grid-cols-2">
              {options.map((option) => (
                <button
                  className={cn(
                    "conversation-option",
                    wrong.includes(option.de) && "is-wrong"
                  )}
                  disabled={wrong.includes(option.de)}
                  key={option.de}
                  lang="de"
                  onClick={() => choose(option, current)}
                  type="button"
                >
                  {option.de}
                </button>
              ))}
            </div>
            {wrong.length > 0 && (
              <p className="mt-3 text-center text-xs font-bold text-[var(--text-3)]">
                {ui("Not that one — read what they said again.")}
              </p>
            )}
          </div>
        ) : (
          <div className="mt-5 text-center">
            <button className="accent-btn inline-flex h-10 items-center gap-2 px-4 text-sm" onClick={() => advanceFrom(at, scenario.turns)} type="button">
              {ui("Start")}
            </button>
          </div>
        )}
      </section>
    </div>
  );
}
