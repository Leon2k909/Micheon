
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ClozeTab } from "@/ClozeGrammar";
import { ui } from "@/lib/i18n";

export default function ClozeTabContent() {
  return (
    <Card className="rounded-3xl shadow-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-xl">✏️ {ui("Cloze exercises")}</CardTitle>
        <CardDescription>
          {ui("Complete the German sentence with one German word. Open the grammar hint if you need the rule.")}
        </CardDescription>
      </CardHeader>
      <CardContent><ClozeTab /></CardContent>
    </Card>
  );
}
