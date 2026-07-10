import React, { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { CheckCircle2, XCircle, ChevronRight, Lightbulb, BookOpen } from "lucide-react";

// ── Grammar tips data ─────────────────────────────────────────────────────────
export const GRAMMAR_TIPS = [
  {
    id: "articles",
    title: "Articles: der, die, das",
    level: "A1",
    summary: "Every German noun has a gender — masculine (der), feminine (die), or neuter (das). You must memorise the article with the word.",
    rules: [
      "Masculine (der): der Mann, der Hund, der Bahnhof",
      "Feminine (die): die Frau, die Stadt, die Frage",
      "Neuter (das): das Kind, das Haus, das Fenster",
      "Plural always uses 'die': die Männer, die Frauen, die Kinder",
    ],
    tip: "Learn every noun with its article from day one. Say 'der Hund' not just 'Hund'.",
    examples: [
      { de: "Der Mann trinkt Kaffee.", en: "The man drinks coffee." },
      { de: "Die Stadt ist groß.", en: "The city is big." },
      { de: "Das Kind spielt.", en: "The child plays." },
    ],
  },
  {
    id: "verb_position",
    title: "Verb always second",
    level: "A1",
    summary: "In a German main clause, the verb is always the second element — not necessarily the second word.",
    rules: [
      "Subject first: Ich lerne Deutsch.",
      "Time first: Heute lerne ich Deutsch.",
      "Place first: In Berlin lerne ich Deutsch.",
      "The verb stays in position 2 no matter what comes first.",
    ],
    tip: "If you move something to the front, the subject jumps behind the verb.",
    examples: [
      { de: "Ich gehe heute nach Hause.", en: "I am going home today." },
      { de: "Heute gehe ich nach Hause.", en: "Today I am going home." },
    ],
  },
  {
    id: "sein_haben",
    title: "sein vs haben",
    level: "A1",
    summary: "'sein' means 'to be', 'haben' means 'to have'. Both are irregular and used constantly.",
    rules: [
      "ich bin / ich habe",
      "du bist / du hast",
      "er/sie/es ist / er hat",
      "wir sind / wir haben",
      "ihr seid / ihr habt",
      "sie/Sie sind / sie haben",
    ],
    tip: "These two verbs are the backbone of German. Drill them until they're automatic.",
    examples: [
      { de: "Ich bin müde.", en: "I am tired." },
      { de: "Er hat Zeit.", en: "He has time." },
    ],
  },
  {
    id: "negation",
    title: "Negation: nicht & kein",
    level: "A1",
    summary: "Use 'nicht' to negate verbs and adjectives. Use 'kein' to negate nouns (replaces ein/eine).",
    rules: [
      "Verb negation: Ich gehe nicht. (I am not going.)",
      "Adjective: Das ist nicht gut. (That is not good.)",
      "Noun with article: Ich habe kein Geld. (I have no money.)",
      "kein follows the same endings as ein: kein/keine/kein",
    ],
    tip: "If you can put 'ein' before the noun, use 'kein'. Otherwise use 'nicht'.",
    examples: [
      { de: "Ich verstehe das nicht.", en: "I do not understand that." },
      { de: "Ich habe keine Zeit.", en: "I have no time." },
    ],
  },
  {
    id: "modal_verbs",
    title: "Modal verbs",
    level: "A2",
    summary: "Modal verbs (können, müssen, wollen, sollen, dürfen, mögen) modify the main verb, which goes to the end as an infinitive.",
    rules: [
      "können — can/to be able to",
      "müssen — must/to have to",
      "wollen — to want to",
      "dürfen — may/to be allowed to",
      "The infinitive goes to the END of the clause.",
    ],
    tip: "Ich kann Deutsch sprechen. — The modal is second, the infinitive is last.",
    examples: [
      { de: "Ich kann das machen.", en: "I can do that." },
      { de: "Du musst jetzt gehen.", en: "You have to go now." },
      { de: "Wir wollen Deutsch lernen.", en: "We want to learn German." },
    ],
  },
  {
    id: "accusative",
    title: "Accusative case",
    level: "A2",
    summary: "The accusative is used for the direct object. Only masculine articles change: der → den, ein → einen.",
    rules: [
      "Masculine: der → den, ein → einen",
      "Feminine: die stays die, eine stays eine",
      "Neuter: das stays das, ein stays ein",
      "Plural: die stays die",
    ],
    tip: "Only 'der' changes to 'den' in accusative. Everything else stays the same.",
    examples: [
      { de: "Ich sehe den Mann.", en: "I see the man." },
      { de: "Ich kaufe einen Kaffee.", en: "I am buying a coffee." },
      { de: "Ich lese die Zeitung.", en: "I am reading the newspaper." },
    ],
  },
  {
    id: "separable_verbs",
    title: "Separable verbs",
    level: "A2",
    summary: "Many German verbs have a prefix that splits off and goes to the end of the clause.",
    rules: [
      "aufstehen → Ich stehe auf. (I get up.)",
      "anrufen → Ich rufe dich an. (I call you.)",
      "einkaufen → Wir kaufen ein. (We shop.)",
      "The prefix always goes to the very end of the main clause.",
    ],
    tip: "When you learn a separable verb, always note which part splits off.",
    examples: [
      { de: "Ich stehe um 7 Uhr auf.", en: "I get up at 7 o'clock." },
      { de: "Ruf mich bitte an!", en: "Please call me!" },
    ],
  },
];

// ── Cloze exercises ───────────────────────────────────────────────────────────
// Build cloze from a sentence by blanking one key word
function buildCloze(sentence, blankWord) {
  const regex = new RegExp(`\\b${blankWord}\\b`, "i");
  const blanked = sentence.replace(regex, "___");
  return { sentence: blanked, answer: blankWord };
}

export const CLOZE_EXERCISES = [
  // Articles
  { id: "c1",  sentence: "___ Mann trinkt Kaffee.",        answer: "Der",    hint: "Masculine article", tip_id: "articles" },
  { id: "c2",  sentence: "___ Stadt ist groß.",            answer: "Die",    hint: "Feminine article",  tip_id: "articles" },
  { id: "c3",  sentence: "___ Kind spielt draußen.",       answer: "Das",    hint: "Neuter article",    tip_id: "articles" },
  { id: "c4",  sentence: "Ich sehe ___ Mann.",             answer: "den",    hint: "Accusative masculine", tip_id: "accusative" },
  { id: "c5",  sentence: "Er kauft ___ Kaffee.",           answer: "einen",  hint: "Accusative masculine indefinite", tip_id: "accusative" },
  // Verbs
  { id: "c6",  sentence: "Ich ___ müde.",                  answer: "bin",    hint: "sein — ich form",   tip_id: "sein_haben" },
  { id: "c7",  sentence: "Du ___ Zeit.",                   answer: "hast",   hint: "haben — du form",   tip_id: "sein_haben" },
  { id: "c8",  sentence: "Wir ___ nach Hause.",            answer: "gehen",  hint: "to go — wir form",  tip_id: "verb_position" },
  { id: "c9",  sentence: "Heute ___ ich Deutsch.",         answer: "lerne",  hint: "lernen — ich form", tip_id: "verb_position" },
  // Negation
  { id: "c10", sentence: "Ich verstehe das ___.",          answer: "nicht",  hint: "Negate the verb",   tip_id: "negation" },
  { id: "c11", sentence: "Ich habe ___ Zeit.",             answer: "keine",  hint: "Negate a noun",     tip_id: "negation" },
  // Modals
  { id: "c12", sentence: "Ich ___ Deutsch sprechen.",      answer: "kann",   hint: "can — ich form",    tip_id: "modal_verbs" },
  { id: "c13", sentence: "Du ___ jetzt gehen.",            answer: "musst",  hint: "must — du form",    tip_id: "modal_verbs" },
  { id: "c14", sentence: "Wir ___ Deutsch lernen.",        answer: "wollen", hint: "want to — wir form",tip_id: "modal_verbs" },
  // Separable
  { id: "c15", sentence: "Ich stehe um 7 Uhr ___.",        answer: "auf",    hint: "aufstehen splits",  tip_id: "separable_verbs" },
  { id: "c16", sentence: "Ruf mich bitte ___!",            answer: "an",     hint: "anrufen splits",    tip_id: "separable_verbs" },
];

function normalize(t) {
  return String(t ?? "").toLowerCase().trim().replace(/[.!?,]/g, "");
}

// ── ClozeTab component ────────────────────────────────────────────────────────
export function ClozeTab() {
  const [index, setIndex] = useState(0);
  const [input, setInput] = useState("");
  const [checked, setChecked] = useState(false);
  const [score, setScore] = useState(0);
  const [showTip, setShowTip] = useState(false);
  const inputRef = useRef(null);
  const timerRef = useRef(null);

  const ex = CLOZE_EXERCISES[index % CLOZE_EXERCISES.length];
  const tip = GRAMMAR_TIPS.find(t => t.id === ex.tip_id);
  const correct = normalize(input) === normalize(ex.answer);

  useEffect(() => { inputRef.current?.focus(); setShowTip(false); }, [index]);
  useEffect(() => () => clearTimeout(timerRef.current), []);

  const handleChange = (e) => {
    if (checked) return;
    const val = e.target.value;
    setInput(val);
    if (normalize(val) === normalize(ex.answer)) {
      setChecked(true);
      setScore(s => s + 1);
      timerRef.current = setTimeout(() => next(), 1200);
    }
  };

  const check = () => {
    if (!input.trim() || checked) return;
    clearTimeout(timerRef.current);
    setChecked(true);
    if (correct) { setScore(s => s + 1); timerRef.current = setTimeout(() => next(), 1200); }
  };

  const next = useCallback(() => {
    clearTimeout(timerRef.current);
    setIndex(i => i + 1);
    setInput("");
    setChecked(false);
    setShowTip(false);
  }, []);

  // Render the sentence with the blank highlighted
  const parts = ex.sentence.split("___");

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div className="text-sm font-bold text-[var(--text-3)]">{index + 1} / {CLOZE_EXERCISES.length} · Score: {score}</div>
        <Badge variant="outline" className="border-[var(--border)] font-black text-[var(--text-2)]">{tip?.level ?? "A1"}</Badge>
      </div>

      <div className="rounded-3xl border border-zinc-200 bg-white p-8 shadow-[0_14px_34px_rgba(25,27,38,0.06)] space-y-5">
        {/* Sentence with blank */}
        <div className="text-2xl font-black tracking-tight text-center leading-relaxed text-zinc-950">
          {parts[0]}
          <span className={`inline-block border-b-2 min-w-[80px] mx-1 text-center align-bottom
            ${checked ? (correct ? "border-emerald-500 text-emerald-600" : "border-rose-400 text-rose-600") : "border-zinc-400 text-[var(--accent)]"}`}>
            {checked ? ex.answer : (input || "\u00A0")}
          </span>
          {parts[1]}
        </div>

        <div className="text-sm font-semibold text-zinc-500 text-center">{ex.hint}</div>

        <Input
          ref={inputRef}
          value={input}
          onChange={handleChange}
          onKeyDown={e => { if (e.key === "Enter") { if (checked && correct) { next(); } else check(); } }}
          placeholder="Fill in the blank…"
          className="h-12 rounded-2xl border-zinc-200 bg-white text-center text-base font-bold text-zinc-950 placeholder:text-zinc-400 focus:border-[var(--accent)]"
          disabled={checked && !correct}
        />

        {!checked && (
          <Button className="continue-glow h-12 w-full rounded-2xl bg-zinc-950 text-sm font-black text-white hover:bg-zinc-800 disabled:opacity-40" onClick={check} disabled={!input.trim()}>Check</Button>
        )}

        {checked && (
          <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
            className={`rounded-2xl p-3 text-sm font-bold text-center ${correct ? "bg-emerald-500/10 text-emerald-700" : "bg-rose-500/10 text-rose-700"}`}>
            {correct
              ? <span className="flex items-center gap-2 justify-center font-medium"><CheckCircle2 className="h-4 w-4" /> Correct!</span>
              : <span className="font-medium"><XCircle className="h-4 w-4 inline mr-1" />Answer: <strong>{ex.answer}</strong></span>
            }
          </motion.div>
        )}

        <div className="flex gap-3 justify-center flex-wrap">
          <Button variant="outline" size="sm" className="rounded-2xl gap-1 border-zinc-200 bg-white font-bold text-zinc-700 hover:bg-zinc-50 hover:text-zinc-950" onClick={() => setShowTip(v => !v)}>
            <Lightbulb className="h-3 w-3" /> Grammar tip
          </Button>
          {checked && (
            <Button size="sm" className="rounded-2xl gap-1 bg-zinc-950 font-black text-white hover:bg-zinc-800" onClick={next}>
              Next <ChevronRight className="h-3 w-3" />
            </Button>
          )}
        </div>

        <AnimatePresence>
          {showTip && tip && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}
              className="rounded-2xl bg-amber-50 border border-amber-200 p-4 text-sm space-y-2 overflow-hidden">
              <div className="font-black text-amber-900">{tip.title}</div>
              <div className="text-amber-800">{tip.summary}</div>
              <div className="text-amber-700 italic">💡 {tip.tip}</div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

// ── GrammarTab component ──────────────────────────────────────────────────────
export function GrammarTab() {
  const [selected, setSelected] = useState(GRAMMAR_TIPS[0].id);
  const tip = GRAMMAR_TIPS.find(t => t.id === selected);

  return (
    <div className="grid gap-4 lg:grid-cols-[220px_1fr]">
      {/* Sidebar */}
      <div className="space-y-2">
        {GRAMMAR_TIPS.map(t => (
          <button key={t.id} onClick={() => setSelected(t.id)}
            className={`w-full text-left rounded-2xl border px-4 py-3 text-sm transition
              ${selected === t.id ? "bg-[var(--accent)] text-white border-transparent" : "border-zinc-200 bg-white text-zinc-900 hover:bg-zinc-50"}`}>
            <div className="font-black">{t.title}</div>
            <div className={`text-xs mt-0.5 ${selected === t.id ? "text-white/70" : "text-zinc-500"}`}>{t.level}</div>
          </button>
        ))}
      </div>

      {/* Content */}
      {tip && (
        <AnimatePresence mode="wait">
          <motion.div key={tip.id} initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }}
            className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-[0_14px_34px_rgba(25,27,38,0.06)] space-y-5">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <BookOpen className="h-5 w-5 text-[var(--accent)]" />
                <span className="text-xl font-black text-zinc-950">{tip.title}</span>
                <Badge variant="outline" className="border-zinc-200 font-black text-zinc-600">{tip.level}</Badge>
              </div>
              <p className="font-semibold text-zinc-600">{tip.summary}</p>
            </div>

            <div className="rounded-2xl bg-zinc-50 p-4 space-y-2">
              {tip.rules.map((r, i) => (
                <div key={i} className="flex items-start gap-2 text-sm">
                  <span className="mt-0.5 text-[var(--accent)]">•</span>
                  <span className="font-semibold text-zinc-700">{r}</span>
                </div>
              ))}
            </div>

            <div className="rounded-2xl bg-amber-50 border border-amber-200 p-4 text-sm">
              <span className="font-semibold text-amber-900">💡 Tip: </span>
              <span className="text-amber-800">{tip.tip}</span>
            </div>

            <div className="space-y-2">
              <div className="text-sm font-black text-zinc-700">Examples</div>
              {tip.examples.map((ex, i) => (
                <div key={i} className="rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-3">
                  <div className="font-black text-zinc-950">{ex.de}</div>
                  <div className="mt-0.5 text-sm font-semibold text-zinc-500">{ex.en}</div>
                </div>
              ))}
            </div>
          </motion.div>
        </AnimatePresence>
      )}
    </div>
  );
}
