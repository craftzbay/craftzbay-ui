import { useEffect, useMemo, useState, type ComponentType, type ReactNode } from 'react';
import {
  BarChart3,
  Bell,
  CreditCard,
  Folder,
  Home,
  Inbox,
  LogOut,
  Mail,
  MoreHorizontal,
  Pencil,
  Plus,
  Search,
  Settings as SettingsIcon,
  Trash2,
  User,
  Users,
} from 'lucide-react';
import {
  Avatar,
  Badge,
  BarChart,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  IconButton,
  Input,
  LineChart,
  Pagination,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  Switch,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  Toaster,
  cn,
  useToast,
} from '@craftzbay/ui';

/* =============================================================================
 *  AdminDashboard — a complete, sellable admin console.
 *
 *  Layout: a slim ICON RAIL on the far left switches the active area; clicking
 *  an icon renders that area's child menu in the secondary panel. The panel's
 *  items switch the page shown in the main column. The top bar carries a
 *  working notifications menu and profile menu. Pages are real and interactive
 *  — Projects is full CRUD with search, status filter and pagination; Team and
 *  Billing have their own data; Settings persists with a toast.
 * ========================================================================== */

interface NavChild {
  key: string;
  label: string;
}
interface NavArea {
  key: string;
  label: string;
  icon: ComponentType<{ className?: string }>;
  children: NavChild[];
}

const AREAS: NavArea[] = [
  { key: 'dashboard', label: 'Dashboard', icon: Home, children: [
    { key: 'overview', label: 'Overview' },
    { key: 'analytics', label: 'Analytics' },
  ] },
  { key: 'projects', label: 'Projects', icon: Folder, children: [
    { key: 'projects', label: 'All projects' },
    { key: 'archived', label: 'Archived' },
  ] },
  { key: 'inbox', label: 'Inbox', icon: Inbox, children: [
    { key: 'inbox', label: 'Messages' },
  ] },
  { key: 'team', label: 'Team', icon: Users, children: [
    { key: 'members', label: 'Members' },
    { key: 'invites', label: 'Invitations' },
  ] },
  { key: 'insights', label: 'Insights', icon: BarChart3, children: [
    { key: 'reports', label: 'Reports' },
  ] },
  { key: 'settings', label: 'Settings', icon: SettingsIcon, children: [
    { key: 'profile', label: 'Profile' },
    { key: 'notifications', label: 'Notifications' },
    { key: 'billing', label: 'Billing' },
  ] },
];

const USER = { name: 'Alex Morgan', email: 'alex@example.com', initials: 'AM' };

/* -------------------------------------------------------------------------- */
/*  Shared bits                                                               */
/* -------------------------------------------------------------------------- */

function PageHeader({ title, subtitle, actions }: { title: ReactNode; subtitle?: ReactNode; actions?: ReactNode }) {
  return (
    <header className="mb-6 flex flex-wrap items-end justify-between gap-4">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">{title}</h1>
        {subtitle && <p className="mt-1 text-sm text-foreground-muted">{subtitle}</p>}
      </div>
      {actions && <div className="flex items-center gap-2">{actions}</div>}
    </header>
  );
}

function StatCard({ label, value, delta, positive }: { label: string; value: string; delta?: string; positive?: boolean }) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardDescription>{label}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-baseline gap-2">
          <span className="tabular text-2xl font-semibold text-foreground">{value}</span>
          {delta && (
            <span className={cn('tabular text-xs font-medium', positive ? 'text-success-text' : 'text-danger-text')}>
              {delta}
            </span>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

const SERIES_A = Array.from({ length: 30 }, (_, i) => ({
  x: i,
  y: Math.round(2200 + i * 22 + Math.sin(i / 3.5) * 180 + Math.cos(i * 3.1) * 60),
}));
const SERIES_B = Array.from({ length: 30 }, (_, i) => ({
  x: i,
  y: Math.round(1400 + i * 14 + Math.sin(i / 2.5) * 220 + Math.cos(i * 5) * 70),
}));
const CHANNELS = [
  { x: 'Direct', y: 4200 },
  { x: 'Search', y: 3100 },
  { x: 'Social', y: 2400 },
  { x: 'Email', y: 1800 },
  { x: 'Referral', y: 1200 },
];

/* -------------------------------------------------------------------------- */
/*  Dashboard / Overview + Analytics                                          */
/* -------------------------------------------------------------------------- */

const ACTIVITY = [
  { id: '1', who: 'Anu B.', initials: 'AB', action: 'merged', target: 'feat/segments', when: '12m ago' },
  { id: '2', who: 'Bat E.', initials: 'BE', action: 'opened', target: 'fix/login-flow', when: '34m ago' },
  { id: '3', who: 'Tuya G.', initials: 'TG', action: 'commented on', target: 'Q2 OKRs', when: '1h ago' },
  { id: '4', who: 'Khulan O.', initials: 'KO', action: 'archived', target: 'old-billing-spike', when: '3h ago' },
];

function Overview() {
  return (
    <div>
      <PageHeader title="Overview" subtitle="What's happening across your workspace today." actions={<Badge tone="neutral" variant="outline">Last 7 days</Badge>} />
      <section className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Active users" value="2,840" delta="+12%" positive />
        <StatCard label="Sessions today" value="8,402" delta="+4%" positive />
        <StatCard label="Open issues" value="14" delta="−6%" positive />
        <StatCard label="Error rate" value="0.32%" delta="+0.05%" />
      </section>
      <Card className="mt-4">
        <CardHeader>
          <CardTitle>Active users</CardTitle>
          <CardDescription>Distinct sessions per day, last 30 days.</CardDescription>
        </CardHeader>
        <CardContent>
          <LineChart data={SERIES_A} height={200} />
        </CardContent>
      </Card>
      <Card padding="none" className="mt-4">
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
            {ACTIVITY.map((r) => (
              <TableRow key={r.id}>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Avatar size="xs" fallback={r.initials} />
                    <span className="text-foreground">{r.who}</span>
                  </div>
                </TableCell>
                <TableCell className="text-foreground-muted">{r.action}</TableCell>
                <TableCell><Badge tone="neutral" variant="outline">{r.target}</Badge></TableCell>
                <TableCell className="tabular text-right text-foreground-subtle">{r.when}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}

function Analytics() {
  return (
    <div>
      <PageHeader title="Analytics" subtitle="Traffic and engagement breakdown." actions={<Badge tone="neutral" variant="outline">Last 30 days</Badge>} />
      <section className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <StatCard label="Page views" value="128k" delta="+8%" positive />
        <StatCard label="Avg. session" value="4m 12s" delta="+14s" positive />
        <StatCard label="Bounce rate" value="38%" delta="−2%" positive />
      </section>
      <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader><CardTitle>Sessions</CardTitle><CardDescription>Per day</CardDescription></CardHeader>
          <CardContent><LineChart data={SERIES_B} height={200} /></CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Traffic by channel</CardTitle><CardDescription>This month</CardDescription></CardHeader>
          <CardContent><BarChart data={CHANNELS} height={200} /></CardContent>
        </Card>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Projects — full CRUD                                                      */
/* -------------------------------------------------------------------------- */

interface Project {
  id: number;
  name: string;
  status: 'Active' | 'In review' | 'Blocked' | 'Archived';
  owner: string;
  updated: string;
}
const STATUS_TONE: Record<Project['status'], 'success' | 'warning' | 'danger' | 'neutral'> = {
  Active: 'success',
  'In review': 'warning',
  Blocked: 'danger',
  Archived: 'neutral',
};
const SEED_PROJECTS: Project[] = [
  { id: 1, name: 'Aurora web', status: 'Active', owner: 'Anu B.', updated: '12m ago' },
  { id: 2, name: 'Billing v2', status: 'In review', owner: 'Bat E.', updated: '1h ago' },
  { id: 3, name: 'Mobile beta', status: 'Active', owner: 'Tuya G.', updated: '3h ago' },
  { id: 4, name: 'Data pipeline', status: 'Blocked', owner: 'Khulan O.', updated: 'Yesterday' },
  { id: 5, name: 'Design system', status: 'Active', owner: 'Sara K.', updated: '2d ago' },
  { id: 6, name: 'Legacy import', status: 'Archived', owner: 'Mark R.', updated: '1w ago' },
  { id: 7, name: 'Search revamp', status: 'In review', owner: 'Anu B.', updated: '5h ago' },
  { id: 8, name: 'Onboarding flow', status: 'Active', owner: 'Tuya G.', updated: '2d ago' },
  { id: 9, name: 'Audit logging', status: 'Blocked', owner: 'Bat E.', updated: '4d ago' },
  { id: 10, name: 'Marketing site', status: 'Active', owner: 'Sara K.', updated: '6h ago' },
  { id: 11, name: 'API gateway', status: 'In review', owner: 'Mark R.', updated: '1d ago' },
];
const STATUSES: Project['status'][] = ['Active', 'In review', 'Blocked', 'Archived'];
const PAGE_SIZE = 6;

function ProjectDialog({
  open,
  onOpenChange,
  initial,
  onSave,
}: {
  open: boolean;
  onOpenChange: (o: boolean) => void;
  initial: Project | null;
  onSave: (p: { name: string; status: Project['status']; owner: string }) => void;
}) {
  const [name, setName] = useState('');
  const [owner, setOwner] = useState('');
  const [status, setStatus] = useState<Project['status']>('Active');

  // Sync form when opening for a different row.
  useEffect(() => {
    if (open) {
      setName(initial?.name ?? '');
      setOwner(initial?.owner ?? '');
      setStatus(initial?.status ?? 'Active');
    }
  }, [open, initial]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{initial ? 'Edit project' : 'New project'}</DialogTitle>
          <DialogDescription>{initial ? 'Update the project details.' : 'Add a project to your workspace.'}</DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <Input label="Name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Project name" />
          <Input label="Owner" value={owner} onChange={(e) => setOwner(e.target.value)} placeholder="Owner name" />
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-foreground">Status</label>
            <Select value={status} onValueChange={(v) => setStatus(v as Project['status'])}>
              <SelectTrigger placeholder="Status" />
              <SelectContent>
                {STATUSES.map((s) => (
                  <SelectItem key={s} value={s}>{s}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button variant="ghost" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button
            disabled={!name.trim()}
            onClick={() => {
              onSave({ name: name.trim(), status, owner: owner.trim() || 'Unassigned' });
              onOpenChange(false);
            }}
          >
            {initial ? 'Save changes' : 'Create project'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function Projects() {
  const { push } = useToast();
  const [items, setItems] = useState<Project[]>(SEED_PROJECTS);
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState<'all' | Project['status']>('all');
  const [page, setPage] = useState(1);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Project | null>(null);

  const filtered = useMemo(() => {
    return items.filter(
      (p) =>
        (filter === 'all' || p.status === filter) &&
        p.name.toLowerCase().includes(query.toLowerCase()),
    );
  }, [items, filter, query]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const current = Math.min(page, pageCount);
  const rows = filtered.slice((current - 1) * PAGE_SIZE, current * PAGE_SIZE);

  const remove = (p: Project) => {
    setItems((xs) => xs.filter((x) => x.id !== p.id));
    push({ variant: 'success', title: 'Project deleted', description: p.name });
  };
  const save = (data: { name: string; status: Project['status']; owner: string }) => {
    if (editing) {
      setItems((xs) => xs.map((x) => (x.id === editing.id ? { ...x, ...data, updated: 'just now' } : x)));
      push({ variant: 'success', title: 'Project updated', description: data.name });
    } else {
      setItems((xs) => [{ id: Math.max(0, ...xs.map((x) => x.id)) + 1, updated: 'just now', ...data }, ...xs]);
      push({ variant: 'success', title: 'Project created', description: data.name });
    }
  };

  return (
    <div>
      <PageHeader
        title="Projects"
        subtitle={`${filtered.length} of ${items.length} projects`}
        actions={
          <Button onClick={() => { setEditing(null); setDialogOpen(true); }}>
            <Plus className="mr-1 size-4" aria-hidden /> New project
          </Button>
        }
      />
      <div className="mb-4 flex flex-wrap items-center gap-2">
        <div className="relative max-w-xs flex-1">
          <Search className="pointer-events-none absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-foreground-subtle" aria-hidden />
          <Input
            value={query}
            onChange={(e) => { setQuery(e.target.value); setPage(1); }}
            placeholder="Search projects…"
            className="pl-8"
          />
        </div>
        <Select value={filter} onValueChange={(v) => { setFilter(v as typeof filter); setPage(1); }}>
          <SelectTrigger placeholder="All statuses" className="w-40" />
          <SelectContent>
            <SelectItem value="all">All statuses</SelectItem>
            {STATUSES.map((s) => (
              <SelectItem key={s} value={s}>{s}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Card padding="none">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Owner</TableHead>
              <TableHead>Updated</TableHead>
              <TableHead className="w-10" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((p) => (
              <TableRow key={p.id}>
                <TableCell className="font-medium text-foreground">{p.name}</TableCell>
                <TableCell><Badge tone={STATUS_TONE[p.status]} dot>{p.status}</Badge></TableCell>
                <TableCell className="text-foreground-muted">{p.owner}</TableCell>
                <TableCell className="tabular text-foreground-subtle">{p.updated}</TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <IconButton aria-label="Actions" icon={<MoreHorizontal />} variant="ghost" size="sm" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onSelect={() => { setEditing(p); setDialogOpen(true); }}>
                        <Pencil className="size-4" /> Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem onSelect={() => remove(p)}>
                        <Trash2 className="size-4" /> Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
            {rows.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="py-10 text-center text-sm text-foreground-subtle">
                  No projects match your filters.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Card>

      {filtered.length > PAGE_SIZE && (
        <div className="mt-4">
          <Pagination page={current} pageCount={pageCount} onPageChange={setPage} totalItems={filtered.length} pageSize={PAGE_SIZE} />
        </div>
      )}

      <ProjectDialog open={dialogOpen} onOpenChange={setDialogOpen} initial={editing} onSave={save} />
    </div>
  );
}

function Archived() {
  const archived = SEED_PROJECTS.filter((p) => p.status === 'Archived');
  return (
    <div>
      <PageHeader title="Archived" subtitle="Projects you've put away." />
      <Card padding="none">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Owner</TableHead>
              <TableHead className="text-right">Updated</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {archived.map((p) => (
              <TableRow key={p.id}>
                <TableCell className="font-medium text-foreground">{p.name}</TableCell>
                <TableCell className="text-foreground-muted">{p.owner}</TableCell>
                <TableCell className="tabular text-right text-foreground-subtle">{p.updated}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Inbox                                                                     */
/* -------------------------------------------------------------------------- */

interface Message {
  id: number;
  from: string;
  initials: string;
  subject: string;
  preview: string;
  when: string;
  unread: boolean;
}
const SEED_MESSAGES: Message[] = [
  { id: 1, from: 'Anu Bold', initials: 'AB', subject: 'Re: Q2 roadmap', preview: 'Pushed the segment work to next sprint.', when: '12m', unread: true },
  { id: 2, from: 'Bat Erdene', initials: 'BE', subject: 'Login flow fix is live', preview: 'Error rate is already back down.', when: '1h', unread: true },
  { id: 3, from: 'Tuya Ganbat', initials: 'TG', subject: 'Design review notes', preview: 'A few spacing tweaks on the pricing page.', when: '3h', unread: false },
  { id: 4, from: 'Khulan O.', initials: 'KO', subject: 'Invoice #2041', preview: 'Approved and scheduled for the 1st.', when: 'Yesterday', unread: false },
  { id: 5, from: 'Sara Khan', initials: 'SK', subject: 'Welcome to the team!', preview: 'Everything to get set up.', when: '2d', unread: false },
];

function InboxPage() {
  const [items, setItems] = useState<Message[]>(SEED_MESSAGES);
  const unread = items.filter((m) => m.unread).length;
  return (
    <div>
      <PageHeader
        title="Inbox"
        subtitle={`${items.length} conversations, ${unread} unread`}
        actions={
          <Button variant="outline" size="sm" disabled={unread === 0} onClick={() => setItems((xs) => xs.map((m) => ({ ...m, unread: false })))}>
            Mark all read
          </Button>
        }
      />
      <Card padding="none">
        <ul className="divide-y divide-border">
          {items.map((m) => (
            <li
              key={m.id}
              onClick={() => setItems((xs) => xs.map((x) => (x.id === m.id ? { ...x, unread: false } : x)))}
              className={cn('flex cursor-pointer items-start gap-3 px-5 py-3.5 hover:bg-background-muted', m.unread && 'bg-accent-soft/40')}
            >
              <Avatar size="sm" fallback={m.initials} />
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="truncate text-sm font-medium text-foreground">{m.from}</span>
                  {m.unread && <span className="size-1.5 shrink-0 rounded-full bg-accent" aria-label="Unread" />}
                  <span className="ml-auto shrink-0 text-xs text-foreground-subtle">{m.when}</span>
                </div>
                <div className="truncate text-sm text-foreground">{m.subject}</div>
                <div className="truncate text-xs text-foreground-muted">{m.preview}</div>
              </div>
              <IconButton
                aria-label="Delete"
                icon={<Trash2 />}
                variant="ghost"
                size="sm"
                onClick={(e) => { e.stopPropagation(); setItems((xs) => xs.filter((x) => x.id !== m.id)); }}
              />
            </li>
          ))}
          {items.length === 0 && (
            <li className="px-5 py-12 text-center text-sm text-foreground-subtle">Inbox zero. Nice.</li>
          )}
        </ul>
      </Card>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Team — Members CRUD + Invitations                                        */
/* -------------------------------------------------------------------------- */

interface Member {
  id: number;
  name: string;
  email: string;
  initials: string;
  role: 'Owner' | 'Admin' | 'Member' | 'Billing';
  status: 'Active' | 'Invited';
}
const ROLES: Member['role'][] = ['Owner', 'Admin', 'Member', 'Billing'];
const SEED_MEMBERS: Member[] = [
  { id: 1, name: 'Anu Bold', email: 'anu@acme.co', initials: 'AB', role: 'Owner', status: 'Active' },
  { id: 2, name: 'Bat Erdene', email: 'bat@acme.co', initials: 'BE', role: 'Admin', status: 'Active' },
  { id: 3, name: 'Tuya Ganbat', email: 'tuya@acme.co', initials: 'TG', role: 'Member', status: 'Active' },
  { id: 4, name: 'Khulan O.', email: 'khulan@acme.co', initials: 'KO', role: 'Member', status: 'Invited' },
  { id: 5, name: 'Sara Khan', email: 'sara@acme.co', initials: 'SK', role: 'Billing', status: 'Active' },
];

function Members() {
  const { push } = useToast();
  const [items, setItems] = useState<Member[]>(SEED_MEMBERS);
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<Member['role']>('Member');

  const invite = () => {
    const name = email.split('@')[0].replace(/\W/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()) || 'New member';
    setItems((xs) => [
      ...xs,
      { id: Math.max(0, ...xs.map((x) => x.id)) + 1, name, email, initials: name.slice(0, 2).toUpperCase(), role, status: 'Invited' },
    ]);
    push({ variant: 'success', title: 'Invitation sent', description: email });
    setEmail('');
    setOpen(false);
  };

  return (
    <div>
      <PageHeader title="Members" subtitle="People with access to this workspace." actions={<Button onClick={() => setOpen(true)}><Plus className="mr-1 size-4" /> Invite</Button>} />
      <Card padding="none">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-10" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.map((m) => (
              <TableRow key={m.id}>
                <TableCell>
                  <div className="flex items-center gap-2.5">
                    <Avatar size="sm" fallback={m.initials} />
                    <div className="leading-tight">
                      <div className="font-medium text-foreground">{m.name}</div>
                      <div className="text-xs text-foreground-subtle">{m.email}</div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <Select value={m.role} onValueChange={(v) => setItems((xs) => xs.map((x) => (x.id === m.id ? { ...x, role: v as Member['role'] } : x)))}>
                    <SelectTrigger size="sm" className="w-32" />
                    <SelectContent>
                      {ROLES.map((r) => (<SelectItem key={r} value={r}>{r}</SelectItem>))}
                    </SelectContent>
                  </Select>
                </TableCell>
                <TableCell>
                  <Badge tone={m.status === 'Active' ? 'success' : 'warning'} variant="outline">{m.status}</Badge>
                </TableCell>
                <TableCell>
                  <IconButton aria-label="Remove" icon={<Trash2 />} variant="ghost" size="sm" disabled={m.role === 'Owner'} onClick={() => setItems((xs) => xs.filter((x) => x.id !== m.id))} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Invite a member</DialogTitle>
            <DialogDescription>They'll get an email to join the workspace.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <Input label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="name@company.com" />
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-foreground">Role</label>
              <Select value={role} onValueChange={(v) => setRole(v as Member['role'])}>
                <SelectTrigger placeholder="Role" />
                <SelectContent>{ROLES.map((r) => (<SelectItem key={r} value={r}>{r}</SelectItem>))}</SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setOpen(false)}>Cancel</Button>
            <Button disabled={!email.includes('@')} onClick={invite}>Send invite</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function Invitations() {
  const pending = [
    { email: 'jordan@acme.co', role: 'Member', sent: '2d ago' },
    { email: 'lee@acme.co', role: 'Admin', sent: '5d ago' },
  ];
  return (
    <div>
      <PageHeader title="Invitations" subtitle="Pending invites." />
      <Card padding="none">
        <ul className="divide-y divide-border">
          {pending.map((p) => (
            <li key={p.email} className="flex items-center gap-3 px-5 py-3.5">
              <span className="inline-flex size-8 items-center justify-center rounded-full bg-background-muted text-foreground-subtle"><Mail className="size-4" /></span>
              <div className="min-w-0 flex-1">
                <div className="text-sm font-medium text-foreground">{p.email}</div>
                <div className="text-xs text-foreground-subtle">{p.role} · sent {p.sent}</div>
              </div>
              <Button variant="ghost" size="sm">Resend</Button>
              <Button variant="ghost" size="sm">Revoke</Button>
            </li>
          ))}
        </ul>
      </Card>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Settings — Profile / Notifications / Billing                             */
/* -------------------------------------------------------------------------- */

function ProfileSettings() {
  const { push } = useToast();
  return (
    <div className="max-w-2xl">
      <PageHeader title="Profile" subtitle="How others see you." />
      <Card>
        <CardContent className="space-y-4 pt-6">
          <div className="flex items-center gap-4">
            <Avatar size="lg" fallback="AM" />
            <Button variant="outline" size="sm">Change photo</Button>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <Input label="First name" defaultValue="Alex" />
            <Input label="Last name" defaultValue="Morgan" />
          </div>
          <Input label="Email" type="email" defaultValue="alex@example.com" />
          <Input label="Bio" defaultValue="Product engineer. Building calm software." />
          <div className="flex justify-end">
            <Button onClick={() => push({ variant: 'success', title: 'Profile saved' })}>Save changes</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function NotificationSettings() {
  const rows = [
    ['Email notifications', 'Product updates and mentions', true],
    ['Push notifications', 'Real-time alerts on this device', true],
    ['Weekly digest', 'A summary every Monday', false],
    ['Marketing emails', 'Occasional news and offers', false],
  ] as const;
  return (
    <div className="max-w-2xl">
      <PageHeader title="Notifications" subtitle="Choose what reaches you." />
      <Card>
        <CardContent className="divide-y divide-border pt-2">
          {rows.map(([title, desc, on]) => (
            <label key={title} className="flex items-center justify-between gap-4 py-4">
              <span>
                <span className="block text-sm font-medium text-foreground">{title}</span>
                <span className="block text-xs text-foreground-muted">{desc}</span>
              </span>
              <Switch defaultChecked={on} />
            </label>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}

function BillingSettings() {
  const invoices = [
    { id: 'INV-2041', date: 'Jun 1, 2026', amount: '$240.00', status: 'Paid' },
    { id: 'INV-2032', date: 'May 1, 2026', amount: '$240.00', status: 'Paid' },
    { id: 'INV-2018', date: 'Apr 1, 2026', amount: '$240.00', status: 'Paid' },
  ];
  return (
    <div className="max-w-3xl">
      <PageHeader title="Billing" subtitle="Plan and invoices." />
      <Card>
        <CardContent className="flex flex-wrap items-center justify-between gap-4 pt-6">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-lg font-semibold text-foreground">Team plan</span>
              <Badge tone="accent">Current</Badge>
            </div>
            <p className="mt-1 text-sm text-foreground-muted">$20 / user / month · renews Jul 1, 2026</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline">Manage</Button>
            <Button>Upgrade</Button>
          </div>
        </CardContent>
      </Card>
      <Card padding="none" className="mt-4">
        <CardHeader className="px-5 pt-5"><CardTitle>Invoices</CardTitle></CardHeader>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Invoice</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead className="text-right">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {invoices.map((inv) => (
              <TableRow key={inv.id}>
                <TableCell className="font-medium text-foreground">{inv.id}</TableCell>
                <TableCell className="text-foreground-muted">{inv.date}</TableCell>
                <TableCell className="tabular text-foreground">{inv.amount}</TableCell>
                <TableCell className="text-right"><Badge tone="success" variant="outline">{inv.status}</Badge></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}

function Reports() {
  return (
    <div>
      <PageHeader title="Reports" subtitle="Saved and scheduled reports." actions={<Button size="sm"><Plus className="mr-1 size-4" /> New report</Button>} />
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card><CardHeader><CardTitle>Weekly active users</CardTitle><CardDescription>Updated daily</CardDescription></CardHeader><CardContent><LineChart data={SERIES_A} height={180} /></CardContent></Card>
        <Card><CardHeader><CardTitle>Revenue by channel</CardTitle><CardDescription>This quarter</CardDescription></CardHeader><CardContent><BarChart data={CHANNELS} height={180} /></CardContent></Card>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Page router                                                               */
/* -------------------------------------------------------------------------- */

function renderPage(page: string) {
  switch (page) {
    case 'overview': return <Overview />;
    case 'analytics': return <Analytics />;
    case 'projects': return <Projects />;
    case 'archived': return <Archived />;
    case 'inbox': return <InboxPage />;
    case 'members': return <Members />;
    case 'invites': return <Invitations />;
    case 'reports': return <Reports />;
    case 'profile': return <ProfileSettings />;
    case 'notifications': return <NotificationSettings />;
    case 'billing': return <BillingSettings />;
    default: return <Overview />;
  }
}

/* -------------------------------------------------------------------------- */
/*  Top bar menus                                                             */
/* -------------------------------------------------------------------------- */

const NOTIFICATIONS = [
  { id: 1, who: 'Anu B.', initials: 'AB', text: 'mentioned you in Q2 OKRs', when: '2m', unread: true },
  { id: 2, who: 'Bat E.', initials: 'BE', text: 'requested review on fix/login-flow', when: '18m', unread: true },
  { id: 3, who: 'Tuya G.', initials: 'TG', text: 'commented on feat/segments', when: '1h', unread: false },
];

function TopBar({ onProfile, onSettings, onSignOut }: { onProfile: () => void; onSettings: () => void; onSignOut: () => void }) {
  return (
    <header className="flex h-14 shrink-0 items-center gap-3 border-b border-border bg-background px-4">
      <div className="relative max-w-md flex-1">
        <Search className="pointer-events-none absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-foreground-subtle" aria-hidden />
        <Input placeholder="Search…" className="pl-8" />
      </div>
      <div className="ml-auto flex items-center gap-1">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button aria-label="Notifications" className="relative inline-flex size-9 items-center justify-center rounded-md text-foreground-muted hover:bg-background-muted hover:text-foreground">
              <Bell className="size-4" aria-hidden />
              <span className="absolute right-1.5 top-1.5 size-2 rounded-full bg-accent ring-2 ring-background" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80">
            <DropdownMenuLabel>Notifications</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {NOTIFICATIONS.map((n) => (
              <DropdownMenuItem key={n.id} className="flex items-start gap-2.5">
                <Avatar size="xs" fallback={n.initials} className="mt-0.5" />
                <span className="flex min-w-0 flex-col">
                  <span className="text-sm text-foreground"><span className="font-medium">{n.who}</span> {n.text}</span>
                  <span className="text-xs text-foreground-subtle">{n.when} ago</span>
                </span>
                {n.unread && <span className="ml-auto mt-1.5 size-1.5 rounded-full bg-accent" />}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button aria-label="Account" className="ml-1 inline-flex items-center gap-2 rounded-full p-0.5 hover:bg-background-muted">
              <Avatar size="sm" fallback={USER.initials} status="online" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>
              <div className="leading-tight">
                <div className="text-sm font-medium text-foreground">{USER.name}</div>
                <div className="text-xs font-normal text-foreground-subtle">{USER.email}</div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onSelect={onProfile}><User className="size-4" /> Profile</DropdownMenuItem>
            <DropdownMenuItem onSelect={onSettings}><SettingsIcon className="size-4" /> Account settings</DropdownMenuItem>
            <DropdownMenuItem onSelect={onSettings}><CreditCard className="size-4" /> Billing</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onSelect={onSignOut}><LogOut className="size-4" /> Sign out</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}

/* -------------------------------------------------------------------------- */
/*  Shell                                                                     */
/* -------------------------------------------------------------------------- */

export interface AdminDashboardProps {
  brand?: ReactNode;
  /** Called by the profile menu's "Sign out". */
  onSignOut?: () => void;
}

export function AdminDashboard({ brand, onSignOut }: AdminDashboardProps = {}) {
  const [areaKey, setAreaKey] = useState('dashboard');
  const [page, setPage] = useState('overview');
  const area = AREAS.find((a) => a.key === areaKey) ?? AREAS[0];

  const openArea = (a: NavArea) => {
    setAreaKey(a.key);
    setPage(a.children[0].key);
  };

  return (
    <div className="flex h-screen overflow-hidden bg-background-subtle text-foreground">
      {/* Icon rail */}
      <nav className="flex w-16 shrink-0 flex-col items-center gap-1 border-r border-border bg-background py-3">
        <div className="mb-2 inline-flex size-9 items-center justify-center rounded-md bg-accent text-on-accent">✦</div>
        {AREAS.map((a) => {
          const ActiveIcon = a.icon;
          const active = a.key === areaKey;
          return (
            <button
              key={a.key}
              onClick={() => openArea(a)}
              title={a.label}
              aria-label={a.label}
              aria-current={active ? 'page' : undefined}
              className={cn(
                'inline-flex size-10 items-center justify-center rounded-lg transition-colors',
                active ? 'bg-accent-soft text-on-accent-soft' : 'text-foreground-subtle hover:bg-background-muted hover:text-foreground',
              )}
            >
              <ActiveIcon className="size-5" />
            </button>
          );
        })}
      </nav>

      {/* Secondary panel — child menu of the active area */}
      <aside className="flex w-60 shrink-0 flex-col border-r border-border bg-background">
        <div className="flex h-14 items-center px-4 text-sm">{brand ?? <span className="font-semibold">{area.label}</span>}</div>
        <div className="border-t border-border px-3 pb-2 pt-3 text-xs font-semibold uppercase tracking-wide text-foreground-subtle">
          {area.label}
        </div>
        <ul className="flex flex-1 flex-col gap-px overflow-y-auto px-2">
          {area.children.map((c) => (
            <li key={c.key}>
              <button
                onClick={() => setPage(c.key)}
                aria-current={page === c.key ? 'page' : undefined}
                className={cn(
                  'flex h-8 w-full items-center rounded-md px-3 text-sm transition-colors',
                  page === c.key ? 'bg-background-muted font-medium text-foreground' : 'text-foreground-muted hover:bg-background-muted hover:text-foreground',
                )}
              >
                {c.label}
              </button>
            </li>
          ))}
        </ul>
        <div className="flex items-center gap-2.5 border-t border-border p-3">
          <Avatar size="sm" fallback={USER.initials} status="online" />
          <div className="min-w-0 leading-tight">
            <div className="truncate text-sm font-medium text-foreground">{USER.name}</div>
            <div className="truncate text-xs text-foreground-subtle">{USER.email}</div>
          </div>
        </div>
      </aside>

      {/* Main column */}
      <div className="flex min-w-0 flex-1 flex-col">
        <TopBar
          onProfile={() => { setAreaKey('settings'); setPage('profile'); }}
          onSettings={() => { setAreaKey('settings'); setPage('profile'); }}
          onSignOut={() => onSignOut?.()}
        />
        <main className="flex-1 overflow-y-auto p-6">{renderPage(page)}</main>
      </div>

      <Toaster />
    </div>
  );
}
