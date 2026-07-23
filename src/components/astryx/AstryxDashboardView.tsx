import {
  Badge,
  Button,
  Card,
  Grid,
  Heading,
  HStack,
  Icon,
  List,
  ListItem,
  ProgressBar,
  Section,
  Text,
  Token,
  VStack,
} from "@astryxdesign/core";
import {
  ArrowRight,
  BookOpen,
  CircleCheck,
  Flame,
  Gamepad2,
  Headphones,
  Mic2,
  Play,
  RotateCcw,
  Target,
  Trophy,
} from "lucide-react";

import { isBulkPartKey } from "@/lib/contentBank";
import type { Part } from "@/lib/types";

type ProgressStats = {
  totalXp: number;
  sessionsCompleted: number;
  totalReviews: number;
  streak: number;
  externalWords: number;
};

type AstryxDashboardViewProps = {
  activePart?: string;
  currentPart?: Part;
  gameMasteryCount?: number;
  onOpenLesson: (partId: string) => void;
  pathParts: Array<[string, Part]>;
  progressStats: ProgressStats;
  setActiveTab: (tab: string) => void;
};

function percent(value: number, total: number) {
  if (total <= 0) return 0;
  return Math.max(0, Math.min(100, Math.round((value / total) * 100)));
}

function PageHeading({
  description,
  endContent,
  title,
}: {
  description: string;
  endContent?: React.ReactNode;
  title: string;
}) {
  const date = new Intl.DateTimeFormat("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
  }).format(new Date());

  return (
    <HStack gap={4} hAlign="between" vAlign="end" wrap="wrap">
      <VStack gap={1}>
        <Text type="supporting">{date}</Text>
        <Heading level={1}>{title}</Heading>
        <Text color="secondary" type="body">
          {description}
        </Text>
      </VStack>
      {endContent}
    </HStack>
  );
}

export function AstryxDashboardView({
  activePart,
  currentPart,
  gameMasteryCount = 0,
  onOpenLesson,
  pathParts,
  progressStats,
  setActiveTab,
}: AstryxDashboardViewProps) {
  const coreParts = pathParts.filter(([key]) => !isBulkPartKey(key));
  const lessonId = activePart ?? coreParts[0]?.[0] ?? pathParts[0]?.[0] ?? "";
  const activeIndex = Math.max(0, coreParts.findIndex(([key]) => key === lessonId));
  const progress = Math.max(8, percent(activeIndex, Math.max(1, coreParts.length - 1)));
  const nextParts = coreParts.slice(activeIndex, activeIndex + 4);
  const wordsTracked =
    progressStats.totalReviews + progressStats.externalWords + gameMasteryCount;
  const dailyXpGoal = Math.max(60, Math.ceil((progressStats.totalXp + 1) / 60) * 60);
  const xpIntoGoal = progressStats.totalXp % 60;

  return (
    <VStack gap={6}>
      <PageHeading
        description="Pick up where you stopped, then reinforce the German that needs another pass."
        endContent={
          <HStack gap={2} vAlign="center" wrap="wrap">
            <Badge label={currentPart?.level ?? "A1-A2"} variant="purple" />
            <Badge
              label={`${progressStats.streak} day streak`}
              variant={progressStats.streak ? "green" : "neutral"}
            />
          </HStack>
        }
        title="Your German today"
      />

      <Grid columns={{ minWidth: 300, repeat: "fit", max: 2 }} gap={4}>
        <Card padding={8} variant={"mission" as never}>
          <VStack gap={6}>
            <HStack gap={3} hAlign="between" vAlign="center" wrap="wrap">
              <HStack gap={2} vAlign="center">
                <Icon color="inherit" icon={Play} size="sm" />
                <Text type="label">Continue learning</Text>
              </HStack>
              <Badge label="+40 XP" variant="purple" />
            </HStack>

            <VStack gap={2}>
              <Text type="supporting">
                {currentPart?.level ?? "A1"} / {currentPart?.theme ?? "German foundations"}
              </Text>
              <Heading level={1}>{currentPart?.theme ?? "Everyday German"}</Heading>
              <Text color="secondary" type="large">
                {currentPart?.focus ??
                  currentPart?.description ??
                  "Build practical phrases for useful everyday conversations."}
              </Text>
            </VStack>

            <ProgressBar
              formatValueLabel={() => `${progress}% complete`}
              hasValueLabel
              label="Course progress"
              max={100}
              value={progress}
            />

            <HStack gap={2} wrap="wrap">
              <Token color="default" label="Meaning" />
              <Token color="default" label="Listening" />
              <Token color="default" label="Speaking" />
              <Token color="default" label={`${Math.max(6, currentPart?.vocab.length ?? 8)} words`} />
            </HStack>

            <HStack gap={3} vAlign="center" wrap="wrap">
              <Button
                endContent={<Icon color="inherit" icon={ArrowRight} size="sm" />}
                label="Continue lesson"
                onClick={() => onOpenLesson("")}
                size="lg"
                variant="primary"
              />
              <Text type="supporting">
                {progressStats.sessionsCompleted
                  ? `${progressStats.sessionsCompleted} sessions completed`
                  : "Ready when you are"}
              </Text>
            </HStack>
          </VStack>
        </Card>

        <Card padding={6}>
          <VStack gap={5}>
            <HStack gap={3} hAlign="between" vAlign="center">
              <VStack gap={1}>
                <Text type="supporting">Daily goal</Text>
                <Heading level={2}>
                  {xpIntoGoal} of {dailyXpGoal >= 60 ? 60 : dailyXpGoal} XP
                </Heading>
              </VStack>
              <Badge
                label={progressStats.sessionsCompleted ? "On track" : "Start today"}
                variant={progressStats.sessionsCompleted ? "green" : "yellow"}
              />
            </HStack>

            <ProgressBar
              formatValueLabel={() => `${Math.max(0, 60 - xpIntoGoal)} XP to go`}
              hasValueLabel
              label="Daily XP goal"
              max={60}
              value={xpIntoGoal}
              variant="warning"
            />

            <List density="compact" hasDividers>
              <ListItem
                description={`${progressStats.sessionsCompleted} completed`}
                endContent={<Badge label="+40 XP" variant="purple" />}
                label="Complete one lesson"
                startContent={
                  <Icon
                    color={progressStats.sessionsCompleted ? "success" : "accent"}
                    icon={progressStats.sessionsCompleted ? CircleCheck : Target}
                  />
                }
              />
              <ListItem
                description={`${wordsTracked.toLocaleString()} words tracked`}
                endContent={<Badge label="+15 XP" variant="green" />}
                label="Review five words"
                startContent={<Icon color={wordsTracked >= 5 ? "success" : "accent"} icon={RotateCcw} />}
              />
              <ListItem
                description="Available in your next lesson"
                endContent={<Badge label="+5 XP" variant="yellow" />}
                label="Speak one answer"
                startContent={<Icon icon={Mic2} />}
              />
            </List>

            <HStack gap={3} vAlign="center">
              <Icon color="warning" icon={Flame} />
              <VStack gap={0}>
                <Text type="label">{progressStats.streak} day learning streak</Text>
                <Text type="supporting">One focused lesson keeps it moving</Text>
              </VStack>
            </HStack>
          </VStack>
        </Card>
      </Grid>

      <Section padding={6}>
        <VStack gap={5}>
          <HStack gap={4} hAlign="between" vAlign="center" wrap="wrap">
            <VStack gap={1}>
              <Text type="supporting">A1-A2 German</Text>
              <Heading level={2}>Your learning path</Heading>
              <Text color="secondary" type="body">
                Each module reuses language from the one before it.
              </Text>
            </VStack>
            <HStack gap={2} vAlign="center">
              <Badge label={`${progress}% complete`} variant="purple" />
              <Button
                endContent={<Icon icon={ArrowRight} size="sm" />}
                label="View all lessons"
                onClick={() => setActiveTab("learn")}
                variant="ghost"
              />
            </HStack>
          </HStack>

          <ProgressBar
            formatValueLabel={() => `Module ${activeIndex + 1} of ${coreParts.length}`}
            hasValueLabel
            label="German course progress"
            max={100}
            value={progress}
          />

          <List hasDividers>
            {nextParts.map(([id, part], index) => {
              const isCurrent = id === lessonId;
              return (
                <ListItem
                  description={part.focus || part.description}
                  endContent={
                    <Badge
                      label={isCurrent ? "Continue" : index === 1 ? "Up next" : `Module ${activeIndex + index + 1}`}
                      variant={isCurrent ? "purple" : index === 1 ? "blue" : "neutral"}
                    />
                  }
                  isSelected={isCurrent}
                  key={id}
                  label={part.theme}
                  onClick={() => onOpenLesson(id)}
                  startContent={
                    <Icon
                      color={isCurrent ? "accent" : "secondary"}
                      icon={isCurrent ? Play : BookOpen}
                    />
                  }
                />
              );
            })}
          </List>
        </VStack>
      </Section>

      <Section padding={6} variant="muted">
        <Grid columns={{ minWidth: 250, repeat: "fit", max: 2 }} gap={6}>
          <VStack gap={4}>
            <HStack gap={3} vAlign="center">
              <Icon color="accent" icon={Headphones} />
              <VStack gap={0}>
                <Heading level={3}>
                  {progressStats.totalReviews.toLocaleString()} reviews completed
                </Heading>
                <Text type="supporting">
                  Revisit due words or start a short listening pass.
                </Text>
              </VStack>
            </HStack>
            <Button
              endContent={<Icon icon={ArrowRight} size="sm" />}
              label="Start quick review"
              onClick={() => onOpenLesson("")}
              variant="secondary"
            />
          </VStack>

          <VStack gap={4}>
            <HStack gap={3} vAlign="center">
              <Icon color="warning" icon={Trophy} />
              <VStack gap={0}>
                <Heading level={3}>{gameMasteryCount.toLocaleString()} game items mastered</Heading>
                <Text type="supporting">
                  Train spelling, verbs, and fast recognition in the games library.
                </Text>
              </VStack>
            </HStack>
            <Button
              endContent={<Icon icon={Gamepad2} size="sm" />}
              label="Open games"
              onClick={() => setActiveTab("games")}
              variant="ghost"
            />
          </VStack>
        </Grid>
      </Section>
    </VStack>
  );
}
