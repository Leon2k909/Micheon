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
// Each entry is a full ImageData for one animation frame — width * height * 4
// bytes — so this is not a cheap map to let grow without limit across every pet
// the user tries. Oldest entries are evicted once it gets large.
const FRAME_CACHE_LIMIT = 240;
const frameCache = new Map<string, ImageData>();

function cacheFrame(key: string, value: ImageData) {
  if (frameCache.size >= FRAME_CACHE_LIMIT) {
    // Map iterates in insertion order, so the first key is the oldest.
    const oldest = frameCache.keys().next();
    if (!oldest.done) frameCache.delete(oldest.value);
  }
  frameCache.set(key, value);
}
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

function loadVisibleBounds(pet: CodexPet) {
  const frameCount = pet.frame.columns * pet.frame.rows;
  const frames = [...new Set(
    Object.values(pet.animations)
      .flatMap((definition) => definition.frames)
      .filter((frame) => frame >= 0 && frame < frameCount)
  )];
  if (!frames.length) frames.push(0);

  const cacheKey = [
    pet.spritesheetUrl,
    pet.frame.width,
    pet.frame.height,
    pet.frame.columns,
    pet.frame.rows,
    frames.join(","),
  ].join(":");
  const cached = visibleBoundsCache.get(cacheKey);
  if (cached) return cached;

  const promise = loadSpritesheet(pet.spritesheetUrl).then((image) => {
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

type AlphaComponent = {
  maxY: number;
  minY: number;
  pixels: number[];
};

/**
 * Custom pet generators occasionally leave a detached floor shadow or a small
 * duplicate fragment under a frame. Remove only lower fragments that are tiny
 * relative to the character body; effects beside and above the mascot remain.
 */
function removeDetachedLowerFragments(imageData: ImageData) {
  const { data, width, height } = imageData;
  const pixelCount = width * height;
  const visited = new Uint8Array(pixelCount);
  const queue = new Int32Array(pixelCount);
  const components: AlphaComponent[] = [];

  for (let start = 0; start < pixelCount; start += 1) {
    if (visited[start] || data[start * 4 + 3] < 12) continue;

    let head = 0;
    let tail = 0;
    let minY = height;
    let maxY = 0;
    const pixels: number[] = [];
    visited[start] = 1;
    queue[tail++] = start;

    while (head < tail) {
      const index = queue[head++];
      const x = index % width;
      const y = Math.floor(index / width);
      pixels.push(index);
      minY = Math.min(minY, y);
      maxY = Math.max(maxY, y);

      for (let yOffset = -1; yOffset <= 1; yOffset += 1) {
        for (let xOffset = -1; xOffset <= 1; xOffset += 1) {
          if (xOffset === 0 && yOffset === 0) continue;
          const nextX = x + xOffset;
          const nextY = y + yOffset;
          if (nextX < 0 || nextX >= width || nextY < 0 || nextY >= height) continue;
          const next = nextY * width + nextX;
          if (visited[next] || data[next * 4 + 3] < 12) continue;
          visited[next] = 1;
          queue[tail++] = next;
        }
      }
    }

    components.push({ maxY, minY, pixels });
  }

  const body = components.reduce<AlphaComponent | null>(
    (largest, component) => !largest || component.pixels.length > largest.pixels.length ? component : largest,
    null
  );
  if (!body || body.pixels.length < 32) return imageData;

  for (const component of components) {
    if (component === body) continue;
    const isSmall = component.pixels.length < body.pixels.length * 0.18;
    const isBelowBody = component.minY > body.maxY - Math.max(2, Math.round(height * 0.025));
    if (!isSmall || !isBelowBody) continue;
    for (const pixel of component.pixels) {
      data[pixel * 4 + 3] = 0;
    }
  }

  return imageData;
}

export function CodexPetSprite({
  animation = "idle",
  className = "",
  onVisibleBounds,
  pet,
  playbackKey = 0,
  size = 96,
}: CodexPetSpriteProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const visibleBoundsCallback = useRef(onVisibleBounds);
  const [canvasFailed, setCanvasFailed] = useState(false);
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

    // Only animate while the window is actually on screen.
    //
    // The desktop overlay is created with backgroundThrottling disabled, which
    // means Chromium does NOT slow this timer down when the window is hidden or
    // covered. Without this check every pet kept redrawing its spritesheet at
    // full frame rate for as long as the app was running — including while the
    // pet was switched off and its window hidden — which is real, permanent CPU
    // and GPU load for something nobody can see.
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
  const height = Math.round(size * (pet.frame.height / pet.frame.width));

  useEffect(() => {
    setCanvasFailed(false);
    setLoadRetry(0);
  }, [pet]);

  useEffect(() => {
    if (!canvasFailed || loadRetry >= 6) return undefined;
    const timer = window.setTimeout(() => {
      setLoadRetry((current) => current + 1);
      setCanvasFailed(false);
    }, Math.min(10000, 500 * 2 ** loadRetry));
    return () => window.clearTimeout(timer);
  }, [canvasFailed, loadRetry]);

  useEffect(() => {
    let cancelled = false;
    const canvas = canvasRef.current;
    if (!canvas) return undefined;

    const context = canvas.getContext("2d", { willReadFrequently: true });
    if (!context) {
      setCanvasFailed(true);
      return undefined;
    }

    const cacheKey = [
      pet.spritesheetUrl,
      pet.frame.width,
      pet.frame.height,
      pet.frame.columns,
      frame,
    ].join(":");

    const paint = async () => {
      try {
        let imageData = frameCache.get(cacheKey);
        if (!imageData) {
          const image = await loadSpritesheet(pet.spritesheetUrl);
          if (cancelled) return;
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
          imageData = removeDetachedLowerFragments(
            context.getImageData(0, 0, pet.frame.width, pet.frame.height)
          );
          cacheFrame(cacheKey, imageData);
        }
        if (cancelled) return;
        context.clearRect(0, 0, pet.frame.width, pet.frame.height);
        context.putImageData(imageData, 0, 0);
        setCanvasFailed(false);
      } catch {
        if (!cancelled) setCanvasFailed(true);
      }
    };

    void paint();
    return () => {
      cancelled = true;
    };
  }, [
    column,
    canvasFailed,
    frame,
    loadRetry,
    pet.frame.columns,
    pet.frame.height,
    pet.frame.width,
    pet.spritesheetUrl,
    row,
  ]);

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
    canvasFailed ? (
      <span
        aria-hidden="true"
        className={`block shrink-0 bg-transparent ${className}`}
        style={style}
      />
    ) : (
      <canvas
        ref={canvasRef}
        aria-hidden="true"
        className={`block shrink-0 bg-transparent ${className}`}
        height={pet.frame.height}
        style={{ height, width: size }}
        width={pet.frame.width}
      />
    )
  );
}
