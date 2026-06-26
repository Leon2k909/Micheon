import React, { useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Target, RotateCcw, CheckCircle2, XCircle } from "lucide-react";
import { normalize } from "@/lib/api";

interface TranslationTabProps {
  translationMode: "en-de" | "de-en";
  changeTranslationMode: (mode: "en-de" | "de-en") => void;
  currentTranslation: any;
  translationScore: number;
  translationIndex: number;
  translationDeck: any[];
  translationProgress: number;
  translationInput: string;
  setTranslationInput: (v: string) => void;
  checkTranslation: () => void;
  translationChecked: boolean;
  translationCorrect: boolean;
  nextTranslation: () => void;
  resetTranslation: () => void;
  isTranslationComplete: boolean;
  insertTranslationCharacter: (char: string) => void;
  onTranslationKeyDown: (e: React.KeyboardEvent) => void;
}

export function TranslationTab({
  translationMode,
  changeTranslationMode,
  currentTranslation,
  translationScore,
  translationIndex,
  translationDeck,
  translationProgress,
  translationInput,
  setTranslationInput,
  checkTranslation,
  translationChecked,
  translationCorrect,
  nextTranslation,
  resetTranslation,
  isTranslationComplete,
  insertTranslationCharacter,
  onTranslationKeyDown
}: TranslationTabProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const GERMAN_SPECIAL_CHARACTERS = ["Ä", "ä", "É", "é", "Ö", "ö", "Ü", "ü", "ß"];

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap gap-4 p-1 bg-slate-100 rounded-3xl w-fit">
        <Button variant={translationMode === "en-de" ? "default" : "ghost"} className="rounded-2xl h-12 text-sm font-bold bg-white shadow-sm border-none text-slate-800" onClick={() => changeTranslationMode("en-de")}>English → German</Button>
        <Button variant={translationMode === "de-en" ? "default" : "ghost"} className="rounded-2xl h-12 text-sm font-bold bg-white shadow-sm border-none text-slate-800" onClick={() => changeTranslationMode("de-en")}>German → English</Button>
      </div>

      {currentTranslation ? (
        <Card className="rounded-[2.5rem] border-2 border-slate-100 bg-white p-10 shadow-sm leading-relaxed">
          <div className="flex items-center justify-between text-sm font-bold uppercase tracking-wider text-slate-400 mb-2">
            <span>Score: {translationScore}/{translationDeck.length}</span>
            <span>Question {translationIndex + 1} of {translationDeck.length}</span>
          </div>
          <Progress value={translationProgress} className="h-2 rounded-full" />
          
          <div className="py-12 space-y-10">
            <div className="text-center">
              <div className="text-sm font-bold uppercase tracking-[0.2em] text-blue-600 mb-4">{translationMode === "en-de" ? "Translate to German" : "Translate to English"}</div>
              <div className="text-4xl font-bold tracking-tight text-slate-900 leading-tight">{currentTranslation.prompt}</div>
            </div>

            <div className="space-y-6">
              <div className="flex gap-4">
                <Input 
                  ref={inputRef}
                  value={translationInput} 
                  onChange={(e) => setTranslationInput(e.target.value)} 
                  onKeyDown={onTranslationKeyDown} 
                  placeholder="Type your translation here..." 
                  className="h-16 rounded-2xl text-xl px-6 border-2 focus:border-blue-400 transition-all font-medium" 
                  disabled={translationChecked}
                />
                <Button 
                  className="h-16 rounded-2xl bg-blue-600 text-lg font-bold px-8 shadow-lg shadow-blue-200" 
                  onClick={checkTranslation} 
                  disabled={!normalize(translationInput) || translationChecked}
                >
                  Verify
                </Button>
              </div>

              {translationMode === "en-de" && (
                <div className="flex flex-wrap gap-2 justify-center">
                  {GERMAN_SPECIAL_CHARACTERS.map(char => (
                    <Button key={char} variant="outline" className="h-14 w-14 rounded-2xl text-xl font-bold bg-white hover:border-blue-300" onClick={() => insertTranslationCharacter(char)} disabled={translationChecked}>
                      {char}
                    </Button>
                  ))}
                </div>
              )}

              {translationChecked && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`rounded-3xl p-8 border-2 ${translationCorrect ? "bg-emerald-50 border-emerald-100 text-emerald-800" : "bg-rose-50 border-rose-100 text-rose-800"} flex flex-col items-center text-center space-y-4`}
                >
                  {translationCorrect ? <CheckCircle2 className="h-12 w-12" /> : <XCircle className="h-12 w-12" />}
                  <div className="text-2xl font-bold">{translationCorrect ? "Richtig! Well done." : "Fast richtig! Look closely."}</div>
                  <div className="space-y-2">
                    <div className="text-sm font-bold uppercase tracking-widest text-slate-400 mt-2">Target translation</div>
                    <div className="text-3xl font-bold text-slate-800">{currentTranslation.sample}</div>
                    <div className="mt-4 text-slate-600 text-base leading-relaxed">{currentTranslation.explain}</div>
                  </div>
                </motion.div>
              )}
            </div>

            <div className="flex gap-4">
              <Button 
                className="flex-1 h-14 rounded-2xl bg-blue-600 text-lg font-bold shadow-lg shadow-blue-200" 
                onClick={nextTranslation} 
                disabled={!translationChecked}
              >
                {isTranslationComplete ? "Show results" : "Next prompt"}
              </Button>
              <Button variant="outline" className="h-14 rounded-2xl px-6 text-slate-500 font-bold" onClick={resetTranslation}>
                <RotateCcw className="h-5 w-5 mr-2" /> Reset
              </Button>
            </div>
          </div>
        </Card>
      ) : (
        <div className="rounded-3xl border-2 border-slate-100 bg-white p-16 text-center text-slate-400 font-medium">
          No translation prompts available.
        </div>
      )}
    </div>
  );
}
