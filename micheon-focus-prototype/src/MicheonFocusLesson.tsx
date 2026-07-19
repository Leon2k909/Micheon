import React, {
  FormEvent,
  PointerEvent as ReactPointerEvent,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import "./MicheonFocusLesson.css";

const SENTENCE = "Korrigier mich bitte, wenn ich Fehler mache.";
const WORDS = ["Korrigier", "mich", "bitte,", "wenn", "ich", "Fehler", "mache."];
const STAGES = [
  "Hear it",
  "Read it",
  "Shadow it",
  "Recall the meaning",
  "Build from memory",
  "Translate it",
  "Say it",
  "Master it",
];
const STAGE_SHORT_LABELS = ["Hear", "Read", "Shadow", "Meaning", "Build", "Translate", "Speak", "Master"];

const normalize = (value: string) => value
  .toLocaleLowerCase("de-DE")
  .replace(/[.,!?;:'“”„\-]/g, "")
  .replace(/\s+/g, " ")
  .trim();

export default function MicheonFocusLesson() {
  const [activeStage, setActiveStage] = useState(5);
  const [answer, setAnswer] = useState("");
  const [feedback, setFeedback] = useState<"idle" | "correct" | "error">("idle");
  const [coachOpen, setCoachOpen] = useState(false);
  const [speaking, setSpeaking] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);
  const sentenceViewportRef = useRef<HTMLDivElement>(null);
  const sentenceLineRef = useRef<HTMLDivElement>(null);
  const sentenceBoardRef = useRef<HTMLElement>(null);

  const expectedWords = useMemo(() => normalize(SENTENCE).split(" "), []);
  const typedWords = useMemo(() => normalize(answer).split(" ").filter(Boolean), [answer]);

  const fitSentence = () => {
    const viewport = sentenceViewportRef.current;
    const line = sentenceLineRef.current;
    if (!viewport || !line || window.innerWidth <= 760) return;

    const available = viewport.clientWidth - 64;
    let size = Math.min(58, Math.max(34, available / 19));
    let guard = 0;
    line.style.fontSize = `${size}px`;

    while (line.scrollWidth > available && size > 30 && guard < 60) {
      size -= 1;
      line.style.fontSize = `${size}px`;
      guard += 1;
    }

    while (line.scrollWidth < available * 0.84 && size < 58 && guard < 90) {
      size += 1;
      line.style.fontSize = `${size}px`;
      if (line.scrollWidth > available) {
        size -= 1;
        line.style.fontSize = `${size}px`;
        break;
      }
      guard += 1;
    }
  };

  const speak = (text: string) => {
    if (!("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "de-DE";
    utterance.rate = 0.84;
    setSpeaking(true);
    utterance.onend = () => setSpeaking(false);
    utterance.onerror = () => setSpeaking(false);
    window.speechSynthesis.speak(utterance);
  };

  useEffect(() => {
    const viewport = sentenceViewportRef.current;
    if (!viewport) return;

    const observer = new ResizeObserver(fitSentence);
    observer.observe(viewport);
    window.addEventListener("resize", fitSentence);
    requestAnimationFrame(fitSentence);

    return () => {
      observer.disconnect();
      window.removeEventListener("resize", fitSentence);
    };
  }, []);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.code === "Space" && document.activeElement !== inputRef.current) {
        event.preventDefault();
        speak(SENTENCE);
      }
      if (event.key === "Escape") setCoachOpen(false);
    };

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, []);

  const submit = (event: FormEvent) => {
    event.preventDefault();
    const correct = normalize(answer) === normalize(SENTENCE);
    setFeedback(correct ? "correct" : "error");
    if (correct && activeStage < 8) {
      window.setTimeout(() => setActiveStage((stage) => Math.min(8, stage + 1)), 720);
    }
  };

  const addCharacter = (character: string) => {
    const input = inputRef.current;
    if (!input) return;
    const start = input.selectionStart ?? answer.length;
    const end = input.selectionEnd ?? start;
    const next = `${answer.slice(0, start)}${character}${answer.slice(end)}`;
    setAnswer(next);
    setFeedback("idle");
    requestAnimationFrame(() => {
      input.focus();
      input.setSelectionRange(start + 1, start + 1);
    });
  };

  const tiltBoard = (event: ReactPointerEvent<HTMLElement>) => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const board = sentenceBoardRef.current;
    if (!board) return;
    const rect = board.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;
    board.style.transform = `perspective(1200px) rotateX(${y * -1.1}deg) rotateY(${x * 1.5}deg)`;
  };

  const resetBoardTilt = () => {
    if (sentenceBoardRef.current) {
      sentenceBoardRef.current.style.transform = "perspective(1200px) rotateX(0deg) rotateY(0deg)";
    }
  };

  return (
    <main className="micheon-app">
      <header className="topbar">
        <a className="brand" href="#" aria-label="Micheon home">
          <span className="brand__mark" aria-hidden="true"><i /><i /><i /></span>
          <span className="brand__name">MICHEON</span>
        </a>

        <div className="lesson-progress" aria-label="Lesson progress">
          <div className="lesson-progress__copy"><span>Lesson</span><strong>2 of 6</strong></div>
          <div className="lesson-progress__track"><i /></div>
          <strong className="lesson-progress__percent">33%</strong>
        </div>

        <div className="topbar__actions">
          <button className="icon-button" type="button" aria-label="Toggle sound">♪</button>
          <button className="icon-button" type="button" aria-label="Close lesson">×</button>
        </div>
      </header>

      <section className="workspace">
        <section className="lesson-card" aria-labelledby="lessonTitle">
          <nav className="stage-route" aria-label="Sentence learning stages">
            <div className="stage-route__meta">
              <div><span>Stage {activeStage} of 8</span><strong>{STAGES[activeStage - 1]}</strong></div>
              <span className="stage-route__hint">Jump to any stage</span>
            </div>

            <div className="stage-route__track">
              <div className="stage-route__line" aria-hidden="true"><i style={{ width: `${((activeStage - 1) / 7) * 100}%` }} /></div>
              {STAGE_SHORT_LABELS.map((label, index) => {
                const stage = index + 1;
                const classes = [
                  "stage-button",
                  stage < activeStage ? "is-done" : "",
                  stage === activeStage ? "is-active" : "",
                ].filter(Boolean).join(" ");
                return (
                  <button
                    key={label}
                    className={classes}
                    type="button"
                    aria-current={stage === activeStage ? "step" : undefined}
                    onClick={() => setActiveStage(stage)}
                  >
                    <span>{stage}</span><small>{label}</small>
                  </button>
                );
              })}
            </div>
          </nav>

          <div className="lesson-content">
            <div className="lesson-heading">
              <div>
                <span className="eyebrow"><i /> Sentence practice</span>
                <h1 id="lessonTitle">Build the sentence</h1>
                <p>Listen once, then type it from memory.</p>
              </div>

              <button className={`listen-button ${speaking ? "is-speaking" : ""}`} type="button" onClick={() => speak(SENTENCE)}>
                <span className="listen-button__icon">♪</span>
                <span><strong>Hear it</strong><small>Space</small></span>
              </button>
            </div>

            <section
              ref={sentenceBoardRef}
              className="sentence-board"
              aria-label="German sentence"
              onPointerMove={tiltBoard}
              onPointerLeave={resetBoardTilt}
            >
              <div className="sentence-board__topline"><span>German</span><small>Tap a word to hear it</small></div>
              <div ref={sentenceViewportRef} className="sentence-viewport">
                <div ref={sentenceLineRef} className="sentence-line">
                  {WORDS.map((word, index) => {
                    const touched = typedWords.length > index;
                    const matched = touched && typedWords[index] === expectedWords[index];
                    const classes = [
                      "word",
                      matched ? "is-matched" : "",
                      touched && !matched ? "is-dimmed" : "",
                      feedback === "correct" ? "is-correct" : "",
                      feedback === "error" ? "is-error" : "",
                    ].filter(Boolean).join(" ");
                    return <button key={`${word}-${index}`} className={classes} type="button" onClick={() => speak(word)}>{word}</button>;
                  })}
                </div>
              </div>
            </section>

            <div className="translation-row">
              <div className="translation-row__copy"><span className="language-chip">EN</span><p>Please correct me when I make mistakes.</p></div>
              <button className="coach-link" type="button" onClick={() => setCoachOpen(true)}>Why this works <span>→</span></button>
            </div>

            <form className={`answer-panel ${feedback === "correct" ? "is-correct" : ""} ${feedback === "error" ? "is-error" : ""}`} onSubmit={submit}>
              <div className="answer-panel__prompt"><span>DE</span><strong>Type in German</strong></div>
              <input
                ref={inputRef}
                value={answer}
                onChange={(event) => { setAnswer(event.target.value); setFeedback("idle"); }}
                spellCheck={false}
                placeholder="Korrigier mich bitte…"
                aria-label="Type the German sentence"
              />
              <div className="special-characters">
                {["ä", "ö", "ü", "ß"].map((character) => <button key={character} type="button" onClick={() => addCharacter(character)}>{character}</button>)}
              </div>
              <button className="check-button" type="submit"><span>Check</span><span>→</span></button>
            </form>

            <div className={`feedback ${feedback === "correct" ? "is-correct" : ""} ${feedback === "error" ? "is-error" : ""}`}>
              <span className="feedback__icon">{feedback === "correct" ? "✓" : feedback === "error" ? "!" : "↵"}</span>
              <span>{feedback === "correct" ? "Perfect — that sentence is locked in." : feedback === "error" ? "Almost — compare the word order and try again." : "Press Enter when you are ready."}</span>
            </div>
          </div>
        </section>
      </section>

      <aside className={`coach-card ${coachOpen ? "is-open" : ""}`} aria-hidden={!coachOpen}>
        <button className="coach-card__close" type="button" onClick={() => setCoachOpen(false)} aria-label="Close explanation">×</button>
        <span className="coach-card__eyebrow">Quick explanation</span>
        <h2>“Bitte” keeps the request warm and natural.</h2>
        <p>After <b>wenn</b>, the conjugated verb moves to the end of the clause.</p>
        <div className="grammar-demo"><span>wenn</span><i /><span>ich</span><i /><strong>mache</strong></div>
        <small>Tap any word in the sentence to hear it by itself.</small>
      </aside>
    </main>
  );
}
