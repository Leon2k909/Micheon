import React, { useEffect, useRef, useState } from "react";
import { Volume2 } from "lucide-react";
import { ui } from "@/lib/i18n";
import { cn } from "@/lib/utils";
import { tts } from "@/lib/voice";
import { germanWordGloss } from "@/lib/germanWordGloss";
import { englishWordGloss } from "@/lib/englishWordGloss";
import { addCustomEntries, getCustomPacks } from "@/lib/customContent";
import { pronounNote } from "@/lib/pronounNotes";

/**
 * A sentence you can take apart a word at a time.
 *
 * Tap a word to hear it on its own; rest on it and a popover gives the
 * meaning, a pronoun note where one helps, and the two things a learner
 * actually wants next — hear it again, or keep it. Reading a line you nearly
 * understand and being stuck on one word is the most common way to stall, and
 * both ways out are bad: give up on the line, or leave the app for a
 * dictionary. This answers it in place and leaves the rest of the sentence to
 * be worked out, which is the part that teaches.
 *
 * It lives here rather than in the lesson because every surface that shows a
 * German sentence wants it — the lesson, Listen, and the passages — and a
 * second copy would drift. A plain tooltip was tried in Listen first and was
 * the wrong thing: it could tell you what a word meant and then leave you with
 * nowhere to put it.
 */
export function TappableSentence({ text, lang, meaningText, glosses, onWordAudio }: {
  text: string;
  lang: string;
  meaningText?: string;
  /**
   * Meanings this particular line decides, which beat the word lookup. The
   * word bank knows words, not sentences — it answers "age" for Alter, right
   * about the noun and wrong about a message that opens with it.
   */
  glosses?: Record<string, string>;
  /**
   * Called just before a word is spoken. Listen passes its pause here, so
   * tapping a word does not talk over the loop that is already running.
   */
  onWordAudio?: () => void;
}) {
  const words = String(text ?? "").trim().split(/\s+/).filter(Boolean);
  // Hover glosses translate toward the learner's helper language: German
  // text shows English meanings, and English text (learn-English mode) shows
  // German ones — the popover must not be a German-course-only feature.
  const glossLang = lang.toLowerCase().startsWith("de") ? ("de" as const)
    : lang.toLowerCase().startsWith("en") ? ("en" as const)
      : null;
  const showEnglishGloss = glossLang === "de";
  const [playingIndex, setPlayingIndex] = useState<number | null>(null);
  const playingTimer = useRef<number | undefined>(undefined);
  const [popoverIndex, setPopoverIndex] = useState<number | null>(null);
  const [popoverSaved, setPopoverSaved] = useState(false);
  const openTimer = useRef<number | undefined>(undefined);
  const closeTimer = useRef<number | undefined>(undefined);

  useEffect(() => () => {
    if (playingTimer.current) window.clearTimeout(playingTimer.current);
    if (openTimer.current) window.clearTimeout(openTimer.current);
    if (closeTimer.current) window.clearTimeout(closeTimer.current);
  }, []);

  const bareWord = (word: string) => word.replace(/[.,!?;:"«»„“()]/g, "");

  const wordIsSaved = (word: string) => {
    // Custom entries keep German in `de` in both directions, so an English
    // word saved from learn-English mode lives on the `en` side.
    if (glossLang === "en") {
      const key = bareWord(word).toLocaleLowerCase("en-GB");
      return getCustomPacks().some((pack) =>
        pack.entries.some((entry) => entry.en.toLocaleLowerCase("en-GB") === key)
      );
    }
    const key = bareWord(word).toLocaleLowerCase("de-DE");
    return getCustomPacks().some((pack) =>
      pack.entries.some((entry) => entry.de.toLocaleLowerCase("de-DE") === key)
    );
  };

  const openPopover = (index: number) => {
    if (closeTimer.current) window.clearTimeout(closeTimer.current);
    setPopoverIndex(index);
    setPopoverSaved(wordIsSaved(words[index]));
  };

  const scheduleOpen = (index: number) => {
    if (!glossLang) return;
    if (openTimer.current) window.clearTimeout(openTimer.current);
    if (closeTimer.current) window.clearTimeout(closeTimer.current);
    openTimer.current = window.setTimeout(() => openPopover(index), 320);
  };

  const scheduleClose = () => {
    if (openTimer.current) window.clearTimeout(openTimer.current);
    closeTimer.current = window.setTimeout(() => setPopoverIndex(null), 240);
  };

  const cancelClose = () => {
    if (closeTimer.current) window.clearTimeout(closeTimer.current);
  };

  const practiseWord = (word: string) => {
    const face = bareWord(word);
    if (!face) return;
    if (glossLang === "en") {
      // Learn-English mode: the hovered word is English, so the German gloss
      // fills `de` — the store keeps German in `de` in both directions, and
      // the lesson-direction swap flips the card back at practice time. Only
      // the first gloss alternative becomes the card's German side; without a
      // reviewed translation nothing is saved.
      const de = (englishWordGloss(face) || "").split(" / ")[0].trim();
      if (!de) return;
      addCustomEntries([{ de, en: face, use: text }]);
    } else {
      const en = germanWordGloss(face) || meaningText || "";
      if (!en) return;
      addCustomEntries([{ de: face, en, use: text }]);
    }
    setPopoverSaved(true);
  };

  const playWord = (word: string, index: number) => {
    const spokenWord = word.replace(/[.,!?;:"«»„“]/g, "");
    if (!spokenWord) return;
    if (playingTimer.current) window.clearTimeout(playingTimer.current);
    onWordAudio?.();
    setPlayingIndex(index);
    tts(spokenWord, 0.82, lang);
    playingTimer.current = window.setTimeout(
      () => setPlayingIndex(null),
      Math.min(1600, 800 + spokenWord.length * 45)
    );
  };

  const copySelectionWithSpaces = (event: React.ClipboardEvent<HTMLSpanElement>) => {
    const selection = window.getSelection();
    if (!selection || selection.isCollapsed || selection.rangeCount === 0) return;

    const range = selection.getRangeAt(0);
    const selectedWords = Array.from(
      event.currentTarget.querySelectorAll<HTMLElement>(".fs-word")
    ).filter((word) => {
      try {
        return range.intersectsNode(word);
      } catch {
        return false;
      }
    });
    if (selectedWords.length === 0) return;

    // Flex gaps and adjacent interactive words are visual spacing only, so the
    // browser may omit them (or insert line breaks) when copying. Rebuild a
    // normal sentence for multi-word selections and normalize a single word.
    const copiedText = selectedWords.length > 1
      ? selectedWords.map((word) => word.textContent?.trim()).filter(Boolean).join(" ")
      : selection.toString().replace(/\s+/g, " ").trim();
    if (!copiedText) return;

    event.preventDefault();
    event.clipboardData.setData("text/plain", copiedText);
  };

  return (
    <span className="fs-tappable-sentence" onCopy={copySelectionWithSpaces}>
      {words.map((w, i) => {
        // A capital anywhere but the opening word is German saying "noun" —
        // without the hint, Krieg glosses as "get / manage" and Stelle as
        // "stand something up", from their lowercase verb twins.
        // A line's own glossary wins where it has an answer — it knows which
        // sense is meant here, which a word-level lookup cannot.
        const lineGloss = glosses?.[w]
          ?? glosses?.[bareWord(w)]
          ?? glosses?.[bareWord(w).toLocaleLowerCase("de-DE")];
        const hoverGloss = lineGloss
          ?? (glossLang === "de"
            ? germanWordGloss(w, { midSentenceCapital: i > 0 && /^\p{Lu}/u.test(w) })
            : glossLang === "en" ? englishWordGloss(w)
              : null);
        const popoverOpen = popoverIndex === i;
        // In learn-English mode the sentence meaning is German prose — it can
        // caption the popover but must never become a one-word card's back.
        const practiceMeaning = glossLang === "en" ? (hoverGloss || "") : (hoverGloss || meaningText || "");
        return (
          <React.Fragment key={`${w}-${i}`}>
            {i > 0 && " "}
            <span
              className="fs-word-anchor"
              onPointerEnter={() => scheduleOpen(i)}
              onPointerLeave={scheduleClose}
            >
              <span
                role="button"
                tabIndex={0}
                className={cn("fs-word", playingIndex === i && "is-playing", popoverOpen && "has-popover")}
                onClick={() => {
                  if (window.getSelection()?.toString().trim()) return;
                  playWord(w, i);
                }}
                onKeyDown={(event) => {
                  if (event.key !== "Enter" && event.key !== " ") return;
                  event.preventDefault();
                  playWord(w, i);
                }}
                onContextMenu={(event) => {
                  if (!glossLang) return;
                  event.preventDefault();
                  openPopover(i);
                }}
                aria-label={hoverGloss
                  ? `${w}: ${hoverGloss}. ${ui("Tap a word to hear it")}`
                  : `${ui("Hear it")}: ${w}`}
                data-gloss={hoverGloss ?? undefined}
                title={hoverGloss ? undefined : ui("Tap a word to hear it")}
              >
                {w}
              </span>
              {popoverOpen && (
                <span
                  className="fs-word-popover"
                  onPointerEnter={cancelClose}
                  onPointerLeave={scheduleClose}
                  role="group"
                  aria-label={`${bareWord(w)}`}
                >
                  <span className="fs-word-popover-word">{bareWord(w)}</span>
                  {hoverGloss && <span className="fs-word-popover-gloss">{hoverGloss}</span>}
                  {(() => {
                    const note = showEnglishGloss ? pronounNote(bareWord(w)) : null;
                    return note ? <span className="fs-word-popover-note">{note}</span> : null;
                  })()}
                  <span className="fs-word-popover-actions">
                    <button className="fs-word-popover-btn" onClick={() => playWord(w, i)} type="button">
                      <Volume2 aria-hidden="true" className="h-3.5 w-3.5" />
                      {ui("Hear it")}
                    </button>
                    {practiceMeaning && (popoverSaved ? (
                      <span className="fs-word-popover-saved">✓ {ui("In your words")}</span>
                    ) : (
                      <button className="fs-word-popover-btn is-primary" onClick={() => practiseWord(w)} type="button">
                        + {ui("Practice this word")}
                      </button>
                    ))}
                  </span>
                </span>
              )}
            </span>
          </React.Fragment>
        );
      })}
    </span>
  );
}
