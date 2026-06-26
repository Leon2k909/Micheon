import React, { useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Wand2, RotateCcw, CheckCircle2, XCircle, Mic2 } from "lucide-react";
import { normalize } from "@/lib/api";

interface VerbsTabProps {
  currentVerbItem: any;
  showVerbMeaning: boolean;
  setShowVerbMeaning: (v: boolean) => void;
  nextVerb: () => void;
  prevVerb: () => void;
  conjugationPromptData: any;
  conjugationInput: string;
  setConjugationInput: (v: string) => void;
  checkConjugation: () => void;
  conjugationChecked: boolean;
  conjugationCorrect: boolean;
  insertConjugationCharacter: (char: string) => void;
  separableVerbs: any[];
}

export function VerbsTab({
  currentVerbItem,
  showVerbMeaning,
  setShowVerbMeaning,
  nextVerb,
  prevVerb,
  conjugationPromptData,
  conjugationInput,
  setConjugationInput,
  checkConjugation,
  conjugationChecked,
  conjugationCorrect,
  insertConjugationCharacter,
  separableVerbs
}: VerbsTabProps) {
  const conjugationInputRef = useRef<HTMLInputElement>(null);
  const GERMAN_SPECIAL_CHARACTERS = ["Ä", "ä", "É", "é", "Ö", "ö", "Ü", "ü", "ß"];

  if (!currentVerbItem) {
    return <div className="rounded-3xl border bg-white p-8 text-center text-slate-600 shadow-sm">No verbs available yet.</div>;
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
      <div className="space-y-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={`${currentVerbItem.id}-${showVerbMeaning}`}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.98 }}
            onClick={() => setShowVerbMeaning(!showVerbMeaning)}
            className="flex min-h-[440px] cursor-pointer flex-col rounded-[2.5rem] border-2 border-slate-100 bg-white p-10 text-center shadow-md transition-shadow hover:shadow-lg"
          >
            <div className="flex-1">
              <Badge className="mb-6 rounded-full px-4 py-1 text-xs font-bold uppercase tracking-widest bg-amber-50 text-amber-600 border-none">
                Verb practice
              </Badge>
              <div className="text-5xl font-bold tracking-tight text-slate-900">{currentVerbItem.lookup || currentVerbItem.front}</div>
              
              <div className="mt-10 min-h-[80px]">
                {showVerbMeaning ? (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
                    <div className="text-2xl font-semibold text-blue-600">{currentVerbItem.back}</div>
                    <div className="text-lg italic text-slate-500 bg-slate-50 p-6 rounded-2xl">{currentVerbItem.example}</div>
                  </motion.div>
                ) : (
                  <div className="text-lg text-slate-400">Can you recall the meaning? Tap to reveal.</div>
                )}
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4 mt-6">
              <Button variant="outline" className="h-14 rounded-2xl font-bold" onClick={(e) => { e.stopPropagation(); prevVerb(); }}>Previous</Button>
              <Button variant="outline" className="h-14 rounded-2xl font-bold" onClick={(e) => { e.stopPropagation(); setShowVerbMeaning(!showVerbMeaning); }}>{showVerbMeaning ? "Hide" : "Reveal"}</Button>
              <Button variant="default" className="h-14 rounded-2xl bg-blue-600 font-bold hover:bg-blue-700" onClick={(e) => { e.stopPropagation(); nextVerb(); }}>Next</Button>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="space-y-6">
        <div className="rounded-[2rem] border border-slate-100 bg-white p-6 shadow-sm">
          <div className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-4 flex items-center gap-2"><Wand2 className="h-4 w-4" /> Conjugation Drill</div>
          {conjugationPromptData ? (
            <div className="space-y-5">
              <div className="text-base text-slate-700">Conjugate <span className="font-bold text-slate-900">{conjugationPromptData.verb}</span> for <span className="font-bold text-slate-900">{conjugationPromptData.pronoun}</span>.</div>
              <div className="flex gap-4">
                <Input ref={conjugationInputRef} value={conjugationInput} onChange={(e) => setConjugationInput(e.target.value)} placeholder="Type the form..." className="rounded-2xl h-12 text-lg border-2" disabled={conjugationChecked} />
                <Button className="rounded-2xl h-12 px-6 font-bold bg-blue-600" onClick={checkConjugation} disabled={!normalize(conjugationInput) || conjugationChecked}>Check</Button>
              </div>
              <div className="flex flex-wrap gap-2 justify-center">
                {GERMAN_SPECIAL_CHARACTERS.map(char => (
                  <Button key={char} variant="outline" className="h-10 w-10 rounded-xl text-lg font-bold" onClick={() => insertConjugationCharacter(char)} disabled={conjugationChecked}>{char}</Button>
                ))}
              </div>
              {conjugationChecked && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className={`rounded-2xl p-4 text-sm font-medium flex items-center gap-3 ${conjugationCorrect ? "bg-emerald-50 text-emerald-800 border border-emerald-100" : "bg-rose-50 text-rose-800 border border-rose-100"}`}>
                  {conjugationCorrect ? <CheckCircle2 className="h-5 w-5" /> : <XCircle className="h-5 w-5" />}
                  <div>{conjugationCorrect ? "Perfectly conjugated!" : `Correct form: ${conjugationPromptData.answer}`}</div>
                </motion.div>
              )}
            </div>
          ) : (
            <div className="text-sm text-slate-400 italic">This verb is not in the conjugation map yet. Try common verbs like 'sein', 'haben', 'gehen', 'sprechen'.</div>
          )}
        </div>

        <div className="rounded-[2rem] border border-slate-100 bg-slate-50 p-6">
          <div className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-4 flex items-center gap-2"><ArrowRightIcon className="h-4 w-4" /> Separable Verbs</div>
          <div className="space-y-3">
            {separableVerbs.map((item) => (
              <div key={item.verb} className="rounded-2xl bg-white p-4 shadow-sm border border-slate-100 group transition-all hover:border-blue-200">
                <div className="flex items-center justify-between mb-1">
                  <div className="font-bold text-slate-800">{item.verb}</div>
                  <div className="text-xs text-slate-400">{item.en}</div>
                </div>
                <div className="mt-1 text-sm text-slate-600 italic">"{item.example}"</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function ArrowRightIcon(props: any) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"></path><path d="m12 5 7 7-7 7"></path></svg>
  );
}
