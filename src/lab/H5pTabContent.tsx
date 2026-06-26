import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function H5pTabContent() {
  const [saved, setSaved] = useState(() => {
    try { return JSON.parse(localStorage.getItem("german-lab-h5p") ?? "[]"); } catch { return []; }
  });
  const [url, setUrl] = useState("");
  const [title, setTitle] = useState("");

  const add = () => {
    if (!url.trim()) return;
    const entry = { id: Date.now(), url: url.trim(), title: title.trim() || "H5P Activity" };
    const next = [entry, ...saved];
    setSaved(next);
    localStorage.setItem("german-lab-h5p", JSON.stringify(next));
    setUrl(""); setTitle("");
  };
  const remove = (id) => {
    const next = saved.filter((e) => e.id !== id);
    setSaved(next);
    localStorage.setItem("german-lab-h5p", JSON.stringify(next));
  };

  return (
    <Card className="rounded-3xl shadow-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-xl">🎮 H5P interactive exercises</CardTitle>
        <CardDescription>
          Embed any H5P activity from <a href="https://h5p.org" target="_blank" rel="noreferrer" className="underline">h5p.org</a> or your LMS.
          Create a free activity, copy the embed URL, and paste it below.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-5">
          <div className="rounded-2xl bg-amber-50 border border-amber-200 p-4 text-sm text-amber-800 space-y-1">
            <div className="font-semibold">How to use H5P</div>
            <div>1. Go to <a href="https://h5p.org/content-types-and-applications" target="_blank" rel="noreferrer" className="underline">h5p.org</a> and try a content type (e.g. Fill in the Blanks, Drag the Words, Flashcards).</div>
            <div>2. Create a free account and make your activity.</div>
            <div>3. Copy the embed URL (the iframe src) and paste it below.</div>
            <div>4. Or use any H5P embed from Moodle, Canvas, or another LMS.</div>
          </div>
          <div className="space-y-3">
            <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Activity title (optional)" className="rounded-2xl" />
            <Input value={url} onChange={(e) => setUrl(e.target.value)} placeholder="H5P embed URL (https://...)" className="rounded-2xl" />
            <Button className="w-full rounded-2xl" onClick={add} disabled={!url.trim()}>Add activity</Button>
          </div>
          {saved.length === 0 && (
            <div className="rounded-2xl bg-slate-50 p-6 text-center text-slate-500 text-sm">No H5P activities added yet.</div>
          )}
          {saved.map((entry) => (
            <div key={entry.id} className="rounded-3xl border bg-white overflow-hidden shadow-sm">
              <div className="flex items-center justify-between px-4 py-3 border-b">
                <span className="font-medium text-sm">{entry.title}</span>
                <Button variant="outline" size="sm" className="rounded-xl" onClick={() => remove(entry.id)}>Remove</Button>
              </div>
              <iframe src={entry.url} className="w-full" style={{ height: 500, border: "none" }} title={entry.title} allowFullScreen />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
