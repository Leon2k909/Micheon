import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RotateCcw, Trophy, Maximize, Minimize, ChevronRight, Sparkles, Map, Target } from 'lucide-react';
import { recordWordMastery } from '@/lib/mastery';
import { useGameContent } from '@/games/gameContent';
import { ui } from '@/lib/i18n';

// --- Game Constants ---
const WORLD_SIZE = 3000;
const INITIAL_RADIUS = 28;
const MAX_RADIUS = 400;
const BOT_COUNT = 8;
const ITEM_COUNT = 340;
const PLAYER_SPEED = 135;
const BOT_SPEED = 72;
const EAT_DURATION_SECONDS = 0.55;
const POINTER_DEADZONE = 28;

interface GameObject {
  id: number;
  x: number;
  y: number;
  type: 'ball' | 'bench' | 'bicycle' | 'bottle' | 'bus' | 'car' | 'chair' | 'house' | 'lamp' | 'mailbox' | 'person' | 'table' | 'tree';
  size: number;
  points: number;
  color: string;
  label: string;
  labelEn: string;
  masteryKey: string;
  isBeingEaten: boolean;
  eatenProgress: number; // 0 to 1
}

interface Hole {
  id: number;
  x: number;
  y: number;
  radius: number;
  color: string;
  name: string;
  score: number;
  targetAngle: number;
  angle: number;
  isDead: boolean;
  nextTurnAt: number;
}

const PROP_TYPES = [
  { type: 'bottle', size: 7, points: 4, color: '#22c55e', label: 'die Flasche', en: 'bottle' },
  { type: 'ball', size: 9, points: 5, color: '#fb7185', label: 'der Ball', en: 'ball' },
  { type: 'person', size: 12, points: 8, color: '#fca5a5', label: 'die Person', en: 'person' },
  { type: 'lamp', size: 14, points: 10, color: '#fbbf24', label: 'die Lampe', en: 'lamp' },
  { type: 'mailbox', size: 18, points: 12, color: '#ef4444', label: 'der Briefkasten', en: 'mailbox' },
  { type: 'chair', size: 20, points: 14, color: '#a78bfa', label: 'der Stuhl', en: 'chair' },
  { type: 'bench', size: 24, points: 18, color: '#94a3b8', label: 'die Bank', en: 'bench' },
  { type: 'bicycle', size: 28, points: 22, color: '#06b6d4', label: 'das Fahrrad', en: 'bicycle' },
  { type: 'table', size: 32, points: 26, color: '#a16207', label: 'der Tisch', en: 'table' },
  { type: 'car', size: 42, points: 42, color: '#3b82f6', label: 'das Auto', en: 'car' },
  { type: 'tree', size: 50, points: 55, color: '#10b981', label: 'der Baum', en: 'tree' },
  { type: 'bus', size: 70, points: 85, color: '#f97316', label: 'der Bus', en: 'bus' },
  { type: 'house', size: 120, points: 180, color: '#6366f1', label: 'das Haus', en: 'house' },
];

export default function HoleGame() {
  const { learningDirection } = useGameContent();
  const learnsEnglish = learningDirection === "learn-en";
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Game State
  const [gameState, setGameState] = useState<'idle' | 'playing' | 'gameOver'>('idle');
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(() => {
    try { return parseInt(localStorage.getItem('hole-hs') ?? '0', 10); } catch { return 0; }
  });
  const [isPaused, setIsPaused] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [lastCollected, setLastCollected] = useState<{ target: string; meaning: string } | null>(null);
  
  // Refs for performance
  const playerRef = useRef<Hole>({
    id: 0, x: WORLD_SIZE / 2, y: WORLD_SIZE / 2, radius: INITIAL_RADIUS, color: '#000000', name: 'You', score: 0, targetAngle: 0, angle: 0, isDead: false, nextTurnAt: 0
  });
  const botsRef = useRef<Hole[]>([]);
  const itemsRef = useRef<GameObject[]>([]);
  const cameraRef = useRef({ x: WORLD_SIZE / 2, y: WORLD_SIZE / 2 });
  const viewportRef = useRef({ w: 0, h: 0 });
  const mouseRef = useRef({ x: 0, y: 0 });
  const pointerActiveRef = useRef(false);
  const keysRef = useRef(new Set<string>());
  const lastFrameRef = useRef(0);
  const scoreRef = useRef(0);
  const highScoreRef = useRef(highScore);
  const requestRef = useRef<number>(null);

  const addScore = (points: number) => {
    scoreRef.current += points;
    setScore(scoreRef.current);
  };

  const finishGame = () => {
    const finalScore = scoreRef.current;
    if (finalScore > highScoreRef.current) {
      highScoreRef.current = finalScore;
      setHighScore(finalScore);
      try { localStorage.setItem('hole-hs', String(finalScore)); } catch {}
    }
    setGameState('gameOver');
  };

  // --- Initialization ---
  const initGame = () => {
    const startX = WORLD_SIZE / 2;
    const startY = WORLD_SIZE / 2;

    playerRef.current = {
      id: 0, x: startX, y: startY, radius: INITIAL_RADIUS, color: '#000000', name: 'You', score: 0, targetAngle: 0, angle: 0, isDead: false, nextTurnAt: 0
    };

    const initialItems: GameObject[] = [];
    for (let i = 0; i < ITEM_COUNT; i++) {
      const starter = i < 52;
      initialItems.push(spawnItem(starter ? { x: startX, y: startY, radius: 520, smallOnly: true } : undefined));
    }
    itemsRef.current = initialItems;

    const initialBots: Hole[] = [];
    for (let i = 0; i < BOT_COUNT; i++) {
      initialBots.push(spawnBot({ x: startX, y: startY }, 700, i + 1));
    }
    botsRef.current = initialBots;

    cameraRef.current = { x: startX, y: startY };
    mouseRef.current = { x: viewportRef.current.w / 2, y: viewportRef.current.h / 2 };
    pointerActiveRef.current = false;
    keysRef.current.clear();
    lastFrameRef.current = 0;
    scoreRef.current = 0;
    setScore(0);
    setLastCollected(null);
    setIsPaused(false);
    setGameState('playing');
  };

  const spawnItem = (near?: { x: number; y: number; radius: number; smallOnly?: boolean }): GameObject => {
      const choices = near?.smallOnly ? PROP_TYPES.slice(0, 7) : PROP_TYPES;
      const prop = choices[Math.floor(Math.random() * choices.length)];
      const angle = Math.random() * Math.PI * 2;
      const distance = near ? 80 + Math.random() * Math.max(80, near.radius - 80) : 0;
      const x = near
        ? Math.max(50, Math.min(WORLD_SIZE - 50, near.x + Math.cos(angle) * distance))
        : 50 + Math.random() * (WORLD_SIZE - 100);
      const y = near
        ? Math.max(50, Math.min(WORLD_SIZE - 50, near.y + Math.sin(angle) * distance))
        : 50 + Math.random() * (WORLD_SIZE - 100);
      return {
          id: Math.random(),
          x,
          y,
          type: prop.type as any,
          size: prop.size,
          points: prop.points,
          color: prop.color,
          label: learnsEnglish ? prop.en : prop.label,
          labelEn: learnsEnglish ? prop.label : prop.en,
          masteryKey: prop.label,
          isBeingEaten: false,
          eatenProgress: 0
      };
  };

  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
        containerRef.current.requestFullscreen().catch(e => console.error(e));
    } else {
        document.exitFullscreen();
    }
  };

  const update = (timestamp: number) => {
    if (gameState !== 'playing') return;

    const player = playerRef.current;
    const { w, h } = viewportRef.current;
    const previousFrame = lastFrameRef.current || timestamp;
    const deltaSeconds = Math.min(0.04, Math.max(0, (timestamp - previousFrame) / 1000));
    lastFrameRef.current = timestamp;
    
    // Position-based steering with a broad deadzone for precise movement.
    const sx = player.x - cameraRef.current.x + w / 2;
    const sy = player.y - cameraRef.current.y + h / 2;

    let dx = 0;
    let dy = 0;
    let inputStrength = 0;
    const keys = keysRef.current;
    if (keys.size > 0) {
      dx = (keys.has('d') || keys.has('arrowright') ? 1 : 0) - (keys.has('a') || keys.has('arrowleft') ? 1 : 0);
      dy = (keys.has('s') || keys.has('arrowdown') ? 1 : 0) - (keys.has('w') || keys.has('arrowup') ? 1 : 0);
      inputStrength = dx !== 0 || dy !== 0 ? 1 : 0;
    } else if (pointerActiveRef.current) {
      dx = mouseRef.current.x - sx;
      dy = mouseRef.current.y - sy;
      const pointerDistance = Math.sqrt(dx * dx + dy * dy);
      inputStrength = Math.max(0, Math.min(1, (pointerDistance - POINTER_DEADZONE) / 170));
    }

    const inputDistance = Math.sqrt(dx * dx + dy * dy);
    if (inputStrength > 0 && inputDistance > 0) {
      const desiredAngle = Math.atan2(dy, dx);
      let angleDelta = desiredAngle - player.angle;
      while (angleDelta < -Math.PI) angleDelta += Math.PI * 2;
      while (angleDelta > Math.PI) angleDelta -= Math.PI * 2;
      player.angle += angleDelta * (1 - Math.exp(-9 * deltaSeconds));
      const sizeSlowdown = Math.max(0.55, Math.sqrt(INITIAL_RADIUS / player.radius));
      const step = PLAYER_SPEED * inputStrength * sizeSlowdown * deltaSeconds;
      player.x += Math.cos(player.angle) * step;
      player.y += Math.sin(player.angle) * step;
    }

    // Bounds
    player.x = Math.max(0, Math.min(WORLD_SIZE, player.x));
    player.y = Math.max(0, Math.min(WORLD_SIZE, player.y));

    // Smooth Camera Following
    const cameraFollow = 1 - Math.exp(-7 * deltaSeconds);
    cameraRef.current.x += (player.x - cameraRef.current.x) * cameraFollow;
    cameraRef.current.y += (player.y - cameraRef.current.y) * cameraFollow;

    // --- ITEM PHYSICS ---
    itemsRef.current = itemsRef.current.filter(item => {
        // Check if inside player
        const dx = player.x - item.x;
        const dy = player.y - item.y;
        const distSq = dx*dx + dy*dy;
        
        if (distSq < Math.pow(player.radius, 2)) {
            if (player.radius > item.size * 1.12) { // Only eat if hole is big enough
                item.isBeingEaten = true;
                item.eatenProgress += deltaSeconds / EAT_DURATION_SECONDS;
                if (item.eatenProgress >= 1) {
                    player.radius = Math.min(MAX_RADIUS, player.radius + Math.max(0.45, item.points * 0.045));
                    addScore(item.points);
                    setLastCollected({ target: item.label, meaning: item.labelEn });
                    recordWordMastery(item.masteryKey);
                    return false;
                }
            }
        } else {
            // Check bots
            for (const bot of botsRef.current) {
                const bdx = bot.x - item.x;
                const bdy = bot.y - item.y;
                const bdSq = bdx*bdx + bdy*bdy;
                if (bdSq < Math.pow(bot.radius * 0.8, 2)) {
                    if (bot.radius > item.size * 1.12) {
                        bot.radius = Math.min(MAX_RADIUS, bot.radius + Math.max(0.3, item.points * 0.025));
                        return false;
                    }
                }
            }
            item.isBeingEaten = false;
            item.eatenProgress = 0;
        }
        return true;
    });

    // Respawn missing items
    while (itemsRef.current.length < ITEM_COUNT) {
        itemsRef.current.push(spawnItem());
    }

    // --- BOT AI ---
    botsRef.current.forEach(bot => {
        if (timestamp >= bot.nextTurnAt) {
          bot.targetAngle += (Math.random() - 0.5) * Math.PI;
          bot.nextTurnAt = timestamp + 700 + Math.random() * 1800;
        }
        let turnDelta = bot.targetAngle - bot.angle;
        while (turnDelta < -Math.PI) turnDelta += Math.PI * 2;
        while (turnDelta > Math.PI) turnDelta -= Math.PI * 2;
        bot.angle += turnDelta * (1 - Math.exp(-2.8 * deltaSeconds));
        bot.x += Math.cos(bot.angle) * BOT_SPEED * deltaSeconds;
        bot.y += Math.sin(bot.angle) * BOT_SPEED * deltaSeconds;
        
        // Bounce off walls
        if (bot.x < 0 || bot.x > WORLD_SIZE) bot.targetAngle = Math.PI - bot.targetAngle;
        if (bot.y < 0 || bot.y > WORLD_SIZE) bot.targetAngle = -bot.targetAngle;
        
        // Bot vs Player collision
        const dx = player.x - bot.x;
        const dy = player.y - bot.y;
        const dSq = dx*dx + dy*dy;
        if (dSq < Math.pow(player.radius, 2) && player.radius > bot.radius * 1.3) {
            bot.isDead = true;
            player.radius = Math.min(MAX_RADIUS, player.radius + bot.radius * 0.18);
            addScore(500);
        } else if (dSq < Math.pow(bot.radius, 2) && bot.radius > player.radius * 1.3) {
            finishGame();
        }
    });
    botsRef.current = botsRef.current.filter(b => !b.isDead);
    while (botsRef.current.length < BOT_COUNT) {
        botsRef.current.push(spawnBot({ x: player.x, y: player.y }, 650));
    }

    draw();
    requestRef.current = requestAnimationFrame(update);
  };

  const spawnBot = (avoid?: { x: number; y: number }, minimumDistance = 0, id = Math.random()): Hole => {
    let x = Math.random() * WORLD_SIZE;
    let y = Math.random() * WORLD_SIZE;
    if (avoid && minimumDistance > 0) {
      for (let attempt = 0; attempt < 20; attempt += 1) {
        const candidateX = Math.random() * WORLD_SIZE;
        const candidateY = Math.random() * WORLD_SIZE;
        if (Math.hypot(candidateX - avoid.x, candidateY - avoid.y) >= minimumDistance) {
          x = candidateX;
          y = candidateY;
          break;
        }
      }
    }
    const angle = Math.random() * Math.PI * 2;
    const botColors = ['#dc2626', '#16a34a', '#2563eb', '#9333ea', '#ea580c'];
    return {
        id,
        x, y,
        radius: INITIAL_RADIUS + Math.random() * 30,
        color: botColors[Math.floor(Math.random() * botColors.length)],
        name: 'Bot',
        score: 0,
        targetAngle: angle,
        angle,
        isDead: false,
        nextTurnAt: performance.now() + 500 + Math.random() * 1500,
    };
  };

  const draw = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const { w, h } = viewportRef.current;
    const cam = cameraRef.current;

    // Background
    ctx.fillStyle = '#f8fafc';
    ctx.fillRect(0, 0, w, h);

    // City Grid
    ctx.strokeStyle = '#e2e8f0';
    ctx.lineWidth = 2;
    const gridSize = 200;
    const startX = (w / 2 - cam.x) % gridSize;
    const startY = (h / 2 - cam.y) % gridSize;
    ctx.beginPath();
    for (let x = startX; x < w; x += gridSize) {
        ctx.moveTo(x, 0); ctx.lineTo(x, h);
    }
    for (let y = startY; y < h; y += gridSize) {
        ctx.moveTo(0, y); ctx.lineTo(w, y);
    }
    ctx.stroke();

    // --- DRAW HOLES (Beneath items) ---
    const drawHole = (hole: Hole, isPlayer = false) => {
        const sx = hole.x - cam.x + w / 2;
        const sy = hole.y - cam.y + h / 2;
        
        // Outer Shadow
        const grad = ctx.createRadialGradient(sx, sy, hole.radius * 0.8, sx, sy, hole.radius * 1.2);
        grad.addColorStop(0, 'rgba(0,0,0,0.8)');
        grad.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.fillStyle = grad;
        ctx.beginPath(); ctx.arc(sx, sy, hole.radius * 1.2, 0, Math.PI * 2); ctx.fill();

        // Inner Void
        ctx.fillStyle = isPlayer ? '#000000' : hole.color;
        ctx.beginPath(); ctx.arc(sx, sy, hole.radius, 0, Math.PI * 2); ctx.fill();
        
        // Depth Ring
        ctx.strokeStyle = 'rgba(255,255,255,0.2)';
        ctx.lineWidth = 3;
        ctx.beginPath(); ctx.arc(sx, sy, hole.radius - 2, 0, Math.PI * 2); ctx.stroke();

        // Name
        ctx.fillStyle = isPlayer ? '#1e293b' : hole.color;
        ctx.font = 'bold 14px "Outfit", sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(hole.name, sx, sy - hole.radius - 10);
    };

    botsRef.current.forEach(b => drawHole(b));
    drawHole(playerRef.current, true);

    // --- DRAW ITEMS ---
    itemsRef.current.forEach(item => {
        const sx = item.x - cam.x + w / 2;
        const sy = item.y - cam.y + h / 2;
        
        // Culling
        if (sx < -200 || sx > w + 200 || sy < -200 || sy > h + 200) return;

        const scale = item.isBeingEaten ? (1 - item.eatenProgress) : 1;
        const opacity = item.isBeingEaten ? (1 - item.eatenProgress) : 1;

        ctx.save();
        ctx.translate(sx, sy);
        ctx.scale(scale, scale);
        ctx.globalAlpha = opacity;

        // Shadow
        ctx.fillStyle = 'rgba(0,0,0,0.1)';
        ctx.fillRect(-item.size/2 + 4, item.size/2 - 2, item.size, 4);

        // Object Body
        ctx.fillStyle = item.color;
        if (item.type === 'car') {
            ctx.fillRect(-item.size/2, -item.size/5, item.size, item.size * 0.45);
            ctx.fillStyle = 'rgba(255,255,255,0.3)';
            ctx.fillRect(-item.size/3, -item.size/3, item.size * 0.52, item.size/4);
            ctx.fillStyle = '#172033';
            ctx.beginPath();
            ctx.arc(-item.size * 0.28, item.size * 0.28, item.size * 0.12, 0, Math.PI * 2);
            ctx.arc(item.size * 0.28, item.size * 0.28, item.size * 0.12, 0, Math.PI * 2);
            ctx.fill();
        } else if (item.type === 'bus') {
            ctx.fillRect(-item.size/2, -item.size/3, item.size, item.size * 0.62);
            ctx.fillStyle = 'rgba(255,255,255,0.5)';
            for (let windowIndex = 0; windowIndex < 4; windowIndex += 1) {
              ctx.fillRect(-item.size * 0.4 + windowIndex * item.size * 0.22, -item.size * 0.23, item.size * 0.16, item.size * 0.18);
            }
            ctx.fillStyle = '#172033';
            ctx.beginPath();
            ctx.arc(-item.size * 0.3, item.size * 0.32, item.size * 0.1, 0, Math.PI * 2);
            ctx.arc(item.size * 0.3, item.size * 0.32, item.size * 0.1, 0, Math.PI * 2);
            ctx.fill();
        } else if (item.type === 'house') {
            ctx.fillRect(-item.size/2, -item.size/2, item.size, item.size);
            ctx.fillStyle = '#4338ca'; // Roof
            ctx.beginPath();
            ctx.moveTo(-item.size/2, -item.size/2);
            ctx.lineTo(0, -item.size*0.8);
            ctx.lineTo(item.size/2, -item.size/2);
            ctx.fill();
            ctx.fillStyle = '#f8fafc';
            ctx.fillRect(-item.size * 0.12, item.size * 0.08, item.size * 0.24, item.size * 0.42);
        } else if (item.type === 'tree') {
            ctx.fillStyle = '#8b5a2b';
            ctx.fillRect(-item.size * 0.1, 0, item.size * 0.2, item.size * 0.48);
            ctx.fillStyle = item.color;
            ctx.beginPath();
            ctx.arc(0, -item.size * 0.08, item.size * 0.45, 0, Math.PI * 2);
            ctx.fill();
        } else if (item.type === 'person') {
            ctx.beginPath();
            ctx.arc(0, -item.size * 0.28, item.size * 0.2, 0, Math.PI * 2);
            ctx.fill();
            ctx.fillRect(-item.size * 0.16, -item.size * 0.05, item.size * 0.32, item.size * 0.5);
        } else if (item.type === 'lamp') {
            ctx.fillRect(-item.size * 0.08, -item.size * 0.3, item.size * 0.16, item.size * 0.75);
            ctx.beginPath();
            ctx.arc(0, -item.size * 0.34, item.size * 0.25, 0, Math.PI * 2);
            ctx.fill();
        } else if (item.type === 'mailbox') {
            ctx.fillRect(-item.size * 0.08, 0, item.size * 0.16, item.size * 0.5);
            ctx.fillRect(-item.size * 0.4, -item.size * 0.42, item.size * 0.8, item.size * 0.55);
        } else if (item.type === 'bench') {
            ctx.fillRect(-item.size/2, -item.size * 0.25, item.size, item.size * 0.22);
            ctx.fillRect(-item.size/2, item.size * 0.08, item.size, item.size * 0.16);
            ctx.fillRect(-item.size * 0.38, item.size * 0.18, item.size * 0.12, item.size * 0.34);
            ctx.fillRect(item.size * 0.26, item.size * 0.18, item.size * 0.12, item.size * 0.34);
        } else if (item.type === 'chair') {
            ctx.fillRect(-item.size * 0.32, -item.size * 0.38, item.size * 0.16, item.size * 0.75);
            ctx.fillRect(-item.size * 0.32, 0, item.size * 0.64, item.size * 0.16);
            ctx.fillRect(item.size * 0.18, item.size * 0.08, item.size * 0.12, item.size * 0.38);
        } else if (item.type === 'table') {
            ctx.fillRect(-item.size/2, -item.size * 0.15, item.size, item.size * 0.22);
            ctx.fillRect(-item.size * 0.35, 0, item.size * 0.12, item.size * 0.45);
            ctx.fillRect(item.size * 0.23, 0, item.size * 0.12, item.size * 0.45);
        } else if (item.type === 'bicycle') {
            ctx.lineWidth = Math.max(2, item.size * 0.08);
            ctx.strokeStyle = item.color;
            ctx.beginPath();
            ctx.arc(-item.size * 0.3, item.size * 0.18, item.size * 0.22, 0, Math.PI * 2);
            ctx.arc(item.size * 0.3, item.size * 0.18, item.size * 0.22, 0, Math.PI * 2);
            ctx.moveTo(-item.size * 0.3, item.size * 0.18);
            ctx.lineTo(0, -item.size * 0.15);
            ctx.lineTo(item.size * 0.3, item.size * 0.18);
            ctx.lineTo(-item.size * 0.08, item.size * 0.18);
            ctx.closePath();
            ctx.stroke();
        } else if (item.type === 'bottle') {
            ctx.fillRect(-item.size * 0.25, -item.size * 0.28, item.size * 0.5, item.size * 0.75);
            ctx.fillRect(-item.size * 0.12, -item.size * 0.48, item.size * 0.24, item.size * 0.24);
        } else {
            ctx.beginPath(); ctx.arc(0, 0, item.size/2, 0, Math.PI * 2); ctx.fill();
        }

        // Labels (DE/EN)
        ctx.globalAlpha = 0.6 * opacity;
        ctx.fillStyle = '#475569';
        ctx.font = 'bold 12px "Outfit", sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(item.label, 0, -item.size/2 - 15);
        ctx.font = 'normal 10px "Outfit", sans-serif';
        ctx.fillText(`(${item.labelEn})`, 0, -item.size/2 - 4);

        ctx.restore();
    });
  };

  // --- Effects ---
  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current && canvasRef.current) {
        const { clientWidth, clientHeight } = containerRef.current;
        viewportRef.current = { w: clientWidth, h: clientHeight };
        canvasRef.current.width = clientWidth;
        canvasRef.current.height = clientHeight;
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    
    const handleMouseMove = (e: MouseEvent) => {
        if (!containerRef.current) return;
        const rect = containerRef.current.getBoundingClientRect();
        const isInside = e.clientX >= rect.left && e.clientX <= rect.right && e.clientY >= rect.top && e.clientY <= rect.bottom;
        if (!isInside) {
          pointerActiveRef.current = false;
          return;
        }
        mouseRef.current = { x: e.clientX - rect.left, y: e.clientY - rect.top };
        pointerActiveRef.current = true;
    };
    window.addEventListener('mousemove', handleMouseMove);

    const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
            e.preventDefault();
            if (gameState === 'playing') setIsPaused(p => !p);
            return;
        }
        const key = e.key.toLowerCase();
        if (['w', 'a', 's', 'd', 'arrowup', 'arrowdown', 'arrowleft', 'arrowright'].includes(key)) {
          e.preventDefault();
          keysRef.current.add(key);
        }
    };
    const handleKeyUp = (e: KeyboardEvent) => {
      keysRef.current.delete(e.key.toLowerCase());
    };
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    const fullscreenHandler = () => {
        setIsFullscreen(!!document.fullscreenElement);
        setTimeout(handleResize, 100);
    };
    document.addEventListener('fullscreenchange', fullscreenHandler);

    return () => {
        window.removeEventListener('resize', handleResize);
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('keydown', handleKeyDown);
        window.removeEventListener('keyup', handleKeyUp);
        document.removeEventListener('fullscreenchange', fullscreenHandler);
    };
  }, [gameState]);

  useEffect(() => {
    if (gameState === 'playing' && !isPaused) {
      lastFrameRef.current = 0;
      requestRef.current = requestAnimationFrame(update);
    }
    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [gameState, isPaused]);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-end justify-between">
        <div>
          <h2 className="text-3xl font-black text-white flex items-center gap-3 italic">
            HOLE.DE <Sparkles className="h-6 w-6 text-amber-400" />
          </h2>
          <p className="text-slate-400 text-sm mt-1">{ui("Consume the city to grow. Use your mouse to steer!")}</p>
        </div>
        <div className="flex gap-3">
            <div className="bg-slate-800 border border-slate-700 px-6 py-3 rounded-2xl text-center shadow-xl">
              <p className="text-[10px] text-slate-500 uppercase tracking-widest font-black mb-0.5">{ui("Size")}</p>
              <p className="text-2xl font-black text-white">{Math.round(playerRef.current.radius)}m</p>
            </div>
            <div className="bg-slate-800 border border-slate-700 px-6 py-3 rounded-2xl text-center shadow-xl">
              <p className="text-[10px] text-slate-500 uppercase tracking-widest font-black mb-0.5">{ui("Score")}</p>
              <p className="text-2xl font-black text-white">{score}</p>
            </div>
            <div className="bg-slate-800 border border-slate-700 px-6 py-3 rounded-2xl text-center shadow-xl">
              <p className="text-[10px] text-slate-500 uppercase tracking-widest font-black mb-0.5">{ui("Best")}</p>
              <p className="text-2xl font-black text-white">{highScore}</p>
            </div>
        </div>
      </div>

      <div 
        ref={containerRef}
        className="relative w-full aspect-video rounded-[2.5rem] overflow-hidden border border-slate-700/50 shadow-2xl bg-slate-900 group"
        onMouseLeave={() => { pointerActiveRef.current = false; }}
      >
        <canvas ref={canvasRef} className="block w-full h-full cursor-none" />

        {/* Fullscreen Toggle */}
        <button 
          onClick={toggleFullscreen}
          className="absolute top-8 right-8 z-20 bg-slate-900/80 backdrop-blur-md border border-slate-700/50 p-2.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-all active:scale-95 shadow-xl"
          title={ui(isFullscreen ? "Exit Fullscreen" : "Enter Fullscreen")}
        >
          {isFullscreen ? <Minimize className="h-5 w-5" /> : <Maximize className="h-5 w-5" />}
        </button>

        {/* Fullscreen Score HUD */}
        {isFullscreen && gameState === 'playing' && (
            <div className="absolute top-8 left-8 flex gap-4 pointer-events-none">
                <div className="bg-slate-900/90 backdrop-blur-xl border border-slate-700/50 px-6 py-3 rounded-2xl text-center shadow-xl">
                    <p className="text-[10px] text-slate-500 uppercase tracking-widest font-black mb-0.5">{ui("Size")}</p>
                    <p className="text-2xl font-black text-white">{Math.round(playerRef.current.radius)}m</p>
                </div>
                <div className="bg-slate-900/90 backdrop-blur-xl border border-slate-700/50 px-6 py-3 rounded-2xl text-center shadow-xl">
                    <p className="text-[10px] text-slate-500 uppercase tracking-widest font-black mb-0.5">{ui("Score")}</p>
                    <p className="text-2xl font-black text-white">{score}</p>
                </div>
            </div>
        )}

        <AnimatePresence>
          {lastCollected && gameState === 'playing' && (
            <motion.div
              animate={{ opacity: 1, y: 0 }}
              className="pointer-events-none absolute bottom-7 left-1/2 z-20 -translate-x-1/2 rounded-2xl border border-white/15 bg-slate-950/88 px-5 py-3 text-center shadow-2xl backdrop-blur-xl"
              exit={{ opacity: 0, y: 8 }}
              initial={{ opacity: 0, y: 8 }}
              key={`${lastCollected.target}-${score}`}
            >
              <p className="text-sm font-black text-white">{lastCollected.target}</p>
              <p className="mt-0.5 text-xs font-semibold text-slate-400">{lastCollected.meaning}</p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* HUD Overlay */}
        <AnimatePresence>
          {gameState === 'idle' && (
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-950/90 backdrop-blur-md flex flex-col items-center justify-center p-8 text-center"
            >
              <div className="max-w-md">
                <div className="w-24 h-24 bg-black rounded-full mx-auto mb-8 shadow-[0_0_40px_rgba(255,255,255,0.1)] border-4 border-white/10" />
                <h3 className="text-4xl font-black text-white mb-4 tracking-tighter uppercase">{ui("Object Collector")}</h3>
                <p className="text-slate-400 mb-10 leading-relaxed">
                  {ui(learnsEnglish
                    ? "Collect city objects while learning their English names. Start small, grow steadily, and avoid larger rivals."
                    : "You are a black hole in a German city. Eat small objects to grow. Once you're big enough, you can consume cars, trees, and even houses!")}
                </p>
                <div className="flex flex-col gap-4">
                    <button 
                    onClick={initGame}
                    className="bg-white text-slate-950 px-12 py-5 rounded-2xl font-black text-xl hover:bg-slate-100 transition-all active:scale-95 flex items-center gap-3 mx-auto shadow-xl"
                    >
                    {ui("Start consuming")} <ChevronRight className="h-6 w-6" />
                    </button>
                    <p className="text-xs text-slate-500">{ui("Press ESC to pause · Mouse or WASD to steer")}</p>
                </div>
              </div>
            </motion.div>
          )}

          {isPaused && gameState === 'playing' && (
            <motion.div 
                initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm z-30 flex flex-col items-center justify-center"
            >
                <div className="bg-slate-900/90 border border-slate-700/50 p-12 rounded-[3rem] shadow-2xl flex flex-col items-center gap-6">
                    <h3 className="text-6xl font-black text-white tracking-widest uppercase italic">{ui("Paused")}</h3>
                    <p className="text-slate-400">{ui("German city life is on hold. Press ESC to resume.")}</p>
                    <button 
                        onClick={() => setIsPaused(false)}
                        className="bg-white text-slate-950 px-10 py-4 rounded-2xl font-black text-lg hover:bg-slate-100 transition-colors shadow-xl active:scale-95 flex items-center gap-2"
                    >
                        {ui("Resume mission")}
                    </button>
                    <button 
                        onClick={() => { setGameState('idle'); setIsPaused(false); }}
                        className="text-slate-500 hover:text-white transition-colors text-sm font-medium"
                    >
                        {ui("Quit to Menu")}
                    </button>
                </div>
            </motion.div>
          )}

          {gameState === 'gameOver' && (
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              className="absolute inset-0 bg-rose-950/95 backdrop-blur-xl flex flex-col items-center justify-center p-8 text-center"
            >
              <h3 className="text-6xl font-black text-white mb-2 uppercase italic tracking-tighter">{ui("Consumed!")}</h3>
              <p className="text-rose-200/60 mb-12">{ui("A larger hole has swallowed you.")}</p>
              
              <div className="bg-white/10 border border-white/10 px-12 py-8 rounded-[2rem] mb-12">
                <p className="text-xs text-rose-300 font-bold uppercase tracking-widest mb-2">{ui("Final Score")}</p>
                <p className="text-7xl font-black text-white">{score}</p>
              </div>

              <button 
                onClick={initGame}
                className="bg-white text-slate-950 px-12 py-5 rounded-2xl font-black text-xl hover:bg-slate-100 transition-all active:scale-95 flex items-center gap-3 mx-auto shadow-xl"
              >
                <RotateCcw className="h-6 w-6" /> {ui("Try again")}
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      
      {/* City Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-slate-800/40 p-6 rounded-3xl border border-slate-700/30 flex items-center gap-4">
              <Map className="h-8 w-8 text-blue-400" />
              <div>
                  <p className="text-white font-bold">{ui("World Size")}</p>
                  <p className="text-slate-500 text-sm">{ui("3000m x 3000m City")}</p>
              </div>
          </div>
          <div className="bg-slate-800/40 p-6 rounded-3xl border border-slate-700/30 flex items-center gap-4">
              <Target className="h-8 w-8 text-emerald-400" />
              <div>
                  <p className="text-white font-bold">{ui("Growth Tier")}</p>
                  <p className="text-slate-500 text-sm">{ui("Houses unlock at 150m")}</p>
              </div>
          </div>
          <div className="bg-slate-800/40 p-6 rounded-3xl border border-slate-700/30 flex items-center gap-4">
              <Sparkles className="h-8 w-8 text-amber-400" />
              <div>
                  <p className="text-white font-bold">{ui("Vocabulary")}</p>
                  <p className="text-slate-300 text-sm">{ui("13 city objects")}</p>
              </div>
          </div>
      </div>
    </div>
  );
}

