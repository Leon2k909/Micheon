import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Youtube } from "lucide-react";

const VIDEOS = [
  { id: "Kn-HBCpMBSk", title: "German for Beginners — Lesson 1", channel: "Learn German with Anja" },
  { id: "4_NcHVSgkYk", title: "German Pronunciation Guide", channel: "Deutsch für Euch" },
  { id: "rGrBHiuOVR4", title: "Basic German Phrases", channel: "Learn German with GermanPod101" },
  { id: "9Yw3oFMFBiA", title: "German Articles — der, die, das", channel: "Easy German" },
  { id: "Xt7QIgzyxLk", title: "Everyday German Conversations", channel: "Easy German" },
  { id: "WLRCnFBwBqg", title: "German Listening Practice A1", channel: "Deutsch mit Marija" },
];

export default function VideosTabContent() {
  return (
    <Card className="rounded-3xl shadow-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-xl"><Youtube className="h-5 w-5" /> German videos</CardTitle>
        <CardDescription>Real German speakers — watch, listen, and absorb natural speech patterns.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-3 lg:grid-cols-3">
          <div className="rounded-2xl border bg-slate-50 p-4 text-sm text-slate-600"><div className="font-medium text-slate-900">1. Watch with German captions</div><div className="mt-1">Use German subtitles first so audio and text reinforce each other instead of staying passive.</div></div>
          <div className="rounded-2xl border bg-slate-50 p-4 text-sm text-slate-600"><div className="font-medium text-slate-900">2. Shadow one short chunk</div><div className="mt-1">Pause after 20 to 40 seconds and copy the rhythm aloud, like an Easy German shadowing loop.</div></div>
          <div className="rounded-2xl border bg-slate-50 p-4 text-sm text-slate-600"><div className="font-medium text-slate-900">3. Save one usable phrase</div><div className="mt-1">Move one phrase into the phrasebook so video input becomes spaced active recall later.</div></div>
        </div>
        {VIDEOS.map((video) => (
          <div key={video.id} className="rounded-3xl border bg-white overflow-hidden shadow-sm">
            <div className="aspect-video w-full">
              <iframe
                className="w-full h-full"
                src={`https://www.youtube.com/embed/${video.id}`}
                title={video.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
            <div className="p-4">
              <div className="font-medium text-slate-900">{video.title}</div>
              <div className="text-sm text-slate-500 mt-1">{video.channel}</div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
