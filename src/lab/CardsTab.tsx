import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader2, Volume2, Sparkles, BookOpen } from "lucide-react";

interface CardsTabProps {
  currentCard: any;
  showMeaning: boolean;
  setShowMeaning: (v: boolean) => void;
  nextCard: () => void;
  prevCard: () => void;
  dictionaryStatus: string;
  dictionaryEntry: any;
  dictionaryLookupWord: string;
}

export function CardsTab({
  currentCard,
  showMeaning,
  setShowMeaning,
  nextCard,
  prevCard,
  dictionaryStatus,
  dictionaryEntry,
  dictionaryLookupWord
}: CardsTabProps) {
  if (!currentCard) {
    return (
      <div className="rounded-[2.5rem] border border-white/5 bg-zinc-900/50 p-20 text-center text-zinc-500 font-medium shadow-sm flex flex-col items-center gap-4 backdrop-blur-xl">
        <BookOpen className="h-10 w-10 opacity-20" />
        <div>Course module is empty. Select a different part to begin.</div>
      </div>
    );
  }

  return (
    <div className="grid gap-10 lg:grid-cols-[1fr_320px]">
      <div className="space-y-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={`${currentCard.id}-${showMeaning}`}
            initial={{ opacity: 0, scale: 0.98, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 1.02, y: -10 }}
            onClick={() => setShowMeaning(!showMeaning)}
            className="group relative flex min-h-[500px] cursor-pointer flex-col rounded-[3rem] border border-white/5 bg-zinc-900/40 p-12 text-center shadow-2xl backdrop-blur-3xl transition-all hover:bg-zinc-900/60 hover:border-blue-500/30 overflow-hidden"
          >
            {/* Background Glow Overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-600/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
            
            <div className="flex flex-1 flex-col items-center justify-center relative z-10">
              <Badge className="mb-10 bg-white/5 text-blue-400 border border-white/10 px-4 py-1.5 text-[10px] font-black uppercase tracking-widest">
                <Sparkles className="h-3 w-3 mr-2" /> {currentCard.tip || "VOCABULARY CARD"}
              </Badge>
              <div className="text-7xl font-black tracking-tighter text-white sm:text-8xl leading-none">{currentCard.de}</div>
              <div className="mt-12 text-2xl font-bold uppercase tracking-widest text-zinc-500 transition-colors group-hover:text-zinc-300">
                {showMeaning ? currentCard.en : "TAP TO SHOW MEANING"}
              </div>
              
              {showMeaning && currentCard.example && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="mt-12 rounded-[2rem] border border-white/5 bg-white/5 p-8 text-xl font-bold italic text-zinc-300 backdrop-blur-xl"
                >
                  {currentCard.example}
                </motion.div>
              )}
            </div>
            
            <div className="mt-12 grid grid-cols-2 gap-4 relative z-10">
              <Button 
                variant="outline" 
                className="h-16 rounded-2xl border-white/10 bg-white/5 text-lg font-black italic transition-all hover:bg-white/10" 
                onClick={(e: React.MouseEvent) => { e.stopPropagation(); prevCard(); }}
              >
                PREVIOUS CARD
              </Button>
              <Button 
                variant="default" 
                className="h-16 rounded-2xl bg-blue-600 text-lg font-black italic shadow-lg shadow-blue-600/20 hover:bg-blue-500 hover:scale-105 transition-all" 
                onClick={(e: React.MouseEvent) => { e.stopPropagation(); nextCard(); }}
              >
                NEXT CARD
              </Button>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="space-y-6">
        {showMeaning && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="rounded-[2.5rem] border border-white/5 bg-zinc-900/40 p-8 shadow-2xl backdrop-blur-3xl"
          >
            <div className="mb-6 flex items-center justify-between">
              <div className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">Dictionary Data</div>
              <Badge variant="outline" className="text-blue-500 border-blue-500/30 bg-blue-500/5">LEARNING DATA</Badge>
            </div>
            
            {dictionaryStatus === "loading" && (
              <div className="flex items-center gap-4 py-8 text-zinc-400">
                <Loader2 className="h-6 w-6 animate-spin text-blue-500" />
                <span className="text-sm font-bold tracking-widest uppercase">Fetching details...</span>
              </div>
            )}
            
            {dictionaryStatus === "ready" && dictionaryEntry && (
              <div className="space-y-6">
                <div>
                  <div className="text-3xl font-black text-white leading-tight">{dictionaryEntry.word}</div>
                  {dictionaryEntry.pos && <Badge className="mt-2 bg-blue-600/10 text-blue-400 border-none font-bold uppercase text-[9px] tracking-widest">{dictionaryEntry.pos}</Badge>}
                </div>
                
                <div className="space-y-3">
                  {dictionaryEntry.glosses.map((gloss: string, i: number) => (
                    <div key={i} className="text-sm border-l-2 border-blue-600/30 pl-4 py-1 font-medium leading-relaxed text-zinc-400">{gloss}</div>
                  ))}
                </div>

                {dictionaryEntry.audioUrl && (
                  <Button 
                    variant="outline" 
                    className="w-full h-14 rounded-2xl border-white/5 bg-white/5 text-xs font-black uppercase tracking-[0.2em] hover:bg-blue-600 hover:text-white hover:border-none transition-all shadow-lg hover:shadow-blue-600/20" 
                    onClick={() => new Audio(dictionaryEntry.audioUrl).play()}
                  >
                    <Volume2 className="mr-2 h-4 w-4" /> PLAY AUDIO
                  </Button>
                )}
              </div>
            )}
          </motion.div>
        )}
        
        <div className="rounded-[2.5rem] border border-blue-500/10 bg-blue-600/5 p-8 backdrop-blur-xl">
          <div className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-400 mb-4">LEARNING TIP</div>
          <div className="text-sm border-l-2 border-blue-500/30 pl-6 leading-relaxed text-zinc-300 font-bold italic">
            "Pronouncing the German word aloud before revealing the English meaning helps reinforce memory retention."
          </div>
        </div>
      </div>
    </div>
  );
}
