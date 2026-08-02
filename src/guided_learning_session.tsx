import React, { useEffect, useState } from "react";

import { PlacementTest } from "@/components/PlacementTest";
import GuidedSession from "@/GuidedSession";
import { buildApiPartFromResolved } from "@/lib/api";
import { orderParts } from "@/lib/curriculum";
import { buildBundledParts, buildTatoebaParts, filterPartsForLearningDirection } from "@/lib/contentBank";
import { buildCustomParts, isCustomPartKey, CUSTOM_CONTENT_EVENT } from "@/lib/customContent";
import { allPartBlueprints } from "@/lib/data";
import { getAuthUser, getScopedKey, loadScopedJson, saveScopedJson } from "@/lib/profileStorage";
import { Blueprint, Part } from "@/lib/types";
import { buildCatalog, buildSession, isReinforcementEligible, pickPreviewReplacement, rankReinforcementCandidates, selectContinueLearningMix, OLD_PER_LESSON } from "@/session";
import { isDueForReview, recordReinforcement, recordSuccess, recordStruggle, recordDeclaredKnown, type GradeRecord } from "@/lib/memoryStrength";
import { DIRECTION_CHANGE_EVENT, learningEnglish } from "@/lib/direction";
import {
  detectRegister, pickRegisterQuestion, recordRegisterAnswer,
  type Register, type RegisterState,
} from "@/lib/registerCheck";
import { computeAbility, itemDifficulty, itemPriority } from "@/lib/ability";
import { buildCorpusIndex, sentenceCommonality } from "@/lib/corpusFrequency";
import { conversationPriorityScore } from "@/lib/conversationPriority";

/** Fresh sentences per lesson — matches NEW_PER_LESSON inside buildSession. */
const NEW_PER_LESSON_TARGET = 3;
import { COMPLETED_KEY, loadGradeStore, progressEntryForId, saveGradeStore, setCanonicalGradeRecord, statusForId } from "@/lib/activity";
import { getStreak, recordStreakDay } from "@/lib/streak";
import { useCodexPets } from "@/components/codexPets/CodexPetProvider";
import { useCodexPetCoaching } from "@/components/codexPets/useCodexPetCoaching";
import { ui } from "@/lib/i18n";
import { getCodexPetCadence } from "@/lib/codexPetCoaching";
import { getPrioritizedPetRecallItem } from "@/lib/petRecall";
import { finishLessonAndQueueNext } from "@/lib/lessonFlow";
import { swapStepForEnglish } from "@/lib/learningDirectionStep";
import { useLearningMode } from "@/lib/learningMode";
import { countKnownVocab } from "@/lib/fluency";
import { ActiveStudyTimer, recordCompletedLearningSession } from "@/lib/learningTime";
import {
  adaptiveRepeatPriority,
  isAdaptiveReinforcementEligible,
  isAttemptedPracticeEligible,
  recordAnswerPerformance,
  type AnswerPerformance,
} from "@/lib/adaptivePractice";

type ProgressStats = {
  totalXp: number; sessionsCompleted: number;
  totalReviews: number; streak: number; externalWords: number;
};

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

export default function GuidedLearningSession() {
  const user = getAuthUser()!;
  const guidedRequest = new URLSearchParams(window.location.search).get("guided");
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
  const [showPlacementTest, setShowPlacementTest] = useState<boolean>(
    () => loadScopedJson("german-lab-placement-done", false, user) === false
  );
  const [showGuidedSession, setShowGuidedSession] = useState(false);
  const [sessionSteps, setSessionSteps] = useState<any[]>([]);
  const sessionStartRef = React.useRef<number | null>(null);
  const guidedAutoStartedRef = React.useRef(false);
  const startSessionRef = React.useRef<(partId?: string) => void>(() => {});
  const activeStudyTimerRef = React.useRef<ActiveStudyTimer | null>(null);
  const sessionKnownBeforeRef = React.useRef<number | null>(null);
  const sessionLessonIdRef = React.useRef<string | undefined>(undefined);
  const [apiParts, setApiParts] = useState<Record<string, Part>>({});
  const learningMode = useLearningMode();
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
  const catalog = React.useMemo(() => buildCatalog(apiParts), [apiParts, learningMode]);
  const [gradeRevision, setGradeRevision] = useState(0);
  const petSpeechRef = React.useRef(petSpeech);
  const petHistoryRef = React.useRef(petHistory);
  const petQuizIndex = React.useRef(0);
  const petQuizItemsRef = React.useRef<ReturnType<typeof buildCatalog>>([]);
  petSpeechRef.current = petSpeech;
  petHistoryRef.current = petHistory;

  useEffect(() => () => {
    activeStudyTimerRef.current?.dispose();
    activeStudyTimerRef.current = null;
  }, []);

  const petQuizItems = React.useMemo(
    () => {
      const grades = loadGradeStore(user);
      const eligible = catalog.filter((item) => {
        const de = item.de?.trim() ?? "";
        const en = item.en?.trim() ?? "";
        return de.length >= 2 && en.length >= 2 && de.length <= 64 && en.length <= 64;
      });
      const recordFor = (item: (typeof eligible)[number]) => {
        // A loop rather than map().find(): this runs per item in a list of
        // thousands, and map allocates an array every time it is called.
        for (const id of [item.id, ...(item.aliases ?? [])]) {
          const record = grades[id];
          if (record) return record;
        }
        return undefined;
      };

      // The mascot is a memory coach, not a source of surprise curriculum:
      // revisit only material the learner has already encountered.
      //
      // Priority and date are worked out ONCE PER ITEM. The comparator used to
      // call recordFor up to four times per comparison, and this whole list is
      // rebuilt after every graded item in a lesson.
      const keyed = eligible
        .filter((item) => statusForId(grades, item.id, item.aliases) !== "new")
        .map((item) => {
          const record = recordFor(item);
          return {
            item,
            priority: record?.lastGrade === "struggle" ? 0 : isDueForReview(record) ? 1 : 2,
            conversationPriority: conversationPriorityScore({
              partKey: item.partKey,
              kind: item.kind,
              commonality: sentenceCommonality(item.de, corpusIndex),
              lessonPriority: item.lessonPriority,
            }),
            updatedAt: Date.parse(record?.updatedAt ?? "") || 0,
          };
        });
      keyed.sort((a, b) =>
        a.priority - b.priority
        || a.conversationPriority - b.conversationPriority
        || a.updatedAt - b.updatedAt
      );
      return keyed.slice(0, 1200).map((entry) => entry.item);
    },
    [catalog, corpusIndex, gradeRevision, user]
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
    if (!petEnabled || showPlacementTest || !petQuizAvailable || !cadence) {
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
      // A recent miss deliberately overrides the ordinary 30-minute duplicate
      // guard. It is asked on roughly three out of four opportunities and is
      // guaranteed after at most two different questions. Once remembered, it
      // returns in lighter reinforcement checks before leaving the focus queue.
      let item = getPrioritizedPetRecallItem(quizItems, recentlyAsked, user);
      if (!item) {
        for (let offset = 0; offset < quizItems.length; offset += 1) {
          const index = (petQuizIndex.current + offset) % quizItems.length;
          const candidate = quizItems[index];
          if (!recentlyAsked.has(candidate.id)) {
            item = candidate;
            petQuizIndex.current = index + 1;
            break;
          }
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
        voiceLang: learnsEnglish ? "de-DE" : "en-US",
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
    showPlacementTest,
    user,
  ]);

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
    // labelled ("Extra real-world practice").
    // The learner's own words go in last so they are packs like any other:
    // lessons, tracker, search and tests all read this one map, so nothing
    // downstream needs to know where a phrase came from.
    const rebuild = () =>
      setApiParts(orderParts(filterPartsForLearningDirection({
        ...resolved,
        ...buildBundledParts(),
        ...buildTatoebaParts(),
        ...buildCustomParts(),
      })));
    rebuild();
    window.addEventListener(CUSTOM_CONTENT_EVENT, rebuild);
    window.addEventListener(DIRECTION_CHANGE_EVENT, rebuild);
    return () => {
      window.removeEventListener(CUSTOM_CONTENT_EVENT, rebuild);
      window.removeEventListener(DIRECTION_CHANGE_EVENT, rebuild);
    };
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

  const updateStats = (next: Partial<ProgressStats>) => {
    const merged = { ...progressStats, ...next };
    setProgressStats(merged);
    Object.entries(merged).forEach(([k, v]) => saveScopedJson(k, v, user));
  };

  const COMPLETED_KEY = "session-completed";

  const loadCompleted = (): Record<string, GradeRecord> => {
    try {
      const raw = loadScopedJson<any>(COMPLETED_KEY, {}, user) ?? {};
      if (Array.isArray(raw)) return Object.fromEntries(raw.map((id: string) => [id, { lastGrade: "know" }]));
      return raw && typeof raw === "object" ? raw : {};
    } catch { return {}; }
  };

  const saveReviewGrades = (grades: Record<string, GradeRecord>) => {
    // Besides persistence, this emits grades-updated so the proactive pet's
    // review pool sees newly encountered items without waiting for a reload.
    saveGradeStore(grades, user);
  };

  // Explicit skip button ("Know it") — a declaration of prior knowledge, not
  // a drill result, so it jumps most of the way up the ladder rather than
  // climbing one rung like an earned recall does. See recordDeclaredKnown.
  const markGrade = (itemId: string, grade: "know" | "struggle") => {
    try {
      const existing = loadCompleted();
      const prior = progressEntryForId(existing, itemId)?.record;
      saveReviewGrades({
        ...existing,
        [itemId]: grade === "know"
          ? recordDeclaredKnown(prior)
          : recordStruggle(Date.now(), prior),
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
      // Session steps may already be direction-swapped. Convert them back to
      // named language pairs and block both columns: Quick Match can be flipped
      // after the replacement is made.
      const learnsEnglish = learningEnglish();
      const blockedPairs = current
        .filter((step, index) => index !== replaceAt && step?.type === "sentence")
        .map((step) => ({
          de: String((learnsEnglish ? step.item?.en : step.item?.de) ?? ""),
          en: String((learnsEnglish ? step.item?.de : step.item?.en) ?? ""),
        }));
      const grades = loadGradeStore(user);
      const candidates = catalog.filter((item) => {
        if (usedIds.has(item.id) || statusForId(grades, item.id, item.aliases) !== "new") return false;
        const record = progressEntryForId(grades, item.id, item.aliases)?.record;
        return !isAttemptedPracticeEligible(record);
      });
      const replacement = pickPreviewReplacement(
        candidates,
        blockedPairs,
        activePart
      );

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
          coachingLanguage: replacement.coachingLanguage,
        },
      };
      if (learningEnglish()) replacementStep = swapStepForEnglish(replacementStep);

      const next = [...current];
      next[replaceAt] = replacementStep;
      return next;
    });
  };

  const markCompleted = (stepsToMark: any[], performance?: AnswerPerformance) => {
    try {
      const existing = loadCompleted();
      const next = { ...existing };
      const sessionStart = sessionStartRef.current ?? Date.now();
      // One climb per item per session: rechecks and dialogue lines repeat the
      // same id in the step list, and completion is a single recall event.
      const counted = new Set<string>();
      const markReinforced = (id: string, aliases: string[] = []) => {
        if (!id || counted.has(id)) return;
        counted.add(id);
        const prior = progressEntryForId(next, id, aliases)?.record;
        if (!prior?.lastGrade) return;
        const reinforcedAt = prior.reinforcedAt ? Date.parse(prior.reinforcedAt) : 0;
        if (Number.isFinite(reinforcedAt) && reinforcedAt >= sessionStart) {
          if (performance?.attempts) {
            setCanonicalGradeRecord(next, id, aliases, recordAnswerPerformance(prior, performance));
          }
          return;
        }
        const practised = recordAnswerPerformance(prior, performance);
        setCanonicalGradeRecord(next, id, aliases, recordReinforcement(practised));
      };
      const markKnown = (id: string, aliases: string[] = []) => {
        if (!id || counted.has(id)) return;
        counted.add(id);
        const prior = progressEntryForId(next, id, aliases)?.record;
        // Items are saved as each step is left. "Know it" also writes
        // immediately, so keep both paths from advancing the same memory
        // record more than once in one session.
        const updatedAt = prior?.updatedAt ? Date.parse(prior.updatedAt) : 0;
        if (Number.isFinite(updatedAt) && updatedAt >= sessionStart) {
          // "Know it" writes its mastery grade immediately. Still attach any
          // real stage mistakes gathered before that click; only suppress the
          // second SRS promotion.
          if (performance?.attempts) {
            setCanonicalGradeRecord(
              next,
              id,
              aliases,
              recordAnswerPerformance(prior, performance)
            );
          }
          return;
        }
        // One rung up the memory ladder; the item comes back for review when due.
        const practised = recordAnswerPerformance(prior, performance);
        setCanonicalGradeRecord(next, id, aliases, recordSuccess(practised));
      };
      stepsToMark.forEach((s) => {
        if (s.type === "sentence" && s.item?.id) {
          if (s.reinforcement) markReinforced(s.item.id, s.item.aliases);
          else markKnown(s.item.id, s.item.aliases);
        } else if (s.type === "dialogue" && Array.isArray(s.dialogue?.lines)) {
          // Completing a conversation means every line was practised — persist
          // each line, otherwise the same dialogue rebuilds every session and
          // the learner loops on it instead of advancing to new content.
          s.dialogue.lines.forEach((line: any) => { if (line?.id) markKnown(line.id, line.aliases); });
        }
      });
      saveReviewGrades(next);
    } catch {}
  };

  /** Persist mistakes from a sentence the learner left via Skip, without
   * promoting it up the mastery ladder. This is still one write per sentence. */
  const markAttempted = (step: any, performance?: AnswerPerformance) => {
    if (step?.type !== "sentence" || !step.item?.id || !performance?.attempts) return;
    try {
      const next = loadCompleted();
      const aliases = step.item.aliases ?? [];
      const prior = progressEntryForId(next, step.item.id, aliases)?.record;
      setCanonicalGradeRecord(
        next,
        step.item.id,
        aliases,
        recordAnswerPerformance(prior, performance)
      );
      saveReviewGrades(next);
    } catch {}
  };

  const beginLessonTiming = (lessonId?: string) => {
    activeStudyTimerRef.current?.dispose();
    activeStudyTimerRef.current = new ActiveStudyTimer().start();
    sessionKnownBeforeRef.current = countKnownVocab(user, progressStats.externalWords);
    sessionLessonIdRef.current = lessonId;
    // Keep the epoch timestamp as well: markCompleted uses it to prevent one
    // exercise from advancing the same memory record twice in a lesson.
    sessionStartRef.current = Date.now();
  };

  const startSession = (partId?: string) => {
    // Explicit pack picks are respected. Continue Learning passes no id and
    // gets the curriculum treatment: due reviews from ANY pack first (most
    // overdue anywhere — even a pack far down the order — so nothing learned
    // is left to rot), then the first pack in curriculum order that still
    // has fresh content. The most common German is always served first.
    const reviewState = loadCompleted();
    const explicit = partId && apiParts[partId] ? partId : null;
    // `buildSession` scans, filters, shuffles and sorts a whole pack. Continue
    // Learning consults the same packs several times while selecting struggles,
    // due reviews, fresh sentences and dialogues, so keep one result per pack
    // for this invocation only. A new call gets a new cache and fresh progress.
    const packSessions = new Map<string, any[]>();
    const sessionForPack = (packId: string) => {
      if (packSessions.has(packId)) return packSessions.get(packId)!;
      const pack = apiParts[packId];
      if (!pack) return [];
      const packSteps = buildSession(
        { ...pack, partKey: packId },
        [],
        reviewState,
        0
      );
      packSessions.set(packId, packSteps);
      return packSteps;
    };

    if (!explicit) {
      const keys = Object.keys(apiParts);
      const requiredReviews: any[] = [];
      const globalReviews: any[] = [];
      const reinforcementReviews: any[] = [];
      const reviewPartByStep = new Map<any, string>();

      // Every unseen SENTENCE is scored, not the pack it lives in. A pack is a
      // mixed bag — the restaurant pack holds both "Noch einen Kaffee?" and
      // "Könnten wir auch Leitungswasser bekommen?" — so ranking packs meant a
      // strong learner got a hard pack and still met its easy sentences, while
      // a hard sentence inside an easy pack was never brought forward.
      //
      // Still a RANKING over everything unseen, never a filter: items leave the
      // pool only by being learned, so the easy material is still waiting
      // however good you get. Ties keep curriculum order.
      const ability = computeAbility(reviewState as any);
      // Reviews are gathered from every pack regardless of order, so a due item
      // is never delayed by the difficulty preference. A phrase marked
      // "struggle" is a priority review, not a new phrase; it may use a legacy
      // alias in saved progress, so classify through statusForId.
      for (const pId of keys) {
        const p = apiParts[pId];
        if (!p) continue;
        const s = sessionForPack(pId);
        for (const st of s) {
          if (st.type !== "sentence" || !st.item?.id) continue;
          const status = statusForId(reviewState, st.item.id, st.item.aliases);
          if (status === "struggle") {
            const priorityReview = { ...st, review: true, reviewReason: "struggle", interval: 0 };
            requiredReviews.push(priorityReview);
            reviewPartByStep.set(priorityReview, pId);
          } else if (st.review && !st.reinforcement && st.reviewReason !== "attempted") {
            globalReviews.push(st);
            reviewPartByStep.set(st, pId);
          }
        }
      }

      // A normal successful first encounter is scheduled for tomorrow, but
      // Continue Learning should still contain a familiar half today. Pull
      // only the first two (weak) ladder rungs into optional reinforcement;
      // declared-known and permanent items stay away until their real review.
      // `reinforcedAt` rotates this pool without changing its due date.
      const reinforcementCandidates: {
        pId: string;
        index: number;
        successes: number;
        lastPractised: number;
        practiceUrgency?: number;
        repeatPriority?: number;
        step: any;
      }[] = [];
      catalog.forEach((item, index) => {
        const record = progressEntryForId(reviewState, item.id, item.aliases)?.record;
        const ordinaryReinforcement = isReinforcementEligible(record);
        const adaptiveReinforcement = isAdaptiveReinforcementEligible(record, item);
        const attemptedPractice = isAttemptedPracticeEligible(record);
        if (!ordinaryReinforcement && !adaptiveReinforcement && !attemptedPractice) return;
        const pId = item.partKey;
        if (!apiParts[pId]) return;
        const lastPractisedRaw = record?.reinforcedAt ?? record?.lastAnswerAt ?? record?.updatedAt;
        const parsedLastPractised = lastPractisedRaw ? Date.parse(lastPractisedRaw) : 0;
        const repeatPriority = adaptiveReinforcement || attemptedPractice
          ? adaptiveRepeatPriority(record, item)
          : 0;
        const practiceUrgency = attemptedPractice ? 2 : adaptiveReinforcement ? 1 : 0;
        reinforcementCandidates.push({
          pId,
          index,
          successes: Number(record?.successes) || 0,
          lastPractised: Number.isFinite(parsedLastPractised) ? parsedLastPractised : 0,
          practiceUrgency,
          repeatPriority,
          step: {
            type: "sentence",
            review: true,
            reviewReason: attemptedPractice ? "attempted" : adaptiveReinforcement ? "adaptive" : "reinforcement",
            optionalPractice: true,
            reinforcement: !attemptedPractice,
            repeatPriority,
            interval: Number(record?.intervalDays) || 1,
            item: {
              id: item.id,
              aliases: item.aliases,
              de: item.de,
              en: item.en,
              fr: item.fr,
              use: item.use,
              lookup: item.lookup,
              tierNote: item.tierNote,
              short: item.short,
              when: item.when,
              say: item.say,
              long: item.long,
              group: item.group,
              level: item.level,
              mastery: "learning",
            },
          },
        });
      });
      rankReinforcementCandidates(reinforcementCandidates).forEach(({ pId, step }) => {
        reinforcementReviews.push(step);
        reviewPartByStep.set(step, pId);
      });

      // Score every unseen sentence in the course, then take the best few.
      const candidates: { pId: string; index: number; score: number; step: any }[] = [];
      catalog.forEach((item, index) => {
        if (statusForId(reviewState, item.id, item.aliases) !== "new") return;
        const progressRecord = progressEntryForId(reviewState, item.id, item.aliases)?.record;
        if (isAttemptedPracticeEligible(progressRecord)) return;
        const pId = item.partKey;
        const p = apiParts[pId];
        if (!p) return;
        const text = String(item.de ?? "");
        const commonality = sentenceCommonality(text, corpusIndex);
        candidates.push({
          pId,
          index,
          score: conversationPriorityScore({
            partKey: pId,
            kind: item.kind,
            commonality,
            lessonPriority: item.lessonPriority,
          }) + itemPriority({
            ability: ability.band,
            commonality,
            difficulty: itemDifficulty(p.level, text.trim().split(/\s+/).filter(Boolean).length),
            own: isCustomPartKey(pId),
          }) * 100,
          step: {
            type: "sentence",
            item: {
              id: item.id,
              aliases: item.aliases,
              de: item.de,
              en: item.en,
              fr: item.fr,
              use: item.use,
              lookup: item.lookup,
              tierNote: item.tierNote,
              short: item.short,
              when: item.when,
              say: item.say,
              long: item.long,
              group: item.group,
              level: item.level,
              mastery: "new",
            },
          },
        });
      });
      candidates.sort((a, b) => (a.score !== b.score ? a.score - b.score : a.index - b.index));

      // The lead sentence is the best-scoring one anywhere. The rest of the
      // fresh half prefers its pack-mates so the lesson still feels coherent,
      // then scans the remaining ranked pool to backfill duplicate/colliding
      // wording instead of silently returning fewer than 3 new phrases.
      const lead = candidates[0];
      const rankedCandidates = lead
        ? [
            ...candidates.filter((candidate) => candidate.pId === lead.pId),
            ...candidates.filter((candidate) => candidate.pId !== lead.pId),
          ]
        : [];
      const { fresh, reviews } = selectContinueLearningMix(
        rankedCandidates.map((candidate) => candidate.step),
        requiredReviews,
        globalReviews,
        NEW_PER_LESSON_TARGET,
        OLD_PER_LESSON,
        reinforcementReviews,
        learningEnglish() ? "en" : "de"
      );
      const firstFresh = fresh[0];
      const freshId = rankedCandidates.find((candidate) => candidate.step === firstFresh)?.pId;
      const servedFreshDe = new Set(
        fresh.map((step: any) => String(step.item?.de ?? "").trim().toLocaleLowerCase("de-DE"))
      );
      const dialogues = freshId
        ? sessionForPack(freshId).filter(
            (step: any) => step.type === "dialogue"
              && (step.dialogue?.lines ?? []).some(
                (line: any) => servedFreshDe.has(String(line?.de ?? "").trim().toLocaleLowerCase("de-DE"))
              )
          )
        : [];
      const freshSteps = [...fresh, ...dialogues];

      if (reviews.length > 0 || freshSteps.length > 0) {
        const id = freshId ?? reviewPartByStep.get(reviews[0]) ?? keys[0];
        let steps = [...freshSteps, ...reviews, { type: "complete" }];
        if (learningEnglish()) steps = steps.map(swapStepForEnglish);
        setActivePart(id);
        saveScopedJson("active-part", id, user);
        setSessionSteps(withRegisterCheck(steps, user));
        beginLessonTiming(id);
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
    let steps = sessionForPack(id);
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
        const pSteps = sessionForPack(pId);
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
    beginLessonTiming(id);
    setShowGuidedSession(true);
  };

  startSessionRef.current = startSession;
  useEffect(() => {
    const requestedPart = guidedRequest && guidedRequest !== "continue" ? guidedRequest : undefined;
    if (
      !guidedRequest
      || guidedAutoStartedRef.current
      || showPlacementTest
      || Object.keys(apiParts).length === 0
      || (requestedPart && !apiParts[requestedPart])
    ) return;

    guidedAutoStartedRef.current = true;
    startSessionRef.current(requestedPart);
  }, [apiParts, guidedRequest, showPlacementTest]);

  const logActivity = (stepsForCount: any[], completed = false) => {
    const startedAt = sessionStartRef.current;
    sessionStartRef.current = null;
    const timer = activeStudyTimerRef.current;
    activeStudyTimerRef.current = null;
    const activeMs = timer?.stop() ?? (startedAt ? Date.now() - startedAt : 0);
    const progressBefore = sessionKnownBeforeRef.current;
    const lessonId = sessionLessonIdRef.current;
    sessionKnownBeforeRef.current = null;
    sessionLessonIdRef.current = undefined;
    if (!startedAt) return;
    if (!completed || progressBefore === null || activeMs < 1_000) return;

    recordCompletedLearningSession({
      activeMs,
      progressBefore,
      progressAfter: countKnownVocab(user, progressStats.externalWords),
      lessonId,
      sentences: stepsForCount.filter((s) => s.type === "sentence").length,
      dialogues: stepsForCount.filter((s) => s.type === "dialogue").length,
    }, user);
  };

  const returnToHome = () => {
    const url = new URL(window.location.href);
    url.searchParams.delete("guided");
    url.searchParams.delete("tab");
    window.location.assign(url.toString());
  };

  if (showPlacementTest) return (
    <div className="fixed inset-0 z-[600] flex items-center justify-center bg-zinc-50 p-6">
      <PlacementTest onComplete={(key) => {
        setActivePart(key);
        setShowPlacementTest(false);
        saveScopedJson("german-lab-placement-done", true, user);
      }} />
    </div>
  );

  if (
    guidedRequest
    && !showGuidedSession
    && (
      Object.keys(apiParts).length === 0
      || guidedRequest === "continue"
      || Boolean(apiParts[guidedRequest])
    )
  ) return (
    <div
      aria-live="polite"
      className="guided-session fs-app prototype-guided-session prototype-guided-loading-screen"
      role="status"
    >
      <div className="prototype-guided-loading-card">
        <img src="/icon-64.png" alt="" />
        <div className="prototype-guided-loading-copy">
          <strong>{ui("Preparing your lesson")}</strong>
          <span>{ui("Choosing useful phrases for this session.")}</span>
        </div>
        <div className="prototype-guided-loading-track" aria-hidden="true"><i /></div>
      </div>
    </div>
  );

  if (showGuidedSession) return (
    <GuidedSession
      onCancel={(completedUpTo?: number) => {
        // Each non-skipped step is persisted as it is left. Replaying the
        // whole prefix here would accidentally grade any skipped steps.
        logActivity(sessionSteps.slice(0, completedUpTo && completedUpTo > 0 ? completedUpTo : 0));
        setShowGuidedSession(false);
        returnToHome();
      }}
      onComplete={() => {
        setShowGuidedSession(false);
        finishLessonAndQueueNext(
          () => {
            // onAdvance already persisted every completed, non-skipped exercise.
            // A bulk replay here would turn skipped items into successful recalls.
            logActivity(sessionSteps, true);
            const xp = sessionSteps.length * 15;
            updateStats({
              totalXp: progressStats.totalXp + xp,
              sessionsCompleted: progressStats.sessionsCompleted + 1,
              totalReviews: progressStats.totalReviews + Math.floor(sessionSteps.length / 2),
              streak: recordStreakDay(user),
            });
          },
          // Always use the global Continue Learning selector (no part id), so
          // the next lesson keeps the same review/new mix. The short unmount
          // gap resets GuidedSession's internal stage state cleanly.
          () => window.setTimeout(() => startSession(), 260)
        );
      }}
      onGradeItem={(itemId: string, grade: "know" | "struggle") => markGrade(itemId, grade)}
      onPreviewKnown={replaceKnownPreviewItem}
      // A skipped item is NOT a recall — marking it would climb the memory
      // ladder and schedule it out for months, and inflate the fluency count.
      onAdvance={(step: any, skipped?: boolean, performance?: AnswerPerformance) => {
        if (skipped) markAttempted(step, performance);
        else markCompleted([step], performance);
      }}
      onRegisterAnswer={(id: string, correct: boolean) => {
        const state = (loadScopedJson<RegisterState>(REGISTER_KEY, {}, user) as RegisterState) ?? {};
        saveScopedJson(REGISTER_KEY, recordRegisterAnswer(state, id, correct), user);
      }}
      steps={sessionSteps}
    />
  );

  return (
    <div className="guided-session fs-app prototype-guided-session prototype-guided-loading-screen">
      <div className="prototype-guided-loading-card">
        <img src="/icon-64.png" alt="" />
        <div className="prototype-guided-loading-copy">
          <strong>{ui("Lesson unavailable")}</strong>
          <span>{ui("Return home and choose another lesson.")}</span>
        </div>
        <button className="lesson-cta" onClick={returnToHome} type="button">
          {ui("Back to Micheon")}
        </button>
      </div>
    </div>
  );
}
