import React from "react";

/**
 * Self-drawn flag art for the language picker.
 *
 * Windows has no colour emoji font for flags — the emoji fall back to bare
 * letter pairs ("IT", "NL"), which reads as a broken icon. These are drawn
 * from data instead, so they render identically everywhere and ship offline.
 *
 * Flags with complex emblems (crests, script, animals) are deliberately
 * simplified to their fields and primary shapes, the way small-size icon sets
 * do — a 32px roundel cannot carry a heraldic lion, and a wrong lion is worse
 * than none. Colours are the commonly published values for each flag.
 */

type Layer =
  /** Horizontal stripes, top to bottom, with optional relative heights. */
  | { h: string[]; r?: number[] }
  /** Vertical stripes, left to right, with optional relative widths. */
  | { v: string[]; r?: number[] }
  | { rect: [number, number, number, number, string] }
  | { c: [number, number, number, string] }
  /** Ring: circle outline only. */
  | { ring: [number, number, number, string, number] }
  | { poly: [string, string] }
  /** Five-pointed star centred at x,y with outer radius r. */
  | { star: [number, number, number, string] }
  /** Scandinavian cross: colour and bar width, centred at x=22. */
  | { cross: [string, number] }
  /** Arbitrary SVG path, for the few shapes stripes cannot make. */
  | { path: [string, string] };

const W = 60;
const H = 40;

function starPoints(cx: number, cy: number, r: number): string {
  const points: string[] = [];
  for (let i = 0; i < 10; i += 1) {
    const radius = i % 2 === 0 ? r : r * 0.4;
    const angle = -Math.PI / 2 + (i * Math.PI) / 5;
    points.push(`${(cx + radius * Math.cos(angle)).toFixed(1)},${(cy + radius * Math.sin(angle)).toFixed(1)}`);
  }
  return points.join(" ");
}

function renderLayer(layer: Layer, key: number): React.ReactNode {
  if ("h" in layer) {
    const ratios = layer.r ?? layer.h.map(() => 1);
    const total = ratios.reduce((a, b) => a + b, 0);
    let y = 0;
    return layer.h.map((colour, i) => {
      const height = (H * ratios[i]) / total;
      const rect = <rect key={`${key}-${i}`} x={0} y={y} width={W} height={height + 0.5} fill={colour} />;
      y += height;
      return rect;
    });
  }
  if ("v" in layer) {
    const ratios = layer.r ?? layer.v.map(() => 1);
    const total = ratios.reduce((a, b) => a + b, 0);
    let x = 0;
    return layer.v.map((colour, i) => {
      const width = (W * ratios[i]) / total;
      const rect = <rect key={`${key}-${i}`} x={x} y={0} width={width + 0.5} height={H} fill={colour} />;
      x += width;
      return rect;
    });
  }
  if ("rect" in layer) {
    const [x, y, w, h, colour] = layer.rect;
    return <rect key={key} x={x} y={y} width={w} height={h} fill={colour} />;
  }
  if ("c" in layer) {
    const [cx, cy, r, colour] = layer.c;
    return <circle key={key} cx={cx} cy={cy} r={r} fill={colour} />;
  }
  if ("ring" in layer) {
    const [cx, cy, r, colour, width] = layer.ring;
    return <circle key={key} cx={cx} cy={cy} r={r} fill="none" stroke={colour} strokeWidth={width} />;
  }
  if ("poly" in layer) {
    const [points, colour] = layer.poly;
    return <polygon key={key} points={points} fill={colour} />;
  }
  if ("star" in layer) {
    const [cx, cy, r, colour] = layer.star;
    return <polygon key={key} points={starPoints(cx, cy, r)} fill={colour} />;
  }
  if ("cross" in layer) {
    const [colour, width] = layer.cross;
    return (
      <g key={key}>
        <rect x={22 - width / 2} y={0} width={width} height={H} fill={colour} />
        <rect x={0} y={20 - width / 2} width={W} height={width} fill={colour} />
      </g>
    );
  }
  if ("path" in layer) {
    const [d, colour] = layer.path;
    return <path key={key} d={d} fill={colour} />;
  }
  return null;
}

/** A simplified Union Jack canton used by the Hawaiian and Māori rows. */
const UK_CANTON: Layer[] = [
  { rect: [0, 0, 27, 20, "#012169"] },
  { poly: ["0,0 4,0 27,17 27,20 23,20 0,3", "#ffffff"] },
  { poly: ["27,0 27,3 4,20 0,20 0,17 23,0", "#ffffff"] },
  { rect: [11, 0, 5, 20, "#ffffff"] },
  { rect: [0, 7.5, 27, 5, "#ffffff"] },
  { rect: [12, 0, 3, 20, "#c8102e"] },
  { rect: [0, 8.5, 27, 3, "#c8102e"] },
];

const INDIA: Layer[] = [
  { h: ["#ff9933", "#ffffff", "#138808"] },
  { ring: [30, 20, 4.5, "#000080", 1.4] },
];

const NIGERIA: Layer[] = [{ v: ["#008751", "#ffffff", "#008751"] }];

const SOUTH_AFRICA: Layer[] = [
  { rect: [0, 0, 60, 40, "#ffffff"] },
  { rect: [0, 0, 60, 14, "#de3831"] },
  { rect: [0, 26, 60, 14, "#002395"] },
  { poly: ["0,4 18,20 0,36 0,30 10,20 0,10", "#ffffff"] },
  { rect: [0, 15, 60, 10, "#007a4d"] },
  { poly: ["0,6 16,20 0,34", "#007a4d"] },
  { poly: ["0,12 9,20 0,28", "#000000"] },
];

/** One spec per planned-language id. Shared flags are aliased below. */
const FLAGS: Record<string, Layer[]> = {
  // English is drawn here with everything else rather than as its own CSS
  // gradient beside the switcher. Drawn separately it came out a different
  // size, without the surface-coloured ring the rest have, and looked like a
  // flag from another set sitting in the same list.
  //
  // The Union Jack is the full construction, because the simplified two-cross
  // version is recognisably not the flag: white diagonals, red counter-charged
  // diagonals offset the way they really are, then the cross over the top.
  "english-uk": [
    { h: ["#012169"] },
    { poly: ["0,0 8,0 60,35 60,40 52,40 0,5", "#ffffff"] },
    { poly: ["52,0 60,0 60,5 8,40 0,40 0,35", "#ffffff"] },
    { poly: ["0,0 4,0 60,37 60,40 56,40 0,3", "#c8102e"] },
    { poly: ["56,0 60,0 60,3 4,40 0,40 0,37", "#c8102e"] },
    { rect: [0, 14, 60, 12, "#ffffff"] },
    { rect: [24, 0, 12, 40, "#ffffff"] },
    { rect: [0, 16.5, 60, 7, "#c8102e"] },
    { rect: [26.5, 0, 7, 40, "#c8102e"] },
  ],
  // Thirteen stripes and a canton. The stars are left out on purpose: at 32px
  // they turn into noise, and the canton alone is what makes it readable.
  "english-us": [
    { h: ["#b22234", "#ffffff", "#b22234", "#ffffff", "#b22234", "#ffffff", "#b22234",
          "#ffffff", "#b22234", "#ffffff", "#b22234", "#ffffff", "#b22234"] },
    { rect: [0, 0, 24, 21.6, "#3c3b6e"] },
  ],
  italian: [{ v: ["#009246", "#ffffff", "#ce2b37"] }],
  portuguese: [{ v: ["#046a38", "#da291c"], r: [2, 3] }, { c: [24, 20, 6.5, "#ffe600"] }, { c: [24, 20, 3.2, "#da291c"] }],
  dutch: [{ h: ["#ae1c28", "#ffffff", "#21468b"] }],
  polish: [{ h: ["#ffffff", "#dc143c"] }],
  russian: [{ h: ["#ffffff", "#0039a6", "#d52b1e"] }],
  ukrainian: [{ h: ["#0057b7", "#ffd700"] }],
  czech: [{ h: ["#ffffff", "#d7141a"] }, { poly: ["0,0 30,20 0,40", "#11457e"] }],
  slovak: [{ h: ["#ffffff", "#0b4ea2", "#ee1c25"] }],
  hungarian: [{ h: ["#ce2939", "#ffffff", "#477050"] }],
  romanian: [{ v: ["#002b7f", "#fcd116", "#ce1126"] }],
  bulgarian: [{ h: ["#ffffff", "#00966e", "#d62612"] }],
  greek: [
    { h: ["#0d5eaf", "#ffffff", "#0d5eaf", "#ffffff", "#0d5eaf", "#ffffff", "#0d5eaf", "#ffffff", "#0d5eaf"] },
    { rect: [0, 0, 22, 22.5, "#0d5eaf"] },
    { rect: [9, 0, 4, 22.5, "#ffffff"] },
    { rect: [0, 9.2, 22, 4, "#ffffff"] },
  ],
  turkish: [{ rect: [0, 0, 60, 40, "#e30a17"] }, { c: [24, 20, 10, "#ffffff"] }, { c: [26.5, 20, 8, "#e30a17"] }, { star: [37, 20, 4.5, "#ffffff"] }],
  swedish: [{ rect: [0, 0, 60, 40, "#006aa7"] }, { cross: ["#fecc02", 7] }],
  norwegian: [{ rect: [0, 0, 60, 40, "#ba0c2f"] }, { cross: ["#ffffff", 10] }, { cross: ["#00205b", 5] }],
  danish: [{ rect: [0, 0, 60, 40, "#c8102e"] }, { cross: ["#ffffff", 6] }],
  finnish: [{ rect: [0, 0, 60, 40, "#ffffff"] }, { cross: ["#002f6c", 8] }],
  icelandic: [{ rect: [0, 0, 60, 40, "#02529c"] }, { cross: ["#ffffff", 10] }, { cross: ["#dc1e35", 5] }],
  irish: [{ v: ["#169b62", "#ffffff", "#ff883e"] }],
  // The dragon is beyond a 32px roundel — the white-over-green field with a
  // stylised red silhouette keeps it recognisably Wales without a wrong dragon.
  welsh: [{ h: ["#ffffff", "#3f9c35"] }, { poly: ["14,16 22,11 28,15 25,17 38,15 44,20 36,24 26,26 18,23 12,25 16,20", "#d30731"] }],
  "scottish-gaelic": [
    { rect: [0, 0, 60, 40, "#005eb8"] },
    { poly: ["0,0 8,0 60,34 60,40 52,40 0,6", "#ffffff"] },
    { poly: ["60,0 60,6 8,40 0,40 0,34 52,0", "#ffffff"] },
  ],
  croatian: [
    { h: ["#ff0000", "#ffffff", "#171796"] },
    { rect: [24, 10, 12, 12, "#ff0000"] },
    { rect: [24, 10, 4, 4, "#ffffff"] }, { rect: [32, 10, 4, 4, "#ffffff"] },
    { rect: [28, 14, 4, 4, "#ffffff"] },
    { rect: [24, 18, 4, 4, "#ffffff"] }, { rect: [32, 18, 4, 4, "#ffffff"] },
  ],
  serbian: [{ h: ["#c6363c", "#0c4076", "#ffffff"] }],
  bosnian: [
    { rect: [0, 0, 60, 40, "#002395"] },
    { poly: ["22,0 48,0 48,40", "#fecb00"] },
    { star: [18, 5, 2.6, "#ffffff"] }, { star: [24, 13, 2.6, "#ffffff"] },
    { star: [30, 21, 2.6, "#ffffff"] }, { star: [36, 29, 2.6, "#ffffff"] }, { star: [42, 37, 2.6, "#ffffff"] },
  ],
  slovenian: [{ h: ["#ffffff", "#005da4", "#ed1c24"] }],
  albanian: [
    { rect: [0, 0, 60, 40, "#e41e20"] },
    { poly: ["30,8 26,12 20,10 25,16 18,20 25,22 22,28 28,24 30,32 32,24 38,28 35,22 42,20 35,16 40,10 34,12", "#000000"] },
  ],
  macedonian: [
    { rect: [0, 0, 60, 40, "#d20000"] },
    { poly: ["30,20 0,0 12,0", "#ffe600"] }, { poly: ["30,20 26,0 34,0", "#ffe600"] }, { poly: ["30,20 48,0 60,0", "#ffe600"] },
    { poly: ["30,20 60,14 60,26", "#ffe600"] }, { poly: ["30,20 0,14 0,26", "#ffe600"] },
    { poly: ["30,20 0,40 12,40", "#ffe600"] }, { poly: ["30,20 26,40 34,40", "#ffe600"] }, { poly: ["30,20 48,40 60,40", "#ffe600"] },
    { c: [30, 20, 7, "#ffe600"] }, { ring: [30, 20, 7, "#d20000", 1.2] },
  ],
  lithuanian: [{ h: ["#fdb913", "#006a44", "#c1272d"] }],
  latvian: [{ h: ["#9e3039", "#ffffff", "#9e3039"], r: [2, 1, 2] }],
  estonian: [{ h: ["#0072ce", "#000000", "#ffffff"] }],
  catalan: [{ h: ["#fcdd09", "#da121a", "#fcdd09", "#da121a", "#fcdd09", "#da121a", "#fcdd09", "#da121a", "#fcdd09"] }],
  basque: [
    { rect: [0, 0, 60, 40, "#d52b1e"] },
    { poly: ["0,0 6,0 60,36 60,40 54,40 0,4", "#009b48"] },
    { poly: ["60,0 60,4 6,40 0,40 0,36 54,0", "#009b48"] },
    { rect: [27, 0, 6, 40, "#ffffff"] },
    { rect: [0, 17, 60, 6, "#ffffff"] },
  ],
  galician: [
    { rect: [0, 0, 60, 40, "#ffffff"] },
    { poly: ["0,0 14,0 60,26 60,40 46,40 0,14", "#0072c6"] },
  ],
  maltese: [{ v: ["#ffffff", "#cf142b"] }, { rect: [4, 3, 8, 8, "#9ca3af"] }, { rect: [7, 3, 2, 8, "#ffffff"] }, { rect: [4, 6, 8, 2, "#ffffff"] }],
  // Green with the white band standing in for the shahada and sword.
  arabic: [{ rect: [0, 0, 60, 40, "#165d31"] }, { rect: [12, 15, 36, 4, "#ffffff"] }, { rect: [12, 23, 26, 2.5, "#ffffff"] }],
  hebrew: [
    { rect: [0, 0, 60, 40, "#ffffff"] },
    { rect: [0, 4, 60, 5, "#0038b8"] }, { rect: [0, 31, 60, 5, "#0038b8"] },
    { poly: ["30,12 36.5,23 23.5,23", "#0038b8"] },
    { poly: ["30,28 23.5,17 36.5,17", "#0038b8"] },
    { poly: ["30,14.5 35,22 25,22", "#ffffff"] },
    { poly: ["30,25.5 25,18 35,18", "#ffffff"] },
  ],
  persian: [{ h: ["#239f40", "#ffffff", "#da0000"] }],
  kurdish: [{ h: ["#ed2024", "#ffffff", "#278e43"] }, { c: [30, 20, 6.5, "#febd11"] }],
  georgian: [
    { rect: [0, 0, 60, 40, "#ffffff"] },
    { cross: ["#ff0000", 8] },
    { rect: [8, 7, 6, 2, "#ff0000"] }, { rect: [10, 5, 2, 6, "#ff0000"] },
    { rect: [38, 7, 6, 2, "#ff0000"] }, { rect: [40, 5, 2, 6, "#ff0000"] },
    { rect: [8, 31, 6, 2, "#ff0000"] }, { rect: [10, 29, 2, 6, "#ff0000"] },
    { rect: [38, 31, 6, 2, "#ff0000"] }, { rect: [40, 29, 2, 6, "#ff0000"] },
  ],
  armenian: [{ h: ["#d90012", "#0033a0", "#f2a800"] }],
  kazakh: [{ rect: [0, 0, 60, 40, "#00afca"] }, { c: [30, 16, 7, "#fec50c"] }, { rect: [8, 30, 44, 3, "#fec50c"] }],
  uzbek: [
    { h: ["#0099b5", "#ffffff", "#1eb53a"] },
    { rect: [0, 12.8, 60, 1.2, "#ce1126"] }, { rect: [0, 26, 60, 1.2, "#ce1126"] },
    { c: [12, 7, 4, "#ffffff"] }, { c: [14, 7, 3.2, "#0099b5"] },
  ],
  azerbaijani: [
    { h: ["#0092bc", "#e4002b", "#00af66"] },
    { c: [27, 20, 5, "#ffffff"] }, { c: [29, 20, 4, "#e4002b"] }, { star: [36, 20, 3, "#ffffff"] },
  ],
  hindi: INDIA,
  urdu: [
    { rect: [0, 0, 60, 40, "#01411c"] },
    { rect: [0, 0, 15, 40, "#ffffff"] },
    { c: [36, 20, 9, "#ffffff"] }, { c: [39, 18, 8, "#01411c"] }, { star: [43, 14, 3.4, "#ffffff"] },
  ],
  bengali: [{ rect: [0, 0, 60, 40, "#006a4e"] }, { c: [27, 20, 10, "#f42a41"] }],
  punjabi: INDIA,
  gujarati: INDIA,
  marathi: INDIA,
  tamil: INDIA,
  telugu: INDIA,
  kannada: INDIA,
  malayalam: INDIA,
  nepali: [
    { rect: [0, 0, 60, 40, "#ffffff"] },
    { poly: ["14,2 46,20 14,20", "#003893"] }, { poly: ["14,20 50,38 14,38", "#003893"] },
    { poly: ["16,5 41,20 16,20", "#dc143c"] }, { poly: ["16,22 45,36 16,36", "#dc143c"] },
    { c: [24, 13, 2.6, "#ffffff"] }, { c: [24, 28, 3.2, "#ffffff"] },
  ],
  sinhala: [
    { rect: [0, 0, 60, 40, "#ffb700"] },
    { rect: [3, 3, 12, 34, "#005f56"] },
    { rect: [15, 3, 8, 34, "#eb7400"] },
    { rect: [26, 3, 31, 34, "#8d2029"] },
    { rect: [36, 12, 12, 16, "#ffb700"] },
  ],
  thai: [{ h: ["#a51931", "#f4f5f8", "#2d2a4a", "#f4f5f8", "#a51931"], r: [1, 1, 2, 1, 1] }],
  vietnamese: [{ rect: [0, 0, 60, 40, "#da251d"] }, { star: [30, 20, 9, "#ffff00"] }],
  khmer: [
    { h: ["#032ea1", "#e00025", "#032ea1"], r: [1, 2, 1] },
    { rect: [22, 16, 4, 10, "#ffffff"] }, { rect: [28, 13, 4, 13, "#ffffff"] }, { rect: [34, 16, 4, 10, "#ffffff"] },
  ],
  lao: [{ h: ["#ce1126", "#002868", "#ce1126"], r: [1, 2, 1] }, { c: [30, 20, 7, "#ffffff"] }],
  burmese: [{ h: ["#fecb00", "#34b233", "#ea2839"] }, { star: [30, 20, 10, "#ffffff"] }],
  indonesian: [{ h: ["#e70011", "#ffffff"] }],
  malay: [
    { h: ["#cc0001", "#ffffff", "#cc0001", "#ffffff", "#cc0001", "#ffffff", "#cc0001"] },
    { rect: [0, 0, 27, 22, "#010066"] },
    { c: [10, 11, 6, "#ffcc00"] }, { c: [12.5, 11, 5, "#010066"] }, { star: [19, 11, 3.6, "#ffcc00"] },
  ],
  filipino: [
    { h: ["#0038a8", "#ce1126"] },
    { poly: ["0,0 26,20 0,40", "#ffffff"] },
    { c: [9, 20, 4, "#fcd116"] },
  ],
  mandarin: [{ rect: [0, 0, 60, 40, "#de2910"] }, { star: [12, 12, 6, "#ffde00"] }, { star: [22, 5, 2, "#ffde00"] }, { star: [25, 11, 2, "#ffde00"] }, { star: [25, 18, 2, "#ffde00"] }, { star: [22, 24, 2, "#ffde00"] }],
  cantonese: [
    { rect: [0, 0, 60, 40, "#de2910"] },
    { c: [30, 14, 3.4, "#ffffff"] }, { c: [36, 18, 3.4, "#ffffff"] }, { c: [34, 25, 3.4, "#ffffff"] },
    { c: [26, 25, 3.4, "#ffffff"] }, { c: [24, 18, 3.4, "#ffffff"] }, { c: [30, 20, 3.4, "#ffffff"] },
  ],
  japanese: [{ rect: [0, 0, 60, 40, "#ffffff"] }, { c: [30, 20, 9, "#bc002d"] }],
  korean: [
    { rect: [0, 0, 60, 40, "#ffffff"] },
    { c: [30, 20, 9, "#cd2e3a"] },
    { path: ["M21,20 A9,9 0 0 0 39,20 Z", "#0047a0"] },
    { c: [25.5, 20, 4.5, "#cd2e3a"] },
    { c: [34.5, 20, 4.5, "#0047a0"] },
  ],
  swahili: [{ h: ["#000000", "#ffffff", "#922529", "#ffffff", "#008c51"], r: [6, 1, 6, 1, 6] }],
  amharic: [{ h: ["#078930", "#fcdd09", "#da121a"] }, { c: [30, 20, 7, "#0f47af"] }, { star: [30, 20, 4.5, "#fcdd09"] }],
  yoruba: NIGERIA,
  igbo: NIGERIA,
  hausa: NIGERIA,
  zulu: SOUTH_AFRICA,
  xhosa: SOUTH_AFRICA,
  afrikaans: SOUTH_AFRICA,
  somali: [{ rect: [0, 0, 60, 40, "#4189dd"] }, { star: [30, 20, 9, "#ffffff"] }],
  mongolian: [{ v: ["#c4272f", "#015197", "#c4272f"] }],
  hawaiian: [
    { h: ["#ffffff", "#c8102e", "#00247d", "#ffffff", "#c8102e", "#00247d", "#ffffff", "#c8102e"] },
    ...UK_CANTON,
  ],
  maori: [
    { rect: [0, 0, 60, 40, "#012169"] },
    ...UK_CANTON,
    { star: [43, 9, 3, "#cc142b"] }, { star: [50, 16, 3, "#cc142b"] }, { star: [43, 24, 3, "#cc142b"] }, { star: [47, 32, 3, "#cc142b"] },
  ],
  latin: [
    { rect: [0, 0, 60, 40, "#f3ead8"] },
    { poly: ["18,13 42,13 30,5", "#8a7a5c"] },
    { rect: [24, 14, 3.5, 14, "#8a7a5c"] }, { rect: [28.5, 14, 3.5, 14, "#8a7a5c"] }, { rect: [33, 14, 3.5, 14, "#8a7a5c"] },
    { rect: [20, 29, 20, 3, "#8a7a5c"] },
  ],
  "ancient-greek": [
    { rect: [0, 0, 60, 40, "#e3ecf2"] },
    { poly: ["18,13 42,13 30,5", "#5b7186"] },
    { rect: [24, 14, 3.5, 14, "#5b7186"] }, { rect: [28.5, 14, 3.5, 14, "#5b7186"] }, { rect: [33, 14, 3.5, 14, "#5b7186"] },
    { rect: [20, 29, 20, 3, "#5b7186"] },
  ],
  esperanto: [
    { rect: [0, 0, 60, 40, "#009900"] },
    { rect: [0, 0, 22, 15, "#ffffff"] },
    { star: [11, 7.5, 5, "#009900"] },
  ],
  "sign-language": [
    { rect: [0, 0, 60, 40, "#4a5d8a"] },
    { c: [30, 26, 7, "#ffffff"] },
    { rect: [22.5, 12, 3.4, 12, "#ffffff"] }, { rect: [27, 9, 3.4, 15, "#ffffff"] },
    { rect: [31.5, 10, 3.4, 14, "#ffffff"] }, { rect: [36, 13, 3.4, 11, "#ffffff"] },
    { rect: [19, 22, 4, 3.4, "#ffffff"] },
  ],
};

export function hasFlagArt(id: string): boolean {
  return Boolean(FLAGS[id]);
}

export function FlagRoundel({ id }: { id: string }) {
  const layers = FLAGS[id];
  if (!layers) return <span aria-hidden="true" className="text-xl leading-none">🌍</span>;
  return (
    <span
      aria-hidden="true"
      className="block h-8 w-8 overflow-hidden rounded-full border-2 border-[var(--surface)] shadow-[0_2px_8px_rgba(20,20,20,0.18)]"
    >
      <svg className="h-full w-full" preserveAspectRatio="xMidYMid slice" viewBox="0 0 60 40">
        {layers.map((layer, i) => renderLayer(layer, i))}
      </svg>
    </span>
  );
}

export default FlagRoundel;
