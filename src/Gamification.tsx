import React, { useRef, useState } from "react";
import { motion } from "framer-motion";
import {
  BarChart3,
  BookOpen,
  CalendarDays,
  Camera,
  Check,
  Flame,
  Moon,
  Pencil,
  ShieldCheck,
  Sun,
  Target,
  Trophy,
  LogOut,
  Zap,
} from "lucide-react";
import { setAuthUser, UserProfile } from "@/lib/profileStorage";

/** Read an image file, downscale it, and return a small JPEG data URL for local storage. */
async function fileToAvatarDataUrl(file: File, max = 256): Promise<string> {
  const dataUrl = await new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
  const img = await new Promise<HTMLImageElement>((resolve, reject) => {
    const i = new Image();
    i.onload = () => resolve(i);
    i.onerror = reject;
    i.src = dataUrl;
  });
  const scale = Math.min(1, max / Math.max(img.width, img.height));
  const w = Math.max(1, Math.round(img.width * scale));
  const h = Math.max(1, Math.round(img.height * scale));
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d");
  if (!ctx) return dataUrl;
  ctx.drawImage(img, 0, 0, w, h);
  return canvas.toDataURL("image/jpeg", 0.85);
}
import { getEnglishVariant, resolveEnglishVariant, setEnglishVariant, type EnglishVariant } from "@/lib/englishVariant";
import { applyTheme, getTheme, type Theme } from "@/lib/theme";
import { applyEffects, getEffects, type Effects } from "@/lib/effects";
import { ActivityCard } from "@/components/lab/ActivityCard";
import { VocabTracker } from "@/components/lab/VocabTracker";
import { cn } from "@/lib/utils";

type Stats = {
  totalXp: number;
  sessionsCompleted: number;
  totalReviews: number;
  streak: number;
  externalWords: number;
};

type Level = { level: number; label: string; xpRequired: number };

const LEVELS: Level[] = [
  { level: 1, label: "Getting started", xpRequired: 0 },
  { level: 2, label: "Daily learner", xpRequired: 100 },
  { level: 3, label: "Sentence builder", xpRequired: 300 },
  { level: 4, label: "Practical speaker", xpRequired: 650 },
  { level: 5, label: "Conversation ready", xpRequired: 1100 },
  { level: 6, label: "Confident learner", xpRequired: 1800 },
  { level: 7, label: "Advanced routine", xpRequired: 2800 },
  { level: 8, label: "Long-term fluency", xpRequired: 4200 },
];

const MILESTONES = [
  { id: "first_session", label: "First lesson", desc: "Complete one guided lesson.", check: (s: Stats) => s.sessionsCompleted >= 1 },
  { id: "streak_3", label: "Three-day streak", desc: "Return for three separate days.", check: (s: Stats) => s.streak >= 3 },
  { id: "reviews_50", label: "50 review items", desc: "Build recognition through recall.", check: (s: Stats) => s.totalReviews >= 50 },
  { id: "xp_500", label: "500 XP", desc: "Show steady practice momentum.", check: (s: Stats) => s.totalXp >= 500 },
  { id: "words_200", label: "200 tracked words", desc: "Combine lessons and word-bank items.", check: (s: Stats) => s.totalReviews + s.externalWords >= 200 },
  { id: "week", label: "Seven-day rhythm", desc: "Keep a full week of returns.", check: (s: Stats) => s.streak >= 7 },
];

export function getLevelInfo(xp: number) {
  let cur = LEVELS[0];
  let nxt: Level | null = LEVELS[1];
  for (let i = 0; i < LEVELS.length; i += 1) {
    if (xp >= LEVELS[i].xpRequired) {
      cur = LEVELS[i];
      nxt = LEVELS[i + 1] ?? null;
    }
  }
  const into = xp - cur.xpRequired;
  const needed = nxt ? nxt.xpRequired - cur.xpRequired : 1;
  const pct = nxt ? Math.min(100, Math.round((into / needed) * 100)) : 100;
  return { cur, nxt, pct, into, needed };
}

export function XpBar({ totalXp, streak }: { totalXp: number; streak: number }) {
  const { cur, pct } = getLevelInfo(totalXp);
  return (
    <div className="flex items-center gap-2 rounded-full bg-[var(--surface)] px-3 py-2 text-xs font-black text-[var(--text-1)]">
      <Flame className="h-4 w-4 text-[var(--orange)]" />
      <span>{streak}</span>
      <span className="h-1 w-1 rounded-full bg-[var(--border-2)]" />
      <span>Lv {cur.level}</span>
      <div className="h-1.5 w-16 rounded-full bg-[var(--surface-3)]">
        <div className="h-full rounded-full bg-[var(--accent)]" style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

function StatCard({ icon: Icon, label, value, color }: {
  icon: React.ElementType;
  label: string;
  value: string;
  color: string;
}) {
  return (
    <div className="card p-5">
      <div className="flex items-center justify-between">
        <div className={`flex h-11 w-11 items-center justify-center rounded-2xl ${color} ${color.includes("--ink") ? "text-[var(--ink-text)]" : "text-white"}`}>
          <Icon className="h-5 w-5" />
        </div>
      </div>
      <p className="mt-5 text-3xl font-black tracking-tight text-[var(--text-1)]">{value}</p>
      <p className="mt-1 text-sm font-semibold text-[var(--text-3)]">{label}</p>
    </div>
  );
}

function ProgressSummaryCard({
  cur,
  nxt,
  pct,
  into,
  needed,
  stats,
  words,
  earned,
}: {
  cur: Level;
  nxt: Level | null;
  pct: number;
  into: number;
  needed: number;
  stats: Stats;
  words: number;
  earned: number;
}) {
  const xpToNext = nxt ? Math.max(0, needed - into) : 0;
  const nextMilestone = MILESTONES.find((item) => !item.check(stats));

  return (
    <section className="card flex min-w-0 flex-col justify-between overflow-hidden p-5 sm:p-6">
      <div>
        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded-full bg-[var(--accent-dim)] px-3 py-1 text-xs font-black text-[var(--accent)]">
            Level {cur.level}
          </span>
          <span className="rounded-full bg-[var(--surface-2)] px-3 py-1 text-xs font-black text-[var(--text-2)]">
            {cur.label}
          </span>
        </div>
        <h1 className="mt-5 text-3xl font-black leading-tight tracking-tight text-[var(--text-1)]">
          Your German progress
        </h1>
        <p className="mt-3 text-sm font-semibold leading-6 text-[var(--text-2)]">
          Your level, next target, and practice momentum in one place.
        </p>
      </div>

      <div className="mt-6 rounded-[24px] bg-[var(--surface-2)] p-4">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <p className="text-xs font-black text-[var(--text-3)]">Next level</p>
            <p className="mt-1 truncate text-lg font-black text-[var(--text-1)]">
              {nxt ? nxt.label : "Long-term fluency"}
            </p>
            <p className="mt-1 text-xs font-semibold text-[var(--text-3)]">
              {nxt ? `${xpToNext.toLocaleString()} XP left` : "Maximum level reached"}
            </p>
          </div>
          <div className="rounded-2xl bg-[var(--surface)] px-3 py-2 text-right shadow-[inset_0_0_0_1px_var(--border)]">
            <p className="text-2xl font-black leading-none text-[var(--text-1)]">{pct}%</p>
            <p className="mt-1 text-[10px] font-black text-[var(--text-3)]">level</p>
          </div>
        </div>
        <div className="mt-4 h-3 rounded-full bg-[var(--surface)]">
          <motion.div
            animate={{ width: `${pct}%` }}
            className="h-full rounded-full bg-[var(--yellow)]"
            initial={{ width: 0 }}
            transition={{ duration: 0.55 }}
          />
        </div>
        <div className="mt-3 flex items-center justify-between text-xs font-semibold text-[var(--text-3)]">
          <span>{into.toLocaleString()} XP in level</span>
          <span>{needed.toLocaleString()} XP goal</span>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-3 gap-3">
        {[
          { label: "XP", value: stats.totalXp.toLocaleString() },
          { label: "Words", value: words.toLocaleString() },
          { label: "Milestones", value: `${earned}/6` },
        ].map((item) => (
          <div className="rounded-[18px] bg-[var(--surface-2)] p-3" key={item.label}>
            <p className="text-lg font-black leading-none text-[var(--text-1)]">{item.value}</p>
            <p className="mt-1 text-[11px] font-semibold text-[var(--text-3)]">{item.label}</p>
          </div>
        ))}
      </div>

      <div className="mt-4 rounded-[20px] bg-[var(--accent)] p-4 text-white">
        <div className="flex items-start gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/12">
            <Target className="h-4 w-4" />
          </div>
          <div className="min-w-0">
            <p className="text-xs font-bold opacity-70">Next target</p>
            <p className="mt-1 text-sm font-black">{nextMilestone?.label ?? "Keep the rhythm"}</p>
            <p className="mt-1 text-xs font-semibold leading-5 opacity-75">
              {nextMilestone?.desc ?? "You have reached every current milestone."}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

function ActivitySidePanel({ stats, words, earned }: { stats: Stats; words: number; earned: number }) {
  return (
    <aside className="card flex min-w-0 flex-col justify-between p-5 sm:p-6">
      <div>
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-sm font-black text-[var(--text-1)]">This week</p>
            <p className="mt-1 text-xs font-semibold text-[var(--text-3)]">Quick read on your practice rhythm.</p>
          </div>
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[var(--accent-dim)] text-[var(--accent)]">
            <CalendarDays className="h-5 w-5" />
          </div>
        </div>

        <div className="mt-6 space-y-3">
          {[
            { label: "Day streak", value: `${stats.streak}`, tone: "bg-[var(--orange)]" },
            { label: "Sessions", value: `${stats.sessionsCompleted}`, tone: "bg-[var(--mint)]" },
            { label: "Milestones", value: `${earned}/6`, tone: "bg-[var(--accent)]" },
          ].map((item) => (
            <div className="rounded-[18px] bg-[var(--surface-2)] p-4" key={item.label}>
              <div className="flex items-center justify-between gap-3">
                <p className="text-xs font-bold text-[var(--text-3)]">{item.label}</p>
                <span className={`h-2.5 w-2.5 rounded-full ${item.tone}`} />
              </div>
              <p className="mt-2 text-2xl font-black tracking-tight text-[var(--text-1)]">{item.value}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-4 rounded-[20px] bg-[var(--accent)] p-4 text-white">
        <p className="text-xs font-bold opacity-70">Words tracked</p>
        <p className="mt-1 text-3xl font-black tracking-tight">{words.toLocaleString()}</p>
        <p className="mt-3 text-xs font-semibold opacity-75">
          Keep short daily blocks going before adding longer review sessions.
        </p>
      </div>
    </aside>
  );
}

export default function GamificationPanel({
  stats,
  user,
  onUpdateStats,
  profileOnly = false,
  apiParts = {},
  onSwitchCourse,
  activeCourseName = "German",
}: {
  stats: Stats;
  user: UserProfile;
  onUpdateStats?: (next: Partial<Stats>) => void;
  profileOnly?: boolean;
  apiParts?: Record<string, any>;
  onSwitchCourse?: () => void;
  activeCourseName?: string;
}) {
  const [externalInput, setExternalInput] = useState(stats.externalWords.toString());
  const [isEditingName, setIsEditingName] = useState(false);
  const [newName, setNewName] = useState(user.name);
  const [theme, setTheme] = useState<Theme>(getTheme);
  const [effects, setEffects] = useState<Effects>(getEffects);
  const [englishVariant, setEnglishVariantState] = useState<EnglishVariant>(() => getEnglishVariant(user));
  const resolvedEnglishVariant = resolveEnglishVariant(englishVariant);
  const avatarInputRef = useRef<HTMLInputElement | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | undefined>(user.avatar);

  const onAvatarFile = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    try {
      const dataUrl = await fileToAvatarDataUrl(file);
      setAvatarPreview(dataUrl);
      setAuthUser({ ...user, avatar: dataUrl });
      window.location.reload();
    } catch {
      /* ignore unreadable image */
    }
  };

  const removeAvatar = () => {
    setAvatarPreview(undefined);
    setAuthUser({ ...user, avatar: undefined });
    window.location.reload();
  };
  const { cur, nxt, pct, into, needed } = getLevelInfo(stats.totalXp ?? 0);
  const words = (stats.totalReviews || 0) + (stats.externalWords || 0);
  const earned = MILESTONES.filter((item) => item.check(stats)).length;

  const saveName = () => {
    if (!newName.trim()) return;
    setAuthUser({ ...user, name: newName.trim() });
    setIsEditingName(false);
    window.location.reload();
  };

  const signOut = () => {
    setAuthUser(null);
    window.location.reload();
  };

  const toggleTheme = () => {
    const next: Theme = theme === "dark" ? "light" : "dark";
    applyTheme(next);
    setTheme(next);
  };

  const toggleEffects = () => {
    const next: Effects = effects === "lite" ? "full" : "lite";
    applyEffects(next);
    setEffects(next);
  };

  const updateEnglishVariant = (value: EnglishVariant) => {
    setEnglishVariantState(value);
    setEnglishVariant(value, user);
  };

  if (profileOnly) {
    return (
      <div className="space-y-5">
        <section className="card overflow-hidden p-5 sm:p-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-sm font-black text-[var(--accent)]">Account</p>
              <h1 className="mt-1 text-3xl font-black tracking-tight text-[var(--text-1)]">Profile settings</h1>
              <p className="mt-2 max-w-2xl text-sm font-semibold leading-6 text-[var(--text-3)]">
                Manage your name, theme, and words learned outside German Lab.
              </p>
            </div>
            <div className="flex h-16 w-16 items-center justify-center overflow-hidden rounded-full bg-[var(--accent-dim)] text-xl font-black text-[var(--accent)]">
              {avatarPreview ? <img src={avatarPreview} alt="" className="h-full w-full object-cover" /> : (user.name?.[0]?.toUpperCase() ?? "?")}
            </div>
          </div>
        </section>

        <section className="card flex flex-wrap items-center justify-between gap-4 p-5 sm:p-6">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--accent-dim)] text-[var(--accent)]">
              <BookOpen className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs font-black uppercase tracking-wide text-[var(--text-3)]">Current course</p>
              <p className="mt-0.5 text-lg font-black text-[var(--text-1)]">{activeCourseName}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onSwitchCourse}
            className="inline-flex items-center gap-2 rounded-full bg-[var(--accent)] px-4 py-2.5 text-sm font-black text-white transition-opacity hover:opacity-90"
          >
            Switch course
          </button>
        </section>

        <section className="card overflow-hidden">
          <div className="grid gap-6 p-5 sm:p-6 lg:grid-cols-[1fr_1fr]">
            <div className="rounded-[24px] bg-[var(--surface-2)] p-5">
              <h2 className="text-xl font-black tracking-tight text-[var(--text-1)]">Account details</h2>
              <p className="mt-1 text-sm font-semibold text-[var(--text-3)]">Your photo, display name, and login email.</p>
              <div className="mt-5 flex items-center gap-4">
                <button
                  type="button"
                  onClick={() => avatarInputRef.current?.click()}
                  aria-label="Change profile photo"
                  className="group relative flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-full bg-[var(--accent-dim)] text-xl font-black text-[var(--accent)] ring-2 ring-[var(--surface)]"
                >
                  {avatarPreview ? (
                    <img src={avatarPreview} alt="" className="h-full w-full object-cover" />
                  ) : (
                    user.name?.[0]?.toUpperCase() ?? "?"
                  )}
                  <span className="absolute inset-0 flex items-center justify-center bg-black/45 text-white opacity-0 transition-opacity group-hover:opacity-100">
                    <Camera className="h-5 w-5" />
                  </span>
                </button>
                <div className="min-w-0 flex-1">
                  {isEditingName ? (
                    <div className="flex gap-2">
                      <input
                        autoFocus
                        className="min-w-0 flex-1 rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-sm font-bold text-[var(--text-1)] outline-none focus:border-[var(--accent)]"
                        onChange={(event) => setNewName(event.target.value)}
                        onKeyDown={(event) => event.key === "Enter" && saveName()}
                        type="text"
                        value={newName}
                      />
                      <button className="accent-btn h-10 w-10" onClick={saveName} type="button">
                        <Check className="mx-auto h-4 w-4" />
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between gap-3">
                      <div className="min-w-0">
                        <p className="truncate text-base font-black text-[var(--text-1)]">{user.name}</p>
                        <p className="truncate text-xs font-semibold text-[var(--text-3)]">{user.email}</p>
                      </div>
                      <button
                        aria-label="Edit profile name"
                        className="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--surface)] text-[var(--text-2)] hover:text-[var(--accent)]"
                        onClick={() => setIsEditingName(true)}
                        type="button"
                      >
                        <Pencil className="h-4 w-4" />
                      </button>
                    </div>
                  )}
                </div>
              </div>

              <input ref={avatarInputRef} type="file" accept="image/*" className="hidden" onChange={onAvatarFile} />
              <div className="mt-4 flex flex-wrap items-center gap-2">
                <button type="button" onClick={() => avatarInputRef.current?.click()} className="ghost-btn h-9 px-3 text-xs">
                  {avatarPreview ? "Change photo" : "Upload photo"}
                </button>
                {avatarPreview && (
                  <button
                    type="button"
                    onClick={removeAvatar}
                    className="h-9 rounded-xl px-3 text-xs font-bold text-rose-500 transition-colors hover:bg-rose-500/10"
                  >
                    Remove
                  </button>
                )}
                <span className="text-[11px] font-semibold text-[var(--text-3)]">Square images look best — stored on this device.</span>
              </div>
            </div>

            <div className="rounded-[24px] bg-[var(--surface-2)] p-5">
              <h2 className="text-xl font-black tracking-tight text-[var(--text-1)]">Preferences</h2>
              <p className="mt-1 text-sm font-semibold text-[var(--text-3)]">Theme and external progress settings.</p>
              <button
                aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
                className="mt-5 flex w-full items-center justify-between rounded-[18px] bg-[var(--surface)] px-4 py-3 text-sm font-black text-[var(--text-1)]"
                onClick={toggleTheme}
                type="button"
              >
                <span className="flex items-center gap-2">
                  {theme === "dark" ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
                  {theme === "dark" ? "Dark mode" : "Light mode"}
                </span>
                <span className="rounded-full bg-[var(--surface-2)] px-3 py-1 text-xs text-[var(--text-2)]">Change</span>
              </button>

              <button
                aria-pressed={effects === "lite"}
                aria-label="Toggle reduced effects"
                className="mt-3 flex w-full items-start justify-between gap-3 rounded-[18px] bg-[var(--surface)] px-4 py-3 text-left"
                onClick={toggleEffects}
                type="button"
              >
                <span className="min-w-0">
                  <span className="flex items-center gap-2 text-sm font-black text-[var(--text-1)]">
                    <Zap className="h-4 w-4" /> Reduce effects
                  </span>
                  <span className="mt-1 block text-xs font-semibold leading-5 text-[var(--text-3)]">
                    Turns off glows and continuous animations to save battery on slower devices.
                  </span>
                </span>
                <span
                  className={cn(
                    "shrink-0 rounded-full px-3 py-1 text-xs font-black",
                    effects === "lite" ? "bg-[var(--accent)] text-white" : "bg-[var(--surface-2)] text-[var(--text-2)]"
                  )}
                >
                  {effects === "lite" ? "On" : "Off"}
                </span>
              </button>

              <div className="mt-5 rounded-[18px] bg-[var(--surface)] p-4">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-black text-[var(--text-1)]">English spelling</p>
                    <p className="mt-1 text-xs font-semibold leading-5 text-[var(--text-3)]">
                      Auto uses your browser/keyboard language. Current: {resolvedEnglishVariant === "british" ? "British" : "American"} English.
                    </p>
                  </div>
                  <span className="rounded-full bg-[var(--surface-2)] px-3 py-1 text-xs font-black text-[var(--text-2)]">
                    {resolvedEnglishVariant === "british" ? "practise" : "practice"}
                  </span>
                </div>
                <select
                  className="mt-3 h-11 w-full rounded-xl border border-[var(--border)] bg-[var(--surface-2)] px-3 text-sm font-bold text-[var(--text-1)] outline-none focus:border-[var(--accent)]"
                  onChange={(event) => updateEnglishVariant(event.target.value as EnglishVariant)}
                  value={englishVariant}
                >
                  <option value="auto">Auto-detect</option>
                  <option value="british">British English</option>
                  <option value="american">American English</option>
                </select>
              </div>

              <div className="mt-5 rounded-[18px] bg-[var(--surface)] p-4">
                <p className="text-sm font-black text-[var(--text-1)]">External word count</p>
                <p className="mt-1 text-xs font-semibold leading-5 text-[var(--text-3)]">
                  Add words learned elsewhere so the app can show a more honest vocabulary total.
                </p>
                <input
                  className="mt-3 h-11 w-full rounded-xl border border-[var(--border)] bg-[var(--surface-2)] px-3 text-sm font-bold text-[var(--text-1)] outline-none focus:border-[var(--accent)]"
                  min="0"
                  onChange={(event) => {
                    const valueString = event.target.value;
                    setExternalInput(valueString);
                    onUpdateStats?.({ externalWords: parseInt(valueString, 10) || 0 });
                  }}
                  placeholder="0"
                  type="number"
                  value={externalInput}
                />
              </div>
            </div>
          </div>
        </section>

        <section className="grid gap-4 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_280px]">
          <ActivityCard className="min-w-0" progressStats={stats} />
          <ProgressSummaryCard cur={cur} earned={earned} into={into} needed={needed} nxt={nxt} pct={pct} stats={stats} words={words} />
          <ActivitySidePanel earned={earned} stats={stats} words={words} />
        </section>

        <section className="grid gap-4 md:grid-cols-4">
          <StatCard color="bg-[var(--accent)]" icon={BarChart3} label="Total XP" value={stats.totalXp.toLocaleString()} />
          <StatCard color="bg-[var(--mint)]" icon={BookOpen} label="Lessons done" value={stats.sessionsCompleted.toLocaleString()} />
          <StatCard color="bg-[var(--orange)]" icon={Flame} label="Day streak" value={stats.streak.toLocaleString()} />
          <StatCard color="bg-[var(--ink)]" icon={Target} label="Words tracked" value={words.toLocaleString()} />
        </section>

        <section className="card p-5 sm:p-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-xl font-black tracking-tight text-[var(--text-1)]">Milestones</h2>
              <p className="mt-1 text-sm font-semibold text-[var(--text-3)]">{earned} of {MILESTONES.length} reached</p>
            </div>
            <Trophy className="h-6 w-6 text-[var(--accent)]" />
          </div>
          <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {MILESTONES.map((item) => {
              const ok = item.check(stats);
              return (
                <motion.div
                  className={cn(
                    "rounded-[20px] border p-4",
                    ok ? "border-[var(--accent)] bg-[var(--accent-dim)]" : "border-[var(--border)] bg-[var(--surface-2)]"
                  )}
                  key={item.id}
                  whileHover={{ y: -2 }}
                >
                  <div className="flex items-center gap-3">
                    <div className={cn("flex h-9 w-9 items-center justify-center rounded-full", ok ? "bg-[var(--accent)] text-white" : "bg-[var(--surface)] text-[var(--text-3)]")}>
                      {ok ? <Check className="h-4 w-4" /> : <Trophy className="h-4 w-4" />}
                    </div>
                    <div>
                      <p className="text-sm font-black text-[var(--text-1)]">{item.label}</p>
                      <p className="text-xs font-semibold text-[var(--text-3)]">{item.desc}</p>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </section>

        <VocabTracker apiParts={apiParts} user={user} />

        <section className="card flex flex-wrap items-center justify-between gap-4 p-5 sm:p-6">
          <div>
            <p className="text-sm font-black text-[var(--text-1)]">Sign out</p>
            <p className="mt-1 text-xs font-semibold text-[var(--text-3)]">You'll return to the login screen. Progress stays saved on this device.</p>
          </div>
          <button
            type="button"
            onClick={signOut}
            className="inline-flex items-center gap-2 rounded-full bg-[var(--red-bg,#3a2026)] px-4 py-2.5 text-sm font-black text-[var(--red-text,#ff8a9b)] transition-opacity hover:opacity-90"
          >
            <LogOut className="h-4 w-4" /> Sign out
          </button>
        </section>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <section className="grid gap-4 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_280px]">
        <ActivityCard className="min-w-0" progressStats={stats} />
        <ProgressSummaryCard cur={cur} earned={earned} into={into} needed={needed} nxt={nxt} pct={pct} stats={stats} words={words} />
        <ActivitySidePanel earned={earned} stats={stats} words={words} />
      </section>

      <section className="card overflow-hidden">
        <div className="grid gap-6 p-5 sm:p-6 lg:grid-cols-[1fr_1fr]">
          <div className="rounded-[24px] bg-[var(--surface-2)] p-5">
            <h2 className="text-xl font-black tracking-tight text-[var(--text-1)]">Profile settings</h2>
            <p className="mt-1 text-sm font-semibold text-[var(--text-3)]">Account details, theme, and external word tracking.</p>
            <div className="mt-5 flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[var(--surface)] text-[var(--accent)]">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <div className="min-w-0 flex-1">
                {isEditingName ? (
                  <div className="flex gap-2">
                    <input
                      autoFocus
                      className="min-w-0 flex-1 rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-sm font-bold text-[var(--text-1)] outline-none focus:border-[var(--accent)]"
                      onChange={(event) => setNewName(event.target.value)}
                      onKeyDown={(event) => event.key === "Enter" && saveName()}
                      type="text"
                      value={newName}
                    />
                    <button className="accent-btn h-10 w-10" onClick={saveName} type="button">
                      <Check className="mx-auto h-4 w-4" />
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center justify-between gap-3">
                    <div className="min-w-0">
                      <p className="truncate text-base font-black text-[var(--text-1)]">{user.name}</p>
                      <p className="truncate text-xs font-semibold text-[var(--text-3)]">{user.email}</p>
                    </div>
                    <button
                      aria-label="Edit profile name"
                      className="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--surface)] text-[var(--text-2)] hover:text-[var(--accent)]"
                      onClick={() => setIsEditingName(true)}
                      type="button"
                    >
                      <Pencil className="h-4 w-4" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="rounded-[24px] bg-[var(--surface-2)] p-5">
            <button
              aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
              className="flex w-full items-center justify-between rounded-[18px] bg-[var(--surface)] px-4 py-3 text-sm font-black text-[var(--text-1)]"
              onClick={toggleTheme}
              type="button"
            >
              <span className="flex items-center gap-2">
                {theme === "dark" ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
                {theme === "dark" ? "Dark mode" : "Light mode"}
              </span>
              <span className="rounded-full bg-[var(--surface-2)] px-3 py-1 text-xs text-[var(--text-2)]">Change</span>
            </button>

            <div className="mt-5 rounded-[18px] bg-[var(--surface)] p-4">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-black text-[var(--text-1)]">English spelling</p>
                  <p className="mt-1 text-xs font-semibold leading-5 text-[var(--text-3)]">
                    Auto uses your browser/keyboard language. Current: {resolvedEnglishVariant === "british" ? "British" : "American"} English.
                  </p>
                </div>
                <span className="rounded-full bg-[var(--surface-2)] px-3 py-1 text-xs font-black text-[var(--text-2)]">
                  {resolvedEnglishVariant === "british" ? "practise" : "practice"}
                </span>
              </div>
              <select
                className="mt-3 h-11 w-full rounded-xl border border-[var(--border)] bg-[var(--surface-2)] px-3 text-sm font-bold text-[var(--text-1)] outline-none focus:border-[var(--accent)]"
                onChange={(event) => updateEnglishVariant(event.target.value as EnglishVariant)}
                value={englishVariant}
              >
                <option value="auto">Auto-detect</option>
                <option value="british">British English</option>
                <option value="american">American English</option>
              </select>
            </div>

            <div className="mt-5 rounded-[18px] bg-[var(--surface)] p-4">
              <p className="text-sm font-black text-[var(--text-1)]">External word count</p>
              <p className="mt-1 text-xs font-semibold leading-5 text-[var(--text-3)]">
                Add words learned elsewhere so the app can show a more honest vocabulary total.
              </p>
              <input
                className="mt-3 h-11 w-full rounded-xl border border-[var(--border)] bg-[var(--surface-2)] px-3 text-sm font-bold text-[var(--text-1)] outline-none focus:border-[var(--accent)]"
                min="0"
                onChange={(event) => {
                  const valueString = event.target.value;
                  setExternalInput(valueString);
                  onUpdateStats?.({ externalWords: parseInt(valueString, 10) || 0 });
                }}
                placeholder="0"
                type="number"
                value={externalInput}
              />
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-4">
        <StatCard color="bg-[var(--accent)]" icon={BarChart3} label="Total XP" value={stats.totalXp.toLocaleString()} />
        <StatCard color="bg-[var(--mint)]" icon={BookOpen} label="Lessons done" value={stats.sessionsCompleted.toLocaleString()} />
        <StatCard color="bg-[var(--orange)]" icon={Flame} label="Day streak" value={stats.streak.toLocaleString()} />
        <StatCard color="bg-[var(--ink)]" icon={Target} label="Words tracked" value={words.toLocaleString()} />
      </section>

      <section className="card p-5 sm:p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-xl font-black tracking-tight text-[var(--text-1)]">Milestones</h2>
            <p className="mt-1 text-sm font-semibold text-[var(--text-3)]">{earned} of {MILESTONES.length} reached</p>
          </div>
          <Trophy className="h-6 w-6 text-[var(--accent)]" />
        </div>
        <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {MILESTONES.map((item) => {
            const ok = item.check(stats);
            return (
              <div
                className={[
                  "rounded-[18px] border p-4",
                  ok ? "border-[var(--border)] bg-[var(--surface-2)]" : "border-[var(--border)] bg-[var(--surface)] opacity-55",
                ].join(" ")}
                key={item.id}
              >
                <div className="flex items-center gap-2">
                  <div className={ok ? "flex h-8 w-8 items-center justify-center rounded-full bg-[var(--mint)] text-white" : "flex h-8 w-8 items-center justify-center rounded-full bg-[var(--surface-3)] text-[var(--text-3)]"}>
                    <Check className="h-4 w-4" />
                  </div>
                  <p className="text-sm font-black text-[var(--text-1)]">{item.label}</p>
                </div>
                <p className="mt-3 text-xs font-semibold leading-5 text-[var(--text-3)]">{item.desc}</p>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
