import React, { lazy, Suspense, useState } from "react";
import { MessagesSquare, ScrollText } from "lucide-react";
import { ui } from "@/lib/i18n";
import { cn } from "@/lib/utils";
import { ConversationView } from "@/components/conversation/ConversationView";

const PassagesView = lazy(() =>
  import("@/components/passages/PassagesView").then((module) => ({ default: module.PassagesView }))
);

/** Talking to somebody, or reading what they sent you. */
type ConversationMode = "talking" | "reading";

/**
 * The two halves of understanding somebody, in one place.
 *
 * These shipped as separate destinations and were never two things. Both put
 * real language in front of you and ask you to deal with it: a scenario says
 * something and you choose what you say back; a passage is a message somebody
 * sent you and you say what it means. Neither can be passed by recognising a
 * word — both are about following a whole thought.
 *
 * Kept apart they competed. Passages sat in the sidebar as its own entry while
 * Conversation was a card on the Learn row, so which one you met depended on
 * which door you happened to try, and the pair of them read as two small
 * features rather than the one substantial thing they add up to.
 *
 * The split that remains is the honest one, and it is the medium: spoken at
 * you, or written to you. That is a view of one place, not two places.
 */
export function ConversationAndReading({ apiParts }: { apiParts?: Record<string, unknown> }) {
  /**
   * One landing, not one per door.
   *
   * Both ways in — the sidebar entry and the Learn card — open talking, and
   * reading is the other button. Opening on a different half depending on
   * which door you came through would rebuild the split this merge exists to
   * remove: the screen would be a different screen depending on where you
   * came from, which is the two-features problem wearing one name.
   */
  const [mode, setMode] = useState<ConversationMode>("talking");

  const option = (key: ConversationMode, label: string, Icon: typeof MessagesSquare) => (
    <button
      aria-pressed={mode === key}
      className={cn(
        "inline-flex items-center gap-2 rounded-xl px-3.5 py-2 text-xs font-black transition-colors",
        mode === key
          ? "bg-[var(--accent)] text-[var(--accent-text)]"
          : "text-[var(--text-2)] hover:bg-[var(--surface-3)] hover:text-[var(--text-1)]"
      )}
      onClick={() => setMode(key)}
      type="button"
    >
      <Icon className="h-3.5 w-3.5" />
      {label}
    </button>
  );

  return (
    <div className="space-y-4">
      <div className="inline-flex items-center gap-1 rounded-2xl bg-[var(--surface-2)] p-1">
        {option("talking", ui("Talking"), MessagesSquare)}
        {option("reading", ui("Reading"), ScrollText)}
      </div>

      {mode === "talking" ? (
        <ConversationView apiParts={apiParts} />
      ) : (
        // Lazy because the passages carry their own text and glosses, and
        // somebody who only ever talks should not pay for them.
        <Suspense
          fallback={
            <div className="card flex min-h-[240px] items-center justify-center p-8 text-center">
              <div className="mx-auto h-14 w-14 rounded-2xl skeleton" />
            </div>
          }
        >
          <PassagesView />
        </Suspense>
      )}
    </div>
  );
}
