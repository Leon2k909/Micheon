import React, { useEffect, useMemo, useRef, useState } from "react";
import { CheckCircle2, Circle, AlertTriangle, Search, Volume2, Star, Check, Minus, X as XIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { CustomContentEditor } from "@/components/lab/CustomContentEditor";
import { buildCatalog, type CatalogItem } from "@/session";
import { loadGradeStore, progressEntryForId, saveGradeStore, setItemStatus, setItemsStatus, statusForId, type GradeStore, type ItemStatus } from "@/lib/activity";
import { strengthInfo, setStrengthLevel, recordPermanent, recallDetail, REVIEW_INTERVALS_DAYS, type GradeRecord } from "@/lib/memoryStrength";
import { frequencyInfo, synonymNote } from "@/lib/wordFrequency";
import { buildCorpusIndex, sentenceCommonality } from "@/lib/corpusFrequency";
import { itemDifficulty, type AbilityBand } from "@/lib/ability";
import { packMeta } from "@/lib/curriculum";
import { getAuthUser, type UserProfile } from "@/lib/profileStorage";
import { tts } from "@/lib/voice";
import { ui, uiIsGerman } from "@/lib/i18n";
import { targetLangTag } from "@/lib/direction";
import { buildCatalogSearchText, catalogItemMatchesQuery, normalizeCatalogSearchText } from "@/lib/catalogSearch";
import { getLearningMode, useLearningMode } from "@/lib/learningMode";
import {
  conversationPriorityInfo,
  conversationPriorityScore,
  type ConversationPriorityInfo,
  type ConversationUsefulness,
} from "@/lib/conversationPriority";

type Part = Record<string, any>;
type FilterKey = "all" | "known" | "fading" | "struggle" | "new";
type ItemTypeFilter = "all" | "phrases" | "vocab";
type UsefulnessFilter = "all" | ConversationUsefulness;

type SortKey =
  | "common"
  | "rare"
  | "easiest"
  | "hardest"
  | "shortest"
  | "longest"
  | "alpha"
  | "recent";

/** Easiest to hardest, so a band can be compared as a number. */
const BAND_ORDER: AbilityBand[] = ["easy", "medium", "hard", "expert"];

const SORTS: { key: SortKey; label: string }[] = [
  { key: "common", label: "Most common first" },
  { key: "rare", label: "Least common first" },
  { key: "easiest", label: "Easiest first" },
  { key: "hardest", label: "Hardest first" },
  { key: "shortest", label: "Shortest first" },
  { key: "longest", label: "Longest first" },
  { key: "alpha", label: "A to Z" },
  { key: "recent", label: "Recently practised" },
];
const PAGE_SIZE = 40;
const GERMAN_COLLATOR = new Intl.Collator("de");

type TrackerPriority = {
  commonality: number;
  difficulty: number;
  info: ConversationPriorityInfo;
  length: number;
  score: number;
};

type PreparedTrackerData = {
  catalog: CatalogItem[];
  commonOrder: CatalogItem[];
  priorityIndex: Map<CatalogItem, TrackerPriority>;
  searchIndex: Map<CatalogItem, string>;
};

// Profile settings can render immediately while this immutable catalogue work
// is prepared during browser idle time. The same object is reused when the
// tracker reaches the viewport, avoiding a large synchronous task mid-scroll.
const preparedTrackerCache = new WeakMap<object, { mode: string; data: PreparedTrackerData }>();

export function prepareVocabTrackerData(apiParts: Record<string, Part>): PreparedTrackerData {
  const mode = String(getLearningMode());
  const cacheable = Boolean(apiParts) && typeof apiParts === "object";
  const cached = cacheable ? preparedTrackerCache.get(apiParts) : undefined;
  if (cached?.mode === mode) return cached.data;

  const catalog = buildCatalog(apiParts);
  // Filled in lazily by searchTextFor below. Building all 16k entries up front
  // was three quarters of the time spent opening the library, and none of it
  // was needed unless the learner typed something.
  const searchIndex = new Map<CatalogItem, string>();
  const corpusIndex = buildCorpusIndex(apiParts as any);
  const priorityIndex = new Map<CatalogItem, TrackerPriority>(catalog.map((item) => {
    const commonality = sentenceCommonality(item.de, corpusIndex);
    return [item, {
      commonality,
      difficulty: BAND_ORDER.indexOf(
        itemDifficulty(item.level, item.de.trim().split(/\s+/).filter(Boolean).length)
      ),
      info: conversationPriorityInfo(item.partKey),
      length: item.de.length,
      score: conversationPriorityScore({
        partKey: item.partKey,
        kind: item.kind,
        commonality,
        lessonPriority: item.lessonPriority,
      }),
    }];
  }));
  const commonOrder = [...catalog].sort((a, b) => {
    const aScore = priorityIndex.get(a)?.score ?? Number.MAX_SAFE_INTEGER;
    const bScore = priorityIndex.get(b)?.score ?? Number.MAX_SAFE_INTEGER;
    return aScore - bScore || GERMAN_COLLATOR.compare(a.de, b.de);
  });
  const data = { catalog, commonOrder, priorityIndex, searchIndex };
  if (cacheable) preparedTrackerCache.set(apiParts, { mode, data });
  return data;
}

const FILTERS: { key: FilterKey; label: string }[] = [
  { key: "all", label: "All" },
  { key: "known", label: "Known" },
  // Everything you learned but are now past due on, so the backlog the totals
  // are quietly discounting is something you can actually sit down and clear.
  { key: "fading", label: "Fading" },
  { key: "struggle", label: "Struggling" },
  { key: "new", label: "To learn" },
];

const ITEM_TYPE_FILTERS: { key: ItemTypeFilter; label: string }[] = [
  { key: "all", label: "All items" },
  { key: "phrases", label: "Phrases & dialogues" },
  { key: "vocab", label: "Vocabulary in context" },
];

const USEFULNESS_FILTERS: { key: UsefulnessFilter; label: string }[] = [
  { key: "all", label: "All usefulness levels" },
  { key: "essential", label: "Conversation essentials" },
  { key: "everyday", label: "Everyday conversation" },
  { key: "personal", label: "Your material" },
  { key: "daily", label: "Daily life" },
  { key: "occasional", label: "Now and then" },
  { key: "life-event", label: "Life events & big topics" },
  { key: "specialist", label: "Specialist / casual" },
  { key: "extra", label: "Extra practice" },
];

const usefulnessTone: Record<ConversationUsefulness, string> = {
  essential: "border-emerald-300 bg-emerald-50 text-emerald-700",
  personal: "border-sky-300 bg-sky-50 text-sky-700",
  everyday: "border-green-200 bg-green-50 text-green-700",
  daily: "border-teal-300 bg-teal-50 text-teal-700",
  occasional: "border-[var(--border)] bg-[var(--surface-2)] text-[var(--text-2)]",
  "life-event": "border-violet-300 bg-violet-50 text-violet-700",
  situational: "border-[var(--border)] bg-[var(--surface-2)] text-[var(--text-2)]",
  specialist: "border-amber-300 bg-amber-50 text-amber-700",
  extra: "border-[var(--border)] bg-[var(--surface-3)] text-[var(--text-3)]",
};

function speak(text: string) {
  tts(text, 0.9, targetLangTag());
}

function recordFor(grades: GradeStore, id: string, aliases: string[] = []): GradeRecord | undefined {
  for (const key of [id, ...aliases]) {
    const rec = grades?.[key];
    if (rec?.lastGrade) return rec;
  }
  return undefined;
}

/**
 * Memory strength meter: 5 pips fill as the spaced-repetition ladder climbs
 * (1d -> 3d -> 10d -> 30d -> 180d review intervals). "Due" means the item
 * is about to return to lessons for review.
 *
 * The pips are the rung you reached; the "fading" chip beside them is what the
 * item is worth TODAY, which are different things — you can sit on the top rung
 * and still be worth 0.7 of a word if you have not seen it in a year. Both are
 * shown because only the second one explains the totals.
 *
 * Each pip is clickable: jump straight to that rung (e.g. "I already know
 * this cold, put me at Solid" or "I clicked too far, back to Learning")
 * instead of having to replay the item in a lesson to climb the ladder.
 */
function StrengthMeter({
  record,
  onSetLevel,
  onSetPermanent,
}: {
  record: GradeRecord | undefined;
  onSetLevel: (level: number) => void;
  onSetPermanent: () => void;
}) {
  const s = strengthInfo(record);
  const decay = recallDetail(record);
  const struggling = record?.lastGrade === "struggle";
  return (
    <div className="mt-1 flex items-center gap-1.5">
      <div className="flex items-center gap-0.5" aria-label={`${ui("Memory strength")}: ${ui(s.label)}. ${ui("Click a bar to set it directly.")}`}>
        {[1, 2, 3, 4, 5].map((n) => (
          <button
            key={n}
            type="button"
            title={uiIsGerman()
              ? `Auf ${REVIEW_INTERVALS_DAYS[n - 1]} ${REVIEW_INTERVALS_DAYS[n - 1] === 1 ? "Tag" : "Tage"} Wiederholungsabstand setzen (Stufe ${n}/5)`
              : `Come back in ${REVIEW_INTERVALS_DAYS[n - 1]} ${REVIEW_INTERVALS_DAYS[n - 1] === 1 ? "day" : "days"} (level ${n} of 5)`}
            onClick={(e) => { e.stopPropagation(); onSetLevel(n); }}
            className="cursor-pointer p-1 -m-1"
          >
            <span
              className={cn(
                "block h-1.5 w-3 rounded-full transition-transform hover:scale-125",
                n <= s.level
                  ? struggling ? "bg-amber-500" : "bg-[var(--success-text)]"
                  : "bg-[var(--surface-3)] hover:bg-[var(--surface-3)]/70"
              )}
            />
          </button>
        ))}
        {/* Above Mastered: never schedule this word for review again. */}
        <button
          type="button"
          title={ui(s.permanent ? "Never reviewed again" : "Mark permanent — never show this again")}
          onClick={(e) => { e.stopPropagation(); onSetPermanent(); }}
          className="cursor-pointer p-1 -m-1"
        >
          <Star
            className={cn(
              "h-3 w-3 transition-transform hover:scale-125",
              s.permanent
                ? "fill-[var(--accent)] text-[var(--accent)]"
                : "text-[var(--surface-3)] hover:text-[var(--accent)]/60"
            )}
          />
        </button>
      </div>
      <span className={cn(
        "text-[10px] font-black uppercase tracking-wide",
        struggling ? "text-amber-600" : s.permanent ? "text-[var(--accent)]" : s.level > 0 ? "text-[var(--success-text)]" : "text-[var(--text-3)]"
      )}>
        {ui(s.label)}
      </span>
      {s.permanent && (
        <span className="rounded-full bg-[var(--accent-dim)] px-2 py-0.5 text-[10px] font-black text-[var(--accent)]">
          {ui("never reviewed again")}
        </span>
      )}
      {/* Due and fading are nearly the same set — anything past its date is
          both — so they were two chips saying one thing. One chip now: due on
          the day it arrives, and once it has actually started slipping, how
          much of it is left. "0.84" meant nothing on its own; a percentage
          with the days attached says what it is measuring. */}
      {!s.permanent && s.due && !decay.fading && (
        <span
          className="rounded-full bg-[var(--accent-dim)] px-2 py-0.5 text-[10px] font-black text-[var(--accent)]"
          title={ui("Its review is due today. Answer it once and it counts in full again, on a longer interval.")}
        >
          {ui("due for review")}
        </span>
      )}
      {decay.fading && (
        <span
          className="rounded-full bg-amber-500/15 px-2 py-0.5 text-[10px] font-black text-amber-600"
          title={uiIsGerman()
            ? `Seit ${Math.round(decay.overdueDays)} Tagen überfällig, also wird angenommen, dass du dich noch an ${Math.round(decay.weight * 100)}% davon erinnerst — so viel zählt es gerade zu deiner Gesamtzahl. Es halbiert sich alle ${Math.round(decay.halfLifeDays)} Tage in Richtung ${Math.round(decay.floor * 100)}% und fällt nie darunter. Einmal richtig abrufen setzt es auf 100% zurück.`
            : `${Math.round(decay.overdueDays)} days past its review, so you are assumed to still recall ${Math.round(decay.weight * 100)}% of it — that is how much it counts towards your total right now. It halves every ${Math.round(decay.halfLifeDays)} days towards ${Math.round(decay.floor * 100)}% and never drops below that. Getting it right once puts it back to 100%.`}
        >
          {uiIsGerman()
            ? `${Math.round(decay.overdueDays)} Tage überfällig · ${Math.round(decay.weight * 100)}% behalten`
            : `${Math.round(decay.overdueDays)} days overdue · ${Math.round(decay.weight * 100)}% remembered`}
        </span>
      )}
      {!s.permanent && !s.due && s.dueInDays != null && s.level > 0 && (
        <span className="text-[10px] font-bold text-[var(--text-3)]">
          {ui("review in")} {s.dueInDays} {ui("days short")}
        </span>
      )}
    </div>
  );
}

/**
 * The rules behind every number on this screen, in the learner's own words.
 *
 * A total that goes down needs to be explainable on the spot, or it reads as a
 * bug. This panel is the one place that states the ladder, the fade, the floor
 * and the exemptions plainly — and it links straight to the fading items, so
 * reading about the backlog and clearing it are the same click.
 */
function HowCountingWorks({ fading, onShowFading }: { fading: number; onShowFading: () => void }) {
  const [open, setOpen] = useState(false);
  const ladder = REVIEW_INTERVALS_DAYS.join(" → ");
  return (
    <div className="mt-4 rounded-2xl border border-[var(--border)] bg-[var(--surface-2)] p-4">
      <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          className="text-sm font-black text-[var(--text-1)] underline decoration-dotted underline-offset-4"
        >
          {ui("How this count works")}
        </button>
        {fading > 0 && (
          <p className="text-xs font-bold text-[var(--text-2)]">
            {uiIsGerman()
              ? `${fading.toLocaleString()} ${fading === 1 ? "Eintrag verblasst" : "Einträge verblassen"} gerade.`
              : `${fading.toLocaleString()} ${fading === 1 ? "item is" : "items are"} fading right now.`}
            {" "}
            <button type="button" onClick={onShowFading} className="font-black text-[var(--accent)] underline underline-offset-2">
              {ui("Show them")}
            </button>
          </p>
        )}
      </div>
      {open && (
        <div className="mt-3 space-y-2.5 text-xs font-semibold leading-relaxed text-[var(--text-2)]">
          {/* Written for someone who has never heard of spaced repetition. The
              previous version explained the algorithm — intervals, half-lives,
              floors — which is what I needed to build it, not what anyone needs
              to read it. Four short answers to the four questions actually
              being asked, and one concrete example instead of a formula. */}
          <p>
            {uiIsGerman()
              ? "Diese Zahl schätzt, woran du dich JETZT erinnerst — nicht, was du irgendwann einmal gesehen hast."
              : "This number is an estimate of what you'd remember right now — not a tally of everything you have ever seen."}
          </p>
          <p>
            {uiIsGerman()
              ? "Was du gerade gelernt hast, zählt voll. Was du lange nicht gesehen hast, zählt weniger, weil du davon wahrscheinlich weniger behalten hast. Deshalb kann die Zahl auch sinken."
              : "Something you learned recently counts as a whole item. Something you have not seen for a long time counts as less, because you probably remember less of it. That is why the number can go down as well as up."}
          </p>
          <p className="rounded-xl bg-[var(--surface-3)] px-3 py-2">
            {uiIsGerman()
              ? "Beispiel: Du konntest „Guten Morgen“ vor zwei Monaten sicher. Seitdem nicht mehr gesehen — es zählt jetzt als 0,8 statt 1. Einmal richtig beantwortet, zählt es sofort wieder voll."
              : "For example: you had “Guten Morgen” down two months ago and have not seen it since, so it counts as 0.8 rather than 1. Answer it correctly once and it counts fully again, immediately."}
          </p>
          <p>
            {uiIsGerman()
              ? "Je öfter du etwas sicher abgerufen hast, desto langsamer verblasst es. Und nichts fällt je auf null: etwas wieder aufzufrischen geht viel schneller, als es neu zu lernen."
              : "The more times you have recalled something correctly, the more slowly it slips. And nothing ever falls to zero — coming back to a word you once knew is far quicker than meeting it new."}
          </p>
          <p>
            {uiIsGerman()
              ? "„Fällig“ heißt: heute ist der Wiederholungstag. „Verblasst“ heißt: der Tag ist vorbei. Dieselben Einträge, nur später — deshalb steht pro Zeile immer nur eins von beidem."
              : "“Due” means today is its review day. “Fading” means that day has been and gone. Same items, just later — which is why a row shows one or the other, never both."}
          </p>
          <p className="text-[var(--text-3)]">
            {uiIsGerman()
              ? "Nie verblassen: mit Stern markierte Einträge, von Hand als gemeistert gesetzte Wörter und alles, was du außerhalb der App gelernt hast — dafür gibt es keinen Wiederholungsplan. Dieselbe Zahl steht auf der Startseite, im Profil und bei den Spielen."
              : "Never fades: starred items, words you marked mastered by hand, and anything you learned outside the app — there is no review schedule to measure those against. This is the same number your dashboard, profile and games use."}
          </p>
        </div>
      )}
    </div>
  );
}

function StatusButton({
  active,
  onClick,
  tone,
  icon: Icon,
  label,
}: {
  active: boolean;
  onClick: () => void;
  tone: "known" | "struggle" | "new";
  icon: React.ElementType;
  label: string;
}) {
  const tones: Record<string, string> = {
    known: active
      ? "bg-[var(--success-bg)] text-[var(--success-text)] border-transparent"
      : "border-[var(--border)] text-[var(--text-3)] hover:text-[var(--success-text)]",
    struggle: active
      ? "bg-amber-500/15 text-amber-600 border-transparent"
      : "border-[var(--border)] text-[var(--text-3)] hover:text-amber-600",
    new: active
      ? "bg-[var(--surface-3)] text-[var(--text-1)] border-transparent"
      : "border-[var(--border)] text-[var(--text-3)] hover:text-[var(--text-1)]",
  };
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        "inline-flex h-8 items-center gap-1.5 rounded-full border px-3 text-[11px] font-black transition-colors",
        tones[tone]
      )}
    >
      <Icon className="h-3.5 w-3.5" />
      {label}
    </button>
  );
}

function BulkActionButton({
  icon: Icon,
  label,
  tone,
  onClick,
}: {
  icon: React.ElementType;
  label: string;
  tone: "known" | "struggle" | "new" | "permanent";
  onClick: () => void;
}) {
  const tones: Record<string, string> = {
    known: "border-[var(--success-text)]/30 text-[var(--success-text)] hover:bg-[var(--success-bg)]",
    struggle: "border-amber-500/40 text-amber-600 hover:bg-amber-500/15",
    new: "border-[var(--border)] text-[var(--text-2)] hover:bg-[var(--surface-3)]",
    permanent: "border-[var(--accent)]/40 text-[var(--accent)] hover:bg-[var(--accent-dim)]",
  };
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "inline-flex h-8 items-center gap-1.5 rounded-full border bg-[var(--surface)] px-3 text-[11px] font-black transition-colors",
        tones[tone]
      )}
    >
      <Icon className="h-3.5 w-3.5" />
      {label}
    </button>
  );
}

/** Checkbox-style toggle used for row selection and the header select-all control. */
function SelectBox({
  checked,
  indeterminate = false,
  onClick,
  label,
  size = "h-5 w-5",
}: {
  checked: boolean;
  indeterminate?: boolean;
  onClick: () => void;
  label: string;
  size?: string;
}) {
  return (
    <button
      type="button"
      onClick={(e) => { e.stopPropagation(); onClick(); }}
      aria-pressed={checked}
      aria-label={label}
      title={label}
      className={cn(
        "flex shrink-0 items-center justify-center rounded-md border-2 transition-colors",
        size,
        checked || indeterminate
          ? "border-[var(--accent)] bg-[var(--accent)]"
          : "border-[var(--border)] bg-[var(--surface-2)] hover:border-[var(--accent)]/50"
      )}
    >
      {checked && <Check className="h-3.5 w-3.5 text-white" />}
      {!checked && indeterminate && <Minus className="h-3.5 w-3.5 text-white" />}
    </button>
  );
}

export function VocabTracker({
  apiParts,
  user = getAuthUser(),
}: {
  apiParts: Record<string, Part>;
  user?: UserProfile | null;
}) {
  const [grades, setGrades] = useState<GradeStore>(() => loadGradeStore(user));
  const [filter, setFilter] = useState<FilterKey>("all");
  const [itemTypeFilter, setItemTypeFilter] = useState<ItemTypeFilter>("all");
  const [usefulnessFilter, setUsefulnessFilter] = useState<UsefulnessFilter>("all");
  const [sort, setSort] = useState<SortKey>("common");
  const [query, setQuery] = useState("");
  const [limit, setLimit] = useState(PAGE_SIZE);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const learningMode = useLearningMode();
  const listRef = useRef<HTMLDivElement>(null);
  const loadMoreRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onUpdate = () => setGrades(loadGradeStore(user));
    window.addEventListener("grades-updated", onUpdate);
    return () => window.removeEventListener("grades-updated", onUpdate);
  }, [user]);

  const prepared = useMemo(
    () => prepareVocabTrackerData(apiParts),
    [apiParts, learningMode]
  );
  const { catalog, commonOrder, priorityIndex, searchIndex } = prepared;
  /** Search text for one item, computed once and kept for the session. */
  const searchTextFor = (item: CatalogItem): string => {
    let text = searchIndex.get(item);
    if (text === undefined) {
      text = buildCatalogSearchText(item);
      searchIndex.set(item, text);
    }
    return text;
  };

  const counts = useMemo(() => {
    let known = 0;
    let struggle = 0;
    let fresh = 0;
    let due = 0;
    let fading = 0;
    // What the rest of the app actually counts: each learned item is worth
    // what you can still be assumed to recall, not a flat one for ever. The
    // tracker used to show the raw tally here, so it disagreed with the
    // dashboard by hundreds of words with nothing on screen to explain it.
    let counting = 0;
    for (const item of catalog) {
      const s = statusForId(grades, item.id, item.aliases);
      if (s === "known") {
        known += 1;
        const record = recordFor(grades, item.id, item.aliases);
        const detail = recallDetail(record);
        counting += detail.weight;
        if (detail.fading) fading += 1;
        if (strengthInfo(record).due) due += 1;
      }
      else if (s === "struggle") struggle += 1;
      else fresh += 1;
    }
    return { known, counting: Math.round(counting), fading, struggle, new: fresh, due, total: catalog.length };
  }, [catalog, grades]);

  const filtered = useMemo(() => {
    const q = normalizeCatalogSearchText(query);
    if (
      !q
      && filter === "all"
      && itemTypeFilter === "all"
      && usefulnessFilter === "all"
      && sort === "common"
    ) {
      return commonOrder;
    }
    const matches = catalog.filter((item) => {
      const status = statusForId(grades, item.id, item.aliases);
      // Fading is a slice of Known rather than a status of its own — these are
      // items you did learn, sorted so the most faded lead.
      if (filter === "fading") {
        if (status !== "known") return false;
        if (!recallDetail(recordFor(grades, item.id, item.aliases)).fading) return false;
      } else if (filter !== "all" && status !== filter) return false;
      if (itemTypeFilter === "phrases" && item.kind === "vocab") return false;
      if (itemTypeFilter === "vocab" && item.kind !== "vocab") return false;
      const usefulness = priorityIndex.get(item)?.info.key;
      if (usefulnessFilter !== "all" && usefulness !== usefulnessFilter) return false;
      if (!q) return true;
      return catalogItemMatchesQuery(item, q, searchTextFor(item));
    });
    // "Most common" is conversation-first: authored usefulness category,
    // curriculum order, phrase-vs-vocabulary intent, then corpus frequency.
    // Everything has a stable German-text tie-break so equal items never jump
    // around between renders.
    //
    // Every one of these values is worked out ONCE PER ITEM, up front, and the
    // comparator then only reads numbers. It used to compute them inside the
    // comparator, which sounds equivalent and is not: sorting 8,000 items enters
    // the comparator about 93,000 times, so a value that costs a tokenise and a
    // corpus lookup was paid roughly 23 times per item instead of once. Opening
    // this tab took 2.3 seconds, and a second of that was this sort.
    const keyed = matches.map((item) => ({
      item,
      commonality: priorityIndex.get(item)?.commonality ?? 5_000,
      priorityScore: priorityIndex.get(item)?.score ?? Number.MAX_SAFE_INTEGER,
      difficulty: priorityIndex.get(item)?.difficulty ?? 0,
      practisedAt: Date.parse(recordFor(grades, item.id, item.aliases)?.updatedAt ?? "") || 0,
      length: priorityIndex.get(item)?.length ?? item.de.length,
      de: item.de,
    }));
    type Keyed = (typeof keyed)[number];
    const byText = (a: Keyed, b: Keyed) => GERMAN_COLLATOR.compare(a.de, b.de);

    const compare: Record<SortKey, (a: Keyed, b: Keyed) => number> = {
      common: (a, b) => a.priorityScore - b.priorityScore || byText(a, b),
      rare: (a, b) => b.priorityScore - a.priorityScore || byText(a, b),
      easiest: (a, b) => a.difficulty - b.difficulty || a.priorityScore - b.priorityScore || byText(a, b),
      hardest: (a, b) => b.difficulty - a.difficulty || a.priorityScore - b.priorityScore || byText(a, b),
      shortest: (a, b) => a.length - b.length || byText(a, b),
      longest: (a, b) => b.length - a.length || byText(a, b),
      alpha: byText,
      // Never practised sorts last here rather than first, so this reads as a
      // history rather than as a list of everything you have not touched.
      recent: (a, b) => b.practisedAt - a.practisedAt || byText(a, b),
    };
    keyed.sort(compare[sort]);
    return keyed.map((entry) => entry.item);
  }, [catalog, commonOrder, grades, filter, itemTypeFilter, priorityIndex, query, searchIndex, sort, usefulnessFilter]);

  const visible = filtered.slice(0, limit);

  useEffect(() => {
    const root = listRef.current;
    const target = loadMoreRef.current;
    if (!root || !target || visible.length >= filtered.length) return undefined;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return;
        setLimit((current) => Math.min(filtered.length, current + PAGE_SIZE));
      },
      { root, rootMargin: "180px 0px", threshold: 0.01 }
    );
    observer.observe(target);
    return () => observer.disconnect();
  }, [filtered.length, visible.length]);

  const resetList = () => {
    setLimit(PAGE_SIZE);
    window.requestAnimationFrame(() => listRef.current?.scrollTo({ top: 0 }));
  };

  // "Select all" targets every FILTERED item, not just the currently
  // rendered/paginated slice — selecting only what's on screen would be
  // confusing once more rows load in via "Show more".
  const allFilteredSelected = filtered.length > 0 && filtered.every((i) => selected.has(i.id));
  const someFilteredSelected = filtered.some((i) => selected.has(i.id));

  const toggleSelect = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  const toggleSelectAllFiltered = () => {
    setSelected(allFilteredSelected ? new Set() : new Set(filtered.map((i) => i.id)));
  };

  const clearSelection = () => setSelected(new Set());

  const apply = (item: CatalogItem, status: ItemStatus) => {
    const next = setItemStatus(item.id, status, user, item.aliases);
    setGrades({ ...next });
  };

  // Direct ladder override — writes the exact rung instead of climbing one
  // success at a time, so the learner can correct the tracker on the spot.
  const applyStrength = (item: CatalogItem, level: number) => {
    const store = loadGradeStore(user);
    const prior = progressEntryForId(store, item.id, item.aliases)?.record;
    for (const alias of item.aliases ?? []) if (alias !== item.id) delete store[alias];
    const rec = setStrengthLevel(level, Date.now(), prior);
    if (rec) store[item.id] = rec; else delete store[item.id];
    saveGradeStore(store, user);
    setGrades({ ...store });
  };

  // Above Mastered: mark a word so easy it should never be reviewed again.
  const applyPermanent = (item: CatalogItem) => {
    const store = loadGradeStore(user);
    const prior = progressEntryForId(store, item.id, item.aliases)?.record;
    for (const alias of item.aliases ?? []) if (alias !== item.id) delete store[alias];
    store[item.id] = recordPermanent(Date.now(), prior);
    saveGradeStore(store, user);
    setGrades({ ...store });
  };

  // Bulk actions apply to every selected item in one load/save cycle.
  const bulkApplyStatus = (status: ItemStatus) => {
    const targets = catalog.filter((i) => selected.has(i.id));
    if (targets.length === 0) return;
    const next = setItemsStatus(targets.map((i) => ({ id: i.id, aliases: i.aliases })), status, user);
    setGrades({ ...next });
  };

  const bulkApplyPermanent = () => {
    const targets = catalog.filter((i) => selected.has(i.id));
    if (targets.length === 0) return;
    const store = loadGradeStore(user);
    for (const item of targets) {
      const prior = progressEntryForId(store, item.id, item.aliases)?.record;
      for (const alias of item.aliases ?? []) if (alias !== item.id) delete store[alias];
      store[item.id] = recordPermanent(Date.now(), prior);
    }
    saveGradeStore(store, user);
    setGrades({ ...store });
  };

  if (catalog.length === 0) {
    return (
      <section className="card p-5 sm:p-6">
        <h2 className="text-xl font-black tracking-tight text-[var(--text-1)]">{ui("Word & sentence tracker")}</h2>
        <p className="mt-2 text-sm font-semibold text-[var(--text-3)]">{ui("Loading your vocabulary catalog…")}</p>
      </section>
    );
  }

  return (
    <section className="card p-5 sm:p-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="text-xl font-black tracking-tight text-[var(--text-1)]">{ui("Word & sentence tracker")}</h2>
          <p className="mt-1 text-sm font-semibold text-[var(--text-3)]">
            {ui("Review what you know, mark struggles, or reset items back to learn again.")}
          </p>
        </div>
        <div className="flex flex-wrap gap-2 text-center">
          <div className="rounded-2xl bg-[var(--success-bg)] px-3 py-2">
            <p className="text-lg font-black leading-none text-[var(--success-text)]">{counts.counting.toLocaleString()}</p>
            <p className="mt-1 text-[10px] font-black text-[var(--success-text)] opacity-80">{ui("counting now")}</p>
            {counts.counting !== counts.known && (
              <p className="mt-0.5 text-[10px] font-bold text-[var(--success-text)] opacity-60">
                {ui("of")} {counts.known.toLocaleString()} {ui("learned")}
              </p>
            )}
          </div>
          <div className="rounded-2xl bg-amber-500/10 px-3 py-2">
            <p className="text-lg font-black leading-none text-amber-600">{counts.fading.toLocaleString()}</p>
            <p className="mt-1 text-[10px] font-black text-amber-600 opacity-80">{ui("fading")}</p>
          </div>
          <div className="rounded-2xl bg-[var(--accent-dim)] px-3 py-2">
            <p className="text-lg font-black leading-none text-[var(--accent)]">{counts.due}</p>
            <p className="mt-1 text-[10px] font-black text-[var(--accent)] opacity-80">{ui("due review")}</p>
          </div>
          <div className="rounded-2xl bg-amber-500/15 px-3 py-2">
            <p className="text-lg font-black leading-none text-amber-600">{counts.struggle}</p>
            <p className="mt-1 text-[10px] font-black text-amber-600 opacity-80">{ui("struggling")}</p>
          </div>
          <div className="rounded-2xl bg-[var(--surface-2)] px-3 py-2">
            <p className="text-lg font-black leading-none text-[var(--text-1)]">{counts.new}</p>
            <p className="mt-1 text-[10px] font-black text-[var(--text-3)]">{ui("to learn")}</p>
          </div>
        </div>
      </div>

      <HowCountingWorks fading={counts.fading} onShowFading={() => { setFilter("fading"); resetList(); }} />

      <CustomContentEditor />

      <div className="mt-5 flex flex-wrap items-center gap-2">
        <SelectBox
          checked={allFilteredSelected}
          indeterminate={someFilteredSelected && !allFilteredSelected}
          onClick={toggleSelectAllFiltered}
          label={allFilteredSelected
            ? ui("Deselect all")
            : uiIsGerman()
              ? `Alle ${filtered.length} angezeigten Einträge auswählen`
              : `Select all ${filtered.length} shown`}
          size="h-8 w-8"
        />
        {FILTERS.map((f) => (
          <button
            key={f.key}
            type="button"
            onClick={() => { setFilter(f.key); resetList(); }}
            className={cn(
              "rounded-full px-3 py-1.5 text-xs font-black transition-colors",
              filter === f.key
                ? "bg-[var(--accent)] text-white"
                : "bg-[var(--surface-2)] text-[var(--text-2)] hover:bg-[var(--surface-3)]"
            )}
          >
            {ui(f.label)}
          </button>
        ))}
        <p className="ml-auto text-xs font-bold text-[var(--text-3)]">
          {filtered.length.toLocaleString()} {ui("of")} {catalog.length.toLocaleString()} {ui("items")}
        </p>
      </div>

      <div className="mt-3 grid grid-cols-1 gap-3 rounded-2xl border border-[var(--border)] bg-[var(--surface-2)] p-3 sm:grid-cols-2">
        <label className="min-w-0">
          <span className="mb-1 block text-[10px] font-black uppercase tracking-[0.12em] text-[var(--text-3)]">{ui("Item type")}</span>
          <select
            className="h-10 w-full rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3 text-xs font-black text-[var(--text-1)] outline-none focus:border-[var(--accent)]"
            onChange={(event) => { setItemTypeFilter(event.target.value as ItemTypeFilter); resetList(); }}
            value={itemTypeFilter}
          >
            {ITEM_TYPE_FILTERS.map((option) => (
              <option key={option.key} value={option.key}>{ui(option.label)}</option>
            ))}
          </select>
        </label>
        <label className="min-w-0">
          <span className="mb-1 block text-[10px] font-black uppercase tracking-[0.12em] text-[var(--text-3)]">{ui("Usefulness")}</span>
          <select
            className="h-10 w-full rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3 text-xs font-black text-[var(--text-1)] outline-none focus:border-[var(--accent)]"
            onChange={(event) => { setUsefulnessFilter(event.target.value as UsefulnessFilter); resetList(); }}
            value={usefulnessFilter}
          >
            {USEFULNESS_FILTERS.map((option) => (
              <option key={option.key} value={option.key}>{ui(option.label)}</option>
            ))}
          </select>
        </label>
        <label className="min-w-0">
          <span className="mb-1 block text-[10px] font-black uppercase tracking-[0.12em] text-[var(--text-3)]">{ui("Sort by")}</span>
          <select
            className="h-10 w-full rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3 text-xs font-black text-[var(--text-1)] outline-none focus:border-[var(--accent)]"
            onChange={(event) => { setSort(event.target.value as SortKey); resetList(); }}
            value={sort}
          >
            {SORTS.map((option) => (
              <option key={option.key} value={option.key}>{ui(option.label)}</option>
            ))}
          </select>
        </label>
        <label className="min-w-0">
          <span className="mb-1 block text-[10px] font-black uppercase tracking-[0.12em] text-[var(--text-3)]">{ui("Search")}</span>
          <span className="relative block">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--text-3)]" />
            <input
              value={query}
              onChange={(e) => { setQuery(e.target.value); resetList(); }}
              placeholder={ui("German or English…")}
              className="h-10 w-full rounded-xl border border-[var(--border)] bg-[var(--surface)] pl-9 pr-3 text-sm font-bold text-[var(--text-1)] outline-none focus:border-[var(--accent)]"
            />
          </span>
        </label>
      </div>

      <p className="mt-2 text-[11px] font-bold text-[var(--text-3)]">
        {sort === "common"
          ? ui("Most common first uses conversation usefulness, curriculum order, and then word frequency. Niche and extra-practice material stays later.")
          : ui("Filters and sorting apply to the full tracker, not only the rows currently visible.")}
      </p>

      {selected.size > 0 && (
        <div className="mt-3 flex flex-wrap items-center gap-2 rounded-2xl border border-[var(--accent)]/30 bg-[var(--accent-dim)] px-4 py-3">
          <span className="text-xs font-black text-[var(--accent)]">
            {selected.size} {ui("selected")}
          </span>
          <div className="ml-auto flex flex-wrap items-center gap-1.5">
            <BulkActionButton tone="known" icon={CheckCircle2} label={ui("Known")} onClick={() => bulkApplyStatus("known")} />
            <BulkActionButton tone="struggle" icon={AlertTriangle} label={ui("Struggle")} onClick={() => bulkApplyStatus("struggle")} />
            <BulkActionButton tone="new" icon={Circle} label={ui("To learn")} onClick={() => bulkApplyStatus("new")} />
            <BulkActionButton tone="permanent" icon={Star} label={ui("Permanent")} onClick={bulkApplyPermanent} />
            <button
              type="button"
              onClick={clearSelection}
              className="inline-flex h-8 items-center gap-1 rounded-full px-2.5 text-[11px] font-black text-[var(--text-3)] hover:text-[var(--text-1)]"
            >
              <XIcon className="h-3.5 w-3.5" />
              {ui("Clear")}
            </button>
          </div>
        </div>
      )}

      <div
        ref={listRef}
        className="mt-4 h-[min(34rem,65vh)] min-h-[24rem] overflow-y-auto overscroll-contain rounded-2xl border border-[var(--border)] bg-[var(--surface)] px-4"
        aria-label={ui("Word & sentence tracker")}
        tabIndex={0}
      >
        <div className="divide-y divide-[var(--border)]">
          {visible.map((item) => {
            const status = statusForId(grades, item.id, item.aliases);
            const primaryText = uiIsGerman() ? item.en : item.de;
            const meaningText = uiIsGerman() ? item.de : item.en;
            const usefulness = priorityIndex.get(item)?.info ?? conversationPriorityInfo(item.partKey);
            return (
              <div key={item.id} className="flex flex-wrap items-center gap-3 py-3">
                <SelectBox
                  checked={selected.has(item.id)}
                  onClick={() => toggleSelect(item.id)}
                  label={`${selected.has(item.id) ? ui("Deselect") : ui("Select")} ${primaryText}`}
                />
                <button
                  type="button"
                  onClick={() => speak(primaryText)}
                  aria-label={ui(uiIsGerman() ? "Play English audio" : "Play German audio")}
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[var(--surface-2)] text-[var(--accent)] hover:bg-[var(--surface-3)]"
                >
                  <Volume2 className="h-4 w-4" />
                </button>
                <div className="min-w-0 flex-1">
                  <div className="flex min-w-0 flex-wrap items-center gap-2">
                    <p className="min-w-0 flex-1 truncate text-sm font-black text-[var(--text-1)]">{primaryText}</p>
                    <span
                      className={cn(
                        "shrink-0 rounded-full border px-2 py-0.5 text-[9px] font-black uppercase tracking-[0.08em]",
                        usefulnessTone[usefulness.key]
                      )}
                      title={ui(usefulness.hint)}
                    >
                      {ui(usefulness.label)}
                    </span>
                  </div>
                  <p className="truncate text-xs font-semibold text-[var(--text-3)]">
                    {meaningText} · {ui(item.partLabel)}
                    {!uiIsGerman() && item.use ? ` · ${ui(item.use)}` : ""}
                    {!uiIsGerman() && (() => {
                        const syn = synonymNote(item.lookup);
                        if (syn) return <span className={syn.kind === "rare" ? "font-black text-amber-600" : "font-black text-sky-600"} title={ui(syn.hint)}> · {ui(syn.label)}</span>;
                        const f = frequencyInfo(item.lookup);
                        return f ? <span className="font-black text-sky-600" title={ui(f.hint)}> · {ui(f.label)}</span> : null;
                      })()}
                    {!uiIsGerman() && (() => {
                        const note = packMeta(item.partKey).note;
                        return note ? <span className="font-black text-violet-500"> · {ui(note)}</span> : null;
                      })()}
                  </p>
                  <StrengthMeter
                    record={recordFor(grades, item.id, item.aliases)}
                    onSetLevel={(level) => applyStrength(item, level)}
                    onSetPermanent={() => applyPermanent(item)}
                  />
                </div>
                <div className="flex flex-wrap items-center gap-1.5">
                  <StatusButton
                    tone="known" icon={CheckCircle2} label={ui("Known")}
                    active={status === "known"}
                    onClick={() => apply(item, status === "known" ? "new" : "known")}
                  />
                  <StatusButton
                    tone="struggle" icon={AlertTriangle} label={ui("Struggle")}
                    active={status === "struggle"}
                    onClick={() => apply(item, status === "struggle" ? "new" : "struggle")}
                  />
                  <StatusButton
                    tone="new" icon={Circle} label={ui("To learn")}
                    active={status === "new"}
                    onClick={() => apply(item, "new")}
                  />
                </div>
              </div>
            );
          })}
        </div>

        {filtered.length === 0 && (
          <p className="py-8 text-center text-sm font-semibold text-[var(--text-3)]">{ui("No items match this filter.")}</p>
        )}

        {visible.length < filtered.length && (
          <div
            ref={loadMoreRef}
            className="flex h-10 items-center justify-center text-xs font-bold text-[var(--text-3)]"
            role="status"
          >
            {ui("Loading more…")}
          </div>
        )}
      </div>
    </section>
  );
}
