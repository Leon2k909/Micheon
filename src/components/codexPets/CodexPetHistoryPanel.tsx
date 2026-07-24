import { Check, Clock3, MessageCircle, X } from "lucide-react";

import type {
  CodexPetAnswer,
  CodexPetSpeech,
} from "@/components/codexPets/CodexPetProvider";
import { cn } from "@/lib/utils";
import { ui, uiLocale } from "@/lib/i18n";

export function CodexPetHistoryPanel({
  history,
  onAnswer,
  onClose,
}: {
  history: CodexPetSpeech[];
  onAnswer: (messageId: string, answer: CodexPetAnswer, announce?: boolean) => void;
  onClose: () => void;
}) {
  const messages = [...history].reverse();

  return (
    <section
      aria-label={ui("Pet message history")}
      aria-modal="true"
      className="pointer-events-auto fixed inset-2 z-[760] flex flex-col overflow-hidden rounded-xl border border-[var(--border-2)] bg-[var(--surface)] text-[var(--text-1)] shadow-[0_20px_60px_rgba(0,0,0,0.34)]"
      role="dialog"
    >
      <header className="flex shrink-0 items-start justify-between gap-3 border-b border-[var(--border)] px-4 py-3">
        <div className="flex items-center gap-3">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-[var(--accent-dim)] text-[var(--accent)]">
            <MessageCircle className="h-4 w-4" />
          </span>
          <div>
            <h2 className="text-sm font-black">{ui("Pet messages")}</h2>
            <p className="text-[11px] font-semibold text-[var(--text-3)]">
              {ui("You can change answers to earlier questions.")}
            </p>
          </div>
        </div>
        <button
          aria-label={ui("Close history")}
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-[var(--text-3)] transition-colors hover:bg-[var(--surface-2)] hover:text-[var(--text-1)]"
          onClick={onClose}
          type="button"
        >
          <X className="h-4 w-4" />
        </button>
      </header>

      <div className="min-h-0 flex-1 overflow-y-auto px-3 py-3">
        {messages.length > 0 ? (
          <div className="grid gap-2.5">
            {messages.map((message) => (
              <article
                className={cn(
                  "rounded-xl border p-3",
                  message.question
                    ? "border-[var(--accent)]/25 bg-[var(--accent-dim)]/55"
                    : "border-[var(--border)] bg-[var(--surface-2)]"
                )}
                key={message.id}
              >
                <div className="flex items-start justify-between gap-3">
                  <p className="text-xs font-bold leading-5 text-[var(--text-1)]">{message.text}</p>
                  <time
                    className="flex shrink-0 items-center gap-1 text-[9px] font-bold text-[var(--text-3)]"
                    dateTime={new Date(message.createdAt).toISOString()}
                  >
                    <Clock3 className="h-2.5 w-2.5" />
                    {new Date(message.createdAt).toLocaleTimeString(uiLocale(), {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </time>
                </div>

                {message.question && (
                  <div className="mt-3 grid grid-cols-2 gap-2">
                    {(["yes", "no"] as CodexPetAnswer[]).map((answer) => {
                      const selected = message.answer === answer;
                      return (
                        <button
                          aria-pressed={selected}
                          className={cn(
                            "flex h-9 items-center justify-center gap-1.5 rounded-lg border text-xs font-black transition-colors",
                            selected
                              ? answer === "yes"
                                ? "border-emerald-500 bg-emerald-500 text-white"
                                : "border-rose-500 bg-rose-500 text-white"
                              : "border-[var(--border-2)] bg-[var(--surface)] text-[var(--text-2)] hover:border-[var(--accent)] hover:text-[var(--text-1)]"
                          )}
                          key={answer}
                          onClick={() => onAnswer(message.id, answer, false)}
                          type="button"
                        >
                          {selected && <Check className="h-3.5 w-3.5" />}
                          {ui(answer === "yes" ? "Yes" : "No")}
                        </button>
                      );
                    })}
                  </div>
                )}
              </article>
            ))}
          </div>
        ) : (
          <div className="flex h-full min-h-32 flex-col items-center justify-center px-6 text-center">
            <MessageCircle className="h-7 w-7 text-[var(--text-3)]" />
            <p className="mt-3 text-sm font-black text-[var(--text-1)]">{ui("No pet messages yet")}</p>
            <p className="mt-1 text-xs font-semibold leading-5 text-[var(--text-3)]">
              {ui("Tips and questions will appear here after the mascot speaks.")}
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
