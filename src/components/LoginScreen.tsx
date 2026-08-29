import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowRight,
  BookOpen,
  CheckCircle2,
  Mail,
  ShieldCheck,
  User,
} from "lucide-react";

import { Input } from "@/components/ui/input";
import { MicheonLogo } from "@/components/MicheonLogo";
import { buildProfileId, findProfileByEmail, setAuthUser, UserProfile } from "@/lib/profileStorage";
import { ui } from "@/lib/i18n";

interface LoginScreenProps {
  onLogin: (user: UserProfile) => void;
}

const essentials = [
  "A daily German lesson that starts immediately.",
  "Practice for reading, listening, typing, and translation.",
  "Progress saved locally on this device.",
];

const previewModules = [
  { label: "Cafe", detail: "Order coffee and ask simple questions" },
  { label: "Directions", detail: "Ask where things are and understand answers" },
  { label: "Plans", detail: "Talk about time, meetings, and tomorrow" },
];

/**
 * The app's own input, not a third palette's: surface-2 well, bold ink, and
 * the accent taking over the border on focus — the same treatment the
 * settings inputs use, so the first field anyone types in already behaves
 * like every later one.
 */
function inputClassName() {
  return "h-12 rounded-xl border-[var(--border)] bg-[var(--surface-2)] pl-11 text-[15px] font-bold text-[var(--text-1)] shadow-none placeholder:font-semibold placeholder:text-[var(--text-3)] focus-visible:border-[var(--accent)] focus-visible:bg-[var(--surface-1)] focus-visible:ring-4 focus-visible:ring-[var(--accent)]/15";
}

/**
 * The door is painted like the house.
 *
 * This screen used to carry its own palette — white ground, teal accent,
 * zinc greys — which existed nowhere else in the app, so the very first
 * thing anyone saw was a design the next screen immediately contradicted.
 * Everything here now reads from the same tokens as the dashboard: theme
 * variables for every colour (so signing in at night is dark like the rest
 * of the app), the black-weight headings the home screen greets with, cards
 * on var(--surface) with the shared border, and the accent button with its
 * pressed-spring shadow that every primary action in the app already has.
 * The copy, the local-profile behaviour and the two entrance motions are
 * exactly as they were — this recolours the door, it does not move it.
 */
export function LoginScreen({ onLogin }: LoginScreenProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!email || (!isLogin && !name)) return;

    setLoading(true);

    window.setTimeout(() => {
      // If this email has signed in on this device before, reconnect to that
      // exact account (same id => same progress) instead of deriving a new,
      // empty profile. This keeps progress tied to the email across sign-outs.
      const existing = findProfileByEmail(email);
      const fallbackName = name || email.split("@")[0] || "Student";
      const user: UserProfile = existing ?? {
        id: buildProfileId(fallbackName, email),
        name: fallbackName,
        email,
        joinedAt: new Date().toISOString(),
        externalWordsLearned: 0,
      };

      setAuthUser(user);
      onLogin(user);
      setLoading(false);
    }, 500);
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 top-[var(--titlebar-h)] z-[500] overflow-y-auto bg-[var(--bg)] text-[var(--text-1)]">
      <div className="mx-auto grid min-h-[var(--app-h)] w-full max-w-7xl items-center gap-10 px-5 py-8 sm:px-8 lg:grid-cols-[1.05fr_0.95fr] lg:px-10">
        <motion.section
          animate={{ opacity: 1, y: 0 }}
          className="py-6"
          initial={{ opacity: 0, y: 14 }}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
        >
          {/* Both logo inks are rendered and the theme decides which shows,
              the same trick the update banner uses: the ink must flip with
              data-theme, and an <img> cannot recolour itself. */}
          <div className="login-logo">
            <span className="login-logo__light"><MicheonLogo theme="light" height={128} /></span>
            <span className="login-logo__dark"><MicheonLogo theme="dark" height={128} /></span>
          </div>

          <h1 className="mt-7 max-w-3xl text-5xl font-black leading-[1.02] tracking-tight text-[var(--text-1)] sm:text-6xl">
            {ui("Practical German, one focused lesson at a time.")}
          </h1>

          <p className="mt-5 max-w-2xl text-lg font-semibold leading-8 text-[var(--text-2)]">
            {ui("Return to your current module, keep your progress, and build the words and phrases you need for real conversations.")}
          </p>

          <div className="mt-8 grid max-w-2xl gap-3">
            {essentials.map((item) => (
              <div key={item} className="flex items-start gap-3 rounded-2xl border border-[var(--border)] bg-[var(--surface-1)] px-4 py-3 shadow-[0_2px_10px_var(--shadow)]">
                <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-[var(--accent)]" />
                <p className="text-sm font-semibold leading-6 text-[var(--text-2)]">{ui(item)}</p>
              </div>
            ))}
          </div>

          <div className="mt-8 grid max-w-3xl gap-3 sm:grid-cols-3">
            {previewModules.map((module) => (
              <div key={module.label} className="rounded-2xl border border-[var(--border)] bg-[var(--surface-1)] p-4 shadow-[0_2px_10px_var(--shadow)]">
                <p className="text-sm font-black text-[var(--text-1)]">{ui(module.label)}</p>
                <p className="mt-2 text-sm font-semibold leading-6 text-[var(--text-2)]">{ui(module.detail)}</p>
              </div>
            ))}
          </div>
        </motion.section>

        <motion.section
          animate={{ opacity: 1, y: 0 }}
          className="mx-auto w-full max-w-md"
          initial={{ opacity: 0, y: 14 }}
          transition={{ delay: 0.08, duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="card p-6 sm:p-7">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[var(--accent-dim)] text-[var(--accent)]">
                  <BookOpen className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.12em] text-[var(--text-3)]">
                    {ui(isLogin ? "Welcome back" : "Create profile")}
                  </p>
                  <h2 className="mt-1 text-2xl font-black tracking-tight text-[var(--text-1)]">
                    {ui(isLogin ? "Continue learning" : "Start Micheon")}
                  </h2>
                </div>
              </div>
            </div>

            <p className="mt-5 text-sm font-semibold leading-6 text-[var(--text-2)]">
              {ui("This uses a local profile, so you can get back to your lesson without setting up a remote account.")}
            </p>

            <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
              {!isLogin ? (
                <label className="block">
                  <span className="mb-2 block text-xs font-black uppercase tracking-[0.12em] text-[var(--text-3)]">{ui("Name")}</span>
                  <div className="relative">
                    <User className="pointer-events-none absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-[var(--text-3)]" />
                    <Input
                      className={inputClassName()}
                      onChange={(event) => setName(event.target.value)}
                      placeholder={ui("Your name")}
                      required={!isLogin}
                      value={name}
                    />
                  </div>
                </label>
              ) : null}

              <label className="block">
                <span className="mb-2 block text-xs font-black uppercase tracking-[0.12em] text-[var(--text-3)]">{ui("Email")}</span>
                <div className="relative">
                  <Mail className="pointer-events-none absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-[var(--text-3)]" />
                  <Input
                    className={inputClassName()}
                    onChange={(event) => setEmail(event.target.value)}
                    placeholder="name@example.com"
                    required
                    type="email"
                    value={email}
                  />
                </div>
              </label>

              {/* A plain button, because the shared Button's default variant is
                  the ink pill (.accent-btn) and its class outranks a utility
                  override — the pill came out white-on-dark here. This action
                  is the accent primary, the same treatment as the tracker's
                  add-your-own-words button. */}
              <button
                className="inline-flex h-12 w-full select-none items-center justify-center gap-2 whitespace-nowrap rounded-xl border border-[var(--accent)] bg-[var(--accent)] text-sm font-black text-[var(--accent-text)] shadow-[0_3px_0_var(--accent-dark)] transition-[background-color,transform,box-shadow] duration-150 hover:bg-[var(--accent-hover)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]/45 focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg)] active:translate-y-[2px] active:shadow-none disabled:pointer-events-none disabled:opacity-40"
                disabled={loading}
                type="submit"
              >
                {ui(loading ? "Opening your lessons..." : isLogin ? "Continue" : "Create profile")}
                <ArrowRight className="h-4 w-4" />
              </button>
            </form>

            <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-[var(--border)] pt-5">
              <button
                className="text-sm font-bold text-[var(--text-2)] transition-colors hover:text-[var(--text-1)]"
                onClick={() => setIsLogin((current) => !current)}
                type="button"
              >
                {ui(isLogin ? "Need a profile?" : "Already have a profile?")}
              </button>

              <div className="flex items-center gap-2 text-xs font-bold text-[var(--text-3)]">
                <ShieldCheck className="h-4 w-4 text-[var(--accent)]" />
                {ui("Local profile")}
              </div>
            </div>
          </div>
        </motion.section>
      </div>
    </div>
  );
}
