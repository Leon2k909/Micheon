import React, { useState } from "react";

/**
 * Micheon brand lockup. Renders the bundled logo image for the given
 * background (dark vs light). Until the image files exist at
 * public/micheon-dark.png and public/micheon-light.png it falls back to a
 * plain wordmark, so nothing breaks before the art is dropped in.
 */
export function MicheonLogo({
  theme = "dark",
  height,
  className,
  style,
}: {
  theme?: "dark" | "light";
  height?: number;
  className?: string;
  style?: React.CSSProperties;
}) {
  const [failed, setFailed] = useState(false);
  const src = theme === "light" ? "/micheon-light.png" : "/micheon-dark.png";

  if (failed) {
    return (
      <span
        className={className}
        style={{
          fontWeight: 800,
          letterSpacing: "0.16em",
          fontSize: height ? Math.round(height * 0.32) : 22,
          ...style,
        }}
      >
        MICHEON
      </span>
    );
  }

  return (
    <img
      src={src}
      alt="Micheon"
      className={className}
      style={{ height: height ?? "auto", width: "auto", maxWidth: "100%", ...style }}
      onError={() => setFailed(true)}
    />
  );
}
