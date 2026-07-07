import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ClozeTab } from "@/ClozeGrammar";

export default function ClozeTabContent() {
  return (
    <Card className="rounded-3xl shadow-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-xl">✏️ Cloze exercises</CardTitle>
        <CardDescription>Fill in the missing word. Grammar tips appear on demand.</CardDescription>
      </CardHeader>
      <CardContent><ClozeTab /></CardContent>
    </Card>
  );
}
