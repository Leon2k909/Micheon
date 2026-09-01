import { syncLocalStorageItem } from "@/lib/profileStorage";
import { normaliseHex } from "@/lib/accentColour";

/**
 * Recolouring one part of the app at a time.
 *
 * The accent picker changes the one colour that carries meaning — buttons,
 * progress, anything selected. This is the other half of the request: point
 * at any part of the app and change ITS colour, whatever it is.
 *
 * The unit of change is a token, not an element. Micheon paints from CSS
 * variables, so every card in the app is --surface-2 and every quiet caption
 * is --text-3; changing the token changes the part, consistently, everywhere,
 * which is what somebody means by "the cards" or "the small grey text". An
 * element-by-element override would recolour the one card they happened to be
 * pointing at and leave its neighbours behind.
 *
 * Overrides are stored PER THEME. A colour chosen against the dark background
 * is usually unreadable on the light one, and the app can switch between them
 * at any time, so light and dark keep separate books.
 */

const CUSTOM_COLOURS_KEY = "gl-custom-colours";
export const CUSTOM_COLOURS_CHANGE_EVENT = "gl-custom-colours-changed";

type PaintKind = "background" | "border" | "text";

export interface PaintablePart {
  /** The CSS variable this part is painted from. */
  token: string;
  name: string;
  description: string;
  kind: PaintKind;
  /** Other tokens that must move with it to keep the app coherent. */
  also?: string[];
}

/**
 * The parts worth offering, and no more.
 *
 * Micheon declares well over a hundred custom properties. Most are derived,
 * decorative or structural, and a picker listing all of them would be a
 * stylesheet with a mouse attached. These are the ones a person can point at
 * and name: the page, the cards, the lines between them, and the three
 * weights of text.
 */
/**
 * The partner tokens each part has to carry with it were not guessed: the
 * shipped interface paints from its own --np- family, which shadows the base
 * tokens with the same values, so overriding --surface-2 on its own moved the
 * variable and repainted nothing. Read out of the running app by matching
 * every declared custom property against the value the part resolves to
 * inside .new-ui-prototype.
 */
export const PAINTABLE_PARTS: PaintablePart[] = [
  {
    token: "--bg",
    name: "Page background",
    description: "The colour behind everything.",
    kind: "background",
    // --np-bg and --np-shell are darker than --bg by design; a page colour
    // that left the shell behind would repaint a frame around the old one.
    also: ["--np-bg", "--np-shell", "--np-shell-top"],
  },
  {
    token: "--surface",
    name: "Panel background",
    description: "The large panels that hold a screen's content.",
    kind: "background",
    also: ["--surface-1", "--np-surface"],
  },
  {
    token: "--surface-2",
    name: "Card background",
    description: "Cards, list rows and settings blocks.",
    kind: "background",
    also: ["--np-surface-soft"],
  },
  {
    token: "--surface-3",
    name: "Raised background",
    description: "Hovered rows, inputs and anything sitting on a card.",
    kind: "background",
  },
  {
    token: "--border",
    name: "Lines and outlines",
    description: "The hairlines between cards, rows and inputs.",
    kind: "border",
    also: ["--border-2", "--np-line"],
  },
  {
    token: "--text-1",
    name: "Main text",
    description: "Headings and anything you are meant to read first.",
    kind: "text",
    also: ["--np-text"],
  },
  {
    token: "--text-2",
    name: "Secondary text",
    description: "Supporting lines under a heading.",
    kind: "text",
    also: ["--np-muted"],
  },
  {
    token: "--text-3",
    name: "Quiet text",
    description: "Captions, hints and small print.",
    kind: "text",
    also: ["--np-soft"],
  },
];

export const PAINTABLE_BY_TOKEN = new Map(PAINTABLE_PARTS.map((part) => [part.token, part]));

type ThemeName = "dark" | "light";
type ColourOverrides = Partial<Record<string, string>>;
type StoredOverrides = Record<ThemeName, ColourOverrides>;

const EMPTY: StoredOverrides = { dark: {}, light: {} };

export function currentThemeName(): ThemeName {
  if (typeof document === "undefined") return "light";
  return document.documentElement.getAttribute("data-theme") === "dark" ? "dark" : "light";
}

function readStored(): StoredOverrides {
  if (typeof window === "undefined") return { dark: {}, light: {} };
  try {
    const raw = window.localStorage.getItem(CUSTOM_COLOURS_KEY);
    if (!raw) return { dark: {}, light: {} };
    const parsed = JSON.parse(raw) as Partial<StoredOverrides>;
    const clean = (source: unknown): ColourOverrides => {
      const out: ColourOverrides = {};
      if (!source || typeof source !== "object") return out;
      for (const [token, value] of Object.entries(source as Record<string, unknown>)) {
        // Only tokens this picker offers, and only real colours: whatever is
        // in storage was written by an earlier version or by hand, and it is
        // about to be injected into the page with !important.
        if (!PAINTABLE_BY_TOKEN.has(token)) continue;
        const hex = normaliseHex(value);
        if (hex) out[token] = hex;
      }
      return out;
    };
    return { dark: clean(parsed.dark), light: clean(parsed.light) };
  } catch {
    return { dark: {}, light: {} };
  }
}

export function getCustomColours(theme: ThemeName = currentThemeName()): ColourOverrides {
  return readStored()[theme] ?? {};
}

/**
 * The scopes an override has to name.
 *
 * Every themed container re-declares these tokens on ITSELF, and a custom
 * property set on a nearer ancestor beats one inherited from the root — which
 * is why the accent overrides name the same list. Setting them on <html>
 * alone changes nothing inside a lesson.
 */
const SCOPES = [
  ":root",
  ".new-ui-prototype",
  ".np-feature-host",
  ".guided-session.fs-app.prototype-guided-session",
  ".audio-mixer-panel.prototype-audio-mixer",
];

const STYLE_ID = "micheon-custom-colour-overrides";

export function applyCustomColours(theme: ThemeName = currentThemeName()) {
  if (typeof document === "undefined") return;
  const existing = document.getElementById(STYLE_ID);
  const overrides = getCustomColours(theme);
  const declarations: string[] = [];
  for (const [token, hex] of Object.entries(overrides)) {
    if (!hex) continue;
    declarations.push(`  ${token}: ${hex} !important;`);
    for (const partner of PAINTABLE_BY_TOKEN.get(token)?.also ?? []) {
      declarations.push(`  ${partner}: ${hex} !important;`);
    }
  }

  if (declarations.length === 0) {
    // Hand the palette back to the stylesheets rather than restating their
    // own values, exactly as the accent override does.
    existing?.remove();
    return;
  }
  const style = existing ?? document.createElement("style");
  style.id = STYLE_ID;
  style.textContent = `${SCOPES.join(",\n")} {\n${declarations.join("\n")}\n}`;
  // After the accent stylesheet, so a part someone picked by hand wins over
  // the shades derived from the accent.
  if (!existing) document.head.appendChild(style);
}

function write(next: StoredOverrides) {
  if (typeof window === "undefined") return;
  const value = JSON.stringify(next);
  try { window.localStorage.setItem(CUSTOM_COLOURS_KEY, value); } catch { /* keep the app usable */ }
  syncLocalStorageItem(CUSTOM_COLOURS_KEY, value);
  applyCustomColours();
  window.dispatchEvent(new Event(CUSTOM_COLOURS_CHANGE_EVENT));
}

export function setCustomColour(token: string, hex: string, theme: ThemeName = currentThemeName()) {
  if (!PAINTABLE_BY_TOKEN.has(token)) return;
  const value = normaliseHex(hex);
  if (!value) return;
  const stored = readStored();
  write({ ...stored, [theme]: { ...stored[theme], [token]: value } });
}

export function clearCustomColour(token: string, theme: ThemeName = currentThemeName()) {
  const stored = readStored();
  const next = { ...stored[theme] };
  delete next[token];
  write({ ...stored, [theme]: next });
}

export function resetCustomColours() {
  write({ ...EMPTY, dark: {}, light: {} });
}

/** "rgb(22, 27, 35)" and "#161b23" are the same colour; this says so. */
export function toRgbString(value: string): string | null {
  const text = value.trim();
  if (!text) return null;
  // Eight digits: the hairline tokens carry their alpha in the hex, and the
  // picker only needs the colour underneath it.
  const withAlpha = /^#([0-9a-f]{6})[0-9a-f]{2}$/i.exec(text);
  const hex = normaliseHex(withAlpha ? `#${withAlpha[1]}` : text);
  if (hex) {
    const n = hex.slice(1);
    return `rgb(${parseInt(n.slice(0, 2), 16)}, ${parseInt(n.slice(2, 4), 16)}, ${parseInt(n.slice(4, 6), 16)})`;
  }
  const match = /^rgba?\(\s*([\d.]+)[,\s]+([\d.]+)[,\s]+([\d.]+)/i.exec(text);
  if (!match) return null;
  return `rgb(${Math.round(Number(match[1]))}, ${Math.round(Number(match[2]))}, ${Math.round(Number(match[3]))})`;
}

/** The hex a colour input needs, from whatever the stylesheet happens to say. */
export function toHexString(value: string): string | null {
  const rgb = toRgbString(value);
  if (!rgb) return null;
  const parts = /rgb\((\d+), (\d+), (\d+)\)/.exec(rgb);
  if (!parts) return null;
  return `#${parts.slice(1).map((n) => Number(n).toString(16).padStart(2, "0")).join("")}`;
}

export interface PartMatch {
  part: PaintablePart;
  /** What that token currently resolves to where the element sits. */
  current: string;
}

/**
 * Which parts paint this element?
 *
 * Read from the element rather than from :root, because the tokens are
 * re-declared per container — the value of --surface-2 inside a lesson is not
 * the value at the document root, and matching against the wrong one would
 * name the wrong part.
 *
 * A transparent background is not a colour the reader can see, so the search
 * walks up to whatever is actually painting behind the element. That is what
 * makes pointing at a word inside a card select the card.
 */
export function partsPainting(element: Element): PartMatch[] {
  if (typeof window === "undefined") return [];
  const found: PartMatch[] = [];
  const seen = new Set<string>();

  const add = (part: PaintablePart, at: Element) => {
    if (seen.has(part.token)) return;
    const resolved = window.getComputedStyle(at).getPropertyValue(part.token).trim();
    if (!resolved) return;
    seen.add(part.token);
    found.push({ part, current: resolved });
  };

  const style = window.getComputedStyle(element);
  const colour = toRgbString(style.color);
  const border = toRgbString(style.borderTopColor);

  for (const part of PAINTABLE_PARTS) {
    const resolved = toRgbString(window.getComputedStyle(element).getPropertyValue(part.token));
    if (!resolved) continue;
    if (part.kind === "text" && colour === resolved) add(part, element);
    if (part.kind === "border" && border === resolved && Number.parseFloat(style.borderTopWidth) > 0) {
      add(part, element);
    }
  }

  // The background belongs to whichever ancestor is actually painting one.
  let node: Element | null = element;
  while (node) {
    const background = toRgbString(window.getComputedStyle(node).backgroundColor);
    const alpha = /rgba\([^)]*,\s*0\s*\)$/.test(window.getComputedStyle(node).backgroundColor);
    if (background && !alpha) {
      for (const part of PAINTABLE_PARTS) {
        if (part.kind !== "background") continue;
        if (toRgbString(window.getComputedStyle(node).getPropertyValue(part.token)) === background) {
          add(part, node);
        }
      }
      if (found.some((match) => match.part.kind === "background")) break;
    }
    node = node.parentElement;
  }

  return found;
}
