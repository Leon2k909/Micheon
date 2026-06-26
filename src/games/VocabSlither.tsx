import React, { useEffect, useRef, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RotateCcw, Trophy, Volume2, Info, ChevronRight, Sparkles, Maximize, Minimize } from 'lucide-react';
import { speakGerman } from '@/lib/tts';
import { allPartBlueprints, entryFallbacks } from '@/lib/data';
import { recordWordMastery } from '@/lib/mastery';
import { fetchRemoteGermanWordCatalog } from '@/lib/api';

// --- Game Constants ---
const WORLD_SIZE = 4000;
const INITIAL_FOOD_COUNT = 250;
const SNAKE_SPEED = 0.5;
const TURN_SPEED = 0.03;
const SEGMENT_DISTANCE = 11; // Distance between segments
const INITIAL_LENGTH = 15;
const GROWTH_PER_FOOD = 6;
const BOT_COUNT = 15;
const BOT_SNAKE_SPEED = 0.6;
const BOT_TURN_SPEED = 0.02;

// --- Word Bank Category System ---
const ARTICLE_RULES = [
    { suffix: "ung", article: "die" },
    { suffix: "heit", article: "die" },
    { suffix: "keit", article: "die" },
    { suffix: "ion", article: "die" },
    { suffix: "tät", article: "die" },
    { suffix: "ik", article: "die" },
    { suffix: "ur", article: "die" },
    { suffix: "enz", article: "die" },
    { suffix: "anz", article: "die" },
    { suffix: "ei", article: "die" },
    { suffix: "schaft", article: "die" },
    { suffix: "chen", article: "das" },
    { suffix: "lein", article: "das" },
    { suffix: "ment", article: "das" },
    { suffix: "tum", article: "das" },
    { suffix: "um", article: "das" },
    { suffix: "ma", article: "das" },
    { suffix: "ismus", article: "der" },
    { suffix: "ent", article: "der" },
    { suffix: "ant", article: "der" },
    { suffix: "ist", article: "der" },
    { suffix: "or", article: "der" },
    { suffix: "ig", article: "der" },
    { suffix: "ling", article: "der" }
];

const guessArticle = (word: string): string | null => {
    const lower = word.toLowerCase();
    // High-quality rules first
    for (const rule of ARTICLE_RULES) {
        if (lower.endsWith(rule.suffix)) return rule.article;
    }
    // Generic heuristic: 90% of nouns ending in 'e' are 'die'
    if (lower.endsWith('e') && word.length > 3) return "die";
    return null;
};

// Generate categories from our master data
const generateCategories = () => {
    const categories = [
        { name: "Masculin (der)", target: "der", words: [] as {de: string, en: string}[] },
        { name: "Feminin (die)", target: "die", words: [] as {de: string, en: string}[] },
        { name: "Neutrum (das)", target: "das", words: [] as {de: string, en: string}[] }
    ];

    // 1. Load high-quality seeds from app parts
    Object.values(allPartBlueprints).forEach(part => {
        part.seeds.forEach(seed => {
            if (seed.article && seed.de) {
                const cat = categories.find(c => c.target === seed.article);
                if (cat) {
                    const displayWord = seed.de.replace(/^(der|die|das)\s+/i, '');
                    cat.words.push({ de: displayWord, en: seed.fallbackEn || "" });
                }
            }
        });
    });

    // 2. Load from fallbacks database
    Object.values(entryFallbacks).forEach((entry: any) => {
        if (entry.pos === "noun" && entry.word) {
            const article = guessArticle(entry.word);
            if (article) {
                const cat = categories.find(c => c.target === article);
                if (cat && !cat.words.some(w => w.de === entry.word)) {
                    cat.words.push({ de: entry.word, en: entry.glosses?.[0] || "" });
                }
            }
        }
    });
    
    return categories;
};

let CATEGORIES = generateCategories();

interface Point {
  x: number;
  y: number;
}

interface Food extends Point {
  id: number;
  word: string;
  translation: string;
  category: string;
  color: string;
  size: number;
  isBlob?: boolean;
}

interface BotSnake {
    id: number;
    segments: Point[];
    angle: number;
    targetAngle: number;
    color: string;
    length: number;
    nextTurnTime: number;
}

export default function VocabSlither() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const cameraRef = useRef({ x: WORLD_SIZE / 2, y: WORLD_SIZE / 2 });
  const viewportRef = useRef({ w: 0, h: 0 });
  const particlesRef = useRef<any[]>([]); // { x, y, vx, vy, color, life, size }
  
  // Game State
  const [gameState, setGameState] = useState<'idle' | 'playing' | 'gameOver'>('idle');
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(() => {
    try { return parseInt(localStorage.getItem('slither-hs') ?? '0', 10); } catch { return 0; }
  });
  const [currentCategory, setCurrentCategory] = useState(CATEGORIES[0]);
  const [lastEatenWord, setLastEatenWord] = useState<string | null>(null);
  const [isBoosting, setIsBoosting] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const [growAmount, setGrowAmount] = useState(0);
  const [wordsEatenInCurrentTarget, setWordsEatenInCurrentTarget] = useState(0);

  // Refs for high-performance physics (avoiding React re-renders)
  const snakeRef = useRef<{
    segments: Point[];
    angle: number;
    targetAngle: number;
    length: number;
  }>({
    segments: [],
    angle: 0,
    targetAngle: 0,
    length: INITIAL_LENGTH
  });

  const mouseRef = useRef<Point>({ x: 0, y: 0 });
  const foodRef = useRef<Food[]>([]);
  const requestRef = useRef<number>(null);
  const isBoostingRef = useRef(false);
  const scoreAccumulatorRef = useRef(0);
  const botsRef = useRef<BotSnake[]>([]);

  // --- Initialization ---
  const initGame = useCallback(() => {
    const startX = WORLD_SIZE / 2;
    const startY = WORLD_SIZE / 2;
    
    // Select random category
    const cat = CATEGORIES[Math.floor(Math.random() * CATEGORIES.length)];
    setCurrentCategory(cat);

    // Init snake
    const segments: Point[] = [];
    for (let i = 0; i < INITIAL_LENGTH; i++) {
      segments.push({ x: startX - i * SEGMENT_DISTANCE, y: startY });
    }
    snakeRef.current = {
      segments,
      angle: 0,
      targetAngle: 0,
      length: INITIAL_LENGTH
    };

    // Init food
    const initialFood: Food[] = [];
    for (let i = 0; i < INITIAL_FOOD_COUNT; i++) {
      initialFood.push(spawnFood());
    }
    foodRef.current = initialFood;

    // Init bots
    const initialBots: BotSnake[] = [];
    for (let i = 0; i < BOT_COUNT; i++) {
        initialBots.push(spawnBot());
    }
    botsRef.current = initialBots;

    cameraRef.current = { x: startX, y: startY };
    setScore(0);
    setGrowAmount(0);
    setWordsEatenInCurrentTarget(0);
    setGameState('playing');
    setIsPaused(false);
    setLastEatenWord(null);
  }, []);

  const spawnBot = (): BotSnake => {
      const x = Math.random() * WORLD_SIZE;
      const y = Math.random() * WORLD_SIZE;
      const angle = Math.random() * Math.PI * 2;
      const length = 10 + Math.floor(Math.random() * 20);
      const segments: Point[] = [];
      for (let i = 0; i < length; i++) {
          segments.push({ x: x - Math.cos(angle) * i * SEGMENT_DISTANCE, y: y - Math.sin(angle) * i * SEGMENT_DISTANCE });
      }
      
      const botColors = ['#f87171', '#fbbf24', '#a78bfa', '#f472b6', '#60a5fa'];
      
      return {
          id: Math.random(),
          segments,
          angle,
          targetAngle: angle,
          color: botColors[Math.floor(Math.random() * botColors.length)],
          length,
          nextTurnTime: 0
      };
  };

  const spawnFood = useCallback((): Food => {
    // Ensure we have words
    const catsWithWords = CATEGORIES.filter(c => c.words.length > 0);
    const cat = catsWithWords[Math.floor(Math.random() * catsWithWords.length)];
    const wordObj = cat.words[Math.floor(Math.random() * cat.words.length)];

    const colors = {
      "der": "#3b82f6", // Blue
      "die": "#ec4899", // Pink
      "das": "#10b981"  // Green
    };

    const germanWord = wordObj?.de || "Hund";
    let english = (wordObj?.en || "").trim();
    if (!english) {
      // Fall back to the offline gloss dictionary so we always have an English meaning to show.
      const fallback = entryFallbacks[germanWord.toLowerCase()];
      english = fallback?.glosses?.[0] || "";
    }

    return {
      id: Math.random(),
      x: Math.random() * WORLD_SIZE,
      y: Math.random() * WORLD_SIZE,
      word: germanWord,
      translation: english,
      category: cat.target,
      color: colors[cat.target as keyof typeof colors],
      size: 6 + Math.random() * 6
    };
  }, [currentCategory]);

  const spawnParticles = (x: number, y: number, color: string, count: number) => {
    for (let i = 0; i < count; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = 1 + Math.random() * 4;
        particlesRef.current.push({
            x, y,
            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed,
            color,
            life: 1.0,
            decay: 0.01 + Math.random() * 0.02,
            size: 2 + Math.random() * 4
        });
    }
  };

  // --- Input Handlers ---
  const handleMouseMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    let cx, cy;
    
    if ('touches' in e && e.touches.length > 0) {
      cx = e.touches[0].clientX - rect.left;
      cy = e.touches[0].clientY - rect.top;
    } else if ('clientX' in e) {
      cx = (e as React.MouseEvent).clientX - rect.left;
      cy = (e as React.MouseEvent).clientY - rect.top;
    } else {
      return;
    }

    // Relative to screen center
    const dx = cx - viewportRef.current.w / 2;
    const dy = cy - viewportRef.current.h / 2;
    
    // Minimal distance to change angle (prevents jitter when mouse is on head)
    if (Math.sqrt(dx * dx + dy * dy) > 10) {
        snakeRef.current.targetAngle = Math.atan2(dy, dx);
    }
  };

  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().catch(err => console.error(err));
    } else {
      document.exitFullscreen();
    }
  };

  const handleGameOver = () => {
    setGameState('gameOver');
    if (requestRef.current) cancelAnimationFrame(requestRef.current);
  };

  const updateBots = (currentTime: number) => {
    const bots = botsRef.current;
    const snake = snakeRef.current;
    
    bots.forEach(bot => {
        // Wandering AI
        if (currentTime > bot.nextTurnTime) {
            bot.targetAngle += (Math.random() - 0.5) * 2.5;
            bot.nextTurnTime = currentTime + 500 + Math.random() * 2000;
        }

        let diff = bot.targetAngle - bot.angle;
        while (diff < -Math.PI) diff += Math.PI * 2;
        while (diff > Math.PI) diff -= Math.PI * 2;
        bot.angle += diff * BOT_TURN_SPEED;

        const head = bot.segments[0];
        const newHead = {
            x: head.x + Math.cos(bot.angle) * BOT_SNAKE_SPEED,
            y: head.y + Math.sin(bot.angle) * BOT_SNAKE_SPEED
        };

        // Boundary bounce
        if (newHead.x < 0) bot.targetAngle = 0;
        if (newHead.x > WORLD_SIZE) bot.targetAngle = Math.PI;
        if (newHead.y < 0) bot.targetAngle = Math.PI/2;
        if (newHead.y > WORLD_SIZE) bot.targetAngle = -Math.PI/2;

        const newSegments = [newHead];
        let prev = newHead;
        for (let i = 1; i < bot.segments.length; i++) {
            const seg = bot.segments[i];
            const dx = prev.x - seg.x;
            const dy = prev.y - seg.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist > SEGMENT_DISTANCE) {
                const angle = Math.atan2(dy, dx);
                newSegments.push({
                    x: prev.x - Math.cos(angle) * SEGMENT_DISTANCE,
                    y: prev.y - Math.sin(angle) * SEGMENT_DISTANCE
                });
            } else {
                newSegments.push(seg);
            }
            prev = newSegments[i];
        }
        bot.segments = newSegments;
    });

    // Collision Player -> Bot (Squared dist for speed)
    const head = snake.segments[0];
    for (const bot of bots) {
        // Optimization: Only check if head is reasonably close to bot center
        const firstSeg = bot.segments[0];
        const approxDistSq = Math.pow(head.x - firstSeg.x, 2) + Math.pow(head.y - firstSeg.y, 2);
        if (approxDistSq > 1000 * 1000) continue; // Skip bots too far away

        for(const seg of bot.segments) {
            const dx = head.x - seg.x;
            const dy = head.y - seg.y;
            if (dx*dx + dy*dy < 225) { // 15*15
                handleGameOver();
                return;
            }
        }
    }

    // Collision Bot -> Player
    for (let i = 0; i < bots.length; i++) {
        const bot = bots[i];
        const bHead = bot.segments[0];
        
        // Optimization: Only check if bot head is close to player head
        const head = snake.segments[0];
        const approxP = Math.pow(bHead.x - head.x, 2) + Math.pow(bHead.y - head.y, 2);
        if (approxP < 1000 * 1000) {
            for (const pSeg of snake.segments) {
                const dx = bHead.x - pSeg.x;
                const dy = bHead.y - pSeg.y;
                if (dx*dx + dy*dy < 225) { 
                    // Death Logic
                    bot.segments.forEach((s, idx) => {
                        if (idx === 0) spawnParticles(s.x, s.y, bot.color, 40);
                        if (idx % 3 === 0 && foodRef.current.length < 500) {
                            foodRef.current.push({
                                id: Math.random(),
                                x: s.x + (Math.random() - 0.5) * 15,
                                y: s.y + (Math.random() - 0.5) * 15,
                                word: "", translation: "", category: "blob",
                                color: bot.color, size: 8 + Math.random() * 5, isBlob: true
                            });
                        }
                    });
                    bots[i] = spawnBot();
                    setScore(s => s + 100);
                    break;
                }
            }
        }

        // --- SMART AI AVOIDANCE ---
        const detectionRangeSq = 150*150;
        const avoidStrength = 0.15;
        for (const pSeg of snake.segments) {
            const dx = bHead.x - pSeg.x;
            const dy = bHead.y - pSeg.y;
            const dSq = dx*dx + dy*dy;
            if (dSq < detectionRangeSq) {
                const angleToSeg = Math.atan2(dy, dx);
                bot.targetAngle += (bot.targetAngle < angleToSeg ? -avoidStrength : avoidStrength);
                break;
            }
        }
    }
  };

  const update = () => {
    if (gameState !== 'playing' || isPaused) {
       if (isPaused) draw(); // Still draw if paused
       requestRef.current = requestAnimationFrame(update);
       return;
    }

    const snake = snakeRef.current;
    const head = snake.segments[0];

    // Speed calculation (Boost costs score)
    const canBoost = isBoostingRef.current && score > 10;
    const currentSpeed = canBoost ? SNAKE_SPEED * 2.2 : SNAKE_SPEED;

    let diff = snake.targetAngle - snake.angle;
    while (diff < -Math.PI) diff += Math.PI * 2;
    while (diff > Math.PI) diff -= Math.PI * 2;
    snake.angle += diff * TURN_SPEED;

    const newHead = {
      x: head.x + Math.cos(snake.angle) * currentSpeed,
      y: head.y + Math.sin(snake.angle) * currentSpeed
    };

    if (canBoost) {
        scoreAccumulatorRef.current++;
        if (scoreAccumulatorRef.current > 15) {
            setScore(s => Math.max(0, s - 1));
            scoreAccumulatorRef.current = 0;
        }
    }

    if (newHead.x < 0 || newHead.x > WORLD_SIZE || newHead.y < 0 || newHead.y > WORLD_SIZE) {
      handleGameOver();
      return;
    }

    // Update Body Segments
    const newSegments = [newHead];
    let prev = newHead;
    for (let i = 1; i < snake.segments.length; i++) {
        const seg = snake.segments[i];
        const dx = prev.x - seg.x;
        const dy = prev.y - seg.y;
        if (Math.sqrt(dx*dx + dy*dy) > SEGMENT_DISTANCE) {
            const angle = Math.atan2(dy, dx);
            newSegments.push({
                x: prev.x - Math.cos(angle) * SEGMENT_DISTANCE,
                y: prev.y - Math.sin(angle) * SEGMENT_DISTANCE
            });
        } else {
            newSegments.push(seg);
        }
        prev = newSegments[newSegments.length - 1];
    }
    
    // Smooth Length Growth
    if (growAmount > 0) {
        const tail = newSegments[newSegments.length - 1];
        newSegments.push({...tail});
        setGrowAmount(g => g - 1);
    }
    
    snake.segments = newSegments;
    cameraRef.current.x += (head.x - cameraRef.current.x) * 0.1;
    cameraRef.current.y += (head.y - cameraRef.current.y) * 0.1;

    updateBots(performance.now());

    // Food Collision (Optimized distance check)
    const nextFood = [];
    for (const f of foodRef.current) {
        const dx = head.x - f.x;
        const dy = head.y - f.y;
        const distSq = dx*dx + dy*dy;
        if (distSq < 900) { // 30*30
            if (f.category === 'blob') {
                setScore(s => s + 10);
                setGrowAmount(g => g + 8);
            } else if (f.category === currentCategory.target) {
                setScore(s => s + 20);
                setGrowAmount(g => g + GROWTH_PER_FOOD);
                setLastEatenWord(`${f.word} (${f.translation})`);
                speakGerman(f.word);
                recordWordMastery(f.word);
                
                // Track progress for article rotation
                setWordsEatenInCurrentTarget(prev => {
                    const next = prev + 1;
                    if (next >= 5) {
                        const otherCats = CATEGORIES.filter(c => c.target !== currentCategory.target);
                        setCurrentCategory(otherCats[Math.floor(Math.random() * otherCats.length)]);
                        return 0;
                    }
                    return next;
                });
            } else {
                setScore(s => Math.max(0, s - 5));
            }
            // Only respawn if it wasnt a blob
            if (f.category !== 'blob') {
                nextFood.push(spawnFood());
            }
        } else {
            nextFood.push(f);
        }
    }
    foodRef.current = nextFood;

    // Update Particles
    particlesRef.current = particlesRef.current.filter(p => {
        p.x += p.vx;
        p.y += p.vy;
        p.vx *= 0.98; // Friction
        p.vy *= 0.98;
        p.life -= p.decay;
        return p.life > 0;
    });

    draw();
    requestRef.current = requestAnimationFrame(update);
  };

  const draw = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const { w, h } = viewportRef.current;
    const cam = cameraRef.current;

    // Clear background
    ctx.fillStyle = '#111827'; 
    ctx.fillRect(0, 0, w, h);

    // Draw Grid
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
    ctx.lineWidth = 1;
    const gridSize = 100;
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

    // World Border
    ctx.strokeStyle = 'rgba(239, 68, 68, 0.3)';
    ctx.lineWidth = 5;
    ctx.strokeRect(w / 2 - cam.x, h / 2 - cam.y, WORLD_SIZE, WORLD_SIZE);

    // --- 3. DRAW FOOD (CULLING) ---
    const viewportBuffer = 150; 
    foodRef.current.forEach(f => {
      const screenX = f.x - cam.x + w / 2;
      const screenY = f.y - cam.y + h / 2;

      // SKIP OFF-SCREEN FOOD
      if (screenX < -viewportBuffer || screenX > w + viewportBuffer || 
          screenY < -viewportBuffer || screenY > h + viewportBuffer) return;

      if (f.isBlob) {
          ctx.shadowBlur = 15;
          ctx.shadowColor = f.color;
          ctx.fillStyle = f.color;
          ctx.beginPath(); ctx.arc(screenX, screenY, f.size * 1.5, 0, Math.PI * 2); ctx.fill();
          ctx.shadowBlur = 0;
          return;
      }

      // Target article food visuals (Glow + Text)
      const grad = ctx.createRadialGradient(screenX, screenY, 0, screenX, screenY, f.size * 2.5);
      grad.addColorStop(0, f.color + '66');
      grad.addColorStop(1, 'transparent');
      ctx.fillStyle = grad;
      ctx.beginPath(); ctx.arc(screenX, screenY, f.size * 2.5, 0, Math.PI * 2); ctx.fill();

      ctx.fillStyle = f.color;
      ctx.beginPath(); ctx.arc(screenX, screenY, f.size, 0, Math.PI * 2); ctx.fill();

      // Text labels
      ctx.fillStyle = 'white';
      ctx.font = 'bold 13px "Outfit", sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(f.word, screenX, screenY + f.size + 18);
      if (f.translation && f.translation !== "..." && f.translation !== "Discovery") {
          ctx.font = '600 11px "Outfit", sans-serif';
          ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
          ctx.fillText(`(${f.translation})`, screenX, screenY + f.size + 32);
      }
    });

    // --- 4. DRAW BOTS (CULLING) ---
    botsRef.current.forEach(bot => {
        // Draw body segments
        for (let i = bot.segments.length - 1; i >= 0; i--) {
            const seg = bot.segments[i];
            const screenX = seg.x - cam.x + w / 2;
            const screenY = seg.y - cam.y + h / 2;
            
            // Only draw visible segments
            if (screenX > -viewportBuffer && screenX < w + viewportBuffer && 
                screenY > -viewportBuffer && screenY < h + viewportBuffer) {
                
                const size = Math.max(8, 18 - (i * 0.15));
                ctx.fillStyle = i === 0 ? bot.color : bot.color + 'aa';
                ctx.beginPath(); ctx.arc(screenX, screenY, size, 0, Math.PI * 2); ctx.fill();
                
                if (i === 0) { // Eyes
                   ctx.fillStyle = 'white';
                   const eyeX = screenX + Math.cos(bot.angle) * 8;
                   const eyeY = screenY + Math.sin(bot.angle) * 8;
                   ctx.beginPath(); ctx.arc(eyeX, eyeY, 4, 0, Math.PI * 2); ctx.fill();
                   ctx.fillStyle = 'black';
                   ctx.beginPath(); ctx.arc(eyeX, eyeY, 2, 0, Math.PI * 2); ctx.fill();
                }
            }
        }
    });

    // --- 5. DRAW PARTICLES ---
    particlesRef.current.forEach(p => {
        const screenX = p.x - cam.x + w / 2;
        const screenY = p.y - cam.y + h / 2;
        
        if (screenX > -50 && screenX < w + 50 && screenY > -50 && screenY < h + 50) {
            ctx.globalAlpha = p.life;
            ctx.fillStyle = p.color;
            ctx.shadowBlur = 10 * p.life;
            ctx.shadowColor = p.color;
            ctx.beginPath();
            ctx.arc(screenX, screenY, p.size * p.life, 0, Math.PI * 2);
            ctx.fill();
            ctx.shadowBlur = 0;
            ctx.globalAlpha = 1.0;
        }
    });

    // Player
    const snake = snakeRef.current;
    for (let i = snake.segments.length - 1; i >= 0; i--) {
      const seg = snake.segments[i];
      const screenX = seg.x - cam.x + w / 2;
      const screenY = seg.y - cam.y + h / 2;
      if (screenX > -100 && screenX < w + 100 && screenY > -100 && screenY < h + 100) {
        const size = Math.max(10, 20 - (i * 0.1));
        const alpha = Math.max(0.6, 1 - (i / snake.segments.length) * 0.4);
        if (i === 0) {
            const glow = ctx.createRadialGradient(screenX, screenY, 0, screenX, screenY, size * 2.5);
            glow.addColorStop(0, 'rgba(88, 230, 217, 0.4)');
            glow.addColorStop(1, 'transparent');
            ctx.fillStyle = glow;
            ctx.beginPath(); ctx.arc(screenX, screenY, size * 2.5, 0, Math.PI * 2); ctx.fill();
            ctx.fillStyle = '#58e6d9';
            ctx.beginPath(); ctx.arc(screenX, screenY, size, 0, Math.PI * 2); ctx.fill();
            const eyeSize = 6.5;
            const leftEyeX = screenX + Math.cos(snake.angle - 0.5) * 10;
            const leftEyeY = screenY + Math.sin(snake.angle - 0.5) * 10;
            const rightEyeX = screenX + Math.cos(snake.angle + 0.5) * 10;
            const rightEyeY = screenY + Math.sin(snake.angle + 0.5) * 10;
            ctx.fillStyle = 'white';
            ctx.beginPath(); ctx.arc(leftEyeX, leftEyeY, eyeSize, 0, Math.PI * 2); ctx.fill();
            ctx.beginPath(); ctx.arc(rightEyeX, rightEyeY, eyeSize, 0, Math.PI * 2); ctx.fill();
            ctx.fillStyle = '#111827';
            ctx.beginPath(); ctx.arc(leftEyeX + Math.cos(snake.angle) * 2, leftEyeY + Math.sin(snake.angle) * 2, eyeSize/2, 0, Math.PI * 2); ctx.fill();
            ctx.beginPath(); ctx.arc(rightEyeX + Math.cos(snake.angle) * 2, rightEyeY + Math.sin(snake.angle) * 2, eyeSize/2, 0, Math.PI * 2); ctx.fill();
        } else {
            ctx.fillStyle = `rgba(88, 230, 217, ${alpha})`;
            ctx.beginPath(); ctx.arc(screenX, screenY, size, 0, Math.PI * 2); ctx.fill();
        }
      }
    }
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
    window.addEventListener('resize', handleResize);
    const fullscreenChangeHandler = () => {
        setIsFullscreen(!!document.fullscreenElement);
        setTimeout(handleResize, 100);
    };
    document.addEventListener('fullscreenchange', fullscreenChangeHandler);
    handleResize();

    const handleKeyDown = (e: KeyboardEvent) => { 
        if (e.key === ' ') { e.preventDefault(); setIsBoosting(true); } 
        if (e.key === 'Escape') { 
            e.preventDefault(); 
            if (gameState === 'playing') setIsPaused(p => !p); 
        }
    };
    const handleKeyUp = (e: KeyboardEvent) => { if (e.key === ' ') setIsBoosting(false); };

    const handleMouseDown = () => setIsBoosting(true);
    const handleMouseUp = () => setIsBoosting(false);

    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
        window.removeEventListener('resize', handleResize);
        document.removeEventListener('fullscreenchange', fullscreenChangeHandler);
        window.removeEventListener('mousedown', handleMouseDown);
        window.removeEventListener('mouseup', handleMouseUp);
        window.removeEventListener('keydown', handleKeyDown);
        window.removeEventListener('keyup', handleKeyUp);
    };
  }, [gameState]);

  // Load thousands once on mount
  useEffect(() => {
    const loadThousands = async () => {
        try {
            // Using a high-quality community dictionary with Key=German, Value=English
            const response = await fetch("https://raw.githubusercontent.com/hathibelagal/German-English-JSON-Dictionary/master/german_english.json");
            if (!response.ok) return;
            const dictionary = await response.json();
            
            const entries = Object.entries(dictionary);
            // We'll take a large slice (approx 2000 nouns) to keep performance high
            let count = 0;
            for (const [de, en] of entries) {
                if (count > 2000) break;
                
                // Only take single words that look like nouns (Capitalized)
                if (/^[A-Z][a-zäöüß-]+$/.test(de)) {
                    const article = guessArticle(de);
                    if (article) {
                        const cat = CATEGORIES.find(c => c.target === article);
                        if (cat && !cat.words.some(existing => existing.de === de)) {
                            cat.words.push({ de, en: String(en) });
                            count++;
                        }
                    }
                }
            }
            console.log(`VocabSlither: Mass-loaded ${count} dictionary-backed items.`);
        } catch (e) {
            console.warn("Catalog failed", e);
        }
    };
    loadThousands();
  }, []);

  // Sync state to ref for physics loop
  useEffect(() => {
    isBoostingRef.current = isBoosting;
  }, [isBoosting]);

  useEffect(() => {
    if (gameState === 'playing') {
      requestRef.current = requestAnimationFrame(update);
    }
    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [gameState, currentCategory, isPaused]);

  // Periodic Food Refresh to ensure variety
  useEffect(() => {
    const interval = setInterval(() => {
       if (gameState === 'playing' && !isPaused) {
           // Swap 15 random words to keep the arena fresh
           for(let i=0; i<15; i++) {
               const idx = Math.floor(Math.random() * foodRef.current.length);
               if (foodRef.current[idx] && !foodRef.current[idx].isBlob) {
                   foodRef.current[idx] = spawnFood();
               }
           }
       }
    }, 15000);
    return () => clearInterval(interval);
  }, [gameState, isPaused]);

  return (
    <div className="flex flex-col gap-6">
      {/* Outer Header (Only visible when not fullscreen) */}
      {!isFullscreen && (
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 className="text-3xl font-black text-white flex items-center gap-3">
               <span className="bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent">Slither Deutsch</span>
               <Sparkles className="h-6 w-6 text-amber-400 fill-amber-400" />
            </h2>
            <p className="text-slate-400 text-sm mt-1">Collect the correct articles to grow your snake!</p>
          </div>
          <div className="flex gap-4">
            <div className="bg-slate-800/80 border border-slate-700/50 px-6 py-3 rounded-2xl text-center shadow-xl">
              <p className="text-[10px] text-slate-500 uppercase tracking-widest font-black mb-0.5">Score</p>
              <p className="text-2xl font-black text-white">{score}</p>
            </div>
            <div className="bg-slate-800/80 border border-slate-700/50 px-6 py-3 rounded-2xl text-center shadow-xl">
              <p className="text-[10px] text-slate-500 uppercase tracking-widest font-black mb-0.5">Best</p>
              <div className="flex items-center gap-1.5 justify-center">
                <Trophy className="h-4 w-4 text-amber-500" />
                <p className="text-2xl font-black text-white">{highScore}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      <div 
        ref={containerRef}
        className="relative w-full aspect-video rounded-[2.5rem] overflow-hidden border border-slate-700/50 shadow-[0_0_50px_rgba(0,0,0,0.5)] bg-slate-950 group"
        onMouseMove={handleMouseMove}
        onTouchMove={handleMouseMove}
      >
        <canvas 
          ref={canvasRef}
          className="block w-full h-full cursor-none"
          onMouseDown={() => { setIsBoosting(true); }}
          onMouseUp={() => { setIsBoosting(false); }}
          onMouseLeave={() => { setIsBoosting(false); }}
          onTouchStart={() => { setIsBoosting(true); }}
          onTouchEnd={() => { setIsBoosting(false); }}
        />

        {/* Fullscreen Toggle Button */}
        <button 
          onClick={toggleFullscreen}
          className="absolute top-8 right-8 z-20 bg-slate-900/80 backdrop-blur-md border border-slate-700/50 p-2.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-all active:scale-95 shadow-xl"
          title={isFullscreen ? "Exit Fullscreen" : "Enter Fullscreen"}
        >
          {isFullscreen ? <Minimize className="h-5 w-5" /> : <Maximize className="h-5 w-5" />}
        </button>

        {/* Boost Indicator */}
        <AnimatePresence>
            {isBoosting && score > 10 && (
                <motion.div 
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 1.2, opacity: 0 }}
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none text-white/20 font-black text-8xl italic tracking-tighter"
                >
                    BOOST
                </motion.div>
            )}
        </AnimatePresence>

        {/* HUD Overlay (Score & Target) */}
        {gameState === 'playing' && (
          <div className="absolute top-8 left-8 right-8 pointer-events-none flex items-start justify-between">
            {/* Target Info */}
            <motion.div 
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              className="bg-slate-900/90 backdrop-blur-xl border border-slate-700/50 p-6 rounded-3xl shadow-2xl"
            >
              <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest mb-2">Target Article</p>
              <div className="flex items-center gap-5">
                <span className={`text-4xl font-black px-4 py-2 rounded-xl ${
                  currentCategory.target === 'der' ? 'text-blue-400 bg-blue-400/10 border border-blue-400/20 shadow-[0_0_20px_rgba(59,130,246,0.2)]' :
                  currentCategory.target === 'die' ? 'text-pink-400 bg-pink-400/10 border border-pink-400/20 shadow-[0_0_20px_rgba(236,72,153,0.2)]' :
                  'text-emerald-400 bg-emerald-400/10 border border-emerald-400/20 shadow-[0_0_20px_rgba(16,185,129,0.2)]'
                }`}>
                  {currentCategory.target.toUpperCase()}
                </span>
                <div className="space-y-2">
                    <p className="text-xs text-slate-400 font-medium italic">Progression:</p>
                    <div className="flex gap-1.5">
                        {[...Array(5)].map((_, i) => (
                            <div 
                                key={i} 
                                className={`w-3 h-3 rounded-full border border-white/10 transition-all duration-300 ${
                                    i < wordsEatenInCurrentTarget ? 'bg-accent shadow-[0_0_10px_var(--accent)]' : 'bg-slate-800'
                                }`}
                            />
                        ))}
                    </div>
                </div>
              </div>
            </motion.div>

            {/* Fullscreen Score Display (Floating) */}
            {isFullscreen && (
                <div className="flex gap-4">
                    <div className="bg-slate-900/90 backdrop-blur-xl border border-slate-700/50 px-6 py-3 rounded-2xl text-center shadow-xl">
                        <p className="text-[10px] text-slate-500 uppercase tracking-widest font-black mb-0.5">Score</p>
                        <p className="text-2xl font-black text-white">{score}</p>
                    </div>
                    <div className="bg-slate-900/90 backdrop-blur-xl border border-slate-700/50 px-6 py-3 rounded-2xl text-center shadow-xl">
                        <p className="text-[10px] text-slate-500 uppercase tracking-widest font-black mb-0.5">Best</p>
                        <div className="flex items-center gap-1.5 justify-center">
                            <Trophy className="h-4 w-4 text-amber-500" />
                            <p className="text-2xl font-black text-white">{highScore}</p>
                        </div>
                    </div>
                </div>
            )}
          </div>
        )}

        {/* HUD: Feed */}
        <AnimatePresence>
            {lastEatenWord && (
                <motion.div 
                    key={lastEatenWord}
                    initial={{ y: 50, opacity: 0, scale: 0.8 }}
                    animate={{ y: 0, opacity: 1, scale: 1 }}
                    exit={{ y: -50, opacity: 0, scale: 0.8 }}
                    className="absolute bottom-10 left-1/2 -track-x-1/2 flex -translate-x-1/2 items-center gap-3 bg-white/10 backdrop-blur-xl border border-white/20 text-white px-8 py-3 rounded-full font-bold shadow-2xl"
                >
                    <div className="p-2 bg-accent/20 rounded-full">
                        <Volume2 className="h-5 w-5 text-accent" />
                    </div>
                    <span className="text-lg tracking-tight">
                        <span className="opacity-50 font-medium mr-2">{currentCategory.target}</span>
                        {lastEatenWord}
                    </span>
                </motion.div>
            )}
        </AnimatePresence>

        {/* Minimap */}
        {gameState === 'playing' && (
            <div className="absolute bottom-8 right-8 w-40 h-40 bg-slate-900/40 border border-slate-700/30 rounded-3xl overflow-hidden backdrop-blur-md pointer-events-none shadow-2xl">
                <div 
                    className="absolute w-3 h-3 bg-accent rounded-full transition-all duration-100 shadow-[0_0_10px_var(--accent)]"
                    style={{
                        left: (snakeRef.current.segments[0].x / WORLD_SIZE) * 100 + '%',
                        top: (snakeRef.current.segments[0].y / WORLD_SIZE) * 100 + '%',
                        transform: 'translate(-50%, -50%)'
                    }}
                />
                <div className="opacity-20">
                    {foodRef.current.filter((_, i) => i % 15 === 0).map(f => (
                        <div 
                            key={f.id}
                            className="absolute w-1 h-1 rounded-full"
                            style={{
                                backgroundColor: f.color,
                                left: (f.x / WORLD_SIZE) * 100 + '%',
                                top: (f.y / WORLD_SIZE) * 100 + '%',
                                transform: 'translate(-50%, -50%)'
                            }}
                        />
                    ))}
                </div>
                {/* World border on minimap */}
                <div className="absolute inset-0 border border-slate-700/20" />
            </div>
        )}

        {/* Overlays */}
        <AnimatePresence>
          {gameState === 'idle' && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-950/90 backdrop-blur-md flex flex-col items-center justify-center p-8 text-center"
            >
              <div className="max-w-md">
                <motion.div
                  initial={{ scale: 0.5, rotate: -10 }}
                  animate={{ scale: 1, rotate: 0 }}
                  className="w-28 h-28 bg-accent/20 rounded-[2rem] flex items-center justify-center mx-auto mb-8 text-accent shadow-[0_0_30px_rgba(88,230,217,0.2)] border border-accent/20"
                >
                   <Sparkles className="h-14 w-14 fill-accent/10" />
                </motion.div>
                <h3 className="text-4xl font-black text-white mb-4 tracking-tighter uppercase">Enter the Arena</h3>
                <p className="text-slate-400 mb-10 leading-relaxed text-lg">
                  Master the German articles! Guide your snake to consume words that match your target. 
                  Watch out for world boundaries and <b>enemy bots</b>!
                </p>
                <button 
                  onClick={initGame}
                  className="group relative bg-accent hover:bg-emerald-400 text-slate-950 px-12 py-5 rounded-2xl font-black text-xl transition-all active:scale-95 shadow-[0_0_30px_rgba(88,230,217,0.4)] flex items-center gap-3 mx-auto"
                >
                  START SLITHERING 
                  <ChevronRight className="h-6 w-6 transition-transform group-hover:translate-x-1" />
                </button>
              </div>
            </motion.div>
          )}

          {isPaused && gameState === 'playing' && (
            <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm z-30 flex flex-col items-center justify-center"
            >
                <div className="bg-slate-900/90 border border-slate-700/50 p-12 rounded-[3rem] shadow-2xl flex flex-col items-center gap-6">
                    <h3 className="text-6xl font-black text-white tracking-widest uppercase">Paused</h3>
                    <p className="text-slate-400">Press <b>ESC</b> to resume</p>
                    <button 
                        onClick={() => setIsPaused(false)}
                        className="bg-[var(--accent)] text-[var(--accent-text)] px-10 py-4 rounded-2xl font-black text-lg hover:bg-[var(--accent-hover)] transition-colors shadow-xl active:scale-95 flex items-center gap-2"
                    >
                        RESUME GAME
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
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="absolute inset-0 bg-slate-950/95 backdrop-blur-2xl flex flex-col items-center justify-center p-8 text-center"
            >
              <div className="p-4 bg-rose-500/10 rounded-3xl border border-rose-500/20 mb-8">
                <h3 className="text-7xl font-black text-rose-500 mb-2 uppercase tracking-tighter">CRASHED</h3>
              </div>
              
              <div className="grid grid-cols-2 gap-12 mb-16">
                <div className="text-center">
                  <p className="text-slate-500 uppercase text-xs font-black tracking-[0.2em] mb-2">Final Score</p>
                  <p className="text-6xl font-black text-white tabular-nums">{score}</p>
                </div>
                <div className="text-center">
                  <p className="text-slate-500 uppercase text-xs font-black tracking-[0.2em] mb-2">High Score</p>
                  <div className="flex items-center justify-center gap-3">
                    <Trophy className="h-8 w-8 text-amber-500" />
                    <p className="text-6xl font-black text-white tabular-nums">{highScore}</p>
                  </div>
                </div>
              </div>

              <button 
                onClick={initGame}
                className="bg-white hover:bg-slate-100 text-slate-950 px-12 py-5 rounded-2xl font-black text-xl transition-all active:scale-95 flex items-center gap-3 shadow-2xl"
              >
                <RotateCcw className="h-6 w-6" /> TRY AGAIN
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      
      {/* Footer Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-slate-800/20 border border-slate-700/30 p-6 rounded-[2rem] flex items-start gap-5">
            <div className="p-3 bg-blue-500/10 rounded-2xl text-blue-400">
                <Info className="h-6 w-6" />
            </div>
            <div>
                <p className="text-lg font-black text-white mb-1">How to play</p>
                <p className="text-sm text-slate-400 leading-relaxed">
                    Move your mouse to steer. <b>Hold click or Space</b> to boost speed (costs score). 
                    Eat words matching the <b>Target Article</b> to grow. 
                    <b>Avoid hitting Bots!</b> If a bot hits your body, you get bonus points.
                </p>
            </div>
        </div>
        <div className="bg-slate-800/20 border border-slate-700/30 p-6 rounded-[2rem] flex items-center justify-around">
            <div className="flex flex-col items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-blue-500 shadow-[0_0_20px_rgba(59,130,246,0.6)]" />
                <span className="text-xs font-black text-slate-300 tracking-wider">DER</span>
            </div>
            <div className="flex flex-col items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-pink-500 shadow-[0_0_20px_rgba(236,72,153,0.6)]" />
                <span className="text-xs font-black text-slate-300 tracking-wider">DIE</span>
            </div>
            <div className="flex flex-col items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.6)]" />
                <span className="text-xs font-black text-slate-300 tracking-wider">DAS</span>
            </div>
        </div>
      </div>
    </div>
  );
}
