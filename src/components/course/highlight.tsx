import React from "react";

// Minimal C# tokenizer → colored spans. Not a full parser, but enough to
// give an IDE-like feel: keywords, types, strings, comments, numbers, methods.

const KEYWORDS = new Set([
  "public", "private", "protected", "internal", "static", "sealed", "abstract",
  "class", "interface", "struct", "enum", "void", "var", "new", "return", "if",
  "else", "for", "foreach", "while", "do", "switch", "case", "default", "break",
  "continue", "in", "out", "ref", "using", "namespace", "get", "set", "this",
  "base", "null", "true", "false", "override", "virtual", "async", "await",
  "nameof", "typeof", "is", "as", "throw", "try", "catch", "finally", "const",
  "readonly", "params", "where", "yield",
]);

const TYPES = new Set([
  "int", "float", "double", "decimal", "bool", "string", "char", "byte", "long",
  "short", "object", "void", "List", "Dictionary", "Vector3", "Rotation",
  "Component", "GameObject", "Transform", "Color", "Player", "Enemy", "Zombie",
  "Sniper", "Barrel", "Vehicle", "IDamageable", "Rigidbody", "ModelRenderer",
  "Scene", "Time", "Input", "Log", "Console", "Math", "Http", "FileSystem",
  "Connection", "PlayerData", "Particles",
]);

type Tok = { text: string; cls: string };

const COLORS: Record<string, string> = {
  kw: "text-[#9d8df1]",      // keyword (purple)
  ty: "text-[#4fc99a]",      // type (green)
  st: "text-[#e8945a]",      // string (orange)
  num: "text-[#d4a857]",     // number (gold)
  cm: "text-[var(--text-3)] italic", // comment
  fn: "text-[#5fa8e0]",      // method call (blue)
  at: "text-[#e0789a]",      // attribute
  punct: "text-[var(--text-2)]",
  plain: "text-[var(--text-1)]",
};

export function tokenizeCSharp(code: string): Tok[] {
  const tokens: Tok[] = [];
  let i = 0;
  const n = code.length;

  const push = (text: string, cls: string) => tokens.push({ text, cls });

  while (i < n) {
    const ch = code[i];

    // line comment
    if (ch === "/" && code[i + 1] === "/") {
      let j = i;
      while (j < n && code[j] !== "\n") j++;
      push(code.slice(i, j), "cm");
      i = j;
      continue;
    }

    // string (double quote, incl. $"...")
    if (ch === '"' || (ch === "$" && code[i + 1] === '"')) {
      let j = ch === "$" ? i + 2 : i + 1;
      while (j < n && code[j] !== '"') {
        if (code[j] === "\\") j++;
        j++;
      }
      j++; // closing quote
      push(code.slice(i, j), "st");
      i = j;
      continue;
    }

    // char literal
    if (ch === "'") {
      let j = i + 1;
      while (j < n && code[j] !== "'") { if (code[j] === "\\") j++; j++; }
      j++;
      push(code.slice(i, j), "st");
      i = j;
      continue;
    }

    // attribute [Property]
    if (ch === "[") {
      let j = i + 1;
      while (j < n && code[j] !== "]" && code[j] !== "\n") j++;
      push(code.slice(i, Math.min(j + 1, n)), "at");
      i = Math.min(j + 1, n);
      continue;
    }

    // number
    if (/[0-9]/.test(ch)) {
      let j = i;
      while (j < n && /[0-9._fdLulx]/i.test(code[j])) j++;
      push(code.slice(i, j), "num");
      i = j;
      continue;
    }

    // identifier / keyword / type / method
    if (/[A-Za-z_]/.test(ch)) {
      let j = i;
      while (j < n && /[A-Za-z0-9_]/.test(code[j])) j++;
      const word = code.slice(i, j);
      // look ahead for "(" → method call
      let k = j;
      while (k < n && code[k] === " ") k++;
      const isCall = code[k] === "(";
      let cls = "plain";
      if (KEYWORDS.has(word)) cls = "kw";
      else if (TYPES.has(word)) cls = "ty";
      else if (isCall) cls = "fn";
      push(word, cls);
      i = j;
      continue;
    }

    // whitespace / punctuation — pass through
    push(ch, /[{}()\[\];,.<>+\-*/=&|!?:]/.test(ch) ? "punct" : "plain");
    i++;
  }

  return tokens;
}

export function HighlightedCode({ code, className }: { code: string; className?: string }) {
  const tokens = tokenizeCSharp(code);
  return (
    <code className={className}>
      {tokens.map((t, idx) => (
        <span key={idx} className={COLORS[t.cls] ?? COLORS.plain}>
          {t.text}
        </span>
      ))}
    </code>
  );
}
