import React from "react";

/**
 * A small bar-chart icon whose bars "dance" like an equalizer when an ancestor
 * with the `eq-host` class is hovered. Sits still (a clean bar chart) otherwise.
 * Color is inherited via `currentColor`; size via the passed className.
 * Animation + reduced-motion fallback live in index.css (.eq-bar / .eq-host).
 */
export function AnimatedBars({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" aria-hidden="true">
      <rect className="eq-bar" x="4.5"  y="12" width="3" height="8"  rx="1.4" fill="currentColor" style={{ animationDelay: "0ms" }} />
      <rect className="eq-bar" x="10.5" y="4"  width="3" height="16" rx="1.4" fill="currentColor" style={{ animationDelay: "130ms" }} />
      <rect className="eq-bar" x="16.5" y="8"  width="3" height="12" rx="1.4" fill="currentColor" style={{ animationDelay: "260ms" }} />
    </svg>
  );
}
