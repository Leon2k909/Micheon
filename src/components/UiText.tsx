import { Fragment, type ReactNode } from "react";
import { uiParts } from "@/lib/i18n";

/**
 * One translated sentence with markup inside it.
 *
 * A sentence like "{count} more words until you're {fluent}" has a bold number
 * and a bold phrase in the middle. Written as JSX it needs one block per
 * language, and word order differs enough between them that splitting the
 * sentence into fragments and translating those separately produces nonsense —
 * German puts the verb at the end, French puts the adjective after the noun.
 *
 * So the whole sentence stays one dictionary key with named slots, and the
 * values arrive here as nodes rather than strings:
 *
 *   <UiText
 *     text="{count} more words until you're {fluent}."
 *     values={{ count: <b>{n}</b>, fluent: <b>{ui("fully fluent")}</b> }}
 *   />
 *
 * A slot with no value renders as nothing, which is what a translation that
 * drops a slot should do rather than printing "{count}" at someone.
 */
export function UiText({ text, values }: { text: string; values: Record<string, ReactNode> }) {
  return (
    <>
      {uiParts(text).map((part, index) => (
        <Fragment key={index}>{part.kind === "text" ? part.value : values[part.name] ?? null}</Fragment>
      ))}
    </>
  );
}
