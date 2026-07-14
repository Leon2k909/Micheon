import React, { startTransition, useDeferredValue, useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

import { TopNav, type TopNavNotification, type TopNavSearchItem } from "@/components/TopNav";
import { DashboardView } from "@/components/lab/DashboardView";
import { LearnView } from "@/components/lab/LearnView";
import { AppLoadingState } from "@/components/lab/Shared";
import { PlacementTest } from "@/components/PlacementTest";
import GuidedSession from "@/GuidedSession";
import GamificationPanel from "@/Gamification";
import { GamesView } from "@/games/GamesView";
import ClozeTabContent from "@/lab/ClozeTabContent";
import GrammarTabContent from "@/lab/GrammarTabContent";
import { buildApiPartFromResolved } from "@/lib/api";
import { orderParts } from "@/lib/curriculum";
import { buildBundledParts, buildTatoebaParts } from "@/lib/contentBank";
import { allPartBlueprints } from "@/lib/data";
import { getAuthUser, loadScopedJson, saveScopedJson, signOut } from "@/lib/profileStorage";
import { Blueprint, Part } from "@/lib/types";
import { buildSession } from "@/session";
import { recordSuccess, recordStruggle, recordDeclaredKnown } from "@/lib/memoryStrength";
import { learningEnglish } from "@/lib/direction";
import { getMasteredCount } from "@/lib/mastery";
import { recordActivitySession } from "@/lib/activity";
import { getStreak, recordStreakDay } from "@/lib/streak";
import { CourseSwitcher } from "@/components/course/CourseSwitcher";
import { CourseShell } from "@/components/course/CourseShell";
import { CourseLessonsView } from "@/components/course/CourseLessonsView";
import { CourseDashboardView } from "@/components/course/CourseDashboardView";
import { CourseSession } from "@/components/course/CourseSession";
import { getActiveCourseId, setActiveCourseId, loadCourseProgress, saveCourseProgress } from "@/lib/courses";
import { getCourse } from "@/lib/courseRegistry";

type ProgressStats = {
  totalXp: number; sessionsCompleted: number;
  totalReviews: number; streak: number; externalWords: number;
};

// Flip a built session step's display fields (de<->en) so the English text becomes
// the thing you read/hear/type and the German becomes the meaning. Used when the
// learner is a German speaker studying English. IDs and everything else are kept.
function swapStepForEnglish(step: any): any {
  if (step?.type === "sentence" && step.item) {
    return { ...step, item: { ...step.item, de: step.item.en, en: step.item.de } };
  }
  if (step?.type === "dialogue" && Array.isArray(step.dialogue?.lines)) {
    return {
      ...step,
      dialogue: {
        ...step.dialogue,
        lines: step.dialogue.lines.map((l: any) => ({ ...l, de: l.en, en: l.de })),
      },
    };
  }
  return step;
}

export default function GermanLearningLab() {
  const user = getAuthUser()!;
  const [activePart, setActivePart] = useState(
    () => loadScopedJson<string>("active-part", "part1", user) || "part1"
  );
  const [activeTab, setActiveTab] = useState("dashboard");
  const [showPlacementTest, setShowPlacementTest] = useState<boolean>(
    () => user.email.toLowerCase() !== "leon@ordifydirect.com" && loadScopedJson("german-lab-placement-done", false, user) === false
  );
  const [showGuidedSession, setShowGuidedSession] = useState(false);
  const [sessionSteps, setSessionSteps] = useState<any[]>([]);
  const sessionStartRef = React.useRef<number | null>(null);
  const [courseSwitcherOpen, setCourseSwitcherOpen] = useState(false);
  const [courseReaderOpen, setCourseReaderOpen] = useState(false);
  const [courseReaderLesson, setCourseReaderLesson] = useState<string | undefined>(undefined);
  const [courseSessionLesson, setCourseSessionLesson] = useState<string | undefined>(undefined);
  const [activeCourseId, setActiveCourse] = useState<string>(() => getActiveCourseId(user));
  const [apiParts, setApiParts] = useState<Record<string, Part>>({});
  const [progressStats, setProgressStats] = useState<ProgressStats>(() => ({
    totalXp:           loadScopedJson("totalXp", 0, user) as number,
    sessionsCompleted: loadScopedJson("sessionsCompleted", 0, user) as number,
    totalReviews:      loadScopedJson("totalReviews", 0, user) as number,
    streak:            getStreak(user),
    externalWords:     loadScopedJson("externalWords", user.externalWordsLearned ?? 0, user) as number,
  }));
  const [gameMasteryCount, setGameMasteryCount] = useState(() => getMasteredCount());

  useEffect(() => {
    const handleUpdate = () => {
      setGameMasteryCount(getMasteredCount());
    };
    window.addEventListener("vocab-mastery-updated", handleUpdate);
    return () => window.removeEventListener("vocab-mastery-updated", handleUpdate);
  }, []);

  useEffect(() => {
    // Reliability floor: blueprint lessons + bundled curated phrasebank +
    // bundled Tatoeba sentence library + the bundled frequency word bank
    // (2,500 most-common German words with EN/FR translations). All of this is
    // shipped with the app, so it works every time, fully offline, no flaky
    // remote fetches (the old remote sources were CORS-blocked or cold-started
    // and gave inconsistent counts).
    const resolved: Record<string, Part> = {};
    for (const [k, bp] of Object.entries(allPartBlueprints))
      resolved[k] = buildApiPartFromResolved(bp as Blueprint, {});
    // Hand-written packs only, served in hard-coded curriculum order (see
    // lib/curriculum.ts): everyday core first, niche/casual last. The old
    // auto-generated word-bank carrier parts are gone — every lesson
    // sentence is predefined by hand.
    // Tatoeba packs are the FINAL tier: real native-written sentences as
    // extra practice, unlocked only after the curated curriculum, each item
    // labelled ("Real-world sentence — extra practice").
    setApiParts(orderParts({ ...resolved, ...buildBundledParts(), ...buildTatoebaParts() }));
  }, []);

  useEffect(() => {
    if (Object.keys(apiParts).length > 0 && !apiParts[activePart]) {
      const firstValid = Object.keys(apiParts)[0];
      if (firstValid) {
        setActivePart(firstValid);
        saveScopedJson("active-part", firstValid, user);
      }
    }
  }, [apiParts, activePart, user]);

  const deferredTab = useDeferredValue(activeTab);
  const currentPart = apiParts[activePart];
  const pathParts   = Object.entries(apiParts);

  const updateStats = (next: Partial<ProgressStats>) => {
    const merged = { ...progressStats, ...next };
    setProgressStats(merged);
    Object.entries(merged).forEach(([k, v]) => saveScopedJson(k, v, user));
  };

  const openTab = (tab: string) => startTransition(() => setActiveTab(tab));

  const COMPLETED_KEY = "session-completed";

  const loadCompleted = (): Record<string, { lastGrade: string; updatedAt?: string }> => {
    try {
      const raw = loadScopedJson<any>(COMPLETED_KEY, {}, user) ?? {};
      if (Array.isArray(raw)) return Object.fromEntries(raw.map((id: string) => [id, { lastGrade: "know" }]));
      return raw && typeof raw === "object" ? raw : {};
    } catch { return {}; }
  };

  const saveReviewGrades = (grades: Record<string, { lastGrade: string; updatedAt?: string }>) => {
    saveScopedJson(COMPLETED_KEY, grades, user);
  };

  // Explicit skip button ("Know it") — a declaration of prior knowledge, not
  // a drill result, so it jumps most of the way up the ladder rather than
  // climbing one rung like an earned recall does. See recordDeclaredKnown.
  const markGrade = (itemId: string, grade: "know" | "struggle") => {
    try {
      const existing = loadCompleted();
      saveReviewGrades({
        ...existing,
        [itemId]: grade === "know" ? recordDeclaredKnown(existing[itemId]) : recordStruggle(),
      });
    } catch {}
  };

  const markCompleted = (stepsToMark: any[]) => {
    try {
      const existing = loadCompleted();
      const next = { ...existing };
      const sessionStart = sessionStartRef.current ?? Date.now();
      // One climb per item per session: rechecks and dialogue lines repeat the
      // same id in the step list, and completion is a single recall event.
      const counted = new Set<string>();
      const markKnown = (id: string) => {
        if (!id || counted.has(id)) return;
        counted.add(id);
        const prior = next[id];
        if (prior?.lastGrade === "struggle") {
          // A struggle marked DURING this session keeps the item in practice.
          // But a struggle from a PREVIOUS session is cleared by completing the
          // item again — otherwise there is no way out: the item requeues every
          // session forever (the "same one lesson on every continue" loop).
          const struggledAt = prior.updatedAt ? Date.parse(prior.updatedAt) : 0;
          if (struggledAt >= sessionStart) return;
        }
        // One rung up the memory ladder; the item comes back for review when due.
        next[id] = recordSuccess(prior);
      };
      stepsToMark.forEach((s) => {
        if (s.type === "sentence" && s.item?.id) {
          markKnown(s.item.id);
        } else if (s.type === "dialogue" && Array.isArray(s.dialogue?.lines)) {
          // Completing a conversation means every line was practised — persist
          // each line, otherwise the same dialogue rebuilds every session and
          // the learner loops on it instead of advancing to new content.
          s.dialogue.lines.forEach((line: any) => { if (line?.id) markKnown(line.id); });
        }
      });
      saveReviewGrades(next);
    } catch {}
  };

  const startSession = (partId?: string) => {
    // Explicit pack picks are respected. Continue Learning passes no id and
    // gets the curriculum treatment: due reviews from ANY pack first (most
    // overdue anywhere — even a pack far down the order — so nothing learned
    // is left to rot), then the first pack in curriculum order that still
    // has fresh content. The most common German is always served first.
    const reviewState = loadCompleted();
    const explicit = partId && apiParts[partId] ? partId : null;

    if (!explicit) {
      const keys = Object.keys(apiParts);
      const globalReviews: any[] = [];
      const seenDe = new Set<string>();
      let freshId: string | undefined;
      let freshSteps: any[] = [];

      for (const pId of keys) {
        const p = apiParts[pId];
        if (!p) continue;
        const s = buildSession({ ...p, partKey: pId }, [], reviewState, 0);
        for (const st of s) {
          if (st.type === "sentence" && st.review && !seenDe.has(st.item.de)) {
            seenDe.add(st.item.de);
            globalReviews.push(st);
          }
        }
        if (!freshId) {
          const fresh = s.filter(
            (st: any) => (st.type === "sentence" && !st.review) || st.type === "dialogue"
          );
          if (fresh.length) { freshId = pId; freshSteps = fresh; }
        }
      }

      globalReviews.sort((a, b) => (b.overdue ?? 0) - (a.overdue ?? 0));
      const reviews = globalReviews.slice(0, 6);
      const reviewDe = new Set(reviews.map((r: any) => r.item.de));
      const fresh = freshSteps.filter(
        (st: any) => st.type !== "sentence" || !reviewDe.has(st.item.de)
      );

      if (reviews.length > 0 || fresh.length > 0) {
        const id = freshId ?? keys[0];
        let steps = [...reviews, ...fresh, { type: "complete" }];
        if (learningEnglish()) steps = steps.map(swapStepForEnglish);
        setActivePart(id);
        saveScopedJson("active-part", id, user);
        setSessionSteps(steps);
        sessionStartRef.current = Date.now();
        setShowGuidedSession(true);
        return;
      }
      // Everything known and nothing due — fall through to a review replay
      // of the first pack below.
    }

    const id   = explicit ?? (Object.keys(apiParts)[0] ?? activePart);
    const part = apiParts[id];
    if (!part) return;

    const partWithKey = { ...part, partKey: id };
    const items = part.vocab.map((item, i) => ({
      id: `${id}-${i}`, de: item.de, en: item.en, tip: item.tip,
      example: item.example, exampleFr: item.exampleFr, kind: "vocab", lookup: item.lookup,
    }));
    let steps = buildSession(partWithKey, items, reviewState, 0);
    // German speaker learning English: show the same content the other way round
    // (English is the target you type/hear; German is the meaning). IDs are left
    // untouched so progress tracking stays consistent in either direction.
    if (learningEnglish()) steps = steps.map(swapStepForEnglish);
    const hasContent = steps.some(s => s.type === "sentence" || s.type === "dialogue");

    if (!hasContent) {
      // Walk the WHOLE curriculum from the top, not just forward: earlier
      // packs may hold due reviews or unfinished tier-1 content, and the
      // most common German must be re-served (and mastered) before anything
      // rarer further down the order unlocks.
      const partKeys = Object.keys(apiParts);
      let nextIdWithContent: string | undefined;

      for (let i = 0; i < partKeys.length; i++) {
        const pId = partKeys[i];
        if (pId === id) continue; // already checked above
        const p = apiParts[pId];
        if (!p) continue;
        const pWithKey = { ...p, partKey: pId };
        const pItems = p.vocab.map((item, index) => ({
          id: `${pId}-${index}`, de: item.de, en: item.en, tip: item.tip,
          example: item.example, exampleFr: item.exampleFr, kind: "vocab", lookup: item.lookup,
        }));
        const pSteps = buildSession(pWithKey, pItems, reviewState, 0);
        if (pSteps.some(s => s.type === "sentence" || s.type === "dialogue")) {
          nextIdWithContent = pId;
          break;
        }
      }

      if (nextIdWithContent) {
        setActivePart(nextIdWithContent);
        saveScopedJson("active-part", nextIdWithContent, user);
        startSession(nextIdWithContent);
        return;
      } else {
        // All course lessons are completed — replay requested part in review mode (without wiping COMPLETED_KEY)
        setActivePart(id);
        saveScopedJson("active-part", id, user);
        let reviewSteps = buildSession(partWithKey, items, {}, 0);
        if (learningEnglish()) reviewSteps = reviewSteps.map(swapStepForEnglish);
        setSessionSteps(reviewSteps);
      }
    } else {
      setActivePart(id);
      saveScopedJson("active-part", id, user);
      setSessionSteps(steps);
    }
    sessionStartRef.current = Date.now();
    setShowGuidedSession(true);
  };

  const logActivity = (stepsForCount: any[]) => {
    const startedAt = sessionStartRef.current;
    sessionStartRef.current = null;
    if (!startedAt) return;
    const durationSec = (Date.now() - startedAt) / 1000;
    if (durationSec < 2) return;
    recordActivitySession(
      {
        ts: Date.now(),
        durationSec,
        sentences: stepsForCount.filter((s) => s.type === "sentence").length,
        dialogues: stepsForCount.filter((s) => s.type === "dialogue").length,
      },
      user
    );
  };

  const handleSelectCourse = (courseId: string) => {
    setActiveCourse(courseId);
    setActiveCourseId(courseId, user);
  };

  const activeCourse = getCourse(activeCourseId);
  const courseHasReader = Boolean(activeCourse?.lessons?.length);
  const openReader = (lessonId?: string) => {
    setCourseReaderLesson(lessonId);
    setCourseReaderOpen(true);
  };
  const startCourseLesson = (lessonId: string) => setCourseSessionLesson(lessonId);
  const completeCourseLesson = (lessonId: string) => {
    const done = loadCourseProgress(activeCourseId, user);
    if (!done.includes(lessonId)) saveCourseProgress(activeCourseId, [...done, lessonId], user);
    updateStats({ streak: recordStreakDay(user) });
    setCourseSessionLesson(undefined);
  };
  const sessionLesson = activeCourse?.lessons?.find((l) => l.id === courseSessionLesson);

  if (showPlacementTest) return (
    <div className="fixed inset-0 z-[600] flex items-center justify-center bg-zinc-50 p-6">
      <PlacementTest onComplete={(key) => {
        setActivePart(key);
        setShowPlacementTest(false);
        saveScopedJson("german-lab-placement-done", true, user);
      }} />
    </div>
  );

  if (showGuidedSession) return (
    <GuidedSession
      onCancel={(completedUpTo?: number) => {
        if (completedUpTo && completedUpTo > 0) {
          markCompleted(sessionSteps.slice(0, completedUpTo));
        }
        logActivity(sessionSteps.slice(0, completedUpTo && completedUpTo > 0 ? completedUpTo : 0));
        setShowGuidedSession(false);
      }}
      onComplete={() => {
        setShowGuidedSession(false);
        markCompleted(sessionSteps);
        logActivity(sessionSteps);
        const xp = sessionSteps.length * 15;
        updateStats({
          totalXp: progressStats.totalXp + xp,
          sessionsCompleted: progressStats.sessionsCompleted + 1,
          totalReviews: progressStats.totalReviews + Math.floor(sessionSteps.length / 2),
          streak: recordStreakDay(user),
        });
      }}
      onGradeItem={(itemId: string, grade: "know" | "struggle") => markGrade(itemId, grade)}
      onAdvance={(step: any) => markCompleted([step])}
      steps={sessionSteps}
    />
  );

  if (!pathParts.length) return <AppLoadingState />;

  const wordBankParts = pathParts.filter(([key]) => key.startsWith("wordbank"));
  const totalWords = pathParts.reduce((sum, [, part]) => sum + part.vocab.length, 0);
  const wordsTracked = progressStats.totalReviews + progressStats.externalWords + gameMasteryCount;
  const dailyLessonDone = progressStats.sessionsCompleted > 0;

  const topNavSearchItems: TopNavSearchItem[] = [
    {
      id: "page-dashboard",
      title: "Dashboard",
      subtitle: "Today, schedule, next lesson, and daily target.",
      group: "Page",
      actionLabel: "Open",
      onSelect: () => openTab("dashboard"),
    },
    {
      id: "page-lessons",
      title: "Lessons",
      subtitle: "Browse all German modules and word-bank sets.",
      group: "Page",
      actionLabel: "Open",
      onSelect: () => openTab("learn"),
    },
    {
      id: "page-practice",
      title: "Practice library",
      subtitle: "Games for spelling, recall, verbs, and quick recognition.",
      group: "Page",
      actionLabel: "Open",
      onSelect: () => openTab("games"),
    },
    {
      id: "page-profile",
      title: "Profile and progress",
      subtitle: "Settings, account details, milestones, XP, and learning totals.",
      group: "Page",
      actionLabel: "Open",
      onSelect: () => openTab("profile"),
    },
    ...pathParts.map(([id, part]) => ({
      id: `lesson-${id}`,
      title: part.theme,
      subtitle: `${part.level} · ${part.description}`,
      group: id.startsWith("wordbank") ? "Word bank" : "Lesson",
      actionLabel: "Start",
      onSelect: () => startSession(id),
    })),
    ...[
      ["Word Snake", "Spell German words by steering through letters."],
      ["Falling Letters", "Catch the correct letters before they leave the screen."],
      ["Letter Tap", "Tap the right letter quickly to train visual recall."],
      ["Verb Shooter", "Choose the correct conjugation before time runs out."],
      ["Vocab Minesweeper", "Translate carefully and avoid wrong picks."],
      ["Vocab Slither", "Match target words while keeping the run alive."],
    ].map(([title, subtitle]) => ({
      id: `practice-${title.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`,
      title,
      subtitle,
      group: "Practice",
      actionLabel: "Open",
      onSelect: () => openTab("games"),
    })),
  ];

  const topNavNotifications: TopNavNotification[] = [
    {
      id: "next-lesson",
      title: `${currentPart?.theme ?? "Next lesson"} is ready`,
      body: currentPart?.focus ?? "Continue your current German lesson.",
      actionLabel: "Start lesson",
      unread: !dailyLessonDone,
      onSelect: () => startSession(),
    },
    {
      id: "daily-target",
      title: dailyLessonDone ? "Daily lesson logged" : "Daily target waiting",
      body: dailyLessonDone ? "You have a session recorded. Add a few words if you want extra progress." : "Finish 1 lesson and track 5 words to move today forward.",
      actionLabel: dailyLessonDone ? "View profile" : "Continue",
      unread: !dailyLessonDone,
      onSelect: () => (dailyLessonDone ? openTab("profile") : startSession()),
    },
    {
      id: "word-bank",
      title: `${totalWords.toLocaleString()} words available`,
      body: `${wordBankParts.length.toLocaleString()} word-bank sets are ready when you want more vocabulary.`,
      actionLabel: "Browse lessons",
      unread: wordsTracked < 5,
      onSelect: () => openTab("learn"),
    },
    {
      id: "streak",
      title: `${progressStats.streak} day streak`,
      body: progressStats.streak > 1 ? "Keep the rhythm going with one short session." : "Start building a habit with one focused lesson.",
      actionLabel: "View profile",
      unread: false,
      onSelect: () => openTab("profile"),
    },
  ];

  const view = deferredTab === "learn" ? (
    courseHasReader && activeCourse ? (
      <CourseLessonsView course={activeCourse} onOpenLesson={(id) => startCourseLesson(id)} onOpenReader={() => openReader()} />
    ) : (
      <LearnView apiParts={apiParts} onOpenLesson={startSession} />
    )
  ) : deferredTab === "profile" ? (
    <GamificationPanel profileOnly stats={progressStats} user={user} onUpdateStats={updateStats} apiParts={apiParts} onSwitchCourse={() => setCourseSwitcherOpen(true)} activeCourseName={activeCourse?.name ?? "German"} />
  ) : deferredTab === "grammar" ? (
    <div className="guided-session space-y-4">
      <ClozeTabContent />
      <GrammarTabContent />
    </div>
  ) : deferredTab === "games" ? (
    <GamesView 
      totalReviews={progressStats.totalReviews}
      externalWords={progressStats.externalWords}
      gameMasteryCount={gameMasteryCount}
    />
  ) : (
    courseHasReader && activeCourse ? (
      <CourseDashboardView
        course={activeCourse}
        onOpenLesson={(id) => startCourseLesson(id)}
        onOpenReader={() => openReader()}
        onBrowseLessons={() => openTab("learn")}
      />
    ) : (
      <DashboardView
        currentPart={currentPart}
        onOpenLesson={startSession}
        pathParts={pathParts}
        progressStats={progressStats}
        gameMasteryCount={gameMasteryCount}
        setActiveTab={openTab}
        activePart={activePart}
      />
    )
  );

  return (
    <div className="min-h-[var(--app-h)] bg-[var(--bg)] text-[var(--text-1)]">
      <TopNav
        activeTab={activeTab}
        setActiveTab={openTab}
        streak={progressStats.streak}
        xp={progressStats.totalXp}
        userName={user.name}
        userEmail={user.email}
        avatarUrl={user.avatar}
        notifications={topNavNotifications}
        onAvatarClick={() => openTab("profile")}
        onSignOut={() => { signOut(); window.location.reload(); }}
        onSwitchCourse={() => setCourseSwitcherOpen(true)}
        searchItems={topNavSearchItems}
        brandName={activeCourse?.name ?? "German Lab"}
        onOpenReader={courseHasReader ? () => openReader() : undefined}
        readerLabel="Course material"
      />

      <CourseSwitcher
        open={courseSwitcherOpen}
        activeCourseId={activeCourseId}
        onSelect={handleSelectCourse}
        onClose={() => setCourseSwitcherOpen(false)}
      />

      {courseReaderOpen && activeCourse && courseHasReader && (
        <CourseShell course={activeCourse} initialLessonId={courseReaderLesson} onExit={() => setCourseReaderOpen(false)} />
      )}

      {sessionLesson && activeCourse && (
        <CourseSession
          course={activeCourse}
          lesson={sessionLesson}
          onComplete={() => completeCourseLesson(sessionLesson.id)}
          onExit={() => setCourseSessionLesson(undefined)}
        />
      )}


      <main className="mx-auto max-w-[1380px] px-4 py-5 pb-24 sm:px-6 lg:py-8 xl:pb-10">
        <AnimatePresence mode="wait">
          <motion.div
            key={deferredTab}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            initial={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
          >
            {view}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}
