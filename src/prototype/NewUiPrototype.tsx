import { ui, uiFmt } from "@/lib/i18n";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  BarChart3,
  Bell,
  BellOff,
  BookOpen,
  Check,
  CheckCheck,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  CircleUserRound,
  ClipboardCheck,
  Clock3,
  Coins,
  Crown,
  Gamepad2,
  GraduationCap,
  Headphones,
  Home,
  Languages,
  Leaf,
  LockKeyhole,
  Medal,
  LogOut,
  Menu,
  MessageCircleMore,
  MessageSquareText,
  Play,
  Search,
  RotateCcw,
  SlidersHorizontal,
  Trash2,
  Settings2,
  ShoppingBag,
  Swords,
  Target,
  Trophy,
  UserPlus,
  UserRound,
  UsersRound,
  Volume2,
  X,
} from "lucide-react";
import {
  lazy,
  Suspense,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ComponentType,
  type CSSProperties,
  type PointerEvent as ReactPointerEvent,
} from "react";

import { CourseSwitcher } from "@/components/course/CourseSwitcher";
import { learningEnglish, setLearningDirection } from "@/lib/direction";
import { getEnglishVariant, resolveEnglishVariant, setEnglishVariant } from "@/lib/englishVariant";
import { buildCatalogSearchText, normalizeCatalogSearchText } from "@/lib/catalogSearch";
import { getMasteredCount } from "@/lib/mastery";
import { loadScopedJson, saveScopedJson, setAuthUser, type UserProfile } from "@/lib/profileStorage";
import { getStreak, recordStreakDay } from "@/lib/streak";
import { getLevelInfo, MILESTONES, type GamificationStats } from "@/lib/gamificationProgress";
import type { Blueprint, Part } from "@/lib/types";
import {
  getActiveCourseId,
  loadCourseProgress,
  saveCourseProgress,
  setActiveCourseId as persistActiveCourseId,
} from "@/lib/courses";
import { getCourse } from "@/lib/courseRegistry";
import { loadActivitySessions } from "@/lib/activity";
import { countFadingVocab, countKnownVocab, getFluency } from "@/lib/fluency";
import { activePackProgress, type PackProgress } from "@/lib/packProgress";
import { useSlideSelect } from "@/lib/slideSelect";
import {
  NOTIFICATION_KINDS,
  NOTIFICATION_PREFS_EVENT,
  dismissNotifications,
  getMutedNotificationKinds,
  getNotificationStatus,
  markNotificationsRead,
  restoreDismissedNotifications,
  setAllNotificationsMuted,
  setNotificationKindMuted,
  type NotificationKind,
} from "@/lib/notificationPrefs";
import { estimateFluencyHours, LEARNING_TIME_UPDATED_EVENT, loadLearningTimeStats } from "@/lib/learningTime";
import { hasLeonSocialPreview } from "@/lib/socialPreview";
import { getLessonContent, setLessonContent, type LessonContent } from "@/lib/lessonContent";

import heroImage from "./assets/micheon-hero-v3.webp";
import achievementAtlas from "./assets/achievements-v1/achievement-atlas-v3.webp";
import backpackReward from "./assets/rewards-v3/backpack.webp";
import flameReward from "./assets/rewards-v3/flame.webp";
import heartReward from "./assets/rewards-v3/heart.webp";
import starReward from "./assets/rewards-v3/star.webp";
import trophyReward from "./assets/rewards-v3/trophy.webp";
import "./new-ui-prototype.css";

const loadGamificationPanel = () => import("@/Gamification");
const GamificationPanel = lazy(loadGamificationPanel);
const LearningLibraryView = lazy(() => import("@/components/lab/LearnView").then((module) => ({ default: module.LearnView })));
const TestsView = lazy(() => import("@/components/tests/TestsView").then((module) => ({ default: module.TestsView })));
const ListenView = lazy(() => import("@/components/listen/ListenView").then((module) => ({ default: module.ListenView })));
const GamesView = lazy(() => import("@/games/GamesView").then((module) => ({ default: module.GamesView })));
const ClozeTabContent = lazy(() => import("@/lab/ClozeTabContent"));
const GrammarTabContent = lazy(() => import("@/lab/GrammarTabContent"));
const CourseDashboardView = lazy(() => import("@/components/course/CourseDashboardView").then((module) => ({ default: module.CourseDashboardView })));
const CourseLessonsView = lazy(() => import("@/components/course/CourseLessonsView").then((module) => ({ default: module.CourseLessonsView })));
const CourseSession = lazy(() => import("@/components/course/CourseSession").then((module) => ({ default: module.CourseSession })));
const CourseShell = lazy(() => import("@/components/course/CourseShell").then((module) => ({ default: module.CourseShell })));

type PrototypeView = "home" | "learn" | "practice" | "listen" | "games" | "social" | "tests" | "grammar" | "shop" | "progress" | "profile" | "more";
type RewardKind = "heart" | "flame" | "star" | "trophy" | "backpack";
type ShopBadgeId = "leaf" | RewardKind | "crown";

type PrototypeStats = GamificationStats;

type PrototypeSearchItem = {
  id: string;
  title: string;
  subtitle: string;
  group: "Page" | "Lesson" | "Word bank" | "Game";
  actionLabel: "Open" | "Start";
  searchText: string;
  onSelect: () => void;
};

type NavigationItem = {
  id: PrototypeView;
  label: string;
  icon: ComponentType<{ className?: string }>;
};

type Exercise = {
  english: string;
  answers: Array<{
    german: string;
    note: string;
  }>;
  correct: number;
};

type Milestone = (typeof MILESTONES)[number];

const NAVIGATION: NavigationItem[] = [
  { id: "home", label: "Home", icon: Home },
  { id: "learn", label: "Learn", icon: BookOpen },
  { id: "practice", label: "Practice", icon: MessageSquareText },
  { id: "listen", label: "Listen", icon: Headphones },
  { id: "games", label: "Games", icon: Gamepad2 },
  { id: "shop", label: "Shop", icon: ShoppingBag },
  { id: "more", label: "More", icon: Menu },
];

const MOBILE_NAVIGATION: NavigationItem[] = [
  { id: "home", label: "Home", icon: Home },
  { id: "learn", label: "Learn", icon: BookOpen },
  { id: "practice", label: "Practice", icon: MessageSquareText },
  { id: "games", label: "Games", icon: Gamepad2 },
  { id: "more", label: "More", icon: Menu },
];

const SOCIAL_NAVIGATION_ITEM: NavigationItem = { id: "social", label: "Friends", icon: UsersRound };

const PROTOTYPE_SIDEBAR_MIN = 188;
const PROTOTYPE_SIDEBAR_MAX = 330;
const PROTOTYPE_SIDEBAR_STACKED_BRAND_MAX = 212;
const PROTOTYPE_SIDEBAR_COMPACT_BRAND_MAX = 240;
const PROTOTYPE_SIDEBAR_KEY = "prototype-sidebar-width";

const PROTOTYPE_SEARCH_PAGES: Array<{
  id: PrototypeView;
  title: string;
  subtitle: string;
  keywords: string;
}> = [
  { id: "home", title: ui("Home"), subtitle: ui("Your course, progress, lesson path, and fluency outlook."), keywords: "dashboard today continue learning" },
  { id: "learn", title: ui("Lessons"), subtitle: ui("Browse every German lesson and word-bank pack."), keywords: "learn modules packs vocabulary phrases" },
  { id: "practice", title: ui("Practice"), subtitle: ui("Choose useful phrases and review conversational German."), keywords: "review recall sentences conversation" },
  { id: "listen", title: ui("Listen"), subtitle: ui("Both languages read aloud while you do something else."), keywords: "listen audio hear tts hands-free passive hören" },
  { id: "games", title: ui("Games"), subtitle: ui("Spelling, recall, verbs, and quick-recognition games."), keywords: "play word snake falling letters shooter minesweeper slither" },
  { id: "tests", title: ui("Tests"), subtitle: ui("Build vocabulary, phrase, mixed, or weak-spot tests."), keywords: "quiz assessment level search filters" },
  { id: "grammar", title: ui("Grammar"), subtitle: ui("Cloze practice and accessible grammar explanations."), keywords: "fill blanks rules sentence structure" },
  { id: "shop", title: ui("Shop"), subtitle: ui("Unlock and equip profile badges with earned coins."), keywords: "rewards coins badge cosmetics" },
  { id: "progress", title: ui("Progress and achievements"), subtitle: ui("Levels, streaks, XP, milestones, and activity."), keywords: "stats achievements streak level xp" },
  { id: "profile", title: ui("Profile and settings"), subtitle: ui("Account, learning direction, sound, and preferences."), keywords: "account settings language sound preferences" },
  { id: "more", title: ui("More"), subtitle: ui("Course switching and the rest of Micheon's tools."), keywords: "courses switch full app options" },
];

const LEON_SOCIAL_SEARCH_PAGE = {
  id: "social" as const,
  title: "Friends and leaderboard",
  subtitle: "See friend activity, weekly XP, streaks, and the private friends league preview.",
  keywords: "friends social leaderboard league add friend invite challenge weekly xp",
};

const PROTOTYPE_SEARCH_GAMES = [
  ["Word Snake", "Spell German words by steering through letters."],
  ["Falling Letters", "Catch the correct letters before they leave the screen."],
  ["Letter Tap", "Tap the right letter quickly to train visual recall."],
  ["Verb Shooter", "Choose the right verb form before time runs out."],
  ["Vocab Minesweeper", "Translate carefully and avoid wrong picks."],
  ["Vocab Slither", "Match target words while keeping the run alive."],
] as const;

function clampPrototypeSidebarWidth(width: number) {
  return Math.min(PROTOTYPE_SIDEBAR_MAX, Math.max(PROTOTYPE_SIDEBAR_MIN, Math.round(width)));
}

function defaultPrototypeSidebarWidth() {
  if (typeof window === "undefined") return 226;
  if (window.innerWidth <= 1100) return 192;
  if (window.innerWidth <= 1280) return 205;
  return 226;
}

const PREVIEW_PROFILE: UserProfile = {
  id: "micheon-preview",
  name: "Learner",
  email: "preview@micheon.app",
  joinedAt: "2026-01-01T00:00:00.000Z",
  externalWordsLearned: 0,
};

const LESSONS = [
  {
    number: 12,
    title: "Keep the conversation going",
    detail: "Everyday phrases",
    reward: "heart",
    tone: "mint",
    status: "current",
    category: "everyday",
  },
  {
    number: 13,
    title: "Opinions and reactions",
    detail: "Useful sentences",
    reward: "star",
    tone: "yellow",
    status: "open",
    category: "everyday",
  },
  {
    number: 14,
    title: "Travel plans and invitations",
    detail: "Common questions",
    reward: "backpack",
    tone: "violet",
    status: "open",
    category: "travel",
  },
  {
    number: 15,
    title: "Sorting out a problem",
    detail: "Natural responses",
    reward: "flame",
    tone: "blue",
    status: "locked",
    category: "work",
  },
] as const;

const SHOP_PURCHASES_KEY = "prototypeShopPurchases";
const SHOP_EQUIPPED_KEY = "prototypeShopEquippedBadge";

type CoinPack = {
  id: string;
  coins: number;
  price: string;
  label: string;
  note: string;
  featured?: boolean;
};

const COIN_PACKS: readonly CoinPack[] = [
  { id: "pocket", coins: 500, price: "£1.99", label: "Pocket pack", note: "A small boost for profile rewards." },
  { id: "popular", coins: 1_200, price: "£3.99", label: "Popular pack", note: "Enough for several pins and future rewards.", featured: true },
  { id: "power", coins: 3_000, price: "£7.99", label: "Power pack", note: "A bigger balance for regular learners." },
  { id: "vault", coins: 6_500, price: "£14.99", label: "Coin vault", note: "The largest preview bundle in the shop." },
];

const SHOP_ITEMS: ReadonlyArray<{
  id: ShopBadgeId;
  name: string;
  description: string;
  price: number;
  tone: string;
}> = [
  { id: "leaf", name: ui("Fresh start pin"), description: ui("A calm green badge for your profile."), price: 60, tone: "mint" },
  { id: "star", name: ui("Bright star pin"), description: ui("A cheerful badge for steady progress."), price: 90, tone: "yellow" },
  { id: "heart", name: ui("Kind heart pin"), description: ui("A warm badge for patient learners."), price: 110, tone: "rose" },
  { id: "flame", name: ui("Streak flame pin"), description: ui("Show that you keep coming back."), price: 140, tone: "orange" },
  { id: "backpack", name: ui("Explorer pin"), description: ui("A travel badge for curious learners."), price: 170, tone: "violet" },
  { id: "trophy", name: ui("Champion pin"), description: ui("A gold badge for your biggest wins."), price: 220, tone: "blue" },
  { id: "crown", name: ui("Conversation crown"), description: ui("The top profile badge in the reward shop."), price: 260, tone: "gold" },
];

type SocialFriend = {
  id: string;
  name: string;
  initials: string;
  level: string;
  status: string;
  statusKind: "online" | "today" | "recent";
  streak: number;
  weeklyXp: number;
  tone: "rose" | "blue" | "gold" | "violet";
};

type SocialLeaderboardEntry = {
  id: string;
  name: string;
  initials: string;
  weeklyXp: number;
  streak: number;
  movement: string;
  tone: SocialFriend["tone"] | "green";
  current?: boolean;
};

const SOCIAL_FRIENDS: SocialFriend[] = [
  { id: "michelle", name: "Michelle", initials: "M", level: "Confident speaker", status: "Learning now", statusKind: "online", streak: 14, weeklyXp: 2_840, tone: "rose" },
  { id: "jonas", name: "Jonas Weber", initials: "JW", level: "Everyday speaker", status: "Active today", statusKind: "today", streak: 9, weeklyXp: 1_970, tone: "blue" },
  { id: "sophie", name: "Sophie Klein", initials: "SK", level: "Conversation builder", status: "Active today", statusKind: "today", streak: 6, weeklyXp: 1_420, tone: "gold" },
  { id: "felix", name: "Felix Braun", initials: "FB", level: "Getting started", status: "Active yesterday", statusKind: "recent", streak: 3, weeklyXp: 870, tone: "violet" },
];

const SOCIAL_LEADERBOARD: SocialLeaderboardEntry[] = [
  { id: "michelle", name: "Michelle", initials: "M", weeklyXp: 2_840, streak: 14, movement: "+1", tone: "rose" },
  { id: "leon", name: "Leon", initials: "L", weeklyXp: 2_315, streak: 7, movement: "+2", tone: "green", current: true },
  { id: "jonas", name: "Jonas Weber", initials: "JW", weeklyXp: 1_970, streak: 9, movement: "-1", tone: "blue" },
  { id: "sophie", name: "Sophie Klein", initials: "SK", weeklyXp: 1_420, streak: 6, movement: "Same", tone: "gold" },
  { id: "felix", name: "Felix Braun", initials: "FB", weeklyXp: 870, streak: 3, movement: "+1", tone: "violet" },
  { id: "emilia", name: "Emilia Koch", initials: "EK", weeklyXp: 720, streak: 4, movement: "-2", tone: "rose" },
];

function isShopBadgeId(value: unknown): value is ShopBadgeId {
  return typeof value === "string" && SHOP_ITEMS.some((item) => item.id === value);
}

const EXERCISES: Exercise[] = [
  {
    english: "Let me think for a moment.",
    correct: 0,
    answers: [
      { german: "Lass mich kurz überlegen.", note: "This is the natural everyday choice." },
      { german: "Ich werde darüber nachdenken.", note: "This means 'I'll think about it.'" },
      { german: "Ich glaube schon.", note: "This means 'I think so.'" },
      { german: "Warte bitte auf mich.", note: "This means 'Please wait for me.'" },
    ],
  },
  {
    english: "That depends.",
    correct: 1,
    answers: [
      { german: "Das liegt nebenan.", note: "This means 'That's next door.'" },
      { german: "Das kommt darauf an.", note: "This is the common conversational phrase." },
      { german: "Das kommt später.", note: "This means 'That comes later.'" },
      { german: "Das passt schon.", note: "This means 'It's fine as it is.'" },
    ],
  },
  {
    english: "Either is fine with me.",
    correct: 2,
    answers: [
      { german: "Ich nehme beide.", note: "This means 'I'll take both.'" },
      { german: "Beides ist fertig.", note: "This means 'Both are ready.'" },
      { german: "Mir ist beides recht.", note: "This is a friendly, natural answer." },
      { german: "Ich weiß es nicht.", note: "This means 'I don't know.'" },
    ],
  },
];

const REWARD_IMAGE: Record<RewardKind, string> = {
  heart: heartReward,
  flame: flameReward,
  star: starReward,
  trophy: trophyReward,
  backpack: backpackReward,
};

function RewardIcon({ kind, className = "" }: { kind: RewardKind; className?: string }) {
  return <img alt="" aria-hidden="true" className={`np-reward-icon ${className}`.trim()} decoding="async" height={256} loading="lazy" src={REWARD_IMAGE[kind]} width={256} />;
}

const ACHIEVEMENT_ART_ID: Record<string, string> = {
  lessons_10: "first_session",
  reviews_250: "reviews_50",
  xp_2500: "xp_500",
  words_1000: "words_200",
  streak_30: "streak_3",
  lessons_100: "week",
};

function AchievementArt({ id }: { id: string }) {
  const artId = ACHIEVEMENT_ART_ID[id] ?? id;
  return (
    <span
      aria-hidden="true"
      className={`np-achievement-art np-achievement-art--${artId}`}
      style={{ backgroundImage: `url(${achievementAtlas})` }}
    />
  );
}

function ShopBadgeArt({ id }: { id: ShopBadgeId }) {
  if (id === "leaf") return <Leaf aria-hidden="true" />;
  if (id === "crown") return <Crown aria-hidden="true" />;
  return <RewardIcon kind={id} />;
}

function BrandMark() {
  return (
    <div className="np-brand">
      <span className="np-brand-icon">
        <img alt="" src="/icon-64.png" />
      </span>
      <span className="np-brand-copy">
        <strong>{ui("MICHEON")}</strong>
        <small>
          <span>{ui("Made with love by")}</span>
          <span>Leon &amp; Michelle</span>
        </small>
      </span>
    </div>
  );
}

function Sidebar({
  activeView,
  onNavigate,
  onResize,
  socialPreviewUnlocked,
  width,
}: {
  activeView: PrototypeView;
  onNavigate: (view: PrototypeView) => void;
  onResize: (width: number, persist?: boolean) => void;
  socialPreviewUnlocked: boolean;
  width: number;
}) {
  const resizeCleanupRef = useRef<(() => void) | null>(null);
  // Friends slots in directly after Games, same relative spot it had
  // before Listen joined the list.
  const navigationItems = socialPreviewUnlocked
    ? [...NAVIGATION.slice(0, 5), SOCIAL_NAVIGATION_ITEM, ...NAVIGATION.slice(5)]
    : NAVIGATION;
  const brandLayoutClass = width <= PROTOTYPE_SIDEBAR_STACKED_BRAND_MAX
    ? " is-brand-stacked"
    : width <= PROTOTYPE_SIDEBAR_COMPACT_BRAND_MAX
      ? " is-brand-compact"
      : "";

  useEffect(() => () => resizeCleanupRef.current?.(), []);

  const startResize = (event: ReactPointerEvent<HTMLButtonElement>) => {
    event.preventDefault();
    resizeCleanupRef.current?.();

    const startX = event.clientX;
    const startWidth = width;
    let latestWidth = width;
    document.documentElement.classList.add("is-resizing-prototype-sidebar");

    const move = (pointerEvent: PointerEvent) => {
      latestWidth = clampPrototypeSidebarWidth(startWidth + pointerEvent.clientX - startX);
      onResize(latestWidth);
    };
    const cleanup = () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", finish);
      window.removeEventListener("pointercancel", finish);
      document.documentElement.classList.remove("is-resizing-prototype-sidebar");
      resizeCleanupRef.current = null;
    };
    const finish = () => {
      onResize(latestWidth, true);
      cleanup();
    };

    resizeCleanupRef.current = cleanup;
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", finish);
    window.addEventListener("pointercancel", finish);
  };

  // Press a nav button, keep the mouse down, slide to another, release to
  // pick it — the gesture the old build had on its top nav.
  const sidebarRef = useRef<HTMLElement | null>(null);
  useSlideSelect(sidebarRef, ".np-side-nav button");

  return (
    <aside className={`np-sidebar${brandLayoutClass}`} ref={sidebarRef}>
      <BrandMark />
      <nav aria-label={ui("Prototype navigation")} className="np-side-nav">
        {navigationItems.map((item) => {
          const Icon = item.icon;
          const active = item.id === activeView
            || (item.id === "practice" && (activeView === "tests" || activeView === "grammar"))
            || (item.id === "more" && (activeView === "progress" || activeView === "profile"));
          return (
            <button
              aria-current={active ? "page" : undefined}
              className={active ? "is-active" : ""}
              key={item.id}
              onClick={() => onNavigate(item.id)}
              type="button"
            >
              <span aria-hidden="true" className="np-nav-visual"><Icon className="np-nav-icon" /></span>
              <span>{ui(item.label)}</span>
            </button>
          );
        })}
      </nav>

      <div className="np-sidebar-spacer" />
      <button
        aria-label={ui("Resize sidebar")}
        aria-orientation="vertical"
        aria-valuemax={PROTOTYPE_SIDEBAR_MAX}
        aria-valuemin={PROTOTYPE_SIDEBAR_MIN}
        aria-valuenow={width}
        className="np-sidebar-resizer"
        onDoubleClick={() => onResize(defaultPrototypeSidebarWidth(), true)}
        onKeyDown={(event) => {
          if (event.key === "ArrowLeft") {
            event.preventDefault();
            onResize(width - 8, true);
          } else if (event.key === "ArrowRight") {
            event.preventDefault();
            onResize(width + 8, true);
          } else if (event.key === ui("Home")) {
            event.preventDefault();
            onResize(PROTOTYPE_SIDEBAR_MIN, true);
          } else if (event.key === "End") {
            event.preventDefault();
            onResize(PROTOTYPE_SIDEBAR_MAX, true);
          }
        }}
        onPointerDown={startResize}
        role="separator"
        title={ui("Drag to resize. Double-click to reset.")}
        type="button"
      />
    </aside>
  );
}

function StatChip({ kind, value, label }: { kind: RewardKind; value: string; label: string }) {
  return (
    <div className="np-stat-chip">
      <span aria-hidden="true" className={`np-stat-chip__art np-stat-chip__art--${kind}`}>
        <RewardIcon kind={kind} />
      </span>
      <div>
        <strong>{value}</strong>
        <small>{label}</small>
      </div>
    </div>
  );
}

function Header({
  avatar,
  onSignOut,
  equippedBadge,
  onNavigate,
  onProfileIntent,
  onSearchOpen,
  searchCatalogLoading,
  searchItems,
  socialPreviewUnlocked,
  stats,
  userEmail,
  userName,
}: {
  avatar?: string;
  onSignOut: () => void;
  equippedBadge: ShopBadgeId | null;
  onNavigate: (view: PrototypeView) => void;
  onProfileIntent: () => void;
  onSearchOpen: () => void;
  searchCatalogLoading: boolean;
  searchItems: PrototypeSearchItem[];
  socialPreviewUnlocked: boolean;
  stats: PrototypeStats;
  userEmail?: string | null;
  userName: string;
}) {
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const searchWrapRef = useRef<HTMLDivElement | null>(null);
  const searchInputRef = useRef<HTMLInputElement | null>(null);
  const profileMenuRef = useRef<HTMLDivElement | null>(null);
  const firstName = userName.trim().split(/\s+/)[0] || "there";
  const [mutedNotifications, setMutedNotifications] = useState<Set<NotificationKind>>(() => getMutedNotificationKinds());
  const [notificationStatus, setNotificationStatus] = useState(() => getNotificationStatus());
  const [notificationFiltersOpen, setNotificationFiltersOpen] = useState(false);
  useEffect(() => {
    const sync = () => {
      setMutedNotifications(getMutedNotificationKinds());
      setNotificationStatus(getNotificationStatus());
    };
    window.addEventListener(NOTIFICATION_PREFS_EVENT, sync);
    window.addEventListener("storage-sync-completed", sync);
    return () => {
      window.removeEventListener(NOTIFICATION_PREFS_EVENT, sync);
      window.removeEventListener("storage-sync-completed", sync);
    };
  }, []);
  // Written from the learner's real numbers, so the streak note only appears
  // when there is a streak to talk about.
  // Clearing one is about today's showing, not the kind — tomorrow's streak
  // note is a different notification and should come back. Muting is the
  // control for "never show me this kind".
  const today = new Date().toISOString().slice(0, 10);
  const allNotifications: Array<{ id: string; kind: NotificationKind; title: string; body: string; view: PrototypeView }> = [
    { id: `reviews:${today}`, kind: "reviews", title: ui("Your review is ready"), body: ui("Revisit a few useful phrases while they are still fresh."), view: "practice" },
    { id: `games:${today}`, kind: "games", title: ui("Seven games are ready"), body: ui("Try a short spelling, recall, or vocabulary game."), view: "games" },
    stats.streak > 0
      ? { id: `streak:${today}`, kind: "streak" as const, title: uiFmt("{n}-day streak", { n: stats.streak }), body: ui("One short block today keeps it going."), view: "home" as PrototypeView }
      : { id: `streak:${today}`, kind: "streak" as const, title: ui("Start a streak today"), body: ui("A single lesson is enough to begin one."), view: "practice" as PrototypeView },
    { id: `progress:${today}`, kind: "progress", title: ui("See how far you have come"), body: ui("Your vocabulary total and next milestone are on your profile."), view: "profile" },
  ];
  const notifications = allNotifications.filter((item) =>
    !mutedNotifications.has(item.kind) && !notificationStatus.dismissed.has(item.id));
  const unreadNotifications = notifications.filter((item) => !notificationStatus.read.has(item.id));
  const allNotificationsMuted = mutedNotifications.size >= NOTIFICATION_KINDS.length;
  const clearedSomething = allNotifications.some((item) => notificationStatus.dismissed.has(item.id));
  const applyNotificationChange = (change: () => void) => {
    change();
    setNotificationStatus(getNotificationStatus());
  };
  const filteredSearchItems = useMemo(() => {
    const terms = normalizeCatalogSearchText(searchQuery).split(" ").filter(Boolean);
    const matches = terms.length
      ? searchItems.filter((item) => terms.every((term) => item.searchText.includes(term)))
      : searchItems.filter((item) => item.group === "Page");
    return matches.slice(0, 9);
  }, [searchItems, searchQuery]);

  const closeSearch = () => {
    setSearchOpen(false);
    setSearchQuery("");
  };

  const selectSearchItem = (item: PrototypeSearchItem) => {
    closeSearch();
    item.onSelect();
  };

  const openNotification = (view: PrototypeView) => {
    closeSearch();
    setNotificationsOpen(false);
    onNavigate(view);
  };

  const openProfileDestination = (view: PrototypeView) => {
    closeSearch();
    setProfileOpen(false);
    onNavigate(view);
  };

  useEffect(() => {
    if (!searchOpen) return;
    const focusTimer = window.setTimeout(() => searchInputRef.current?.focus(), 80);
    const closeOnOutsideClick = (event: PointerEvent) => {
      if (event.target instanceof Node && !searchWrapRef.current?.contains(event.target)) closeSearch();
    };
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeSearch();
    };

    document.addEventListener("pointerdown", closeOnOutsideClick);
    document.addEventListener("keydown", closeOnEscape);
    return () => {
      window.clearTimeout(focusTimer);
      document.removeEventListener("pointerdown", closeOnOutsideClick);
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, [searchOpen]);

  useEffect(() => {
    if (!profileOpen) return;

    const closeOnOutsideClick = (event: PointerEvent) => {
      if (event.target instanceof Node && !profileMenuRef.current?.contains(event.target)) {
        setProfileOpen(false);
      }
    };
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setProfileOpen(false);
    };

    document.addEventListener("pointerdown", closeOnOutsideClick);
    document.addEventListener("keydown", closeOnEscape);
    return () => {
      document.removeEventListener("pointerdown", closeOnOutsideClick);
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, [profileOpen]);

  return (
    <header className="np-header">
      <div className="np-greeting">
        <p>Hi, {firstName}!</p>
        <span>{ui("Ready to learn today?")}</span>
      </div>
      <div className="np-header-stats">
        <StatChip kind="flame" label={ui("Day streak")} value={stats.streak.toLocaleString()} />
        <StatChip kind="star" label={ui("Total XP")} value={`${stats.totalXp.toLocaleString()} XP`} />
        <StatChip kind="trophy" label={ui("Lessons done")} value={stats.sessionsCompleted.toLocaleString()} />
      </div>
      <div className="np-header-actions">
        <div className="np-search-wrap" ref={searchWrapRef}>
          <button
            aria-controls="prototype-global-search"
            aria-expanded={searchOpen}
            aria-label={ui("Search Micheon")}
            className={`np-icon-button np-desktop-search${searchOpen ? " is-active" : ""}`}
            onClick={() => {
              setNotificationsOpen(false);
              setProfileOpen(false);
              if (searchOpen) closeSearch();
              else {
                onSearchOpen();
                setSearchOpen(true);
              }
            }}
            type="button"
          >
            <Search />
          </button>
          <AnimatePresence initial={false}>
            {searchOpen && (
              <motion.div
                animate={{ opacity: 1, scale: 1, y: 0 }}
                aria-label={ui("Search Micheon")}
                className="np-search-panel"
                exit={{ opacity: 0, scale: 0.985, y: -6 }}
                id="prototype-global-search"
                initial={{ opacity: 0, scale: 0.985, y: -9 }}
                role="dialog"
                transition={{ duration: 0.16 }}
              >
                <label className="np-search-field">
                  <Search aria-hidden="true" />
                  <input
                    aria-label={ui("Search lessons, pages, and games")}
                    onChange={(event) => setSearchQuery(event.target.value)}
                    onKeyDown={(event) => {
                      if (event.key === "Enter" && filteredSearchItems[0]) selectSearchItem(filteredSearchItems[0]);
                    }}
                    placeholder={ui("Search lessons, pages, games, or a German phrase…")}
                    ref={searchInputRef}
                    type="search"
                    value={searchQuery}
                  />
                  {searchQuery && (
                    <button
                      aria-label={ui("Clear search")}
                      onClick={() => {
                        setSearchQuery("");
                        searchInputRef.current?.focus();
                      }}
                      type="button"
                    >
                      <X />
                    </button>
                  )}
                </label>

                <div className="np-search-panel-heading">
                  <strong>{searchQuery ? ui("Search results") : ui("Quick links")}</strong>
                  <small>{searchCatalogLoading
                    ? ui("Loading lessons…")
                    : `${filteredSearchItems.length} ${filteredSearchItems.length === 1 ? "result" : "results"}`}</small>
                </div>

                <div className="np-search-results">
                  {filteredSearchItems.length > 0 ? filteredSearchItems.map((item) => (
                    <button data-testid="prototype-search-result" key={item.id} onClick={() => selectSearchItem(item)} type="button">
                      <span className="np-search-result-group">{ui(item.group)}</span>
                      <div>
                        <strong>{ui(item.title)}</strong>
                        <small>{ui(item.subtitle)}</small>
                      </div>
                      <span className="np-search-result-action">{ui(item.actionLabel)}<ChevronRight /></span>
                    </button>
                  )) : searchCatalogLoading ? (
                    <div className="np-search-empty">
                      <strong>{ui("Loading lesson search")}</strong>
                      <span>{ui("Pages and games are ready now.")}</span>
                    </div>
                  ) : (
                    <div className="np-search-empty">
                      <strong>{ui("No matching result")}</strong>
                      <span>{ui("Try a lesson name, topic, German phrase, or game.")}</span>
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        <div className="np-notification-wrap">
          <button
            aria-expanded={notificationsOpen}
            aria-label={allNotificationsMuted
              ? ui("Notifications, all muted")
              : uiFmt("{n} unread notifications", { n: unreadNotifications.length })}
            className={`np-icon-button np-notification${allNotificationsMuted ? " is-muted" : ""}`}
            onClick={() => {
              closeSearch();
              setProfileOpen(false);
              setNotificationsOpen((open) => !open);
            }}
            type="button"
          >
            {allNotificationsMuted ? <BellOff /> : <Bell />}
            {unreadNotifications.length > 0 && <span aria-hidden="true">{unreadNotifications.length}</span>}
          </button>
          <AnimatePresence initial={false}>
            {notificationsOpen && (
              <motion.div
                animate={{ opacity: 1, scale: 1, y: 0 }}
                className="np-notification-panel"
                exit={{ opacity: 0, scale: 0.98, y: -5 }}
                initial={{ opacity: 0, scale: 0.98, y: -8 }}
                role="dialog"
                transition={{ duration: 0.16 }}
              >
                <div className="np-notification-heading">
                  <div>
                    <strong>{ui("Notifications")}</strong>
                    <small>{allNotificationsMuted
                      ? ui("All muted")
                      : unreadNotifications.length > 0
                        ? uiFmt("{n} unread of {total}", { n: unreadNotifications.length, total: notifications.length })
                        : uiFmt("{n} shown, all read", { n: notifications.length })}</small>
                  </div>
                  <button
                    aria-expanded={notificationFiltersOpen}
                    aria-label={ui("Filter notifications")}
                    className={`np-notification-filter-toggle${notificationFiltersOpen ? " is-open" : ""}`}
                    onClick={() => setNotificationFiltersOpen((open) => !open)}
                    type="button"
                  >
                    <SlidersHorizontal aria-hidden="true" />
                  </button>
                  <button aria-label={ui("Close notifications")} onClick={() => setNotificationsOpen(false)} type="button">
                    <X aria-hidden="true" />
                  </button>
                </div>
                {notifications.length > 0 && (
                  <div className="np-notification-actions">
                    <button
                      disabled={unreadNotifications.length === 0}
                      onClick={() => applyNotificationChange(() =>
                        markNotificationsRead(notifications.map((item) => item.id)))}
                      type="button"
                    >
                      <CheckCheck aria-hidden="true" />
                      {ui("Mark all as read")}
                    </button>
                    <button
                      onClick={() => applyNotificationChange(() =>
                        dismissNotifications(notifications.map((item) => item.id)))}
                      type="button"
                    >
                      <Trash2 aria-hidden="true" />
                      {ui("Clear all")}
                    </button>
                  </div>
                )}
                {notificationFiltersOpen && (
                  <div className="np-notification-filters">
                    <div className="np-notification-filters-head">
                      <span>{ui("Show")}</span>
                      <button
                        onClick={() => setMutedNotifications(setAllNotificationsMuted(!allNotificationsMuted))}
                        type="button"
                      >
                        {allNotificationsMuted ? ui("Unmute all") : ui("Mute all")}
                      </button>
                    </div>
                    <div className="np-notification-filter-chips">
                      {NOTIFICATION_KINDS.map((kind) => {
                        const muted = mutedNotifications.has(kind.id);
                        return (
                          <button
                            aria-pressed={!muted}
                            className={muted ? "is-muted" : ""}
                            key={kind.id}
                            onClick={() => setMutedNotifications(setNotificationKindMuted(kind.id, !muted))}
                            type="button"
                          >
                            {muted ? <BellOff aria-hidden="true" /> : <Bell aria-hidden="true" />}
                            {ui(kind.label)}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
                <div className="np-notification-list">
                  {notifications.length > 0 ? notifications.map((notification, index) => {
                    const unread = !notificationStatus.read.has(notification.id);
                    return (
                      <div className={`np-notification-row${unread ? " is-unread" : ""}`} key={notification.id}>
                        <button
                          className="np-notification-open"
                          onClick={() => {
                            applyNotificationChange(() => markNotificationsRead([notification.id]));
                            openNotification(notification.view);
                          }}
                          type="button"
                        >
                          <span>{unread ? <span className="np-notification-dot" /> : index + 1}</span>
                          <div><strong>{ui(notification.title)}</strong><small>{ui(notification.body)}</small></div>
                          <ChevronRight />
                        </button>
                        <div className="np-notification-row-actions">
                          {unread && (
                            <button
                              aria-label={uiFmt("Mark {name} as read", { name: ui(notification.title) })}
                              onClick={() => applyNotificationChange(() => markNotificationsRead([notification.id]))}
                              title={ui("Mark as read")}
                              type="button"
                            >
                              <Check aria-hidden="true" />
                            </button>
                          )}
                          <button
                            aria-label={uiFmt("Delete {name}", { name: ui(notification.title) })}
                            onClick={() => applyNotificationChange(() => dismissNotifications([notification.id]))}
                            title={ui("Delete")}
                            type="button"
                          >
                            <X aria-hidden="true" />
                          </button>
                        </div>
                      </div>
                    );
                  }) : (
                    <div className="np-notification-empty">
                      <BellOff aria-hidden="true" />
                      <strong>{allNotificationsMuted ? ui("Nothing to show") : ui("You are all caught up")}</strong>
                      <span>{allNotificationsMuted
                        ? ui("Every kind of notification is muted. Use the filter above to bring some back.")
                        : ui("Cleared notifications come back tomorrow. Mute a kind above to stop it for good.")}</span>
                      {clearedSomething && !allNotificationsMuted && (
                        <button
                          className="np-notification-restore"
                          onClick={() => applyNotificationChange(() => restoreDismissedNotifications())}
                          type="button"
                        >
                          <RotateCcw aria-hidden="true" />
                          {ui("Undo clear")}
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        <div className="np-profile-wrap" ref={profileMenuRef}>
          <button
            aria-controls="prototype-profile-menu"
            aria-expanded={profileOpen}
            aria-haspopup="menu"
            aria-label={ui("Open profile menu")}
            className={`np-profile-button${profileOpen ? " is-open" : ""}`}
            onFocus={onProfileIntent}
            onClick={() => {
              closeSearch();
              setNotificationsOpen(false);
              setProfileOpen((open) => !open);
            }}
            onPointerEnter={onProfileIntent}
            type="button"
          >
            {/* The photo, when there is one. The top bar only ever drew the
                initial, so uploading a picture changed the profile page and
                nothing else — the one place you look at every day. */}
            <span className="np-profile-avatar-mark">
              {avatar
                ? <img alt="" className="np-profile-avatar-photo" src={avatar} />
                : <b>{firstName[0]?.toUpperCase() ?? "?"}</b>}
              {equippedBadge && <i className="np-equipped-badge"><ShopBadgeArt id={equippedBadge} /></i>}
            </span>
            <ChevronDown />
          </button>
          <AnimatePresence initial={false}>
            {profileOpen && (
              <motion.div
                animate={{ opacity: 1, scale: 1, y: 0 }}
                className="np-profile-menu"
                exit={{ opacity: 0, scale: 0.98, y: -5 }}
                id="prototype-profile-menu"
                initial={{ opacity: 0, scale: 0.98, y: -8 }}
                role="menu"
                transition={{ duration: 0.16 }}
              >
                <div className="np-profile-menu-summary">
                  <span aria-hidden="true" className="np-profile-avatar-mark">
                    {avatar
                      ? <img alt="" className="np-profile-avatar-photo" src={avatar} />
                      : <b>{firstName[0]?.toUpperCase() ?? "?"}</b>}
                    {equippedBadge && <i className="np-equipped-badge"><ShopBadgeArt id={equippedBadge} /></i>}
                  </span>
                  <div>
                    <strong>{firstName}</strong>
                    <small>{userEmail || ui("Learning German")}</small>
                  </div>
                </div>
                <div className="np-profile-menu-actions">
                  <button onClick={() => openProfileDestination("profile")} role="menuitem" type="button">
                    <span><CircleUserRound /></span>
                    <div><strong>{ui("Profile and settings")}</strong><small>{ui("Account, appearance, and preferences")}</small></div>
                    <ChevronRight />
                  </button>
                  {socialPreviewUnlocked && (
                    <button onClick={() => openProfileDestination("social")} role="menuitem" type="button">
                      <span><UsersRound /></span>
                      <div><strong>{ui("Friends and leaderboard")}</strong><small>{ui("Your private social preview")}</small></div>
                      <ChevronRight />
                    </button>
                  )}
                  <button onClick={() => openProfileDestination("progress")} role="menuitem" type="button">
                    <span><BarChart3 /></span>
                    <div><strong>{ui("Your progress")}</strong><small>{ui("Levels, achievements, and activity")}</small></div>
                    <ChevronRight />
                  </button>
                  <button onClick={() => openProfileDestination("more")} role="menuitem" type="button">
                    <span><Menu /></span>
                    <div><strong>{ui("More options")}</strong><small>{ui("Courses and the full Micheon app")}</small></div>
                    <ChevronRight />
                  </button>
                  {/* Signing out was buried at the bottom of Profile settings —
                      three screens from the avatar you would naturally click to
                      find it. */}
                  <button className="np-profile-menu-signout" onClick={onSignOut} role="menuitem" type="button">
                    <span><LogOut /></span>
                    <div><strong>{ui("Sign out")}</strong><small>{ui("Your progress stays saved on this device")}</small></div>
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
}

function CourseHero({
  packProgress,
  needsStartingPoint,
  onSwitchCourse,
  placementPart,
  stats,
}: {
  packProgress: PackProgress | null;
  needsStartingPoint: boolean;
  onSwitchCourse: () => void;
  placementPart: string | null;
  stats: PrototypeStats;
}) {
  const reduceMotion = useReducedMotion();
  const { nxt, pct, into, needed } = getLevelInfo(stats.totalXp);
  const displayedProgress = needsStartingPoint ? 0 : packProgress ? packProgress.percent : pct;
  const placementLevel = placementPart === "part1" ? ["A1", ui("Building the basics")]
    : placementPart === "part3" ? ["A1-A2", ui("Building confidence")]
      : placementPart === "part5" ? ["A2", ui("Everyday foundations")]
        : placementPart === "part8" ? ["A2-B1", ui("Independent learner")]
          : placementPart === "part11" ? ["B1", ui("Independent speaker")]
            : ["A2", ui("Everyday speaker")];

  const learnsEnglish = learningEnglish();
  return (
    <div className="np-course-hero-frame">
      <section className="np-course-hero">
        <img alt="" className="np-course-art" decoding="async" fetchPriority="high" height={724} loading="eager" src={heroImage} width={2172} />
        <div aria-hidden="true" className="np-course-shade" />
        <div className="np-course-copy">
          <div className="np-course-meta-row">
            <span className="np-course-kicker">{ui("Your active course")}</span>
            {/* The chip was hardcoded to German, so someone learning English
                was told their active course was German on every visit. */}
            <button aria-label={uiFmt("Switch course, currently {course}", { course: learnsEnglish ? ui("English") : ui("German") })} className="np-course-language-chip" onClick={onSwitchCourse} type="button">
              <span aria-hidden="true" className={"np-language-badge" + (learnsEnglish ? " is-english" : "")}>
                {learnsEnglish ? null : <><i /><i /><i /></>}
              </span>
              <strong>{learnsEnglish ? ui("English") : ui("German")}</strong>
              <ChevronDown />
            </button>
          </div>
          <div className="np-course-title-row">
            <h1>{learnsEnglish ? ui("English for real conversations") : ui("German for real conversations")}</h1>
          </div>
          <div className="np-level-line">
            <strong>{needsStartingPoint ? ui("New learner") : uiFmt("Level {level}", { level: placementLevel[0] })}</strong>
            <span>{needsStartingPoint ? ui("Choose where to begin") : placementLevel[1]}</span>
          </div>
          <div className="np-course-progress-row">
            <div className="np-course-progress-label">
              {/* Not XP: the right rail already shows total XP twice, and "how
                  much longer on this one?" is the question actually being
                  asked. Falls back to the level bar only when there is no pack
                  in progress to report on. */}
              <span>
                {needsStartingPoint ? ui("Starting point") : packProgress ? packProgress.title : ui("Level progress")}
              </span>
              <small>
                {needsStartingPoint
                  ? ui("One quick choice before your first lesson")
                  : packProgress
                    ? `${packProgress.done} of ${packProgress.total} phrases · about ${packProgress.sittingsLeft} more ${packProgress.sittingsLeft === 1 ? "sitting" : "sittings"} to finish`
                    : nxt ? `${into.toLocaleString()} of ${needed.toLocaleString()} XP` : ui("Maximum level")}
              </small>
            </div>
            <div
              aria-label={needsStartingPoint
        ? ui("Starting point not chosen")
        : packProgress
          ? uiFmt("{pct}% through {pack}", { pct: packProgress.percent, pack: packProgress.title })
          : uiFmt("{pct}% progress to the next level", { pct })}
              aria-valuemax={100}
              aria-valuemin={0}
              aria-valuenow={displayedProgress}
              className="np-progress-track np-progress-track--hero"
              role="progressbar"
            >
              <motion.span
                animate={{ scaleX: displayedProgress / 100 }}
                initial={reduceMotion ? false : { scaleX: 0 }}
                style={{ transformOrigin: "left center" }}
                transition={{ delay: 0.22, duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function playPhrase(text: string) {
  if (!("speechSynthesis" in window)) return;
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = "de-DE";
  utterance.rate = 0.88;
  window.speechSynthesis.speak(utterance);
}

function PracticeCard({ compact = false }: { compact?: boolean }) {
  const [exerciseIndex, setExerciseIndex] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const exercise = EXERCISES[exerciseIndex];
  const correct = selected === exercise.correct;

  const next = () => {
    setExerciseIndex((index) => (index + 1) % EXERCISES.length);
    setSelected(null);
  };

  return (
    <section className={`np-practice-card${compact ? " np-practice-card--compact" : ""}`}>
      <div className="np-section-heading">
        <div>
          <h2>{ui("Choose the phrase")}</h2>
          <p>{ui("Pick what people actually say in a normal conversation.")}</p>
        </div>
        <div className="np-mini-progress">
          <strong>{exerciseIndex + 1} in a row</strong>
          <div><i style={{ width: `${((exerciseIndex + 1) / EXERCISES.length) * 100}%` }} /></div>
        </div>
      </div>

      <div className="np-practice-grid">
        <div className="np-prompt-card">
          <span className="np-prompt-language">{ui("English")}</span>
          <button aria-label={ui("Hear the German phrase")} className="np-sound-button" onClick={() => playPhrase(exercise.answers[exercise.correct].german)} type="button">
            <Volume2 />
          </button>
          <MessageCircleMore aria-hidden="true" className="np-prompt-symbol" />
          <strong>{exercise.english}</strong>
          <small>{ui("Everyday conversation")}</small>
        </div>

        <div aria-label={ui("German answer choices")} className="np-answer-list">
          {exercise.answers.map((answer, index) => {
            const chosen = selected === index;
            const state = chosen ? (index === exercise.correct ? "correct" : "wrong") : "idle";
            return (
              <button
                aria-pressed={chosen}
                className={`np-answer np-answer--${state}`}
                key={answer.german}
                onClick={() => setSelected(index)}
                type="button"
              >
                <span>{String.fromCharCode(65 + index)}</span>
                <strong>{answer.german}</strong>
                {state === "correct" ? <Check /> : <ChevronRight />}
              </button>
            );
          })}
        </div>
      </div>

      <AnimatePresence initial={false} mode="wait">
        {selected !== null && (
          <motion.div
            animate={{ opacity: 1, y: 0 }}
            aria-live="polite"
            className={`np-feedback ${correct ? "is-correct" : "is-wrong"}`}
            exit={{ opacity: 0, y: 5 }}
            initial={{ opacity: 0, y: 10 }}
            key={`${exerciseIndex}-${selected}`}
            role="status"
          >
            <RewardIcon kind={correct ? "star" : "heart"} />
            <div>
              <strong>{correct ? ui("Exactly right!") : ui("Try another one")}</strong>
              <p>{ui(exercise.answers[selected].note)}</p>
            </div>
            {correct && (
              <button className="np-feedback-next" onClick={next} type="button">
                {ui("Next phrase")}
                <ChevronRight />
              </button>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

function PracticeHub({ onNavigate }: { onNavigate: (view: PrototypeView) => void }) {
  const tools = [
    {
      description: ui("Search by level or topic, then build a focused test from words, phrases, or weak spots."),
      icon: ClipboardCheck,
      label: ui("Tests"),
      meta: ui("Focused recall"),
      tone: "mint",
      view: "tests" as const,
    },
    {
      description: ui("Practise useful sentence patterns with short explanations and fill-in-the-gap activities."),
      icon: GraduationCap,
      label: ui("Grammar"),
      meta: ui("Patterns in context"),
      tone: "yellow",
      view: "grammar" as const,
    },
  ];

  return (
    <div className="np-practice-hub">
      <section className="np-practice-launcher">
        <div className="np-page-intro">
          <span className="np-page-icon"><MessageSquareText /></span>
          <div>
            <small>{ui("Practice hub")}</small>
            <h1>{ui("Choose what to strengthen")}</h1>
            <p>{ui("Keep conversational phrases central, or open a focused test or grammar activity.")}</p>
          </div>
        </div>
        <div className="np-practice-tools">
          {tools.map((tool) => {
            const Icon = tool.icon;
            return (
              <button key={ui(tool.label)} onClick={() => onNavigate(tool.view)} type="button">
                <span className={`np-feature-directory-icon np-feature-directory-icon--${tool.tone}`}><Icon /></span>
                <span>
                  <small>{tool.meta}</small>
                  <strong>{ui(tool.label)}</strong>
                  <p>{ui(tool.description)}</p>
                </span>
                <ChevronRight />
              </button>
            );
          })}
        </div>
      </section>
      <PracticeCard />
    </div>
  );
}

function LessonPath({ onOpenLesson }: { onOpenLesson: () => void }) {
  return (
    <section className="np-lesson-path">
      <div className="np-list-heading">
        <div>
          <h2>{ui("Your lesson path")}</h2>
          <p>{ui("Common sentences and phrases come first.")}</p>
        </div>
        <button type="button">{ui("View all")} <ChevronRight /></button>
      </div>
      <div className="np-lesson-list">
        {LESSONS.slice(0, 3).map((lesson) => (
          <button className={`np-lesson-row np-lesson-row--${lesson.tone}`} key={lesson.number} onClick={onOpenLesson} type="button">
            <span className="np-lesson-illustration"><RewardIcon kind={lesson.reward} /></span>
            <span className="np-lesson-number">{lesson.number}</span>
            <span className="np-lesson-copy">
              <strong>{ui(lesson.title)}</strong>
              <small>{ui(lesson.detail)}</small>
            </span>
            <ChevronRight className="np-lesson-chevron" />
          </button>
        ))}
      </div>
    </section>
  );
}

function FluencyOutlook({ profile, vocab }: { profile: UserProfile | null; vocab: number }) {
  const [revision, setRevision] = useState(0);
  const fluency = getFluency(vocab);
  // Recomputed with the revision counter, so finishing a lesson updates it.
  const fading = useMemo(() => countFadingVocab(profile), [profile, revision]);

  useEffect(() => {
    const refresh = () => setRevision((value) => value + 1);
    window.addEventListener("activity-updated", refresh);
    window.addEventListener(LEARNING_TIME_UPDATED_EVENT, refresh);
    return () => {
      window.removeEventListener("activity-updated", refresh);
      window.removeEventListener(LEARNING_TIME_UPDATED_EVENT, refresh);
    };
  }, []);

  const estimate = useMemo(
    () => estimateFluencyHours(fluency.toFluent, loadLearningTimeStats(profile)),
    [fluency.toFluent, profile, revision]
  );
  const estimateNote = estimate.confidence === "personalized"
    ? ui("Based on your active lesson pace.")
    : estimate.confidence === "developing"
      ? ui("Becomes more accurate as you complete lessons.")
      : ui("Starting estimate. Complete a timed lesson to personalise it.");

  return (
    <section className="np-fluency-outlook">
      <div className="np-fluency-main">
        <div className="np-fluency-heading">
          <span aria-hidden="true"><Target /></span>
          <div>
            <h2>{ui("Your path to fluent conversations")}</h2>
            <p>{ui("A realistic outlook based on useful words and phrases you can recall.")}</p>
          </div>
        </div>
        <div className="np-fluency-status">
          <div><strong>{ui(fluency.cur.label)}</strong><small>{fluency.vocab.toLocaleString()} useful items known</small></div>
          <span>{fluency.overallPct}% to fluent</span>
        </div>
        <div aria-label={uiFmt("{pct}% to fluent", { pct: fluency.overallPct })} className="np-fluency-track">
          <span style={{ width: `${fluency.overallPct}%` }} />
        </div>
        <div className="np-fluency-footnote">
          <span>{fluency.toFluent.toLocaleString()} words and phrases to go</span>
          <span>Fluent target: 5,000</span>
        </div>
        {fading > 0 && (
          <p className="np-fluency-fading">
            {fading.toLocaleString()} {fading === 1 ? "item is" : "items are"} fading. A review brings {fading === 1 ? "it" : "them"} back.
          </p>
        )}
      </div>
      <div className="np-fluency-hours">
        <span aria-hidden="true"><Clock3 /></span>
        <small>{ui("Estimated active study left")}</small>
        <strong>About {estimate.hoursRemaining.toLocaleString()} hours</strong>
        <p>{estimateNote}</p>
      </div>
    </section>
  );
}

function AchievementBadge({ achievement, standalone, stats }: { achievement: Milestone; standalone: boolean; stats: PrototypeStats }) {
  const unlocked = achievement.check(stats);
  const progress = Math.min(achievement.current(stats), achievement.target);

  return (
    <div
      aria-label={`${ui(achievement.label)}. ${unlocked ? "Unlocked" : `${progress} of ${achievement.target} ${achievement.unit}`}. ${ui(achievement.desc)}`}
      className={`np-achievement${unlocked ? " is-unlocked" : " is-locked"}`}
    >
      <span className="np-achievement-visual">
        <AchievementArt id={achievement.id} />
        <span aria-hidden="true" className="np-achievement-state">{unlocked ? <Check /> : <LockKeyhole />}</span>
      </span>
      <small>{ui(achievement.label)}</small>
      {standalone && (
        <span className="np-achievement-detail">
          {unlocked ? "Unlocked" : `${progress} / ${achievement.target} ${achievement.unit}`}
        </span>
      )}
    </div>
  );
}

/** "Today", "Yesterday", or a short date — the learner's own words for when. */
function describeSessionDay(ts: number): string {
  const day = 24 * 60 * 60 * 1000;
  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);
  const diff = startOfToday.getTime() - ts;
  if (diff < 0) return "Today";
  if (diff < day) return "Yesterday";
  return new Date(ts).toLocaleDateString(undefined, { day: "numeric", month: "short" });
}

function ProgressPanel({
  onViewAllAchievements,
  standalone = false,
  stats,
  userName,
}: {
  onViewAllAchievements?: () => void;
  standalone?: boolean;
  stats: PrototypeStats;
  userName: string;
}) {
  const firstName = userName.trim().split(/\s+/)[0] || "there";
  const earnedAchievements = MILESTONES.filter((achievement) => achievement.check(stats)).length;
  // The learner's actual last three sittings, newest first. The block used to
  // show three invented lessons to everybody; real records or no card at all.
  const recentSessions = useMemo(
    () => loadActivitySessions().slice(-3).reverse(),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [stats.sessionsCompleted]
  );
  const visibleAchievements = standalone ? MILESTONES : MILESTONES.slice(0, 4);
  const nextAchievement = MILESTONES.find((achievement) => !achievement.check(stats));
  const nextProgress = nextAchievement ? Math.min(nextAchievement.current(stats), nextAchievement.target) : 1;
  const nextTarget = nextAchievement?.target ?? 1;
  const nextProgressPercent = Math.round((nextProgress / nextTarget) * 100);
  const { cur, nxt, pct } = getLevelInfo(stats.totalXp);

  return (
    <section className={`np-progress-panel${standalone ? " np-progress-panel--standalone" : ""}`}>
      <div className="np-progress-title">
        <div>
          <h2>{ui("Your progress")}</h2>
          <p>{earnedAchievements} of {MILESTONES.length} achievements unlocked, {firstName}.</p>
        </div>
        <AchievementArt id="week" />
      </div>

      <div className="np-level-card">
        <span className="np-level-badge">L{cur.level}</span>
        <div className="np-level-copy">
          <strong>{ui(cur.label)}</strong>
          <small>{nxt ? uiFmt("{xp} XP to level {level}", { xp: nxt.xpRequired - stats.totalXp, level: nxt.level }) : ui("Highest level reached")}</small>
          <div className="np-progress-track"><span style={{ width: `${pct}%` }} /></div>
        </div>
        <small>{stats.totalXp.toLocaleString()} total XP</small>
      </div>

      <div className="np-progress-stats">
        <div><AchievementArt id="xp_500" /><strong>{stats.totalXp.toLocaleString()}</strong><small>{ui("Total XP")}</small></div>
        <div><AchievementArt id="streak_3" /><strong>{stats.streak.toLocaleString()}</strong><small>{ui("Day streak")}</small></div>
        <div><AchievementArt id="first_session" /><strong>{stats.sessionsCompleted.toLocaleString()}</strong><small>{ui("Lessons done")}</small></div>
      </div>

      <div className="np-badges-block">
        <div className="np-block-heading">
          <strong>{ui("Achievements")}</strong>
          {standalone ? (
            <span className="np-achievement-count">{earnedAchievements} unlocked</span>
          ) : (
            <button onClick={onViewAllAchievements} type="button">{ui("View all")}</button>
          )}
        </div>
        <div className={`np-badge-list${standalone ? " np-badge-list--expanded" : ""}`}>
          {visibleAchievements.map((achievement) => (
            <AchievementBadge achievement={achievement} key={achievement.id} standalone={standalone} stats={stats} />
          ))}
        </div>
      </div>

      <div className="np-goal-card">
        <div>
          <strong>{nextAchievement ? ui("Next achievement") : ui("All achievements unlocked")}</strong>
          <small>{nextAchievement?.label ?? ui("You reached every current milestone.")}</small>
          <div className="np-progress-track"><span style={{ width: `${nextAchievement ? nextProgressPercent : 100}%` }} /></div>
          <p>{nextAchievement ? `${nextProgress} / ${nextTarget} ${nextAchievement.unit}` : "Complete"}</p>
        </div>
        <AchievementArt id={nextAchievement?.id ?? "week"} />
      </div>

      {recentSessions.length > 0 && (
        <div className="np-completed-block">
          <div className="np-block-heading"><strong>{ui("Recently completed")}</strong></div>
          {recentSessions.map((session, index) => (
            <div className="np-completed-row" key={`${session.ts}-${index}`}>
              <CheckCircle2 />
              <span>
                <strong>{describeSessionDay(session.ts)}</strong>
                <small>{session.sentences} {session.sentences === 1 ? "sentence" : "sentences"}{session.dialogues > 0 ? `, ${session.dialogues} ${session.dialogues === 1 ? "conversation" : "conversations"}` : ""}</small>
              </span>
              <b>{Math.max(1, Math.round(session.durationSec / 60))} min</b>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

function HomeView({
  apiParts,
  onPractice,
  profile,
  onSwitchCourse,
  stats,
  vocab,
}: {
  apiParts: Record<string, Part>;
  onPractice: () => void;
  profile: UserProfile | null;
  onSwitchCourse: () => void;
  stats: PrototypeStats;
  vocab: number;
}) {
  // Recomputed when the catalogue arrives or a lesson lands, so the hero's
  // "how much longer" tracks what was just learned.
  const packProgress = useMemo(() => activePackProgress(apiParts, profile), [apiParts, profile, stats.sessionsCompleted]);
  const [lessonContent, setLessonContentState] = useState<LessonContent>(() => getLessonContent());
  const [contentMenuOpen, setContentMenuOpen] = useState(false);
  // The menu closes the way every menu should: outside click or Escape.
  useEffect(() => {
    if (!contentMenuOpen) return undefined;
    const onPointerDown = (event: PointerEvent) => {
      if (!(event.target as Element | null)?.closest?.(".np-lesson-content-picker")) setContentMenuOpen(false);
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setContentMenuOpen(false);
    };
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [contentMenuOpen]);
  const needsStartingPoint = Boolean(profile)
    && loadScopedJson<boolean>("german-lab-placement-done", false, profile) !== true;
  const placementPart = profile
    ? loadScopedJson<string | null>("german-lab-placement-result", null, profile)
    : null;
  const firstLessonReady = !needsStartingPoint
    && Boolean(placementPart)
    && stats.sessionsCompleted === 0;
  const firstLessonLevel = placementPart === "part1" ? "A1"
    : placementPart === "part3" ? "A1-A2"
      : placementPart === "part5" ? "A2"
        : placementPart === "part8" ? "A2-B1"
          : placementPart === "part11" ? "B1"
            : "A1";

  return (
    <div className="np-home-view">
      <CourseHero
        packProgress={packProgress}
        needsStartingPoint={needsStartingPoint}
        onSwitchCourse={onSwitchCourse}
        placementPart={placementPart}
        stats={stats}
      />
      <div className="np-course-launch">
      <button
        aria-label={needsStartingPoint
          ? ui("Choose your starting point. Tell us if you are a total beginner.")
          : firstLessonReady
            ? uiFmt("Start your first lesson. Level {level} everyday essentials.", { level: firstLessonLevel })
            : uiFmt("Continue learning. Lesson {n}.", { n: stats.sessionsCompleted + 1 })}
        className="np-mobile-course-button"
        onClick={onPractice}
        type="button"
      >
        <Play />
        <span className="np-course-button-copy">
          <span className="np-course-button-kicker">
            {needsStartingPoint ? ui("First step") : firstLessonReady ? ui("Your first lesson") : ui("Your next lesson")}
          </span>
          <strong>{needsStartingPoint ? ui("Choose your starting point") : firstLessonReady ? ui("Start learning") : ui("Continue learning")}</strong>
          <small>
            {needsStartingPoint
              ? ui("Tell us if you are a total beginner")
              : firstLessonReady ? uiFmt("Level {level}: Everyday essentials", { level: firstLessonLevel }) : uiFmt("Lesson {n}: picks up where you left off", { n: stats.sessionsCompleted + 1 })}
          </small>
        </span>
        <ChevronRight />
      </button>
      {/* What the button serves: a dropdown ON the button, beside its arrow,
          because a row of pills below it read as unrelated chrome. The choice
          holds until changed — "I'm here for vocabulary" is true for weeks,
          not per press. Word progress lives under its own ids, so nothing
          chosen here can push a single word into the sentence course's
          queues or vice versa. */}
      <div className="np-lesson-content-picker">
        <button
          aria-expanded={contentMenuOpen}
          aria-haspopup="menu"
          aria-label={ui("Lesson content")}
          className="np-lesson-content-trigger"
          onClick={() => setContentMenuOpen((open) => !open)}
          type="button"
        >
          {ui(lessonContent === "words" ? "Words" : lessonContent === "mixed" ? "Both" : "Sentences")}
          <ChevronDown aria-hidden="true" />
        </button>
        {contentMenuOpen && (
          <div aria-label={ui("What your lessons are made of")} className="np-lesson-content-menu" role="menu">
            {([
              ["sentences", "Sentences", "Phrases, sentences and dialogues — the course as it has always been."],
              ["words", "Words", "Single words with their meanings, most common first."],
              ["mixed", "Both", "Four sentence slots and two word slots in each sitting."],
            ] as const).map(([value, label, hint]) => (
              <button
                aria-checked={lessonContent === value}
                key={value}
                onClick={() => {
                  setLessonContent(value);
                  setLessonContentState(value);
                  setContentMenuOpen(false);
                }}
                role="menuitemradio"
                type="button"
              >
                <strong>{ui(label)}</strong>
                <small>{ui(hint)}</small>
              </button>
            ))}
          </div>
        )}
      </div>
      </div>
      <FluencyOutlook profile={profile} vocab={vocab} />
      <LessonPath onOpenLesson={onPractice} />
    </div>
  );
}

function FeatureLoading() {
  return (
    <section aria-label={ui("Loading learning content")} className="np-feature-loading">
      <span />
      <div><i /><i /><i /></div>
    </section>
  );
}

function AccountGate({ onRequestSignIn }: { onRequestSignIn: () => void }) {
  return (
    <section className="np-page-card np-account-gate">
      <div className="np-page-intro">
        <span className="np-page-icon"><CircleUserRound /></span>
        <div><h1>{ui("Sign in to manage your profile")}</h1><p>{ui("Your lessons and games are available in preview mode. Sign in to save account, pet, course, and flashcard changes.")}</p></div>
      </div>
      <button className="np-primary-button" onClick={onRequestSignIn} type="button">
        {ui("Open sign in")}
        <ChevronRight />
      </button>
    </section>
  );
}

function ShopView({
  availableCoins,
  equippedBadge,
  onChooseBadge,
  ownedBadges,
}: {
  availableCoins: number;
  equippedBadge: ShopBadgeId | null;
  onChooseBadge: (id: ShopBadgeId) => void;
  ownedBadges: ShopBadgeId[];
}) {
  const [previewMessage, setPreviewMessage] = useState("");

  const previewPurchase = (message: string) => {
    setPreviewMessage(message);
  };

  return (
    <section className="np-shop-view">
      <div className="np-shop-hero">
        <div className="np-shop-heading">
          <span><ShoppingBag /></span>
          <div>
            <small>{ui("Reward shop")}</small>
            <h1>{ui("Make your profile yours")}</h1>
            <p>{ui("Earn coins by learning, then use them on profile pins.")}</p>
          </div>
        </div>
        <div aria-live="polite" className="np-shop-balance">
          <Coins />
          <div><strong>{availableCoins.toLocaleString()}</strong><small>{ui("Micheon coins")}</small></div>
        </div>
      </div>

      <div className="np-shop-note">
        <Coins />
        <p>{ui("You start with 80 welcome coins. More coins come from XP, completed lessons, and reviews. Buying a pin never reduces your XP.")}</p>
      </div>

      {previewMessage && (
        <div aria-live="polite" className="np-shop-preview-message" data-testid="shop-preview-message" role="status">
          <CheckCircle2 />
          <div><strong>{ui("Shop preview")}</strong><p>{previewMessage}</p></div>
          <button aria-label={ui("Dismiss message")} onClick={() => setPreviewMessage("")} type="button"><X /></button>
        </div>
      )}

      <section aria-labelledby="coin-packs-heading" className="np-shop-purchase-section">
        <div className="np-shop-section-heading">
          <div><h2 id="coin-packs-heading">{ui("Buy Micheon coins")}</h2><p>{ui("Choose a coin pack for profile pins and future shop rewards.")}</p></div>
          <span>{ui("Checkout preview")}</span>
        </div>

        <div className="np-coin-pack-grid">
          {COIN_PACKS.map((pack) => (
            <article className={`np-coin-pack${pack.featured ? " is-featured" : ""}`} key={pack.id}>
              <div className="np-coin-pack-icon"><Coins /></div>
              <div className="np-coin-pack-copy">
                <small>{pack.featured ? ui("Most popular") : pack.label}</small>
                <h3>{pack.coins.toLocaleString()} coins</h3>
                <p>{ui(pack.note)}</p>
              </div>
              <button
                data-testid={`shop-coin-pack-${pack.coins}`}
                onClick={() => previewPurchase(`${pack.coins.toLocaleString()} coins are not charged or added yet. Checkout will be connected later.`)}
                type="button"
              >
                <span>{pack.price}</span>
                {ui("Buy coins")}
              </button>
            </article>
          ))}
        </div>
        <p className="np-shop-checkout-note">{ui("Preview prices only. Payments are not connected, so these buttons will not charge you.")}</p>
      </section>

      <section aria-labelledby="premium-heading" className="np-premium-card">
        <div className="np-premium-copy">
          <span className="np-premium-mark"><Crown /></span>
          <div>
            <small>{ui("Micheon Premium")}</small>
            <h2 id="premium-heading">{ui("Learn better together")}</h2>
            <p>{ui("A future membership for learners who want more motivation from the people they know.")}</p>
          </div>
        </div>
        <div className="np-premium-benefits" aria-label={ui("Planned Premium features")}>
          <span><UserRound /><strong>{ui("Add friends")}</strong></span>
          <span><Trophy /><strong>{ui("Friendly leaderboards")}</strong></span>
          <span><MessageCircleMore /><strong>{ui("Learn together")}</strong></span>
        </div>
        <div className="np-premium-action">
          <div><strong>£5.99</strong><span>{ui("per month, preview price")}</span></div>
          <button
            data-testid="shop-premium-buy"
            onClick={() => previewPurchase(ui("Premium checkout and its social features are not connected yet."))}
            type="button"
          >
            {ui("Get Premium")}
            <ChevronRight />
          </button>
          <small>{ui("No charge is made. Friends, leaderboards, and learning together are planned features.")}</small>
        </div>
      </section>

      <div className="np-shop-section-heading">
        <div><h2>{ui("Profile pins")}</h2><p>{ui("Your equipped pin appears on the profile button.")}</p></div>
        <span>{ownedBadges.length} of {SHOP_ITEMS.length} owned</span>
      </div>

      <div className="np-shop-grid">
        {SHOP_ITEMS.map((item) => {
          const owned = ownedBadges.includes(item.id);
          const equipped = equippedBadge === item.id;
          const shortfall = Math.max(0, item.price - availableCoins);
          const disabled = equipped || (!owned && shortfall > 0);
          const buttonLabel = equipped
            ? "Equipped"
            : owned
              ? "Equip"
              : shortfall > 0
                ? uiFmt("Need {n} more", { n: shortfall })
                : ui("Buy and equip");

          return (
            <article className={`np-shop-item${owned ? " is-owned" : ""}${equipped ? " is-equipped" : ""}`} key={item.id}>
              <span className={`np-shop-item-art np-shop-item-art--${item.tone}`}><ShopBadgeArt id={item.id} /></span>
              <div className="np-shop-item-copy">
                <small>{ui("Profile pin")}</small>
                <h3>{ui(item.name)}</h3>
                <p>{ui(item.description)}</p>
              </div>
              <div className="np-shop-item-footer">
                <span>{owned ? "Owned" : <><Coins /> {item.price}</>}</span>
                <button aria-pressed={equipped} disabled={disabled} onClick={() => onChooseBadge(item.id)} type="button">
                  {buttonLabel}
                </button>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}

function SocialAvatar({ initials, tone }: { initials: string; tone: SocialLeaderboardEntry["tone"] }) {
  return <span aria-hidden="true" className={`np-social-avatar np-social-avatar--${tone}`}>{initials}</span>;
}

function SocialView({ userName }: { userName: string }) {
  const [activeSection, setActiveSection] = useState<"friends" | "leaderboard">("friends");
  const [friendQuery, setFriendQuery] = useState("");
  const [previewNotice, setPreviewNotice] = useState<string | null>(null);
  const firstName = userName.trim().split(/\s+/)[0] || "Leon";
  const friends = useMemo(() => {
    const query = normalizeCatalogSearchText(friendQuery);
    if (!query) return SOCIAL_FRIENDS;
    return SOCIAL_FRIENDS.filter((friend) => normalizeCatalogSearchText([
      friend.name,
      friend.level,
      friend.status,
    ].join(" ")).includes(query));
  }, [friendQuery]);
  const leaderboard = useMemo(() => SOCIAL_LEADERBOARD.map((entry) => (
    entry.current ? { ...entry, name: firstName } : entry
  )), [firstName]);
  const podium = [leaderboard[1], leaderboard[0], leaderboard[2]];

  const showPreviewNotice = (action: string) => {
    setPreviewNotice(uiFmt("{action} is a preview in this release. Nothing was sent or changed.", { action }));
  };

  return (
    <section className="np-page-card np-social-view">
      <div className="np-social-hero">
        <span aria-hidden="true" className="np-social-hero-icon"><UsersRound /></span>
        <div className="np-social-hero-copy">
          <span>{ui("Leon only")}</span>
          <h1>{ui("Learn better together")}</h1>
          <p>{ui("Keep up with friends, compare weekly XP, and turn practice into a friendly routine.")}</p>
        </div>
        <div className="np-social-private-badge">
          <LockKeyhole aria-hidden="true" />
          <span><strong>{ui("Private preview")}</strong><small>Visible only on Leon&apos;s account</small></span>
        </div>
      </div>

      <div aria-label={ui("Social sections")} className="np-social-tabs" role="tablist">
        <button
          aria-controls="social-friends-panel"
          aria-selected={activeSection === "friends"}
          className={activeSection === "friends" ? "is-active" : ""}
          onClick={() => setActiveSection("friends")}
          role="tab"
          type="button"
        >
          <UsersRound aria-hidden="true" />
          <span><strong>{ui("Friends")}</strong><small>{uiFmt("{n} learning partners", { n: SOCIAL_FRIENDS.length })}</small></span>
        </button>
        <button
          aria-controls="social-leaderboard-panel"
          aria-selected={activeSection === "leaderboard"}
          className={activeSection === "leaderboard" ? "is-active" : ""}
          onClick={() => setActiveSection("leaderboard")}
          role="tab"
          type="button"
        >
          <Medal aria-hidden="true" />
          <span><strong>{ui("Leaderboard")}</strong><small>{ui("Friends league this week")}</small></span>
        </button>
      </div>

      <AnimatePresence initial={false}>
        {previewNotice && (
          <motion.div
            animate={{ opacity: 1, y: 0 }}
            className="np-social-preview-notice"
            exit={{ opacity: 0, y: -4 }}
            initial={{ opacity: 0, y: -6 }}
            role="status"
          >
            <CheckCircle2 aria-hidden="true" />
            <span><strong>{ui("UI preview only")}</strong><small>{previewNotice}</small></span>
            <button aria-label={ui("Dismiss preview message")} onClick={() => setPreviewNotice(null)} type="button"><X /></button>
          </motion.div>
        )}
      </AnimatePresence>

      {activeSection === "friends" ? (
        <div className="np-social-layout" id="social-friends-panel" role="tabpanel">
          <section className="np-social-panel np-friends-panel">
            <div className="np-social-panel-heading">
              <div><span>{ui("Your circle")}</span><h2>{ui("Friends")}</h2><p>{ui("See who is learning and keep each other moving.")}</p></div>
              <button className="np-social-primary-button" onClick={() => showPreviewNotice(ui("Add friend"))} type="button"><UserPlus /> {ui("Add friend")}</button>
            </div>
            <label className="np-social-search">
              <Search aria-hidden="true" />
              <input
                aria-label={ui("Search friends")}
                onChange={(event) => setFriendQuery(event.target.value)}
                placeholder={ui("Search your friends")}
                type="search"
                value={friendQuery}
              />
              {friendQuery && <button aria-label={ui("Clear friend search")} onClick={() => setFriendQuery("")} type="button"><X /></button>}
            </label>

            <div className="np-friend-list">
              {friends.length > 0 ? friends.map((friend) => (
                <article className="np-friend-row" key={friend.id}>
                  <SocialAvatar initials={friend.initials} tone={friend.tone} />
                  <div className="np-friend-identity">
                    <strong>{friend.name}</strong>
                    <span className={`np-social-presence np-social-presence--${friend.statusKind}`}><i />{friend.status}</span>
                    <small>{friend.level}</small>
                  </div>
                  <div className="np-friend-stat">
                    <RewardIcon kind="flame" />
                    <span><strong>{friend.streak} days</strong><small>{ui("Current streak")}</small></span>
                  </div>
                  <div className="np-friend-stat">
                    <RewardIcon kind="star" />
                    <span><strong>{friend.weeklyXp.toLocaleString()} XP</strong><small>{ui("This week")}</small></span>
                  </div>
                  <button className="np-social-secondary-button" onClick={() => showPreviewNotice(uiFmt("Message {name}", { name: friend.name }))} type="button">
                    <MessageCircleMore aria-hidden="true" /><span>{ui("Message")}</span>
                  </button>
                </article>
              )) : (
                <div className="np-social-empty">
                  <Search aria-hidden="true" />
                  <strong>{ui("No friend matches that search")}</strong>
                  <span>{ui("Try another name or clear the search.")}</span>
                  <button onClick={() => setFriendQuery("")} type="button">{ui("Clear search")}</button>
                </div>
              )}
            </div>
          </section>

          <aside className="np-social-side-stack">
            <section className="np-social-side-card np-social-side-card--invite">
              <span className="np-social-side-icon"><UserPlus /></span>
              <small>{ui("Grow your circle")}</small>
              <h2>{ui("Invite a learning partner")}</h2>
              <p>{ui("Practising feels easier when someone is learning alongside you.")}</p>
              <button onClick={() => showPreviewNotice(ui("Invite friend"))} type="button">{ui("Preview invite")} <ChevronRight /></button>
            </section>
            <section className="np-social-side-card">
              <span className="np-social-side-icon np-social-side-icon--blue"><Swords /></span>
              <small>{ui("Friendly challenge")}</small>
              <h2>{ui("Reach 500 XP together")}</h2>
              <p>{ui("You and Michelle are 68% of the way to a shared weekly target.")}</p>
              <div className="np-social-progress"><span style={{ width: "68%" }} /></div>
              <button onClick={() => showPreviewNotice(ui("Challenge Michelle"))} type="button">{ui("Open challenge")} <ChevronRight /></button>
            </section>
          </aside>
        </div>
      ) : (
        <div className="np-social-layout" id="social-leaderboard-panel" role="tabpanel">
          <section className="np-social-panel np-leaderboard-panel">
            <div className="np-social-panel-heading">
              <div><span>{ui("Friends league")}</span><h2>{ui("This week")}</h2><p>{ui("XP earned from Monday to Sunday.")}</p></div>
              <div className="np-leaderboard-time"><Clock3 /><span><strong>{ui("3 days left")}</strong><small>{ui("Resets Monday")}</small></span></div>
            </div>

            <div aria-label={ui("Top three friends")} className="np-leaderboard-podium">
              {podium.map((entry) => {
                const rank = leaderboard.findIndex((candidate) => candidate.id === entry.id) + 1;
                return (
                  <div className={`np-podium-place np-podium-place--${rank}`} key={entry.id}>
                    <span className="np-podium-rank">{rank === 1 ? <Medal aria-label={ui("First place")} /> : rank}</span>
                    <SocialAvatar initials={entry.initials} tone={entry.tone} />
                    <strong>{entry.name}</strong>
                    <small>{entry.weeklyXp.toLocaleString()} XP</small>
                    <i aria-hidden="true" />
                  </div>
                );
              })}
            </div>

            <div className="np-leaderboard-list">
              {leaderboard.map((entry, index) => (
                <article className={entry.current ? "is-current" : ""} key={entry.id}>
                  <strong className="np-leaderboard-rank">{index + 1}</strong>
                  <SocialAvatar initials={entry.initials} tone={entry.tone} />
                  <span className="np-leaderboard-person"><strong>{entry.name}{entry.current && <small>{ui("You")}</small>}</strong><small>{entry.streak}-day streak</small></span>
                  <span className="np-leaderboard-xp"><strong>{entry.weeklyXp.toLocaleString()} XP</strong><small>{entry.movement} this week</small></span>
                </article>
              ))}
            </div>
          </section>

          <aside className="np-social-side-stack">
            <section className="np-social-side-card np-social-side-card--target">
              <span className="np-social-side-icon"><Target /></span>
              <small>{ui("Your weekly goal")}</small>
              <h2>{ui("685 XP to go")}</h2>
              <p>{ui("You have earned 2,315 of your 3,000 XP target.")}</p>
              <div className="np-social-progress"><span style={{ width: "77%" }} /></div>
              <strong className="np-social-target-caption">{ui("77% complete")}</strong>
            </section>
            <section className="np-social-side-card">
              <span className="np-social-side-icon np-social-side-icon--gold"><Trophy /></span>
              <small>{ui("League reward")}</small>
              <h2>{ui("Finish in the top three")}</h2>
              <p>{ui("Leon is currently second. A short lesson could close the gap.")}</p>
              <button onClick={() => showPreviewNotice(ui("League details"))} type="button">{ui("How leagues work")} <ChevronRight /></button>
            </section>
          </aside>
        </div>
      )}
    </section>
  );
}

function MoreView({
  onNavigate,
  onSwitchCourse,
  socialPreviewUnlocked,
}: {
  onNavigate: (view: PrototypeView) => void;
  onSwitchCourse: () => void;
  socialPreviewUnlocked: boolean;
}) {
  const features: Array<{
    title: string;
    description: string;
    icon: ComponentType<{ className?: string }>;
    tone: string;
    action: () => void;
  }> = [
    ...(socialPreviewUnlocked ? [{
      title: ui("Friends and leaderboard"),
      description: ui("See friend activity, weekly XP, streaks, and the private friends league preview."),
      icon: UsersRound,
      tone: "mint",
      action: () => onNavigate("social"),
    }] : []),
    { title: ui("Progress"), description: ui("See your streak, achievements, recent lessons, and goals."), icon: BarChart3, tone: "blue", action: () => onNavigate("progress") },
    { title: ui("Reward shop"), description: ui("Earn coins through learning and collect profile pins."), icon: ShoppingBag, tone: "yellow", action: () => onNavigate("shop") },
    { title: ui("Profile and settings"), description: ui("Manage your account, sound, learning mode, and goals."), icon: Settings2, tone: "violet", action: () => onNavigate("profile") },
    { title: ui("Courses and packs"), description: ui("Switch courses or browse every hardcoded lesson and phrase pack."), icon: Languages, tone: "blue", action: onSwitchCourse },
    { title: ui("Pets and flashcards"), description: ui("Choose pets, adjust coaching, and set how flashcards flip."), icon: UserRound, tone: "mint", action: () => onNavigate("profile") },
  ];

  return (
    <section className="np-page-card np-more-view">
      <div className="np-page-intro">
        <span className="np-page-icon"><Menu /></span>
        <div><h1>{ui("Everything in one place")}</h1><p>{ui("Courses, pets, flashcards, rewards, progress, and account settings all live inside Micheon.")}</p></div>
      </div>
      <div className="np-feature-directory">
        {features.map((feature) => {
          const Icon = feature.icon;
          return (
            <button key={ui(feature.title)} onClick={feature.action} type="button">
              <span className={`np-feature-directory-icon np-feature-directory-icon--${feature.tone}`}><Icon /></span>
              <span><strong>{ui(feature.title)}</strong><small>{ui(feature.description)}</small></span>
              <ChevronRight />
            </button>
          );
        })}
      </div>
    </section>
  );
}

function isPrototypeBulkPartKey(key: string) {
  return key.startsWith("wordbank") || key.startsWith("tatoeba");
}

function usePrototypeParts(requested: boolean) {
  const [apiParts, setApiParts] = useState<Record<string, Part>>({});

  useEffect(() => {
    if (!requested) return undefined;

    let active = true;
    let removeListeners = () => {};

    const load = async () => {
      const [api, curriculum, contentBank, customContent, data] = await Promise.all([
        import("@/lib/api"),
        import("@/lib/curriculum"),
        import("@/lib/contentBank"),
        import("@/lib/customContent"),
        import("@/lib/data"),
      ]);
      if (!active) return;

      const resolved: Record<string, Part> = {};
      for (const [key, blueprint] of Object.entries(data.allPartBlueprints)) {
        resolved[key] = api.buildApiPartFromResolved(blueprint as Blueprint, {});
      }

      const rebuild = () => {
        if (!active) return;
        setApiParts(curriculum.orderParts(contentBank.filterPartsForLearningDirection({
          ...resolved,
          ...contentBank.buildBundledParts(),
          ...contentBank.buildTatoebaParts(),
          ...customContent.buildCustomParts(),
        })));
      };

      rebuild();
      window.addEventListener(customContent.CUSTOM_CONTENT_EVENT, rebuild);
      window.addEventListener("gl-direction-change", rebuild);
      removeListeners = () => {
        window.removeEventListener(customContent.CUSTOM_CONTENT_EVENT, rebuild);
        window.removeEventListener("gl-direction-change", rebuild);
      };
    };

    void load().catch((error) => console.error("[prototype] unable to load lesson catalogue", error));
    return () => {
      active = false;
      removeListeners();
    };
  }, [requested]);

  return apiParts;
}

function MobileNav({ activeView, onNavigate }: { activeView: PrototypeView; onNavigate: (view: PrototypeView) => void }) {
  return (
    <nav aria-label={ui("Mobile prototype navigation")} className="np-mobile-nav">
      {MOBILE_NAVIGATION.map((item) => {
        const Icon = item.icon;
        const active = item.id === activeView
          || (item.id === "practice" && (activeView === "tests" || activeView === "grammar"))
          || (item.id === "more" && ["social", "shop", "progress", "profile"].includes(activeView));
        return (
          <button aria-current={active ? "page" : undefined} className={active ? "is-active" : ""} key={item.id} onClick={() => onNavigate(item.id)} type="button">
            <Icon />
            <span>{ui(item.label)}</span>
          </button>
        );
      })}
    </nav>
  );
}

export default function NewUiPrototype({
  onRequestSignIn,
  profile,
}: {
  onRequestSignIn: () => void;
  profile: UserProfile | null;
}) {
  const [activeView, setActiveView] = useState<PrototypeView>("home");
  const [courseSwitcherOpen, setCourseSwitcherOpen] = useState(false);
  const [storedCourseId, setActiveCourseId] = useState(() => getActiveCourseId(profile));
  // The direction is the source of truth for the two built-in courses: an
  // install that has been learning English since before English was listed
  // still has "german" stored, and would otherwise show the wrong course.
  const activeCourseId = (storedCourseId === "german" || storedCourseId.startsWith("english"))
    ? (learningEnglish()
        ? (resolveEnglishVariant(getEnglishVariant()) === "american" ? "english-us" : "english-uk")
        : "german")
    : storedCourseId;
  const [courseReaderOpen, setCourseReaderOpen] = useState(false);
  const [courseReaderLesson, setCourseReaderLesson] = useState<string | undefined>(undefined);
  const [courseSessionLesson, setCourseSessionLesson] = useState<string | undefined>(undefined);
  const [sidebarWidth, setSidebarWidth] = useState(() => {
    const fallback = defaultPrototypeSidebarWidth();
    const stored = Number(loadScopedJson(PROTOTYPE_SIDEBAR_KEY, fallback, profile));
    return Number.isFinite(stored) ? clampPrototypeSidebarWidth(stored) : fallback;
  });
  const [stats, setStats] = useState<PrototypeStats>(() => ({
    totalXp: loadScopedJson("totalXp", 0, profile) as number,
    sessionsCompleted: loadScopedJson("sessionsCompleted", 0, profile) as number,
    totalReviews: loadScopedJson("totalReviews", 0, profile) as number,
    streak: getStreak(profile),
    externalWords: loadScopedJson("externalWords", profile?.externalWordsLearned ?? 0, profile) as number,
  }));
  const [ownedShopBadges, setOwnedShopBadges] = useState<ShopBadgeId[]>(() => {
    const stored = loadScopedJson<unknown[]>(SHOP_PURCHASES_KEY, [], profile);
    return Array.isArray(stored) ? stored.filter(isShopBadgeId) : [];
  });
  const [equippedShopBadge, setEquippedShopBadge] = useState<ShopBadgeId | null>(() => {
    const stored = loadScopedJson<unknown>(SHOP_EQUIPPED_KEY, null, profile);
    return isShopBadgeId(stored) ? stored : null;
  });
  const [partsRequested, setPartsRequested] = useState(false);
  const apiParts = usePrototypeParts(partsRequested);
  const requestParts = useCallback(() => setPartsRequested(true), []);
  const reduceMotion = useReducedMotion();
  const effectiveProfile = profile ?? PREVIEW_PROFILE;
  const socialPreviewUnlocked = hasLeonSocialPreview(profile?.email);
  const activeCourse = getCourse(activeCourseId) ?? getCourse("german");
  const activeCourseName = activeCourse?.name ?? "German";
  const courseHasReader = Boolean(activeCourse?.lessons?.length);
  const sessionLesson = activeCourse?.lessons?.find((lesson) => lesson.id === courseSessionLesson);
  const partsReady = Object.keys(apiParts).length > 0;
  const earnedShopCoins = 80
    + Math.floor(stats.totalXp / 100)
    + (stats.sessionsCompleted * 2)
    + Math.floor(stats.totalReviews / 20);
  const spentShopCoins = ownedShopBadges.reduce((total, id) => (
    total + (SHOP_ITEMS.find((item) => item.id === id)?.price ?? 0)
  ), 0);
  const availableShopCoins = Math.max(0, earnedShopCoins - spentShopCoins);
  // Same two steps as the button buried in Profile settings: clear the local
  // session and reload back to the login screen. Progress stays on the device.
  const signOutOfPrototype = useCallback(() => {
    setAuthUser(null);
    window.location.reload();
  }, []);
  const knownVocab = countKnownVocab(profile, stats.externalWords);
  const searchableLessons = useMemo(() => Object.entries(apiParts).map(([id, part]) => ({
    id,
    title: part.theme || part.label,
    subtitle: `${part.level} · ${part.description || part.focus}`,
    group: (isPrototypeBulkPartKey(id) ? "Word bank" : "Lesson") as "Word bank" | "Lesson",
    searchText: buildCatalogSearchText([
      id,
      part.label,
      part.level,
      part.theme,
      part.description,
      part.focus,
      ...(part.phrases ?? []).flatMap((phrase) => [phrase.de, phrase.en]),
      ...(part.vocab ?? []).flatMap((word) => [word.de, word.en]),
    ]),
  })), [apiParts]);

  useEffect(() => {
    const previousTitle = document.title;
    document.documentElement.classList.add("is-ui-prototype");
    document.title = "Micheon";
    return () => {
      document.documentElement.classList.remove("is-ui-prototype");
      document.title = previousTitle;
    };
  }, []);

  useEffect(() => {
    document.documentElement.style.setProperty("--prototype-sidebar-width", `${sidebarWidth}px`);
    return () => {
      document.documentElement.style.removeProperty("--prototype-sidebar-width");
    };
  }, [sidebarWidth]);

  useEffect(() => {
    let cancelled = false;
    const warmProfile = () => {
      if (!cancelled) void loadGamificationPanel();
    };
    const idleWindow = window as Window & typeof globalThis & {
      requestIdleCallback?: (callback: IdleRequestCallback, options?: IdleRequestOptions) => number;
      cancelIdleCallback?: (handle: number) => void;
    };

    if (idleWindow.requestIdleCallback) {
      const handle = idleWindow.requestIdleCallback(warmProfile, { timeout: 3500 });
      return () => {
        cancelled = true;
        idleWindow.cancelIdleCallback?.(handle);
      };
    }

    const timer = window.setTimeout(warmProfile, 1200);
    return () => {
      cancelled = true;
      window.clearTimeout(timer);
    };
  }, []);

  useEffect(() => {
    if (!socialPreviewUnlocked && activeView === "social") setActiveView("home");
  }, [activeView, socialPreviewUnlocked]);

  const navigate = (view: PrototypeView) => {
    if (["learn", "games", "tests", "listen"].includes(view)) setPartsRequested(true);
    setActiveView(view);
    const scrollToTop = () => window.scrollTo({ top: 0, behavior: "auto" });
    scrollToTop();
    window.requestAnimationFrame(() => {
      scrollToTop();
      window.requestAnimationFrame(scrollToTop);
    });
  };

  const openGuidedSession = () => {
    const url = new URL(window.location.href);
    url.searchParams.delete("tab");
    url.searchParams.set("guided", "continue");
    window.location.assign(url.toString());
  };

  const openGuidedLesson = (partId: string) => {
    const url = new URL(window.location.href);
    url.searchParams.delete("tab");
    url.searchParams.set("guided", partId);
    window.location.assign(url.toString());
  };

  const updateStats = (next: Partial<PrototypeStats>) => {
    setStats((current) => {
      const updated = { ...current, ...next };
      Object.entries(next).forEach(([key, value]) => saveScopedJson(key, value, profile));
      return updated;
    });
  };

  const resizeSidebar = (nextWidth: number, persist = false) => {
    const next = clampPrototypeSidebarWidth(nextWidth);
    setSidebarWidth(next);
    if (persist) saveScopedJson(PROTOTYPE_SIDEBAR_KEY, next, profile);
  };

  const selectCourse = (courseId: string) => {
    // German and English are the same built-in course read in opposite
    // directions, so picking one has to move the direction as well as the id.
    // Without this, choosing English left the app teaching German.
    // The two English courses are the same course with a different spelling
    // and accent, so picking one sets both. Doing it here means the choice is
    // made once, in the place you choose the language, instead of being a
    // second setting you have to know to go and find.
    if (courseId === "english-uk" || courseId === "english-us") {
      setLearningDirection("learn-en");
      setEnglishVariant(courseId === "english-uk" ? "british" : "american");
    }
    else if (courseId === "german") setLearningDirection("learn-de");
    persistActiveCourseId(courseId, profile);
    setActiveCourseId(courseId);
    setCourseReaderOpen(false);
    setCourseSessionLesson(undefined);
    setCourseSwitcherOpen(false);
    navigate("home");
  };

  const openCourseReader = (lessonId?: string) => {
    setCourseReaderLesson(lessonId);
    setCourseReaderOpen(true);
  };

  const completeCourseLesson = (lessonId: string) => {
    const done = loadCourseProgress(activeCourseId, profile);
    if (!done.includes(lessonId)) saveCourseProgress(activeCourseId, [...done, lessonId], profile);
    updateStats({ streak: recordStreakDay(profile) });
    setCourseSessionLesson(undefined);
  };

  const chooseShopBadge = (id: ShopBadgeId) => {
    const item = SHOP_ITEMS.find((candidate) => candidate.id === id);
    if (!item) return;

    if (!ownedShopBadges.includes(id)) {
      if (availableShopCoins < item.price) return;
      const nextOwned = [...ownedShopBadges, id];
      setOwnedShopBadges(nextOwned);
      saveScopedJson(SHOP_PURCHASES_KEY, nextOwned, profile);
    }

    setEquippedShopBadge(id);
    saveScopedJson(SHOP_EQUIPPED_KEY, id, profile);
  };

  const searchItems: PrototypeSearchItem[] = [
    ...[
      ...PROTOTYPE_SEARCH_PAGES,
      ...(socialPreviewUnlocked ? [LEON_SOCIAL_SEARCH_PAGE] : []),
    ].map((page) => ({
      id: `page-${page.id}`,
      title: page.title,
      subtitle: page.subtitle,
      group: "Page" as const,
      actionLabel: "Open" as const,
      searchText: buildCatalogSearchText([page.title, page.subtitle, page.keywords]),
      onSelect: () => navigate(page.id),
    })),
    ...searchableLessons.map((lesson) => ({
      ...lesson,
      id: `lesson-${lesson.id}`,
      actionLabel: "Start" as const,
      onSelect: () => openGuidedLesson(lesson.id),
    })),
    ...PROTOTYPE_SEARCH_GAMES.map(([title, subtitle]) => ({
      id: `game-${title.toLocaleLowerCase().replace(/[^a-z0-9]+/g, "-")}`,
      title,
      subtitle,
      group: "Game" as const,
      actionLabel: "Open" as const,
      searchText: buildCatalogSearchText([title, subtitle, "practice play"]),
      onSelect: () => navigate("games"),
    })),
  ];

  const mainView = activeView === "home" ? (
    courseHasReader && activeCourse ? (
      <div className="np-feature-host">
        <Suspense fallback={<FeatureLoading />}>
          <CourseDashboardView
            course={activeCourse}
            onBrowseLessons={() => navigate("learn")}
            onOpenLesson={(lessonId) => setCourseSessionLesson(lessonId)}
            onOpenReader={() => openCourseReader()}
          />
        </Suspense>
      </div>
    ) : (
      <HomeView
        apiParts={apiParts}
        onPractice={openGuidedSession}
        profile={profile}
        onSwitchCourse={() => setCourseSwitcherOpen(true)}
        stats={stats}
        vocab={knownVocab}
      />
    )
  ) : activeView === "learn" ? (
    <div className="np-feature-host">
      {courseHasReader && activeCourse ? (
        <Suspense fallback={<FeatureLoading />}>
          <CourseLessonsView
            course={activeCourse}
            onOpenLesson={(lessonId) => setCourseSessionLesson(lessonId)}
            onOpenReader={() => openCourseReader()}
          />
        </Suspense>
      ) : partsReady ? (
        <Suspense fallback={<FeatureLoading />}>
          <LearningLibraryView apiParts={apiParts} onOpenLesson={openGuidedLesson} />
        </Suspense>
      ) : <FeatureLoading />}
    </div>
  ) : activeView === "practice" ? (
    <PracticeHub onNavigate={navigate} />
  ) : activeView === "listen" ? (
    <div className="np-feature-host">
      {partsReady ? (
        <Suspense fallback={<FeatureLoading />}>
          <ListenView apiParts={apiParts} profile={profile} />
        </Suspense>
      ) : <FeatureLoading />}
    </div>
  ) : activeView === "games" ? (
    <div className="np-feature-host">
      {partsReady ? (
        <Suspense fallback={<FeatureLoading />}>
          <GamesView apiParts={apiParts} vocab={countKnownVocab(profile, stats.externalWords)} />
        </Suspense>
      ) : <FeatureLoading />}
    </div>
  ) : activeView === "social" && socialPreviewUnlocked ? (
    <SocialView userName={profile?.name ?? PREVIEW_PROFILE.name} />
  ) : activeView === "tests" ? (
    <div className="np-feature-host">
      {partsReady ? (
        <Suspense fallback={<FeatureLoading />}>
          <TestsView apiParts={apiParts} profile={effectiveProfile} />
        </Suspense>
      ) : <FeatureLoading />}
    </div>
  ) : activeView === "grammar" ? (
    <div className="np-feature-host guided-session np-grammar-view">
      <Suspense fallback={<FeatureLoading />}>
        <ClozeTabContent />
        <GrammarTabContent />
      </Suspense>
    </div>
  ) : activeView === "shop" ? (
    <ShopView
      availableCoins={availableShopCoins}
      equippedBadge={equippedShopBadge}
      onChooseBadge={chooseShopBadge}
      ownedBadges={ownedShopBadges}
    />
  ) : activeView === "progress" ? (
    <ProgressPanel standalone stats={stats} userName={profile?.name ?? PREVIEW_PROFILE.name} />
  ) : activeView === "profile" ? (
    profile ? (
      <div className="np-feature-host">
        <Suspense fallback={<FeatureLoading />}>
          <GamificationPanel
            activeCourseName={activeCourseName}
            apiParts={apiParts}
            onRequestCatalogue={requestParts}
            onSwitchCourse={() => setCourseSwitcherOpen(true)}
            onUpdateStats={updateStats}
            profileOnly
            stats={stats}
            user={profile}
          />
        </Suspense>
      </div>
    ) : <AccountGate onRequestSignIn={onRequestSignIn} />
  ) : (
    <MoreView
      onNavigate={navigate}
      onSwitchCourse={() => setCourseSwitcherOpen(true)}
      socialPreviewUnlocked={socialPreviewUnlocked}
    />
  );

  const showRightRail = !courseHasReader && (activeView === "home" || activeView === "practice");

  return (
    <div className="new-ui-prototype">
      <div className="np-window">
        <div
          className="np-shell"
          style={{ "--np-sidebar-width": `${sidebarWidth}px` } as CSSProperties}
        >
          <Sidebar
            activeView={activeView}
            onNavigate={navigate}
            onResize={resizeSidebar}
            socialPreviewUnlocked={socialPreviewUnlocked}
            width={sidebarWidth}
          />
          <div className="np-app-area">
            <Header
              avatar={profile?.avatar}
              onSignOut={signOutOfPrototype}
              equippedBadge={equippedShopBadge}
              onNavigate={navigate}
              onProfileIntent={() => { void loadGamificationPanel(); }}
              onSearchOpen={requestParts}
              searchCatalogLoading={partsRequested && !partsReady}
              searchItems={searchItems}
              socialPreviewUnlocked={socialPreviewUnlocked}
              stats={stats}
              userEmail={profile?.email}
              userName={profile?.name ?? PREVIEW_PROFILE.name}
            />
            <div className={`np-content-grid${showRightRail ? "" : " np-content-grid--wide"}`}>
              <motion.main
                animate={{ opacity: 1, y: 0 }}
                className="np-main"
                initial={reduceMotion ? false : { opacity: 0, y: 12 }}
                key={activeView}
                transition={{ duration: reduceMotion ? 0 : 0.24, ease: [0.22, 1, 0.36, 1] }}
              >
                {mainView}
              </motion.main>
              {showRightRail && (
                <aside className="np-right-rail">
                  <ProgressPanel
                    onViewAllAchievements={() => navigate("progress")}
                    stats={stats}
                    userName={profile?.name ?? PREVIEW_PROFILE.name}
                  />
                </aside>
              )}
            </div>
          </div>
        </div>
        <MobileNav activeView={activeView} onNavigate={navigate} />
        <CourseSwitcher
          activeCourseId={activeCourseId}
          onClose={() => setCourseSwitcherOpen(false)}
          onSelect={selectCourse}
          open={courseSwitcherOpen}
        />
        {courseReaderOpen && activeCourse && courseHasReader && (
          <Suspense fallback={<FeatureLoading />}>
            <CourseShell
              course={activeCourse}
              initialLessonId={courseReaderLesson}
              onExit={() => setCourseReaderOpen(false)}
            />
          </Suspense>
        )}
        {sessionLesson && activeCourse && (
          <Suspense fallback={<FeatureLoading />}>
            <CourseSession
              course={activeCourse}
              lesson={sessionLesson}
              onComplete={() => completeCourseLesson(sessionLesson.id)}
              onExit={() => setCourseSessionLesson(undefined)}
            />
          </Suspense>
        )}
      </div>
    </div>
  );
}
