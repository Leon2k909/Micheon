import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";

import { useAppThemePreferences } from "@/components/AppThemeProvider";
import { AstryxAppShell } from "@/components/astryx/AstryxAppShell";
import { AstryxDashboardView } from "@/components/astryx/AstryxDashboardView";
import { TopNav, type TopNavNotification, type TopNavSearchItem } from "@/components/TopNav";
import { TestsView } from "@/components/tests/TestsView";
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
import { getAuthUser, getScopedKey, loadScopedJson, saveScopedJson, signOut } from "@/lib/profileStorage";
import { Blueprint, Part } from "@/lib/types";
import { buildCatalog, buildSession, pickReviews, OLD_PER_LESSON } from "@/session";
import { isDueForReview, recordSuccess, recordStruggle, recordDeclaredKnown } from "@/lib/memoryStrength";
import { learningEnglish } from "@/lib/direction";
import {
  detectRegister, pickRegisterQuestion, recordRegisterAnswer,
  type Register, type RegisterState,
} from "@/lib/registerCheck";
import { getMasteredCount } from "@/lib/mastery";
import { computeAbility, lessonPriority } from "@/lib/ability";
import { buildCorpusIndex, packCommonality } from "@/lib/corpusFrequency";
import { COMPLETED_KEY, loadGradeStore, recordActivitySession, statusForId } from "@/lib/activity";
import { getStreak, recordStreakDay } from "@/lib/streak";
import { CourseSwitcher } from "@/components/course/CourseSwitcher";
import { CourseShell } from "@/components/course/CourseShell";
import { CourseLessonsView } from "@/components/course/CourseLessonsView";
import { CourseDashboardView } from "@/components/course/CourseDashboardView";
import { CourseSession } from "@/components/course/CourseSession";
import { useCodexPets } from "@/components/codexPets/CodexPetProvider";
import { useCodexPetCoaching } from "@/components/codexPets/useCodexPetCoaching";
import { getActiveCourseId, setActiveCourseId, loadCourseProgress, saveCourseProgress } from "@/lib/courses";
import { getCourse } from "@/lib/courseRegistry";
import { ui, uiIsGerman } from "@/lib/i18n";
import { getCodexPetCadence } from "@/lib/codexPetCoaching";

type ProgressStats = {
  totalXp: number; sessionsCompleted: number;
  totalReviews: number; streak: number; externalWords: number;
};

// Flip a built session step's display fields (de<->en) so the English text becomes
// the thing you read/hear/type and the German becomes the meaning. Used when the
// learner is a German speaker studying English. IDs and everything else are kept.
function swapStepForEnglish(step: any): any {
  if (step?.type === "sentence" && step.item) {
    // These fields explain German register, pronunciation, short forms, or
    // usage. After the swap the learner is practising the English line, so
    // keeping them would show irrelevant German-specific coaching.
    const item = { ...step.item };
    for (const key of ["say", "long", "short", "use", "when", "tierNote"]) delete item[key];
    return { ...step, item: { ...item, de: step.item.en, en: step.item.de } };
  }
  if (step?.type === "dialogue" && Array.isArray(step.dialogue?.lines)) {
    return {
      ...step,
      dialogue: {
        ...step.dialogue,
        lines: step.dialogue.lines.map((line: any) => {
          const rest = { ...line };
          for (const key of ["say", "long", "short", "use", "when", "tierNote"]) delete rest[key];
          return { ...rest, de: line.en, en: line.de };
        }),
      },
    };
  }
  return step;
}

const REGISTER_KEY = "register-checks";

/**
 * Slip one Sie-or-du situation question into a lesson, just before the finish
 * screen — but only when the lesson actually taught a sentence that commits to
 * a register, and only when a question is due. Typing a sentence right proves
 * nothing about knowing who to say it to.
 *
 * Skipped entirely for German speakers learning English: the du/Sie split is
 * the thing they already have and English lacks.
 */
function withRegisterCheck(steps: any[], user: any): any[] {
  if (learningEnglish()) return steps;
  const registers = Array.from(
    new Set(
      steps
        .filter((s) => s?.type === "sentence" && s.item?.de)
        .map((s) => detectRegister(s.item.de))
        .filter(Boolean) as Register[]
    )
  );
  const state = (loadScopedJson<RegisterState>(REGISTER_KEY, {}, user) as RegisterState) ?? {};
  const question = pickRegisterQuestion(registers, state);
  if (!question) return steps;

  const completeAt = steps.findIndex((s) => s?.type === "complete");
  const at = completeAt === -1 ? steps.length : completeAt;
  return [...steps.slice(0, at), { type: "register", question }, ...steps.slice(at)];
}

export default function GermanLearningLab() {
  const user = getAuthUser()!;
  const themePreferences = useAppThemePreferences();
  const {
    history: petHistory,
    selectedKey: selectedPetKey,
    selectedPet,
    speak: petSpeak,
    speech: petSpeech,
  } = useCodexPets();
  const { frequencies: petCoachingFrequencies } = useCodexPetCoaching();
  const [activePart, setActivePart] = useState(
    () => loadScopedJson<string>("active-part", "part1", user) || "part1"
  );
  const [activeTab, setActiveTab] = useState("dashboard");
  const [showPlacementTest, setShowPlacementTest] = useState<boolean>(
    () => loadScopedJson("german-lab-placement-done", false, user) === false
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
  // Scans every phrase in the course, so it is built once per pack list rather
  // than on every Continue learning press.
  const corpusIndex = React.useMemo(() => buildCorpusIndex(apiParts as any), [apiParts]);
  const [gameMasteryCount, setGameMasteryCount] = useState(() => getMasteredCount());
  const [gradeRevision, setGradeRevision] = useState(0);
  const petSpeechRef = React.useRef(petSpeech);
  const petHistoryRef = React.useRef(petHistory);
  const petQuizIndex = React.useRef(0);
  const petQuizItemsRef = React.useRef<ReturnType<typeof buildCatalog>>([]);
  petSpeechRef.current = petSpeech;
  petHistoryRef.current = petHistory;

  const petQuizItems = React.useMemo(
    () => {
      const grades = loadGradeStore(user);
      const eligible = buildCatalog(apiParts).filter((item) => {
        const de = item.de?.trim() ?? "";
        const en = item.en?.trim() ?? "";
        return de.length >= 2 && en.length >= 2 && de.length <= 64 && en.length <= 64;
      });
      const recordFor = (item: (typeof eligible)[number]) =>
        [item.id, ...(item.aliases ?? [])]
          .map((id) => grades[id])
          .find(Boolean);
      const priority = (item: (typeof eligible)[number]) => {
        const record = recordFor(item);
        if (record?.lastGrade === "struggle") return 0;
        if (isDueForReview(record)) return 1;
        return 2;
      };

      // The mascot is a memory coach, not a source of surprise curriculum:
      // revisit only material the learner has already encountered.
      return eligible
        .filter((item) => statusForId(grades, item.id, item.aliases) !== "new")
        .sort((a, b) => {
          const priorityDifference = priority(a) - priority(b);
          if (priorityDifference !== 0) return priorityDifference;
          const aUpdated = Date.parse(recordFor(a)?.updatedAt ?? "") || 0;
          const bUpdated = Date.parse(recordFor(b)?.updatedAt ?? "") || 0;
          return aUpdated - bUpdated;
        })
        .slice(0, 1200);
    },
    [apiParts, gradeRevision, user]
  );
  petQuizItemsRef.current = petQuizItems;
  const petQuizAvailable = petQuizItems.length > 0;
  const petEnabled = Boolean(selectedPet && selectedPetKey !== "off");

  useEffect(() => {
    const scopedGradeKey = getScopedKey(COMPLETED_KEY, user);
    const refreshGrades = () => setGradeRevision((revision) => revision + 1);
    const handleStorage = (event: StorageEvent) => {
      if (event.key === scopedGradeKey) refreshGrades();
    };
    window.addEventListener("grades-updated", refreshGrades);
    window.addEventListener("storage", handleStorage);
    return () => {
      window.removeEventListener("grades-updated", refreshGrades);
      window.removeEventListener("storage", handleStorage);
    };
  }, [user]);

  useEffect(() => {
    const cadence = getCodexPetCadence("questions", petCoachingFrequencies.questions);
    if (!petEnabled || showGuidedSession || showPlacementTest || !petQuizAvailable || !cadence) {
      return undefined;
    }

    let questionTimer: number | undefined;
    let active = true;
    const learnsEnglish = learningEnglish();

    const scheduleQuestion = (delayMs: number) => {
      if (!active) return;
      questionTimer = window.setTimeout(askQuestion, delayMs);
    };

    const askQuestion = () => {
      if (!active) return;
      if (petSpeechRef.current) {
        scheduleQuestion(15000);
        return;
      }

      const quizItems = petQuizItemsRef.current;
      if (quizItems.length === 0) {
        scheduleQuestion(cadence.intervalMs);
        return;
      }

      const recentlyAsked = new Set(
        petHistoryRef.current
          .filter((message) =>
            message.question?.itemId
            && Date.now() - message.createdAt < 30 * 60 * 1000
          )
          .map((message) => message.question!.itemId)
      );
      let item: (typeof quizItems)[number] | undefined;
      for (let offset = 0; offset < quizItems.length; offset += 1) {
        const index = (petQuizIndex.current + offset) % quizItems.length;
        const candidate = quizItems[index];
        if (!recentlyAsked.has(candidate.id)) {
          item = candidate;
          petQuizIndex.current = index + 1;
          break;
        }
      }
      if (!item) {
        scheduleQuestion(cadence.intervalMs);
        return;
      }

      const question = learnsEnglish
        ? `Erinnerst du dich, wie man „${item.de}“ auf Englisch sagt?`
        : `Do you remember how to say “${item.en}” in German?`;
      petSpeak(question, {
        durationMs: 20000,
        mood: "greeting",
        question: {
          aliases: item.aliases,
          answerLanguage: learnsEnglish ? "en" : "de",
          de: item.de,
          en: item.en,
          itemId: item.id,
        },
      });
      scheduleQuestion(cadence.intervalMs);
    };

    scheduleQuestion(cadence.initialDelayMs);
    return () => {
      active = false;
      if (questionTimer) window.clearTimeout(questionTimer);
    };
  }, [
    petCoachingFrequencies.questions,
    petEnabled,
    petQuizAvailable,
    petSpeak,
    showGuidedSession,
    showPlacementTest,
  ]);

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

  const currentPart = apiParts[activePart];
  const pathParts   = Object.entries(apiParts);

  const updateStats = (next: Partial<ProgressStats>) => {
    const merged = { ...progressStats, ...next };
    setProgressStats(merged);
    Object.entries(merged).forEach(([k, v]) => saveScopedJson(k, v, user));
  };

  // Tab switches must be SYNCHRONOUS. This used to be
  // `startTransition(() => setActiveTab(tab))` with the view reading a
  // `useDeferredValue` copy — React then treated the switch as low priority and,
  // combined with the mode="wait" tab wrapper below, the profile
  // view never actually swapped in: clicking "Profile settings" did nothing.
  const openTab = (tab: string) => setActiveTab(tab);

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

  // The end-of-lesson memory check is a genuine delayed recall, so a "yes"
  // climbs one normal SRS rung. A "not yet" resets the item and makes it block
  // fresh material until it has been practised again.
  const markMemoryGrade = (itemId: string, grade: "know" | "struggle") => {
    try {
      const existing = loadCompleted();
      saveReviewGrades({
        ...existing,
        [itemId]: grade === "know" ? recordSuccess(existing[itemId]) : recordStruggle(),
      });
    } catch {}
  };

  const replaceKnownPreviewItem = (itemId: string) => {
    markGrade(itemId, "know");
    setSessionSteps((current) => {
      const replaceAt = current.findIndex(
        (step) => step?.type === "sentence" && step.item?.id === itemId
      );
      if (replaceAt < 0) return current;

      const usedIds = new Set(
        current
          .filter((step) => step?.type === "sentence" && step.item?.id)
          .map((step) => String(step.item.id))
      );
      const grades = loadGradeStore(user);
      const candidates = buildCatalog(apiParts).filter(
        (item) => !usedIds.has(item.id) && statusForId(grades, item.id, item.aliases) === "new"
      );
      const replacement =
        candidates.find((item) => item.partKey === activePart) ??
        candidates[0];

      if (!replacement) return current;

      let replacementStep: any = {
        type: "sentence",
        item: {
          id: replacement.id,
          aliases: replacement.aliases,
          de: replacement.de,
          en: replacement.en,
          fr: replacement.fr,
          lookup: replacement.lookup,
          use: replacement.use,
          short: replacement.short,
          when: replacement.when,
          say: replacement.say,
          long: replacement.long,
          group: replacement.group,
          tierNote: replacement.tierNote,
        },
      };
      if (learningEnglish()) replacementStep = swapStepForEnglish(replacementStep);

      const next = [...current];
      next[replaceAt] = replacementStep;
      return next;
    });
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
        // Items are saved as each step is left and once more when the lesson
        // closes. "Know it" also writes immediately. Keep all three paths from
        // advancing the same memory record more than once in one session.
        const updatedAt = prior?.updatedAt ? Date.parse(prior.updatedAt) : 0;
        if (Number.isFinite(updatedAt) && updatedAt >= sessionStart) return;
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

  /**
   * Start a lesson on an explicit list of items — the words a learner marked
   * as "I don't know this" while taking a test.
   *
   * These are deliberately NOT filtered by what the learner already knows, the
   * way a normal lesson is: they asked for these specifically, so a "known"
   * grade from weeks ago should not quietly drop them from the lesson they just
   * requested. Hence the empty review state.
   */
  const startFocusSession = (items: { de: string; en: string; id?: string }[]) => {
    if (!items.length) return;
    // buildSession caps a lesson at NEW_PER_LESSON (3) fresh phrases, which is
    // right for pacing the curriculum and wrong here: the learner named these
    // words, so silently teaching three of ten would be a lie. Build in chunks
    // of three and stitch the blocks together, dropping every block's trailing
    // "complete" step except the last so it still reads as one lesson.
    const CHUNK = 3;
    const steps: any[] = [];
    for (let i = 0; i < items.length; i += CHUNK) {
      const slice = items.slice(i, i + CHUNK);
      const block = buildSession(
        {
          partKey: "focus",
          label: ui("Your words"),
          level: "",
          theme: ui("Words you marked in a test"),
          vocab: [],
          phrases: slice.map((item) => ({ de: item.de, en: item.en })),
          dialogues: [],
        },
        [],
        {},
        0
      );
      steps.push(...block.filter((step: any) => step?.type !== "complete"));
    }
    if (!steps.length) return;
    steps.push({ type: "complete" });
    const directed = learningEnglish() ? steps.map(swapStepForEnglish) : steps;
    setSessionSteps(withRegisterCheck(directed, user));
    sessionStartRef.current = Date.now();
    setShowGuidedSession(true);
    openTab("learn");
  };

  const startSession = (partId?: string) => {
    // Explicit pack picks are respected. Continue Learning passes no id and
    // gets the curriculum treatment: due reviews from ANY pack first (most
    // overdue anywhere — even a pack far down the order — so nothing learned
    // is left to rot), then the first pack in curriculum order that still
    // has fresh content. The most common German is always served first.
    const reviewState = loadCompleted();
    const explicit = partId && apiParts[partId] ? partId : null;

    // A learner who said "not yet" at the pet's memory check gets those weak
    // items first. Do not mix in fresh curriculum until every struggle has
    // been recalled and moved back onto the spaced-repetition ladder.
    const requiredReviews: any[] = [];
    const requiredIds = new Set<string>();
    for (const [reviewPartId, reviewPart] of Object.entries(apiParts)) {
      const reviewSteps = buildSession(
        { ...reviewPart, partKey: reviewPartId },
        [],
        reviewState,
        0
      );
      for (const reviewStep of reviewSteps) {
        const itemId = reviewStep?.type === "sentence" ? reviewStep.item?.id : null;
        if (
          itemId
          && !requiredIds.has(itemId)
          && reviewState[itemId]?.lastGrade === "struggle"
        ) {
          requiredIds.add(itemId);
          requiredReviews.push(reviewStep);
        }
      }
    }
    if (requiredReviews.length > 0) {
      let steps = [...requiredReviews.slice(0, 6), { type: "complete" }];
      if (learningEnglish()) steps = steps.map(swapStepForEnglish);
      const reviewPartId = requiredReviews[0]?.item?.id
        ? Object.keys(apiParts).find((key) => String(requiredReviews[0].item.id).startsWith(`${key}-`))
        : undefined;
      const id = reviewPartId ?? explicit ?? activePart;
      setActivePart(id);
      saveScopedJson("active-part", id, user);
      setSessionSteps(withRegisterCheck(steps, user));
      sessionStartRef.current = Date.now();
      setShowGuidedSession(true);
      return;
    }

    if (!explicit) {
      const keys = Object.keys(apiParts);
      const globalReviews: any[] = [];
      const seenDe = new Set<string>();

      // Which pack to take fresh content from is scored, not just ordered:
      // how common its language is (the biggest factor, so everyday German
      // comes first whoever you are), how well its difficulty fits you, and
      // whether you have already started it.
      //
      // It is a RANKING over every pack with unseen content, never a filter.
      // Once the harder packs have no fresh material left they drop out as
      // candidates and the easier ones are what remain — so being good at
      // German changes the order you meet it in and nothing else. Ties keep
      // curriculum order so nothing shuffles at random.
      const ability = computeAbility(reviewState as any);
      const grades = loadGradeStore(user);
      const knownInPart = (pId: string, part: Part) => {
        const phrases = part.phrases ?? [];
        let known = 0;
        phrases.forEach((_p, index) => {
          if (statusForId(grades, `${pId}-phrase-${index}`) === "known") known += 1;
        });
        return { known, total: phrases.length };
      };
      const orderedKeys = keys
        .map((pId, index) => {
          const part = apiParts[pId];
          const progress = part ? knownInPart(pId, part) : { known: 0, total: 0 };
          return {
            pId,
            index,
            score: lessonPriority({
              ability: ability.band,
              commonality: packCommonality(part, corpusIndex),
              known: progress.known,
              level: part?.level,
              total: progress.total,
            }),
          };
        })
        .sort((a, b) => (a.score !== b.score ? a.score - b.score : a.index - b.index))
        .map((entry) => entry.pId);

      let freshId: string | undefined;
      let freshSteps: any[] = [];

      // Reviews are gathered from every pack regardless of order, so a due item
      // is never delayed by the difficulty preference.
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
      }

      for (const pId of orderedKeys) {
        const p = apiParts[pId];
        if (!p) continue;
        const s = buildSession({ ...p, partKey: pId }, [], reviewState, 0);
        const fresh = s.filter(
          (st: any) => (st.type === "sentence" && !st.review) || st.type === "dialogue"
        );
        if (fresh.length) { freshId = pId; freshSteps = fresh; break; }
      }

      // 3 new (from the first pack with fresh content) + 3 old due reviews
      // (mostly recent, one older — see pickReviews). New first, then old.
      const reviews = pickReviews(globalReviews, OLD_PER_LESSON);
      const reviewDe = new Set(reviews.map((r: any) => r.item.de));
      const fresh = freshSteps.filter(
        (st: any) => st.type !== "sentence" || !reviewDe.has(st.item.de)
      );

      if (reviews.length > 0 || fresh.length > 0) {
        const id = freshId ?? keys[0];
        let steps = [...fresh, ...reviews, { type: "complete" }];
        if (learningEnglish()) steps = steps.map(swapStepForEnglish);
        setActivePart(id);
        saveScopedJson("active-part", id, user);
        setSessionSteps(withRegisterCheck(steps, user));
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
        setSessionSteps(withRegisterCheck(reviewSteps, user));
      }
    } else {
      setActivePart(id);
      saveScopedJson("active-part", id, user);
      setSessionSteps(withRegisterCheck(steps, user));
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
        // Roll straight into the next lesson — no "Continue learning" press.
        // Deferred so markCompleted's state lands first, otherwise the next
        // session would be built from stale review data and repeat itself.
        setTimeout(() => startSession(), 260);
      }}
      onGradeItem={(itemId: string, grade: "know" | "struggle") => markGrade(itemId, grade)}
      onMemoryGrade={(itemId: string, grade: "know" | "struggle") => markMemoryGrade(itemId, grade)}
      onPreviewKnown={replaceKnownPreviewItem}
      // A skipped item is NOT a recall — marking it would climb the memory
      // ladder and schedule it out for months, and inflate the fluency count.
      onAdvance={(step: any, skipped?: boolean) => { if (!skipped) markCompleted([step]); }}
      onRegisterAnswer={(id: string, correct: boolean) => {
        const state = (loadScopedJson<RegisterState>(REGISTER_KEY, {}, user) as RegisterState) ?? {};
        saveScopedJson(REGISTER_KEY, recordRegisterAnswer(state, id, correct), user);
      }}
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
      title: ui("Dashboard"),
      subtitle: ui("Today, schedule, next lesson, and daily target."),
      group: ui("Page"),
      actionLabel: ui("Open"),
      onSelect: () => openTab("dashboard"),
    },
    {
      id: "page-lessons",
      title: ui("Lessons"),
      subtitle: ui(uiIsGerman() ? "Browse all English modules and word-bank sets." : "Browse all German modules and word-bank sets."),
      group: ui("Page"),
      actionLabel: ui("Open"),
      onSelect: () => openTab("learn"),
    },
    {
      id: "page-practice",
      title: ui("Practice library"),
      subtitle: ui("Games for spelling, recall, verbs, and quick recognition."),
      group: ui("Page"),
      actionLabel: ui("Open"),
      onSelect: () => openTab("games"),
    },
    {
      id: "page-tests",
      title: ui("Tests"),
      subtitle: ui("Build vocabulary, phrase, mixed, or weak-spot tests at your level."),
      group: ui("Page"),
      actionLabel: ui("Open"),
      onSelect: () => openTab("tests"),
    },
    {
      id: "page-profile",
      title: ui("Profile and progress"),
      subtitle: ui("Settings, account details, milestones, XP, and learning totals."),
      group: ui("Page"),
      actionLabel: ui("Open"),
      onSelect: () => openTab("profile"),
    },
    ...pathParts.map(([id, part]) => ({
      id: `lesson-${id}`,
      title: part.theme,
      subtitle: `${part.level} · ${part.description}`,
      group: ui(id.startsWith("wordbank") ? "Word bank" : "Lesson"),
      actionLabel: ui("Start"),
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
      group: ui("Games"),
      actionLabel: ui("Open"),
      onSelect: () => openTab("games"),
    })),
  ];

  const topNavNotifications: TopNavNotification[] = [
    {
      id: "next-lesson",
      title: `${currentPart?.theme ?? ui("Next lesson")} ${ui("is ready")}`,
      body: currentPart?.focus ?? ui(uiIsGerman() ? "Continue your current English lesson." : "Continue your current German lesson."),
      actionLabel: ui("Start lesson"),
      unread: !dailyLessonDone,
      onSelect: () => startSession(),
    },
    {
      id: "daily-target",
      title: ui(dailyLessonDone ? "Daily lesson logged" : "Daily target waiting"),
      body: ui(dailyLessonDone ? "You have a session recorded. Add a few words if you want extra progress." : "Finish 1 lesson and track 5 words to move today forward."),
      actionLabel: ui(dailyLessonDone ? "View profile" : "Continue"),
      unread: !dailyLessonDone,
      onSelect: () => (dailyLessonDone ? openTab("profile") : startSession()),
    },
    {
      id: "word-bank",
      title: `${totalWords.toLocaleString()} ${ui("words available")}`,
      body: `${wordBankParts.length.toLocaleString()} ${ui("word-bank sets are ready when you want more vocabulary.")}`,
      actionLabel: ui("Browse lessons"),
      unread: wordsTracked < 5,
      onSelect: () => openTab("learn"),
    },
    {
      id: "streak",
      title: `${progressStats.streak} ${ui("day streak")}`,
      body: ui(progressStats.streak > 1 ? "Keep the rhythm going with one short session." : "Start building a habit with one focused lesson."),
      actionLabel: ui("View profile"),
      unread: false,
      onSelect: () => openTab("profile"),
    },
  ];

  const view = activeTab === "learn" ? (
    courseHasReader && activeCourse ? (
      <CourseLessonsView course={activeCourse} onOpenLesson={(id) => startCourseLesson(id)} onOpenReader={() => openReader()} />
    ) : (
      <LearnView apiParts={apiParts} onOpenLesson={startSession} />
    )
  ) : activeTab === "profile" ? (
    <GamificationPanel profileOnly stats={progressStats} user={user} onUpdateStats={updateStats} apiParts={apiParts} onSwitchCourse={() => setCourseSwitcherOpen(true)} activeCourseName={activeCourse?.name ?? "German"} />
  ) : activeTab === "grammar" ? (
    <div className="guided-session space-y-4">
      <ClozeTabContent />
      <GrammarTabContent />
    </div>
  ) : activeTab === "games" ? (
    <GamesView 
      apiParts={apiParts}
      totalReviews={progressStats.totalReviews}
      externalWords={progressStats.externalWords}
      gameMasteryCount={gameMasteryCount}
    />
  ) : activeTab === "tests" ? (
    <TestsView apiParts={apiParts} onLearnItems={startFocusSession} profile={user} />
  ) : (
    courseHasReader && activeCourse ? (
      <CourseDashboardView
        course={activeCourse}
        onOpenLesson={(id) => startCourseLesson(id)}
        onOpenReader={() => openReader()}
        onBrowseLessons={() => openTab("learn")}
      />
    ) : themePreferences.preset !== "default" ? (
      <AstryxDashboardView
        currentPart={currentPart}
        onOpenLesson={startSession}
        pathParts={pathParts}
        progressStats={progressStats}
        gameMasteryCount={gameMasteryCount}
        setActiveTab={openTab}
        activePart={activePart}
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

  if (themePreferences.preset !== "default") {
    return (
      <>
        <AstryxAppShell
          activeTab={activeTab}
          avatarUrl={user.avatar}
          brandName={activeCourse?.name ?? "Micheon"}
          notifications={topNavNotifications}
          onSignOut={() => {
            signOut();
            window.location.reload();
          }}
          onSwitchCourse={() => setCourseSwitcherOpen(true)}
          searchItems={topNavSearchItems}
          setActiveTab={openTab}
          streak={progressStats.streak}
          theme={themePreferences.theme}
          userEmail={user.email}
          userName={user.name}
          xp={progressStats.totalXp}
        >
          <motion.div
            key={activeTab}
            animate={{ opacity: 1, y: 0 }}
            initial={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
          >
            {view}
          </motion.div>
        </AstryxAppShell>

        <CourseSwitcher
          open={courseSwitcherOpen}
          activeCourseId={activeCourseId}
          onSelect={handleSelectCourse}
          onClose={() => setCourseSwitcherOpen(false)}
        />

        {courseReaderOpen && activeCourse && courseHasReader && (
          <CourseShell
            course={activeCourse}
            initialLessonId={courseReaderLesson}
            onExit={() => setCourseReaderOpen(false)}
          />
        )}

        {sessionLesson && activeCourse && (
          <CourseSession
            course={activeCourse}
            lesson={sessionLesson}
            onComplete={() => completeCourseLesson(sessionLesson.id)}
            onExit={() => setCourseSessionLesson(undefined)}
          />
        )}
      </>
    );
  }

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
        brandName={activeCourse?.name ?? "Micheon"}
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
        {/* No mode="wait" here on purpose. With it, the incoming tab could not
            mount until the outgoing one finished its exit animation — and if
            that animation never completed (reduced motion, a backgrounded
            window, an interrupted transition) the tab silently never changed.
            That is what made "Profile settings" appear to do nothing. Fading
            the new view in over the old one is a cosmetic downgrade of ~0.2s
            and makes navigation unconditional. */}
        <motion.div
          key={activeTab}
          animate={{ opacity: 1, y: 0 }}
          initial={{ opacity: 0, y: 8 }}
          transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
        >
          {view}
        </motion.div>
      </main>
    </div>
  );
}
