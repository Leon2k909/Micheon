import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  Bell,
  BookOpen,
  Check,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  CircleUserRound,
  Headphones,
  Home,
  Languages,
  LockKeyhole,
  MessageCircleMore,
  MessageSquareText,
  Plane,
  Play,
  Search,
  Settings2,
  Target,
  Trophy,
  UserRound,
  Volume2,
} from "lucide-react";
import { useEffect, useMemo, useState, type ComponentType, type CSSProperties } from "react";

import heroImage from "./assets/micheon-hero-v2.png";
import rewardAtlas from "./assets/reward-atlas-v2.png";
import "./new-ui-prototype.css";

type PrototypeView = "home" | "learn" | "practice" | "progress" | "profile";
type RewardKind = "heart" | "flame" | "star" | "trophy" | "backpack";

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
  { id: "progress", label: "Progress", icon: Trophy },
  { id: "profile", label: "Profile", icon: UserRound },
];

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

const REWARD_POSITION: Record<RewardKind, number> = {
  heart: 0,
  flame: 25,
  star: 50,
  trophy: 75,
  backpack: 100,
};

function RewardIcon({ kind, className = "" }: { kind: RewardKind; className?: string }) {
  const style = {
    backgroundImage: `url("${rewardAtlas}")`,
    backgroundPosition: `${REWARD_POSITION[kind]}% 50%`,
  } as CSSProperties;

  return <span aria-hidden="true" className={`np-reward-icon ${className}`.trim()} style={style} />;
}

function BrandMark() {
  return (
    <div className="np-brand">
      <span className="np-brand-icon">
        <img alt="" src="/icon-64.png" />
      </span>
      <span>
        <strong>MICHEON</strong>
        <small>Speak naturally</small>
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
          const active = item.id === activeView;
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
      <div className="np-sidebar-mascot" aria-hidden="true">
        <img alt="" src={heroImage} />
      </div>
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

function Header({ onNavigate }: { onNavigate: (view: PrototypeView) => void }) {
  const [searchOpen, setSearchOpen] = useState(false);
  return (
    <header className="np-header">
      <div className="np-greeting">
        <p>Hi, Leon!</p>
        <span>Ready to learn today?</span>
      </div>
      <div className="np-header-stats">
        <StatChip kind="flame" label="Day streak" value="7" />
        <StatChip kind="star" label="This week" value="320 XP" />
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
        <button aria-label="Notifications" className="np-icon-button np-notification" type="button">
          <Bell />
          <span />
        </button>
        <button aria-label="Open profile" className="np-profile-button" onClick={() => onNavigate("profile")} type="button">
          <span>L</span>
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

function LearnView({ onPractice }: { onPractice: () => void }) {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<"all" | "everyday" | "travel" | "work">("all");
  const filteredLessons = useMemo(
    () => LESSONS.filter((lesson) => {
      const matchesQuery = `${lesson.title} ${lesson.detail}`.toLowerCase().includes(query.toLowerCase());
      return matchesQuery && (filter === "all" || lesson.category === filter);
    }),
    [filter, query],
  );

  return (
    <section className="np-page-card np-learn-view">
      <div className="np-page-intro">
        <span className="np-page-icon"><BookOpen /></span>
        <div><h1>Learn what people actually say</h1><p>Start with common sentences, then learn the words inside them.</p></div>
      </div>
      <label className="np-page-search">
        <Search />
        <input onChange={(event) => setQuery(event.target.value)} placeholder="Search lessons and situations" value={query} />
      </label>
      <div aria-label="Lesson filters" className="np-learning-pills">
        {[
          ["all", "Common first"],
          ["everyday", "Everyday life"],
          ["travel", "Travel"],
          ["work", "Work"],
        ].map(([id, label]) => (
          <button aria-pressed={filter === id} className={filter === id ? "is-active" : ""} key={id} onClick={() => setFilter(id as typeof filter)} type="button">
            {label}
          </button>
        ))}
      </div>
      <div className="np-curriculum-list">
        {filteredLessons.map((lesson) => {
          const locked = lesson.status === "locked";
          return (
            <button className={`np-curriculum-row${locked ? " is-locked" : ""}`} disabled={locked} key={lesson.number} onClick={onPractice} type="button">
              <span className={`np-curriculum-icon np-curriculum-icon--${lesson.tone}`}><RewardIcon kind={lesson.reward} /></span>
              <span className="np-curriculum-copy"><small>Lesson {lesson.number}</small><strong>{lesson.title}</strong><p>{lesson.detail}. 12 phrase-first activities.</p></span>
              <span className="np-curriculum-action">{locked ? <LockKeyhole /> : <ChevronRight />}</span>
            </button>
          );
        })}
        {filteredLessons.length === 0 && (
          <div className="np-empty-state"><Search /><strong>No lesson found</strong><p>Try another phrase or clear the selected filter.</p></div>
        )}
      </div>
    </section>
  );
}

function ProfileView() {
  return (
    <section className="np-page-card np-profile-view">
      <div className="np-page-intro">
        <span className="np-profile-avatar">L</span>
        <div><h1>Leon</h1><p>Learning German for everyday conversation.</p></div>
      </div>
      <div className="np-profile-summary">
        <div><strong>86</strong><span>Phrases learned</span></div>
        <div><strong>7 days</strong><span>Current streak</span></div>
        <div><strong>A2</strong><span>Current level</span></div>
      </div>
      <div className="np-settings-list">
        <button type="button"><span><CircleUserRound /></span><div><strong>Account details</strong><small>Name, email, and profile photo</small></div><ChevronRight /></button>
        <button type="button"><span><Languages /></span><div><strong>Learning direction</strong><small>English to German</small></div><ChevronRight /></button>
        <button type="button"><span><Headphones /></span><div><strong>Sound and listening</strong><small>Speech playback and effects</small></div><ChevronRight /></button>
        <button type="button"><span><Target /></span><div><strong>Daily learning goal</strong><small>One lesson and five phrases</small></div><ChevronRight /></button>
      </div>
    </section>
  );
}

function MobileNav({ activeView, onNavigate }: { activeView: PrototypeView; onNavigate: (view: PrototypeView) => void }) {
  return (
    <nav aria-label="Mobile prototype navigation" className="np-mobile-nav">
      {NAVIGATION.map((item) => {
        const Icon = item.icon;
        const active = item.id === activeView;
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

export default function NewUiPrototype() {
  const [activeView, setActiveView] = useState<PrototypeView>("home");
  const reduceMotion = useReducedMotion();

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
    window.scrollTo({ top: 0, behavior: "auto" });
  };

  const mainView = activeView === "home" ? (
    <HomeView onPractice={() => navigate("practice")} />
  ) : activeView === "learn" ? (
    <LearnView onPractice={() => navigate("practice")} />
  ) : activeView === "practice" ? (
    <PracticeCard />
  ) : activeView === "progress" ? (
    <ProgressPanel standalone />
  ) : (
    <ProfileView />
  );

  return (
    <div className="new-ui-prototype">
      <div className="np-window">
        <div aria-hidden="true" className="np-window-bar">
          <span className="np-window-dot np-window-dot--red" />
          <span className="np-window-dot np-window-dot--yellow" />
          <span className="np-window-dot np-window-dot--green" />
        </div>

        <div className="np-shell">
          <Sidebar activeView={activeView} onNavigate={navigate} />
          <div className="np-app-area">
            <Header onNavigate={navigate} />
            <div className={`np-content-grid${activeView === "progress" ? " np-content-grid--wide" : ""}`}>
              <AnimatePresence initial={false} mode="wait">
                <motion.main
                  animate={{ opacity: 1, y: 0 }}
                  className="np-main"
                  exit={reduceMotion ? undefined : { opacity: 0, y: 7 }}
                  initial={reduceMotion ? false : { opacity: 0, y: 12 }}
                  key={activeView}
                  transition={{ duration: reduceMotion ? 0 : 0.24, ease: [0.22, 1, 0.36, 1] }}
                >
                  {mainView}
                </motion.main>
              </AnimatePresence>
              {activeView !== "progress" && (
                <aside className="np-right-rail">
                  <ProgressPanel />
                </aside>
              )}
            </div>
          </div>
        </div>
        <MobileNav activeView={activeView} onNavigate={navigate} />
      </div>
    </div>
  );
}
