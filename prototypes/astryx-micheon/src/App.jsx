import {useEffect, useMemo, useState} from 'react';
import {Theme} from '@astryxdesign/core';
import {AppShell} from '@astryxdesign/core/AppShell';
import {Avatar} from '@astryxdesign/core/Avatar';
import {Badge} from '@astryxdesign/core/Badge';
import {Banner} from '@astryxdesign/core/Banner';
import {Button} from '@astryxdesign/core/Button';
import {Card} from '@astryxdesign/core/Card';
import {Dialog, DialogHeader} from '@astryxdesign/core/Dialog';
import {Divider} from '@astryxdesign/core/Divider';
import {Grid, GridSpan} from '@astryxdesign/core/Grid';
import {Icon} from '@astryxdesign/core/Icon';
import {
  HStack,
  Layout,
  LayoutContent,
  LayoutFooter,
  VStack,
} from '@astryxdesign/core/Layout';
import {List, ListItem} from '@astryxdesign/core/List';
import {MobileNav} from '@astryxdesign/core/MobileNav';
import {NavIcon} from '@astryxdesign/core/NavIcon';
import {ProgressBar} from '@astryxdesign/core/ProgressBar';
import {Section} from '@astryxdesign/core/Section';
import {
  SideNav,
  SideNavItem,
  SideNavSection,
} from '@astryxdesign/core/SideNav';
import {Text, Heading} from '@astryxdesign/core/Text';
import {TextInput} from '@astryxdesign/core/TextInput';
import {Token} from '@astryxdesign/core/Token';
import {TopNav, TopNavHeading} from '@astryxdesign/core/TopNav';
import {micheonTheme} from './micheon.js';
import {
  ArrowLeft,
  ArrowRight,
  Award,
  Bell,
  BookOpen,
  ChartNoAxesColumn,
  Check,
  CircleCheck,
  Circle,
  Clock3,
  Flame,
  Headphones,
  Languages,
  LayoutDashboard,
  Library,
  LockKeyhole,
  Menu,
  MessageCircle,
  Mic2,
  Moon,
  Play,
  RotateCcw,
  Search,
  ShieldCheck,
  Sun,
  Target,
  Trophy,
  Volume2,
  Zap,
} from 'lucide-react';

const PHRASE_SET = [
  {
    german: 'Bis später.',
    english: 'See you later.',
    note: 'Use it when you expect to see the person later, often the same day.',
    answers: ['see you later', 'until later'],
    status: 'Learning',
  },
  {
    german: 'Bis bald.',
    english: 'See you soon.',
    note: 'Use it when you expect to meet again fairly soon, but not at a set time.',
    answers: ['see you soon', 'until soon'],
    status: 'Known',
  },
  {
    german: 'Bis nachher.',
    english: 'See you later.',
    note: 'Use it when you will meet again later today.',
    answers: ['see you later', 'see you later on', 'see you in a bit'],
    status: 'Learning',
  },
  {
    german: 'Bis dann.',
    english: 'See you then.',
    note: 'Use it when both people already know when they will meet next.',
    answers: ['see you then', 'until then'],
    status: 'Known',
  },
  {
    german: 'Bis gleich.',
    english: 'See you in a moment.',
    note: 'Use it when you will see the person again very shortly.',
    answers: [
      'see you in a moment',
      'see you in a minute',
      'see you shortly',
      'see you soon',
    ],
    status: 'Learning',
  },
];

const UPCOMING_LESSONS = [
  {
    title: 'Home and routine',
    description: 'Describe your room, your day, and simple habits.',
    meta: '8 phrases / 12 min',
    progress: 25,
  },
  {
    title: 'Food and cafe',
    description: 'Order clearly and ask simple follow-up questions.',
    meta: '10 phrases / 15 min',
    progress: 0,
  },
  {
    title: 'Plans and conversation',
    description: 'Make plans and give longer everyday answers.',
    meta: '9 phrases / 14 min',
    progress: 0,
  },
];

const SEARCH_ITEMS = [
  {
    label: 'Today',
    description: 'Your daily lesson, review queue, and weekly target.',
    view: 'today',
  },
  {
    label: 'Everyday goodbyes',
    description: 'Bis später, Bis bald, Bis nachher, Bis dann, and Bis gleich.',
    view: 'lesson',
  },
  {
    label: 'Lessons',
    description: 'Browse your A1-A2 course and upcoming modules.',
    view: 'lessons',
  },
  {
    label: 'Word bank',
    description: 'Search every phrase and hear it spoken.',
    view: 'wordbank',
  },
  {
    label: 'Progress',
    description: 'Review useful learning trends and next priorities.',
    view: 'progress',
  },
];

function normalizeAnswer(value) {
  return value
    .toLowerCase()
    .replace(/[.,!?;:'"]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function useCompactNavigation() {
  const [isCompact, setIsCompact] = useState(() =>
    window.matchMedia('(max-width: 767px)').matches,
  );

  useEffect(() => {
    const query = window.matchMedia('(max-width: 767px)');
    const update = event => setIsCompact(event.matches);
    query.addEventListener('change', update);
    return () => query.removeEventListener('change', update);
  }, []);

  return isCompact;
}

function speakGerman(text) {
  if (!('speechSynthesis' in window)) {
    return;
  }

  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = 'de-DE';
  utterance.rate = 0.86;
  window.speechSynthesis.speak(utterance);
}

function NavigationSections({activeView, onNavigate}) {
  const currentView = activeView === 'lesson' ? 'lessons' : activeView;

  return (
    <>
      <SideNavSection title="Learn" isHeaderHidden>
        <SideNavItem
          label="Today"
          icon={LayoutDashboard}
          isSelected={currentView === 'today'}
          onClick={() => onNavigate('today')}
        />
        <SideNavItem
          label="Learning path"
          icon={BookOpen}
          isSelected={currentView === 'lessons'}
          onClick={() => onNavigate('lessons')}
        />
        <SideNavItem
          label="Word bank"
          icon={Library}
          isSelected={currentView === 'wordbank'}
          onClick={() => onNavigate('wordbank')}
          endContent={<Badge label="575" variant="neutral" />}
        />
        <SideNavItem
          label="Progress"
          icon={ChartNoAxesColumn}
          isSelected={currentView === 'progress'}
          onClick={() => onNavigate('progress')}
        />
      </SideNavSection>
      <SideNavSection title="Quick practice">
        <SideNavItem
          label="Listen and repeat"
          icon={Headphones}
          onClick={() => onNavigate('lesson')}
        />
        <SideNavItem
          label="Conversation"
          icon={MessageCircle}
          endContent={<Badge label="New" variant="blue" />}
          onClick={() => onNavigate('lesson')}
        />
      </SideNavSection>
    </>
  );
}

function SideNavigation({activeView, onNavigate}) {
  return (
    <SideNav
      collapsible
      footer={
        <HStack gap={3} vAlign="center">
          <Avatar name="Leon" size="md" />
          <VStack gap={0}>
            <Text type="label">Leon</Text>
            <Text type="supporting">A1-A2 German</Text>
          </VStack>
        </HStack>
      }>
      <NavigationSections activeView={activeView} onNavigate={onNavigate} />
    </SideNav>
  );
}

function PageHeading({date, title, description, endContent}) {
  return (
    <HStack hAlign="between" vAlign="end" gap={4} wrap="wrap">
      <VStack gap={1}>
        <Text type="supporting">{date}</Text>
        <Heading level={1}>{title}</Heading>
        <Text type="body" color="secondary">
          {description}
        </Text>
      </VStack>
      {endContent}
    </HStack>
  );
}

function TodayView({onStartLesson, onNavigate}) {
  return (
    <VStack gap={6}>
      <PageHeading
        date="Thursday, 23 July"
        title="Your German today"
        description="Pick up where you stopped, then clear the phrases that need another pass."
        endContent={
          <HStack gap={2} vAlign="center" wrap="wrap">
            <Badge label="A1 Foundations" variant="purple" />
            <Badge label="12 day streak" variant="green" />
          </HStack>
        }
      />

      <Grid columns={{minWidth: 300, repeat: 'fit', max: 2}} gap={4}>
        <Card variant="mission" padding={8}>
          <VStack gap={6}>
            <HStack hAlign="between" vAlign="center" gap={3} wrap="wrap">
              <HStack gap={2} vAlign="center">
                <Icon icon={Play} size="sm" color="inherit" />
                <Text type="label">Continue learning</Text>
              </HStack>
              <Badge label="+40 XP" variant="purple" />
            </HStack>

            <VStack gap={2}>
              <Text type="supporting">A1 / Home and routine / Lesson 3</Text>
              <Heading level={1}>Everyday goodbyes</Heading>
              <Text type="large" color="secondary">
                Compare five phrases that all mean goodbye and learn when each
                one sounds natural.
              </Text>
            </VStack>

            <ProgressBar
              label="Lesson progress"
              value={2}
              max={5}
              hasValueLabel
              formatValueLabel={(value, max) => `${value} of ${max} phrases`}
            />

            <HStack gap={2} wrap="wrap">
              <Token label="Meaning" color="default" />
              <Token label="Listening" color="default" />
              <Token label="Speaking" color="default" />
              <Token label="10 minutes" color="default" />
            </HStack>

            <HStack gap={3} vAlign="center" wrap="wrap">
              <Button
                label="Continue lesson"
                variant="primary"
                size="lg"
                onClick={() => onStartLesson(0)}
                endContent={<Icon icon={ArrowRight} size="sm" color="inherit" />}
              />
              <Text type="supporting">Last active yesterday</Text>
            </HStack>
          </VStack>
        </Card>

        <Card padding={6}>
          <VStack gap={5}>
            <HStack hAlign="between" vAlign="center" gap={3}>
              <VStack gap={1}>
                <Text type="supporting">Daily goal</Text>
                <Heading level={2}>35 of 60 XP</Heading>
              </VStack>
              <Badge label="On track" variant="green" />
            </HStack>

            <ProgressBar
              label="Daily XP goal"
              value={35}
              max={60}
              variant="warning"
              hasValueLabel
              formatValueLabel={() => '25 XP to go'}
            />

            <List hasDividers density="compact">
              <ListItem
                label="Complete one lesson"
                description="2 of 5 phrases finished"
                startContent={<Icon icon={Target} color="accent" />}
                endContent={<Badge label="+40 XP" variant="purple" />}
              />
              <ListItem
                label="Review five phrases"
                description="Completed today"
                startContent={<Icon icon={CircleCheck} color="success" />}
                endContent={<Badge label="+15 XP" variant="green" />}
              />
              <ListItem
                label="Speak one answer"
                description="Ready in this lesson"
                startContent={<Icon icon={Mic2} />}
                endContent={<Badge label="+5 XP" variant="yellow" />}
              />
            </List>

            <HStack gap={3} vAlign="center">
              <Icon icon={Flame} color="warning" />
              <VStack gap={0}>
                <Text type="label">12 day learning streak</Text>
                <Text type="supporting">Practise today to reach day 13</Text>
              </VStack>
            </HStack>
          </VStack>
        </Card>
      </Grid>

      <Section padding={6}>
        <VStack gap={5}>
          <HStack hAlign="between" vAlign="center" gap={4} wrap="wrap">
            <VStack gap={1}>
              <Text type="supporting">A1 Foundations</Text>
              <Heading level={2}>Your learning path</Heading>
              <Text type="body" color="secondary">
                Each module reuses language from the one before it.
              </Text>
            </VStack>
            <HStack gap={2} vAlign="center">
              <Badge label="25% complete" variant="purple" />
              <Button
                label="View all lessons"
                variant="ghost"
                onClick={() => onNavigate('lessons')}
                endContent={<Icon icon={ArrowRight} size="sm" />}
              />
            </HStack>
          </HStack>

          <ProgressBar
            label="A1 Foundations progress"
            value={25}
            max={100}
            hasValueLabel
            formatValueLabel={() => 'Module 2 of 8'}
          />

          <List hasDividers>
            <ListItem
              label="Starter basics"
              description="Greetings, introductions, and essential questions"
              startContent={<Icon icon={CircleCheck} color="success" />}
              endContent={<Badge label="Complete" variant="green" />}
            />
            <ListItem
              label="Home and routine"
              description="Current lesson: Everyday goodbyes / 2 of 5 phrases"
              isSelected
              onClick={() => onStartLesson(0)}
              startContent={<Icon icon={Play} color="accent" />}
              endContent={<Badge label="Continue" variant="purple" />}
            />
            <ListItem
              label="Food and cafe"
              description="Ordering, paying, and asking simple follow-up questions"
              startContent={<Icon icon={BookOpen} />}
              endContent={<Badge label="Up next" variant="blue" />}
            />
            <ListItem
              label="Plans and conversation"
              description="Longer answers, time expressions, and making plans"
              startContent={<Icon icon={LockKeyhole} />}
              endContent={<Text type="supporting">Unlocks next</Text>}
            />
          </List>
        </VStack>
      </Section>

      <Section variant="muted" padding={6}>
        <Grid columns={{minWidth: 250, repeat: 'fit', max: 2}} gap={6}>
          <VStack gap={4}>
            <HStack gap={3} vAlign="center">
              <Icon icon={RotateCcw} color="accent" />
              <VStack gap={0}>
                <Heading level={3}>18 phrases are ready to review</Heading>
                <Text type="supporting">
                  Clear the highest-value items in about five minutes.
                </Text>
              </VStack>
            </HStack>
            <Button
              label="Start quick review"
              variant="secondary"
              onClick={() => onStartLesson(2)}
              endContent={<Icon icon={ArrowRight} size="sm" />}
            />
          </VStack>

          <VStack gap={4}>
            <HStack gap={3} vAlign="center">
              <Icon icon={Trophy} color="warning" />
              <VStack gap={0}>
                <Heading level={3}>One session from your weekly goal</Heading>
                <Text type="supporting">
                  You have completed four of five planned sessions.
                </Text>
              </VStack>
            </HStack>
            <Button
              label="See progress"
              variant="ghost"
              onClick={() => onNavigate('progress')}
              endContent={<Icon icon={ArrowRight} size="sm" />}
            />
          </VStack>
        </Grid>
      </Section>
    </VStack>
  );
}

function LessonsView({onStartLesson}) {
  return (
    <VStack gap={6}>
      <PageHeading
        date="A1 Foundations"
        title="Learning path"
        description="Move through connected modules built for useful everyday conversations."
        endContent={
          <HStack gap={2} vAlign="center">
            <Badge label="Module 2 of 8" variant="purple" />
            <Badge label="25% complete" variant="green" />
          </HStack>
        }
      />

      <Card variant="mission" padding={8}>
        <Grid columns={{minWidth: 260, repeat: 'fit', max: 2}} gap={6}>
          <VStack gap={4}>
            <HStack gap={2} vAlign="center">
              <Badge label="Current module" variant="purple" />
              <Text type="supporting">5 phrases</Text>
            </HStack>
            <VStack gap={2}>
              <Heading level={2}>Everyday goodbyes</Heading>
              <Text type="large" color="secondary">
                Compare five phrases in one sequence and learn when each one
                sounds natural.
              </Text>
            </VStack>
            <Button
              label="Continue module"
              variant="primary"
              size="lg"
              onClick={() => onStartLesson(0)}
              endContent={<Icon icon={ArrowRight} size="sm" color="inherit" />}
            />
          </VStack>
          <VStack gap={4}>
            <ProgressBar
              label="Current module progress"
              value={2}
              max={5}
              hasValueLabel
              formatValueLabel={(value, max) => `${value} of ${max} phrases`}
            />
            <List
              hasDividers
              density="compact"
              header={<Heading level={3}>Lesson sequence</Heading>}>
              <ListItem
                label="Meaning and context"
                description="Complete"
                startContent={<Icon icon={CircleCheck} color="inherit" />}
              />
              <ListItem
                label="Listening"
                description="Current stage"
                startContent={<Icon icon={Headphones} color="inherit" />}
              />
              <ListItem
                label="Speaking"
                description="Up next"
                startContent={<Icon icon={Circle} />}
              />
            </List>
          </VStack>
        </Grid>
      </Card>

      <Section padding={6}>
        <List
          hasDividers
          header={
            <HStack hAlign="between" vAlign="center" gap={4} wrap="wrap">
              <VStack gap={1}>
                <Heading level={2}>A1 module route</Heading>
                <Text type="supporting">
                  Later modules unlock as the core phrases become reliable.
                </Text>
              </VStack>
              <Badge label="2 of 8 modules" variant="purple" />
            </HStack>
          }>
          <ListItem
            label="Starter basics"
            description="Greetings, introductions, and essential questions"
            startContent={<Icon icon={CircleCheck} color="success" />}
            endContent={<Badge label="Complete" variant="green" />}
          />
          {UPCOMING_LESSONS.map((lesson, index) => (
            <ListItem
              key={lesson.title}
              label={lesson.title}
              description={lesson.description}
              onClick={index === 0 ? () => onStartLesson(0) : undefined}
              startContent={
                index === 0 ? (
                  <Icon icon={Play} color="accent" />
                ) : index === 1 ? (
                  <Icon icon={BookOpen} />
                ) : (
                  <Icon icon={LockKeyhole} />
                )
              }
              endContent={
                <Badge
                  label={
                    lesson.progress > 0
                      ? `${lesson.progress}% complete`
                      : index === 1
                        ? 'Up next'
                        : 'Locked'
                  }
                  variant={
                    lesson.progress > 0
                      ? 'purple'
                      : index === 1
                        ? 'blue'
                        : 'neutral'
                  }
                />
              }
            />
          ))}
        </List>
      </Section>
    </VStack>
  );
}

function WordBankView({onStartLesson}) {
  const [query, setQuery] = useState('');
  const filteredPhrases = useMemo(() => {
    const normalized = normalizeAnswer(query);
    if (!normalized) {
      return PHRASE_SET;
    }

    return PHRASE_SET.filter(phrase =>
      normalizeAnswer(`${phrase.german} ${phrase.english} ${phrase.note}`).includes(
        normalized,
      ),
    );
  }, [query]);

  return (
    <VStack gap={6}>
      <PageHeading
        date="575 words and phrases"
        title="Word bank"
        description="Search what you know, hear it again, and practise related items as a set."
        endContent={
          <Button
            label="Practice this group"
            variant="primary"
            onClick={() => onStartLesson(0)}
            icon={<Icon icon={Mic2} size="sm" color="inherit" />}
          />
        }
      />

      <TextInput
        label="Search German or English"
        value={query}
        onChange={setQuery}
        placeholder="Try 'later', 'bald', or 'goodbye'"
        startIcon={Search}
        hasClear
      />

      <Section padding={6}>
        <List
          hasDividers
          header={
            <VStack gap={1}>
              <Heading level={2}>Ways to say goodbye</Heading>
              <Text type="supporting">
                Grouped because the English translations overlap, while the
                German phrases point to different timings.
              </Text>
            </VStack>
          }>
          {filteredPhrases.map(phrase => (
            <ListItem
              key={phrase.german}
              label={phrase.german}
              description={
                <VStack gap={1}>
                  <Text type="body">{phrase.english}</Text>
                  <Text type="supporting">{phrase.note}</Text>
                </VStack>
              }
              startContent={
                <Button
                  label={`Hear ${phrase.german}`}
                  variant="ghost"
                  isIconOnly
                  tooltip={`Hear ${phrase.german}`}
                  icon={<Icon icon={Volume2} size="sm" />}
                  onClick={() => speakGerman(phrase.german)}
                />
              }
              endContent={
                <Token
                  label={phrase.status}
                  color={phrase.status === 'Known' ? 'green' : 'yellow'}
                  size="sm"
                />
              }
            />
          ))}
        </List>
      </Section>
    </VStack>
  );
}

function ProgressView({onStartLesson}) {
  return (
    <VStack gap={6}>
      <PageHeading
        date="Last 7 days"
        title="Your German progress"
        description="Useful signals only: what is sticking, what needs review, and what to do next."
        endContent={
          <HStack gap={2} vAlign="center">
            <Badge label="4 sessions" variant="purple" />
            <Badge label="82% recall" variant="green" />
          </HStack>
        }
      />

      <Grid columns={{minWidth: 220, repeat: 'fit', max: 3}} gap={4}>
        <Card variant="purple" padding={5}>
          <VStack gap={2}>
            <HStack gap={2} vAlign="center">
              <Icon icon={ShieldCheck} color="accent" />
              <Text type="supporting">First-try recall</Text>
            </HStack>
            <Text type="display-2" hasTabularNumbers>
              82%
            </Text>
            <Text type="body">
              Across 41 reviews, up from 76% last week.
            </Text>
          </VStack>
        </Card>
        <Card padding={5}>
          <VStack gap={2}>
            <HStack gap={2} vAlign="center">
              <Icon icon={Zap} color="accent" />
              <Text type="supporting">Words used in sentences</Text>
            </HStack>
            <Text type="display-2" hasTabularNumbers>
              34
            </Text>
            <Text type="body">
              These were produced correctly, not just recognised.
            </Text>
          </VStack>
        </Card>
        <Card variant="muted" padding={5}>
          <VStack gap={2}>
            <HStack gap={2} vAlign="center">
              <Icon icon={Award} color="accent" />
              <Text type="supporting">Conversation topics ready</Text>
            </HStack>
            <Text type="display-2" hasTabularNumbers>
              6
            </Text>
            <Text type="body">
              Home, cafe, directions, introductions, plans, and goodbyes.
            </Text>
          </VStack>
        </Card>
      </Grid>

      <Grid columns={{minWidth: 280, repeat: 'fit', max: 2}} gap={4}>
        <Card padding={6}>
          <VStack gap={5}>
            <VStack gap={1}>
              <Heading level={2}>Weekly target</Heading>
              <Text type="supporting">
                One more session completes your five-session plan.
              </Text>
            </VStack>
            <ProgressBar
              label="Weekly target"
              value={4}
              max={5}
              hasValueLabel
              formatValueLabel={(value, max) => `${value} of ${max} sessions`}
            />
            <List
              hasDividers
              density="compact"
              header={<Heading level={3}>Session quality</Heading>}>
              <ListItem
                label="Listening"
                description="Strong on familiar everyday phrases."
                endContent={<Text type="supporting">88%</Text>}
              />
              <ListItem
                label="Translation"
                description="Improving, with 7 phrases still due."
                endContent={<Text type="supporting">79%</Text>}
              />
              <ListItem
                label="Speaking"
                description="Needs one more focused practice."
                endContent={<Text type="supporting">68%</Text>}
              />
            </List>
          </VStack>
        </Card>

        <Card variant="muted" padding={6}>
          <VStack gap={5}>
            <VStack gap={1}>
              <Heading level={2}>Best next step</Heading>
              <Text type="supporting">
                Similar goodbye phrases are your highest-value review today.
              </Text>
            </VStack>
            <List
              hasDividers
              density="compact"
              header={<Heading level={3}>Why this is next</Heading>}>
              <ListItem
                label="Three phrases are still learning"
                startContent={<Icon icon={Target} color="accent" />}
              />
              <ListItem
                label="Two meanings overlap in English"
                startContent={<Icon icon={Languages} color="accent" />}
              />
              <ListItem
                label="The set takes about 10 minutes"
                startContent={<Icon icon={Clock3} color="accent" />}
              />
            </List>
            <Button
              label="Start targeted practice"
              variant="primary"
              size="lg"
              onClick={() => onStartLesson(0)}
              endContent={<Icon icon={ArrowRight} size="sm" color="inherit" />}
            />
          </VStack>
        </Card>
      </Grid>
    </VStack>
  );
}

function LessonView({initialIndex, onExit}) {
  const isCompactLesson = useCompactNavigation();
  const [phraseIndex, setPhraseIndex] = useState(initialIndex);
  const [answer, setAnswer] = useState('');
  const [result, setResult] = useState(null);
  const [showHint, setShowHint] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const phrase = PHRASE_SET[phraseIndex];

  const resetPhrase = nextIndex => {
    setPhraseIndex(nextIndex);
    setAnswer('');
    setResult(null);
    setShowHint(false);
  };

  const checkAnswer = () => {
    const normalized = normalizeAnswer(answer);
    const isCorrect = phrase.answers.some(
      acceptable => normalizeAnswer(acceptable) === normalized,
    );
    setResult(isCorrect ? 'correct' : 'incorrect');
  };

  const continueLesson = () => {
    if (phraseIndex === PHRASE_SET.length - 1) {
      setIsFinished(true);
      return;
    }

    resetPhrase(phraseIndex + 1);
  };

  const handlePrimaryAction = () => {
    if (isFinished) {
      onExit();
      return;
    }

    if (result === 'correct') {
      continueLesson();
      return;
    }

    checkAnswer();
  };

  return (
    <VStack gap={6}>
      <HStack hAlign="between" vAlign="center" gap={4} wrap="wrap">
        <Button
          label="Exit lesson"
          variant="ghost"
          icon={<Icon icon={ArrowLeft} size="sm" />}
          onClick={onExit}
        />
        <HStack gap={2} vAlign="center" wrap="wrap">
          <Badge label="Everyday goodbyes" variant="purple" />
          <Badge label="+40 XP" variant="yellow" />
          <Text type="supporting">
            {phraseIndex + 1} of {PHRASE_SET.length}
          </Text>
        </HStack>
      </HStack>

      <ProgressBar
        label="Lesson progress"
        value={isFinished ? PHRASE_SET.length : phraseIndex}
        max={PHRASE_SET.length}
        hasValueLabel
        formatValueLabel={(value, max) => `${value} of ${max} complete`}
      />

      <Section variant="muted" padding={4}>
        <HStack hAlign="between" vAlign="center" gap={4} wrap="wrap">
          <HStack gap={2} vAlign="center" wrap="wrap">
            <Token label="1 Meaning" color="green" size="sm" />
            <Token label="2 Listen" color="green" size="sm" />
            <Token label="3 Speak" color="green" size="sm" />
            <Token label="4 Type" color="green" size="sm" />
            <Token label="5 Translate" color="purple" size="sm" />
          </HStack>
          <HStack gap={3} vAlign="center">
            <HStack gap={1} vAlign="center">
              <Icon icon={Zap} size="sm" />
              <Text type="supporting">3 chain</Text>
            </HStack>
            <HStack gap={1} vAlign="center">
              <Icon icon={ShieldCheck} size="sm" />
              <Text type="supporting">92% accuracy</Text>
            </HStack>
          </HStack>
        </HStack>
      </Section>

      <Grid columns={isCompactLesson ? 1 : 3} gap={4}>
        <GridSpan columns={isCompactLesson ? 1 : 2}>
        <Card variant="practice" padding={8} minHeight={500}>
          {isFinished ? (
            <VStack gap={5}>
              <Icon icon={Check} size="lg" color="success" />
              <VStack gap={2}>
                <Heading level={1}>Goodbye set complete</Heading>
                <Text type="large" color="secondary">
                  You compared all five phrases in one session. They will stay
                  grouped in future reviews.
                </Text>
              </VStack>
              <Banner
                status="success"
                title="Five related phrases practised"
                description="Your answers will be scheduled separately, but the set will stay together."
              />
              <Button
                label="Return to today"
                variant="primary"
                size="lg"
                onClick={handlePrimaryAction}
                endContent={<Icon icon={ArrowRight} size="sm" color="inherit" />}
              />
            </VStack>
          ) : (
            <VStack gap={6}>
              <HStack hAlign="between" vAlign="center" gap={3} wrap="wrap">
                <HStack gap={2} vAlign="center">
                  <Badge label="Translate" variant="purple" />
                  <Text type="supporting">Build one useful sentence</Text>
                </HStack>
                <Button
                  label="Hear the German phrase"
                  variant="secondary"
                  icon={<Icon icon={Volume2} size="sm" />}
                  onClick={() => speakGerman(phrase.german)}
                />
              </HStack>

              <VStack gap={2}>
                <Text type="supporting">German phrase</Text>
                <Heading level={1} type="display-2">
                  {phrase.german}
                </Heading>
                <Text type="body" color="secondary">
                  {phrase.note}
                </Text>
              </VStack>

              <Divider />

              <VStack gap={4}>
                <Heading level={3}>What does this mean in English?</Heading>
                <TextInput
                  label="English translation"
                  value={answer}
                  onChange={value => {
                    setAnswer(value);
                    if (result === 'incorrect') {
                      setResult(null);
                    }
                  }}
                  placeholder="Type a natural English translation"
                  size="lg"
                  status={
                    result === 'correct'
                      ? {type: 'success', message: 'That is a natural translation.'}
                      : result === 'incorrect'
                        ? {
                            type: 'error',
                            message: `Try again. One natural answer is: ${phrase.english}`,
                          }
                        : undefined
                  }
                />

                {showHint && result !== 'correct' ? (
                  <Banner
                    status="info"
                    title="Context hint"
                    description={phrase.note}
                    isDismissable
                    onDismiss={() => setShowHint(false)}
                  />
                ) : null}

                {result === 'correct' ? (
                  <Banner
                    status="success"
                    title="Natural English accepted"
                    description={`Suggested answer: ${phrase.english}`}
                  />
                ) : null}
              </VStack>

              <HStack gap={3} vAlign="center" wrap="wrap">
                <Button
                  label={
                    result === 'correct'
                      ? phraseIndex === PHRASE_SET.length - 1
                        ? 'Finish lesson'
                        : 'Next related phrase'
                      : 'Check answer'
                  }
                  variant="primary"
                  size="lg"
                  isDisabled={!answer.trim() && result !== 'correct'}
                  onClick={handlePrimaryAction}
                  endContent={<Icon icon={ArrowRight} size="sm" color="inherit" />}
                />
                <Button
                  label="Show context hint"
                  variant="secondary"
                  onClick={() => setShowHint(true)}
                />
              </HStack>
            </VStack>
          )}
        </Card>
        </GridSpan>

        <Card variant="muted" padding={6} minHeight={500}>
          <List
            hasDividers
            header={
              <VStack gap={1}>
                <Heading level={2}>Similar phrases in this set</Heading>
                <Text type="supporting">
                  Move between them to compare the timing and meaning.
                </Text>
              </VStack>
            }>
            {PHRASE_SET.map((item, index) => (
              <ListItem
                key={item.german}
                label={item.german}
                description={item.english}
                isSelected={index === phraseIndex && !isFinished}
                onClick={() => {
                  setIsFinished(false);
                  resetPhrase(index);
                }}
                startContent={
                  index < phraseIndex || isFinished ? (
                    <Icon icon={Check} color="success" />
                  ) : index === phraseIndex ? (
                    <Icon icon={Volume2} color="accent" />
                  ) : (
                    <Icon icon={Circle} />
                  )
                }
                endContent={
                  index === phraseIndex && !isFinished ? (
                    <Badge label="Now" variant="blue" />
                  ) : undefined
                }
              />
            ))}
          </List>
        </Card>
      </Grid>
    </VStack>
  );
}

function SearchDialog({
  isOpen,
  query,
  onQueryChange,
  onOpenChange,
  onSelect,
}) {
  const results = useMemo(() => {
    const normalized = normalizeAnswer(query);
    if (!normalized) {
      return SEARCH_ITEMS;
    }
    return SEARCH_ITEMS.filter(item =>
      normalizeAnswer(`${item.label} ${item.description}`).includes(normalized),
    );
  }, [query]);

  return (
    <Dialog isOpen={isOpen} onOpenChange={onOpenChange} purpose="info">
      <Layout
        header={
          <DialogHeader
            title="Search Micheon"
            subtitle="Find a lesson, phrase set, or progress view."
            onOpenChange={onOpenChange}
          />
        }
        content={
          <LayoutContent>
            <VStack gap={4}>
              <TextInput
                label="Search"
                value={query}
                onChange={onQueryChange}
                placeholder="Search lessons and phrases"
                startIcon={Search}
                hasClear
                hasAutoFocus
              />
              <List
                hasDividers
                density="compact"
                header={<Heading level={3}>Results</Heading>}>
                {results.map(item => (
                  <ListItem
                    key={item.label}
                    label={item.label}
                    description={item.description}
                    onClick={() => onSelect(item)}
                    endContent={<Icon icon={ArrowRight} size="sm" />}
                  />
                ))}
              </List>
            </VStack>
          </LayoutContent>
        }
      />
    </Dialog>
  );
}

function NotificationsDialog({isOpen, onOpenChange, onSelect}) {
  return (
    <Dialog isOpen={isOpen} onOpenChange={onOpenChange} purpose="info">
      <Layout
        header={
          <DialogHeader
            title="Notifications"
            subtitle="Two useful updates, with no filler."
            onOpenChange={onOpenChange}
          />
        }
        content={
          <LayoutContent>
            <List
              hasDividers
              header={<Heading level={3}>Today</Heading>}>
              <ListItem
                label="Five goodbye phrases are grouped"
                description="They will now appear together in Continue learning."
                onClick={() => onSelect('lesson')}
                startContent={<Icon icon={Languages} color="accent" />}
                endContent={<Badge label="New" variant="blue" />}
              />
              <ListItem
                label="18 reviews are ready"
                description="A five-minute session will clear the most useful items."
                onClick={() => onSelect('progress')}
                startContent={<Icon icon={RotateCcw} color="accent" />}
              />
            </List>
          </LayoutContent>
        }
        footer={
          <LayoutFooter>
            <HStack hAlign="end">
              <Button
                label="Close notifications"
                variant="secondary"
                onClick={() => onOpenChange(false)}
              />
            </HStack>
          </LayoutFooter>
        }
      />
    </Dialog>
  );
}

export default function App() {
  const [mode, setMode] = useState('light');
  const [activeView, setActiveView] = useState('today');
  const [lessonStartIndex, setLessonStartIndex] = useState(0);
  const [searchOpen, setSearchOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const isCompactNavigation = useCompactNavigation();

  useEffect(() => {
    if (!isCompactNavigation) {
      setMobileNavOpen(false);
    }
  }, [isCompactNavigation]);

  const navigate = view => {
    if (view === 'lesson') {
      setLessonStartIndex(0);
    }
    setActiveView(view);
    setMobileNavOpen(false);
  };

  const startLesson = index => {
    setLessonStartIndex(index);
    setActiveView('lesson');
  };

  const selectSearchItem = item => {
    if (item.view === 'lesson') {
      startLesson(0);
    } else {
      setActiveView(item.view);
    }
    setSearchOpen(false);
    setSearchQuery('');
  };

  const selectNotification = view => {
    navigate(view);
    setNotificationsOpen(false);
  };

  const pageContent = {
    today: (
      <TodayView
        onStartLesson={startLesson}
        onNavigate={setActiveView}
      />
    ),
    lessons: <LessonsView onStartLesson={startLesson} />,
    wordbank: <WordBankView onStartLesson={startLesson} />,
    progress: <ProgressView onStartLesson={startLesson} />,
    lesson: (
      <LessonView
        key={lessonStartIndex}
        initialIndex={lessonStartIndex}
        onExit={() => setActiveView('lessons')}
      />
    ),
  }[activeView];

  return (
    <Theme theme={micheonTheme} mode={mode}>
      <AppShell
        height="fill"
        variant="elevated"
        contentPadding={6}
        topNav={
          <TopNav
            label="Micheon navigation"
            heading={
              <span
                style={{
                  "--text-supporting-size": "10px",
                  "--text-supporting-leading": "1.35",
                }}
              >
                <TopNavHeading
                  heading="Micheon"
                  subheading="made with love by Leon & Michelle"
                  logo={
                    <NavIcon
                      icon={<Icon icon={Languages} size="sm" color="inherit" />}
                    />
                  }
                />
              </span>
            }
            startContent={
              <HStack gap={2} vAlign="center">
                <Badge label="Level 8" variant="purple" />
                <Text type="supporting" color="secondary">
                  340 XP
                </Text>
              </HStack>
            }
            endContent={
              <>
                <Button
                  label="Search"
                  variant="ghost"
                  isIconOnly
                  tooltip="Search lessons and phrases"
                  icon={<Icon icon={Search} size="sm" />}
                  onClick={() => setSearchOpen(true)}
                />
                <Button
                  label="Notifications"
                  variant="ghost"
                  isIconOnly
                  tooltip="Open notifications"
                  icon={<Icon icon={Bell} size="sm" />}
                  onClick={() => setNotificationsOpen(true)}
                />
                <Button
                  label={
                    mode === 'light'
                      ? 'Switch to dark mode'
                      : 'Switch to light mode'
                  }
                  variant="ghost"
                  isIconOnly
                  tooltip={
                    mode === 'light'
                      ? 'Switch to dark mode'
                      : 'Switch to light mode'
                  }
                  icon={
                    <Icon
                      icon={mode === 'light' ? Moon : Sun}
                      size="sm"
                    />
                  }
                  onClick={() =>
                    setMode(current => (current === 'light' ? 'dark' : 'light'))
                  }
                />
                {isCompactNavigation ? (
                  <Button
                    label="Open navigation"
                    variant="ghost"
                    isIconOnly
                    tooltip="Open navigation"
                    icon={<Icon icon={Menu} size="sm" />}
                    onClick={() => setMobileNavOpen(true)}
                  />
                ) : null}
              </>
            }
          />
        }
        sideNav={
          <SideNavigation activeView={activeView} onNavigate={navigate} />
        }
        mobileNav={{breakpoint: 'md', hasToggle: false}}>
        {pageContent}
      </AppShell>

      <MobileNav
        isOpen={mobileNavOpen}
        onOpenChange={setMobileNavOpen}
        header="Micheon"
        side="start">
        <NavigationSections activeView={activeView} onNavigate={navigate} />
      </MobileNav>

      <SearchDialog
        isOpen={searchOpen}
        query={searchQuery}
        onQueryChange={setSearchQuery}
        onOpenChange={setSearchOpen}
        onSelect={selectSearchItem}
      />
      <NotificationsDialog
        isOpen={notificationsOpen}
        onOpenChange={setNotificationsOpen}
        onSelect={selectNotification}
      />
    </Theme>
  );
}
