import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { GrammarTab } from "@/ClozeGrammar";

export default function GrammarTabContent() {
  return (
    <Card className="rounded-3xl shadow-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-xl">📖 Grammar reference</CardTitle>
        <CardDescription>Quick rules with examples — refer back whenever something feels unclear.</CardDescription>
      </CardHeader>
      <CardContent><GrammarTab /></CardContent>
    </Card>
  );
}
