import { useEffect, useMemo, useState, type CSSProperties } from "react";

import type { CodexPet } from "@/lib/codexPets";

type CodexPetSpriteProps = {
  animation?: string;
  className?: string;
  pet: CodexPet;
  playbackKey?: number;
  size?: number;
};

export function CodexPetSprite({
  animation = "idle",
  className = "",
  pet,
  playbackKey = 0,
  size = 96,
}: CodexPetSpriteProps) {
  const requestedAnimation = pet.animations[animation] ? animation : "idle";
  const [activeAnimation, setActiveAnimation] = useState(requestedAnimation);
  const [frameIndex, setFrameIndex] = useState(0);

  useEffect(() => {
    setActiveAnimation(requestedAnimation);
    setFrameIndex(0);
  }, [requestedAnimation, playbackKey, pet.id, pet.source]);

  const definition = pet.animations[activeAnimation] ?? pet.animations.idle;
  const frames = definition?.frames?.length ? definition.frames : [0];

  useEffect(() => {
    if (frames.length <= 1 || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const interval = window.setInterval(() => {
      setFrameIndex((current) => {
        if (current + 1 < frames.length) return current + 1;
        if (definition.loop) return 0;
        window.clearInterval(interval);
        const fallback = definition.fallback && pet.animations[definition.fallback]
          ? definition.fallback
          : "idle";
        setActiveAnimation(fallback);
        return 0;
      });
    }, 1000 / Math.max(1, definition.fps || 1));

    return () => window.clearInterval(interval);
  }, [activeAnimation, definition.fallback, definition.fps, definition.loop, frames.length, pet.animations]);

  const frame = frames[Math.min(frameIndex, frames.length - 1)] ?? 0;
  const column = frame % pet.frame.columns;
  const row = Math.floor(frame / pet.frame.columns);
  const height = Math.round(size * (pet.frame.height / pet.frame.width));

  const style = useMemo<CSSProperties>(
    () => ({
      width: size,
      height,
      backgroundImage: `url("${pet.spritesheetUrl}")`,
      backgroundRepeat: "no-repeat",
      backgroundSize: `${pet.frame.columns * 100}% ${pet.frame.rows * 100}%`,
      backgroundPosition: `${
        pet.frame.columns > 1 ? (column / (pet.frame.columns - 1)) * 100 : 0
      }% ${
        pet.frame.rows > 1 ? (row / (pet.frame.rows - 1)) * 100 : 0
      }%`,
    }),
    [
      column,
      height,
      pet.frame.columns,
      pet.frame.rows,
      pet.spritesheetUrl,
      row,
      size,
    ]
  );

  return (
    <span
      aria-hidden="true"
      className={`block shrink-0 bg-transparent ${className}`}
      style={style}
    />
  );
}
