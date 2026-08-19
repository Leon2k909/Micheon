import { buildCatalog } from "@/session";
import { loadGradeStore, statusForId } from "@/lib/activity";
import { orderParts } from "@/lib/curriculum";
import { getAuthUser, type UserProfile } from "@/lib/profileStorage";

/** Three new phrases a sitting — see NEW_PER_LESSON in session.ts. */
const NEW_PER_SITTING = 3;

export type PackProgress = {
  /** The pack currently being worked through. */
  key: string;
  title: string;
  /** Phrases in it you already know. */
  done: number;
  total: number;
  /** 0-100. */
  percent: number;
  /** Sittings left at three new phrases each, rounded up. */
  sittingsLeft: number;
};

/**
 * Which pack you are actually in the middle of, and how much of it is left.
 *
 * The course hero used to show XP progress to the next level, which the right
 * rail already showed twice over — and which answers a question nobody asks.
 * "How much longer on this one?" is the question, so this answers it in the
 * units the app actually works in: phrases, and sittings of three.
 *
 * The active pack is the first one in curriculum order with anything left,
 * which matches the order lessons are served in. Returns null before the
 * catalogue has loaded, or once everything is finished.
 */
/**
 * The next few packs the course will actually serve, in curriculum order.
 *
 * The dashboard's "Your lesson path" used to render three hardcoded rows —
 * invented numbers and invented titles that matched nothing the learner
 * would be taught. This returns the real thing: the packs with work left,
 * their real names, and their real progress.
 */
export function upcomingPackProgress(
  apiParts: Record<string, any>,
  user: UserProfile | null = getAuthUser(),
  limit = 3
): PackProgress[] {
  try {
    if (!apiParts || !Object.keys(apiParts).length) return [];
    const catalog = buildCatalog(apiParts);
    if (!catalog.length) return [];
    const grades = loadGradeStore(user);

    const counts = new Map<string, { done: number; total: number }>();
    for (const item of catalog) {
      if (!item.partKey) continue;
      const row = counts.get(item.partKey) ?? { done: 0, total: 0 };
      row.total += 1;
      if (statusForId(grades, item.id, item.aliases) === "known") row.done += 1;
      counts.set(item.partKey, row);
    }

    const out: PackProgress[] = [];
    for (const key of Object.keys(orderParts(apiParts))) {
      if (out.length >= limit) break;
      const row = counts.get(key);
      if (!row || row.total === 0 || row.done >= row.total) continue;
      const remaining = row.total - row.done;
      out.push({
        key,
        title: String(apiParts[key]?.theme || apiParts[key]?.label || key),
        done: row.done,
        total: row.total,
        percent: Math.round((row.done / row.total) * 100),
        sittingsLeft: Math.max(1, Math.ceil(remaining / NEW_PER_SITTING)),
      });
    }
    return out;
  } catch {
    return [];
  }
}

export function activePackProgress(
  apiParts: Record<string, any>,
  user: UserProfile | null = getAuthUser(),
): PackProgress | null {
  try {
    if (!apiParts || !Object.keys(apiParts).length) return null;
    const catalog = buildCatalog(apiParts);
    if (!catalog.length) return null;
    const grades = loadGradeStore(user);

    const counts = new Map<string, { done: number; total: number }>();
    for (const item of catalog) {
      if (!item.partKey) continue;
      const row = counts.get(item.partKey) ?? { done: 0, total: 0 };
      row.total += 1;
      if (statusForId(grades, item.id, item.aliases) === "known") row.done += 1;
      counts.set(item.partKey, row);
    }

    // Curriculum order, so "current" means the same thing here as it does in
    // the lesson that gets served next.
    for (const key of Object.keys(orderParts(apiParts))) {
      const row = counts.get(key);
      if (!row || row.total === 0 || row.done >= row.total) continue;
      const remaining = row.total - row.done;
      return {
        key,
        title: String(apiParts[key]?.theme || apiParts[key]?.label || key),
        done: row.done,
        total: row.total,
        percent: Math.round((row.done / row.total) * 100),
        sittingsLeft: Math.max(1, Math.ceil(remaining / NEW_PER_SITTING)),
      };
    }
    return null;
  } catch {
    return null;
  }
}
