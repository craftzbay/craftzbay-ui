import { Fragment, useState, type ReactNode } from 'react';
import {
  BarChart3,
  Bell,
  Bookmark,
  Folder,
  HelpCircle,
  Home,
  Inbox,
  LayoutGrid,
  LogOut,
  Menu,
  Plug,
  Search,
  Settings,
  Sparkles,
  User,
  Users,
} from '@/icons';
import { Avatar } from '@/components/ui/Avatar';
import { Badge } from '@/components/ui/Badge';
import { Card, CardDescription, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { LineChart } from '@/components/ui/Chart';
import { IconButton } from '@/components/ui/IconButton';
import { Input } from '@/components/ui/Input';
import { Kbd } from '@/components/ui/Kbd';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/Sheet';
import { Sidebar, SidebarItem, SidebarSection } from '@/components/ui/Sidebar';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/Table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/DropdownMenu';

/* -----------------------------------------------------------------------------
 *  Generic AppShell — sidebar (with brand in header + nav + footer) plus a
 *  slim topbar holding search + notifications + profile dropdown.
 *
 *  Sidebar nav, topbar actions, search, profile, and notifications are all
 *  data-driven. Sensible defaults match the legacy demo so existing call
 *  sites render unchanged.
 * --------------------------------------------------------------------------- */

function navigate(hash: string) {
  if (typeof window === 'undefined') return;
  window.location.hash = hash;
}

/* -----------------------------------------------------------------------------
 *  Public types
 * --------------------------------------------------------------------------- */

/**
 * Legacy nav keys retained for back-compat. The `active` prop now accepts
 * any string — these are kept as a typed alias for consumers that hard-code
 * one of the original demo values.
 */
export type AppShellNavKey =
  | 'home'
  | 'projects'
  | 'inbox'
  | 'members'
  | 'insights'
  | 'bookmarks'
  | 'apps'
  | 'settings'
  | 'integrations'
  | 'help';

export interface AppShellNavItem {
  /** Active-state identifier — matches AppShell's `active` prop. */
  key: string;
  label: ReactNode;
  /** Leading icon. */
  icon?: ReactNode;
  /** Destination. Renders as <a href>; for SPAs intercept onClick. */
  href?: string;
  /** Right-aligned content (Badge, count). */
  trailing?: ReactNode;
  /** Optional click handler. */
  onClick?: () => void;
}

export interface AppShellNavSection {
  /** Section heading shown above the items. */
  label?: ReactNode;
  items: AppShellNavItem[];
}

export interface AppShellUser {
  name: ReactNode;
  email?: ReactNode;
  /** 1–2 char initials for the Avatar fallback. */
  initials: string;
  /** Online status — drives the Avatar status dot. */
  status?: 'online' | 'busy' | 'away' | 'offline';
}

export interface AppShellNotification {
  id: string;
  who: { name: string; initials: string };
  action: ReactNode;
  target: ReactNode;
  when: ReactNode;
  unread?: boolean;
  onClick?: () => void;
}

export interface AppShellProfileMenuItem {
  label: ReactNode;
  icon?: ReactNode;
  trailing?: ReactNode;
  onSelect?: () => void;
  /** Renders a separator before this item. */
  separatorAbove?: boolean;
}

export interface AppShellProps {
  /** Page content. */
  children: ReactNode;
  /** Logo / wordmark rendered at the top of the sidebar. */
  brand: ReactNode;
  /** Which sidebar item is active. Matches `AppShellNavItem.key`. Defaults to `'home'`. */
  active?: string;
  /**
   * Sidebar nav sections. Defaults to the built-in demo nav. Pass an empty
   * array to hide the nav entirely, or use `sidebar` for a fully custom rail.
   */
  navSections?: AppShellNavSection[];
  /**
   * Escape hatch: replace the entire Sidebar contents. Takes precedence over
   * `navSections`. Use when you need custom section components, groups, etc.
   */
  sidebar?: ReactNode;
  /** Slot for additional topbar actions (left of notifications). */
  topbarActions?: ReactNode;
  /** Topbar search input — pass `false` to hide. */
  search?: ReactNode | false;
  /** Currently signed-in user, shown in the sidebar footer + profile menu. */
  user?: AppShellUser;
  /** Profile dropdown items. Defaults to the demo Profile / Settings / Sign out menu. */
  profileMenu?: AppShellProfileMenuItem[];
  /** Notification feed. Set to an empty array to hide the bell entirely. */
  notifications?: AppShellNotification[];
  /** Fires when the user clicks "Mark all read". */
  onMarkAllNotificationsRead?: () => void;
  /** Fires when the user clicks "View all" in the notifications menu. */
  onViewAllNotifications?: () => void;
}

/* -----------------------------------------------------------------------------
 *  Default content (matches the legacy demo)
 * --------------------------------------------------------------------------- */

const DEFAULT_NAV_SECTIONS: AppShellNavSection[] = [
  {
    label: 'Workspace',
    items: [
      { key: 'home', label: 'Home', icon: <Home />, href: '#dashboard' },
      { key: 'projects', label: 'Projects', icon: <Folder />, href: '#data-table', trailing: <Badge tone="neutral">12</Badge> },
      { key: 'inbox', label: 'Inbox', icon: <Inbox />, href: '#first-run', trailing: <Badge tone="accent">5</Badge> },
      { key: 'members', label: 'Members', icon: <Users />, href: '#record', trailing: <Badge tone="neutral">3</Badge> },
      { key: 'insights', label: 'Insights', icon: <BarChart3 />, href: '#dashboard' },
    ],
  },
  {
    label: 'Personal',
    items: [
      { key: 'bookmarks', label: 'Bookmarks', icon: <Bookmark />, href: '#pricing' },
      { key: 'apps', label: 'Apps', icon: <LayoutGrid />, href: '#onboarding' },
    ],
  },
  {
    label: 'Account',
    items: [
      { key: 'settings', label: 'Settings', icon: <Settings />, href: '#settings' },
      { key: 'integrations', label: 'Integrations', icon: <Plug />, href: '#settings' },
      { key: 'help', label: 'Help & docs', icon: <HelpCircle />, href: '#' },
    ],
  },
];

const DEFAULT_USER: AppShellUser = {
  name: 'Alex Morgan',
  email: 'alex@example.com',
  initials: 'AM',
  status: 'online',
};

const DEFAULT_NOTIFICATIONS: AppShellNotification[] = [
  { id: 'n1', who: { name: 'Anu B.', initials: 'AB' }, action: 'mentioned you in', target: 'Q2 OKRs', when: '2m', unread: true },
  { id: 'n2', who: { name: 'Bat E.', initials: 'BE' }, action: 'requested review on', target: 'fix/login-flow', when: '18m', unread: true },
  { id: 'n3', who: { name: 'Tuya G.', initials: 'TG' }, action: 'commented on', target: 'feat/segments', when: '1h', unread: true },
  { id: 'n4', who: { name: 'Khulan O.', initials: 'KO' }, action: 'archived', target: 'old-billing-spike', when: '3h' },
  { id: 'n5', who: { name: 'Sara M.', initials: 'SM' }, action: 'invited you to', target: 'Atlas workspace', when: 'Yesterday' },
];

const DEFAULT_PROFILE_MENU: AppShellProfileMenuItem[] = [
  { label: 'Profile', icon: <User className="size-4" />, onSelect: () => navigate('record') },
  { label: 'Account settings', icon: <Settings className="size-4" />, onSelect: () => navigate('settings') },
  {
    label: 'Upgrade plan',
    icon: <Sparkles className="size-4" />,
    trailing: <Badge tone="accent" className="ml-auto">Pro</Badge>,
    onSelect: () => navigate('pricing'),
  },
  { label: 'Help & support', icon: <HelpCircle className="size-4" />, onSelect: () => navigate('first-run'), separatorAbove: true },
  { label: 'Sign out', icon: <LogOut className="size-4" />, onSelect: () => navigate('auth-signin'), separatorAbove: true },
];

/* -----------------------------------------------------------------------------
 *  AppShell
 * --------------------------------------------------------------------------- */

/**
 * AppShell — sticky sidebar + topbar shell for SaaS dashboards.
 *
 * @example Default — uses the built-in demo nav, user, notifications
 *   <AppShell brand={<Logo />} active="home">
 *     <Dashboard />
 *   </AppShell>
 *
 * @example Custom nav + user
 *   <AppShell
 *     brand={<Logo />}
 *     active="projects"
 *     user={{ name: 'Avery Long', email: 'avery@acme.com', initials: 'AL', status: 'online' }}
 *     navSections={[
 *       { label: 'Workspace', items: [
 *         { key: 'home', label: 'Home', icon: <Home />, href: '/' },
 *         { key: 'projects', label: 'Projects', icon: <Folder />, href: '/projects',
 *           trailing: <Badge tone="neutral">{count}</Badge> },
 *       ]},
 *     ]}
 *     notifications={data?.notifications ?? []}
 *   >
 *     <ProjectsPage />
 *   </AppShell>
 */
export function AppShell({
  children,
  brand,
  active = 'home',
  navSections = DEFAULT_NAV_SECTIONS,
  sidebar,
  topbarActions,
  search,
  user = DEFAULT_USER,
  profileMenu = DEFAULT_PROFILE_MENU,
  notifications = DEFAULT_NOTIFICATIONS,
  onMarkAllNotificationsRead,
  onViewAllNotifications,
}: AppShellProps) {
  return (
    <div className="flex min-h-screen w-full bg-background">
      <Sidebar defaultCollapsed={false} header={brand} footer={<ProfileFooter user={user} />}>
        {sidebar ?? <RenderNavSections sections={navSections} active={active} />}
      </Sidebar>

      <div className="flex min-w-0 flex-1 flex-col">
        <TopBar
          brand={brand}
          active={active}
          navSections={navSections}
          sidebar={sidebar}
          user={user}
          search={search}
          topbarActions={topbarActions}
          notifications={notifications}
          profileMenu={profileMenu}
          onMarkAllNotificationsRead={onMarkAllNotificationsRead}
          onViewAllNotifications={onViewAllNotifications}
        />
        <main className="flex-1 overflow-y-auto p-4 md:p-8">{children}</main>
      </div>
    </div>
  );
}

function RenderNavSections({
  sections,
  active,
}: {
  sections: AppShellNavSection[];
  active: string;
}) {
  return (
    <>
      {sections.map((section, si) => (
        <SidebarSection key={si} label={section.label}>
          {section.items.map((item) => (
            <SidebarItem
              key={item.key}
              href={item.href}
              icon={item.icon}
              active={item.key === active}
              trailing={item.trailing}
              onClick={item.onClick}
            >
              {item.label}
            </SidebarItem>
          ))}
        </SidebarSection>
      ))}
    </>
  );
}

function TopBar({
  brand,
  active,
  navSections,
  sidebar,
  user,
  search,
  topbarActions,
  notifications,
  profileMenu,
  onMarkAllNotificationsRead,
  onViewAllNotifications,
}: {
  brand: ReactNode;
  active: string;
  navSections: AppShellNavSection[];
  sidebar: ReactNode | undefined;
  user: AppShellUser;
  search: ReactNode | false | undefined;
  topbarActions: ReactNode | undefined;
  notifications: AppShellNotification[];
  profileMenu: AppShellProfileMenuItem[];
  onMarkAllNotificationsRead?: () => void;
  onViewAllNotifications?: () => void;
}) {
  const [open, setOpen] = useState(false);

  const searchNode =
    search === false ? null : (
      search ?? (
        <Input
          type="search"
          placeholder="Search projects, members, files…"
          hideLabel
          label="Search"
          prefix={<Search />}
          suffix={<Kbd>⌘K</Kbd>}
        />
      )
    );

  return (
    <header className="sticky top-0 z-30 flex h-14 items-center gap-3 border-b border-border bg-background/80 px-4 backdrop-blur md:px-6">
      {/* Mobile-only hamburger + brand */}
      <div className="flex items-center gap-2 md:hidden">
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <IconButton aria-label="Open menu" icon={<Menu />} variant="ghost" size="sm" />
          </SheetTrigger>
          <SheetContent side="left" className="w-64 p-0">
            <div className="flex h-14 shrink-0 items-center border-b border-border px-3">
              {brand}
            </div>
            <div className="flex-1 overflow-y-auto py-3" onClick={() => setOpen(false)}>
              {sidebar ?? <RenderNavSections sections={navSections} active={active} />}
            </div>
            <div className="border-t border-border p-2">
              <ProfileFooter user={user} />
            </div>
          </SheetContent>
        </Sheet>
        <div className="text-sm">{brand}</div>
      </div>

      {searchNode && (
        <div className="relative hidden max-w-xl flex-1 sm:block">{searchNode}</div>
      )}

      <div className="ml-auto flex items-center gap-1">
        {topbarActions}
        {notifications.length > 0 && (
          <NotificationMenu
            notifications={notifications}
            onMarkAllRead={onMarkAllNotificationsRead}
            onViewAll={onViewAllNotifications}
          />
        )}
        <ProfileMenu user={user} items={profileMenu} />
      </div>
    </header>
  );
}

function NotificationMenu({
  notifications,
  onMarkAllRead,
  onViewAll,
}: {
  notifications: AppShellNotification[];
  onMarkAllRead?: () => void;
  onViewAll?: () => void;
}) {
  const unread = notifications.filter((n) => n.unread).length;
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          aria-label={`Notifications${unread ? `, ${unread} unread` : ''}`}
          className="relative inline-flex size-9 items-center justify-center rounded-md text-foreground-muted outline-none transition-colors hover:bg-background-muted hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
        >
          <Bell className="size-4" />
          {unread > 0 && (
            <span
              aria-hidden
              className="absolute right-2 top-2 inline-flex h-2 w-2 rounded-full bg-accent ring-2 ring-background"
            />
          )}
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80 p-0">
        <div className="flex items-center justify-between border-b border-border px-3 py-2.5">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">Notifications</span>
            {unread > 0 && <Badge tone="accent">{unread} new</Badge>}
          </div>
          {onMarkAllRead && (
            <button
              type="button"
              onClick={onMarkAllRead}
              className="text-xs text-foreground-muted hover:text-foreground"
            >
              Mark all read
            </button>
          )}
        </div>
        <ul className="max-h-80 overflow-y-auto py-1">
          {notifications.map((n) => (
            <li key={n.id}>
              <button
                type="button"
                onClick={n.onClick}
                className="flex w-full items-start gap-3 px-3 py-2.5 text-left outline-none hover:bg-background-muted focus-visible:bg-background-muted"
              >
                <div className="relative mt-0.5">
                  <Avatar size="sm" fallback={n.who.initials} />
                  {n.unread && (
                    <span
                      aria-hidden
                      className="absolute -right-0.5 -top-0.5 inline-flex h-2 w-2 rounded-full bg-accent ring-2 ring-background"
                    />
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm leading-snug">
                    <span className="font-medium text-foreground">{n.who.name}</span>{' '}
                    <span className="text-foreground-muted">{n.action}</span>{' '}
                    <span className="font-medium text-foreground">{n.target}</span>
                  </p>
                  <p className="mt-0.5 text-xs text-foreground-subtle">{n.when}</p>
                </div>
              </button>
            </li>
          ))}
        </ul>
        {onViewAll && (
          <div className="border-t border-border px-3 py-2 text-center">
            <button
              type="button"
              onClick={onViewAll}
              className="text-xs font-medium text-accent hover:underline"
            >
              View all notifications
            </button>
          </div>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function ProfileMenu({
  user,
  items,
}: {
  user: AppShellUser;
  items: AppShellProfileMenuItem[];
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          aria-label="Open profile menu"
          className="flex items-center gap-2 rounded-full p-0.5 outline-none hover:bg-background-muted focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
        >
          <Avatar size="sm" fallback={user.initials} status={user.status} />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-60">
        <DropdownMenuLabel>
          <div className="flex flex-col gap-0.5">
            <span className="text-sm font-medium text-foreground">{user.name}</span>
            {user.email && (
              <span className="text-xs text-foreground-subtle">{user.email}</span>
            )}
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {items.map((item, i) => (
          <Fragment key={i}>
            {item.separatorAbove && <DropdownMenuSeparator />}
            <DropdownMenuItem onSelect={item.onSelect}>
              {item.icon}
              {item.label}
              {item.trailing}
            </DropdownMenuItem>
          </Fragment>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function ProfileFooter({ user }: { user: AppShellUser }) {
  return (
    <div className="flex items-center gap-2.5 rounded-md px-2 py-1.5">
      <Avatar fallback={user.initials} size="sm" status={user.status} />
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium text-foreground">{user.name}</p>
        {user.email && (
          <p className="truncate text-xs text-foreground-subtle">{user.email}</p>
        )}
      </div>
    </div>
  );
}

/* -----------------------------------------------------------------------------
 *  Dashboard — header, stat cards, chart slot, recent-activity table.
 *  Data-driven: pass `stats`, `chart`, `activity`, or override the entire
 *  rendering with `children`.
 * --------------------------------------------------------------------------- */

export interface DashboardStat {
  label: ReactNode;
  value: ReactNode;
  delta?: { value: string; positive?: boolean };
}

export interface DashboardActivityRow {
  id: string;
  who: { name: string; initials: string };
  action: ReactNode;
  target: ReactNode;
  when: ReactNode;
}

export interface DashboardProps {
  /** Top heading. */
  title?: ReactNode;
  /** Subtitle below the heading. */
  subtitle?: ReactNode;
  /** Top-right slot (date-range picker, segmented control, …). */
  headerActions?: ReactNode;
  /** Stat cards rendered in a responsive grid. */
  stats?: DashboardStat[];
  /** Chart card — any ReactNode (Chart component, SVG, image, placeholder). */
  chart?: ReactNode;
  /** Title above the chart. */
  chartTitle?: ReactNode;
  /** Subtitle under the chart title. */
  chartDescription?: ReactNode;
  /** Activity table rows. */
  activity?: DashboardActivityRow[];
  /** Title for the activity table. */
  activityTitle?: ReactNode;
}

// Synthetic 30-day active-users series shown by default. Realistic-looking
// gentle upward drift with weekly periodicity.
const DEFAULT_CHART_DATA = Array.from({ length: 30 }, (_, i) => {
  const trend = 2200 + i * 22;
  const weekly = Math.sin(i / 3.5) * 180;
  const noise = (Math.sin(i * 7.3) + Math.cos(i * 3.1)) * 60;
  return { x: i, y: Math.round(trend + weekly + noise) };
});

const DEFAULT_STATS: DashboardStat[] = [
  { label: 'Active users', value: '2,840', delta: { value: '+12%', positive: true } },
  { label: 'Sessions today', value: '8,402', delta: { value: '+4%', positive: true } },
  { label: 'Open issues', value: '14', delta: { value: '−6%', positive: true } },
  { label: 'Error rate', value: '0.32%', delta: { value: '+0.05%', positive: false } },
];

const DEFAULT_ACTIVITY: DashboardActivityRow[] = [
  { id: '1', who: { name: 'Anu B.', initials: 'AB' }, action: 'merged', target: 'feat/segments', when: '12m ago' },
  { id: '2', who: { name: 'Bat E.', initials: 'BE' }, action: 'opened', target: 'fix/login-flow', when: '34m ago' },
  { id: '3', who: { name: 'Tuya G.', initials: 'TG' }, action: 'commented on', target: 'Q2 OKRs', when: '1h ago' },
  { id: '4', who: { name: 'Khulan O.', initials: 'KO' }, action: 'archived', target: 'old-billing-spike', when: '3h ago' },
];

export function Dashboard({
  title = 'Overview',
  subtitle = "What's happening across your workspace today.",
  headerActions = (
    <Badge tone="neutral" variant="outline">
      Last 7 days
    </Badge>
  ),
  stats = DEFAULT_STATS,
  chart,
  chartTitle = 'Active users',
  chartDescription = 'Distinct sessions per day, last 30 days.',
  activity = DEFAULT_ACTIVITY,
  activityTitle = 'Recent activity',
}: DashboardProps = {}) {
  return (
    <div className="space-y-8">
      <header className="flex items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">{title}</h1>
          {subtitle && <p className="mt-1 text-sm text-foreground-muted">{subtitle}</p>}
        </div>
        {headerActions && (
          <div className="hidden items-center gap-2 md:flex">{headerActions}</div>
        )}
      </header>

      {stats.length > 0 && (
        <section className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((s, i) => (
            <Card key={i}>
              <CardHeader className="pb-2">
                <CardDescription>{s.label}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-baseline gap-2">
                  <span className="tabular text-2xl font-semibold text-foreground">{s.value}</span>
                  {s.delta && (
                    <span
                      className={
                        s.delta.positive
                          ? 'tabular text-xs font-medium text-success-text'
                          : 'tabular text-xs font-medium text-danger-text'
                      }
                    >
                      {s.delta.value}
                    </span>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </section>
      )}

      {(chart !== undefined || chartTitle) && (
        <Card>
          <CardHeader>
            {chartTitle && <CardTitle>{chartTitle}</CardTitle>}
            {chartDescription && <CardDescription>{chartDescription}</CardDescription>}
          </CardHeader>
          <CardContent>{chart ?? <LineChart data={DEFAULT_CHART_DATA} height={160} className="w-full" />}</CardContent>
        </Card>
      )}

      {activity.length > 0 && (
        <Card padding="none">
          <CardHeader className="px-5 pt-5">
            <CardTitle>{activityTitle}</CardTitle>
          </CardHeader>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Who</TableHead>
                <TableHead>Action</TableHead>
                <TableHead>Target</TableHead>
                <TableHead className="text-right">When</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {activity.map((r) => (
                <TableRow key={r.id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Avatar size="xs" fallback={r.who.initials} />
                      <span className="text-foreground">{r.who.name}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-foreground-muted">{r.action}</TableCell>
                  <TableCell>
                    <Badge tone="neutral" variant="outline">
                      {r.target}
                    </Badge>
                  </TableCell>
                  <TableCell className="tabular text-right text-foreground-subtle">
                    {r.when}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      )}
    </div>
  );
}
