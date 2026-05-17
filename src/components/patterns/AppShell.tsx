import { type ReactNode } from 'react';
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
import { Input } from '@/components/ui/Input';
import { Kbd } from '@/components/ui/Kbd';
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
import { Badge as Pill } from '@/components/ui/Badge';

/* -----------------------------------------------------------------------------
 *  Generic AppShell — sidebar (with brand in header + nav + footer) plus a
 *  slim topbar holding search + notifications + profile dropdown.
 * --------------------------------------------------------------------------- */

function navigate(hash: string) {
  if (typeof window === 'undefined') return;
  window.location.hash = hash;
}

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

export interface AppShellProps {
  /** Page content. */
  children: ReactNode;
  /** Logo / wordmark rendered at the top of the sidebar. */
  brand: ReactNode;
  /** Which sidebar item is active. Defaults to `home`. */
  active?: AppShellNavKey;
}

export function AppShell({ children, brand, active = 'home' }: AppShellProps) {
  return (
    <div className="flex min-h-screen w-full bg-background">
      <Sidebar
        defaultCollapsed={false}
        header={brand}
        footer={<ProfileFooter />}
      >
        <SidebarSection label="Workspace">
          <SidebarItem href="#dashboard" icon={<Home />} active={active === 'home'}>
            Home
          </SidebarItem>
          <SidebarItem href="#data-table" icon={<Folder />} active={active === 'projects'} trailing={<Pill tone="neutral">12</Pill>}>
            Projects
          </SidebarItem>
          <SidebarItem href="#first-run" icon={<Inbox />} active={active === 'inbox'} trailing={<Pill tone="accent">5</Pill>}>
            Inbox
          </SidebarItem>
          <SidebarItem href="#record" icon={<Users />} active={active === 'members'} trailing={<Pill tone="neutral">3</Pill>}>
            Members
          </SidebarItem>
          <SidebarItem href="#dashboard" icon={<BarChart3 />} active={active === 'insights'}>
            Insights
          </SidebarItem>
        </SidebarSection>
        <SidebarSection label="Personal">
          <SidebarItem href="#pricing" icon={<Bookmark />} active={active === 'bookmarks'}>
            Bookmarks
          </SidebarItem>
          <SidebarItem href="#onboarding" icon={<LayoutGrid />} active={active === 'apps'}>
            Apps
          </SidebarItem>
        </SidebarSection>
        <SidebarSection label="Account">
          <SidebarItem href="#settings" icon={<Settings />} active={active === 'settings'}>
            Settings
          </SidebarItem>
          <SidebarItem href="#settings" icon={<Plug />} active={active === 'integrations'}>
            Integrations
          </SidebarItem>
          <SidebarItem href="#" icon={<HelpCircle />} active={active === 'help'}>
            Help & docs
          </SidebarItem>
        </SidebarSection>
      </Sidebar>

      <div className="flex flex-1 flex-col min-w-0">
        <TopBar />
        <main className="flex-1 overflow-y-auto p-6 md:p-8">{children}</main>
      </div>
    </div>
  );
}

function TopBar() {
  return (
    <header className="sticky top-0 z-30 flex h-14 items-center gap-3 border-b border-border bg-background/80 px-4 backdrop-blur md:px-6">
      <div className="relative flex-1 max-w-xl">
        <Input
          type="search"
          placeholder="Search projects, members, files…"
          hideLabel
          label="Search"
          prefix={<Search />}
          suffix={<Kbd>⌘K</Kbd>}
        />
      </div>
      <div className="ml-auto flex items-center gap-1">
        <NotificationMenu />
        <ProfileMenu />
      </div>
    </header>
  );
}

interface Notification {
  id: string;
  who: { name: string; initials: string };
  action: string;
  target: string;
  when: string;
  unread?: boolean;
}

const sampleNotifications: Notification[] = [
  { id: 'n1', who: { name: 'Anu B.', initials: 'AB' }, action: 'mentioned you in', target: 'Q2 OKRs', when: '2m', unread: true },
  { id: 'n2', who: { name: 'Bat E.', initials: 'BE' }, action: 'requested review on', target: 'fix/login-flow', when: '18m', unread: true },
  { id: 'n3', who: { name: 'Tuya G.', initials: 'TG' }, action: 'commented on', target: 'feat/segments', when: '1h', unread: true },
  { id: 'n4', who: { name: 'Khulan O.', initials: 'KO' }, action: 'archived', target: 'old-billing-spike', when: '3h' },
  { id: 'n5', who: { name: 'Sara M.', initials: 'SM' }, action: 'invited you to', target: 'Atlas workspace', when: 'Yesterday' },
];

function NotificationMenu() {
  const unread = sampleNotifications.filter((n) => n.unread).length;
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
            {unread > 0 && <Pill tone="accent">{unread} new</Pill>}
          </div>
          <button
            type="button"
            className="text-xs text-foreground-muted hover:text-foreground"
          >
            Mark all read
          </button>
        </div>
        <ul className="max-h-80 overflow-y-auto py-1">
          {sampleNotifications.map((n) => (
            <li key={n.id}>
              <button
                type="button"
                onClick={() => navigate('record')}
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
        <div className="border-t border-border px-3 py-2 text-center">
          <button
            type="button"
            onClick={() => navigate('record')}
            className="text-xs font-medium text-accent hover:underline"
          >
            View all notifications
          </button>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function ProfileMenu() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          aria-label="Open profile menu"
          className="flex items-center gap-2 rounded-full p-0.5 outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background hover:bg-background-muted"
        >
          <Avatar size="sm" fallback="BO" status="online" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-60">
        <DropdownMenuLabel>
          <div className="flex flex-col gap-0.5">
            <span className="text-sm font-medium text-foreground">Bay Otgonbayar</span>
            <span className="text-xs text-foreground-subtle">bay@craftzbay.com</span>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onSelect={() => navigate('record')}>
          <User className="size-4" />
          Profile
        </DropdownMenuItem>
        <DropdownMenuItem onSelect={() => navigate('settings')}>
          <Settings className="size-4" />
          Account settings
        </DropdownMenuItem>
        <DropdownMenuItem onSelect={() => navigate('pricing')}>
          <Sparkles className="size-4" />
          Upgrade plan
          <Pill tone="accent" className="ml-auto">Pro</Pill>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onSelect={() => navigate('first-run')}>
          <HelpCircle className="size-4" />
          Help & support
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onSelect={() => navigate('auth-signin')}>
          <LogOut className="size-4" />
          Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function ProfileFooter() {
  return (
    <div className="flex items-center gap-2.5 rounded-md px-2 py-1.5">
      <Avatar fallback="BO" size="sm" status="online" />
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium text-foreground">Bay Otgonbayar</p>
        <p className="truncate text-xs text-foreground-subtle">Owner</p>
      </div>
    </div>
  );
}

/* -----------------------------------------------------------------------------
 *  Dashboard pattern — header, 4 stat cards, a chart placeholder, recent
 *  activity table.
 * --------------------------------------------------------------------------- */

interface Stat {
  label: string;
  value: string;
  delta?: { value: string; positive?: boolean };
}

const sampleStats: Stat[] = [
  { label: 'Active users', value: '2,840', delta: { value: '+12%', positive: true } },
  { label: 'Sessions today', value: '8,402', delta: { value: '+4%', positive: true } },
  { label: 'Open issues', value: '14', delta: { value: '−6%', positive: true } },
  { label: 'Error rate', value: '0.32%', delta: { value: '+0.05%', positive: false } },
];

interface ActivityRow {
  id: string;
  who: { name: string; initials: string };
  action: string;
  target: string;
  when: string;
}

const sampleActivity: ActivityRow[] = [
  { id: '1', who: { name: 'Anu B.', initials: 'AB' }, action: 'merged', target: 'feat/segments', when: '12m ago' },
  { id: '2', who: { name: 'Bat E.', initials: 'BE' }, action: 'opened', target: 'fix/login-flow', when: '34m ago' },
  { id: '3', who: { name: 'Tuya G.', initials: 'TG' }, action: 'commented on', target: 'Q2 OKRs', when: '1h ago' },
  { id: '4', who: { name: 'Khulan O.', initials: 'KO' }, action: 'archived', target: 'old-billing-spike', when: '3h ago' },
];

export function Dashboard() {
  return (
    <div className="space-y-8">
      <header className="flex items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">Overview</h1>
          <p className="text-sm text-foreground-muted mt-1">
            What's happening across your workspace today.
          </p>
        </div>
        <div className="hidden md:flex items-center gap-2">
          <Pill tone="neutral" variant="outline">
            Last 7 days
          </Pill>
        </div>
      </header>

      <section className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {sampleStats.map((s) => (
          <Card key={s.label}>
            <CardHeader className="pb-2">
              <CardDescription>{s.label}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-semibold tabular text-foreground">{s.value}</span>
                {s.delta && (
                  <span
                    className={
                      s.delta.positive
                        ? 'text-xs font-medium text-success-text tabular'
                        : 'text-xs font-medium text-danger-text tabular'
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

      <Card>
        <CardHeader>
          <CardTitle>Active users</CardTitle>
          <CardDescription>Distinct sessions per day, last 30 days.</CardDescription>
        </CardHeader>
        <CardContent>
          {/* Chart goes here — placeholder maintains layout */}
          <div
            role="img"
            aria-label="Active users sparkline"
            className="h-48 w-full rounded-md border border-dashed border-border bg-background-subtle"
          />
        </CardContent>
      </Card>

      <Card padding="none">
        <CardHeader className="px-5 pt-5">
          <CardTitle>Recent activity</CardTitle>
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
            {sampleActivity.map((r) => (
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
                <TableCell className="text-right tabular text-foreground-subtle">{r.when}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
