import { type ReactNode } from 'react';
import { Bell, Folder, Home, Search, Settings, Users } from '@/icons';
import { Avatar } from '@/components/ui/Avatar';
import { Badge } from '@/components/ui/Badge';
import { Card, CardDescription, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { IconButton } from '@/components/ui/IconButton';
import { Input } from '@/components/ui/Input';
import { Sidebar, SidebarItem, SidebarSection } from '@/components/ui/Sidebar';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/Table';
import { TopNav } from '@/components/ui/TopNav';
import { Badge as Pill } from '@/components/ui/Badge';

/* -----------------------------------------------------------------------------
 *  Generic AppShell — Sidebar + TopNav + content slot. Used by Dashboard and
 *  most other authenticated pages.
 * --------------------------------------------------------------------------- */

export interface AppShellProps {
  /** Page content. */
  children: ReactNode;
  /** Logo / wordmark for the TopNav. */
  brand: ReactNode;
}

export function AppShell({ children, brand }: AppShellProps) {
  return (
    <div className="flex min-h-screen w-full bg-background">
      <Sidebar
        defaultCollapsed={false}
        footer={
          <SidebarItem icon={<Avatar fallback="BO" size="xs" />} className="!h-10">
            Bay Otgonbayar
          </SidebarItem>
        }
      >
        <SidebarSection label="Workspace">
          <SidebarItem icon={<Home />} active>
            Home
          </SidebarItem>
          <SidebarItem icon={<Folder />}>Projects</SidebarItem>
          <SidebarItem icon={<Users />} trailing={<Pill tone="accent">3</Pill>}>
            Members
          </SidebarItem>
        </SidebarSection>
        <SidebarSection label="Account">
          <SidebarItem icon={<Settings />}>Settings</SidebarItem>
        </SidebarSection>
      </Sidebar>

      <div className="flex flex-1 flex-col min-w-0">
        <TopNav
          logo={brand}
          search={
            <Input
              type="search"
              placeholder="Search…"
              hideLabel
              label="Search"
              prefix={<Search />}
            />
          }
          actions={
            <>
              <IconButton aria-label="Notifications" icon={<Bell />} variant="ghost" />
              <Avatar size="sm" fallback="BO" />
            </>
          }
        />
        <main className="flex-1 overflow-y-auto p-6 md:p-8">{children}</main>
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
