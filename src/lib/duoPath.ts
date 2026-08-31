import { buildCatalog, type CatalogItem } from "@/session";
import { loadGradeStore, statusForId, type GradeStore } from "@/lib/activity";
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
export type DuoNodeState = "done" | "current" | "available";

export type DuoNode = {
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

export type DuoUnit = {
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
};

/** Nodes per unit. Duolingo's own units run to roughly this. */
export const DUO_UNIT_SIZE = 5;

/**
 * Kept at its old value, and no longer used to lock anything.
 *
 * It used to be the runway: two packs past the current one stayed open and
 * everything beyond was greyed out. Nothing is locked now, so this decides
 * nothing — it is exported because other code imports it, and removing an
 * export is a separate change from removing a rule.
 *
 * @deprecated The path does not lock. Nothing should read this to decide
 * whether a pack can be opened.
 */
export const DUO_LOOKAHEAD = 2;

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
  grades: GradeStore
): Map<string, { done: number; total: number }> {
  const counts = new Map<string, { done: number; total: number }>();
  for (const item of catalog) {
    if (!item.partKey) continue;
    const row = counts.get(item.partKey) ?? { done: 0, total: 0 };
    row.total += 1;
    if (statusForId(grades, item.id, item.aliases) === "known") row.done += 1;
    counts.set(item.partKey, row);
  }
  return counts;
}

export function buildDuoPath(
  apiParts: Record<string, unknown>,
  user: UserProfile | null = getAuthUser(),
  options: { maxUnits?: number } = {}
): DuoPath {
  const empty: DuoPath = { units: [], current: null, totalNodes: 0, doneNodes: 0 };
  try {
    if (!apiParts || Object.keys(apiParts).length === 0) return empty;
    const catalog = buildCatalog(apiParts as Record<string, any>);
    if (catalog.length === 0) return empty;

    const grades = loadGradeStore(user);
    const counts = duoPackCounts(catalog, grades);

    // Curriculum order, so "next" on the path is the same pack the guided
    // session would have served. Two modes disagreeing about what comes next
    // would be worse than having only one.
    const ordered = Object.keys(orderParts(apiParts as Record<string, any>))
      .filter((key) => (counts.get(key)?.total ?? 0) > 0);

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
    };
  } catch {
    return empty;
  }
}
