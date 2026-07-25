import { useEffect, useMemo, useRef, useState, type CSSProperties } from "react";

import type { CodexPet } from "@/lib/codexPets";

type CodexPetSpriteProps = {
  animation?: string;
  className?: string;
  onVisibleBounds?: (bounds: CodexPetVisibleBounds) => void;
  pet: CodexPet;
  playbackKey?: number;
  size?: number;
};

export type CodexPetVisibleBounds = {
  bottom: number;
  left: number;
  right: number;
  top: number;
};

const imageCache = new Map<string, Promise<HTMLImageElement>>();
const visibleBoundsCache = new Map<string, Promise<CodexPetVisibleBounds>>();

function loadSpritesheet(url: string) {
  const cached = imageCache.get(url);
  if (cached) return cached;

  const promise = new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new Image();
    image.crossOrigin = "anonymous";
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error(`Unable to load mascot spritesheet: ${url}`));
    image.src = url;
  });
  imageCache.set(url, promise);
  void promise.catch(() => {
    // A rejected promise must not poison this URL for the renderer's entire
    // lifetime. The next bounded sprite retry should perform a real request.
    if (imageCache.get(url) === promise) imageCache.delete(url);
  });
  return promise;
}

function loadVisibleBounds(pet: CodexPet, spritesheetUrl = pet.spritesheetUrl) {
  const frameCount = pet.frame.columns * pet.frame.rows;
  // Bounds are used only to let the pet reach the physical screen edges. The
  // idle row represents its normal silhouette, so reading that row is enough
  // and avoids decoding/scanning every animation frame during app startup.
  const idleFrames = pet.animations.idle?.frames ?? [];
  const frames = [...new Set(
    idleFrames
      .filter((frame) => frame >= 0 && frame < frameCount)
  )];
  if (!frames.length) frames.push(0);

  const cacheKey = [
    spritesheetUrl,
    pet.frame.width,
    pet.frame.height,
    pet.frame.columns,
    pet.frame.rows,
    frames.join(","),
  ].join(":");
  const cached = visibleBoundsCache.get(cacheKey);
  if (cached) return cached;

  const promise = loadSpritesheet(spritesheetUrl).then((image) => {
    const canvas = document.createElement("canvas");
    canvas.width = pet.frame.width;
    canvas.height = pet.frame.height;
    const context = canvas.getContext("2d", { willReadFrequently: true });
    if (!context) return { bottom: 1, left: 0, right: 1, top: 0 };

    let minX = pet.frame.width;
    let minY = pet.frame.height;
    let maxX = -1;
    let maxY = -1;
    for (const frame of frames) {
      const column = frame % pet.frame.columns;
      const row = Math.floor(frame / pet.frame.columns);
      context.clearRect(0, 0, pet.frame.width, pet.frame.height);
      context.drawImage(
        image,
        column * pet.frame.width,
        row * pet.frame.height,
        pet.frame.width,
        pet.frame.height,
        0,
        0,
        pet.frame.width,
        pet.frame.height
      );
      const { data } = context.getImageData(0, 0, pet.frame.width, pet.frame.height);
      for (let y = 0; y < pet.frame.height; y += 1) {
        for (let x = 0; x < pet.frame.width; x += 1) {
          if (data[(y * pet.frame.width + x) * 4 + 3] < 12) continue;
          minX = Math.min(minX, x);
          minY = Math.min(minY, y);
          maxX = Math.max(maxX, x);
          maxY = Math.max(maxY, y);
        }
      }
    }

    if (maxX < minX || maxY < minY) return { bottom: 1, left: 0, right: 1, top: 0 };
    return {
      bottom: (maxY + 1) / pet.frame.height,
      left: minX / pet.frame.width,
      right: (maxX + 1) / pet.frame.width,
      top: minY / pet.frame.height,
    };
  });
  visibleBoundsCache.set(cacheKey, promise);
  void promise.catch(() => {
    if (visibleBoundsCache.get(cacheKey) === promise) visibleBoundsCache.delete(cacheKey);
  });
  return promise;
}

export function CodexPetSprite({
  animation = "idle",
  className = "",
  onVisibleBounds,
  pet,
  playbackKey = 0,
  size = 96,
}: CodexPetSpriteProps) {
  const visibleBoundsCallback = useRef(onVisibleBounds);
  const [loadRetry, setLoadRetry] = useState(0);
  const requestedAnimation = pet.animations[animation] ? animation : "idle";
  const [activeAnimation, setActiveAnimation] = useState(requestedAnimation);
  const [frameIndex, setFrameIndex] = useState(0);

  useEffect(() => {
    setActiveAnimation(requestedAnimation);
    setFrameIndex(0);
  }, [requestedAnimation, playbackKey, pet.id, pet.source]);

  const definition = pet.animations[activeAnimation] ?? pet.animations.idle;
  const frames = definition?.frames?.length ? definition.frames : [0];

  visibleBoundsCallback.current = onVisibleBounds;

  useEffect(() => {
    let cancelled = false;
    void loadVisibleBounds(pet)
      .then((bounds) => {
        if (!cancelled) visibleBoundsCallback.current?.(bounds);
      })
      .catch(() => {
        if (!cancelled) {
          visibleBoundsCallback.current?.({ bottom: 1, left: 0, right: 1, top: 0 });
        }
      });
    return () => {
      cancelled = true;
    };
  }, [loadRetry, pet]);

  useEffect(() => {
    if (frames.length <= 1 || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let interval = 0;
    const tick = () => {
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
    };

    // Pause immediately when Electron hides the overlay. Chromium's normal
    // background throttling is also enabled in the main process as a second
    // guard, so an invisible mascot cannot keep waking the renderer.
    const start = () => {
      if (interval) return;
      interval = window.setInterval(tick, 1000 / Math.max(1, definition.fps || 1));
    };
    const stop = () => {
      if (!interval) return;
      window.clearInterval(interval);
      interval = 0;
    };
    const onVisibility = () => (document.hidden ? stop() : start());

    if (!document.hidden) start();
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      document.removeEventListener("visibilitychange", onVisibility);
      stop();
    };
  }, [activeAnimation, definition.fallback, definition.fps, definition.loop, frames.length, pet.animations]);

  const frame = frames[Math.min(frameIndex, frames.length - 1)] ?? 0;
  const column = frame % pet.frame.columns;
  const row = Math.floor(frame / pet.frame.columns);
  const height = size * (pet.frame.height / pet.frame.width);
  const spritesheetUrl = useMemo(() => {
    if (loadRetry === 0) return pet.spritesheetUrl;
    const separator = pet.spritesheetUrl.includes("?") ? "&" : "?";
    return `${pet.spritesheetUrl}${separator}petRetry=${loadRetry}`;
  }, [loadRetry, pet.spritesheetUrl]);

  useEffect(() => {
    setLoadRetry(0);
  }, [pet.spritesheetUrl]);

  useEffect(() => {
    let cancelled = false;
    let timer = 0;
    void loadSpritesheet(spritesheetUrl).catch(() => {
      if (cancelled || loadRetry >= 6) return;
      timer = window.setTimeout(
        () => setLoadRetry((current) => current + 1),
        Math.min(10000, 500 * 2 ** loadRetry)
      );
    });
    return () => {
      cancelled = true;
      if (timer) window.clearTimeout(timer);
    };
  }, [loadRetry, spritesheetUrl]);

  const style = useMemo<CSSProperties>(
    () => ({
      width: size,
      height,
      backgroundImage: `url("${spritesheetUrl}")`,
      backgroundRepeat: "no-repeat",
      // Scale from the atlas's intrinsic aspect ratio and use exact cell-sized
      // offsets. This clips one 192x208 frame even if an old catalog reports a
      // v2 8x11 atlas as the legacy nine-row format.
      backgroundSize: `${pet.frame.columns * size}px auto`,
      backgroundPosition: `${-column * size}px ${-row * height}px`,
      contain: "strict",
      imageRendering: "auto",
    }),
    [
      column,
      height,
      pet.frame.columns,
      row,
      size,
      spritesheetUrl,
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
