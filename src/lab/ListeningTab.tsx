import React, { useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Headphones, CheckCircle2, XCircle, RotateCcw, Volume2 } from "lucide-react";
import { normalize } from "@/lib/api";

interface ListeningTabProps {
  currentListeningItem: any;
  listeningInput: string;
  setListeningInput: (v: string) => void;
  checkListening: () => void;
  listeningChecked: boolean;
  listeningCorrect: boolean;
  listeningScore: number;
  nextListening: () => void;
  playGerman: (text: string) => void;
  onListeningKeyDown: (e: React.KeyboardEvent) => void;
  insertListeningCharacter: (char: string) => void;
}

export function ListeningTab({
  currentListeningItem,
  listeningInput,
  setListeningInput,
  checkListening,
  listeningChecked,
  listeningCorrect,
  listeningScore,
  nextListening,
  playGerman,
  onListeningKeyDown,
  insertListeningCharacter
}: ListeningTabProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const GERMAN_SPECIAL_CHARACTERS = ["Ä", "ä", "É", "é", "Ö", "ö", "Ü", "ü", "ß"];

  if (!currentListeningItem) {
    return <div className="rounded-3xl border bg-white p-8 text-center text-slate-600 shadow-sm">No listening prompts available.</div>;
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_300px]">
      <div className="space-y-6">
        <Card className="rounded-[2.5rem] border-2 border-slate-100 bg-white p-10 shadow-sm leading-relaxed">
          <div className="flex items-center justify-between gap-4 mb-8">
            <div className="text-sm font-bold uppercase tracking-[0.2em] text-blue-600">Listening practice</div>
            <Button className="h-14 rounded-2xl bg-blue-600 font-bold px-8 shadow-lg shadow-blue-200" onClick={() => playGerman(currentListeningItem.front)}>
              <Volume2 className="mr-2 h-6 w-6" /> Hear German
            </Button>
          </div>

          <div className="space-y-8">
            <div className="text-center bg-slate-50 p-10 rounded-3xl border border-slate-100 border-dashed">
              <Headphones className="mx-auto mb-4 h-12 w-12 text-blue-300" />
              <div className="text-lg font-medium text-slate-600">Listen to the clip and type exactly what you hear.</div>
              <div className="mt-2 text-sm text-slate-400 italic">Try to focus on the pronunciation and gendered articles.</div>
            </div>

            <div className="space-y-6">
              <div className="flex gap-4">
                <Input 
                  ref={inputRef}
                  value={listeningInput} 
                  onChange={(e) => setListeningInput(e.target.value)} 
                  onKeyDown={onListeningKeyDown} 
                  placeholder="Type what you hear..." 
                  className="h-16 rounded-2xl text-xl px-6 border-2 focus:border-blue-400 transition-all font-medium" 
                  disabled={listeningChecked}
                  autoFocus
                />
                <Button 
                  className="h-16 rounded-2xl bg-blue-600 text-lg font-bold px-8 shadow-lg shadow-blue-200" 
                  onClick={checkListening} 
                  disabled={!normalize(listeningInput) || listeningChecked}
                >
                  Check
                </Button>
              </div>

              <div className="flex flex-wrap gap-2 justify-center">
                {GERMAN_SPECIAL_CHARACTERS.map(char => (
                  <Button key={char} variant="outline" className="h-14 w-14 rounded-2xl text-xl font-bold bg-white hover:border-blue-300" onClick={() => insertListeningCharacter(char)} disabled={listeningChecked}>
                    {char}
                  </Button>
                ))}
              </div>

              {listeningChecked && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className={`rounded-3xl p-8 border-2 ${listeningCorrect ? "bg-emerald-50 border-emerald-100 text-emerald-800" : "bg-rose-50 border-rose-100 text-rose-800"} space-y-4 shadow-sm`}
                >
                  <div className="flex items-center gap-3 font-bold text-2xl">
                    {listeningCorrect ? <CheckCircle2 className="h-8 w-8" /> : <XCircle className="h-8 w-8" />}
                    {listeningCorrect ? "Hervorragend! Correct." : "Nicht ganz. Try again?"}
                  </div>
                  <div className="space-y-2">
                    <div className="text-sm font-bold uppercase tracking-widest text-slate-400">German Transcript</div>
                    <div className="text-3xl font-bold text-slate-800 leading-tight">{currentListeningItem.front}</div>
                    <div className="mt-4 pt-4 border-t border-current/10 text-xl text-slate-600 font-medium">"{currentListeningItem.back}"</div>
                  </div>
                </motion.div>
              )}
            </div>

            <div className="flex gap-4">
              <Button className="flex-1 h-14 rounded-2xl bg-blue-600 text-lg font-bold shadow-lg shadow-blue-200" onClick={nextListening}>{listeningChecked ? "Next dictation" : "Skip"}</Button>
              <Button variant="outline" className="h-14 rounded-2xl px-6 text-slate-500 font-bold" onClick={() => playGerman(currentListeningItem.front)}><RotateCcw className="h-5 w-5 mr-0" /></Button>
            </div>
          </div>
        </Card>
      </div>

      <div className="space-y-6">
        <div className="rounded-[2rem] border border-slate-100 bg-white p-6 shadow-sm">
          <div className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-4 flex items-center gap-2"><CheckCircle2 className="h-4 w-4" /> Score Tracker</div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-slate-600">Total Score</span>
            <span className="text-2xl font-bold text-slate-900">{listeningScore}</span>
          </div>
        </div>

        <div className="rounded-[2rem] border border-slate-100 bg-blue-50/50 p-6">
          <div className="text-sm font-bold uppercase tracking-wider text-blue-400 mb-3 flex items-center gap-2"><Headphones className="h-4 w-4" /> Listening Tip</div>
          <p className="text-sm leading-relaxed text-blue-800 font-medium">
            Dictation is harder than multiple choice. It builds your internal "ear" for German syntax and word endings. Take it slow and use the special characters!
          </p>
        </div>
      </div>
    </div>
  );
}
