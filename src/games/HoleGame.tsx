import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RotateCcw, Trophy, Maximize, Minimize, ChevronRight, Sparkles, Map, Target } from 'lucide-react';
import { recordWordMastery } from '@/lib/mastery';

// --- Game Constants ---
const WORLD_SIZE = 3000;
const INITIAL_RADIUS = 30;
const MAX_RADIUS = 400;
const BOT_COUNT = 8;
const ITEM_COUNT = 300;

interface GameObject {
  id: number;
  x: number;
  y: number;
  type: 'tree' | 'car' | 'bench' | 'house' | 'person' | 'lamp' | 'mailbox';
  size: number;
  points: number;
  color: string;
  label: string;
  labelEn: string;
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
}

const PROP_TYPES = [
  { type: 'person', size: 12, points: 5, color: '#fca5a5', label: 'die Person', en: 'person' },
  { type: 'bench', size: 25, points: 15, color: '#94a3b8', label: 'die Bank', en: 'bench' },
  { type: 'mailbox', size: 20, points: 10, color: '#ef4444', label: 'der Briefkasten', en: 'mailbox' },
  { type: 'lamp', size: 15, points: 12, color: '#fbbf24', label: 'die Lampe', en: 'lamp' },
  { type: 'car', size: 55, points: 40, color: '#3b82f6', label: 'das Auto', en: 'car' },
  { type: 'tree', size: 70, points: 60, color: '#10b981', label: 'der Baum', en: 'tree' },
  { type: 'house', size: 180, points: 250, color: '#6366f1', label: 'das Haus', en: 'house' },
];

export default function HoleGame() {
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
  
  // Refs for performance
  const playerRef = useRef<Hole>({
    id: 0, x: WORLD_SIZE / 2, y: WORLD_SIZE / 2, radius: INITIAL_RADIUS, color: '#000000', name: 'You', score: 0, targetAngle: 0, angle: 0, isDead: false
  });
  const botsRef = useRef<Hole[]>([]);
  const itemsRef = useRef<GameObject[]>([]);
  const cameraRef = useRef({ x: WORLD_SIZE / 2, y: WORLD_SIZE / 2 });
  const viewportRef = useRef({ w: 0, h: 0 });
  const mouseRef = useRef({ x: 0, y: 0 });
  const requestRef = useRef<number>(null);

  // --- Initialization ---
  const initGame = () => {
    const startX = WORLD_SIZE / 2;
    const startY = WORLD_SIZE / 2;

    playerRef.current = {
      id: 0, x: startX, y: startY, radius: INITIAL_RADIUS, color: '#000000', name: 'You', score: 0, targetAngle: 0, angle: 0, isDead: false
    };

    const initialItems: GameObject[] = [];
    for (let i = 0; i < ITEM_COUNT; i++) {
        initialItems.push(spawnItem());
    }
    itemsRef.current = initialItems;

    const initialBots: Hole[] = [];
    const botColors = ['#dc2626', '#16a34a', '#2563eb', '#9333ea', '#ea580c'];
    for (let i = 0; i < BOT_COUNT; i++) {
        initialBots.push({
            id: i + 1,
            x: Math.random() * WORLD_SIZE,
            y: Math.random() * WORLD_SIZE,
            radius: INITIAL_RADIUS + Math.random() * 20,
            color: botColors[i % botColors.length],
            name: `Bot ${i + 1}`,
            score: 0, targetAngle: Math.random() * Math.PI * 2, angle: 0, isDead: false
        });
    }
    botsRef.current = initialBots;

    cameraRef.current = { x: startX, y: startY };
    setScore(0);
    setGameState('playing');
  };

  const spawnItem = (): GameObject => {
      const prop = PROP_TYPES[Math.floor(Math.random() * PROP_TYPES.length)];
      return {
          id: Math.random(),
          x: 50 + Math.random() * (WORLD_SIZE - 100),
          y: 50 + Math.random() * (WORLD_SIZE - 100),
          type: prop.type as any,
          size: prop.size,
          points: prop.points,
          color: prop.color,
          label: prop.label,
          labelEn: prop.en,
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

  const update = () => {
    if (gameState !== 'playing') return;

    const player = playerRef.current;
    const { w, h } = viewportRef.current;
    
    // POSITIONAL STEERING (Agar.io/Hole.io Style: Steer relative to hole's screen position)
    const sx = player.x - cameraRef.current.x + w / 2;
    const sy = player.y - cameraRef.current.y + h / 2;
    
    const dx = mouseRef.current.x - sx;
    const dy = mouseRef.current.y - sy;
    const distSq = dx*dx + dy*dy;
    
    if (distSq > 225) { // 15px deadzone
        const dist = Math.sqrt(distSq);
        const holeSpeed = 4.5;
        player.x += (dx / dist) * holeSpeed;
        player.y += (dy / dist) * holeSpeed;
    }

    // Bounds
    player.x = Math.max(0, Math.min(WORLD_SIZE, player.x));
    player.y = Math.max(0, Math.min(WORLD_SIZE, player.y));

    // Smooth Camera Following
    cameraRef.current.x += (player.x - cameraRef.current.x) * 0.1;
    cameraRef.current.y += (player.y - cameraRef.current.y) * 0.1;

    // --- ITEM PHYSICS ---
    itemsRef.current = itemsRef.current.filter(item => {
        // Check if inside player
        const dx = player.x - item.x;
        const dy = player.y - item.y;
        const distSq = dx*dx + dy*dy;
        
        if (distSq < Math.pow(player.radius, 2)) {
            if (player.radius > item.size * 1.2) { // Only eat if hole is big enough
                item.isBeingEaten = true;
                item.eatenProgress += 0.05;
                if (item.eatenProgress >= 1) {
                    player.radius = Math.min(MAX_RADIUS, player.radius + item.points * 0.02);
                    setScore(s => s + item.points);
                    recordWordMastery(item.label);
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
                    if (bot.radius > item.size * 1.2) {
                        bot.radius = Math.min(MAX_RADIUS, bot.radius + item.points * 0.02);
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
        if (Math.random() < 0.02) bot.targetAngle = Math.random() * Math.PI * 2;
        bot.x += Math.cos(bot.targetAngle) * 2;
        bot.y += Math.sin(bot.targetAngle) * 2;
        
        // Bounce off walls
        if (bot.x < 0 || bot.x > WORLD_SIZE) bot.targetAngle = Math.PI - bot.targetAngle;
        if (bot.y < 0 || bot.y > WORLD_SIZE) bot.targetAngle = -bot.targetAngle;
        
        // Bot vs Player collision
        const dx = player.x - bot.x;
        const dy = player.y - bot.y;
        const dSq = dx*dx + dy*dy;
        if (dSq < Math.pow(player.radius, 2) && player.radius > bot.radius * 1.3) {
            bot.isDead = true;
            player.radius += bot.radius * 0.5;
            setScore(s => s + 500);
        } else if (dSq < Math.pow(bot.radius, 2) && bot.radius > player.radius * 1.3) {
            setGameState('gameOver');
        }
    });
    botsRef.current = botsRef.current.filter(b => !b.isDead);
    while (botsRef.current.length < BOT_COUNT) {
        botsRef.current.push({...spawnBot(), id: Math.random()});
    }

    draw();
    requestRef.current = requestAnimationFrame(update);
  };

  const spawnBot = (): Hole => {
    const x = Math.random() * WORLD_SIZE;
    const y = Math.random() * WORLD_SIZE;
    return {
        id: Math.random(),
        x, y,
        radius: INITIAL_RADIUS + Math.random() * 30,
        color: '#dc2626',
        name: 'Bot',
        score: 0, targetAngle: Math.random() * Math.PI * 2, angle: 0, isDead: false
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
            ctx.fillRect(-item.size/2, -item.size/4, item.size, item.size/2);
            ctx.fillStyle = 'rgba(255,255,255,0.3)';
            ctx.fillRect(-item.size/3, -item.size/5, item.size/4, item.size/10);
        } else if (item.type === 'house') {
            ctx.fillRect(-item.size/2, -item.size/2, item.size, item.size);
            ctx.fillStyle = '#4338ca'; // Roof
            ctx.beginPath();
            ctx.moveTo(-item.size/2, -item.size/2);
            ctx.lineTo(0, -item.size*0.8);
            ctx.lineTo(item.size/2, -item.size/2);
            ctx.fill();
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
        mouseRef.current = { x: e.clientX - rect.left, y: e.clientY - rect.top };
    };
    window.addEventListener('mousemove', handleMouseMove);

    const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
            e.preventDefault();
            if (gameState === 'playing') setIsPaused(p => !p);
        }
    };
    window.addEventListener('keydown', handleKeyDown);

    const fullscreenHandler = () => {
        setIsFullscreen(!!document.fullscreenElement);
        setTimeout(handleResize, 100);
    };
    document.addEventListener('fullscreenchange', fullscreenHandler);

    return () => {
        window.removeEventListener('resize', handleResize);
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('keydown', handleKeyDown);
        document.removeEventListener('fullscreenchange', fullscreenHandler);
    };
  }, [gameState]);

  useEffect(() => {
    if (gameState === 'playing' && !isPaused) {
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
          <p className="text-slate-400 text-sm mt-1">Consume the city to grow. Use your mouse to steer!</p>
        </div>
        <div className="flex gap-4">
            <div className="bg-slate-800 border border-slate-700 px-6 py-3 rounded-2xl text-center shadow-xl">
              <p className="text-[10px] text-slate-500 uppercase tracking-widest font-black mb-0.5">Size</p>
              <p className="text-2xl font-black text-white">{Math.round(playerRef.current.radius)}m</p>
            </div>
            <div className="bg-slate-800 border border-slate-700 px-6 py-3 rounded-2xl text-center shadow-xl">
              <p className="text-[10px] text-slate-500 uppercase tracking-widest font-black mb-0.5">Score</p>
              <p className="text-2xl font-black text-white">{score}</p>
            </div>
        </div>
      </div>

      <div 
        ref={containerRef}
        className="relative w-full aspect-video rounded-[2.5rem] overflow-hidden border border-slate-700/50 shadow-2xl bg-slate-900 group"
      >
        <canvas ref={canvasRef} className="block w-full h-full cursor-none" />

        {/* Fullscreen Toggle */}
        <button 
          onClick={toggleFullscreen}
          className="absolute top-8 right-8 z-20 bg-slate-900/80 backdrop-blur-md border border-slate-700/50 p-2.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-all active:scale-95 shadow-xl"
          title={isFullscreen ? "Exit Fullscreen" : "Enter Fullscreen"}
        >
          {isFullscreen ? <Minimize className="h-5 w-5" /> : <Maximize className="h-5 w-5" />}
        </button>

        {/* Fullscreen Score HUD */}
        {isFullscreen && gameState === 'playing' && (
            <div className="absolute top-8 left-8 flex gap-4 pointer-events-none">
                <div className="bg-slate-900/90 backdrop-blur-xl border border-slate-700/50 px-6 py-3 rounded-2xl text-center shadow-xl">
                    <p className="text-[10px] text-slate-500 uppercase tracking-widest font-black mb-0.5">Size</p>
                    <p className="text-2xl font-black text-white">{Math.round(playerRef.current.radius)}m</p>
                </div>
                <div className="bg-slate-900/90 backdrop-blur-xl border border-slate-700/50 px-6 py-3 rounded-2xl text-center shadow-xl">
                    <p className="text-[10px] text-slate-500 uppercase tracking-widest font-black mb-0.5">Score</p>
                    <p className="text-2xl font-black text-white">{score}</p>
                </div>
            </div>
        )}

        {/* HUD Overlay */}
        <AnimatePresence>
          {gameState === 'idle' && (
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-950/90 backdrop-blur-md flex flex-col items-center justify-center p-8 text-center"
            >
              <div className="max-w-md">
                <div className="w-24 h-24 bg-black rounded-full mx-auto mb-8 shadow-[0_0_40px_rgba(255,255,255,0.1)] border-4 border-white/10" />
                <h3 className="text-4xl font-black text-white mb-4 tracking-tighter uppercase">Object Collector</h3>
                <p className="text-slate-400 mb-10 leading-relaxed">
                  You are a black hole in a German city. Eat small objects to grow. 
                  Once you're big enough, you can consume cars, trees, and even houses! 
                </p>
                <div className="flex flex-col gap-4">
                    <button 
                    onClick={initGame}
                    className="bg-white text-slate-950 px-12 py-5 rounded-2xl font-black text-xl hover:bg-slate-100 transition-all active:scale-95 flex items-center gap-3 mx-auto shadow-xl"
                    >
                    START CONSUMING <ChevronRight className="h-6 w-6" />
                    </button>
                    <p className="text-xs text-slate-500">Press ESC to pause â€¢ Mouse to steer</p>
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
                    <h3 className="text-6xl font-black text-white tracking-widest uppercase italic">Paused</h3>
                    <p className="text-slate-400">German city life is on hold. Press <b>ESC</b> to resume.</p>
                    <button 
                        onClick={() => setIsPaused(false)}
                        className="bg-white text-slate-950 px-10 py-4 rounded-2xl font-black text-lg hover:bg-slate-100 transition-colors shadow-xl active:scale-95 flex items-center gap-2"
                    >
                        RESUME MISSION
                    </button>
                    <button 
                        onClick={() => { setGameState('idle'); setIsPaused(false); }}
                        className="text-slate-500 hover:text-white transition-colors text-sm font-medium"
                    >
                        Quit to Menu
                    </button>
                </div>
            </motion.div>
          )}

          {gameState === 'gameOver' && (
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              className="absolute inset-0 bg-rose-950/95 backdrop-blur-xl flex flex-col items-center justify-center p-8 text-center"
            >
              <h3 className="text-6xl font-black text-white mb-2 uppercase italic tracking-tighter">CONSUMED!</h3>
              <p className="text-rose-200/60 mb-12">A larger hole has swallowed you.</p>
              
              <div className="bg-white/10 border border-white/10 px-12 py-8 rounded-[2rem] mb-12">
                <p className="text-xs text-rose-300 font-bold uppercase tracking-widest mb-2">Final Score</p>
                <p className="text-7xl font-black text-white">{score}</p>
              </div>

              <button 
                onClick={initGame}
                className="bg-white text-slate-950 px-12 py-5 rounded-2xl font-black text-xl hover:bg-slate-100 transition-all active:scale-95 flex items-center gap-3 mx-auto shadow-xl"
              >
                <RotateCcw className="h-6 w-6" /> TRY AGAIN
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
                  <p className="text-white font-bold">World Size</p>
                  <p className="text-slate-500 text-sm">3000m x 3000m City</p>
              </div>
          </div>
          <div className="bg-slate-800/40 p-6 rounded-3xl border border-slate-700/30 flex items-center gap-4">
              <Target className="h-8 w-8 text-emerald-400" />
              <div>
                  <p className="text-white font-bold">Growth Tier</p>
                  <p className="text-slate-500 text-sm">Houses unlock at 150m</p>
              </div>
          </div>
          <div className="bg-slate-800/40 p-6 rounded-3xl border border-slate-700/30 flex items-center gap-4">
              <Sparkles className="h-8 w-8 text-amber-400" />
              <div>
                  <p className="text-white font-bold">Vocabulary</p>
                  <p className="text-slate-300 text-sm">7 Unique City Objects</p>
              </div>
          </div>
      </div>
    </div>
  );
}

