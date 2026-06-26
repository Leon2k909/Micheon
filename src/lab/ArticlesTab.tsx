import React from "react";
import { motion } from "framer-motion";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Brain, RotateCcw, CheckCircle2, XCircle } from "lucide-react";

interface ArticlesTabProps {
  articleBuckets: { der: any[], die: any[], das: any[] };
  currentArticle: any;
  articleScore: number;
  articleIndex: number;
  articleQuestions: any[];
  articleAnswered: boolean;
  articleChoice: string;
  chooseArticle: (option: string) => void;
  nextArticle: () => void;
  resetArticleQuiz: () => void;
  articleProgress: number;
  isArticleComplete: boolean;
}

export function ArticlesTab({
  articleBuckets,
  currentArticle,
  articleScore,
  articleIndex,
  articleQuestions,
  articleAnswered,
  articleChoice,
  chooseArticle,
  nextArticle,
  resetArticleQuiz,
  articleProgress,
  isArticleComplete
}: ArticlesTabProps) {
  return (
    <div className="space-y-8">
      <div className="grid gap-4 md:grid-cols-3">
        {[
          { label: "der", items: articleBuckets.der, color: "bg-blue-50 border-blue-200 text-blue-700" },
          { label: "die", items: articleBuckets.die, color: "bg-rose-50 border-rose-200 text-rose-700" },
          { label: "das", items: articleBuckets.das, color: "bg-emerald-50 border-emerald-200 text-emerald-700" }
        ].map((bucket) => (
          <div key={bucket.label} className={`rounded-3xl border-2 p-6 transition-all hover:shadow-md ${bucket.color}`}>
            <div className="text-xl font-bold uppercase tracking-widest">{bucket.label}</div>
            <div className="mt-4 flex flex-wrap gap-2">
              {bucket.items.map((item) => (
                <Badge key={item.word} variant="outline" className="border-current/20 bg-white/40 backdrop-blur-sm px-3 py-1 text-sm font-semibold text-slate-800">
                  {item.word}
                </Badge>
              ))}
            </div>
          </div>
        ))}
      </div>

      {currentArticle ? (
        <Card className="rounded-[2.5rem] border-2 border-slate-100 bg-white p-8 shadow-sm">
          <CardHeader className="text-center">
            <div className="flex items-center justify-between text-sm font-bold uppercase tracking-wider text-slate-400 mb-2">
              <span>Score: {articleScore}/{articleQuestions.length}</span>
              <span>Question {articleIndex + 1} of {articleQuestions.length}</span>
            </div>
            <Progress value={articleProgress} className="h-2 rounded-full bg-slate-100" />
          </CardHeader>
          <CardContent className="space-y-10 pt-4">
            <motion.div 
              key={currentArticle.word}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="py-10 text-center"
            >
              <div className="text-sm font-bold uppercase tracking-[0.2em] text-blue-600 mb-4">Choose the article</div>
              <div className="text-6xl font-bold tracking-tight text-slate-900">{currentArticle.word}</div>
            </motion.div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              {["der", "die", "das"].map((option) => {
                const selected = articleChoice === option;
                const correct = articleAnswered && option === currentArticle.correct;
                const wrong = articleAnswered && selected && option !== currentArticle.correct;
                
                return (
                  <Button 
                    key={option} 
                    variant={selected ? "default" : "outline"} 
                    className={`h-20 rounded-3xl text-2xl font-bold transition-all ${
                      correct ? "bg-emerald-500 border-none hover:bg-emerald-600 text-white" : 
                      wrong ? "bg-rose-500 border-none hover:bg-rose-600 text-white" : 
                      selected ? "bg-blue-600 scale-105" : "hover:border-blue-200"
                    }`} 
                    onClick={() => chooseArticle(option)}
                    disabled={articleAnswered}
                  >
                    {option}
                  </Button>
                );
              })}
            </div>

            {articleAnswered && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-3xl bg-slate-50 p-6 flex flex-col items-center text-center space-y-2 border border-slate-100"
              >
                <div className={`text-xl font-bold ${articleChoice === currentArticle.correct ? "text-emerald-600" : "text-rose-600"}`}>
                  {articleChoice === currentArticle.correct ? "Richtig! Great job." : "Nicht ganz. Keep trying!"}
                </div>
                <div className="text-2xl font-bold text-slate-900">{currentArticle.correct} {currentArticle.word}</div>
                <div className="text-slate-500 text-sm mt-2 italic">Hint: {currentArticle.hint}</div>
              </motion.div>
            )}

            <div className="flex gap-4">
              <Button 
                className="flex-1 h-14 rounded-2xl bg-blue-600 text-lg font-bold shadow-lg shadow-blue-200" 
                onClick={nextArticle} 
                disabled={!articleAnswered}
              >
                {isArticleComplete ? "Show results" : "Next question"}
              </Button>
              <Button variant="outline" className="h-14 rounded-2xl px-6 text-slate-500" onClick={resetArticleQuiz}>
                <RotateCcw className="h-5 w-5" />
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="rounded-3xl border-2 border-slate-100 bg-white p-16 text-center text-slate-400 font-medium">
          No article quiz available for this part.
        </div>
      )}
    </div>
  );
}
