import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight, EyeOff, LayoutTemplate, Play, Sparkles, Volume2 } from "lucide-react";
// @ts-ignore
import RGL from "react-grid-layout";
import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";

import { Part } from "@/lib/types";
import { QuickActionDock } from "./Shared";
import { MasteryCard } from "./MasteryCard";
import { cn } from "@/lib/utils";

// @ts-ignore
const ResponsiveGridLayout = RGL.WidthProvider(RGL.Responsive);
type Layout = any;

type ProgressStats = {
  totalXp: number; sessionsCompleted: number;
  totalReviews: number; streak: number; externalWords: number;
};

const DEFAULT_LAYOUT: Layout[] = [
  { i: "welcome", x: 0, y: 0, w: 12, h: 2, minW: 4, minH: 2 },
  { i: "hero",    x: 0, y: 2, w: 12, h: 6, minW: 6, minH: 5 },
  { i: "mastery", x: 0, y: 8, w: 8, h: 8, minW: 6, minH: 6 },
  { i: "actions", x: 8, y: 8, w: 4, h: 3, minW: 4, minH: 3 },
  { i: "path",    x: 0, y: 16, w: 8, h: 9, minW: 5, minH: 5 },
];

export function DashboardView({ currentPart, onOpenLesson, pathParts, progressStats, gameMasteryCount = 0, setActiveTab, activePart }: {
  currentPart?: Part;
  onOpenLesson: (partId: string) => void;
  pathParts: Array<[string, Part]>;
  progressStats: ProgressStats;
  gameMasteryCount?: number;
  setActiveTab: (tab: string) => void;
  activePart?: string;
}) {
  const lessonId  = activePart ?? pathParts[0]?.[0] ?? "part1";
  const theme     = currentPart?.theme ?? "Starter basics";

  const [isEditing, setIsEditing] = useState(false);
  const [layout, setLayout] = useState<Layout[]>(() => {
    const saved = localStorage.getItem("dashboardLayout");
    if (saved) { try { return JSON.parse(saved); } catch (e) {} }
    return JSON.parse(JSON.stringify(DEFAULT_LAYOUT));
  });
  const [hiddenIds, setHiddenIds] = useState<string[]>(() => {
    const saved = localStorage.getItem("dashboardHidden");
    if (saved) { try { return JSON.parse(saved); } catch (e) {} }
    return [];
  });

  const saveLayout = (newLayout: Layout[]) => {
    setLayout(newLayout);
    localStorage.setItem("dashboardLayout", JSON.stringify(newLayout));
  };
  const saveHiddenId = (id: string) => {
    const next = [...hiddenIds, id];
    setHiddenIds(next);
    localStorage.setItem("dashboardHidden", JSON.stringify(next));
  };
  const resetLayout = () => {
    setLayout(JSON.parse(JSON.stringify(DEFAULT_LAYOUT)));
    setHiddenIds([]);
    localStorage.removeItem("dashboardLayout");
    localStorage.removeItem("dashboardHidden");
  };

  const timerRef = useRef<NodeJS.Timeout>();
  const handlePointerDown = () => {
    if (isEditing) return;
    timerRef.current = setTimeout(() => {
      setIsEditing(true);
      if ("vibrate" in navigator) navigator.vibrate(50);
    }, 600);
  };
  const cancelPress = () => { if (timerRef.current) clearTimeout(timerRef.current); };
  useEffect(() => { return () => { if (timerRef.current) clearTimeout(timerRef.current); }; }, []);

  const components = {
    welcome: (
      <div className="flex h-full items-center px-1">
        <div>
          <h2 className="text-[32px] font-bold tracking-tight text-[#1C1C1E] leading-none">Good morning</h2>
          <p className="mt-2 text-[15px] text-[#6E6E73]">Day {progressStats.streak} streak — keep it going</p>
        </div>
      </div>
    ),
    hero: (
      <div className="h-full w-full rounded-[28px] bg-white border border-black/[0.08] shadow-[0_8px_24px_rgba(0,0,0,0.06)] p-8 flex flex-col justify-between">
        <div>
          <div className="flex items-start justify-between">
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#E8F5E9]">
                <div className="w-1.5 h-1.5 rounded-full bg-[#58CC02]" />
                <span className="text-[12px] font-medium text-[#2E7D00] uppercase tracking-wide">{theme}</span>
              </div>
              <h1 className="mt-4 text-[36px] font-bold leading-[1.1] tracking-tight text-[#1C1C1E] max-w-[600px]">
                {currentPart?.description ? currentPart.description.split(".")[0] : "Build German that sticks"}
              </h1>
              <p className="mt-3 text-[16px] leading-[24px] text-[#6E6E73] max-w-[520px]">
                {currentPart?.focus ?? "Core first words, simple sentences, and survival phrases."}
              </p>
            </div>
            <div className="hidden lg:flex items-center justify-center w-20 h-20 rounded-[20px] bg-[#F5F5F7]">
              <span className="text-[36px]">🇩🇪</span>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-5 mt-8">
          <button
            onClick={() => onOpenLesson(lessonId)}
            className="h-12 px-7 rounded-[14px] bg-[#58CC02] hover:bg-[#4CAF00] text-white font-semibold text-[16px] transition-all hover:scale-[1.02] active:scale-[0.98] shadow-[0_4px_12px_rgba(88,204,2,0.25)] flex items-center gap-2"
          >
            <Play className="h-4 w-4 fill-current" />
            Continue
          </button>
          <div className="flex-1 max-w-[320px]">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[12px] font-medium text-[#8E8E93]">PROGRESS</span>
              <span className="text-[12px] font-medium text-[#8E8E93]">68%</span>
            </div>
            <div className="h-2 w-full rounded-full bg-[#F5F5F7] overflow-hidden">
              <div className="h-full w-[68%] rounded-full bg-[#58CC02] transition-all" />
            </div>
          </div>
        </div>
      </div>
    ),
    mastery: (
      <div className="h-full w-full overflow-hidden rounded-[28px] bg-white border border-black/[0.08] shadow-[0_4px_16px_rgba(0,0,0,0.04)] p-7">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-[20px] font-bold tracking-tight text-[#1C1C1E]">Your progress</h3>
          <span className="text-[13px] text-[#6E6E73]">{progressStats.totalReviews} reviews</span>
        </div>
        <MasteryCard totalReviews={progressStats.totalReviews} externalWords={progressStats.externalWords} gameMasteryCount={gameMasteryCount} />
      </div>
    ),
    actions: (
      <div className="h-full w-full" />
    ),
    path: (
      <div className="h-full w-full overflow-hidden rounded-[28px] bg-white border border-black/[0.08] shadow-[0_4px_16px_rgba(0,0,0,0.04)] flex flex-col">
        <div className="flex items-center justify-between px-7 py-5 border-b border-black/[0.06]">
          <h3 className="text-[20px] font-bold tracking-tight text-[#1C1C1E]">Up next</h3>
          <button onClick={() => setActiveTab("learn")} className="text-[14px] font-medium text-[#007AFF] hover:text-[#0051D5] transition">
            View all →
          </button>
        </div>
        <div className="flex-1 overflow-auto">
          {pathParts.slice(0, 4).map(([key, part], i) => (
            <button key={key} className="group flex w-full items-center gap-4 px-7 py-[18px] text-left hover:bg-[#F5F5F7]/60 transition-colors border-b border-black/[0.04] last:border-0" onClick={() => onOpenLesson(key)}>
              <div className={cn(
                "flex h-[52px] w-[52px] shrink-0 items-center justify-center rounded-[16px] text-[17px] font-semibold transition-all",
                i === 0 
                  ? "bg-[#007AFF] text-white shadow-[0_4px_12px_rgba(0,122,255,0.25)]" 
                  : "bg-[#F5F5F7] text-[#6E6E73] group-hover:bg-[#E5E5EA] group-hover:text-[#1C1C1E]"
              )}>
                {i + 1}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-[16px] font-semibold text-[#1C1C1E] group-hover:text-[#007AFF] transition-colors leading-tight">
                  {part.theme}
                </p>
                <div className="flex items-center gap-2.5 mt-1.5">
                  <span className="text-[12px] px-2 py-0.5 rounded-full bg-[#F5F5F7] text-[#6E6E73] font-medium">{part.level}</span>
                  <span className="text-[13px] text-[#8E8E93]">{part.vocab.length} words</span>
                </div>
              </div>
              <ChevronRight className="h-5 w-5 text-[#C7C7CC] group-hover:text-[#007AFF] transition-colors" />
            </button>
          ))}
        </div>
      </div>
    ),
  };

  return (
    <div className="w-screen min-h-screen bg-[var(--bg)] relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw]">
      {/* Fixed bottom dock */}
      <QuickActionDock onStartSession={onOpenLesson} />
      <div className="w-full px-6 sm:px-8 lg:px-12 xl:px-16 2xl:px-20 py-8">
        <div className="w-full max-w-[1600px] mx-auto">
          <AnimatePresence>
            {isEditing && (
              <motion.div
                initial={{ opacity: 0, y: -12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                className="mb-8 flex items-center justify-between rounded-[20px] bg-[#1C1C1E] px-6 py-4"
              >
                <div className="flex items-center gap-3">
                  <LayoutTemplate className="h-5 w-5 text-white/80" />
                  <div>
                    <p className="text-[15px] font-semibold text-white">Customize dashboard</p>
                    <p className="text-[13px] text-white/60">Drag to move • Resize from corner</p>
                  </div>
                </div>
                <div className="flex items-center gap-2.5">
                  <button onClick={resetLayout} className="h-9 px-4 rounded-full bg-white/10 hover:bg-white/15 text-white text-[14px] font-medium transition">Reset</button>
                  <button onClick={() => setIsEditing(false)} className="h-9 px-5 rounded-full bg-white text-[#1C1C1E] text-[14px] font-semibold hover:bg-white/90 transition">Done</button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <ResponsiveGridLayout
            className="layout"
            layouts={{ lg: layout }}
            breakpoints={{ lg: 1280, md: 1024, sm: 768, xs: 480, xxs: 0 }}
            cols={{ lg: 12, md: 12, sm: 6, xs: 4, xxs: 2 }}
            rowHeight={36}
            onLayoutChange={(current) => saveLayout(current)}
            isDraggable={isEditing}
            isResizable={isEditing}
            margin={[24, 24]}
            containerPadding={[0, 0]}
            draggableCancel=".cancel-drag"
            resizeHandles={["se"]}
          >
            {layout.filter(l => !hiddenIds.includes(l.i)).map((l) => (
              <div 
                key={l.i} 
                data-grid={l}
                className={cn(
                  "relative group",
                  isEditing && "ring-2 ring-[#007AFF] ring-offset-4 rounded-[32px] cursor-grab active:cursor-grabbing"
                )}
                onPointerDown={handlePointerDown}
                onPointerUp={cancelPress}
                onPointerLeave={cancelPress}
                onContextMenu={(e) => { if (!isEditing) { e.preventDefault(); setIsEditing(true); } }}
              >
                {isEditing && (
                  <button 
                    onPointerDown={(e) => e.stopPropagation()}
                    onClick={() => saveHiddenId(l.i)}
                    className="absolute -top-3 -right-3 z-50 opacity-0 group-hover:opacity-100 transition-all cancel-drag flex h-8 w-8 items-center justify-center rounded-full bg-[#1C1C1E] text-white shadow-xl hover:scale-110"
                  >
                    <EyeOff className="h-4 w-4" />
                  </button>
                )}
                <div className={cn("h-full w-full", isEditing && "pointer-events-none")}>
                  {components[l.i as keyof typeof components]}
                </div>
              </div>
            ))}
          </ResponsiveGridLayout>
        </div>
      </div>
    </div>
  );
}
