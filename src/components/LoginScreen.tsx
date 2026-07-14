import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowRight,
  BookOpen,
  CheckCircle2,
  Languages,
  Mail,
  ShieldCheck,
  User,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { buildProfileId, setAuthUser, UserProfile } from "@/lib/profileStorage";

interface LoginScreenProps {
  onLogin: (user: UserProfile) => void;
}

const essentials = [
  "A daily German lesson that starts immediately.",
  "Practice for reading, listening, speaking, typing, and translation.",
  "Progress saved locally on this device.",
];

const previewModules = [
  { label: "Cafe", detail: "Order coffee and ask simple questions" },
  { label: "Directions", detail: "Ask where things are and understand answers" },
  { label: "Plans", detail: "Talk about time, meetings, and tomorrow" },
];

function inputClassName() {
  return "h-12 rounded-lg border-zinc-300 bg-white pl-11 text-[15px] text-zinc-950 shadow-none placeholder:text-zinc-400 focus-visible:border-teal-700 focus-visible:bg-white focus-visible:ring-4 focus-visible:ring-teal-700/10";
}

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
      const user: UserProfile = {
        id: buildProfileId(name || "Student", email),
        name: name || "Student",
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
    <div className="fixed bottom-0 left-0 right-0 top-[var(--titlebar-h)] z-[500] overflow-y-auto bg-[#f7f6f2] text-zinc-950">
      <div className="mx-auto grid min-h-[var(--app-h)] w-full max-w-7xl items-center gap-10 px-5 py-8 sm:px-8 lg:grid-cols-[1.05fr_0.95fr] lg:px-10">
        <motion.section
          animate={{ opacity: 1, y: 0 }}
          className="py-6"
          initial={{ opacity: 0, y: 14 }}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-teal-700/20 bg-teal-50 px-3 py-1 text-xs font-semibold text-teal-800">
            <Languages className="h-3.5 w-3.5" />
            Learn German
          </div>

          <h1 className="mt-7 max-w-3xl text-5xl font-semibold leading-[1.02] tracking-tight text-zinc-950 sm:text-6xl">
            Practical German, one focused lesson at a time.
          </h1>

          <p className="mt-5 max-w-2xl text-lg leading-8 text-zinc-600">
            Return to your current module, keep your progress, and build the words and phrases you need for real
            conversations.
          </p>

          <div className="mt-8 grid max-w-2xl gap-3">
            {essentials.map((item) => (
              <div key={item} className="flex items-start gap-3 rounded-lg border border-zinc-200 bg-white px-4 py-3 shadow-sm">
                <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-teal-700" />
                <p className="text-sm leading-6 text-zinc-700">{item}</p>
              </div>
            ))}
          </div>

          <div className="mt-8 grid max-w-3xl gap-3 sm:grid-cols-3">
            {previewModules.map((module) => (
              <div key={module.label} className="rounded-lg border border-zinc-200 bg-white p-4 shadow-sm">
                <p className="text-sm font-semibold text-zinc-950">{module.label}</p>
                <p className="mt-2 text-sm leading-6 text-zinc-600">{module.detail}</p>
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
          <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-[0_24px_80px_rgba(24,24,27,0.10)] sm:p-7">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-zinc-950 text-white">
                  <BookOpen className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500">
                    {isLogin ? "Welcome back" : "Create profile"}
                  </p>
                  <h2 className="mt-1 text-2xl font-semibold tracking-tight text-zinc-950">
                    {isLogin ? "Continue learning" : "Start Learn German"}
                  </h2>
                </div>
              </div>
            </div>

            <p className="mt-5 text-sm leading-6 text-zinc-600">
              This uses a local profile, so you can get back to your lesson without setting up a remote account.
            </p>

            <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
              {!isLogin ? (
                <label className="block">
                  <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500">Name</span>
                  <div className="relative">
                    <User className="pointer-events-none absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-zinc-400" />
                    <Input
                      className={inputClassName()}
                      onChange={(event) => setName(event.target.value)}
                      placeholder="Your name"
                      required={!isLogin}
                      value={name}
                    />
                  </div>
                </label>
              ) : null}

              <label className="block">
                <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500">Email</span>
                <div className="relative">
                  <Mail className="pointer-events-none absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-zinc-400" />
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

              <Button
                className="h-12 w-full rounded-lg bg-teal-700 text-sm font-semibold text-white hover:bg-teal-800"
                disabled={loading}
                type="submit"
              >
                {loading ? "Opening your lessons..." : isLogin ? "Continue" : "Create profile"}
                <ArrowRight className="h-4 w-4" />
              </Button>
            </form>

            <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-zinc-200 pt-5">
              <button
                className="text-sm font-medium text-zinc-600 transition-colors hover:text-zinc-950"
                onClick={() => setIsLogin((current) => !current)}
                type="button"
              >
                {isLogin ? "Need a profile?" : "Already have a profile?"}
              </button>

              <div className="flex items-center gap-2 text-xs text-zinc-500">
                <ShieldCheck className="h-4 w-4 text-teal-700" />
                Local profile
              </div>
            </div>
          </div>
        </motion.section>
      </div>
    </div>
  );
}
