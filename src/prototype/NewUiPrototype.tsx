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
  Gamepad2,
  GraduationCap,
  Home,
  Languages,
  Menu,
  MessageCircleMore,
  MessageSquareText,
  Play,
  Search,
  Settings2,
  Trophy,
  UserRound,
  Volume2,
} from "lucide-react";
import { useEffect, useState, type ComponentType } from "react";

import GamificationPanel from "@/Gamification";
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

import heroImage from "./assets/micheon-hero-v2.png";
import backpackReward from "./assets/rewards-v3/backpack.png";
import flameReward from "./assets/rewards-v3/flame.png";
import heartReward from "./assets/rewards-v3/heart.png";
import starReward from "./assets/rewards-v3/star.png";
import trophyReward from "./assets/rewards-v3/trophy.png";
import "./new-ui-prototype.css";

type PrototypeView = "home" | "learn" | "practice" | "games" | "tests" | "grammar" | "progress" | "profile" | "more";
type RewardKind = "heart" | "flame" | "star" | "trophy" | "backpack";

type PrototypeStats = {
  totalXp: number;
  sessionsCompleted: number;
  totalReviews: number;
  streak: number;
  externalWords: number;
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

const NAVIGATION: NavigationItem[] = [
  { id: "home", label: "Home", icon: Home },
  { id: "learn", label: "Learn", icon: BookOpen },
  { id: "practice", label: "Practice", icon: MessageSquareText },
  { id: "games", label: "Games", icon: Gamepad2 },
  { id: "tests", label: "Tests", icon: ClipboardCheck },
  { id: "grammar", label: "Grammar", icon: GraduationCap },
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
              <Icon className="np-nav-icon" />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      <div className="np-sidebar-spacer" />
      <div className="np-tip-card">
        <RewardIcon kind="star" />
        <div>
          <strong>Keep it going!</strong>
          <p>You are doing great.</p>
        </div>
      </div>
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
  onNavigate,
  stats,
  userName,
}: {
  onNavigate: (view: PrototypeView) => void;
  stats: PrototypeStats;
  userName: string;
}) {
  const [searchOpen, setSearchOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const firstName = userName.trim().split(/\s+/)[0] || "there";
  const notifications: Array<{ title: string; body: string; view: PrototypeView }> = [
    { title: "Your review is ready", body: "Revisit a few useful phrases while they are still fresh.", view: "practice" },
    { title: "Seven games are ready", body: "Try a short spelling, recall, or vocabulary game.", view: "games" },
  ];

  const openNotification = (view: PrototypeView) => {
    setNotificationsOpen(false);
    onNavigate(view);
  };

  return (
    <header className="np-header">
      <div className="np-greeting">
        <p>Hi, {firstName}!</p>
        <span>Ready to learn today?</span>
      </div>
      <div className="np-header-stats">
        <StatChip kind="flame" label="Day streak" value={stats.streak.toLocaleString()} />
        <StatChip kind="star" label="Total XP" value={`${stats.totalXp.toLocaleString()} XP`} />
        <StatChip kind="heart" label="Full hearts" value="5" />
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
            onClick={() => setNotificationsOpen((open) => !open)}
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
        <button aria-label="Open profile" className="np-profile-button" onClick={() => onNavigate("profile")} type="button">
          <span>{firstName[0]?.toUpperCase() ?? "?"}</span>
          <ChevronDown />
        </button>
      </div>
    </header>
  );
}

function CourseHero() {
  return (
    <section className="np-course-hero">
      <img alt="" className="np-course-art" src={heroImage} />
      <div aria-hidden="true" className="np-course-shade" />
      <div className="np-course-copy">
        <span className="np-course-kicker">Your active course</span>
        <div className="np-course-title-row">
          <h1>German for real conversations</h1>
          <span aria-label="German" className="np-language-badge"><i /><i /><i /></span>
        </div>
        <div className="np-level-line">
          <strong>Level A2</strong>
          <span>Everyday speaker</span>
        </div>
        <div className="np-course-progress-row">
          <div className="np-progress-track np-progress-track--hero">
            <span style={{ width: "67%" }} />
          </div>
          <small>1,010 / 1,500 XP</small>
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

function ProgressPanel({ standalone = false }: { standalone?: boolean }) {
  const achievements: Array<{ kind: RewardKind; label: string; tone: string }> = [
    { kind: "star", label: "First steps", tone: "green" },
    { kind: "heart", label: "Phrase whiz", tone: "blue" },
    { kind: "backpack", label: "Traveller", tone: "violet" },
    { kind: "trophy", label: "Streak star", tone: "yellow" },
  ];

  return (
    <section className={`np-progress-panel${standalone ? " np-progress-panel--standalone" : ""}`}>
      <div className="np-progress-title">
        <div>
          <h2>Your progress</h2>
          <p>Keep it up, Leon!</p>
        </div>
        <RewardIcon kind="trophy" />
      </div>

      <div className="np-level-card">
        <span className="np-level-badge">A2</span>
        <div className="np-level-copy">
          <strong>Everyday speaker</strong>
          <small>Level 4</small>
          <div className="np-progress-track"><span style={{ width: "67%" }} /></div>
        </div>
        <small>1,010 / 1,500 XP</small>
      </div>

      <div className="np-progress-stats">
        <div><RewardIcon kind="heart" /><strong>5</strong><small>Full hearts</small></div>
        <div><RewardIcon kind="flame" /><strong>7</strong><small>Day streak</small></div>
        <div><RewardIcon kind="star" /><strong>320</strong><small>Total XP</small></div>
      </div>

      <div className="np-badges-block">
        <div className="np-block-heading"><strong>Achievements</strong><button type="button">View all</button></div>
        <div className="np-badge-list">
          {achievements.map((achievement) => (
            <div key={achievement.label}>
              <span className={achievement.tone}><RewardIcon kind={achievement.kind} /></span>
              <small>{achievement.label}</small>
            </div>
          ))}
        </div>
      </div>

      <div className="np-goal-card">
        <div>
          <strong>This week's goal</strong>
          <small>Learn 20 useful phrases</small>
          <div className="np-progress-track"><span style={{ width: "65%" }} /></div>
          <p>13 / 20 phrases</p>
        </div>
        <RewardIcon kind="backpack" />
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

function HomeView({ onPractice }: { onPractice: () => void }) {
  return (
    <div className="np-home-view">
      <CourseHero />
      <button className="np-mobile-course-button" onClick={onPractice} type="button">
        <Play />
        <span><strong>Continue lesson</strong><small>Lesson 12: Everyday phrases</small></span>
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
          item.id === "more" && ["tests", "grammar", "progress", "profile"].includes(activeView)
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
  const apiParts = usePrototypeParts();
  const reduceMotion = useReducedMotion();
  const effectiveProfile = profile ?? PREVIEW_PROFILE;
  const activeCourseName = getCourse(activeCourseId)?.name ?? "German";
  const partsReady = Object.keys(apiParts).length > 0;

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
    window.requestAnimationFrame(() => window.scrollTo({ top: 0, behavior: "auto" }));
  };

  const openFullApp = (tab: string) => {
    const url = new URL(window.location.href);
    url.searchParams.delete("ui-prototype");
    url.searchParams.set("tab", tab);
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

  const mainView = activeView === "home" ? (
    <HomeView onPractice={() => navigate("practice")} />
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
  ) : activeView === "progress" ? (
    <ProgressPanel standalone />
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
            <Header onNavigate={navigate} stats={stats} userName={profile?.name ?? PREVIEW_PROFILE.name} />
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
                  <ProgressPanel />
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
