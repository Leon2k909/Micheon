import React, { useId } from "react";

/**
 * Micheon brand mark — a gradient "M" monogram with a teardrop centre.
 * The gradient reads on both light and dark backgrounds, so one component
 * serves both themes. `MicheonWordmark` renders "MICHEON" with the signature
 * three-bar "E"; its letters use the current text colour so they invert with
 * the theme automatically.
 */

export function MicheonMark({
  size = 64,
  className,
}: {
  size?: number;
  className?: string;
}) {
  const id = useId().replace(/:/g, "");
  const grad = `micheon-grad-${id}`;
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 92"
      fill="none"
      className={className}
      role="img"
      aria-label="Micheon"
    >
      <defs>
        <linearGradient id={grad} x1="8" y1="46" x2="92" y2="46" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#22B6F5" />
          <stop offset="0.5" stopColor="#5A6CF0" />
          <stop offset="1" stopColor="#A64DF7" />
        </linearGradient>
      </defs>
      <path
        d="M15 80 L15 27 C15 16 31 16 35 26 L46 51 C47 67 53 67 54 51 L65 26 C69 16 85 16 85 27 L85 80"
        stroke={`url(#${grad})`}
        strokeWidth="12"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function MicheonWordmark({
  className,
  height = 26,
}: {
  className?: string;
  height?: number;
}) {
  const id = useId().replace(/:/g, "");
  const grad = `micheon-word-grad-${id}`;
  const barW = height * 0.62;
  const barH = height * 0.13;
  const gap = height * 0.14;
  return (
    <span
      className={className}
      style={{
        display: "inline-flex",
        alignItems: "center",
        fontSize: height,
        fontWeight: 700,
        letterSpacing: "0.14em",
        lineHeight: 1,
        color: "currentColor",
      }}
    >
      MICH
      {/* Signature equalizer "E": three gradient bars */}
      <span
        aria-hidden
        style={{
          display: "inline-flex",
          flexDirection: "column",
          justifyContent: "center",
          gap,
          margin: "0 0.16em",
          transform: "translateY(-2%)",
        }}
      >
        <svg width={barW} height={height * 0.62} viewBox={`0 0 ${barW} ${height * 0.62}`} aria-hidden>
          <defs>
            <linearGradient id={grad} x1="0" y1="0" x2={barW} y2="0" gradientUnits="userSpaceOnUse">
              <stop offset="0" stopColor="#22B6F5" />
              <stop offset="1" stopColor="#A64DF7" />
            </linearGradient>
          </defs>
          {[0, 1, 2].map((i) => (
            <rect
              key={i}
              x="0"
              y={i * (barH + gap)}
              width={barW}
              height={barH}
              rx={barH / 2}
              fill={`url(#${grad})`}
            />
          ))}
        </svg>
      </span>
      ON
    </span>
  );
}

/** Monogram + wordmark stacked, for splash / login. */
export function MicheonLogo({
  markSize = 72,
  wordHeight = 26,
  className,
}: {
  markSize?: number;
  wordHeight?: number;
  className?: string;
}) {
  return (
    <div className={className} style={{ display: "inline-flex", flexDirection: "column", alignItems: "center", gap: markSize * 0.14 }}>
      <MicheonMark size={markSize} />
      <MicheonWordmark height={wordHeight} />
    </div>
  );
}
