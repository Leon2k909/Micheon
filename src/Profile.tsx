import React, { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { loadProfile, saveProfile } from "@/lib/profileStorage";
import { User, Trophy, Flame, BookOpen, Star, CheckCircle2, ArrowLeft } from "lucide-react";

function getProficiencyLabel(reviewState, totalItems) {
  const items = Object.values(reviewState);
  const seenItems = items.filter((s) => (s.seen ?? 0) > 0);
  if (!seenItems.length || !totalItems) return { label: "Beginner", pct: 0, color: "bg-slate-300" };

  const known = seenItems.filter((s) => s.interval >= 14 || s.lastGrade === "know").length;
  const learning = seenItems.filter((s) => s.interval >= 3 && s.interval < 14 && s.lastGrade !== "know").length;
  const weightedProgress = known + learning * 0.5;
  const pct = Math.round((weightedProgress / totalItems) * 100);
  const seenPct = Math.round((seenItems.length / totalItems) * 100);
  const seenCount = seenItems.length;

  if (known >= 120 && seenCount >= 180 && seenPct >= 70) return { label: "Advanced", pct, color: "bg-green-500" };
  if (known >= 45 && seenCount >= 80 && seenPct >= 40) return { label: "Intermediate", pct, color: "bg-blue-500" };
  if (known >= 12 && seenCount >= 20 && seenPct >= 12) return { label: "Elementary", pct, color: "bg-yellow-500" };
  return { label: "Beginner", pct, color: "bg-slate-400" };
}

export default function Profile({ onBack, onProfileChange, reviewState, dailyProgress, studyItems, activeLang, knownWords, trackedWords }) {
  const [profile, setProfile] = useState(() => loadProfile());
  const [form, setForm] = useState({ name: "", email: "" });
  const [externalWordsInput, setExternalWordsInput] = useState(() => String(loadProfile()?.externalWordsLearned ?? 0));
  const [saved, setSaved] = useState(false);

  const proficiency = getProficiencyLabel(reviewState, studyItems.length);
  const totalSeen = Object.values(reviewState).filter(s => s.seen > 0).length;
  const totalKnown = Object.values(reviewState).filter(s => s.interval >= 14).length;
  const totalLearning = Object.values(reviewState).filter(s => s.interval >= 3 && s.interval < 14).length;
  const totalItems = studyItems.length;
  const externalWordsLearned = profile?.externalWordsLearned ?? 0;
  const combinedTrackedWords = trackedWords + externalWordsLearned;

  const register = () => {
    if (!form.name.trim()) return;
    const p = { name: form.name.trim(), email: form.email.trim(), joinedAt: new Date().toISOString(), externalWordsLearned: 0 };
    saveProfile(p);
    setProfile(p);
    setExternalWordsInput("0");
    onProfileChange?.(p);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const saveExternalWords = () => {
    if (!profile) return;
    const nextValue = Math.max(0, Number.parseInt(externalWordsInput || "0", 10) || 0);
    const nextProfile = { ...profile, externalWordsLearned: nextValue };
    saveProfile(nextProfile);
    setProfile(nextProfile);
    setExternalWordsInput(String(nextValue));
    onProfileChange?.(nextProfile);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="min-h-screen bg-slate-50 p-4 sm:p-6">
      <div className="mx-auto max-w-2xl space-y-4">
        <div className="flex items-center gap-3">
          <Button variant="outline" size="icon" className="rounded-2xl" onClick={onBack}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div className="text-xl font-semibold">Profile</div>
        </div>

        {/* Account */}
        <Card className="rounded-3xl shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><User className="h-5 w-5" /> Account</CardTitle>
            <CardDescription>Your details are stored locally on this device.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {profile ? (
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="rounded-full bg-slate-900 text-white h-14 w-14 flex items-center justify-center text-2xl font-bold">
                    {profile.name[0].toUpperCase()}
                  </div>
                  <div>
                    <div className="text-lg font-semibold">{profile.name}</div>
                    {profile.email && <div className="text-sm text-slate-500">{profile.email}</div>}
                    <div className="text-xs text-slate-400 mt-1">Joined {new Date(profile.joinedAt).toLocaleDateString()}</div>
                  </div>
                  <Button variant="outline" size="sm" className="rounded-2xl ml-auto" onClick={() => { saveProfile(null); setProfile(null); setExternalWordsInput("0"); onProfileChange?.(null); }}>
                    Clear
                  </Button>
                </div>
                <div className="rounded-2xl bg-slate-50 p-4">
                  <div className="text-sm font-medium text-slate-900">Words learned in other apps</div>
                  <div className="mt-1 text-sm text-slate-500">Add words you already learned elsewhere, like Memrise, so they count toward the top progress bar.</div>
                  <div className="mt-3 flex gap-3">
                    <Input
                      value={externalWordsInput}
                      onChange={(e) => setExternalWordsInput(e.target.value.replace(/[^\d]/g, ""))}
                      placeholder="e.g. 800"
                      className="rounded-2xl"
                    />
                    <Button className="rounded-2xl" onClick={saveExternalWords}>Save</Button>
                  </div>
                  <div className="mt-3 text-sm text-slate-600">
                    In-app tracked words: <span className="font-semibold text-slate-900">{trackedWords}</span> · External words: <span className="font-semibold text-slate-900">{externalWordsLearned}</span> · Total for progress: <span className="font-semibold text-slate-900">{combinedTrackedWords}</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <Input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="Your name" className="rounded-2xl" />
                <Input value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} placeholder="Email (optional)" className="rounded-2xl" />
                <Button className="w-full rounded-2xl" onClick={register} disabled={!form.name.trim()}>
                  {saved ? <><CheckCircle2 className="h-4 w-4 mr-2" /> Saved!</> : "Save profile"}
                </Button>
                <p className="text-xs text-slate-400 text-center">No account needed — stored locally only.</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Proficiency */}
        <Card className="rounded-3xl shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Star className="h-5 w-5" /> Proficiency</CardTitle>
            <CardDescription>Based on your review history across all parts.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-4">
              <Badge className={`rounded-full px-4 py-1 text-white text-sm ${proficiency.color}`}>{proficiency.label}</Badge>
              <div className="flex-1">
                <Progress value={proficiency.pct} className="h-3" />
              </div>
              <span className="text-sm text-slate-500">{proficiency.pct}%</span>
            </div>
            <div className="grid grid-cols-3 gap-3 text-center text-sm">
              <div className="rounded-2xl bg-slate-50 p-3">
                <div className="text-2xl font-bold text-slate-900">{totalKnown}</div>
                <div className="text-slate-500 mt-1">Known</div>
              </div>
              <div className="rounded-2xl bg-slate-50 p-3">
                <div className="text-2xl font-bold text-slate-900">{totalLearning}</div>
                <div className="text-slate-500 mt-1">Learning</div>
              </div>
              <div className="rounded-2xl bg-slate-50 p-3">
                <div className="text-2xl font-bold text-slate-900">{totalItems - totalSeen}</div>
                <div className="text-slate-500 mt-1">Not seen</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats */}
        <Card className="rounded-3xl shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Trophy className="h-5 w-5" /> Stats</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-3 text-sm">
            <div className="rounded-2xl bg-slate-50 p-4">
              <div className="flex items-center gap-2 text-slate-500 mb-1"><Flame className="h-4 w-4 text-orange-500" /> Streak</div>
              <div className="text-3xl font-bold">{dailyProgress.streak ?? 0} <span className="text-base font-normal text-slate-400">days</span></div>
            </div>
            <div className="rounded-2xl bg-slate-50 p-4">
              <div className="flex items-center gap-2 text-slate-500 mb-1"><BookOpen className="h-4 w-4" /> Total reviews</div>
              <div className="text-3xl font-bold">{Object.values(reviewState).reduce((s, r) => s + (r.seen || 0), 0)}</div>
            </div>
            <div className="rounded-2xl bg-slate-50 p-4">
              <div className="text-slate-500 mb-1">Today's reviews</div>
              <div className="text-3xl font-bold">{dailyProgress.reviews ?? 0}</div>
            </div>
            <div className="rounded-2xl bg-slate-50 p-4">
              <div className="text-slate-500 mb-1">Language</div>
              <div className="text-2xl font-bold">{activeLang?.label ?? "German"}</div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
