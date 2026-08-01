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
  Coins,
  Crown,
  Gamepad2,
  GraduationCap,
  Home,
  Languages,
  Leaf,
  LockKeyhole,
  Menu,
  MessageCircleMore,
  MessageSquareText,
  Play,
  Search,
  Settings2,
  ShoppingBag,
  Trophy,
  UserRound,
  Volume2,
} from "lucide-react";
import { useEffect, useRef, useState, type ComponentType } from "react";

import GamificationPanel, { getLevelInfo, MILESTONES, type GamificationStats } from "@/Gamification";
import { CourseSwitcher } from "@/components/course/CourseSwitcher";
import { LearnView as LearningLibraryView } from "@/components/lab/LearnView";
import { TestsView } from "@/components/tests/TestsView";
import { GamesView } from "@/games/GamesView";
import ClozeTabContent from "@/lab/ClozeTabContent";
import GrammarTabContent from "@/lab/GrammarTabContent";
import { buildApiPartFromResolved } from "@/lib/api";
import { orderParts } from "@/lib/curriculum";
import { buildBundledParts, buildTatoebaParts, filterPartsForLearningDirection } from "@/lib/contentBank";
import { buildCustomParts, CUSTOM_CONTENT_EVENT } from "@/lib/customContent";
import { allPartBlueprints } from "@/lib/data";
import { DIRECTION_CHANGE_EVENT } from "@/lib/direction";
import { getMasteredCount } from "@/lib/mastery";
import { loadScopedJson, saveScopedJson, type UserProfile } from "@/lib/profileStorage";
import { getStreak } from "@/lib/streak";
import type { Blueprint, Part } from "@/lib/types";
import { getActiveCourseId, setActiveCourseId as persistActiveCourseId } from "@/lib/courses";
import { getCourse } from "@/lib/courseRegistry";

import heroImage from "./assets/micheon-hero-v3.png";
import achievementAtlas from "./assets/achievements-v1/achievement-atlas-v3.png";
import backpackReward from "./assets/rewards-v3/backpack.png";
import flameReward from "./assets/rewards-v3/flame.png";
import heartReward from "./assets/rewards-v3/heart.png";
import starReward from "./assets/rewards-v3/star.png";
import trophyReward from "./assets/rewards-v3/trophy.png";
import "./new-ui-prototype.css";

type PrototypeView = "home" | "learn" | "practice" | "games" | "tests" | "grammar" | "shop" | "progress" | "profile" | "more";
type RewardKind = "heart" | "flame" | "star" | "trophy" | "backpack";
type ShopBadgeId = "leaf" | RewardKind | "crown";

type PrototypeStats = GamificationStats;

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

function Sidebar({ activeView, onNavigate }: { activeView: PrototypeView; onNavigate: (view: PrototypeView) => void }) {
  return (
    <aside className="np-sidebar">
      <BrandMark />
      <nav aria-label="Prototype navigation" className="np-side-nav">
        {NAVIGATION.map((item) => {
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
  stats,
  userName,
}: {
  equippedBadge: ShopBadgeId | null;
  onNavigate: (view: PrototypeView) => void;
  stats: PrototypeStats;
  userName: string;
}) {
  const [searchOpen, setSearchOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const profileMenuRef = useRef<HTMLDivElement | null>(null);
  const firstName = userName.trim().split(/\s+/)[0] || "there";
  const notifications: Array<{ title: string; body: string; view: PrototypeView }> = [
    { title: "Your review is ready", body: "Revisit a few useful phrases while they are still fresh.", view: "practice" },
    { title: "Seven games are ready", body: "Try a short spelling, recall, or vocabulary game.", view: "games" },
  ];

  const openNotification = (view: PrototypeView) => {
    setNotificationsOpen(false);
    onNavigate(view);
  };

  const openProfileDestination = (view: PrototypeView) => {
    setProfileOpen(false);
    onNavigate(view);
  };

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
        <AnimatePresence initial={false}>
          {searchOpen && (
            <motion.label
              animate={{ opacity: 1, width: 220 }}
              className="np-search"
              exit={{ opacity: 0, width: 0 }}
              initial={{ opacity: 0, width: 0 }}
            >
              <Search />
              <input aria-label="Search prototype" autoFocus placeholder="Search lessons" />
            </motion.label>
          )}
        </AnimatePresence>
        <button aria-label="Search" className="np-icon-button np-desktop-search" onClick={() => setSearchOpen((open) => !open)} type="button">
          <Search />
        </button>
        <div className="np-notification-wrap">
          <button
            aria-expanded={notificationsOpen}
            aria-label={`${notifications.length} unread notifications`}
            className="np-icon-button np-notification"
            onClick={() => {
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
                    <small>Learning German</small>
                  </div>
                </div>
                <div className="np-profile-menu-actions">
                  <button onClick={() => openProfileDestination("profile")} role="menuitem" type="button">
                    <span><CircleUserRound /></span>
                    <div><strong>Profile and settings</strong><small>Account, appearance, and preferences</small></div>
                    <ChevronRight />
                  </button>
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
  const { nxt, pct } = getLevelInfo(stats.totalXp);
  const xpTarget = nxt?.xpRequired ?? stats.totalXp;

  return (
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
          <div className="np-progress-track np-progress-track--hero">
            <span style={{ width: `${pct}%` }} />
          </div>
          <small>{stats.totalXp.toLocaleString()} / {xpTarget.toLocaleString()} XP</small>
        </div>
      </div>
    </section>
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
  onSwitchCourse,
  stats,
}: {
  onPractice: () => void;
  onSwitchCourse: () => void;
  stats: PrototypeStats;
}) {
  return (
    <div className="np-home-view">
      <CourseHero onSwitchCourse={onSwitchCourse} stats={stats} />
      <button className="np-mobile-course-button" onClick={onPractice} type="button">
        <Play />
        <span><strong>Continue learning</strong><small>Lesson 12: Everyday phrases</small></span>
        <ChevronRight />
      </button>
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

function MoreView({
  onNavigate,
  onOpenFullApp,
  onSwitchCourse,
}: {
  onNavigate: (view: PrototypeView) => void;
  onOpenFullApp: (tab: string) => void;
  onSwitchCourse: () => void;
}) {
  const features: Array<{
    title: string;
    description: string;
    icon: ComponentType<{ className?: string }>;
    tone: string;
    action: () => void;
  }> = [
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
        <div><strong>Need the original dashboard?</strong><p>It stays available while the new home is being finished.</p></div>
        <button onClick={() => onOpenFullApp("dashboard")} type="button">Open it <ChevronRight /></button>
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
          item.id === "more" && ["tests", "grammar", "shop", "progress", "profile"].includes(activeView)
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

  useEffect(() => {
    const previousTheme = document.documentElement.dataset.theme;
    const previousTitle = document.title;
    document.documentElement.dataset.theme = "light";
    document.documentElement.classList.add("is-ui-prototype");
    document.title = "Micheon UI prototype";
    return () => {
      document.documentElement.classList.remove("is-ui-prototype");
      if (previousTheme) document.documentElement.dataset.theme = previousTheme;
      else delete document.documentElement.dataset.theme;
      document.title = previousTitle;
    };
  }, []);

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
    url.searchParams.set("tab", tab);
    window.location.assign(url.toString());
  };

  const openGuidedSession = () => {
    const url = new URL(window.location.href);
    url.searchParams.delete("ui-prototype");
    url.searchParams.set("tab", "learn");
    url.searchParams.set("guided", "continue");
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

  const mainView = activeView === "home" ? (
    <HomeView onPractice={openGuidedSession} onSwitchCourse={() => setCourseSwitcherOpen(true)} stats={stats} />
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
    <MoreView onNavigate={navigate} onOpenFullApp={openFullApp} onSwitchCourse={() => setCourseSwitcherOpen(true)} />
  );

  const showRightRail = activeView === "home" || activeView === "practice";

  return (
    <div className="new-ui-prototype">
      <div className="np-window">
        <div className="np-shell">
          <Sidebar activeView={activeView} onNavigate={navigate} />
          <div className="np-app-area">
            <Header equippedBadge={equippedShopBadge} onNavigate={navigate} stats={stats} userName={profile?.name ?? PREVIEW_PROFILE.name} />
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
