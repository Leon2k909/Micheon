import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { GrammarTab } from "@/ClozeGrammar";
import { ui } from "@/lib/i18n";

export default function GrammarTabContent() {
  return (
    <Card className="rounded-3xl shadow-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-xl">📖 {ui("Grammar reference")}</CardTitle>
        <CardDescription>
          {ui("Choose a German grammar topic to see the rule, a useful tip, and examples.")}
        </CardDescription>
      </CardHeader>
      <CardContent><GrammarTab /></CardContent>
    </Card>
  );
}
