import { useEffect, useMemo, useRef, useState, type CSSProperties } from "react";

import type { CodexPet } from "@/lib/codexPets";

type CodexPetSpriteProps = {
  animation?: string;
  className?: string;
  pet: CodexPet;
  playbackKey?: number;
  size?: number;
};

const imageCache = new Map<string, Promise<HTMLImageElement>>();
const frameCache = new Map<string, ImageData>();

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
  pet,
  playbackKey = 0,
  size = 96,
}: CodexPetSpriteProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [canvasFailed, setCanvasFailed] = useState(false);
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

  useEffect(() => {
    setCanvasFailed(false);
  }, [pet.spritesheetUrl]);

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
          frameCache.set(cacheKey, imageData);
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
