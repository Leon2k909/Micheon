import React, { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowRight,
  Bell,
  BellRing,
  BookOpen,
  Gamepad2,
  Languages,
  LayoutDashboard,
  Menu,
  Search,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";

const NAV = [
  { id: "dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { id: "learn", icon: BookOpen, label: "Lessons" },
  { id: "games", icon: Gamepad2, label: "Practice" },
];

export type TopNavSearchItem = {
  id: string;
  title: string;
  subtitle: string;
  group: string;
  actionLabel?: string;
  onSelect: () => void;
};

export type TopNavNotification = {
  id: string;
  title: string;
  body: string;
  actionLabel?: string;
  unread?: boolean;
  onSelect?: () => void;
};

interface TopNavProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  streak?: number;
  xp?: number;
  userName?: string;
  userInitial?: string;
  onAvatarClick?: () => void;
  notifications?: TopNavNotification[];
  searchItems?: TopNavSearchItem[];
  onBrandClick?: () => void;
  brandName?: string;
  brandIcon?: string;
  onOpenReader?: () => void;
  readerLabel?: string;
}

export function TopNav({
  activeTab,
  setActiveTab,
  streak = 0,
  xp = 0,
  userName = "",
  userInitial,
  onAvatarClick,
  notifications = [],
  searchItems = [],
  onBrandClick,
  brandName = "German Lab",
  brandIcon,
  onOpenReader,
  readerLabel = "Course material",
}: TopNavProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const searchInputRef = useRef<HTMLInputElement | null>(null);
  const initial = userInitial ?? (userName ? userName[0].toUpperCase() : "?");
  const unreadCount = notifications.filter((item) => item.unread).length;
  const filteredSearchItems = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    const items = query
      ? searchItems.filter((item) =>
          `${item.title} ${item.subtitle} ${item.group}`.toLowerCase().includes(query)
        )
      : searchItems;

    return items.slice(0, 9);
  }, [searchItems, searchQuery]);

  useEffect(() => {
    if (!searchOpen) return;
    const id = window.setTimeout(() => searchInputRef.current?.focus(), 80);
    return () => window.clearTimeout(id);
  }, [searchOpen]);

  const openTab = (tab: string) => {
    setActiveTab(tab);
    setMobileOpen(false);
    setSearchOpen(false);
    setNotificationsOpen(false);
  };

  const closeOverlays = () => {
    setSearchOpen(false);
    setNotificationsOpen(false);
    setSearchQuery("");
  };

  const selectSearchItem = (item: TopNavSearchItem) => {
    item.onSelect();
    closeOverlays();
  };

  const selectNotification = (item: TopNavNotification) => {
    item.onSelect?.();
    closeOverlays();
  };

  return (
    <>
      <header className="sticky top-0 z-[110] px-4 pt-4 sm:px-6">
        <div className="mx-auto flex h-[72px] max-w-[1380px] items-center justify-between gap-4 rounded-[22px] border border-[var(--border)] bg-[var(--surface)]/95 px-4 shadow-[0_18px_45px_var(--shadow)] backdrop-blur-xl sm:px-6">
          <button
            className="group flex shrink-0 items-center gap-3 rounded-2xl px-1 text-left"
            onClick={() => (onBrandClick ? onBrandClick() : openTab("dashboard"))}
            type="button"
            aria-label="Switch course"
            title="Switch course"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[var(--ink)] text-[var(--ink-text)] transition-transform group-hover:scale-105 group-hover:shadow-[0_0_12px_0_rgba(157,141,241,0.5)]">
              {brandIcon ? <span className="text-lg font-black">{brandIcon}</span> : <Languages className="h-5 w-5" />}
            </div>
            <div className="hidden sm:block">
              <p className="text-[15px] font-black tracking-tight text-[var(--text-1)]">{brandName}</p>
              <p className="text-[11px] font-semibold text-[var(--text-3)]">{streak} day streak · switch</p>
            </div>
          </button>

          <nav
            aria-label="Main"
            className="hidden h-14 items-center gap-1.5 rounded-full bg-[var(--surface-2)] p-1.5 md:flex"
          >
            {NAV.map((item) => {
              const active = item.id === activeTab;
              return (
                <button
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "flex h-11 items-center gap-2 rounded-full px-[18px] text-[13px] font-bold leading-none transition-all duration-200 active:scale-[0.98]",
                    active
                      ? "bg-neutral-900 text-white shadow-[0_6px_14px_rgba(15,23,42,0.18)]"
                      : "text-[var(--text-1)]/70 hover:bg-[var(--surface)] hover:text-[var(--text-1)]"
                  )}
                  key={item.id}
                  onClick={() => openTab(item.id)}
                  type="button"
                >
                  <item.icon className="h-[17px] w-[17px] shrink-0 stroke-[1.9]" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          <div className="flex shrink-0 items-center gap-2">
            {onOpenReader && (
              <button
                aria-label={readerLabel}
                title={readerLabel}
                onClick={onOpenReader}
                className="hidden h-10 items-center gap-2 rounded-full bg-[var(--accent-dim)] px-3.5 text-[12px] font-black text-[var(--accent)] transition-colors hover:bg-[var(--accent)] hover:text-white sm:flex"
                type="button"
              >
                <BookOpen className="h-4 w-4" />
                <span className="hidden lg:inline">{readerLabel}</span>
              </button>
            )}
            <div className="hidden items-center gap-2 rounded-full bg-[var(--surface-2)] px-3 py-2 text-[12px] font-bold text-[var(--text-2)] lg:flex">
              <span className="h-2 w-2 rounded-full bg-[var(--yellow)]" />
              {xp.toLocaleString()} XP
            </div>
            <button
              aria-label="Search"
              aria-expanded={searchOpen}
              className={cn(
                "hidden h-10 w-10 items-center justify-center rounded-full text-[var(--text-1)] transition-colors sm:flex",
                searchOpen ? "bg-[var(--ink)] text-[var(--ink-text)]" : "hover:bg-[var(--surface-2)]"
              )}
              data-testid="topnav-search"
              onClick={() => {
                setSearchOpen((value) => !value);
                setNotificationsOpen(false);
              }}
              type="button"
            >
              <Search className="h-5 w-5" />
            </button>
            <button
              aria-label="Notifications"
              aria-expanded={notificationsOpen}
              className={cn(
                "relative hidden h-10 w-10 items-center justify-center rounded-full text-[var(--text-1)] transition-colors sm:flex",
                notificationsOpen ? "bg-[var(--ink)] text-[var(--ink-text)]" : "hover:bg-[var(--surface-2)]"
              )}
              data-testid="topnav-notifications"
              onClick={() => {
                setNotificationsOpen((value) => !value);
                setSearchOpen(false);
              }}
              type="button"
            >
              <Bell className="h-5 w-5" />
              {unreadCount > 0 && (
                <span className="absolute right-2 top-2 h-2.5 w-2.5 rounded-full bg-[var(--yellow)] ring-2 ring-[var(--surface)]" />
              )}
            </button>
            <button
              aria-label="Profile"
              className="flex h-11 w-11 items-center justify-center rounded-full bg-[var(--accent-dim)] text-sm font-black text-[var(--accent)] ring-2 ring-[var(--surface)] transition-transform active:scale-95"
              onClick={onAvatarClick}
              type="button"
            >
              {initial}
            </button>
            <button
              aria-label={mobileOpen ? "Close menu" : "Open menu"}
              className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--surface-2)] text-[var(--text-1)] md:hidden"
              onClick={() => setMobileOpen((value) => !value)}
              type="button"
            >
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {searchOpen && (
          <motion.div
            animate={{ opacity: 1 }}
            className="fixed inset-0 z-[130] bg-black/20 px-4 pt-[100px] backdrop-blur-sm"
            exit={{ opacity: 0 }}
            initial={{ opacity: 0 }}
            onClick={closeOverlays}
          >
            <motion.div
              animate={{ opacity: 1, y: 0, scale: 1 }}
              className="mx-auto max-w-2xl rounded-[26px] border border-[var(--border)] bg-[var(--surface)] p-3 shadow-[0_28px_80px_var(--shadow-strong)]"
              data-testid="search-panel"
              exit={{ opacity: 0, y: -8, scale: 0.985 }}
              initial={{ opacity: 0, y: -10, scale: 0.985 }}
              onClick={(event) => event.stopPropagation()}
              transition={{ type: "spring", stiffness: 360, damping: 34 }}
            >
              <div className="relative">
                <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[var(--text-3)]" />
                <input
                  aria-label="Search German Lab"
                  className="h-14 w-full rounded-[20px] border border-[var(--border)] bg-[var(--surface-2)] pl-12 pr-12 text-base font-bold text-[var(--text-1)] outline-none transition-colors placeholder:text-[var(--text-3)] focus:border-[var(--accent)] focus:bg-[var(--surface)]"
                  data-testid="search-input"
                  onChange={(event) => setSearchQuery(event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === "Escape") closeOverlays();
                    if (event.key === "Enter" && filteredSearchItems[0]) selectSearchItem(filteredSearchItems[0]);
                  }}
                  placeholder="Search lessons, practice, progress"
                  ref={searchInputRef}
                  type="text"
                  value={searchQuery}
                />
                <button
                  aria-label="Close search"
                  className="absolute right-3 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full text-[var(--text-3)] hover:bg-[var(--surface-3)] hover:text-[var(--text-1)]"
                  onClick={closeOverlays}
                  type="button"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="mt-3 max-h-[430px] overflow-y-auto">
                {filteredSearchItems.length > 0 ? (
                  <div className="grid gap-2">
                    {filteredSearchItems.map((item) => (
                      <button
                        className="group flex items-center justify-between gap-4 rounded-[18px] bg-[var(--surface-2)] p-4 text-left transition-colors hover:bg-[var(--surface-3)]"
                        data-testid="search-result"
                        key={item.id}
                        onClick={() => selectSearchItem(item)}
                        type="button"
                      >
                        <div className="min-w-0">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="rounded-full bg-[var(--accent-dim)] px-2.5 py-1 text-[10px] font-black text-[var(--accent)]">
                              {item.group}
                            </span>
                            {item.actionLabel && (
                              <span className="text-[11px] font-bold text-[var(--text-3)]">{item.actionLabel}</span>
                            )}
                          </div>
                          <p className="mt-2 truncate text-base font-black text-[var(--text-1)]">{item.title}</p>
                          <p className="mt-1 line-clamp-2 text-sm font-semibold leading-5 text-[var(--text-3)]">{item.subtitle}</p>
                        </div>
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[var(--ink)] text-[var(--ink-text)] transition-transform group-hover:translate-x-0.5">
                          <ArrowRight className="h-4 w-4" />
                        </div>
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="rounded-[20px] bg-[var(--surface-2)] p-6 text-center">
                    <p className="text-sm font-black text-[var(--text-1)]">No matching result</p>
                    <p className="mt-1 text-sm font-semibold text-[var(--text-3)]">Try a lesson name, German topic, or practice type.</p>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {notificationsOpen && (
          <motion.div
            animate={{ opacity: 1 }}
            className="fixed inset-0 z-[130] bg-black/10 px-4 pt-[100px] backdrop-blur-[2px]"
            exit={{ opacity: 0 }}
            initial={{ opacity: 0 }}
            onClick={closeOverlays}
          >
            <motion.aside
              animate={{ opacity: 1, y: 0, scale: 1 }}
              className="ml-auto mr-4 max-w-[420px] rounded-[26px] border border-[var(--border)] bg-[var(--surface)] p-4 shadow-[0_28px_80px_var(--shadow-strong)]"
              data-testid="notifications-panel"
              exit={{ opacity: 0, y: -8, scale: 0.985 }}
              initial={{ opacity: 0, y: -10, scale: 0.985 }}
              onClick={(event) => event.stopPropagation()}
              transition={{ type: "spring", stiffness: 360, damping: 34 }}
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h2 className="text-lg font-black tracking-tight text-[var(--text-1)]">Notifications</h2>
                  <p className="mt-1 text-sm font-semibold text-[var(--text-3)]">
                    {unreadCount > 0 ? `${unreadCount} item${unreadCount === 1 ? "" : "s"} need attention.` : "You are up to date."}
                  </p>
                </div>
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[var(--accent-dim)] text-[var(--accent)]">
                  <BellRing className="h-5 w-5" />
                </div>
              </div>

              <div className="mt-4 grid gap-2">
                {notifications.map((item) => (
                  <button
                    className="flex items-start gap-3 rounded-[18px] bg-[var(--surface-2)] p-4 text-left transition-colors hover:bg-[var(--surface-3)]"
                    data-testid="notification-item"
                    key={item.id}
                    onClick={() => selectNotification(item)}
                    type="button"
                  >
                    <span
                      className={cn(
                        "mt-1 h-2.5 w-2.5 shrink-0 rounded-full",
                        item.unread ? "bg-[var(--yellow)]" : "bg-[var(--border-2)]"
                      )}
                    />
                    <span className="min-w-0 flex-1">
                      <span className="block text-sm font-black text-[var(--text-1)]">{item.title}</span>
                      <span className="mt-1 block text-sm font-semibold leading-5 text-[var(--text-3)]">{item.body}</span>
                      {item.actionLabel && (
                        <span className="mt-3 inline-flex items-center gap-1 text-xs font-black text-[var(--accent)]">
                          {item.actionLabel}
                          <ArrowRight className="h-3.5 w-3.5" />
                        </span>
                      )}
                    </span>
                  </button>
                ))}
              </div>
            </motion.aside>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            animate={{ opacity: 1 }}
            className="fixed inset-0 z-[120] bg-black/20 px-4 pt-[96px] backdrop-blur-sm md:hidden"
            exit={{ opacity: 0 }}
            initial={{ opacity: 0 }}
            onClick={() => setMobileOpen(false)}
          >
            <motion.nav
              animate={{ y: 0, opacity: 1 }}
              className="mx-auto max-w-sm rounded-[24px] border border-[var(--border)] bg-[var(--surface)] p-2 shadow-[0_28px_70px_var(--shadow-strong)]"
              exit={{ y: -8, opacity: 0 }}
              initial={{ y: -8, opacity: 0 }}
              onClick={(event) => event.stopPropagation()}
              transition={{ type: "spring", stiffness: 360, damping: 32 }}
            >
              <div className="grid grid-cols-2 gap-2 p-1">
                <button
                  className="flex items-center justify-center gap-2 rounded-2xl bg-[var(--surface-2)] px-3 py-3 text-sm font-black text-[var(--text-1)]"
                  onClick={() => {
                    setMobileOpen(false);
                    setNotificationsOpen(false);
                    setSearchOpen(true);
                  }}
                  type="button"
                >
                  <Search className="h-4 w-4" />
                  Search
                </button>
                <button
                  className="relative flex items-center justify-center gap-2 rounded-2xl bg-[var(--surface-2)] px-3 py-3 text-sm font-black text-[var(--text-1)]"
                  onClick={() => {
                    setMobileOpen(false);
                    setSearchOpen(false);
                    setNotificationsOpen(true);
                  }}
                  type="button"
                >
                  <Bell className="h-4 w-4" />
                  Alerts
                  {unreadCount > 0 && (
                    <span className="absolute right-3 top-3 h-2.5 w-2.5 rounded-full bg-[var(--yellow)]" />
                  )}
                </button>
              </div>
              {NAV.map((item) => {
                const active = item.id === activeTab;
                return (
                  <button
                    aria-current={active ? "page" : undefined}
                    className={cn(
                      "flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-left text-sm font-bold",
                      active ? "bg-[var(--ink)] text-[var(--ink-text)]" : "text-[var(--text-2)] hover:bg-[var(--surface-2)]"
                    )}
                    key={item.id}
                    onClick={() => openTab(item.id)}
                    type="button"
                  >
                    <item.icon className="h-5 w-5" />
                    {item.label}
                  </button>
                );
              })}
            </motion.nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
