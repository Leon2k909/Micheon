import { buildCatalog, type CatalogItem } from "@/session";
import { loadGradeStore, statusForId, type GradeStore } from "@/lib/activity";
import { recallDetail } from "@/lib/memoryStrength";
import { getHideFinishedLessons, passesFinishedShelf } from "@/lib/lessonShelf";
import { orderParts } from "@/lib/curriculum";
import { getAuthUser, type UserProfile } from "@/lib/profileStorage";

/**
 * The course as a path you climb, rather than a queue that serves you.
 *
 * This is the second of the two ways in. The guided session picks what you
 * should see next and hands it over — efficient, and completely opaque about
 * where you are. A path answers the other question: how far along am I, what
 * is this unit called, and what comes after it. Same content, same grades,
 * same curriculum order — only the shape of the journey is different.
 *
 * Nothing here is a second store. Node state is derived from the same grade
 * store the rest of the app writes to, so finishing a lesson the ordinary way
 * lights up the path too, and vice versa.
 */

/**
 * Nothing is locked. There is no fourth state.
 *
 * The path used to grey out everything more than two packs ahead — a soft
 * lock, meant to signal order without refusing to teach. It refused to teach.
 * And because the guided session has always taught from any pack, progress
 * arrived in packs the path still called locked: "Talking about learning
 * German" sat behind a padlock at 46 of 54 done. A lock over something you
 * have half learned is not a signal about order, it is just wrong.
 *
 * The order is still there and still means something — the path is drawn in
 * curriculum order and the current node is marked. It is a recommendation
 * now, which is all it ever had standing to be: a thematic catalogue where
 * somebody who wants the restaurant unit before the doctor unit is not
 * cheating.
 */
type DuoNodeState = "done" | "current" | "available";

type DuoNode = {
  /** The pack key — part17, everydayWords12, and so on. */
  key: string;
  title: string;
  /** Position in curriculum order, 0-based. */
  index: number;
  done: number;
  total: number;
  percent: number;
  state: DuoNodeState;
};

type DuoUnit = {
  /** 1-based, for "Unit 3". */
  number: number;
  title: string;
  /** The level band the unit's packs sit in, when the data carries one. */
  level: string | null;
  nodes: DuoNode[];
  done: number;
  total: number;
  percent: number;
};

export type DuoPath = {
  units: DuoUnit[];
  /** The node the CONTINUE button jumps to — null once everything is done. */
  current: DuoNode | null;
  totalNodes: number;
  doneNodes: number;
  /**
   * Packs the shelf is holding — finished, not fading, and off the path.
   *
   * Returned from the build rather than worked out by the caller, because the
   * only other way to know it is to build the whole path a second time with
   * the shelf off, and that is a catalogue pass over six hundred packs to
   * produce one integer.
   */
  shelvedNodes: number;
};

/** Nodes per unit. Duolingo's own units run to roughly this. */
const DUO_UNIT_SIZE = 5;


function packTitle(part: unknown, key: string): string {
  const record = part as { theme?: unknown; label?: unknown } | undefined;
  return String(record?.theme || record?.label || key);
}

function packLevel(part: unknown): string | null {
  const record = part as { level?: unknown } | undefined;
  const level = record?.level;
  return typeof level === "string" && level.trim() ? level.trim() : null;
}

/**
 * Count what is known per pack.
 *
 * Split out because both the path and the lesson builder need it and they
 * must not disagree — a node that says 8/10 and then serves you nothing has
 * counted differently from the thing that picks the questions.
 */
export function duoPackCounts(
  catalog: CatalogItem[],
  grades: GradeStore,
  now = Date.now()
): Map<string, { done: number; total: number; fading: number }> {
  const counts = new Map<string, { done: number; total: number; fading: number }>();
  for (const item of catalog) {
    if (!item.partKey) continue;
    const row = counts.get(item.partKey) ?? { done: 0, total: 0, fading: 0 };
    row.total += 1;
    if (statusForId(grades, item.id, item.aliases) === "known") {
      row.done += 1;
      /**
       * Counted here so the path can put finished packs away on the same rule
       * the lesson list uses — and bring back the ones that have started to
       * go. Read off the record the status came from, aliases included: look
       * the two up differently and a pack can be "done" against one id and
       * "fading" against another, which is how a shelf ends up hiding exactly
       * the lesson that needed reviewing.
       */
      const key = [item.id, ...(item.aliases ?? [])].find((alias) => grades?.[alias]);
      if (key && recallDetail(grades[key], now).fading) row.fading += 1;
    }
    counts.set(item.partKey, row);
  }
  return counts;
}

export function buildDuoPath(
  apiParts: Record<string, unknown>,
  user: UserProfile | null = getAuthUser(),
  options: {
    maxUnits?: number;
    hideFinished?: boolean;
    /**
     * The grades to build against, instead of the signed-in learner's.
     *
     * Only the gate passes this. Without it the shelf cannot be tested end to
     * end: loadGradeStore has no storage to read outside a browser, so a check
     * builds a path where nothing is finished, nothing is ever hidden, and
     * every assertion about hiding passes whatever the code does. Two
     * injections that broke the shelf outright went unnoticed that way.
     */
    grades?: GradeStore;
  } = {}
): DuoPath {
  const empty: DuoPath = { units: [], current: null, totalNodes: 0, doneNodes: 0, shelvedNodes: 0 };
  try {
    if (!apiParts || Object.keys(apiParts).length === 0) return empty;
    const catalog = buildCatalog(apiParts as Record<string, any>);
    if (catalog.length === 0) return empty;

    const grades = options.grades ?? loadGradeStore(user);
    const counts = duoPackCounts(catalog, grades);

    // Curriculum order, so "next" on the path is the same pack the guided
    // session would have served. Two modes disagreeing about what comes next
    // would be worse than having only one.
    /**
     * The shelf, applied to the path.
     *
     * The same rule the lesson list runs, from the same module: a pack whose
     * every item is known goes away, and comes back the moment any of it
     * starts to fade. Without this the two views of one course disagreed about
     * what was worth showing — the list put four hundred finished packs away
     * and the path walked you through every one of them.
     *
     * Applied BEFORE the nodes are numbered, so "Unit 3" means the third unit
     * you can see rather than the third that exists. The percentages below are
     * counted from the same visible set for the same reason: a path that says
     * 12% while showing you only what is left has answered a question nobody
     * asked.
     */
    const hideFinished = options.hideFinished ?? getHideFinishedLessons();
    const taught = Object.keys(orderParts(apiParts as Record<string, any>))
      .filter((key) => (counts.get(key)?.total ?? 0) > 0);
    const ordered = taught.filter((key) => {
      const row = counts.get(key)!;
      return passesFinishedShelf(
        { done: row.done, total: row.total, fading: row.fading },
        { hideFinished, askedForFinished: false }
      );
    });
    const shelvedNodes = taught.length - ordered.length;

    const nodes: DuoNode[] = ordered.map((key, index) => {
      const row = counts.get(key)!;
      const percent = row.total === 0 ? 0 : Math.round((row.done / row.total) * 100);
      return {
        key,
        title: packTitle(apiParts[key], key),
        index,
        done: row.done,
        total: row.total,
        percent,
        // Unfinished is available — every unfinished pack, at any distance.
        state: row.done >= row.total ? "done" : "available",
      };
    });

    // The current node is the first unfinished one — the same rule
    // activePackProgress uses, so the hero and the path never disagree. It
    // marks where the course would take you next and nothing more; the packs
    // after it were already available on the line above.
    const currentIndex = nodes.findIndex((node) => node.state !== "done");
    if (currentIndex >= 0) nodes[currentIndex].state = "current";

    const units: DuoUnit[] = [];
    const maxUnits = options.maxUnits ?? Infinity;
    for (let start = 0; start < nodes.length && units.length < maxUnits; start += DUO_UNIT_SIZE) {
      const slice = nodes.slice(start, start + DUO_UNIT_SIZE);
      if (slice.length === 0) break;
      const done = slice.reduce((sum, node) => sum + node.done, 0);
      const total = slice.reduce((sum, node) => sum + node.total, 0);
      units.push({
        number: units.length + 1,
        // A unit is named for the pack it opens with, which is the one the
        // learner meets first and therefore the one they will remember it by.
        title: slice[0].title,
        level: packLevel(apiParts[slice[0].key]),
        nodes: slice,
        done,
        total,
        percent: total === 0 ? 0 : Math.round((done / total) * 100),
      });
    }

    return {
      units,
      current: currentIndex >= 0 ? nodes[currentIndex] : null,
      totalNodes: nodes.length,
      doneNodes: nodes.filter((node) => node.state === "done").length,
      shelvedNodes,
    };
  } catch {
    return empty;
  }
}
