import { useEffect, useState } from "react";
import { INTERFACE_LANGUAGE_CHANGE_EVENT, resolveInterfaceLanguage } from "@/lib/interfaceLanguage";
import {
  formatRussianText,
  getRussianScript,
  latiniseRussian,
  resolveRussianScript,
  russianScriptShows,
  russianSecondLine,
  RUSSIAN_SCRIPT_EVENT,
} from "@/lib/russianScript";
import {
  formatGreekText,
  getGreekScript,
  greekScriptShows,
  greekSecondLine,
  latiniseGreek,
  resolveGreekScript,
  GREEK_SCRIPT_EVENT,
} from "@/lib/greekScript";

/**
 * The courses written in an alphabet of their own, read through one door.
 *
 * Russian cards are stored in Cyrillic and Greek cards in Greek, and each may
 * be SHOWN in Latin letters — by its own setting and its own transcription,
 * in russianScript.ts and greekScript.ts. Everything that puts course text on
 * the screen asks here rather than there. The Russian switch was wired one
 * screen at a time, each branching on "ru", and the screens nobody thought of
 * kept showing Cyrillic whatever was chosen; a second alphabet made that a
 * hunt through the lesson twice over. One question — which course is this,
 * and what does its learner read? — answered in one place.
 *
 * Nothing here is stored. The stored text stays in its own alphabet, and so
 * everything that hangs off it does too: the voice, the grading, the saved
 * words, the progress.
 */
type ScriptedCourse = "ru" | "el";

function scriptedCourse(code: string | null | undefined): ScriptedCourse | null {
  const lower = String(code ?? "").toLowerCase();
  if (lower.startsWith("ru")) return "ru";
  if (lower.startsWith("el")) return "el";
  return null;
}

/** A line of course text as the eye reads it. Every other course's text comes back untouched. */
export function showCourseText(code: string | null | undefined, text: string): string {
  switch (scriptedCourse(code)) {
    case "ru": return formatRussianText(text, getRussianScript());
    case "el": return formatGreekText(text, getGreekScript());
    default: return text;
  }
}

/** The transcription printed under a line on the both setting, or null. */
export function courseTextSecondLine(code: string | null | undefined, text: string): string | null {
  switch (scriptedCourse(code)) {
    case "ru": return russianSecondLine(text, getRussianScript());
    case "el": return greekSecondLine(text, getGreekScript());
    default: return null;
  }
}

/**
 * Whether the course's own alphabet is on screen.
 *
 * The key row follows this. For Russian and Greek the row is not a helper
 * beside the keyboard but the keyboard itself, and a learner reading Latin
 * letters types them on the keyboard they already have.
 */
export function courseShowsNative(code: string | null | undefined): boolean {
  switch (scriptedCourse(code)) {
    case "ru": return russianScriptShows(resolveRussianScript(getRussianScript()), "cyrillic");
    case "el": return greekScriptShows(resolveGreekScript(getGreekScript()), "greek");
    default: return true;
  }
}

/** Whether Latin letters are on screen for a course that has an alphabet of its own. */
export function courseShowsLatin(code: string | null | undefined): boolean {
  switch (scriptedCourse(code)) {
    case "ru": return russianScriptShows(resolveRussianScript(getRussianScript()), "latin");
    case "el": return greekScriptShows(resolveGreekScript(getGreekScript()), "latin");
    default: return false;
  }
}

/**
 * The Latin letters a line is read in, whatever is on screen — or null when
 * the course has no second alphabet or the line has nothing to transcribe.
 */
export function courseLatinOf(code: string | null | undefined, text: string): string | null {
  const source = String(text ?? "");
  const language = resolveInterfaceLanguage();
  let latin: string;
  switch (scriptedCourse(code)) {
    case "ru": latin = latiniseRussian(source, language); break;
    case "el": latin = latiniseGreek(source, language); break;
    default: return null;
  }
  return latin === source.normalize("NFC") || latin === source ? null : latin;
}

/**
 * The answers a card takes, and on the Latin setting their transcriptions
 * too, without the accents they carry: the learner types what is on screen,
 * and the accents are there to be read, not typed — the grader ignores them.
 */
export function withCourseLatin(code: string | null | undefined, forms: string[]): string[] {
  if (!courseShowsLatin(code)) return forms;
  const latin = forms
    .map((form) => courseLatinOf(code, form))
    .filter((form): form is string => Boolean(form))
    .map((form) => form.normalize("NFD").replace(/\p{Diacritic}/gu, ""));
  return [...forms, ...latin];
}

/**
 * Re-render when what the learner reads changes: either alphabet switch, or
 * the interface language, which chooses the transcription. The answer is a
 * key that changes with each, for a dependency list that has to notice.
 *
 * It exists because the badge on the typing prompt switches the alphabet in
 * the middle of a lesson, and a component that only reads the setting while
 * it renders goes on showing the old alphabet until something else happens
 * to redraw it — the sentence above the box one alphabet, the box's grading
 * another.
 */
export function useCourseScript(): string {
  const read = () => `${getRussianScript()}|${getGreekScript()}|${resolveInterfaceLanguage()}`;
  const [key, setKey] = useState(read);
  useEffect(() => {
    const sync = () => setKey(read());
    window.addEventListener(RUSSIAN_SCRIPT_EVENT, sync);
    window.addEventListener(GREEK_SCRIPT_EVENT, sync);
    window.addEventListener(INTERFACE_LANGUAGE_CHANGE_EVENT, sync);
    return () => {
      window.removeEventListener(RUSSIAN_SCRIPT_EVENT, sync);
      window.removeEventListener(GREEK_SCRIPT_EVENT, sync);
      window.removeEventListener(INTERFACE_LANGUAGE_CHANGE_EVENT, sync);
    };
  }, []);
  return key;
}
