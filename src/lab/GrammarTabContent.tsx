
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { GrammarTab } from "@/ClozeGrammar";
import { ui } from "@/lib/i18n";
import { BookOpen } from "lucide-react";

export default function GrammarTabContent() {
  return (
    <Card className="rounded-3xl shadow-sm">
      <CardHeader className="gap-1">
        <CardTitle className="flex items-center gap-2.5 text-2xl">
          <span className="grid h-10 w-10 place-items-center rounded-2xl bg-[var(--accent)]/10 text-[var(--accent)]">
            <BookOpen className="h-5 w-5" aria-hidden="true" />
          </span>
          {ui("Grammar reference")}
        </CardTitle>
        <CardDescription>
          {ui("Choose a German grammar topic to see plain-language rules, useful patterns, and natural examples.")}
        </CardDescription>
      </CardHeader>
      <CardContent><GrammarTab /></CardContent>
    </Card>
  );
}
