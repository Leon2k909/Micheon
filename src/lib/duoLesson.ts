import { buildCatalog, type CatalogItem } from "@/session";
import { loadGradeStore, statusForId } from "@/lib/activity";
import { getAuthUser, type UserProfile } from "@/lib/profileStorage";
import { displayMeaning, matchGermanMeaning } from "@/lib/germanTextMatch";

/**
 * A short, fast lesson made of mixed exercises — the other half of the path.
 *
 * The guided session teaches one item thoroughly through seven stages. This
 * does the opposite on purpose: ten quick turns over ten different items, each
 * a different shape, marked instantly. It is the format that makes five spare
 * minutes worth using, and it is why somebody would open this rather than the
 * lesson they already have.
 *
 * It grades into the same store as everything else. A right answer here is
 * worth exactly what a right answer is worth anywhere in the app — otherwise
 * the two modes would drift into two different opinions of what you know.
 */

export type DuoExerciseKind = "choose-en" | "choose-de" | "build" | "type-de" | "listen";

export type DuoExercise = {
  id: string;
  kind: DuoExerciseKind;
  item: CatalogItem;
  /** The sentence shown as the question. */
  prompt: string;
  /** For the choose-* kinds. Exactly one is right. */
  options?: string[];
  answerIndex?: number;
  /** For `build`: the tiles to tap, shuffled, and the order they should end in. */
  tiles?: string[];
  solution?: string[];
  /** For `type-de`: what a typed answer is matched against. */
  target?: string;
};

/** Ten turns. Long enough to be a lesson, short enough to finish standing up. */
export const DUO_LESSON_LENGTH = 10;
/** Duolingo gives five. Losing all of them ends the lesson. */
export const DUO_HEARTS = 5;
/** XP for a completed lesson, plus a bonus for not losing a heart. */
export const DUO_XP_PER_LESSON = 10;
export const DUO_XP_PERFECT_BONUS = 5;

function shuffle<T>(items: T[], random: () => number): T[] {
  const next = [...items];
  for (let index = next.length - 1; index > 0; index -= 1) {
    const swap = Math.floor(random() * (index + 1));
    [next[index], next[swap]] = [next[swap], next[index]];
  }
  return next;
}

/** Words of a sentence, punctuation kept attached so the tiles rebuild it exactly. */
export function duoTiles(sentence: string): string[] {
  return sentence.trim().split(/\s+/).filter(Boolean);
}

/**
 * Which items this lesson should cover.
 *
 * Unknown first, because that is what a lesson is for, then anything graded
 * "struggle", then known items to pad. Padding with known items is deliberate:
 * a ten-question lesson that runs out after four unknown ones would either end
 * early or repeat, and Duolingo's own lessons mix in things you have seen.
 */
export function duoLessonItems(
  catalog: CatalogItem[],
  packKey: string,
  user: UserProfile | null = getAuthUser(),
  random: () => number = Math.random,
  length = DUO_LESSON_LENGTH
): CatalogItem[] {
  const grades = loadGradeStore(user);
  const inPack = catalog.filter((item) => item.partKey === packKey && item.de && item.en);
  const byStatus = { new: [] as CatalogItem[], struggle: [] as CatalogItem[], known: [] as CatalogItem[] };
  for (const item of inPack) byStatus[statusForId(grades, item.id, item.aliases)].push(item);

  const picked = [
    ...shuffle(byStatus.new, random),
    ...shuffle(byStatus.struggle, random),
    ...shuffle(byStatus.known, random),
  ].slice(0, length);
  return picked;
}

/**
 * Three wrong answers that are plausible but not arguable.
 *
 * Drawn from the same pack where possible, so the choices sit in one topic and
 * the exercise tests meaning rather than letting you spot the odd one out. Any
 * distractor matching the right answer is dropped — the catalogue has genuine
 * synonyms in it, and offering two correct options is the one mistake a
 * multiple choice question must never make.
 */
export function duoDistractors(
  item: CatalogItem,
  pool: CatalogItem[],
  side: "en" | "de",
  random: () => number,
  count = 3
): string[] {
  const right = side === "en" ? displayMeaning(item.en) : displayMeaning(item.de);
  const seen = new Set([right.toLocaleLowerCase()]);
  const out: string[] = [];
  const samePack = pool.filter((entry) => entry.partKey === item.partKey && entry.id !== item.id);
  const rest = pool.filter((entry) => entry.partKey !== item.partKey);

  for (const candidate of [...shuffle(samePack, random), ...shuffle(rest, random)]) {
    if (out.length >= count) break;
    const text = side === "en" ? displayMeaning(candidate.en) : displayMeaning(candidate.de);
    const key = text.toLocaleLowerCase();
    if (!text || seen.has(key)) continue;
    seen.add(key);
    out.push(text);
  }
  return out;
}

export function buildDuoLesson(
  apiParts: Record<string, unknown>,
  packKey: string,
  options: { user?: UserProfile | null; random?: () => number; length?: number } = {}
): DuoExercise[] {
  const random = options.random ?? Math.random;
  const user = options.user ?? getAuthUser();
  const length = options.length ?? DUO_LESSON_LENGTH;

  const catalog = buildCatalog(apiParts as Record<string, any>);
  if (catalog.length === 0) return [];
  const items = duoLessonItems(catalog, packKey, user, random, length);
  if (items.length === 0) return [];

  return items.map((item, index) => {
    const german = displayMeaning(item.de);
    const english = displayMeaning(item.en);
    const words = duoTiles(german);

    // The shape rotates rather than being chosen at random, so a lesson can
    // never deal ten of the same kind — which random selection does often
    // enough to be noticed.
    const rotation: DuoExerciseKind[] = ["choose-en", "build", "choose-de", "listen", "type-de"];
    let kind = rotation[index % rotation.length];
    // "Build" needs a sentence to take apart; a single word has nothing to
    // rebuild, so those fall back to recognition.
    if (kind === "build" && words.length < 3) kind = "choose-en";

    const base: DuoExercise = {
      id: `${item.id}-${index}`,
      kind,
      item,
      prompt: kind === "choose-en" || kind === "build" || kind === "listen" ? german : english,
    };

    if (kind === "choose-en") {
      const options = shuffle([english, ...duoDistractors(item, catalog, "en", random)], random);
      return { ...base, options, answerIndex: options.indexOf(english) };
    }
    if (kind === "choose-de" || kind === "listen") {
      const options = shuffle([german, ...duoDistractors(item, catalog, "de", random)], random);
      return { ...base, options, answerIndex: options.indexOf(german) };
    }
    if (kind === "build") {
      return { ...base, solution: words, tiles: shuffle(words, random) };
    }
    return { ...base, target: german };
  });
}

export type DuoTypedResult = {
  ok: boolean;
  /** "Almost — watch the spelling" rather than a flat wrong. */
  note: string | null;
};

/**
 * Whether a typed answer counts, using the matcher the rest of the app uses.
 *
 * It returns more than a yes or no — a near miss can be a typo, a missing
 * capital on a noun, or word order — and that is worth passing through rather
 * than flattening. Accepting the answer while naming the slip is how the app
 * already treats typing elsewhere, and it is what stops a German learner
 * losing a heart over a missing umlaut they clearly knew.
 */
export function duoCheckTyped(input: string, target: string): DuoTypedResult {
  const result = matchGermanMeaning(input, target);
  if (!result.ok) return { ok: false, note: null };
  if (result.capitalizationError) return { ok: true, note: "Nearly — German nouns take a capital." };
  if (result.spellingNote) return { ok: true, note: "Right, but check the spelling." };
  if (result.phrasingNote) return { ok: true, note: "Understood — the usual phrasing differs slightly." };
  return { ok: true, note: null };
}

export function duoCheckBuild(chosen: string[], solution: string[]): boolean {
  return chosen.length === solution.length && chosen.every((word, index) => word === solution[index]);
}

export function duoXpFor(correct: number, total: number, heartsLeft: number): number {
  if (total === 0) return 0;
  const finished = correct >= Math.ceil(total * 0.6);
  if (!finished) return 0;
  return DUO_XP_PER_LESSON + (heartsLeft === DUO_HEARTS ? DUO_XP_PERFECT_BONUS : 0);
}
