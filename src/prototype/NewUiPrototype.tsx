import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  BarChart3,
  Bell,
  BookOpen,
  Check,
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
  Home,
  Languages,
  Leaf,
  LockKeyhole,
  Medal,
  Menu,
  MessageCircleMore,
  MessageSquareText,
  Play,
  Search,
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
  useEffect,
  useMemo,
  useRef,
  useState,
  type ComponentType,
  type CSSProperties,
  type PointerEvent as ReactPointerEvent,
} from "react";

import GamificationPanel, { getLevelInfo, MILESTONES, type GamificationStats } from "@/Gamification";
import { CourseSwitcher } from "@/components/course/CourseSwitcher";
import { LearnView as LearningLibraryView } from "@/components/lab/LearnView";
import { TestsView } from "@/components/tests/TestsView";
import { GamesView } from "@/games/GamesView";
import ClozeTabContent from "@/lab/ClozeTabContent";
import GrammarTabContent from "@/lab/GrammarTabContent";
import { buildApiPartFromResolved } from "@/lib/api";
import { orderParts } from "@/lib/curriculum";
import { buildBundledParts, buildTatoebaParts, filterPartsForLearningDirection, isBulkPartKey } from "@/lib/contentBank";
import { buildCatalogSearchText, normalizeCatalogSearchText } from "@/lib/catalogSearch";
import { buildCustomParts, CUSTOM_CONTENT_EVENT } from "@/lib/customContent";
import { allPartBlueprints } from "@/lib/data";
import { DIRECTION_CHANGE_EVENT } from "@/lib/direction";
import { getMasteredCount } from "@/lib/mastery";
import { loadScopedJson, saveScopedJson, type UserProfile } from "@/lib/profileStorage";
import { getStreak } from "@/lib/streak";
import type { Blueprint, Part } from "@/lib/types";
import { getActiveCourseId, setActiveCourseId as persistActiveCourseId } from "@/lib/courses";
import { getCourse } from "@/lib/courseRegistry";
import { countKnownVocab, getFluency } from "@/lib/fluency";
import { estimateFluencyHours, LEARNING_TIME_UPDATED_EVENT, loadLearningTimeStats } from "@/lib/learningTime";
import { hasLeonSocialPreview } from "@/lib/socialPreview";

import heroImage from "./assets/micheon-hero-v3.png";
import achievementAtlas from "./assets/achievements-v1/achievement-atlas-v3.png";
import backpackReward from "./assets/rewards-v3/backpack.png";
import flameReward from "./assets/rewards-v3/flame.png";
import heartReward from "./assets/rewards-v3/heart.png";
import starReward from "./assets/rewards-v3/star.png";
import trophyReward from "./assets/rewards-v3/trophy.png";
import "./new-ui-prototype.css";

type PrototypeView = "home" | "learn" | "practice" | "games" | "social" | "tests" | "grammar" | "shop" | "progress" | "profile" | "more";
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
  { id: "games", label: "Games", icon: Gamepad2 },
  { id: "tests", label: "Tests", icon: ClipboardCheck },
  { id: "grammar", label: "Grammar", icon: GraduationCap },
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
const PROTOTYPE_SIDEBAR_KEY = "prototype-sidebar-width";

const PROTOTYPE_SEARCH_PAGES: Array<{
  id: PrototypeView;
  title: string;
  subtitle: string;
  keywords: string;
}> = [
  { id: "home", title: "Home", subtitle: "Your course, progress, lesson path, and fluency outlook.", keywords: "dashboard today continue learning" },
  { id: "learn", title: "Lessons", subtitle: "Browse every German lesson and word-bank pack.", keywords: "learn modules packs vocabulary phrases" },
  { id: "practice", title: "Practice", subtitle: "Choose useful phrases and review conversational German.", keywords: "review recall sentences conversation" },
  { id: "games", title: "Games", subtitle: "Spelling, recall, verbs, and quick-recognition games.", keywords: "play word snake falling letters shooter minesweeper slither" },
  { id: "tests", title: "Tests", subtitle: "Build vocabulary, phrase, mixed, or weak-spot tests.", keywords: "quiz assessment level search filters" },
  { id: "grammar", title: "Grammar", subtitle: "Cloze practice and accessible grammar explanations.", keywords: "fill blanks rules sentence structure" },
  { id: "shop", title: "Shop", subtitle: "Unlock and equip profile badges with earned coins.", keywords: "rewards coins badge cosmetics" },
  { id: "progress", title: "Progress and achievements", subtitle: "Levels, streaks, XP, milestones, and activity.", keywords: "stats achievements streak level xp" },
  { id: "profile", title: "Profile and settings", subtitle: "Account, appearance, learning direction, and preferences.", keywords: "account dark mode theme settings language" },
  { id: "more", title: "More", subtitle: "Course switching and the rest of Micheon's tools.", keywords: "courses switch full app options" },
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
  name: "Leon",
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

const COIN_PACKS = [
  { id: "pocket", coins: 500, price: "£1.99", label: "Pocket pack", note: "A small boost for profile rewards." },
  { id: "popular", coins: 1_200, price: "£3.99", label: "Popular pack", note: "Enough for several pins and future rewards.", featured: true },
  { id: "power", coins: 3_000, price: "£7.99", label: "Power pack", note: "A bigger balance for regular learners." },
  { id: "vault", coins: 6_500, price: "£14.99", label: "Coin vault", note: "The largest preview bundle in the shop." },
] as const;

const SHOP_ITEMS: ReadonlyArray<{
  id: ShopBadgeId;
  name: string;
  description: string;
  price: number;
  tone: string;
}> = [
  { id: "leaf", name: "Fresh start pin", description: "A calm green badge for your profile.", price: 60, tone: "mint" },
  { id: "star", name: "Bright star pin", description: "A cheerful badge for steady progress.", price: 90, tone: "yellow" },
  { id: "heart", name: "Kind heart pin", description: "A warm badge for patient learners.", price: 110, tone: "rose" },
  { id: "flame", name: "Streak flame pin", description: "Show that you keep coming back.", price: 140, tone: "orange" },
  { id: "backpack", name: "Explorer pin", description: "A travel badge for curious learners.", price: 170, tone: "violet" },
  { id: "trophy", name: "Champion pin", description: "A gold badge for your biggest wins.", price: 220, tone: "blue" },
  { id: "crown", name: "Conversation crown", description: "The top profile badge in the reward shop.", price: 260, tone: "gold" },
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
  return <img alt="" aria-hidden="true" className={`np-reward-icon ${className}`.trim()} decoding="async" src={REWARD_IMAGE[kind]} />;
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
      <span>
        <strong>MICHEON</strong>
        <small>Made with love by Leon &amp; Michelle</small>
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
  const navigationItems = socialPreviewUnlocked
    ? [...NAVIGATION.slice(0, 4), SOCIAL_NAVIGATION_ITEM, ...NAVIGATION.slice(4)]
    : NAVIGATION;

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

  return (
    <aside className="np-sidebar">
      <BrandMark />
      <nav aria-label="Prototype navigation" className="np-side-nav">
        {navigationItems.map((item) => {
          const Icon = item.icon;
          const active = item.id === activeView || (item.id === "more" && (activeView === "progress" || activeView === "profile"));
          return (
            <button
              aria-current={active ? "page" : undefined}
              className={active ? "is-active" : ""}
              key={item.id}
              onClick={() => onNavigate(item.id)}
              type="button"
            >
              <span aria-hidden="true" className="np-nav-visual"><Icon className="np-nav-icon" /></span>
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      <div className="np-sidebar-spacer" />
      <button
        aria-label="Resize sidebar"
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
          } else if (event.key === "Home") {
            event.preventDefault();
            onResize(PROTOTYPE_SIDEBAR_MIN, true);
          } else if (event.key === "End") {
            event.preventDefault();
            onResize(PROTOTYPE_SIDEBAR_MAX, true);
          }
        }}
        onPointerDown={startResize}
        role="separator"
        title="Drag to resize. Double-click to reset."
        type="button"
      />
    </aside>
  );
}

function StatChip({ kind, value, label }: { kind: RewardKind; value: string; label: string }) {
  return (
    <div className="np-stat-chip">
      <RewardIcon kind={kind} />
      <div>
        <strong>{value}</strong>
        <small>{label}</small>
      </div>
    </div>
  );
}

function Header({
  equippedBadge,
  onNavigate,
  searchItems,
  socialPreviewUnlocked,
  stats,
  userEmail,
  userName,
}: {
  equippedBadge: ShopBadgeId | null;
  onNavigate: (view: PrototypeView) => void;
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
  const notifications: Array<{ title: string; body: string; view: PrototypeView }> = [
    { title: "Your review is ready", body: "Revisit a few useful phrases while they are still fresh.", view: "practice" },
    { title: "Seven games are ready", body: "Try a short spelling, recall, or vocabulary game.", view: "games" },
  ];
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
        <span>Ready to learn today?</span>
      </div>
      <div className="np-header-stats">
        <StatChip kind="flame" label="Day streak" value={stats.streak.toLocaleString()} />
        <StatChip kind="star" label="Total XP" value={`${stats.totalXp.toLocaleString()} XP`} />
        <StatChip kind="trophy" label="Lessons done" value={stats.sessionsCompleted.toLocaleString()} />
      </div>
      <div className="np-header-actions">
        <div className="np-search-wrap" ref={searchWrapRef}>
          <button
            aria-controls="prototype-global-search"
            aria-expanded={searchOpen}
            aria-label="Search Micheon"
            className={`np-icon-button np-desktop-search${searchOpen ? " is-active" : ""}`}
            onClick={() => {
              setNotificationsOpen(false);
              setProfileOpen(false);
              if (searchOpen) closeSearch();
              else setSearchOpen(true);
            }}
            type="button"
          >
            <Search />
          </button>
          <AnimatePresence initial={false}>
            {searchOpen && (
              <motion.div
                animate={{ opacity: 1, scale: 1, y: 0 }}
                aria-label="Search Micheon"
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
                    aria-label="Search lessons, pages, and games"
                    onChange={(event) => setSearchQuery(event.target.value)}
                    onKeyDown={(event) => {
                      if (event.key === "Enter" && filteredSearchItems[0]) selectSearchItem(filteredSearchItems[0]);
                    }}
                    placeholder="Search lessons, pages, games, or a German phrase…"
                    ref={searchInputRef}
                    type="search"
                    value={searchQuery}
                  />
                  {searchQuery && (
                    <button
                      aria-label="Clear search"
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
                  <strong>{searchQuery ? "Search results" : "Quick links"}</strong>
                  <small>{filteredSearchItems.length} {filteredSearchItems.length === 1 ? "result" : "results"}</small>
                </div>

                <div className="np-search-results">
                  {filteredSearchItems.length > 0 ? filteredSearchItems.map((item) => (
                    <button data-testid="prototype-search-result" key={item.id} onClick={() => selectSearchItem(item)} type="button">
                      <span className="np-search-result-group">{item.group}</span>
                      <div>
                        <strong>{item.title}</strong>
                        <small>{item.subtitle}</small>
                      </div>
                      <span className="np-search-result-action">{item.actionLabel}<ChevronRight /></span>
                    </button>
                  )) : (
                    <div className="np-search-empty">
                      <strong>No matching result</strong>
                      <span>Try a lesson name, topic, German phrase, or game.</span>
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
            aria-label={`${notifications.length} unread notifications`}
            className="np-icon-button np-notification"
            onClick={() => {
              closeSearch();
              setProfileOpen(false);
              setNotificationsOpen((open) => !open);
            }}
            type="button"
          >
            <Bell />
            <span aria-hidden="true">{notifications.length}</span>
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
                  <div><strong>Notifications</strong><small>{notifications.length} new</small></div>
                  <button aria-label="Close notifications" onClick={() => setNotificationsOpen(false)} type="button">Close</button>
                </div>
                <div className="np-notification-list">
                  {notifications.map((notification, index) => (
                    <button key={notification.title} onClick={() => openNotification(notification.view)} type="button">
                      <span>{index + 1}</span>
                      <div><strong>{notification.title}</strong><small>{notification.body}</small></div>
                      <ChevronRight />
                    </button>
                  ))}
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
            aria-label="Open profile menu"
            className={`np-profile-button${profileOpen ? " is-open" : ""}`}
            onClick={() => {
              closeSearch();
              setNotificationsOpen(false);
              setProfileOpen((open) => !open);
            }}
            type="button"
          >
            <span className="np-profile-avatar-mark">
              <b>{firstName[0]?.toUpperCase() ?? "?"}</b>
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
                    <b>{firstName[0]?.toUpperCase() ?? "?"}</b>
                    {equippedBadge && <i className="np-equipped-badge"><ShopBadgeArt id={equippedBadge} /></i>}
                  </span>
                  <div>
                    <strong>{firstName}</strong>
                    <small>{userEmail || "Learning German"}</small>
                  </div>
                </div>
                <div className="np-profile-menu-actions">
                  <button onClick={() => openProfileDestination("profile")} role="menuitem" type="button">
                    <span><CircleUserRound /></span>
                    <div><strong>Profile and settings</strong><small>Account, appearance, and preferences</small></div>
                    <ChevronRight />
                  </button>
                  {socialPreviewUnlocked && (
                    <button onClick={() => openProfileDestination("social")} role="menuitem" type="button">
                      <span><UsersRound /></span>
                      <div><strong>Friends and leaderboard</strong><small>Your private social preview</small></div>
                      <ChevronRight />
                    </button>
                  )}
                  <button onClick={() => openProfileDestination("progress")} role="menuitem" type="button">
                    <span><BarChart3 /></span>
                    <div><strong>Your progress</strong><small>Levels, achievements, and activity</small></div>
                    <ChevronRight />
                  </button>
                  <button onClick={() => openProfileDestination("more")} role="menuitem" type="button">
                    <span><Menu /></span>
                    <div><strong>More options</strong><small>Courses and the full Micheon app</small></div>
                    <ChevronRight />
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

function CourseHero({ onSwitchCourse, stats }: { onSwitchCourse: () => void; stats: PrototypeStats }) {
  const reduceMotion = useReducedMotion();
  const { nxt, pct } = getLevelInfo(stats.totalXp);
  const xpTarget = nxt?.xpRequired ?? stats.totalXp;

  return (
    <div className="np-course-hero-frame">
      <section className="np-course-hero">
        <img alt="" className="np-course-art" src={heroImage} />
        <div aria-hidden="true" className="np-course-shade" />
        <div className="np-course-copy">
          <div className="np-course-meta-row">
            <span className="np-course-kicker">Your active course</span>
            <button aria-label="Switch course, currently German" className="np-course-language-chip" onClick={onSwitchCourse} type="button">
              <span aria-hidden="true" className="np-language-badge"><i /><i /><i /></span>
              <strong>German</strong>
              <ChevronDown />
            </button>
          </div>
          <div className="np-course-title-row">
            <h1>German for real conversations</h1>
          </div>
          <div className="np-level-line">
            <strong>Level A2</strong>
            <span>Everyday speaker</span>
          </div>
          <div className="np-course-progress-row">
            <div
              aria-label={`${pct}% progress to the next level`}
              aria-valuemax={100}
              aria-valuemin={0}
              aria-valuenow={pct}
              className="np-progress-track np-progress-track--hero"
              role="progressbar"
            >
              <motion.span
                animate={{ scaleX: pct / 100 }}
                initial={reduceMotion ? false : { scaleX: 0 }}
                style={{ transformOrigin: "left center" }}
                transition={{ delay: 0.22, duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
              />
            </div>
            <small>{stats.totalXp.toLocaleString()} / {xpTarget.toLocaleString()} XP</small>
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
          <h2>Choose the phrase</h2>
          <p>Pick what people actually say in a normal conversation.</p>
        </div>
        <div className="np-mini-progress">
          <strong>{exerciseIndex + 1} in a row</strong>
          <div><i style={{ width: `${((exerciseIndex + 1) / EXERCISES.length) * 100}%` }} /></div>
        </div>
      </div>

      <div className="np-practice-grid">
        <div className="np-prompt-card">
          <span className="np-prompt-language">English</span>
          <button aria-label="Hear the German phrase" className="np-sound-button" onClick={() => playPhrase(exercise.answers[exercise.correct].german)} type="button">
            <Volume2 />
          </button>
          <MessageCircleMore aria-hidden="true" className="np-prompt-symbol" />
          <strong>{exercise.english}</strong>
          <small>Everyday conversation</small>
        </div>

        <div aria-label="German answer choices" className="np-answer-list">
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
              <strong>{correct ? "Exactly right!" : "Try another one"}</strong>
              <p>{exercise.answers[selected].note}</p>
            </div>
            {correct && (
              <button className="np-feedback-next" onClick={next} type="button">
                Next phrase
                <ChevronRight />
              </button>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

function LessonPath({ onOpenLesson }: { onOpenLesson: () => void }) {
  return (
    <section className="np-lesson-path">
      <div className="np-list-heading">
        <div>
          <h2>Your lesson path</h2>
          <p>Common sentences and phrases come first.</p>
        </div>
        <button type="button">View all <ChevronRight /></button>
      </div>
      <div className="np-lesson-list">
        {LESSONS.slice(0, 3).map((lesson) => (
          <button className={`np-lesson-row np-lesson-row--${lesson.tone}`} key={lesson.number} onClick={onOpenLesson} type="button">
            <span className="np-lesson-illustration"><RewardIcon kind={lesson.reward} /></span>
            <span className="np-lesson-number">{lesson.number}</span>
            <span className="np-lesson-copy">
              <strong>{lesson.title}</strong>
              <small>{lesson.detail}</small>
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
    ? "Based on your active lesson pace."
    : estimate.confidence === "developing"
      ? "Becomes more accurate as you complete lessons."
      : "Starting estimate. Complete a timed lesson to personalise it.";

  return (
    <section className="np-fluency-outlook">
      <div className="np-fluency-main">
        <div className="np-fluency-heading">
          <span aria-hidden="true"><Target /></span>
          <div>
            <h2>Your path to fluent conversations</h2>
            <p>A realistic outlook based on useful words and phrases you can recall.</p>
          </div>
        </div>
        <div className="np-fluency-status">
          <div><strong>{fluency.cur.label}</strong><small>{fluency.vocab.toLocaleString()} useful items known</small></div>
          <span>{fluency.overallPct}% to fluent</span>
        </div>
        <div aria-label={`${fluency.overallPct}% to fluent`} className="np-fluency-track">
          <span style={{ width: `${fluency.overallPct}%` }} />
        </div>
        <div className="np-fluency-footnote">
          <span>{fluency.toFluent.toLocaleString()} words and phrases to go</span>
          <span>Fluent target: 5,000</span>
        </div>
      </div>
      <div className="np-fluency-hours">
        <span aria-hidden="true"><Clock3 /></span>
        <small>Estimated active study left</small>
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
      aria-label={`${achievement.label}. ${unlocked ? "Unlocked" : `${progress} of ${achievement.target} ${achievement.unit}`}. ${achievement.desc}`}
      className={`np-achievement${unlocked ? " is-unlocked" : " is-locked"}`}
    >
      <span className="np-achievement-visual">
        <AchievementArt id={achievement.id} />
        <span aria-hidden="true" className="np-achievement-state">{unlocked ? <Check /> : <LockKeyhole />}</span>
      </span>
      <small>{achievement.label}</small>
      {standalone && (
        <span className="np-achievement-detail">
          {unlocked ? "Unlocked" : `${progress} / ${achievement.target} ${achievement.unit}`}
        </span>
      )}
    </div>
  );
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
          <h2>Your progress</h2>
          <p>{earnedAchievements} of {MILESTONES.length} achievements unlocked, {firstName}.</p>
        </div>
        <AchievementArt id="week" />
      </div>

      <div className="np-level-card">
        <span className="np-level-badge">L{cur.level}</span>
        <div className="np-level-copy">
          <strong>{cur.label}</strong>
          <small>{nxt ? `${nxt.xpRequired - stats.totalXp} XP to level ${nxt.level}` : "Highest level reached"}</small>
          <div className="np-progress-track"><span style={{ width: `${pct}%` }} /></div>
        </div>
        <small>{stats.totalXp.toLocaleString()} total XP</small>
      </div>

      <div className="np-progress-stats">
        <div><AchievementArt id="xp_500" /><strong>{stats.totalXp.toLocaleString()}</strong><small>Total XP</small></div>
        <div><AchievementArt id="streak_3" /><strong>{stats.streak.toLocaleString()}</strong><small>Day streak</small></div>
        <div><AchievementArt id="first_session" /><strong>{stats.sessionsCompleted.toLocaleString()}</strong><small>Lessons done</small></div>
      </div>

      <div className="np-badges-block">
        <div className="np-block-heading">
          <strong>Achievements</strong>
          {standalone ? (
            <span className="np-achievement-count">{earnedAchievements} unlocked</span>
          ) : (
            <button onClick={onViewAllAchievements} type="button">View all</button>
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
          <strong>{nextAchievement ? "Next achievement" : "All achievements unlocked"}</strong>
          <small>{nextAchievement?.label ?? "You reached every current milestone."}</small>
          <div className="np-progress-track"><span style={{ width: `${nextAchievement ? nextProgressPercent : 100}%` }} /></div>
          <p>{nextAchievement ? `${nextProgress} / ${nextTarget} ${nextAchievement.unit}` : "Complete"}</p>
        </div>
        <AchievementArt id={nextAchievement?.id ?? "week"} />
      </div>

      <div className="np-completed-block">
        <div className="np-block-heading"><strong>Recently completed</strong><button type="button">View all</button></div>
        {[
          ["Lesson 11", "Getting clarification", "+18 XP"],
          ["Lesson 10", "Giving your opinion", "+16 XP"],
          ["Lesson 9", "Small talk", "+14 XP"],
        ].map(([lesson, title, xp]) => (
          <div className="np-completed-row" key={lesson}>
            <CheckCircle2 />
            <span><strong>{lesson}</strong><small>{title}</small></span>
            <b>{xp}</b>
          </div>
        ))}
      </div>
    </section>
  );
}

function HomeView({
  onPractice,
  profile,
  onSwitchCourse,
  stats,
  vocab,
}: {
  onPractice: () => void;
  profile: UserProfile | null;
  onSwitchCourse: () => void;
  stats: PrototypeStats;
  vocab: number;
}) {
  return (
    <div className="np-home-view">
      <CourseHero onSwitchCourse={onSwitchCourse} stats={stats} />
      <button
        aria-label="Continue learning. Lesson 12: Everyday phrases."
        className="np-mobile-course-button"
        onClick={onPractice}
        type="button"
      >
        <Play />
        <span className="np-course-button-copy">
          <span className="np-course-button-kicker">Your next lesson</span>
          <strong>Continue learning</strong>
          <small>Lesson 12: Everyday phrases</small>
        </span>
        <ChevronRight />
      </button>
      <FluencyOutlook profile={profile} vocab={vocab} />
      <div className="np-home-practice"><PracticeCard compact /></div>
      <LessonPath onOpenLesson={onPractice} />
    </div>
  );
}

function FeatureLoading() {
  return (
    <section aria-label="Loading learning content" className="np-feature-loading">
      <span />
      <div><i /><i /><i /></div>
    </section>
  );
}

function AccountGate({ onOpenFullApp }: { onOpenFullApp: (tab: string) => void }) {
  return (
    <section className="np-page-card np-account-gate">
      <div className="np-page-intro">
        <span className="np-page-icon"><CircleUserRound /></span>
        <div><h1>Sign in to manage your profile</h1><p>Your lessons and games are available in preview mode. Sign in to save account, pet, course, and flashcard changes.</p></div>
      </div>
      <button className="np-primary-button" onClick={() => onOpenFullApp("profile")} type="button">
        Open sign in
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
            <small>Reward shop</small>
            <h1>Make your profile yours</h1>
            <p>Earn coins by learning, then use them on profile pins.</p>
          </div>
        </div>
        <div aria-live="polite" className="np-shop-balance">
          <Coins />
          <div><strong>{availableCoins.toLocaleString()}</strong><small>Micheon coins</small></div>
        </div>
      </div>

      <div className="np-shop-note">
        <Coins />
        <p>You start with 80 welcome coins. More coins come from XP, completed lessons, and reviews. Buying a pin never reduces your XP.</p>
      </div>

      {previewMessage && (
        <div aria-live="polite" className="np-shop-preview-message" data-testid="shop-preview-message" role="status">
          <CheckCircle2 />
          <div><strong>Shop preview</strong><p>{previewMessage}</p></div>
          <button aria-label="Dismiss message" onClick={() => setPreviewMessage("")} type="button"><X /></button>
        </div>
      )}

      <section aria-labelledby="coin-packs-heading" className="np-shop-purchase-section">
        <div className="np-shop-section-heading">
          <div><h2 id="coin-packs-heading">Buy Micheon coins</h2><p>Choose a coin pack for profile pins and future shop rewards.</p></div>
          <span>Checkout preview</span>
        </div>

        <div className="np-coin-pack-grid">
          {COIN_PACKS.map((pack) => (
            <article className={`np-coin-pack${pack.featured ? " is-featured" : ""}`} key={pack.id}>
              <div className="np-coin-pack-icon"><Coins /></div>
              <div className="np-coin-pack-copy">
                <small>{pack.featured ? "Most popular" : pack.label}</small>
                <h3>{pack.coins.toLocaleString()} coins</h3>
                <p>{pack.note}</p>
              </div>
              <button
                data-testid={`shop-coin-pack-${pack.coins}`}
                onClick={() => previewPurchase(`${pack.coins.toLocaleString()} coins are not charged or added yet. Checkout will be connected later.`)}
                type="button"
              >
                <span>{pack.price}</span>
                Buy coins
              </button>
            </article>
          ))}
        </div>
        <p className="np-shop-checkout-note">Preview prices only. Payments are not connected, so these buttons will not charge you.</p>
      </section>

      <section aria-labelledby="premium-heading" className="np-premium-card">
        <div className="np-premium-copy">
          <span className="np-premium-mark"><Crown /></span>
          <div>
            <small>Micheon Premium</small>
            <h2 id="premium-heading">Learn better together</h2>
            <p>A future membership for learners who want more motivation from the people they know.</p>
          </div>
        </div>
        <div className="np-premium-benefits" aria-label="Planned Premium features">
          <span><UserRound /><strong>Add friends</strong></span>
          <span><Trophy /><strong>Friendly leaderboards</strong></span>
          <span><MessageCircleMore /><strong>Learn together</strong></span>
        </div>
        <div className="np-premium-action">
          <div><strong>£5.99</strong><span>per month, preview price</span></div>
          <button
            data-testid="shop-premium-buy"
            onClick={() => previewPurchase("Premium checkout and its social features are not connected yet.")}
            type="button"
          >
            Get Premium
            <ChevronRight />
          </button>
          <small>No charge is made. Friends, leaderboards, and learning together are planned features.</small>
        </div>
      </section>

      <div className="np-shop-section-heading">
        <div><h2>Profile pins</h2><p>Your equipped pin appears on the profile button.</p></div>
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
                ? `Need ${shortfall} more`
                : "Buy and equip";

          return (
            <article className={`np-shop-item${owned ? " is-owned" : ""}${equipped ? " is-equipped" : ""}`} key={item.id}>
              <span className={`np-shop-item-art np-shop-item-art--${item.tone}`}><ShopBadgeArt id={item.id} /></span>
              <div className="np-shop-item-copy">
                <small>Profile pin</small>
                <h3>{item.name}</h3>
                <p>{item.description}</p>
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
    setPreviewNotice(`${action} is a preview in this release. Nothing was sent or changed.`);
  };

  return (
    <section className="np-page-card np-social-view">
      <div className="np-social-hero">
        <span aria-hidden="true" className="np-social-hero-icon"><UsersRound /></span>
        <div className="np-social-hero-copy">
          <span>Leon only</span>
          <h1>Learn better together</h1>
          <p>Keep up with friends, compare weekly XP, and turn practice into a friendly routine.</p>
        </div>
        <div className="np-social-private-badge">
          <LockKeyhole aria-hidden="true" />
          <span><strong>Private preview</strong><small>Visible only on Leon&apos;s account</small></span>
        </div>
      </div>

      <div aria-label="Social sections" className="np-social-tabs" role="tablist">
        <button
          aria-controls="social-friends-panel"
          aria-selected={activeSection === "friends"}
          className={activeSection === "friends" ? "is-active" : ""}
          onClick={() => setActiveSection("friends")}
          role="tab"
          type="button"
        >
          <UsersRound aria-hidden="true" />
          <span><strong>Friends</strong><small>{SOCIAL_FRIENDS.length} learning partners</small></span>
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
          <span><strong>Leaderboard</strong><small>Friends league this week</small></span>
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
            <span><strong>UI preview only</strong><small>{previewNotice}</small></span>
            <button aria-label="Dismiss preview message" onClick={() => setPreviewNotice(null)} type="button"><X /></button>
          </motion.div>
        )}
      </AnimatePresence>

      {activeSection === "friends" ? (
        <div className="np-social-layout" id="social-friends-panel" role="tabpanel">
          <section className="np-social-panel np-friends-panel">
            <div className="np-social-panel-heading">
              <div><span>Your circle</span><h2>Friends</h2><p>See who is learning and keep each other moving.</p></div>
              <button className="np-social-primary-button" onClick={() => showPreviewNotice("Add friend")} type="button"><UserPlus /> Add friend</button>
            </div>
            <label className="np-social-search">
              <Search aria-hidden="true" />
              <input
                aria-label="Search friends"
                onChange={(event) => setFriendQuery(event.target.value)}
                placeholder="Search your friends"
                type="search"
                value={friendQuery}
              />
              {friendQuery && <button aria-label="Clear friend search" onClick={() => setFriendQuery("")} type="button"><X /></button>}
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
                    <span><strong>{friend.streak} days</strong><small>Current streak</small></span>
                  </div>
                  <div className="np-friend-stat">
                    <RewardIcon kind="star" />
                    <span><strong>{friend.weeklyXp.toLocaleString()} XP</strong><small>This week</small></span>
                  </div>
                  <button className="np-social-secondary-button" onClick={() => showPreviewNotice(`Message ${friend.name}`)} type="button">
                    <MessageCircleMore aria-hidden="true" /><span>Message</span>
                  </button>
                </article>
              )) : (
                <div className="np-social-empty">
                  <Search aria-hidden="true" />
                  <strong>No friend matches that search</strong>
                  <span>Try another name or clear the search.</span>
                  <button onClick={() => setFriendQuery("")} type="button">Clear search</button>
                </div>
              )}
            </div>
          </section>

          <aside className="np-social-side-stack">
            <section className="np-social-side-card np-social-side-card--invite">
              <span className="np-social-side-icon"><UserPlus /></span>
              <small>Grow your circle</small>
              <h2>Invite a learning partner</h2>
              <p>Practising feels easier when someone is learning alongside you.</p>
              <button onClick={() => showPreviewNotice("Invite friend")} type="button">Preview invite <ChevronRight /></button>
            </section>
            <section className="np-social-side-card">
              <span className="np-social-side-icon np-social-side-icon--blue"><Swords /></span>
              <small>Friendly challenge</small>
              <h2>Reach 500 XP together</h2>
              <p>You and Michelle are 68% of the way to a shared weekly target.</p>
              <div className="np-social-progress"><span style={{ width: "68%" }} /></div>
              <button onClick={() => showPreviewNotice("Challenge Michelle")} type="button">Open challenge <ChevronRight /></button>
            </section>
          </aside>
        </div>
      ) : (
        <div className="np-social-layout" id="social-leaderboard-panel" role="tabpanel">
          <section className="np-social-panel np-leaderboard-panel">
            <div className="np-social-panel-heading">
              <div><span>Friends league</span><h2>This week</h2><p>XP earned from Monday to Sunday.</p></div>
              <div className="np-leaderboard-time"><Clock3 /><span><strong>3 days left</strong><small>Resets Monday</small></span></div>
            </div>

            <div aria-label="Top three friends" className="np-leaderboard-podium">
              {podium.map((entry) => {
                const rank = leaderboard.findIndex((candidate) => candidate.id === entry.id) + 1;
                return (
                  <div className={`np-podium-place np-podium-place--${rank}`} key={entry.id}>
                    <span className="np-podium-rank">{rank === 1 ? <Medal aria-label="First place" /> : rank}</span>
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
                  <span className="np-leaderboard-person"><strong>{entry.name}{entry.current && <small>You</small>}</strong><small>{entry.streak}-day streak</small></span>
                  <span className="np-leaderboard-xp"><strong>{entry.weeklyXp.toLocaleString()} XP</strong><small>{entry.movement} this week</small></span>
                </article>
              ))}
            </div>
          </section>

          <aside className="np-social-side-stack">
            <section className="np-social-side-card np-social-side-card--target">
              <span className="np-social-side-icon"><Target /></span>
              <small>Your weekly goal</small>
              <h2>685 XP to go</h2>
              <p>You have earned 2,315 of your 3,000 XP target.</p>
              <div className="np-social-progress"><span style={{ width: "77%" }} /></div>
              <strong className="np-social-target-caption">77% complete</strong>
            </section>
            <section className="np-social-side-card">
              <span className="np-social-side-icon np-social-side-icon--gold"><Trophy /></span>
              <small>League reward</small>
              <h2>Finish in the top three</h2>
              <p>Leon is currently second. A short lesson could close the gap.</p>
              <button onClick={() => showPreviewNotice("League details")} type="button">How leagues work <ChevronRight /></button>
            </section>
          </aside>
        </div>
      )}
    </section>
  );
}

function MoreView({
  onNavigate,
  onOpenFullApp,
  onSwitchCourse,
  socialPreviewUnlocked,
}: {
  onNavigate: (view: PrototypeView) => void;
  onOpenFullApp: (tab: string) => void;
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
      title: "Friends and leaderboard",
      description: "See friend activity, weekly XP, streaks, and the private friends league preview.",
      icon: UsersRound,
      tone: "mint",
      action: () => onNavigate("social"),
    }] : []),
    { title: "Tests", description: "Search and filter vocabulary, phrase, and level tests.", icon: ClipboardCheck, tone: "mint", action: () => onNavigate("tests") },
    { title: "Grammar", description: "Practise sentence patterns and fill in missing words.", icon: GraduationCap, tone: "yellow", action: () => onNavigate("grammar") },
    { title: "Progress", description: "See your streak, achievements, recent lessons, and goals.", icon: BarChart3, tone: "blue", action: () => onNavigate("progress") },
    { title: "Reward shop", description: "Earn coins through learning and collect profile pins.", icon: ShoppingBag, tone: "yellow", action: () => onNavigate("shop") },
    { title: "Profile and settings", description: "Manage your account, sound, theme, learning mode, and goals.", icon: Settings2, tone: "violet", action: () => onNavigate("profile") },
    { title: "Courses and packs", description: "Switch courses or browse every hardcoded lesson and phrase pack.", icon: Languages, tone: "blue", action: onSwitchCourse },
    { title: "Pets and flashcards", description: "Choose pets, adjust coaching, and set how flashcards flip.", icon: UserRound, tone: "mint", action: () => onNavigate("profile") },
  ];

  return (
    <section className="np-page-card np-more-view">
      <div className="np-page-intro">
        <span className="np-page-icon"><Menu /></span>
        <div><h1>Everything in one place</h1><p>Games, tests, grammar, course packs, pets, flashcards, progress, and account settings now live inside this layout.</p></div>
      </div>
      <div className="np-feature-directory">
        {features.map((feature) => {
          const Icon = feature.icon;
          return (
            <button key={feature.title} onClick={feature.action} type="button">
              <span className={`np-feature-directory-icon np-feature-directory-icon--${feature.tone}`}><Icon /></span>
              <span><strong>{feature.title}</strong><small>{feature.description}</small></span>
              <ChevronRight />
            </button>
          );
        })}
      </div>
      <div className="np-full-app-callout">
        <div><strong>Need the original dashboard?</strong><p>Your familiar dashboard and every legacy tool are still available.</p></div>
        <button onClick={() => onOpenFullApp("dashboard")} type="button">Open original dashboard <ChevronRight /></button>
      </div>
    </section>
  );
}

function usePrototypeParts() {
  const [apiParts, setApiParts] = useState<Record<string, Part>>({});

  useEffect(() => {
    const resolved: Record<string, Part> = {};
    for (const [key, blueprint] of Object.entries(allPartBlueprints)) {
      resolved[key] = buildApiPartFromResolved(blueprint as Blueprint, {});
    }

    const rebuild = () => {
      setApiParts(orderParts(filterPartsForLearningDirection({
        ...resolved,
        ...buildBundledParts(),
        ...buildTatoebaParts(),
        ...buildCustomParts(),
      })));
    };

    rebuild();
    window.addEventListener(CUSTOM_CONTENT_EVENT, rebuild);
    window.addEventListener(DIRECTION_CHANGE_EVENT, rebuild);
    return () => {
      window.removeEventListener(CUSTOM_CONTENT_EVENT, rebuild);
      window.removeEventListener(DIRECTION_CHANGE_EVENT, rebuild);
    };
  }, []);

  return apiParts;
}

function MobileNav({ activeView, onNavigate }: { activeView: PrototypeView; onNavigate: (view: PrototypeView) => void }) {
  return (
    <nav aria-label="Mobile prototype navigation" className="np-mobile-nav">
      {MOBILE_NAVIGATION.map((item) => {
        const Icon = item.icon;
        const active = item.id === activeView || (
          item.id === "more" && ["social", "tests", "grammar", "shop", "progress", "profile"].includes(activeView)
        );
        return (
          <button aria-current={active ? "page" : undefined} className={active ? "is-active" : ""} key={item.id} onClick={() => onNavigate(item.id)} type="button">
            <Icon />
            <span>{item.label}</span>
          </button>
        );
      })}
    </nav>
  );
}

export default function NewUiPrototype({ profile }: { profile: UserProfile | null }) {
  const [activeView, setActiveView] = useState<PrototypeView>("home");
  const [courseSwitcherOpen, setCourseSwitcherOpen] = useState(false);
  const [activeCourseId, setActiveCourseId] = useState(() => getActiveCourseId(profile));
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
  const apiParts = usePrototypeParts();
  const reduceMotion = useReducedMotion();
  const effectiveProfile = profile ?? PREVIEW_PROFILE;
  const socialPreviewUnlocked = hasLeonSocialPreview(profile?.email);
  const activeCourseName = getCourse(activeCourseId)?.name ?? "German";
  const partsReady = Object.keys(apiParts).length > 0;
  const earnedShopCoins = 80
    + Math.floor(stats.totalXp / 100)
    + (stats.sessionsCompleted * 2)
    + Math.floor(stats.totalReviews / 20);
  const spentShopCoins = ownedShopBadges.reduce((total, id) => (
    total + (SHOP_ITEMS.find((item) => item.id === id)?.price ?? 0)
  ), 0);
  const availableShopCoins = Math.max(0, earnedShopCoins - spentShopCoins);
  const knownVocab = countKnownVocab(profile, stats.externalWords);
  const searchableLessons = useMemo(() => Object.entries(apiParts).map(([id, part]) => ({
    id,
    title: part.theme || part.label,
    subtitle: `${part.level} · ${part.description || part.focus}`,
    group: (isBulkPartKey(id) ? "Word bank" : "Lesson") as "Word bank" | "Lesson",
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
    return () => document.documentElement.style.removeProperty("--prototype-sidebar-width");
  }, [sidebarWidth]);

  useEffect(() => {
    if (!socialPreviewUnlocked && activeView === "social") setActiveView("home");
  }, [activeView, socialPreviewUnlocked]);

  const navigate = (view: PrototypeView) => {
    setActiveView(view);
    const scrollToTop = () => window.scrollTo({ top: 0, behavior: "auto" });
    scrollToTop();
    window.requestAnimationFrame(() => {
      scrollToTop();
      window.requestAnimationFrame(scrollToTop);
    });
  };

  const openFullApp = (tab: string) => {
    const url = new URL(window.location.href);
    url.searchParams.delete("ui-prototype");
    url.searchParams.delete("guided");
    url.searchParams.delete("guided-theme");
    url.searchParams.set("legacy-dashboard", "1");
    url.searchParams.set("tab", tab);
    window.location.assign(url.toString());
  };

  const openGuidedSession = () => {
    const url = new URL(window.location.href);
    url.searchParams.delete("ui-prototype");
    url.searchParams.delete("legacy-dashboard");
    url.searchParams.set("tab", "learn");
    url.searchParams.set("guided", "continue");
    url.searchParams.set("guided-theme", "prototype");
    window.location.assign(url.toString());
  };

  const openGuidedLesson = (partId: string) => {
    const url = new URL(window.location.href);
    url.searchParams.delete("ui-prototype");
    url.searchParams.delete("legacy-dashboard");
    url.searchParams.set("tab", "learn");
    url.searchParams.set("guided", partId);
    url.searchParams.set("guided-theme", "prototype");
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
    persistActiveCourseId(courseId, profile);
    setActiveCourseId(courseId);
    if (courseId !== "german") openFullApp("dashboard");
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
    <HomeView
      onPractice={openGuidedSession}
      profile={profile}
      onSwitchCourse={() => setCourseSwitcherOpen(true)}
      stats={stats}
      vocab={knownVocab}
    />
  ) : activeView === "learn" ? (
    <div className="np-feature-host">
      {partsReady ? <LearningLibraryView apiParts={apiParts} onOpenLesson={() => openFullApp("learn")} /> : <FeatureLoading />}
    </div>
  ) : activeView === "practice" ? (
    <PracticeCard />
  ) : activeView === "games" ? (
    <div className="np-feature-host">
      {partsReady ? (
        <GamesView
          apiParts={apiParts}
          externalWords={stats.externalWords}
          gameMasteryCount={getMasteredCount()}
          totalReviews={stats.totalReviews}
        />
      ) : <FeatureLoading />}
    </div>
  ) : activeView === "social" && socialPreviewUnlocked ? (
    <SocialView userName={profile?.name ?? "Leon"} />
  ) : activeView === "tests" ? (
    <div className="np-feature-host">
      {partsReady ? <TestsView apiParts={apiParts} profile={effectiveProfile} /> : <FeatureLoading />}
    </div>
  ) : activeView === "grammar" ? (
    <div className="np-feature-host guided-session np-grammar-view">
      <ClozeTabContent />
      <GrammarTabContent />
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
        <GamificationPanel
          activeCourseName={activeCourseName}
          apiParts={apiParts}
          onSwitchCourse={() => setCourseSwitcherOpen(true)}
          onUpdateStats={updateStats}
          profileOnly
          stats={stats}
          user={profile}
        />
      </div>
    ) : <AccountGate onOpenFullApp={openFullApp} />
  ) : (
    <MoreView
      onNavigate={navigate}
      onOpenFullApp={openFullApp}
      onSwitchCourse={() => setCourseSwitcherOpen(true)}
      socialPreviewUnlocked={socialPreviewUnlocked}
    />
  );

  const showRightRail = activeView === "home" || activeView === "practice";

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
              equippedBadge={equippedShopBadge}
              onNavigate={navigate}
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
      </div>
    </div>
  );
}
