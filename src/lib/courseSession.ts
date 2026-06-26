import type { Lesson, Block } from "@/lib/courses";

// ── Code comparison ───────────────────────────────────────────
// Lenient: ignores indentation/extra whitespace and comments, but
// is case-sensitive (C# is). Good enough to validate "you typed the code".

function stripComments(code: string): string {
  return code
    .split("\n")
    .map((line) => {
      // remove // line comments (naive — fine for course snippets, no strings with //)
      const idx = line.indexOf("//");
      return idx >= 0 ? line.slice(0, idx) : line;
    })
    .join("\n");
}

export function normalizeCode(code: string): string {
  return stripComments(code)
    .replace(/\s+/g, " ")   // collapse all whitespace
    .replace(/\s*([{}();,=<>+\-*/.])\s*/g, "$1") // tighten around punctuation
    .trim();
}

export type CodeCheck = {
  ok: boolean;
  missingPunctuation: boolean;
  caseMismatch: boolean;
  misplacedSemicolon: boolean;
  typoHint?: { typed: string; expected: string };
};

function editDistance(a: string, b: string): number {
  const dp = Array.from({ length: a.length + 1 }, (_, i) => Array(b.length + 1).fill(0));
  for (let i = 0; i <= a.length; i++) dp[i][0] = i;
  for (let j = 0; j <= b.length; j++) dp[0][j] = j;
  for (let i = 1; i <= a.length; i++) {
    for (let j = 1; j <= b.length; j++) {
      dp[i][j] = Math.min(
        dp[i - 1][j] + 1,
        dp[i][j - 1] + 1,
        dp[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1)
      );
    }
  }
  return dp[a.length][b.length];
}

function typoHint(input: string, target: string): CodeCheck["typoHint"] {
  const inputWords = input.match(/\b[A-Za-z_][A-Za-z0-9_]*\b/g) ?? [];
  const targetWords = target.match(/\b[A-Za-z_][A-Za-z0-9_]*\b/g) ?? [];
  for (const typed of inputWords) {
    if (targetWords.includes(typed)) continue;
    const expected = targetWords.find((word) => word.length >= 4 && editDistance(typed, word) <= 2);
    if (expected) return { typed, expected };
  }
  return undefined;
}

export function checkCode(input: string, target: string): CodeCheck {
  const a = normalizeCode(input);
  const b = normalizeCode(target);
  if (a === b) return { ok: true, missingPunctuation: false, caseMismatch: false, misplacedSemicolon: false };

  const hasMisplacedSemicolon = /;\s*\)/.test(input);
  const hint = typoHint(input, target);

  if (hasMisplacedSemicolon) {
    return { ok: false, missingPunctuation: false, caseMismatch: false, misplacedSemicolon: true };
  }

  const lower = (s: string) => s.toLowerCase();
  if (lower(a) === lower(b)) return { ok: false, missingPunctuation: false, caseMismatch: true, misplacedSemicolon: false };

  // Near miss: same once semicolons are ignored. This should NOT pass,
  // but lets the UI give a clearer message than generic "wrong".
  const loose = (s: string) => s.replace(/[;]/g, "");
  if (loose(a) === loose(b)) return { ok: false, missingPunctuation: true, caseMismatch: false, misplacedSemicolon: false };

  // Same code ignoring semicolons, but only if capitalisation is also ignored.
  if (lower(loose(a)) === lower(loose(b))) {
    return { ok: false, missingPunctuation: !loose(a).includes(";") || a.split(";").length !== b.split(";").length, caseMismatch: true, misplacedSemicolon: false };
  }

  // Also catch the common case where there is a missing semicolon plus harmless
  // formatting differences around braces/newlines.
  const veryLoose = (s: string) => loose(s).replace(/\s+/g, "");
  if (veryLoose(input) === veryLoose(target)) return { ok: false, missingPunctuation: true, caseMismatch: false, misplacedSemicolon: false };
  if (lower(veryLoose(input)) === lower(veryLoose(target))) return { ok: false, missingPunctuation: false, caseMismatch: true, misplacedSemicolon: false };

  return { ok: false, missingPunctuation: false, caseMismatch: false, misplacedSemicolon: false, typoHint: hint };
}

// ── Lesson → guided steps ─────────────────────────────────────
export type ConceptStep = { type: "concept"; title: string; blocks: Block[] };
export type CodeStep = { type: "code"; prompt: string; target: string; hintComments: string[] };
export type QuizStep = { type: "quiz"; q: string; options: { text: string; correct: boolean }[]; explanation: string };
export type CompleteStep = { type: "complete" };
export type SessionStep = ConceptStep | CodeStep | QuizStep | CompleteStep;

// Extract the comment hints from a code block so we can show them as guidance.
function commentHints(code: string): string[] {
  const out: string[] = [];
  for (const line of code.split("\n")) {
    const idx = line.indexOf("//");
    if (idx >= 0) {
      const c = line.slice(idx + 2).trim();
      if (c) out.push(c);
    }
  }
  return out;
}

function typingTarget(code: string): string {
  // Comments explain the example, but they shouldn't be part of typing practice.
  return code
    .split("\n")
    .map((line) => {
      const idx = line.indexOf("//");
      return (idx >= 0 ? line.slice(0, idx) : line).trimEnd();
    })
    .join("\n")
    .replace(/\n{3,}/g, "\n\n")
    .trimEnd();
}

// Is this code worth asking the user to type? Skip tiny/declaration-only or
// pure "list of API names" blocks (these read better than they type).
function isTypeable(code: string): boolean {
  const lines = code.split("\n").filter((l) => l.trim().length > 0);
  if (lines.length === 0) return false;
  const codeChars = normalizeCode(code).length;
  return codeChars >= 12 && lines.length <= 16;
}

export function buildLessonSession(lesson: Lesson): SessionStep[] {
  const steps: SessionStep[] = [];
  let conceptBuffer: Block[] = [];

  const flushConcept = () => {
    if (conceptBuffer.length > 0) {
      steps.push({ type: "concept", title: lesson.title, blocks: conceptBuffer });
      conceptBuffer = [];
    }
  };

  for (const block of lesson.blocks) {
    switch (block.type) {
      case "p":
      case "h3":
      case "callout":
      case "cards":
        conceptBuffer.push(block);
        break;
      case "code":
        if (isTypeable(block.code)) {
          flushConcept();
          steps.push({
            type: "code",
            prompt: "Type the code below",
            target: typingTarget(block.code),
            hintComments: commentHints(block.code),
          });
        } else {
          conceptBuffer.push(block);
        }
        break;
      case "twocol":
        // Show the comparison as concept, then ask them to type the C# side.
        conceptBuffer.push(block);
        if (isTypeable(block.right.code)) {
          flushConcept();
          steps.push({
            type: "code",
            prompt: `Type the ${block.right.lang} version`,
            target: typingTarget(block.right.code),
            hintComments: commentHints(block.right.code),
          });
        }
        break;
      case "quiz":
        flushConcept();
        steps.push({ type: "quiz", q: block.q, options: block.options, explanation: block.explanation });
        break;
      case "cta":
        conceptBuffer.push(block as Block);
        break;
    }
  }

  flushConcept();
  steps.push({ type: "complete" });
  return steps;
}
