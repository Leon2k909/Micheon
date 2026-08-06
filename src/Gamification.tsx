import React, { lazy, Suspense, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import {
  BarChart3,
  BookOpen,
  CalendarDays,
  Camera,
  Check,
  X,
  Search,
  RotateCcw,
  Flame,
  Pencil,
  ShieldCheck,
  Target,
  Trophy,
  LogOut,
  Zap,
  Languages,
  MoonStar,
  Paintbrush,
  Palette,
  Monitor,
  Layers,
  HardDrive,
  PawPrint,
  Accessibility,
  Contrast,
} from "lucide-react";
import { setAuthUser, UserProfile } from "@/lib/profileStorage";

/** Read an image file, downscale it, and return a small JPEG data URL for local storage. */
async function fileToAvatarDataUrl(file: File, max = 256): Promise<string> {
  const dataUrl = await new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
  const img = await new Promise<HTMLImageElement>((resolve, reject) => {
    const i = new Image();
    i.onload = () => resolve(i);
    i.onerror = reject;
    i.src = dataUrl;
  });
  const scale = Math.min(1, max / Math.max(img.width, img.height));
  const w = Math.max(1, Math.round(img.width * scale));
  const h = Math.max(1, Math.round(img.height * scale));
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d");
  if (!ctx) return dataUrl;
  ctx.drawImage(img, 0, 0, w, h);
  return canvas.toDataURL("image/jpeg", 0.85);
}
import { detectEnglishVariant, englishVariantLabel, getEnglishVariant, resolveEnglishVariant, setEnglishVariant, type EnglishVariant } from "@/lib/englishVariant";
import { FluencyMeter } from "@/components/FluencyMeter";
import { getFluency, countKnownVocab } from "@/lib/fluency";
import { THEME_CHANGE_EVENT, getThemePreference, setTheme, systemTheme, type ThemePreference } from "@/lib/theme";
import {
  ACCENT_CHANGE_EVENT,
  ACCENT_PRESETS,
  DEFAULT_ACCENT,
  getAccentColour,
  isDefaultAccent,
  normaliseHex,
  resetAccentColour,
  setAccentColour,
} from "@/lib/accentColour";
import { getEffects, setEffects, type Effects } from "@/lib/effects";
import { getCompanion, setCompanion, type Companion } from "@/lib/companion";
import { getLearningDirection, setLearningDirection, type LearningDirection } from "@/lib/direction";
import { VoicePicker } from "@/components/VoicePicker";
import { UpdateStatusCard } from "@/components/UpdateStatusCard";
import { SettingsCategory } from "@/components/SettingsCategory";
import { DataAndStorage } from "@/components/DataAndStorage";
import { AppZoomControl } from "@/components/AppZoomControl";
import { applyHighContrast, getHighContrast } from "@/lib/highContrast";
import { WindowsAppSettings } from "@/components/WindowsAppSettings";
import { LearningModePicker } from "@/components/LearningModePicker";
import { FlashcardModePicker } from "@/components/FlashcardModePicker";
import { getFlashcardFace, getFlashcardMode, setFlashcardFace, setFlashcardMode, type FlashcardFace, type FlashcardMode } from "@/lib/flashcardMode";
import { ActivityCard } from "@/components/lab/ActivityCard";
import { cn } from "@/lib/utils";
import { AUDIO_SETTINGS_EVENT, getTtsSpeechRate, setTtsSpeechRate, TTS_SPEED_PRESETS } from "@/lib/audioMute";
import { getLearningMode, setLearningMode, type LearningMode } from "@/lib/learningMode";
import {
  clearGuidedCustomBackground,
  getGuidedBackground,
  getGuidedCustomBackground,
  saveGuidedCustomBackground,
  setGuidedBackground as saveGuidedBackground,
  type GuidedBackground,
} from "@/lib/guidedBackground";
import { ui, uiIsGerman } from "@/lib/i18n";

const CodexPetPicker = lazy(() => import("@/components/codexPets/CodexPetPicker")
  .then((module) => ({ default: module.CodexPetPicker })));
const loadVocabTrackerModule = () => import("@/components/lab/VocabTracker");
const VocabTracker = lazy(() => loadVocabTrackerModule()
  .then((module) => ({ default: module.VocabTracker })));

function scheduleProfileIdleWork(task: () => void, timeout = 1200): () => void {
  const idleWindow = window as Window & typeof globalThis & {
    requestIdleCallback?: (callback: IdleRequestCallback, options?: IdleRequestOptions) => number;
    cancelIdleCallback?: (handle: number) => void;
  };
  if (idleWindow.requestIdleCallback) {
    const handle = idleWindow.requestIdleCallback(task, { timeout });
    return () => idleWindow.cancelIdleCallback?.(handle);
  }
  const timer = window.setTimeout(task, 120);
  return () => window.clearTimeout(timer);
}

function ProfileSectionLoading({ embedded = false, label }: { embedded?: boolean; label: string }) {
  return (
    <div
      aria-label={label}
      className={cn(
        "flex min-h-[190px] flex-col justify-center overflow-hidden p-5 sm:p-6",
        embedded ? "rounded-[24px] bg-[var(--surface-2)]" : "card"
      )}
      role="status"
    >
      <div className="h-4 w-36 rounded-full bg-[var(--surface-3)] motion-safe:animate-pulse" />
      <div className="mt-3 h-3 w-64 max-w-full rounded-full bg-[var(--surface-3)] motion-safe:animate-pulse" />
      <div className="mt-6 grid gap-3 sm:grid-cols-3">
        {[0, 1, 2].map((item) => (
          <span
            aria-hidden="true"
            className="h-14 rounded-[16px] bg-[var(--surface)] motion-safe:animate-pulse"
            key={item}
          />
        ))}
      </div>
      <span className="sr-only">{label}</span>
    </div>
  );
}

function DeferredProfileSection({
  children,
  className,
  fallback,
  minHeight = 240,
  onReveal,
}: {
  children: React.ReactNode;
  className?: string;
  fallback: React.ReactNode;
  minHeight?: number;
  onReveal?: () => void;
}) {
  const anchorRef = useRef<HTMLDivElement | null>(null);
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    if (revealed) return undefined;
    const anchor = anchorRef.current;
    if (!anchor) return undefined;

    const reveal = () => {
      onReveal?.();
      setRevealed(true);
    };
    if (!("IntersectionObserver" in window)) {
      reveal();
      return undefined;
    }

    const observer = new IntersectionObserver(([entry]) => {
      if (!entry?.isIntersecting) return;
      observer.disconnect();
      reveal();
      // Reach well ahead of the scroll so a heavy section is already
      // loading by the time it appears, instead of starting on arrival.
    }, { rootMargin: "2400px 0px", threshold: 0.01 });
    observer.observe(anchor);
    return () => observer.disconnect();
  }, [onReveal, revealed]);

  return (
    <div className={className} ref={anchorRef} style={revealed ? undefined : { minHeight }}>
      {revealed ? children : fallback}
    </div>
  );
}

export type GamificationStats = {
  totalXp: number;
  sessionsCompleted: number;
  totalReviews: number;
  streak: number;
  externalWords: number;
};

type Stats = GamificationStats;

type Level = { level: number; label: string; xpRequired: number };

const LEVELS: Level[] = [
  { level: 1, label: "Getting started", xpRequired: 0 },
  { level: 2, label: "Warming up", xpRequired: 100 },
  { level: 3, label: "Finding a rhythm", xpRequired: 300 },
  { level: 4, label: "In the groove", xpRequired: 650 },
  { level: 5, label: "Committed", xpRequired: 1100 },
  { level: 6, label: "Dedicated", xpRequired: 1800 },
  { level: 7, label: "Relentless", xpRequired: 2800 },
  { level: 8, label: "Unstoppable", xpRequired: 4200 },
  // Level 8 used to be the ceiling, which meant the most committed learners hit
  // the top and then had nothing left to climb. The ladder now runs to 20, with
  // the gaps widening so late levels stay meaningful rather than trickling past.
  { level: 9, label: "Fluent in the making", xpRequired: 6000 },
  { level: 10, label: "Conversational", xpRequired: 8200 },
  { level: 11, label: "Holding your own", xpRequired: 11000 },
  { level: 12, label: "Comfortable", xpRequired: 14500 },
  { level: 13, label: "Quick on your feet", xpRequired: 18500 },
  { level: 14, label: "Thinking in German", xpRequired: 23000 },
  { level: 15, label: "Hard to catch out", xpRequired: 28000 },
  { level: 16, label: "At home in the language", xpRequired: 34000 },
  { level: 17, label: "Reading between the lines", xpRequired: 41000 },
  { level: 18, label: "Rarely surprised", xpRequired: 49000 },
  { level: 19, label: "Near-native", xpRequired: 58000 },
  { level: 20, label: "Muttersprachler-Niveau", xpRequired: 70000 },
];

export const MILESTONES = [
  {
    id: "first_session",
    label: "First lesson",
    desc: "Complete one guided lesson.",
    target: 1,
    unit: "lesson",
    current: (s: Stats) => s.sessionsCompleted,
    check: (s: Stats) => s.sessionsCompleted >= 1,
  },
  {
    id: "streak_3",
    label: "Three-day streak",
    desc: "Return for three separate days.",
    target: 3,
    unit: "days",
    current: (s: Stats) => s.streak,
    check: (s: Stats) => s.streak >= 3,
  },
  {
    id: "reviews_50",
    label: "50 review items",
    desc: "Build recognition through recall.",
    target: 50,
    unit: "reviews",
    current: (s: Stats) => s.totalReviews,
    check: (s: Stats) => s.totalReviews >= 50,
  },
  {
    id: "xp_500",
    label: "500 XP",
    desc: "Show steady practice momentum.",
    target: 500,
    unit: "XP",
    current: (s: Stats) => s.totalXp,
    check: (s: Stats) => s.totalXp >= 500,
  },
  {
    id: "words_200",
    label: "200 tracked words",
    desc: "Combine lessons and word-bank items.",
    target: 200,
    unit: "words",
    current: (s: Stats) => countKnownVocab(undefined, s.externalWords),
    check: (s: Stats) => countKnownVocab(undefined, s.externalWords) >= 200,
  },
  {
    id: "week",
    label: "Seven-day rhythm",
    desc: "Keep a full week of returns.",
    target: 7,
    unit: "days",
    current: (s: Stats) => s.streak,
    check: (s: Stats) => s.streak >= 7,
  },
  {
    id: "lessons_10",
    label: "10 lessons complete",
    desc: "Build a dependable learning routine.",
    target: 10,
    unit: "lessons",
    current: (s: Stats) => s.sessionsCompleted,
    check: (s: Stats) => s.sessionsCompleted >= 10,
  },
  {
    id: "reviews_250",
    label: "250 review items",
    desc: "Strengthen useful language through recall.",
    target: 250,
    unit: "reviews",
    current: (s: Stats) => s.totalReviews,
    check: (s: Stats) => s.totalReviews >= 250,
  },
  {
    id: "xp_2500",
    label: "2,500 XP",
    desc: "Keep making steady progress across activities.",
    target: 2500,
    unit: "XP",
    current: (s: Stats) => s.totalXp,
    check: (s: Stats) => s.totalXp >= 2500,
  },
  {
    id: "words_1000",
    label: "1,000 tracked words",
    desc: "Grow a broad base for everyday conversation.",
    target: 1000,
    unit: "words",
    current: (s: Stats) => countKnownVocab(undefined, s.externalWords),
    check: (s: Stats) => countKnownVocab(undefined, s.externalWords) >= 1000,
  },
  {
    id: "streak_30",
    label: "30-day streak",
    desc: "Return regularly for a full month.",
    target: 30,
    unit: "days",
    current: (s: Stats) => s.streak,
    check: (s: Stats) => s.streak >= 30,
  },
  {
    id: "lessons_100",
    label: "100 lessons complete",
    desc: "Turn regular practice into lasting experience.",
    target: 100,
    unit: "lessons",
    current: (s: Stats) => s.sessionsCompleted,
    check: (s: Stats) => s.sessionsCompleted >= 100,
  },
] as const;

export function getLevelInfo(xp: number) {
  let cur = LEVELS[0];
  let nxt: Level | null = LEVELS[1];
  for (let i = 0; i < LEVELS.length; i += 1) {
    if (xp >= LEVELS[i].xpRequired) {
      cur = LEVELS[i];
      nxt = LEVELS[i + 1] ?? null;
    }
  }
  const into = xp - cur.xpRequired;
  const needed = nxt ? nxt.xpRequired - cur.xpRequired : 1;
  const pct = nxt ? Math.min(100, Math.round((into / needed) * 100)) : 100;
  return { cur, nxt, pct, into, needed };
}

export function XpBar({ totalXp, streak }: { totalXp: number; streak: number }) {
  const { cur, pct } = getLevelInfo(totalXp);
  return (
    <div className="flex items-center gap-2 rounded-full bg-[var(--surface)] px-3 py-2 text-xs font-black text-[var(--text-1)]">
      <Flame className="h-4 w-4 text-[var(--orange)]" />
      <span>{streak}</span>
      <span className="h-1 w-1 rounded-full bg-[var(--border-2)]" />
      <span>Lv {cur.level}</span>
      <div className="h-1.5 w-16 rounded-full bg-[var(--surface-3)]">
        <div className="h-full rounded-full bg-[var(--accent)]" style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

function StatCard({ icon: Icon, label, value, color }: {
  icon: React.ElementType;
  label: string;
  value: string;
  color: string;
}) {
  return (
    <div className="card p-5">
      <div className="flex items-center justify-between">
        <div className={`flex h-11 w-11 items-center justify-center rounded-2xl ${color} ${color.includes("--ink") ? "text-[var(--ink-text)]" : "text-white"}`}>
          <Icon className="h-5 w-5" />
        </div>
      </div>
      <p className="mt-5 text-3xl font-black tracking-tight text-[var(--text-1)]">{value}</p>
      <p className="mt-1 text-sm font-semibold text-[var(--text-3)]">{label}</p>
    </div>
  );
}


/**
 * What lives inside each settings category.
 *
 * Search has to find "dark mode" or "tyre" or "streak" without the learner
 * knowing which drawer it is in, and the categories are collapsed by default
 * so their contents are not in the DOM to search. This is that index, kept
 * beside the categories it describes.
 */
const SETTINGS_SEARCH_INDEX: Record<string, string> = {
  Appearance: "theme dark mode light night colour color accent green button brand lesson background scenery monkey garden dawn plain canvas wallpaper zoom bigger smaller text size",
  Accessibility: "high contrast motion reduce animation calmer speech speed slower faster voice rate readable",
  "Desktop app & updates": "startup launch login boot close button tray minimise minimize quit update version install check",
  "Learning options": "learning style direction german english words learned elsewhere external vocabulary count mode",
  Flashcards: "flashcard card side front back reveal flip order behaviour",
  "Language & voice": "english spelling british american tyre tire colour spoken voice speaker accent app language german deutsch tts pronunciation",
  "Pet & mascot": "pet mascot monkey desk companion talk frequency messages tips questions greetings mute hide",
  "Data & storage": "data storage space disk size used delete remove clear erase wipe cache reset progress download install uninstall language pack privacy gdpr",
};

/** Fold accents and case so "farbe" and "Färbe" both match. */
function foldSearch(value: string) {
  return value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
}

function ProgressSummaryCard({
  cur,
  nxt,
  pct,
  into,
  needed,
  stats,
  words,
  earned,
  vocab,
}: {
  cur: Level;
  nxt: Level | null;
  pct: number;
  into: number;
  needed: number;
  stats: Stats;
  words: number;
  earned: number;
  vocab: number;
}) {
  const nextMilestone = MILESTONES.find((item) => !item.check(stats));
  const fluency = getFluency(vocab);

  return (
    <section className="card flex min-w-0 flex-col justify-between overflow-hidden p-5 sm:p-6">
      <div>
        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded-full bg-[var(--accent-dim)] px-3 py-1 text-xs font-black text-[var(--accent)]">
            {ui(fluency.cur.label)}
          </span>
          <span className="rounded-full bg-[var(--surface-2)] px-3 py-1 text-xs font-black text-[var(--text-2)]">
            {ui("Practice Lv")} {cur.level}
          </span>
        </div>
        <h1 className="mt-5 text-3xl font-black leading-tight tracking-tight text-[var(--text-1)]">
          {ui(uiIsGerman() ? "Your English progress" : "Your German progress")}
        </h1>
        <p className="mt-3 text-sm font-semibold leading-6 text-[var(--text-2)]">
          {ui("Your level, next target, and practice momentum in one place.")}
        </p>
      </div>

      <div className="mt-6">
        <FluencyMeter vocab={vocab} />
      </div>

      <div className="mt-4 grid grid-cols-3 gap-3">
        {[
          { label: "XP", value: stats.totalXp.toLocaleString() },
          { label: ui("Words"), value: words.toLocaleString() },
          { label: ui("Milestones"), value: `${earned}/6` },
        ].map((item) => (
          <div className="rounded-[18px] bg-[var(--surface-2)] p-3" key={item.label}>
            <p className="text-lg font-black leading-none text-[var(--text-1)]">{item.value}</p>
            <p className="mt-1 text-[11px] font-semibold text-[var(--text-3)]">{item.label}</p>
          </div>
        ))}
      </div>

      <div className="mt-4 rounded-[20px] p-4 text-white" style={{ background: "var(--feature-gradient)" }}>
        <div className="flex items-start gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/12">
            <Target className="h-4 w-4" />
          </div>
          <div className="min-w-0">
            <p className="text-xs font-bold opacity-70">{ui("Next target")}</p>
            <p className="mt-1 text-sm font-black">{ui(nextMilestone?.label ?? "Keep the rhythm")}</p>
            <p className="mt-1 text-xs font-semibold leading-5 opacity-75">
              {ui(nextMilestone?.desc ?? "You have reached every current milestone.")}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

function ActivitySidePanel({ stats, words, earned }: { stats: Stats; words: number; earned: number }) {
  return (
    <aside className="card flex min-w-0 flex-col justify-between p-5 sm:p-6">
      <div>
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-sm font-black text-[var(--text-1)]">{ui("This week")}</p>
            <p className="mt-1 text-xs font-semibold text-[var(--text-3)]">{ui("Quick read on your practice rhythm.")}</p>
          </div>
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[var(--accent-dim)] text-[var(--accent)]">
            <CalendarDays className="h-5 w-5" />
          </div>
        </div>

        <div className="mt-6 space-y-3">
          {[
            { label: ui("Day streak"), value: `${stats.streak}`, tone: "bg-[var(--orange)]" },
            { label: ui("Sessions"), value: `${stats.sessionsCompleted}`, tone: "bg-[var(--mint)]" },
            { label: ui("Milestones"), value: `${earned}/6`, tone: "bg-[var(--accent)]" },
          ].map((item) => (
            <div className="rounded-[18px] bg-[var(--surface-2)] p-4" key={item.label}>
              <div className="flex items-center justify-between gap-3">
                <p className="text-xs font-bold text-[var(--text-3)]">{item.label}</p>
                <span className={`h-2.5 w-2.5 rounded-full ${item.tone}`} />
              </div>
              <p className="mt-2 text-2xl font-black tracking-tight text-[var(--text-1)]">{item.value}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-4 rounded-[20px] p-4 text-white" style={{ background: "var(--feature-gradient)" }}>
        <p className="text-xs font-bold opacity-70">{ui("Words tracked")}</p>
        <p className="mt-1 text-3xl font-black tracking-tight">{words.toLocaleString()}</p>
        <p className="mt-3 text-xs font-semibold opacity-75">
          {ui("Keep short daily blocks going before adding longer review sessions.")}
        </p>
      </div>
    </aside>
  );
}

export default function GamificationPanel({
  stats,
  user,
  onUpdateStats,
  profileOnly = false,
  apiParts = {},
  onRequestCatalogue,
  onSwitchCourse,
  activeCourseName = "German",
}: {
  stats: Stats;
  user: UserProfile;
  onUpdateStats?: (next: Partial<Stats>) => void;
  profileOnly?: boolean;
  apiParts?: Record<string, any>;
  onRequestCatalogue?: () => void;
  onSwitchCourse?: () => void;
  activeCourseName?: string;
}) {
  const [externalInput, setExternalInput] = useState(stats.externalWords.toString());
  const [isEditingName, setIsEditingName] = useState(false);
  const [newName, setNewName] = useState(user.name);
  const [effects, setEffects] = useState<Effects>(getEffects);
  const [highContrast, setHighContrastState] = useState<boolean>(getHighContrast);
  const [companion, setCompanionState] = useState<Companion>(getCompanion);
  const [direction, setDirectionState] = useState<LearningDirection>(getLearningDirection);
  const [learningMode, setLearningModeState] = useState<LearningMode>(getLearningMode);
  const [flashcardMode, setFlashcardModeState] = useState<FlashcardMode>(() => getFlashcardMode());
  const [flashcardFace, setFlashcardFaceState] = useState<FlashcardFace>(() => getFlashcardFace());
  const [englishVariant, setEnglishVariantState] = useState<EnglishVariant>(() => getEnglishVariant(user));
  const [speechRate, setSpeechRateState] = useState<number>(() => getTtsSpeechRate());
  const [settingsQuery, setSettingsQuery] = useState("");
  const settingsSearchRef = useRef<HTMLInputElement | null>(null);
  const settingsTerms = useMemo(
    () => foldSearch(settingsQuery).split(/\s+/).filter(Boolean),
    [settingsQuery]
  );
  /** Does this category match what has been typed? */
  const matchesSearch = (title: string, description: string) => {
    if (!settingsTerms.length) return true;
    const haystack = foldSearch([title, description, SETTINGS_SEARCH_INDEX[title] ?? ""].join(" "));
    return settingsTerms.every((term: string) => haystack.includes(term));
  };
  const searchHits = useMemo(
    () => (settingsTerms.length
      ? Object.keys(SETTINGS_SEARCH_INDEX).filter((title) => matchesSearch(title, ""))
      : []),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [settingsTerms]
  );
  const [accentColour, setAccentColourState] = useState(() => getAccentColour());
  useEffect(() => {
    const sync = () => setAccentColourState(getAccentColour());
    window.addEventListener(ACCENT_CHANGE_EVENT, sync);
    window.addEventListener("storage-sync-completed", sync);
    return () => {
      window.removeEventListener(ACCENT_CHANGE_EVENT, sync);
      window.removeEventListener("storage-sync-completed", sync);
    };
  }, []);
  const [themePreference, setThemePreferenceState] = useState<ThemePreference>(() => getThemePreference());
  // Another window (or the OS, while on "system") can change the theme; keep
  // the chosen option in step rather than showing a stale selection.
  useEffect(() => {
    const sync = () => setThemePreferenceState(getThemePreference());
    window.addEventListener(THEME_CHANGE_EVENT, sync);
    window.addEventListener("storage-sync-completed", sync);
    return () => {
      window.removeEventListener(THEME_CHANGE_EVENT, sync);
      window.removeEventListener("storage-sync-completed", sync);
    };
  }, []);
  const [guidedBackground, setGuidedBackgroundState] = useState<GuidedBackground>(() => getGuidedBackground());
  const [guidedCustomBackground, setGuidedCustomBackground] = useState<string | null>(() => getGuidedCustomBackground());
  const [guidedBackgroundError, setGuidedBackgroundError] = useState("");

  useEffect(() => {
    const sync = () => setSpeechRateState(getTtsSpeechRate());
    window.addEventListener(AUDIO_SETTINGS_EVENT, sync);
    return () => window.removeEventListener(AUDIO_SETTINGS_EVENT, sync);
  }, []);
  const resolvedEnglishVariant = resolveEnglishVariant(englishVariant);
  const avatarInputRef = useRef<HTMLInputElement | null>(null);
  const guidedBackgroundInputRef = useRef<HTMLInputElement | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | undefined>(user.avatar);

  const onAvatarFile = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    try {
      const dataUrl = await fileToAvatarDataUrl(file);
      setAvatarPreview(dataUrl);
      setAuthUser({ ...user, avatar: dataUrl });
      window.location.reload();
    } catch {
      /* ignore unreadable image */
    }
  };

  const removeAvatar = () => {
    setAvatarPreview(undefined);
    setAuthUser({ ...user, avatar: undefined });
    window.location.reload();
  };
  const { cur, nxt, pct, into, needed } = getLevelInfo(stats.totalXp ?? 0);
  const vocab = countKnownVocab(user, stats.externalWords || 0);
  const earned = MILESTONES.filter((item) => item.check(stats)).length;
  const catalogueReady = Object.keys(apiParts).length > 0;
  const [trackerRequested, setTrackerRequested] = useState(false);
  const [trackerPrepared, setTrackerPrepared] = useState(false);
  const requestVocabTracker = useCallback(() => {
    setTrackerRequested(true);
    onRequestCatalogue?.();
  }, [onRequestCatalogue]);

  // Preload only the small tracker component while the browser is idle. The
  // multi-megabyte lesson catalogue stays deferred until its section is
  // actually reached.
  useEffect(() => {
    if (!profileOnly) return undefined;
    return scheduleProfileIdleWork(() => {
      void loadVocabTrackerModule();
    });
  }, [profileOnly]);

  // Once the learner reaches the tracker, build its immutable indexes during
  // browser idle time before mounting the interactive list. This avoids a
  // visible main-thread hitch in the middle of a scroll.
  useEffect(() => {
    if (!profileOnly || !trackerRequested || !catalogueReady) return undefined;
    let cancelled = false;
    setTrackerPrepared(false);
    const cancelIdle = scheduleProfileIdleWork(() => {
      void loadVocabTrackerModule().then((module) => {
        if (cancelled) return;
        module.prepareVocabTrackerData(apiParts);
        setTrackerPrepared(true);
      });
    });
    return () => {
      cancelled = true;
      cancelIdle();
    };
  }, [apiParts, catalogueReady, profileOnly, trackerRequested]);

  const saveName = () => {
    if (!newName.trim()) return;
    setAuthUser({ ...user, name: newName.trim() });
    setIsEditingName(false);
    window.location.reload();
  };

  const signOut = () => {
    setAuthUser(null);
    window.location.reload();
  };

  const toggleEffects = () => {
    const next: Effects = effects === "lite" ? "full" : "lite";
    setEffects(next);
    setEffects(next);
  };

  const toggleHighContrast = () => {
    const next = !highContrast;
    applyHighContrast(next);
    setHighContrastState(next);
  };

  const toggleCompanion = () => {
    const next: Companion = companion === "fr" ? "none" : "fr";
    setCompanion(next);
    setCompanionState(next);
  };

  const updateEnglishVariant = (value: EnglishVariant) => {
    setEnglishVariantState(value);
    setEnglishVariant(value, user);
  };

  const updateLearningMode = (value: LearningMode) => {
    setLearningMode(value);
    setLearningModeState(value);
  };

  const updateGuidedBackground = (value: GuidedBackground) => {
    saveGuidedBackground(value);
    setGuidedBackgroundState(getGuidedBackground());
    setGuidedBackgroundError("");
  };

  const onGuidedBackgroundFile = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;
    setGuidedBackgroundError("");
    try {
      await saveGuidedCustomBackground(file);
      const saved = getGuidedCustomBackground();
      setGuidedCustomBackground(saved);
      setGuidedBackgroundState(getGuidedBackground());
      if (!saved) setGuidedBackgroundError(ui("We couldn't save that image on this device. Try a smaller one."));
    } catch (error) {
      setGuidedBackgroundError(error instanceof Error ? error.message : ui("We couldn't prepare that image."));
    }
  };

  const removeGuidedBackgroundImage = () => {
    clearGuidedCustomBackground();
    setGuidedCustomBackground(null);
    setGuidedBackgroundState(getGuidedBackground());
    setGuidedBackgroundError("");
  };

  // Single dropdown covering "what's your language": pick an English variant to
  // learn German as an English speaker, or pick German to flip the app and learn
  // English as a German speaker.
  const LANGUAGE_SELECT_VALUE = direction === "learn-en" ? "german" : englishVariant;
  const updateLanguageSelection = (value: string) => {
    if (value === "german") {
      setLearningDirection("learn-en");
      setDirectionState("learn-en");
      return;
    }
    if (direction === "learn-en") {
      setLearningDirection("learn-de");
      setDirectionState("learn-de");
    }
    updateEnglishVariant(value as EnglishVariant);
  };

  if (profileOnly) {
    return (
      <div className="space-y-5">
        <section className="card overflow-hidden p-5 sm:p-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-sm font-black text-[var(--accent)]">{ui("Account")}</p>
              <h1 className="mt-1 text-3xl font-black tracking-tight text-[var(--text-1)]">{ui("Profile settings")}</h1>
              <p className="mt-2 max-w-2xl text-sm font-semibold leading-6 text-[var(--text-3)]">
                {ui("Manage your name, learning preferences, and words learned outside Micheon.")}
              </p>
            </div>
            <div className="flex h-16 w-16 items-center justify-center overflow-hidden rounded-full bg-[var(--accent-dim)] text-xl font-black text-[var(--accent)]">
              {avatarPreview ? <img src={avatarPreview} alt="" className="h-full w-full object-cover" /> : (user.name?.[0]?.toUpperCase() ?? "?")}
            </div>
          </div>
        </section>

        <section className="card flex flex-wrap items-center justify-between gap-4 p-5 sm:p-6">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--accent-dim)] text-[var(--accent)]">
              <BookOpen className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs font-black uppercase tracking-wide text-[var(--text-3)]">{ui("Current course")}</p>
              <p className="mt-0.5 text-lg font-black text-[var(--text-1)]">{ui(activeCourseName)}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onSwitchCourse}
            className="inline-flex items-center gap-2 rounded-full bg-[var(--accent)] px-4 py-2.5 text-sm font-black text-white transition-opacity hover:opacity-90"
          >
            {ui("Switch course")}
          </button>
        </section>

        <section className="card overflow-hidden">
          <div className="grid items-start gap-6 p-5 sm:p-6 lg:grid-cols-[1fr_1fr]">
            <div className="rounded-[24px] bg-[var(--surface-2)] p-5">
              <h2 className="text-xl font-black tracking-tight text-[var(--text-1)]">{ui("Account details")}</h2>
              <p className="mt-1 text-sm font-semibold text-[var(--text-3)]">{ui("Your photo, display name, and login email.")}</p>
              <div className="mt-5 flex items-center gap-4">
                <button
                  type="button"
                  onClick={() => avatarInputRef.current?.click()}
                  aria-label={ui("Change profile photo")}
                  className="group relative flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-full bg-[var(--accent-dim)] text-xl font-black text-[var(--accent)] ring-2 ring-[var(--surface)]"
                >
                  {avatarPreview ? (
                    <img src={avatarPreview} alt="" className="h-full w-full object-cover" />
                  ) : (
                    user.name?.[0]?.toUpperCase() ?? "?"
                  )}
                  <span className="absolute inset-0 flex items-center justify-center bg-black/45 text-white opacity-0 transition-opacity group-hover:opacity-100">
                    <Camera className="h-5 w-5" />
                  </span>
                </button>
                <div className="min-w-0 flex-1">
                  {isEditingName ? (
                    <div className="flex gap-2">
                      <input
                        autoFocus
                        className="min-w-0 flex-1 rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-sm font-bold text-[var(--text-1)] outline-none focus:border-[var(--accent)]"
                        onChange={(event) => setNewName(event.target.value)}
                        onKeyDown={(event) => event.key === "Enter" && saveName()}
                        type="text"
                        value={newName}
                      />
                      <button className="accent-btn h-10 w-10" onClick={saveName} type="button">
                        <Check className="mx-auto h-4 w-4" />
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between gap-3">
                      <div className="min-w-0">
                        <p className="truncate text-base font-black text-[var(--text-1)]">{user.name}</p>
                        <p className="truncate text-xs font-semibold text-[var(--text-3)]">{user.email}</p>
                      </div>
                      <button
                        aria-label={ui("Edit profile name")}
                        className="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--surface)] text-[var(--text-2)] hover:text-[var(--accent)]"
                        onClick={() => setIsEditingName(true)}
                        type="button"
                      >
                        <Pencil className="h-4 w-4" />
                      </button>
                    </div>
                  )}
                </div>
              </div>

              <input ref={avatarInputRef} type="file" accept="image/*" className="hidden" onChange={onAvatarFile} />
              <div className="mt-4 flex flex-wrap items-center gap-2">
                <button type="button" onClick={() => avatarInputRef.current?.click()} className="ghost-btn h-9 px-3 text-xs">
                  {ui(avatarPreview ? "Change photo" : "Upload photo")}
                </button>
                {avatarPreview && (
                  <button
                    type="button"
                    onClick={removeAvatar}
                    className="h-9 rounded-xl px-3 text-xs font-bold text-rose-500 transition-colors hover:bg-rose-500/10"
                  >
                    {ui("Remove")}
                  </button>
                )}
                <span className="text-[11px] font-semibold text-[var(--text-3)]">{ui("Square images look best. They are stored on this device.")}</span>
              </div>

              <div className="mt-5 border-t border-[var(--border)] pt-5">
                <h3 className="text-sm font-black text-[var(--text-1)]">{ui("More settings")}</h3>
                <p className="mt-1 text-xs font-semibold leading-5 text-[var(--text-3)]">
                  {ui("Sections you'll rarely need day to day. Open one to change it.")}
                </p>
                <label className="settings-search mt-4 block">
                  <Search aria-hidden="true" className="settings-search__icon" />
                  <input
                    aria-label={ui("Search settings")}
                    className="settings-search__input"
                    onChange={(event) => setSettingsQuery(event.target.value)}
                    placeholder={ui("Search settings\u2026")}
                    ref={settingsSearchRef}
                    type="search"
                    value={settingsQuery}
                  />
                  {settingsQuery && (
                    <button
                      aria-label={ui("Clear search")}
                      className="settings-search__clear"
                      onClick={() => {
                        setSettingsQuery("");
                        settingsSearchRef.current?.focus();
                      }}
                      type="button"
                    >
                      <X aria-hidden="true" />
                    </button>
                  )}
                </label>
                {settingsTerms.length > 0 && (
                  <p className="mt-2 text-xs font-semibold text-[var(--text-3)]">
                    {searchHits.length === 0
                      ? ui("Nothing matches that. Try \u201ctheme\u201d, \u201cvoice\u201d, or \u201cpet\u201d.")
                      : `${searchHits.length} ${searchHits.length === 1 ? ui("section") : ui("sections")} ${ui("match")}`}
                  </p>
                )}
                <SettingsCategory
                  description={ui("Theme, lesson background, and app zoom.")}
                  forceOpen={settingsTerms.length > 0}
                  hidden={!matchesSearch(ui("Appearance"), ui("Theme, lesson background, and app zoom."))}
                  icon={Palette}
                  title={ui("Appearance")}
                >
                  <div className="mt-3 rounded-[18px] bg-[var(--surface)] p-4">
                    <div className="flex items-start gap-2">
                      <MoonStar className="mt-0.5 h-4 w-4 shrink-0 text-[var(--accent)]" />
                      <div>
                        <p className="text-sm font-black text-[var(--text-1)]">{ui("App theme")}</p>
                        <p className="mt-1 text-xs font-semibold leading-5 text-[var(--text-3)]">
                          {ui("Light for daytime study, dark for late evenings. Lessons keep their own background either way.")}
                        </p>
                      </div>
                    </div>
                    <div aria-label={ui("App theme")} className="mt-3 grid gap-2 sm:grid-cols-3" role="radiogroup">
                      {([
                        ["light", "Light", "Sun"],
                        ["dark", "Dark", "Moon"],
                        ["system", "Match system", "Monitor"],
                      ] as const).map(([value, label]) => {
                        const active = themePreference === value;
                        return (
                          <button
                            aria-checked={active}
                            className={cn(
                              "rounded-[16px] border px-3 py-3 text-left transition-colors",
                              active
                                ? "border-[var(--accent)] bg-[var(--accent-dim)]"
                                : "border-[color:var(--card-edge)] bg-[var(--surface-2)] hover:bg-[var(--surface-3)]"
                            )}
                            key={value}
                            onClick={() => {
                              setTheme(value);
                              setThemePreferenceState(value);
                            }}
                            role="radio"
                            type="button"
                          >
                            <span className={cn(
                              "block text-sm font-black",
                              active ? "text-[var(--accent-strong,var(--accent))]" : "text-[var(--text-1)]"
                            )}>
                              {ui(label)}
                            </span>
                            <span className="mt-0.5 block text-[11px] font-semibold text-[var(--text-3)]">
                              {value === "system"
                                ? `${ui("Currently")} ${ui(systemTheme() === "dark" ? "dark" : "light")}`
                                : value === "dark" ? ui("Easier on tired eyes") : ui("The default")}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                  <div className="mt-3 rounded-[18px] bg-[var(--surface)] p-4">
                    <div className="flex items-start gap-2">
                      <Paintbrush className="mt-0.5 h-4 w-4 shrink-0 text-[var(--accent)]" />
                      <div>
                        <p className="text-sm font-black text-[var(--text-1)]">{ui("Accent colour")}</p>
                        <p className="mt-1 text-xs font-semibold leading-5 text-[var(--text-3)]">
                          {ui("The colour of buttons, progress and anything selected. Micheon green is the default.")}
                        </p>
                      </div>
                    </div>
                    <div aria-label={ui("Accent colour")} className="mt-3 flex flex-wrap gap-2" role="radiogroup">
                      {ACCENT_PRESETS.map((preset) => {
                        const active = normaliseHex(accentColour) === preset.hex;
                        return (
                          <button
                            aria-checked={active}
                            aria-label={ui(preset.name)}
                            className={cn(
                              "settings-swatch",
                              active && "settings-swatch--active"
                            )}
                            key={preset.hex}
                            onClick={() => {
                              setAccentColour(preset.hex);
                              setAccentColourState(preset.hex);
                            }}
                            role="radio"
                            style={{ background: preset.hex }}
                            title={ui(preset.name)}
                            type="button"
                          >
                            {active && <Check aria-hidden="true" />}
                          </button>
                        );
                      })}
                    </div>
                    <div className="mt-3 flex flex-wrap items-center gap-2">
                      <label className="settings-swatch-custom">
                        <input
                          aria-label={ui("Pick any colour")}
                          onChange={(event) => {
                            setAccentColour(event.target.value);
                            setAccentColourState(event.target.value);
                          }}
                          type="color"
                          value={normaliseHex(accentColour) ?? DEFAULT_ACCENT}
                        />
                        <span>{ui("Pick any colour")}</span>
                      </label>
                      <button
                        className="settings-reset"
                        disabled={isDefaultAccent(accentColour)}
                        onClick={() => {
                          resetAccentColour();
                          setAccentColourState(DEFAULT_ACCENT);
                        }}
                        type="button"
                      >
                        <RotateCcw aria-hidden="true" />
                        {ui("Reset to green")}
                      </button>
                    </div>
                  </div>
                  <div className="mt-3 rounded-[18px] bg-[var(--surface)] p-4">
                    <div className="flex items-start gap-2">
                      <Palette className="mt-0.5 h-4 w-4 shrink-0 text-[var(--accent)]" />
                      <div>
                        <p className="text-sm font-black text-[var(--text-1)]">{ui("Guided lesson background")}</p>
                        <p className="mt-1 text-xs font-semibold leading-5 text-[var(--text-3)]">
                          {ui("Choose the scenery behind your focused lesson. It never changes the lesson itself.")}
                        </p>
                      </div>
                    </div>
                    <div aria-label={ui("Guided lesson background")} className="mt-3 grid gap-2 sm:grid-cols-2" role="radiogroup">
                      {([
                        ["monkey", "Monkey world", "Default \u2014 a calm lesson landscape with the monkey beside you."],
                        ["garden", "Garden frame", "Flowers and foliage around a quiet centre."],
                        ["dawn", "Soft dawn", "A warm, subtle colour wash with no artwork."],
                        ["plain", "Plain canvas", "The cleanest option for distraction-free study."],
                      ] as const).map(([value, label, note]) => {
                        const active = guidedBackground === value;
                        return (
                          <button
                            aria-checked={active}
                            className={cn(
                              "rounded-2xl border px-3 py-3 text-left transition-colors",
                              active
                                ? "border-[var(--accent)] bg-[var(--accent-dim)] text-[var(--accent)]"
                                : "border-[var(--border)] bg-[var(--surface-2)] text-[var(--text-2)] hover:border-[var(--accent)]/50"
                            )}
                            key={value}
                            onClick={() => updateGuidedBackground(value)}
                            role="radio"
                            type="button"
                          >
                            <span className="block text-sm font-black">{ui(label)}</span>
                            <span className="mt-1 block text-[11px] font-semibold leading-4 text-[var(--text-3)]">{ui(note)}</span>
                          </button>
                        );
                      })}
                    </div>
                    <div className={cn(
                      "mt-2 flex flex-wrap items-center gap-3 rounded-2xl border p-3",
                      guidedBackground === "custom"
                        ? "border-[var(--accent)] bg-[var(--accent-dim)]"
                        : "border-[var(--border)] bg-[var(--surface-2)]"
                    )}>
                      <button
                        aria-pressed={guidedBackground === "custom"}
                        className={cn(
                          "flex min-w-0 flex-1 items-center gap-3 text-left",
                          !guidedCustomBackground && "cursor-default"
                        )}
                        disabled={!guidedCustomBackground}
                        onClick={() => updateGuidedBackground("custom")}
                        type="button"
                      >
                        <span
                          aria-hidden="true"
                          className="h-12 w-16 shrink-0 rounded-xl border border-black/5 bg-[var(--surface)] bg-cover bg-center shadow-sm"
                          style={guidedCustomBackground ? { backgroundImage: `url(${guidedCustomBackground})` } : undefined}
                        />
                        <span className="min-w-0">
                          <span className="block text-sm font-black text-[var(--text-1)]">{ui("Your own image")}</span>
                          <span className="mt-0.5 block text-[11px] font-semibold leading-4 text-[var(--text-3)]">
                            {ui(guidedCustomBackground ? "Use your saved image behind every guided lesson." : "Choose a photo or illustration that puts you in the right mood.")}
                          </span>
                        </span>
                      </button>
                      <input ref={guidedBackgroundInputRef} accept="image/*" className="hidden" onChange={onGuidedBackgroundFile} type="file" />
                      <button
                        className="ghost-btn h-9 shrink-0 px-3 text-xs"
                        onClick={() => guidedBackgroundInputRef.current?.click()}
                        type="button"
                      >
                        {ui(guidedCustomBackground ? "Change image" : "Upload image")}
                      </button>
                      {guidedCustomBackground && (
                        <button
                          className="h-9 shrink-0 rounded-xl px-3 text-xs font-bold text-rose-500 transition-colors hover:bg-rose-500/10"
                          onClick={removeGuidedBackgroundImage}
                          type="button"
                        >
                          {ui("Remove")}
                        </button>
                      )}
                    </div>
                    <p className="mt-2 text-[11px] font-semibold leading-4 text-[var(--text-3)]">
                      {guidedBackgroundError || ui("Your image is compressed and stored only on this device.")}
                    </p>
                  </div>
                  <AppZoomControl />
                </SettingsCategory>

                <SettingsCategory
                  description={ui("High contrast, calmer motion, and speech speed.")}
                  forceOpen={settingsTerms.length > 0}
                  hidden={!matchesSearch(ui("Accessibility"), ui("High contrast, calmer motion, and speech speed."))}
                  icon={Accessibility}
                  title={ui("Accessibility")}
                >
                  <button
                    aria-pressed={highContrast}
                    aria-label={ui("Toggle high contrast")}
                    className="mt-3 flex w-full items-start justify-between gap-3 rounded-[18px] bg-[var(--surface)] px-4 py-3 text-left"
                    onClick={toggleHighContrast}
                    type="button"
                  >
                    <span className="min-w-0">
                      <span className="flex items-center gap-2 text-sm font-black text-[var(--text-1)]">
                        <Contrast className="h-4 w-4" /> {ui("High contrast")}
                      </span>
                      <span className="mt-1 block text-xs font-semibold leading-5 text-[var(--text-3)]">
                        {ui("Stronger text and clearer edges in both light and dark mode.")}
                      </span>
                    </span>
                    <span
                      className={cn(
                        "shrink-0 rounded-full px-3 py-1 text-xs font-black",
                        highContrast ? "bg-[var(--accent)] text-white" : "bg-[var(--surface-2)] text-[var(--text-2)]"
                      )}
                    >
                      {ui(highContrast ? "On" : "Off")}
                    </span>
                  </button>

                  <button
                    aria-pressed={effects === "lite"}
                    aria-label={ui("Toggle reduced effects")}
                    className="mt-3 flex w-full items-start justify-between gap-3 rounded-[18px] bg-[var(--surface)] px-4 py-3 text-left"
                    onClick={toggleEffects}
                    type="button"
                  >
                    <span className="min-w-0">
                      <span className="flex items-center gap-2 text-sm font-black text-[var(--text-1)]">
                        <Zap className="h-4 w-4" /> {ui("Reduce effects")}
                      </span>
                      <span className="mt-1 block text-xs font-semibold leading-5 text-[var(--text-3)]">
                        {ui("Turns off glows and continuous animations to save battery on slower devices.")}
                      </span>
                    </span>
                    <span
                      className={cn(
                        "shrink-0 rounded-full px-3 py-1 text-xs font-black",
                        effects === "lite" ? "bg-[var(--accent)] text-white" : "bg-[var(--surface-2)] text-[var(--text-2)]"
                      )}
                    >
                      {ui(effects === "lite" ? "On" : "Off")}
                    </span>
                  </button>

                  <div className="mt-3 rounded-[18px] bg-[var(--surface)] p-4">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <p className="text-sm font-black text-[var(--text-1)]">{ui("Speech speed")}</p>
                        <p className="mt-1 text-xs font-semibold leading-5 text-[var(--text-3)]">
                          {ui("How fast lessons, games, and the companion speak. You can also change this from the speaker menu or by right-clicking Hear it.")}
                        </p>
                      </div>
                      <span className="rounded-full bg-[var(--surface-2)] px-3 py-1 text-xs font-black text-[var(--text-2)]">
                        {speechRate}×
                      </span>
                    </div>
                    <div className="mt-3 grid grid-cols-4 gap-2 sm:grid-cols-7" role="group" aria-label={ui("Speech speed")}>
                      {TTS_SPEED_PRESETS.map((preset) => (
                        <button
                          aria-pressed={Math.abs(speechRate - preset) < 0.01}
                          className={cn(
                            "h-11 rounded-xl border text-sm font-bold transition-colors",
                            Math.abs(speechRate - preset) < 0.01
                              ? "border-[var(--accent)] bg-[var(--accent)]/10 text-[var(--accent)]"
                              : "border-[var(--border)] bg-[var(--surface-2)] text-[var(--text-2)] hover:border-[var(--accent)]"
                          )}
                          key={preset}
                          onClick={() => { setSpeechRateState(preset); setTtsSpeechRate(preset); }}
                          type="button"
                        >
                          {preset}×
                        </button>
                      ))}
                    </div>
                  </div>
                </SettingsCategory>

                <SettingsCategory
                  description={ui("Startup, close button, and update checks.")}
                  forceOpen={settingsTerms.length > 0}
                  hidden={!matchesSearch(ui("Desktop app & updates"), ui("Startup, close button, and update checks."))}
                  icon={Monitor}
                  title={ui("Desktop app & updates")}
                >
                  <WindowsAppSettings />

                  {/* Account-adjacent status and progress controls balance this
                      column without hiding them among the learning-mode choices. */}
                  <UpdateStatusCard />
                </SettingsCategory>

                <SettingsCategory
                  description={ui("Learning style and words learned elsewhere.")}
                  forceOpen={settingsTerms.length > 0}
                  hidden={!matchesSearch(ui("Learning options"), ui("Learning style and words learned elsewhere."))}
                  icon={BookOpen}
                  title={ui("Learning options")}
                >
                  <div className="mt-5 rounded-[18px] bg-[var(--surface)] p-4">
                    <p className="text-sm font-black text-[var(--text-1)]">{ui("External word count")}</p>
                    <p className="mt-1 text-xs font-semibold leading-5 text-[var(--text-3)]">
                      {ui("Add words learned elsewhere so the app can show a more honest vocabulary total.")}
                    </p>
                    <input
                      className="mt-3 h-11 w-full rounded-xl border border-[var(--border)] bg-[var(--surface-2)] px-3 text-sm font-bold text-[var(--text-1)] outline-none focus:border-[var(--accent)]"
                      min="0"
                      onChange={(event) => {
                        const valueString = event.target.value;
                        setExternalInput(valueString);
                        onUpdateStats?.({ externalWords: parseInt(valueString, 10) || 0 });
                      }}
                      placeholder="0"
                      type="number"
                      value={externalInput}
                    />
                  </div>

                  <LearningModePicker value={learningMode} onChange={updateLearningMode} />
                </SettingsCategory>
              </div>
            </div>

            <div className="rounded-[24px] bg-[var(--surface-2)] p-5">
              <h2 className="text-xl font-black tracking-tight text-[var(--text-1)]">{ui("Preferences")}</h2>
              <p className="mt-1 text-sm font-semibold text-[var(--text-3)]">{ui("Flashcard and language settings.")}</p>

                <SettingsCategory
                  description={ui("Which side shows first and how cards behave.")}
                  forceOpen={settingsTerms.length > 0}
                  hidden={!matchesSearch(ui("Flashcards"), ui("Which side shows first and how cards behave."))}
                  icon={Layers}
                  title={ui("Flashcards")}
                >
                  <FlashcardModePicker
                    face={flashcardFace}
                    mode={flashcardMode}
                    onFaceChange={(next) => { setFlashcardFaceState(next); setFlashcardFace(next); }}
                    onModeChange={(next) => { setFlashcardModeState(next); setFlashcardMode(next); }}
                  />
                </SettingsCategory>

                <SettingsCategory
                  description={ui("English spelling, app language, and the speaking voice.")}
                  forceOpen={settingsTerms.length > 0}
                  hidden={!matchesSearch(ui("Language & voice"), ui("English spelling, app language, and the speaking voice."))}
                  icon={Languages}
                  title={ui("Language & voice")}
                >
                  <div className="mt-5 rounded-[18px] bg-[var(--surface)] p-4">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <p className="text-sm font-black text-[var(--text-1)]">{ui("Language")}</p>
                        <p className="mt-1 text-xs font-semibold leading-5 text-[var(--text-3)]">
                          {direction === "learn-en"
                            ? ui("Learning English as a German speaker. German is shown as the meaning.")
                            : `Auto uses your browser/keyboard language. Current: ${resolvedEnglishVariant === "british" ? "British" : "American"} English.`}
                        </p>
                      </div>
                      <span className="rounded-full bg-[var(--surface-2)] px-3 py-1 text-xs font-black text-[var(--text-2)]">
                        {direction === "learn-en" ? "Deutsch" : resolvedEnglishVariant === "british" ? "practise" : "practice"}
                      </span>
                    </div>
                    <select
                      className="mt-3 h-11 w-full rounded-xl border border-[var(--border)] bg-[var(--surface-2)] px-3 text-sm font-bold text-[var(--text-1)] outline-none focus:border-[var(--accent)]"
                      onChange={(event) => updateLanguageSelection(event.target.value)}
                      value={LANGUAGE_SELECT_VALUE}
                    >
                      <option value="auto">{ui("Auto-detect")} ({ui(englishVariantLabel(detectEnglishVariant()))})</option>
                      <option value="british">{ui("British English")}</option>
                      <option value="american">{ui("American English")}</option>
                      <option value="german">Deutsch</option>
                    </select>
                    {/* Sits with the accent setting: one picks how English is
                        written and which accent is spoken, the other picks who
                        speaks it. Separating them into two cards read as two
                        unrelated things. */}
                    <VoicePicker />
                  </div>
                </SettingsCategory>
            </div>

            <DeferredProfileSection
              className="lg:col-span-2"
              fallback={<div aria-hidden="true" className="h-[72px] rounded-[24px] bg-[var(--surface-2)] motion-safe:animate-pulse" />}
              minHeight={72}
            >
              <div className="rounded-[24px] bg-[var(--surface-2)] px-5 pb-5 pt-2">
                <SettingsCategory
                  description={ui("Pick a desk pet and choose how often it talks.")}
                  forceOpen={settingsTerms.length > 0}
                  hidden={!matchesSearch(ui("Pet & mascot"), ui("Pick a desk pet and choose how often it talks."))}
                  icon={PawPrint}
                  title={ui("Pet & mascot")}
                >
                  <Suspense fallback={<ProfileSectionLoading embedded label={ui("Loading pet settings")} />}>
                    <CodexPetPicker className="mt-0 border-t-0 pt-0" />
                  </Suspense>
                </SettingsCategory>

                <SettingsCategory
                  description={ui("Space used, and deleting what Micheon has saved.")}
                  forceOpen={settingsTerms.length > 0}
                  hidden={!matchesSearch(ui("Data & storage"), ui("Space used, and deleting what Micheon has saved."))}
                  icon={HardDrive}
                  title={ui("Data & storage")}
                >
                  <DataAndStorage />
                </SettingsCategory>
              </div>
            </DeferredProfileSection>
          </div>
        </section>

        <section className="grid gap-4 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_280px]">
          <ActivityCard className="min-w-0" progressStats={stats} />
          <ProgressSummaryCard cur={cur} earned={earned} into={into} needed={needed} nxt={nxt} pct={pct} stats={stats} words={vocab} vocab={vocab} />
          <ActivitySidePanel earned={earned} stats={stats} words={vocab} />
        </section>

        <section className="grid gap-4 md:grid-cols-4">
          <StatCard color="bg-[var(--accent)]" icon={BarChart3} label={ui("Total XP")} value={stats.totalXp.toLocaleString()} />
          <StatCard color="bg-[var(--mint)]" icon={BookOpen} label={ui("Lessons done")} value={stats.sessionsCompleted.toLocaleString()} />
          <StatCard color="bg-[var(--orange)]" icon={Flame} label={ui("Day streak")} value={stats.streak.toLocaleString()} />
          <StatCard color="bg-[var(--ink)]" icon={Target} label={ui("Words tracked")} value={vocab.toLocaleString()} />
        </section>

        {/* Collapsed, like its twin on the profile page: worth having, not
            worth the top third of the screen. */}
        <SettingsCategory
          description={`${earned} ${ui("of")} ${MILESTONES.length} ${ui("reached")}`}
          icon={Trophy}
          title={ui("Milestones")}
        >
          <div className="mt-3 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {MILESTONES.map((item) => {
              const ok = item.check(stats);
              return (
                <motion.div
                  className={cn(
                    "rounded-[20px] border p-4",
                    ok ? "border-[var(--accent)] bg-[var(--accent-dim)]" : "border-[var(--border)] bg-[var(--surface-2)]"
                  )}
                  key={item.id}
                  whileHover={{ y: -2 }}
                >
                  <div className="flex items-center gap-3">
                    <div className={cn("flex h-9 w-9 items-center justify-center rounded-full", ok ? "bg-[var(--accent)] text-white" : "bg-[var(--surface)] text-[var(--text-3)]")}>
                      {ok ? <Check className="h-4 w-4" /> : <Trophy className="h-4 w-4" />}
                    </div>
                    <div>
                      <p className="text-sm font-black text-[var(--text-1)]">{ui(item.label)}</p>
                      <p className="text-xs font-semibold text-[var(--text-3)]">{ui(item.desc)}</p>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </SettingsCategory>

        <DeferredProfileSection
          fallback={<ProfileSectionLoading label={ui("Loading vocabulary library")} />}
          minHeight={360}
          onReveal={requestVocabTracker}
        >
          {catalogueReady && trackerPrepared ? (
            <Suspense fallback={<ProfileSectionLoading label={ui("Loading vocabulary library")} />}>
              <VocabTracker apiParts={apiParts} user={user} />
            </Suspense>
          ) : (
            <ProfileSectionLoading label={ui("Loading vocabulary library")} />
          )}
        </DeferredProfileSection>

        <section className="card flex flex-wrap items-center justify-between gap-4 p-5 sm:p-6">
          <div>
            <p className="text-sm font-black text-[var(--text-1)]">{ui("Sign out")}</p>
            <p className="mt-1 text-xs font-semibold text-[var(--text-3)]">{ui("You'll return to the login screen. Progress stays saved on this device.")}</p>
          </div>
          <button
            type="button"
            onClick={signOut}
            className="inline-flex items-center gap-2 rounded-full bg-[var(--red-bg,#3a2026)] px-4 py-2.5 text-sm font-black text-[var(--red-text,#ff8a9b)] transition-opacity hover:opacity-90"
          >
            <LogOut className="h-4 w-4" /> {ui("Sign out")}
          </button>
        </section>

        <p className="px-1 pb-1 text-center text-[11px] font-medium leading-relaxed text-[var(--text-3)]">
          {ui("Some real-sentence practice is sourced from the")}{" "}
          <a
            href="https://tatoeba.org"
            target="_blank"
            rel="noreferrer"
            className="underline transition-colors hover:text-[var(--text-1)]"
          >
            Tatoeba
          </a>{" "}
          {ui("project, used under CC BY 2.0 FR.")}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <section className="grid gap-4 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_280px]">
        <ActivityCard className="min-w-0" progressStats={stats} />
        <ProgressSummaryCard cur={cur} earned={earned} into={into} needed={needed} nxt={nxt} pct={pct} stats={stats} words={vocab} vocab={vocab} />
        <ActivitySidePanel earned={earned} stats={stats} words={vocab} />
      </section>

      <section className="card overflow-hidden">
        <div className="grid gap-6 p-5 sm:p-6 lg:grid-cols-[1fr_1fr]">
          <div className="rounded-[24px] bg-[var(--surface-2)] p-5">
            <h2 className="text-xl font-black tracking-tight text-[var(--text-1)]">{ui("Profile settings")}</h2>
            <p className="mt-1 text-sm font-semibold text-[var(--text-3)]">{ui("Account details, learning preferences, and external word tracking.")}</p>
            <div className="mt-5 flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[var(--surface)] text-[var(--accent)]">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <div className="min-w-0 flex-1">
                {isEditingName ? (
                  <div className="flex gap-2">
                    <input
                      autoFocus
                      className="min-w-0 flex-1 rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-sm font-bold text-[var(--text-1)] outline-none focus:border-[var(--accent)]"
                      onChange={(event) => setNewName(event.target.value)}
                      onKeyDown={(event) => event.key === "Enter" && saveName()}
                      type="text"
                      value={newName}
                    />
                    <button className="accent-btn h-10 w-10" onClick={saveName} type="button">
                      <Check className="mx-auto h-4 w-4" />
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center justify-between gap-3">
                    <div className="min-w-0">
                      <p className="truncate text-base font-black text-[var(--text-1)]">{user.name}</p>
                      <p className="truncate text-xs font-semibold text-[var(--text-3)]">{user.email}</p>
                    </div>
                    <button
                      aria-label={ui("Edit profile name")}
                      className="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--surface)] text-[var(--text-2)] hover:text-[var(--accent)]"
                      onClick={() => setIsEditingName(true)}
                      type="button"
                    >
                      <Pencil className="h-4 w-4" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="rounded-[24px] bg-[var(--surface-2)] p-5">
            <LearningModePicker value={learningMode} onChange={updateLearningMode} />
            <FlashcardModePicker
              face={flashcardFace}
              mode={flashcardMode}
              onFaceChange={(next) => { setFlashcardFaceState(next); setFlashcardFace(next); }}
              onModeChange={(next) => { setFlashcardModeState(next); setFlashcardMode(next); }}
            />

            <div className="mt-5 rounded-[18px] bg-[var(--surface)] p-4">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-black text-[var(--text-1)]">{ui("Language")}</p>
                  <p className="mt-1 text-xs font-semibold leading-5 text-[var(--text-3)]">
                    {direction === "learn-en"
                      ? ui("Learning English as a German speaker. German is shown as the meaning.")
                      : `Auto uses your browser/keyboard language. Current: ${resolvedEnglishVariant === "british" ? "British" : "American"} English.`}
                  </p>
                </div>
                <span className="rounded-full bg-[var(--surface-2)] px-3 py-1 text-xs font-black text-[var(--text-2)]">
                  {direction === "learn-en" ? "Deutsch" : resolvedEnglishVariant === "british" ? "practise" : "practice"}
                </span>
              </div>
              <select
                className="mt-3 h-11 w-full rounded-xl border border-[var(--border)] bg-[var(--surface-2)] px-3 text-sm font-bold text-[var(--text-1)] outline-none focus:border-[var(--accent)]"
                onChange={(event) => updateLanguageSelection(event.target.value)}
                value={LANGUAGE_SELECT_VALUE}
              >
                <option value="auto">{ui("Auto-detect")} ({ui(englishVariantLabel(detectEnglishVariant()))})</option>
                <option value="british">{ui("British English")}</option>
                <option value="american">{ui("American English")}</option>
                <option value="german">Deutsch</option>
              </select>
            </div>

            <div className="mt-5 rounded-[18px] bg-[var(--surface)] p-4">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-black text-[var(--text-1)]">{ui("Speech speed")}</p>
                  <p className="mt-1 text-xs font-semibold leading-5 text-[var(--text-3)]">
                    {ui("How fast lessons, games, and the companion speak. You can also change this from the speaker menu or by right-clicking Hear it.")}
                  </p>
                </div>
                <span className="rounded-full bg-[var(--surface-2)] px-3 py-1 text-xs font-black text-[var(--text-2)]">
                  {speechRate}×
                </span>
              </div>
              <div className="mt-3 grid grid-cols-4 gap-2 sm:grid-cols-7" role="group" aria-label={ui("Speech speed")}>
                {TTS_SPEED_PRESETS.map((preset) => (
                  <button
                    aria-pressed={Math.abs(speechRate - preset) < 0.01}
                    className={cn(
                      "h-11 rounded-xl border text-sm font-bold transition-colors",
                      Math.abs(speechRate - preset) < 0.01
                        ? "border-[var(--accent)] bg-[var(--accent)]/10 text-[var(--accent)]"
                        : "border-[var(--border)] bg-[var(--surface-2)] text-[var(--text-2)] hover:border-[var(--accent)]"
                    )}
                    key={preset}
                    onClick={() => { setSpeechRateState(preset); setTtsSpeechRate(preset); }}
                    type="button"
                  >
                    {preset}×
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-5 rounded-[18px] bg-[var(--surface)] p-4">
              <p className="text-sm font-black text-[var(--text-1)]">{ui("External word count")}</p>
              <p className="mt-1 text-xs font-semibold leading-5 text-[var(--text-3)]">
                {ui("Add words learned elsewhere so the app can show a more honest vocabulary total.")}
              </p>
              <input
                className="mt-3 h-11 w-full rounded-xl border border-[var(--border)] bg-[var(--surface-2)] px-3 text-sm font-bold text-[var(--text-1)] outline-none focus:border-[var(--accent)]"
                min="0"
                onChange={(event) => {
                  const valueString = event.target.value;
                  setExternalInput(valueString);
                  onUpdateStats?.({ externalWords: parseInt(valueString, 10) || 0 });
                }}
                placeholder="0"
                type="number"
                value={externalInput}
              />
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-4">
        <StatCard color="bg-[var(--accent)]" icon={BarChart3} label={ui("Total XP")} value={stats.totalXp.toLocaleString()} />
        <StatCard color="bg-[var(--mint)]" icon={BookOpen} label={ui("Lessons done")} value={stats.sessionsCompleted.toLocaleString()} />
        <StatCard color="bg-[var(--orange)]" icon={Flame} label={ui("Day streak")} value={stats.streak.toLocaleString()} />
        <StatCard color="bg-[var(--ink)]" icon={Target} label={ui("Words tracked")} value={vocab.toLocaleString()} />
      </section>

      {/* Collapsed by default. Milestones are a nice-to-have, not something
          you come to this page to read, and at full width they pushed the
          things you DO come for off the bottom of the screen. */}
      <SettingsCategory
        description={`${earned} ${ui("of")} ${MILESTONES.length} ${ui("reached")}`}
        icon={Trophy}
        title={ui("Milestones")}
      >
        <div className="mt-3 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {MILESTONES.map((item) => {
            const ok = item.check(stats);
            return (
              <div
                className={[
                  "rounded-[18px] border p-4",
                  ok ? "border-[var(--border)] bg-[var(--surface-2)]" : "border-[var(--border)] bg-[var(--surface)] opacity-55",
                ].join(" ")}
                key={item.id}
              >
                <div className="flex items-center gap-2">
                  <div className={ok ? "flex h-8 w-8 items-center justify-center rounded-full bg-[var(--mint)] text-white" : "flex h-8 w-8 items-center justify-center rounded-full bg-[var(--surface-3)] text-[var(--text-3)]"}>
                    <Check className="h-4 w-4" />
                  </div>
                  <p className="text-sm font-black text-[var(--text-1)]">{ui(item.label)}</p>
                </div>
                <p className="mt-3 text-xs font-semibold leading-5 text-[var(--text-3)]">{ui(item.desc)}</p>
              </div>
            );
          })}
        </div>
      </SettingsCategory>
    </div>
  );
}
