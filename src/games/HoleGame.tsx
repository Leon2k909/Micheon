import React, { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Clock, Maximize, Minimize, RotateCcw, Trophy } from "lucide-react";
import { recordWordMastery } from "@/lib/mastery";
import { useGameContent } from "@/games/gameContent";
import { ui } from "@/lib/i18n";
import {
  areaForRadius,
  buildCity,
  canSwallow,
  makeRandom,
  propPoints,
  radiusForArea,
  zoomForRadius,
  type CityProp,
} from "@/games/holeCity";

/**
 * Hole — the one that is supposed to feel like hole.io.
 *
 * The old version had the physics roughly right and the FEEL entirely wrong,
 * for three reasons, all of them here on purpose now:
 *
 * 1. THE CAMERA ZOOMS. It used to follow at 1:1 forever, so a hole at its
 *    maximum radius was 800 pixels across on a 900 pixel canvas and you could
 *    not see anything you were about to eat. Zoom is what makes growing
 *    legible: the hole stays roughly the same size on screen and the world
 *    gets smaller around it.
 *
 * 2. THINGS FALL IN. They used to shrink and fade where they stood, drawn ON
 *    TOP of the hole, so they evaporated above a black disc. Now they tip,
 *    slide toward the middle, spin, and are drawn CLIPPED INSIDE the hole so
 *    they disappear under its rim. That one detail is most of the game.
 *
 * 3. IT IS A CITY. Roads, blocks, pavements and traffic, generated in
 *    holeCity.ts, instead of props sprinkled over infinite graph paper.
 *
 * Plus the thing that makes it a game rather than a toy: a two minute clock
 * and a live leaderboard, so there is something to lose.
 */

const WORLD_SIZE = 4200;
const ROAD_STEP = 340;
const ROAD_WIDTH = 96;
const START_RADIUS = 22;
const MAX_RADIUS = 460;
const ROUND_SECONDS = 120;
const BOT_COUNT = 5;
const PLAYER_SPEED = 210;
const BOT_SPEED = 150;
const POINTER_DEADZONE = 22;
/** How many pixels of hole we want on screen, whatever the world radius is. */
const TARGET_SCREEN_RADIUS = 62;
const MIN_ZOOM = 0.2;
const MAX_ZOOM = 1.9;
const FALL_SECONDS = 0.42;

type Hole = {
  id: number;
  x: number;
  y: number;
  radius: number;
  area: number;
  score: number;
  name: string;
  colour: string;
  isPlayer: boolean;
  angle: number;
  /** Bots steer toward a target and re-pick when they arrive or time out. */
  targetX: number;
  targetY: number;
  repickAt: number;
};

const BOT_NAMES = ["Loch", "Krater", "Abgrund", "Schlund", "Grube"];
const BOT_COLOURS = ["#7c3aed", "#0891b2", "#be123c", "#15803d", "#b45309"];

export default function HoleGame() {
  const { learningDirection } = useGameContent();
  const learnsEnglish = learningDirection === "learn-en";

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const [phase, setPhase] = useState<"idle" | "playing" | "over">("idle");
  const [score, setScore] = useState(0);
  const [rank, setRank] = useState(1);
  const [secondsLeft, setSecondsLeft] = useState(ROUND_SECONDS);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [lastEaten, setLastEaten] = useState<{ de: string; en: string } | null>(null);
  const [board, setBoard] = useState<{ name: string; score: number; isPlayer: boolean; colour: string }[]>([]);
  const [best, setBest] = useState(() => {
    try { return parseInt(localStorage.getItem("hole-hs") ?? "0", 10) || 0; } catch { return 0; }
  });

  const propsRef = useRef<CityProp[]>([]);
  const holesRef = useRef<Hole[]>([]);
  const cameraRef = useRef({ x: WORLD_SIZE / 2, y: WORLD_SIZE / 2, zoom: 1 });
  const viewRef = useRef({ w: 900, h: 600, dpr: 1 });
  const pointerRef = useRef({ x: 0, y: 0, active: false });
  const keysRef = useRef(new Set<string>());
  const frameRef = useRef<number | null>(null);
  const lastFrameRef = useRef(0);
  const endsAtRef = useRef(0);
  const hudRef = useRef({ seconds: -1, rank: -1, boardAt: 0 });
  const scoreRef = useRef(0);

  // ── Setup ────────────────────────────────────────────────────────────────
  const reset = useCallback(() => {
    const seed = Math.floor(Math.random() * 1_000_000);
    const city = buildCity({ size: WORLD_SIZE, roadStep: ROAD_STEP, roadWidth: ROAD_WIDTH, seed });
    propsRef.current = city.props;

    const random = makeRandom(seed ^ 0x5f3a);
    const player: Hole = {
      id: 0,
      x: WORLD_SIZE / 2,
      y: WORLD_SIZE / 2,
      radius: START_RADIUS,
      area: areaForRadius(START_RADIUS),
      score: 0,
      name: "Du",
      colour: "#0f172a",
      isPlayer: true,
      angle: 0,
      targetX: 0,
      targetY: 0,
      repickAt: 0,
    };
    const bots: Hole[] = Array.from({ length: BOT_COUNT }, (_, index) => {
      const angle = (index / BOT_COUNT) * Math.PI * 2;
      const distance = WORLD_SIZE * 0.3;
      return {
        id: index + 1,
        x: WORLD_SIZE / 2 + Math.cos(angle) * distance,
        y: WORLD_SIZE / 2 + Math.sin(angle) * distance,
        radius: START_RADIUS * (0.9 + random() * 0.35),
        area: areaForRadius(START_RADIUS),
        score: 0,
        name: BOT_NAMES[index % BOT_NAMES.length],
        colour: BOT_COLOURS[index % BOT_COLOURS.length],
        isPlayer: false,
        angle: 0,
        targetX: WORLD_SIZE / 2,
        targetY: WORLD_SIZE / 2,
        repickAt: 0,
      };
    });
    bots.forEach((bot) => { bot.area = areaForRadius(bot.radius); });

    holesRef.current = [player, ...bots];
    cameraRef.current = { x: player.x, y: player.y, zoom: zoomForRadius(START_RADIUS, TARGET_SCREEN_RADIUS, MIN_ZOOM, MAX_ZOOM) };
    scoreRef.current = 0;
    setScore(0);
    setRank(1);
    setLastEaten(null);
    setSecondsLeft(ROUND_SECONDS);
    endsAtRef.current = performance.now() + ROUND_SECONDS * 1000;
  }, []);

  const start = useCallback(() => {
    reset();
    lastFrameRef.current = performance.now();
    setPhase("playing");
  }, [reset]);

  // ── Canvas sizing ────────────────────────────────────────────────────────
  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return undefined;
    const resize = () => {
      const rect = container.getBoundingClientRect();
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      viewRef.current = { w: rect.width, h: rect.height, dpr };
      canvas.width = Math.round(rect.width * dpr);
      canvas.height = Math.round(rect.height * dpr);
      canvas.style.width = `${rect.width}px`;
      canvas.style.height = `${rect.height}px`;
    };
    resize();
    const observer = new ResizeObserver(resize);
    observer.observe(container);
    return () => observer.disconnect();
  }, []);

  // ── Input ────────────────────────────────────────────────────────────────
  useEffect(() => {
    const down = (event: KeyboardEvent) => {
      const key = event.key.toLowerCase();
      if (["w", "a", "s", "d", "arrowup", "arrowdown", "arrowleft", "arrowright"].includes(key)) {
        event.preventDefault();
        keysRef.current.add(key);
      }
    };
    const up = (event: KeyboardEvent) => keysRef.current.delete(event.key.toLowerCase());
    window.addEventListener("keydown", down);
    window.addEventListener("keyup", up);
    return () => {
      window.removeEventListener("keydown", down);
      window.removeEventListener("keyup", up);
    };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return undefined;
    const move = (event: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      pointerRef.current = { x: event.clientX - rect.left, y: event.clientY - rect.top, active: true };
    };
    const leave = () => { pointerRef.current.active = false; };
    canvas.addEventListener("pointermove", move);
    canvas.addEventListener("pointerleave", leave);
    return () => {
      canvas.removeEventListener("pointermove", move);
      canvas.removeEventListener("pointerleave", leave);
    };
  }, []);

  const toggleFullscreen = useCallback(() => {
    const container = containerRef.current;
    if (!container) return;
    if (!document.fullscreenElement) void container.requestFullscreen?.().then(() => setIsFullscreen(true)).catch(() => undefined);
    else void document.exitFullscreen?.().then(() => setIsFullscreen(false)).catch(() => undefined);
  }, []);

  useEffect(() => {
    const onChange = () => setIsFullscreen(Boolean(document.fullscreenElement));
    document.addEventListener("fullscreenchange", onChange);
    return () => document.removeEventListener("fullscreenchange", onChange);
  }, []);

  // ── The loop ─────────────────────────────────────────────────────────────
  useEffect(() => {
    if (phase !== "playing") return undefined;

    const step = (now: number) => {
      const delta = Math.min(0.05, (now - lastFrameRef.current) / 1000);
      lastFrameRef.current = now;
      update(delta, now);
      render();
      frameRef.current = requestAnimationFrame(step);
    };
    frameRef.current = requestAnimationFrame(step);
    return () => { if (frameRef.current) cancelAnimationFrame(frameRef.current); };
    // update/render read refs, so they do not need to be dependencies.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase]);

  const finish = useCallback(() => {
    setPhase("over");
    const final = scoreRef.current;
    setBest((current) => {
      if (final <= current) return current;
      try { localStorage.setItem("hole-hs", String(final)); } catch { /* private mode */ }
      return final;
    });
  }, []);

  function update(delta: number, now: number) {
    const holes = holesRef.current;
    const player = holes[0];
    if (!player) return;

    const remaining = Math.max(0, endsAtRef.current - now);
    const seconds = Math.ceil(remaining / 1000);
    if (seconds !== hudRef.current.seconds) {
      hudRef.current.seconds = seconds;
      setSecondsLeft(seconds);
    }
    if (remaining <= 0) { finish(); return; }

    // ── Player steering ────────────────────────────────────────────────────
    const view = viewRef.current;
    const keys = keysRef.current;
    let dirX = 0;
    let dirY = 0;
    let strength = 0;

    if (keys.size > 0) {
      dirX = (keys.has("d") || keys.has("arrowright") ? 1 : 0) - (keys.has("a") || keys.has("arrowleft") ? 1 : 0);
      dirY = (keys.has("s") || keys.has("arrowdown") ? 1 : 0) - (keys.has("w") || keys.has("arrowup") ? 1 : 0);
      strength = dirX !== 0 || dirY !== 0 ? 1 : 0;
    } else if (pointerRef.current.active) {
      dirX = pointerRef.current.x - view.w / 2;
      dirY = pointerRef.current.y - view.h / 2;
      const distance = Math.hypot(dirX, dirY);
      strength = Math.max(0, Math.min(1, (distance - POINTER_DEADZONE) / 150));
    }

    if (strength > 0) {
      const length = Math.hypot(dirX, dirY) || 1;
      // Bigger holes are slower, but only mildly — hole.io stays playable at
      // full size, and a hole that crawls is just a punishment for winning.
      const drag = Math.max(0.62, Math.sqrt(START_RADIUS / player.radius) * 1.25);
      const move = PLAYER_SPEED * strength * drag * delta;
      player.x += (dirX / length) * move;
      player.y += (dirY / length) * move;
    }
    player.x = Math.max(player.radius, Math.min(WORLD_SIZE - player.radius, player.x));
    player.y = Math.max(player.radius, Math.min(WORLD_SIZE - player.radius, player.y));

    // ── Bots ───────────────────────────────────────────────────────────────
    for (const bot of holes) {
      if (bot.isPlayer) continue;
      if (now > bot.repickAt) {
        // Head for something it can actually eat, so bots visibly work the
        // map instead of wandering.
        const edible = propsRef.current.filter((prop) => prop.fall === 0 && canSwallow(bot.radius, prop.spec.size));
        const target = edible.length
          ? edible[Math.floor(Math.random() * Math.min(edible.length, 40))]
          : null;
        bot.targetX = target ? target.x : Math.random() * WORLD_SIZE;
        bot.targetY = target ? target.y : Math.random() * WORLD_SIZE;
        bot.repickAt = now + 1800 + Math.random() * 2200;
      }
      const toX = bot.targetX - bot.x;
      const toY = bot.targetY - bot.y;
      const distance = Math.hypot(toX, toY) || 1;
      if (distance < 12) bot.repickAt = 0;
      const drag = Math.max(0.62, Math.sqrt(START_RADIUS / bot.radius) * 1.25);
      const move = BOT_SPEED * drag * delta;
      bot.x = Math.max(bot.radius, Math.min(WORLD_SIZE - bot.radius, bot.x + (toX / distance) * move));
      bot.y = Math.max(bot.radius, Math.min(WORLD_SIZE - bot.radius, bot.y + (toY / distance) * move));
    }

    // ── Swallowing ─────────────────────────────────────────────────────────
    const survivors: CityProp[] = [];
    for (const prop of propsRef.current) {
      if (prop.fall > 0 && prop.claimedBy != null) {
        const owner = holes.find((hole) => hole.id === prop.claimedBy);
        if (!owner) { prop.fall = 0; prop.claimedBy = null; survivors.push(prop); continue; }
        prop.fall += delta / FALL_SECONDS;
        // Drawn as sliding toward the centre; the render reads prop.fall.
        prop.x += (owner.x - prop.x) * Math.min(1, delta * 9);
        prop.y += (owner.y - prop.y) * Math.min(1, delta * 9);
        if (prop.fall >= 1) {
          owner.area += Math.PI * Math.pow(prop.spec.size / 2, 2) * 0.34;
          owner.radius = Math.min(MAX_RADIUS, radiusForArea(owner.area));
          owner.score += propPoints(prop.spec);
          if (owner.isPlayer) {
            scoreRef.current = owner.score;
            setScore(owner.score);
            setLastEaten({ de: prop.spec.de, en: prop.spec.en });
            recordWordMastery(prop.spec.de);
          }
          continue; // swallowed — drop it
        }
        survivors.push(prop);
        continue;
      }

      // Not falling yet: does any hole have its mouth over it?
      let claimed = false;
      for (const hole of holes) {
        const distance = Math.hypot(hole.x - prop.x, hole.y - prop.y);
        if (distance < hole.radius && canSwallow(hole.radius, prop.spec.size)) {
          prop.fall = 0.001;
          prop.claimedBy = hole.id;
          claimed = true;
          break;
        }
        // A gentle pull at the rim, which is what makes the hole feel like a
        // hole rather than a moving delete button.
        if (distance < hole.radius * 1.5 && canSwallow(hole.radius, prop.spec.size)) {
          const pull = (1 - distance / (hole.radius * 1.5)) * 26 * delta;
          prop.x += ((hole.x - prop.x) / (distance || 1)) * pull;
          prop.y += ((hole.y - prop.y) / (distance || 1)) * pull;
        }
      }
      survivors.push(prop);
      if (claimed) { /* kept, now falling */ }
    }
    propsRef.current = survivors;

    // ── Holes eating holes ─────────────────────────────────────────────────
    for (const hole of holes) {
      for (const other of holes) {
        if (hole === other) continue;
        const distance = Math.hypot(hole.x - other.x, hole.y - other.y);
        if (distance < hole.radius && hole.radius > other.radius * 1.25) {
          hole.area += other.area * 0.5;
          hole.radius = Math.min(MAX_RADIUS, radiusForArea(hole.area));
          hole.score += Math.round(other.score * 0.5) + 40;
          if (hole.isPlayer) {
            scoreRef.current = hole.score;
            setScore(hole.score);
          }
          if (other.isPlayer) { finish(); return; }
          // The eaten bot restarts small somewhere else, so the map keeps
          // its competition instead of emptying out.
          other.radius = START_RADIUS;
          other.area = areaForRadius(START_RADIUS);
          other.score = Math.round(other.score * 0.4);
          other.x = Math.random() * WORLD_SIZE;
          other.y = Math.random() * WORLD_SIZE;
        }
      }
    }

    // ── Camera: follow, and zoom to keep the hole a constant size ──────────
    const camera = cameraRef.current;
    const follow = 1 - Math.exp(-8 * delta);
    camera.x += (player.x - camera.x) * follow;
    camera.y += (player.y - camera.y) * follow;
    const wantZoom = zoomForRadius(player.radius, TARGET_SCREEN_RADIUS, MIN_ZOOM, MAX_ZOOM);
    camera.zoom += (wantZoom - camera.zoom) * (1 - Math.exp(-3.2 * delta));

    // ── Leaderboard ────────────────────────────────────────────────────────
    const ranked = [...holes].sort((a, b) => b.score - a.score);
    const place = ranked.findIndex((hole) => hole.isPlayer) + 1;
    if (place !== hudRef.current.rank) {
      hudRef.current.rank = place;
      setRank(place);
    }
    // The board is four numbers that change constantly and matter loosely, so
    // it refreshes on a timer rather than on every frame.
    if (now - hudRef.current.boardAt > 250) {
      hudRef.current.boardAt = now;
      setBoard(ranked.map((hole) => ({ name: hole.name, score: hole.score, isPlayer: hole.isPlayer, colour: hole.colour })));
    }
  }

  // ── Rendering ────────────────────────────────────────────────────────────
  function render() {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const { w, h, dpr } = viewRef.current;
    const camera = cameraRef.current;
    const zoom = camera.zoom;

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, w, h);

    // Ground
    ctx.fillStyle = "#7cb267";
    ctx.fillRect(0, 0, w, h);

    ctx.save();
    ctx.translate(w / 2, h / 2);
    ctx.scale(zoom, zoom);
    ctx.translate(-camera.x, -camera.y);

    const halfW = w / 2 / zoom;
    const halfH = h / 2 / zoom;
    const left = camera.x - halfW;
    const right = camera.x + halfW;
    const top = camera.y - halfH;
    const bottom = camera.y + halfH;

    // Blocks: a paler slab inside each road square, so the city reads as
    // buildings-on-plots rather than props floating on grass.
    ctx.fillStyle = "#8cc47a";
    const firstBlockX = Math.floor(left / ROAD_STEP) * ROAD_STEP;
    const firstBlockY = Math.floor(top / ROAD_STEP) * ROAD_STEP;
    for (let x = firstBlockX; x < right; x += ROAD_STEP) {
      for (let y = firstBlockY; y < bottom; y += ROAD_STEP) {
        ctx.fillRect(x + ROAD_WIDTH / 2, y + ROAD_WIDTH / 2, ROAD_STEP - ROAD_WIDTH, ROAD_STEP - ROAD_WIDTH);
      }
    }

    // Roads with a dashed centre line.
    ctx.fillStyle = "#57606f";
    for (let x = firstBlockX; x < right + ROAD_STEP; x += ROAD_STEP) {
      ctx.fillRect(x - ROAD_WIDTH / 2, top, ROAD_WIDTH, bottom - top);
    }
    for (let y = firstBlockY; y < bottom + ROAD_STEP; y += ROAD_STEP) {
      ctx.fillRect(left, y - ROAD_WIDTH / 2, right - left, ROAD_WIDTH);
    }
    if (zoom > 0.45) {
      ctx.strokeStyle = "rgba(255,255,255,0.55)";
      ctx.lineWidth = 3;
      ctx.setLineDash([22, 20]);
      ctx.beginPath();
      for (let x = firstBlockX; x < right + ROAD_STEP; x += ROAD_STEP) {
        ctx.moveTo(x, top); ctx.lineTo(x, bottom);
      }
      for (let y = firstBlockY; y < bottom + ROAD_STEP; y += ROAD_STEP) {
        ctx.moveTo(left, y); ctx.lineTo(right, y);
      }
      ctx.stroke();
      ctx.setLineDash([]);
    }

    // World edge
    ctx.strokeStyle = "rgba(15,23,42,0.35)";
    ctx.lineWidth = 8;
    ctx.strokeRect(0, 0, WORLD_SIZE, WORLD_SIZE);

    const visible = propsRef.current.filter((prop) =>
      prop.x > left - 200 && prop.x < right + 200 && prop.y > top - 200 && prop.y < bottom + 200);

    const standing = visible.filter((prop) => prop.fall === 0);
    const falling = visible.filter((prop) => prop.fall > 0);

    // Standing props first, back to front so the taller things overlap
    // correctly and the street has depth.
    standing.sort((a, b) => a.y - b.y);
    for (const prop of standing) drawProp(ctx, prop, 1, zoom);

    // Then the holes themselves.
    for (const hole of holesRef.current) drawHole(ctx, hole, zoom);

    // Then whatever is falling — CLIPPED to its hole, so it slides under the
    // rim instead of hovering over the void. This is the whole trick.
    for (const prop of falling) {
      const owner = holesRef.current.find((hole) => hole.id === prop.claimedBy);
      if (!owner) continue;
      ctx.save();
      ctx.beginPath();
      ctx.arc(owner.x, owner.y, owner.radius, 0, Math.PI * 2);
      ctx.clip();
      const sink = prop.fall;
      ctx.globalAlpha = 1 - sink * 0.35;
      drawProp(ctx, prop, 1 - sink * 0.55, zoom, prop.rotation + prop.spin * sink, sink * owner.radius * 0.55);
      ctx.restore();
    }

    ctx.restore();
  }

  function drawHole(ctx: CanvasRenderingContext2D, hole: Hole, zoom: number) {
    // Rim shadow on the ground, then the void, then a highlight on the far
    // edge so it reads as a hole rather than a black sticker.
    const glow = ctx.createRadialGradient(hole.x, hole.y, hole.radius * 0.7, hole.x, hole.y, hole.radius * 1.35);
    glow.addColorStop(0, "rgba(0,0,0,0.45)");
    glow.addColorStop(1, "rgba(0,0,0,0)");
    ctx.fillStyle = glow;
    ctx.beginPath();
    ctx.arc(hole.x, hole.y, hole.radius * 1.35, 0, Math.PI * 2);
    ctx.fill();

    const void_ = ctx.createRadialGradient(
      hole.x, hole.y - hole.radius * 0.15, hole.radius * 0.1,
      hole.x, hole.y, hole.radius
    );
    void_.addColorStop(0, "#000000");
    void_.addColorStop(0.75, hole.isPlayer ? "#05070c" : "#0b0b14");
    void_.addColorStop(1, hole.isPlayer ? "#111827" : hole.colour);
    ctx.fillStyle = void_;
    ctx.beginPath();
    ctx.arc(hole.x, hole.y, hole.radius, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = hole.isPlayer ? "rgba(255,255,255,0.28)" : "rgba(255,255,255,0.2)";
    ctx.lineWidth = Math.max(1.5, 3 / zoom);
    ctx.beginPath();
    ctx.arc(hole.x, hole.y, hole.radius * 0.97, Math.PI * 1.05, Math.PI * 1.95);
    ctx.stroke();

    if (!hole.isPlayer && zoom > 0.28) {
      ctx.fillStyle = "rgba(255,255,255,0.85)";
      ctx.font = `bold ${Math.round(14 / zoom)}px "Outfit", system-ui, sans-serif`;
      ctx.textAlign = "center";
      ctx.fillText(hole.name, hole.x, hole.y - hole.radius - 10 / zoom);
    }
  }

  function drawProp(
    ctx: CanvasRenderingContext2D,
    prop: CityProp,
    scale: number,
    zoom: number,
    rotation = prop.rotation,
    dropY = 0
  ) {
    const { spec } = prop;
    const size = spec.size * scale;
    ctx.save();
    ctx.translate(prop.x, prop.y + dropY);
    ctx.rotate(rotation);

    // Contact shadow — cheap, and it is what stops everything looking like
    // stickers on a flat plane.
    if (dropY === 0) {
      ctx.fillStyle = "rgba(0,0,0,0.18)";
      ctx.beginPath();
      ctx.ellipse(size * 0.08, size * 0.12, size * 0.5, size * 0.28, 0, 0, Math.PI * 2);
      ctx.fill();
    }

    const half = size / 2;
    const detail = zoom > 0.34;

    switch (spec.kind) {
      case "tower":
      case "house":
      case "shop": {
        // A footprint with a lighter roof, offset slightly, for a hint of height.
        ctx.fillStyle = spec.roof ?? spec.color;
        ctx.fillRect(-half, -half, size, size);
        ctx.fillStyle = spec.color;
        ctx.fillRect(-half * 0.86, -half * 0.86 - size * 0.06, size * 0.86, size * 0.86);
        if (detail) {
          ctx.fillStyle = "rgba(255,255,255,0.55)";
          const windows = spec.kind === "tower" ? 4 : 2;
          const gap = size * 0.72 / windows;
          for (let row = 0; row < windows; row += 1) {
            for (let col = 0; col < windows; col += 1) {
              ctx.fillRect(-half * 0.7 + col * gap, -half * 0.72 + row * gap, gap * 0.5, gap * 0.5);
            }
          }
        }
        break;
      }
      case "tree": {
        ctx.fillStyle = "#7a5230";
        ctx.fillRect(-size * 0.07, -size * 0.05, size * 0.14, size * 0.3);
        ctx.fillStyle = spec.color;
        ctx.beginPath(); ctx.arc(0, -size * 0.08, half * 0.72, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = "rgba(255,255,255,0.16)";
        ctx.beginPath(); ctx.arc(-half * 0.2, -size * 0.22, half * 0.3, 0, Math.PI * 2); ctx.fill();
        break;
      }
      case "bus":
      case "truck":
      case "van":
      case "car":
      case "taxi": {
        const width = size;
        const height = size * 0.46;
        ctx.fillStyle = spec.color;
        roundRect(ctx, -width / 2, -height / 2, width, height, height * 0.28);
        ctx.fill();
        if (detail) {
          ctx.fillStyle = "rgba(15,23,42,0.55)";
          roundRect(ctx, -width * 0.22, -height * 0.34, width * 0.44, height * 0.68, height * 0.2);
          ctx.fill();
          ctx.fillStyle = "rgba(255,255,255,0.35)";
          ctx.fillRect(width * 0.34, -height * 0.24, width * 0.1, height * 0.18);
        }
        break;
      }
      case "bike":
      case "scooter": {
        ctx.strokeStyle = spec.color;
        ctx.lineWidth = Math.max(1.4, size * 0.09);
        ctx.beginPath();
        ctx.arc(-size * 0.26, 0, size * 0.2, 0, Math.PI * 2);
        ctx.moveTo(size * 0.26 + size * 0.2, 0);
        ctx.arc(size * 0.26, 0, size * 0.2, 0, Math.PI * 2);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(-size * 0.26, 0); ctx.lineTo(0, -size * 0.2); ctx.lineTo(size * 0.26, 0);
        ctx.stroke();
        break;
      }
      case "person": {
        ctx.fillStyle = spec.color;
        ctx.beginPath(); ctx.arc(0, -size * 0.2, size * 0.2, 0, Math.PI * 2); ctx.fill();
        roundRect(ctx, -size * 0.18, -size * 0.02, size * 0.36, size * 0.46, size * 0.14);
        ctx.fill();
        break;
      }
      case "lamp": {
        ctx.fillStyle = "#64748b";
        ctx.fillRect(-size * 0.05, -size * 0.1, size * 0.1, size * 0.5);
        ctx.fillStyle = spec.color;
        ctx.beginPath(); ctx.arc(0, -size * 0.2, size * 0.2, 0, Math.PI * 2); ctx.fill();
        break;
      }
      case "cone": {
        ctx.fillStyle = spec.color;
        ctx.beginPath();
        ctx.moveTo(0, -half); ctx.lineTo(half * 0.7, half * 0.6); ctx.lineTo(-half * 0.7, half * 0.6);
        ctx.closePath(); ctx.fill();
        ctx.fillStyle = "rgba(255,255,255,0.7)";
        ctx.fillRect(-half * 0.42, -half * 0.05, half * 0.84, half * 0.2);
        break;
      }
      default: {
        // Bins, benches, signs, bottles, litter — a rounded slab reads well
        // at every zoom and stays cheap when there are hundreds on screen.
        ctx.fillStyle = spec.color;
        roundRect(ctx, -half * 0.8, -half * 0.8, size * 0.8, size * 0.8, size * 0.18);
        ctx.fill();
        if (detail) {
          ctx.fillStyle = "rgba(255,255,255,0.28)";
          ctx.fillRect(-half * 0.6, -half * 0.6, size * 0.6, size * 0.16);
        }
      }
    }
    ctx.restore();
  }

  const showOverlay = phase !== "playing";
  const timeLow = secondsLeft <= 15;

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-xl font-semibold text-[var(--text-1)]">{ui("Hole")}</h2>
        <p className="mt-0.5 text-sm text-[var(--text-3)]">
          {ui("Swallow the city. Everything smaller than your hole goes in — and everything you eat teaches you its name.")}
        </p>
      </div>

      <div className="card relative flex flex-wrap items-center justify-between gap-4 px-5 py-4">
        <div className="flex flex-wrap items-center gap-5">
          <div>
            <p className="text-xs text-[var(--text-3)]">{ui("Score")}</p>
            <p className="text-2xl font-black tabular-nums text-[var(--text-1)]">{score}</p>
          </div>
          <div>
            <p className="text-xs text-[var(--text-3)]">{ui("Best")}</p>
            <p className="text-2xl font-black tabular-nums text-[var(--text-1)]">{best}</p>
          </div>
          <div>
            <p className="text-xs text-[var(--text-3)]">{ui("Rank")}</p>
            <p className="text-2xl font-black tabular-nums text-[var(--text-1)]">#{rank}</p>
          </div>
          <div>
            <p className="text-xs text-[var(--text-3)]">{ui("Time")}</p>
            <p className={`flex items-center gap-1.5 text-2xl font-black tabular-nums ${timeLow ? "text-rose-500" : "text-[var(--text-1)]"}`}>
              <Clock className="h-4 w-4" />
              {Math.floor(secondsLeft / 60)}:{String(secondsLeft % 60).padStart(2, "0")}
            </p>
          </div>
        </div>
        <button
          onClick={toggleFullscreen}
          className="rounded-xl p-2 text-[var(--text-3)] opacity-60 transition-opacity hover:bg-white/5 hover:opacity-100"
          title={ui(isFullscreen ? "Exit fullscreen" : "Enter fullscreen")}
          type="button"
        >
          {isFullscreen ? <Minimize className="h-4 w-4" /> : <Maximize className="h-4 w-4" />}
        </button>
      </div>

      <div
        ref={containerRef}
        className="relative w-full overflow-hidden rounded-2xl border border-[var(--border)] bg-[#7cb267]"
        style={{ height: isFullscreen ? "100vh" : "min(64vh, 620px)" }}
      >
        <canvas ref={canvasRef} className="block h-full w-full touch-none" />

        {/* Live leaderboard, which is what gives the clock something to mean. */}
        {phase === "playing" && board.length > 0 && (
          <div className="pointer-events-none absolute right-3 top-3 w-40 rounded-xl bg-black/45 p-2.5 backdrop-blur-sm">
            {board.slice(0, 6).map((entry, index) => (
              <div key={entry.name + index} className="flex items-center gap-2 py-0.5">
                <span className="w-4 text-[11px] font-black text-white/60">{index + 1}</span>
                <span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ background: entry.colour }} />
                <span className={`flex-1 truncate text-[11px] font-bold ${entry.isPlayer ? "text-white" : "text-white/70"}`}>
                  {entry.name}
                </span>
                <span className="text-[11px] font-black tabular-nums text-white/90">{entry.score}</span>
              </div>
            ))}
          </div>
        )}

        {/* The word you just ate. */}
        <AnimatePresence>
          {phase === "playing" && lastEaten && (
            <motion.div
              key={lastEaten.de + score}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.18 }}
              className="pointer-events-none absolute bottom-4 left-1/2 -translate-x-1/2 rounded-2xl bg-black/60 px-4 py-2.5 text-center backdrop-blur-sm"
            >
              <p className="text-base font-black text-white">{learnsEnglish ? lastEaten.en : lastEaten.de}</p>
              <p className="text-[11px] font-bold text-white/70">{learnsEnglish ? lastEaten.de : lastEaten.en}</p>
            </motion.div>
          )}
        </AnimatePresence>

        {showOverlay && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/55 backdrop-blur-sm">
            <div className="mx-4 max-w-sm rounded-3xl bg-[var(--surface)] p-6 text-center shadow-2xl">
              {phase === "over" ? (
                <>
                  <Trophy className="mx-auto h-9 w-9 text-[var(--accent)]" />
                  <h3 className="mt-3 text-2xl font-black text-[var(--text-1)]">{ui("Time")}</h3>
                  <p className="mt-1 text-sm font-semibold text-[var(--text-3)]">
                    {ui("You finished")} #{rank} {ui("with")} {score} {ui("points")}.
                  </p>
                </>
              ) : (
                <>
                  <h3 className="text-2xl font-black text-[var(--text-1)]">{ui("Hole")}</h3>
                  <p className="mt-2 text-sm font-semibold leading-6 text-[var(--text-3)]">
                    {ui("Two minutes. Start with litter, end with tower blocks. Move with the mouse or WASD.")}
                  </p>
                </>
              )}
              <button
                onClick={start}
                className="accent-btn mt-5 inline-flex h-11 items-center gap-2 px-6 text-sm"
                type="button"
              >
                {phase === "over" ? <RotateCcw className="h-4 w-4" /> : null}
                {ui(phase === "over" ? "Play again" : "Start game")}
              </button>
            </div>
          </div>
        )}
      </div>

      <p className="text-center text-xs font-semibold text-[var(--text-3)]">
        {ui("Mouse or WASD to move · you can only swallow what is smaller than your hole")}
      </p>
    </div>
  );
}

function roundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number
) {
  const r = Math.min(radius, width / 2, height / 2);
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + width, y, x + width, y + height, r);
  ctx.arcTo(x + width, y + height, x, y + height, r);
  ctx.arcTo(x, y + height, x, y, r);
  ctx.arcTo(x, y, x + width, y, r);
  ctx.closePath();
}
