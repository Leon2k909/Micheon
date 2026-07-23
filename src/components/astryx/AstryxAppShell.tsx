import { useMemo, useState, type CSSProperties, type ReactNode } from "react";
import {
  AppShell,
  Avatar,
  Badge,
  Button,
  Dialog,
  DialogHeader,
  Heading,
  HStack,
  Icon,
  Layout,
  LayoutContent,
  LayoutFooter,
  List,
  ListItem,
  NavIcon,
  SideNav,
  SideNavItem,
  SideNavSection,
  Text,
  TextInput,
  TopNav,
  TopNavHeading,
  VStack,
} from "@astryxdesign/core";
import {
  Bell,
  BookOpen,
  Gamepad2,
  GraduationCap,
  Languages,
  LayoutDashboard,
  LogOut,
  Moon,
  Repeat,
  Search,
  Settings,
  Sun,
} from "lucide-react";

import type { TopNavNotification, TopNavSearchItem } from "@/components/TopNav";
import type { Theme } from "@/lib/theme";
import { setTheme } from "@/lib/theme";

type AstryxAppShellProps = {
  activeTab: string;
  avatarUrl?: string;
  brandName: string;
  children: ReactNode;
  notifications: TopNavNotification[];
  onSignOut: () => void;
  onSwitchCourse: () => void;
  searchItems: TopNavSearchItem[];
  setActiveTab: (tab: string) => void;
  streak: number;
  theme: Theme;
  userEmail: string;
  userName: string;
  xp: number;
};

const NAV_ITEMS = [
  { id: "dashboard", label: "Today", icon: LayoutDashboard },
  { id: "learn", label: "Learning path", icon: BookOpen },
  { id: "games", label: "Games", icon: Gamepad2 },
  { id: "grammar", label: "Grammar", icon: GraduationCap },
  { id: "profile", label: "Preferences", icon: Settings },
] as const;

function AstryxNavigation({
  activeTab,
  setActiveTab,
}: Pick<AstryxAppShellProps, "activeTab" | "setActiveTab">) {
  return (
    <>
      <SideNavSection title="Learn" isHeaderHidden>
        {NAV_ITEMS.slice(0, 4).map((item) => (
          <SideNavItem
            icon={item.icon}
            isSelected={activeTab === item.id}
            key={item.id}
            label={item.label}
            onClick={() => setActiveTab(item.id)}
          />
        ))}
      </SideNavSection>
      <SideNavSection title="Account">
        <SideNavItem
          icon={Settings}
          isSelected={activeTab === "profile"}
          label="Preferences"
          onClick={() => setActiveTab("profile")}
        />
      </SideNavSection>
    </>
  );
}

function AstryxSearchDialog({
  isOpen,
  items,
  onOpenChange,
}: {
  isOpen: boolean;
  items: TopNavSearchItem[];
  onOpenChange: (isOpen: boolean) => void;
}) {
  const [query, setQuery] = useState("");
  const results = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) return items.slice(0, 10);
    return items
      .filter((item) =>
        `${item.title} ${item.subtitle} ${item.group}`.toLowerCase().includes(normalized)
      )
      .slice(0, 10);
  }, [items, query]);

  const select = (item: TopNavSearchItem) => {
    item.onSelect();
    setQuery("");
    onOpenChange(false);
  };

  return (
    <Dialog isOpen={isOpen} onOpenChange={onOpenChange} purpose="info" width={620}>
      <Layout
        header={
          <DialogHeader
            onOpenChange={onOpenChange}
            subtitle="Find a real lesson, game, or account page."
            title="Search Micheon"
          />
        }
        content={
          <LayoutContent>
            <VStack gap={4}>
              <TextInput
                hasAutoFocus
                hasClear
                label="Search"
                onChange={setQuery}
                placeholder="Search lessons, phrases, and games"
                startIcon={Search}
                value={query}
              />
              <List
                density="compact"
                hasDividers
                header={<Heading level={3}>{results.length ? "Results" : "No matches"}</Heading>}
              >
                {results.map((item) => (
                  <ListItem
                    description={`${item.group} · ${item.subtitle}`}
                    endContent={
                      item.actionLabel ? <Badge label={item.actionLabel} variant="purple" /> : undefined
                    }
                    key={item.id}
                    label={item.title}
                    onClick={() => select(item)}
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

function AstryxNotificationsDialog({
  isOpen,
  notifications,
  onOpenChange,
}: {
  isOpen: boolean;
  notifications: TopNavNotification[];
  onOpenChange: (isOpen: boolean) => void;
}) {
  const select = (notification: TopNavNotification) => {
    notification.onSelect?.();
    onOpenChange(false);
  };

  return (
    <Dialog isOpen={isOpen} onOpenChange={onOpenChange} purpose="info" width={560}>
      <Layout
        header={
          <DialogHeader
            onOpenChange={onOpenChange}
            subtitle={`${notifications.filter((item) => item.unread).length} useful update${
              notifications.filter((item) => item.unread).length === 1 ? "" : "s"
            } waiting.`}
            title="Notifications"
          />
        }
        content={
          <LayoutContent>
            <List hasDividers header={<Heading level={3}>Today</Heading>}>
              {notifications.map((notification) => (
                <ListItem
                  description={notification.body}
                  endContent={
                    notification.unread ? <Badge label="New" variant="blue" /> : undefined
                  }
                  key={notification.id}
                  label={notification.title}
                  onClick={() => select(notification)}
                  startContent={<Icon color={notification.unread ? "accent" : "secondary"} icon={Bell} />}
                />
              ))}
            </List>
          </LayoutContent>
        }
        footer={
          <LayoutFooter>
            <HStack hAlign="end">
              <Button
                label="Close notifications"
                onClick={() => onOpenChange(false)}
                variant="secondary"
              />
            </HStack>
          </LayoutFooter>
        }
      />
    </Dialog>
  );
}

export function AstryxAppShell({
  activeTab,
  avatarUrl,
  brandName,
  children,
  notifications,
  onSignOut,
  onSwitchCourse,
  searchItems,
  setActiveTab,
  streak,
  theme,
  userEmail,
  userName,
  xp,
}: AstryxAppShellProps) {
  const [searchOpen, setSearchOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  return (
    <div className="astryx-production-shell">
      <AppShell
        contentPadding={6}
        height="fill"
        mobileNav={{ breakpoint: "md" }}
        sideNav={
          <SideNav
            collapsible
            footer={
              <VStack gap={3}>
                <HStack gap={2} wrap="wrap">
                  <Button
                    icon={<Icon icon={Repeat} size="sm" />}
                    label="Switch course"
                    onClick={onSwitchCourse}
                    variant="secondary"
                  />
                  <Button
                    icon={<Icon icon={LogOut} size="sm" />}
                    label="Sign out"
                    onClick={onSignOut}
                    variant="ghost"
                  />
                </HStack>
                <HStack gap={3} vAlign="center">
                  <Avatar name={userName} size="md" src={avatarUrl} />
                  <VStack gap={0}>
                    <Text type="label">{userName}</Text>
                    <Text color="secondary" type="supporting">
                      {userEmail}
                    </Text>
                  </VStack>
                </HStack>
              </VStack>
            }
          >
            <AstryxNavigation activeTab={activeTab} setActiveTab={setActiveTab} />
          </SideNav>
        }
        topNav={
          <TopNav
            endContent={
              <>
                <Button
                  icon={<Icon icon={Search} size="sm" />}
                  isIconOnly
                  label="Search"
                  onClick={() => setSearchOpen(true)}
                  tooltip="Search lessons, phrases, and games"
                  variant="ghost"
                />
                <Button
                  icon={<Icon icon={Bell} size="sm" />}
                  isIconOnly
                  label="Notifications"
                  onClick={() => setNotificationsOpen(true)}
                  tooltip="Open notifications"
                  variant="ghost"
                />
                <Button
                  icon={<Icon icon={theme === "light" ? Moon : Sun} size="sm" />}
                  isIconOnly
                  label={theme === "light" ? "Switch to dark mode" : "Switch to light mode"}
                  onClick={() => setTheme(theme === "light" ? "dark" : "light")}
                  tooltip={theme === "light" ? "Switch to dark mode" : "Switch to light mode"}
                  variant="ghost"
                />
                <Button
                  icon={<Icon icon={Settings} size="sm" />}
                  isIconOnly
                  label="Preferences"
                  onClick={() => setActiveTab("profile")}
                  tooltip="Open preferences"
                  variant="ghost"
                />
              </>
            }
            heading={
              <span
                style={{
                  "--text-supporting-size": "10px",
                  "--text-supporting-leading": "1.35",
                } as CSSProperties}
              >
                <TopNavHeading
                  heading="Micheon"
                  subheading="made with love by Leon & Michelle"
                  logo={
                    <NavIcon icon={<Icon color="inherit" icon={Languages} size="sm" />} />
                  }
                />
              </span>
            }
            label="Micheon navigation"
            startContent={
              <HStack gap={2} vAlign="center">
                <Badge label={brandName} variant="neutral" />
                <Badge label={`${streak} day streak`} variant="purple" />
                <Text color="secondary" type="supporting">
                  {xp.toLocaleString()} XP
                </Text>
              </HStack>
            }
          />
        }
        variant="elevated"
      >
        {children}
      </AppShell>

      <AstryxSearchDialog
        isOpen={searchOpen}
        items={searchItems}
        onOpenChange={setSearchOpen}
      />
      <AstryxNotificationsDialog
        isOpen={notificationsOpen}
        notifications={notifications}
        onOpenChange={setNotificationsOpen}
      />
    </div>
  );
}
