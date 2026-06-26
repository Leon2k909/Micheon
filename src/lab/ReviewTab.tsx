import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Clock3, RotateCcw } from "lucide-react";

interface ReviewTabProps {
  currentReviewItem: any;
  reviewReveal: boolean;
  setReviewReveal: (v: boolean) => void;
  rateReviewCard: (grade: string) => void;
  mixedReviewItems: any[];
  reviewStep: number;
}

export function ReviewTab({
  currentReviewItem,
  reviewReveal,
  setReviewReveal,
  rateReviewCard,
  mixedReviewItems,
  reviewStep
}: ReviewTabProps) {
  if (!currentReviewItem) {
    return (
      <Card className="rounded-[2.5rem] border-2 border-slate-100 p-12 text-center text-slate-500 shadow-sm bg-white">
        <Clock3 className="mx-auto mb-6 h-16 w-16 text-slate-200" />
        <div className="text-2xl font-bold text-slate-800">Clear skies! Nothing due right now.</div>
        <div className="mt-2 text-slate-500">Learn more cards or manually generate the next part to build your review pile.</div>
      </Card>
    );
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
      <div className="space-y-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={`${currentReviewItem.id}-${reviewReveal}`}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.98 }}
            onClick={() => setReviewReveal(!reviewReveal)}
            className="flex min-h-[440px] cursor-pointer flex-col rounded-[2.5rem] border-2 border-slate-100 bg-white p-10 text-center shadow-md transition-shadow hover:shadow-lg"
          >
            <div className="flex-1">
              <Badge className="mb-6 rounded-full px-4 py-1 text-xs font-bold uppercase tracking-widest bg-blue-50 text-blue-600 border-none">
                {currentReviewItem.partLabel}
              </Badge>
              <div className="text-5xl font-bold tracking-tight text-slate-900">{currentReviewItem.front}</div>
              
              <div className="mt-10 min-h-[80px]">
                {reviewReveal ? (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="space-y-4"
                  >
                    <div className="text-2xl font-semibold text-blue-600">{currentReviewItem.back}</div>
                    <div className="text-lg italic text-slate-500">{currentReviewItem.example}</div>
                  </motion.div>
                ) : (
                  <div className="text-lg text-slate-400">Can you recall the translation? Tap to reveal.</div>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 mt-12">
              <Button className="h-14 rounded-2xl border-none bg-rose-50 text-rose-600 hover:bg-rose-100 hover:text-rose-700 font-bold" variant="outline" onClick={(e: React.MouseEvent) => { e.stopPropagation(); rateReviewCard("again"); }}>Again</Button>
              <Button className="h-14 rounded-2xl border-none bg-amber-50 text-amber-600 hover:bg-amber-100 hover:text-amber-700 font-bold" variant="outline" onClick={(e: React.MouseEvent) => { e.stopPropagation(); rateReviewCard("hard"); }}>Hard</Button>
              <Button className="h-14 rounded-2xl border-none bg-emerald-50 text-emerald-600 hover:bg-emerald-100 hover:text-emerald-700 font-bold" variant="outline" onClick={(e: React.MouseEvent) => { e.stopPropagation(); rateReviewCard("good"); }}>Good</Button>
              <Button className="h-14 rounded-2xl border-none bg-blue-50 text-blue-600 hover:bg-blue-100 hover:text-blue-700 font-bold" variant="outline" onClick={(e: React.MouseEvent) => { e.stopPropagation(); rateReviewCard("easy"); }}>Easy</Button>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="space-y-6">
        <div className="rounded-[2rem] border border-slate-100 bg-white p-6 shadow-sm">
          <div className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-4">Daily Momentum</div>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-600">Remaining</span>
              <span className="text-lg font-bold text-slate-900">{mixedReviewItems.length}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-600">Phase step</span>
              <span className="text-lg font-bold text-slate-900">{reviewStep}</span>
            </div>
          </div>
        </div>

        <div className="rounded-[2rem] border border-slate-100 bg-slate-50 p-6">
          <div className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-3">Honesty is key</div>
          <p className="text-sm leading-relaxed text-slate-600">
            If you got it right but it took a lot of effort, mark it <span className="font-bold text-slate-900">Hard</span>. The spaced repetition algorithm works best when you grade your genuine mental struggle.
          </p>
        </div>
      </div>
    </div>
  );
}
