import React, { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { BrainCircuit, ChartNoAxesCombined, Compass, Gamepad2, Languages, Menu, X, ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface SidebarProps { 
  activeTab: string; 
  setActiveTab: (tab: string) => void;
  isExpanded: boolean;
  setIsExpanded: (val: boolean) => void;
}

const NAV = [
  { id: "dashboard", icon: Compass,             label: "Today",    sub: "Dashboard" },
  { id: "learn",     icon: BrainCircuit,         label: "Learn",    sub: "Lessons" },
  { id: "games",     icon: Gamepad2,             label: "Games",    sub: "Play & learn" },
  { id: "progress",  icon: ChartNoAxesCombined,  label: "Progress", sub: "Stats" },
];

export function Sidebar({ activeTab, setActiveTab, isExpanded, setIsExpanded }: SidebarProps) {
  const [open, setOpen] = useState(false);

  const items = NAV.map((item) => {
    const active = item.id === activeTab;
    return (
      <button
        key={item.id}
        aria-current={active ? "page" : undefined}
        aria-label={item.label}
        className={cn(
          "relative flex h-11 w-11 items-center justify-center rounded-xl transition-all duration-150",
          active
            ? "bg-[var(--accent-dim)] text-[var(--accent)]"
            : "text-[var(--text-3)] hover:bg-[var(--surface-2)] hover:text-[var(--text-2)]"
        )}
        onClick={() => { setActiveTab(item.id); setOpen(false); }}
        type="button"
      >
        {active && (
          <motion.span
            layoutId="nav-indicator"
            className="absolute left-0 top-2 bottom-2 w-0.5 rounded-full bg-[#58e6d9]"
            transition={{ type: "spring", stiffness: 400, damping: 32 }}
          />
        )}
        <item.icon className="h-5 w-5" />
      </button>
    );
  });

  return (
    <>
      {/* Mobile hamburger */}
      <button
        aria-label={open ? "Close menu" : "Open menu"}
        className="fixed left-4 top-4 z-[140] flex h-9 w-9 items-center justify-center rounded-xl border border-[var(--border)] bg-[var(--surface)] text-[var(--text-2)] lg:hidden"
        onClick={() => setOpen((v) => !v)}
        type="button"
      >
        {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
      </button>

      {/* Desktop sidebar - Floating Island */}
      <motion.aside 
        animate={{ width: isExpanded ? 240 : 80 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className={cn(
          "fixed left-6 top-6 bottom-6 z-50 hidden flex-col rounded-3xl border border-[var(--border)] bg-[var(--surface)]/80 py-8 backdrop-blur-xl lg:flex shadow-[0_8px_32px_rgba(0,0,0,0.4)] overflow-hidden",
          isExpanded ? "items-stretch px-4" : "items-center"
        )}
      >
        {/* Logo / Brand */}
        <div className={cn("flex w-full shrink-0 items-center gap-3", isExpanded ? "px-2" : "justify-center")}>
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[var(--accent)] text-[var(--accent-text)] shadow-[0_0_20px_rgba(88,230,217,0.3)] transition-transform hover:rotate-6 active:scale-95 cursor-pointer">
            <Languages className="h-6 w-6" />
          </div>
          <AnimatePresence>
            {isExpanded && (
              <motion.div
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: "auto" }}
                exit={{ opacity: 0, width: 0 }}
                className="flex flex-col justify-center overflow-hidden whitespace-nowrap"
              >
                <p className="text-base font-black tracking-tight text-[var(--text-1)]">German Lab</p>
                <p className="text-[10px] font-bold uppercase tracking-widest text-[var(--text-2)]">Premium</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Nav */}
        <nav aria-label="Main" className="mt-8 flex w-full flex-1 flex-col gap-2">
          {NAV.map((item) => {
            const active = item.id === activeTab;
            return (
              <button
                key={item.id}
                aria-current={active ? "page" : undefined}
                aria-label={item.label}
                className={cn(
                  "group relative flex items-center rounded-2xl transition-all duration-300 shrink-0",
                  isExpanded ? "h-12 w-full px-4 justify-start gap-4" : "h-14 w-14 justify-center mx-auto",
                  active
                    ? "bg-[var(--accent)]/15 text-[var(--accent)]"
                    : "text-[var(--text-3)] hover:bg-[var(--surface-2)] hover:text-[var(--text-1)]"
                )}
                onClick={() => { setActiveTab(item.id); setOpen(false); }}
                type="button"
              >
                {active && (
                  <motion.span
                    layoutId="nav-indicator"
                    className="absolute inset-0 rounded-2xl border border-[var(--accent)]/50 shadow-[0_4px_15px_rgba(88,230,217,0.15)]"
                    transition={{ type: "spring", stiffness: 300, damping: 25 }}
                  />
                )}
                <item.icon className={cn("h-5 w-5 shrink-0 transition-transform group-hover:scale-110", active && "scale-105")} />
                
                <AnimatePresence>
                  {isExpanded && (
                    <motion.span 
                      initial={{ opacity: 0, width: 0 }}
                      animate={{ opacity: 1, width: "auto" }}
                      exit={{ opacity: 0, width: 0 }}
                      className="font-semibold text-sm whitespace-nowrap overflow-hidden"
                    >
                      {item.label}
                    </motion.span>
                  )}
                </AnimatePresence>

                {/* Tooltip on hover */}
                {!isExpanded && (
                  <span className="absolute left-20 scale-0 rounded-lg bg-[var(--surface-2)] px-2.5 py-1.5 text-xs font-semibold text-[var(--text-1)] shadow-xl transition-all group-hover:left-[calc(100%+0.75rem)] group-hover:scale-100 border border-[var(--border)] whitespace-nowrap opacity-0 group-hover:opacity-100 z-50">
                    {item.label}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Bottom indicator / Toggle */}
        <div className={cn("mt-auto flex w-full shrink-0", isExpanded ? "px-2" : "justify-center")}>
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className={cn(
               "flex items-center rounded-xl bg-[var(--surface-2)] text-[var(--text-3)] hover:bg-[var(--border)] hover:text-[var(--text-1)] transition-colors overflow-hidden",
               isExpanded ? "h-12 w-full px-4 gap-3 text-sm font-medium" : "h-10 w-10 justify-center"
            )}
            title={isExpanded ? "Collapse Sidebar" : "Expand Sidebar"}
          >
            {isExpanded ? <ChevronLeft className="h-5 w-5 shrink-0" /> : <ChevronRight className="h-5 w-5 shrink-0" />}
            <AnimatePresence>
              {isExpanded && (
                <motion.span 
                  initial={{ opacity: 0, width: 0 }}
                  animate={{ opacity: 1, width: "auto" }}
                  exit={{ opacity: 0, width: 0 }}
                  className="whitespace-nowrap"
                >
                  Collapse
                </motion.span>
              )}
            </AnimatePresence>
          </button>
        </div>
      </motion.aside>

      {/* Mobile drawer */}
      <AnimatePresence>
        {open && (
          <motion.div
            animate={{ opacity: 1 }}
            className="fixed inset-0 z-[120] bg-black/60 lg:hidden"
            exit={{ opacity: 0 }}
            initial={{ opacity: 0 }}
            onClick={() => setOpen(false)}
          >
            <motion.aside
              animate={{ x: 0 }}
              className="flex h-full w-64 flex-col border-r border-[var(--border)] bg-[var(--bg)] p-5"
              exit={{ x: -264 }}
              initial={{ x: -264 }}
              onClick={(e) => e.stopPropagation()}
              transition={{ type: "spring", stiffness: 340, damping: 32 }}
            >
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#58e6d9] text-[#0a1f1d]">
                  <Languages className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-[var(--text-1)]">German Lab</p>
                  <p className="text-xs text-[var(--text-3)]">Daily practice</p>
                </div>
              </div>

              <nav aria-label="Main mobile" className="mt-8 flex flex-col gap-1">
                {NAV.map((item) => {
                  const active = item.id === activeTab;
                  return (
                    <button
                      key={item.id}
                      aria-current={active ? "page" : undefined}
                      className={cn(
                        "flex items-center gap-3 rounded-xl px-3 py-2.5 text-left transition-all duration-150",
                        active
                          ? "bg-[var(--accent-dim)] text-[var(--accent)]"
                          : "text-[var(--text-3)] hover:bg-[var(--surface-2)] hover:text-[var(--text-2)]"
                      )}
                      onClick={() => { setActiveTab(item.id); setOpen(false); }}
                      type="button"
                    >
                      <item.icon className="h-4.5 w-4.5 shrink-0" />
                      <div>
                        <p className="text-sm font-medium">{item.label}</p>
                        <p className="text-xs text-[var(--text-3)]">{item.sub}</p>
                      </div>
                    </button>
                  );
                })}
              </nav>
            </motion.aside>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
