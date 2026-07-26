import { syncLocalStorageItem } from "@/lib/profileStorage";
import type { Part, Phrase } from "@/lib/types";

/**
 * Words and phrases the learner adds themselves.
 *
 * These become real packs, merged into the same map the bundled content lives
 * in — which is the whole point. Everything downstream reads that map, so a
 * phrase added here is immediately eligible for Continue learning, shows in the
 * tracker, is searchable in Lessons, and can appear in tests, without any of
 * those needing to know it came from the learner.
 */

export const CUSTOM_CONTENT_KEY = "gl-custom-content-v1";
export const CUSTOM_CONTENT_EVENT = "custom-content-changed";

/** Custom pack keys are prefixed so they are recognisable anywhere they surface. */
export const CUSTOM_PACK_PREFIX = "mine-";

export const MAX_CUSTOM_TEXT = 300;
export const MAX_CUSTOM_ENTRIES = 5000;

export type CustomEntry = {
  de: string;
  en: string;
  use?: string;
  addedAt: number;
};

export type CustomPack = {
  id: string;
  name: string;
  level: string;
  entries: CustomEntry[];
};

type CustomStore = { packs: CustomPack[] };

const DEFAULT_PACK_ID = "my-words";

function clean(value: unknown, max = MAX_CUSTOM_TEXT): string {
  return typeof value === "string" ? value.replace(/\s+/g, " ").trim().slice(0, max) : "";
}

function read(): CustomStore {
  if (typeof window === "undefined") return { packs: [] };
  try {
    const parsed = JSON.parse(window.localStorage.getItem(CUSTOM_CONTENT_KEY) ?? "{}");
    const packs = Array.isArray(parsed?.packs) ? parsed.packs : [];
    return {
      packs: packs
        .map((pack: any) => ({
          id: clean(pack?.id, 60) || DEFAULT_PACK_ID,
          name: clean(pack?.name, 80) || "My words",
          level: clean(pack?.level, 20) || "A1-A2",
          entries: Array.isArray(pack?.entries)
            ? pack.entries
                .map((entry: any) => ({
                  de: clean(entry?.de),
                  en: clean(entry?.en),
                  use: clean(entry?.use) || undefined,
                  addedAt: Number(entry?.addedAt) || 0,
                }))
                .filter((entry: CustomEntry) => entry.de && entry.en)
                .slice(0, MAX_CUSTOM_ENTRIES)
            : [],
        }))
        .filter((pack: CustomPack) => pack.id),
    };
  } catch {
    return { packs: [] };
  }
}

function write(store: CustomStore) {
  if (typeof window === "undefined") return;
  const raw = JSON.stringify(store);
  try {
    window.localStorage.setItem(CUSTOM_CONTENT_KEY, raw);
  } catch {
    // Storage can be full or blocked; the change still applies to this session.
  }
  syncLocalStorageItem(CUSTOM_CONTENT_KEY, raw);
  window.dispatchEvent(new Event(CUSTOM_CONTENT_EVENT));
}

export function getCustomPacks(): CustomPack[] {
  return read().packs;
}

export function customEntryCount(): number {
  return read().packs.reduce((total, pack) => total + pack.entries.length, 0);
}

export function createCustomPack(name: string, level = "A1-A2"): CustomPack {
  const store = read();
  const cleanName = clean(name, 80) || "My words";
  // Ids are derived from the name but kept unique, so two packs called the same
  // thing do not silently merge into one.
  const base = cleanName.toLocaleLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "pack";
  let id = base;
  let n = 2;
  while (store.packs.some((pack) => pack.id === id)) id = `${base}-${n++}`;
  const pack: CustomPack = { id, name: cleanName, level: clean(level, 20) || "A1-A2", entries: [] };
  store.packs.push(pack);
  write(store);
  return pack;
}

export function renameCustomPack(id: string, name: string) {
  const store = read();
  const pack = store.packs.find((candidate) => candidate.id === id);
  if (!pack) return;
  pack.name = clean(name, 80) || pack.name;
  write(store);
}

export function deleteCustomPack(id: string) {
  const store = read();
  store.packs = store.packs.filter((pack) => pack.id !== id);
  write(store);
}

function ensurePack(store: CustomStore, packId?: string): CustomPack {
  const wanted = packId && store.packs.find((pack) => pack.id === packId);
  if (wanted) return wanted;
  const existing = store.packs[0];
  if (existing) return existing;
  const pack: CustomPack = { id: DEFAULT_PACK_ID, name: "My words", level: "A1-A2", entries: [] };
  store.packs.push(pack);
  return pack;
}

/** Returns how many were actually added — duplicates within a pack are skipped. */
export function addCustomEntries(
  entries: { de: string; en: string; use?: string }[],
  packId?: string
): { added: number; skipped: number } {
  const store = read();
  const pack = ensurePack(store, packId);
  const seen = new Set(pack.entries.map((entry) => entry.de.toLocaleLowerCase("de-DE")));
  let added = 0;
  let skipped = 0;
  for (const entry of entries) {
    const de = clean(entry.de);
    const en = clean(entry.en);
    if (!de || !en) { skipped += 1; continue; }
    const key = de.toLocaleLowerCase("de-DE");
    if (seen.has(key)) { skipped += 1; continue; }
    if (pack.entries.length >= MAX_CUSTOM_ENTRIES) { skipped += 1; continue; }
    seen.add(key);
    pack.entries.push({ addedAt: Date.now(), de, en, use: clean(entry.use) || undefined });
    added += 1;
  }
  if (added) write(store);
  return { added, skipped };
}

export function removeCustomEntry(packId: string, de: string) {
  const store = read();
  const pack = store.packs.find((candidate) => candidate.id === packId);
  if (!pack) return;
  const key = de.toLocaleLowerCase("de-DE");
  pack.entries = pack.entries.filter((entry) => entry.de.toLocaleLowerCase("de-DE") !== key);
  write(store);
}

/**
 * Parse a pasted block into entries.
 *
 * Accepts the shapes people actually have to hand: tab-separated (what a
 * spreadsheet copy gives), comma-separated, or a dash / equals / semicolon
 * between the two languages. Anything without a usable pair is reported rather
 * than dropped silently, so a bad paste does not half-import in silence.
 */
export function parseBulkEntries(text: string): {
  entries: { de: string; en: string }[];
  rejected: { line: string; reason: string }[];
} {
  const entries: { de: string; en: string }[] = [];
  const rejected: { line: string; reason: string }[] = [];

  for (const rawLine of String(text ?? "").split(/\r?\n/)) {
    const line = rawLine.trim();
    if (!line || line.startsWith("#")) continue;

    // Tabs first: a spreadsheet paste can legitimately contain commas and
    // dashes inside a phrase, and splitting on those would cut it in half.
    let parts: string[] | null = null;
    if (line.includes("\t")) parts = line.split("\t");
    else {
      const match = /^(.*?)\s*(?:=|;|\||\s—\s|\s-\s)\s*(.*)$/.exec(line);
      if (match) parts = [match[1], match[2]];
      else if (line.includes(",")) {
        const at = line.indexOf(",");
        parts = [line.slice(0, at), line.slice(at + 1)];
      }
    }

    const de = clean(parts?.[0] ?? "");
    const en = clean(parts?.[1] ?? "");
    if (!de || !en) {
      rejected.push({ line: line.slice(0, 120), reason: "no German and English pair found" });
      continue;
    }
    entries.push({ de, en });
  }

  return { entries, rejected };
}

/**
 * Ids are derived from the German text, not the position in the pack, so
 * deleting one entry does not hand every entry after it somebody else's
 * progress — and re-adding a word you deleted picks its own history back up.
 */
export function customEntryId(packId: string, de: string): string {
  const slug = de
    .trim()
    .toLocaleLowerCase("de-DE")
    .normalize("NFKD")
    .replace(/\p{M}/gu, "")
    .replace(/[^a-z0-9äöüß]+/gi, "-")
    .replace(/^-+|-+$/g, "") || "item";
  return `${CUSTOM_PACK_PREFIX}${packId}-phrase-${slug}`;
}

/**
 * The learner's packs, shaped exactly like bundled ones so the rest of the app
 * cannot tell the difference.
 */
export function buildCustomParts(): Record<string, Part> {
  const out: Record<string, Part> = {};
  for (const pack of read().packs) {
    if (!pack.entries.length) continue;
    const phrases: Phrase[] = pack.entries.map((entry) => ({
      de: entry.de,
      en: entry.en,
      use: entry.use ?? "",
      id: customEntryId(pack.id, entry.de),
    }));
    out[`${CUSTOM_PACK_PREFIX}${pack.id}`] = {
      label: pack.name,
      level: pack.level,
      theme: pack.name,
      description: "Words and phrases you added yourself.",
      focus: "Your own material",
      vocab: [],
      articleQuestions: [],
      translationQuestions: [],
      dialogues: [],
      phrases,
    };
  }
  return out;
}

export function isCustomPartKey(key: string): boolean {
  return key.startsWith(CUSTOM_PACK_PREFIX);
}
