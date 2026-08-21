import { forwardRef, useImperativeHandle, useState } from 'react';
import { FileText, Lock, Mail, Plus, Receipt, Trash2, Users } from '@/icons';
import {
  Avatar,
  Badge,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  ConfirmationDialog,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  EmptyState,
  ErrorState,
  IconButton,
  Input,
  RadioGroup,
  RadioItem,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  Skeleton,
  Switch,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  cn,
  formatDate,
  formatNumber,
  useToast,
} from '@craftzbay/ui';
import {
  INVOICES,
  ROLES,
  SEED_MEMBERS,
  SEED_MESSAGES,
  STUB_PAGES,
  type Member,
  type Message,
} from './data';
import { PageHeader, StatusIcon, useDemo } from './shell';
import { useTheme, type Theme } from '../../theme/theme-context';
import { useUnsavedGuard } from './unsaved';

/* =============================================================================
 *  Admin template — Inbox, Team, Settings, Billing
 * ========================================================================== */

export function InboxPage({ onNavigate }: { onNavigate: (key: string) => void }) {
  const { push } = useToast();
  const [items, setItems] = useState<Message[]>(SEED_MESSAGES);
  const unread = items.filter((m) => m.unread).length;
  // Recoverable delete: no confirm, a 5s Undo in the toast restores the row
  // at its original position (CANON · Undo window).
  const remove = (m: Message) => {
    const snapshot = items;
    setItems((xs) => xs.filter((x) => x.id !== m.id));
    push({
      title: 'Conversation deleted',
      description: m.subject,
      duration: 5000,
      action: {
        label: 'Undo',
        altText: `Undo deleting “${m.subject}”`,
        onClick: () => setItems(snapshot),
      },
    });
  };
  return (
    <div>
      <PageHeader
        page="inbox"
        title="Inbox"
        subtitle={`${items.length} conversations, ${unread} unread`}
        actions={
          <Button
            variant="outline"
            size="sm"
            disabled={unread === 0}
            onClick={() => setItems((xs) => xs.map((m) => ({ ...m, unread: false })))}
          >
            Mark all read
          </Button>
        }
        onNavigate={onNavigate}
      />
      {items.length === 0 ? (
        <EmptyState
          icon={<Mail />}
          title="Inbox zero"
          description="New conversations will show up here."
        />
      ) : (
        <Card padding="none">
          <ul className="divide-border divide-y">
            {items.map((m) => (
              <li
                key={m.id}
                className={cn(
                  'hover:bg-background-muted flex items-start gap-3 px-4 py-3 md:px-6',
                  m.unread && 'bg-accent-soft/40',
                )}
              >
                <button
                  type="button"
                  onClick={() =>
                    setItems((xs) => xs.map((x) => (x.id === m.id ? { ...x, unread: false } : x)))
                  }
                  className="focus-visible:ring-ring flex min-w-0 flex-1 items-start gap-3 rounded-sm text-left outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
                >
                  <Avatar size="sm" fallback={m.initials} alt="" />
                  <span className="min-w-0 flex-1">
                    <span className="flex items-center gap-2">
                      <span className="text-foreground truncate text-sm font-medium">{m.from}</span>
                      {m.unread && (
                        <span
                          className="bg-accent size-1.5 shrink-0 rounded-full"
                          aria-label="Unread"
                        />
                      )}
                      <span className="text-foreground-subtle ml-auto shrink-0 text-xs">
                        {m.when}
                      </span>
                    </span>
                    <span className="text-foreground block truncate text-sm">{m.subject}</span>
                    <span className="text-foreground-muted block truncate text-xs">
                      {m.preview}
                    </span>
                  </span>
                </button>
                <IconButton
                  aria-label={`Delete conversation from ${m.from}`}
                  icon={<Trash2 />}
                  variant="ghost"
                  size="sm"
                  onClick={() => remove(m)}
                />
              </li>
            ))}
          </ul>
        </Card>
      )}
    </div>
  );
}

function StatusBadge({ status }: { status: Member['status'] }) {
  const tone = status === 'Active' ? 'success' : 'warning';
  return (
    <Badge tone={tone} variant="outline">
      <StatusIcon tone={tone} />
      {status}
    </Badge>
  );
}

function RoleSelect({
  member: m,
  onChange,
  className,
}: {
  member: Member;
  onChange: (id: number, role: Member['role']) => void;
  className?: string;
}) {
  return (
    <Select value={m.role} onValueChange={(v) => onChange(m.id, v as Member['role'])}>
      <SelectTrigger
        size="sm"
        aria-label={`Role for ${m.name}`}
        className={className}
        disabled={m.role === 'Owner'}
      />
      <SelectContent>
        {ROLES.map((r) => (
          <SelectItem key={r} value={r}>
            {r}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

function RemoveButton({ member: m, onRemove }: { member: Member; onRemove: (m: Member) => void }) {
  return (
    <IconButton
      aria-label={`Remove ${m.name}`}
      icon={<Trash2 />}
      variant="ghost"
      size="sm"
      disabled={m.role === 'Owner'}
      title={m.role === 'Owner' ? 'The owner cannot be removed' : undefined}
      onClick={() => onRemove(m)}
    />
  );
}

export interface MembersHandle {
  invite: () => void;
}

export const Members = forwardRef<MembersHandle, { onNavigate: (key: string) => void }>(
  function Members({ onNavigate }, ref) {
    const { push } = useToast();
    const demo = useDemo();
    const [items, setItems] = useState<Member[]>(SEED_MEMBERS);
    const [open, setOpen] = useState(false);
    const [email, setEmail] = useState('');
    const [role, setRole] = useState<Member['role']>('Member');
    const [pendingRemove, setPendingRemove] = useState<Member | null>(null);

    useImperativeHandle(ref, () => ({ invite: () => setOpen(true) }));

    const invite = () => {
      const name =
        email
          .split('@')[0]
          .replace(/\W/g, ' ')
          .replace(/\b\w/g, (c) => c.toUpperCase()) || 'New member';
      setItems((xs) => [
        ...xs,
        {
          id: Math.max(0, ...xs.map((x) => x.id)) + 1,
          name,
          email,
          initials: name.slice(0, 2).toUpperCase(),
          role,
          status: 'Invited',
        },
      ]);
      push({ variant: 'success', title: 'Invitation sent', description: email });
      setEmail('');
      setOpen(false);
    };

    // Removal is confirmed (access is revoked immediately) and still
    // reversible for 5s — the toast's Undo restores the row.
    const remove = (m: Member) => {
      const snapshot = items;
      setItems((xs) => xs.filter((x) => x.id !== m.id));
      push({
        title: 'Member removed',
        description: m.name,
        duration: 5000,
        action: {
          label: 'Undo',
          altText: `Undo removing ${m.name}`,
          onClick: () => setItems(snapshot),
        },
      });
    };

    const setMemberRole = (id: number, next: Member['role']) =>
      setItems((xs) => xs.map((x) => (x.id === id ? { ...x, role: next } : x)));

    const visible = demo.state === 'empty' ? [] : items;
    const inviteButton = (
      <Button size="sm" leadingIcon={<Plus />} onClick={() => setOpen(true)}>
        Invite
      </Button>
    );

    return (
      <div>
        <PageHeader
          page="members"
          title="Team"
          subtitle="People with access to this workspace."
          actions={inviteButton}
          onNavigate={onNavigate}
        />
        {demo.state === 'error' ? (
          <ErrorState
            variant="500"
            title="Couldn't load the team"
            description="The members list didn't come back from the server. Your changes are safe."
            onRetry={() => demo.setState('normal')}
            live
          />
        ) : visible.length === 0 && demo.state !== 'loading' ? (
          <EmptyState
            icon={<Users />}
            title="No one else is here yet"
            description="Invite teammates to collaborate on projects. They'll get an email with a link to join."
            action={
              <Button leadingIcon={<Plus />} onClick={() => setOpen(true)}>
                Invite a teammate
              </Button>
            }
            className="min-h-[320px]"
          />
        ) : (
          <Card padding="none">
            {/* <sm: a stacked list — the 4-column table would put the Role
                select past the 320px edge inside a horizontal scroller. */}
            <ul className="divide-border divide-y sm:hidden">
              {demo.state === 'loading'
                ? Array.from({ length: 4 }, (_, i) => (
                    <li key={`sk-${i}`} aria-hidden className="space-y-3 p-4">
                      <div className="flex items-center gap-2">
                        <Skeleton variant="avatar" className="size-8" />
                        <Skeleton variant="text" className="w-32" />
                      </div>
                      <Skeleton className="h-8 w-full" />
                    </li>
                  ))
                : visible.map((m) => (
                    <li key={m.id} className="space-y-3 p-4">
                      <div className="flex items-center gap-2">
                        <Avatar size="sm" fallback={m.initials} alt="" />
                        <div className="min-w-0 flex-1 leading-tight">
                          <div className="text-foreground truncate font-medium">{m.name}</div>
                          <div className="text-foreground-subtle truncate text-xs">{m.email}</div>
                        </div>
                        <StatusBadge status={m.status} />
                      </div>
                      <div className="flex items-center gap-2">
                        <RoleSelect member={m} onChange={setMemberRole} className="w-full" />
                        <RemoveButton member={m} onRemove={setPendingRemove} />
                      </div>
                    </li>
                  ))}
            </ul>
            <div className="hidden sm:block">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="w-12 text-right">
                      <span className="sr-only">Actions</span>
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {demo.state === 'loading'
                    ? Array.from({ length: 4 }, (_, i) => (
                        <TableRow key={`sk-${i}`} aria-hidden>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Skeleton variant="avatar" className="size-8" />
                              <Skeleton variant="text" className="w-32" />
                            </div>
                          </TableCell>
                          <TableCell>
                            <Skeleton className="h-8 w-32" />
                          </TableCell>
                          <TableCell>
                            <Skeleton className="h-5 w-16 rounded-full" />
                          </TableCell>
                          <TableCell>
                            <Skeleton className="ml-auto size-8" />
                          </TableCell>
                        </TableRow>
                      ))
                    : visible.map((m) => (
                        <TableRow key={m.id}>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Avatar size="sm" fallback={m.initials} alt="" />
                              <div className="leading-tight">
                                <div className="text-foreground font-medium">{m.name}</div>
                                <div className="text-foreground-subtle text-xs">{m.email}</div>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <RoleSelect member={m} onChange={setMemberRole} className="w-32" />
                          </TableCell>
                          <TableCell>
                            <StatusBadge status={m.status} />
                          </TableCell>
                          <TableCell className="text-right">
                            <RemoveButton member={m} onRemove={setPendingRemove} />
                          </TableCell>
                        </TableRow>
                      ))}
                </TableBody>
              </Table>
            </div>
          </Card>
        )}

        <Dialog open={open} onOpenChange={setOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Invite a member</DialogTitle>
              <DialogDescription>They'll get an email to join the workspace.</DialogDescription>
            </DialogHeader>
            <form
              id="invite-form"
              className="space-y-4"
              onSubmit={(e) => {
                e.preventDefault();
                if (email.includes('@')) invite();
              }}
            >
              <Input
                label="Email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@company.com"
                autoComplete="off"
                required
              />
              <div className="flex flex-col gap-1.5">
                <label htmlFor="invite-role" className="text-foreground text-sm font-medium">
                  Role
                </label>
                <Select value={role} onValueChange={(v) => setRole(v as Member['role'])}>
                  <SelectTrigger id="invite-role" placeholder="Role" />
                  <SelectContent>
                    {ROLES.map((r) => (
                      <SelectItem key={r} value={r}>
                        {r}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </form>
            <DialogFooter>
              <Button variant="ghost" type="button" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" form="invite-form" disabled={!email.includes('@')}>
                Send invite
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <ConfirmationDialog
          open={pendingRemove !== null}
          onOpenChange={(o) => !o && setPendingRemove(null)}
          title={pendingRemove ? `Remove ${pendingRemove.name}?` : 'Remove member?'}
          description="They lose access to every project in this workspace immediately."
          confirmLabel="Remove member"
          confirmVariant="destructive"
          onConfirm={() => {
            if (pendingRemove) remove(pendingRemove);
            setPendingRemove(null);
          }}
        />
      </div>
    );
  },
);

const NOTIFICATION_ROWS = [
  ['Email notifications', 'Product updates and mentions', true],
  ['Push notifications', 'Real-time alerts on this device', true],
  ['Weekly digest', 'A summary every Monday', false],
  ['Marketing emails', 'Occasional news and offers', false],
] as const;

/** Settings: sections ≤ 720px wide; explicit Save for the multi-field form,
 *  autosave (inline "Saved") for the toggles. */
export function SettingsPage({ onNavigate }: { onNavigate: (key: string) => void }) {
  const { push } = useToast();
  const { theme, setTheme } = useTheme();
  const [dirty, setDirty] = useState(false);
  const [savedAt, setSavedAt] = useState<string | null>(null);
  // Warn before the tab closes and before in-app navigation while unsaved.
  useUnsavedGuard(dirty);
  return (
    <div className="max-w-2xl">
      <PageHeader
        page="settings"
        title="Settings"
        subtitle="Profile and notification preferences."
        onNavigate={onNavigate}
      />
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <h2 className="text-foreground text-base leading-none font-semibold">Profile</h2>
            <CardDescription>How others see you.</CardDescription>
          </CardHeader>
          <CardContent>
            <form
              className="space-y-4"
              onChange={() => setDirty(true)}
              onSubmit={(e) => {
                e.preventDefault();
                setDirty(false);
                push({ variant: 'success', title: 'Profile saved' });
              }}
            >
              <div className="flex items-center gap-4">
                <Avatar size="lg" fallback="AM" alt="Alex Morgan" />
                <Button type="button" variant="outline" size="sm">
                  Change photo
                </Button>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <Input label="First name" defaultValue="Alex" autoComplete="given-name" />
                <Input label="Last name" defaultValue="Morgan" autoComplete="family-name" />
              </div>
              <Input
                label="Email"
                type="email"
                defaultValue="alex@example.com"
                autoComplete="email"
              />
              <Input label="Bio" defaultValue="Product engineer. Building calm software." />
              <div className="border-border flex justify-end gap-2 border-t pt-4">
                <Button
                  type="reset"
                  variant="ghost"
                  disabled={!dirty}
                  onClick={() => setDirty(false)}
                >
                  Discard
                </Button>
                <Button type="submit" disabled={!dirty}>
                  Save changes
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <h2 className="text-foreground text-base leading-none font-semibold">Appearance</h2>
            <CardDescription>Applies immediately and follows you across tabs.</CardDescription>
          </CardHeader>
          <CardContent>
            <RadioGroup
              aria-label="Theme"
              orientation="horizontal"
              value={theme}
              onValueChange={(v) => setTheme(v as Theme)}
              className="gap-6"
            >
              <RadioItem value="light" label="Light" />
              <RadioItem value="dark" label="Dark" />
              <RadioItem value="system" label="System" />
            </RadioGroup>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex-row items-start justify-between">
            <div>
              <h2 className="text-foreground text-base leading-none font-semibold">
                Notifications
              </h2>
              <CardDescription>
                Choose what reaches you. Changes save automatically.
              </CardDescription>
            </div>
            <span className="text-foreground-subtle text-xs" aria-live="polite">
              {savedAt ? `Saved ${savedAt}` : ''}
            </span>
          </CardHeader>
          <CardContent className="divide-border divide-y">
            {NOTIFICATION_ROWS.map(([title, desc, on]) => (
              <div key={title} className="py-3 first:pt-0 last:pb-0">
                <Switch
                  label={title}
                  description={desc}
                  labelPosition="before"
                  defaultChecked={on}
                  onCheckedChange={() => setSavedAt(formatDate(new Date(), { pattern: 'HH:mm' }))}
                  className="w-full justify-between"
                />
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

const usd = (n: number) =>
  `$${formatNumber(n, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

export function BillingPage({ onNavigate }: { onNavigate: (key: string) => void }) {
  const demo = useDemo();
  const invoices = demo.state === 'empty' ? [] : INVOICES;
  if (demo.state === 'error')
    return (
      <div className="max-w-2xl">
        <PageHeader
          page="billing"
          title="Billing"
          subtitle="Plan and invoices."
          onNavigate={onNavigate}
        />
        <ErrorState
          variant="500"
          title="Billing is unavailable"
          description="We couldn't reach the billing provider. Your subscription is unaffected — try again in a moment."
          onRetry={() => demo.setState('normal')}
          live
        />
      </div>
    );
  return (
    <div className="max-w-2xl">
      <PageHeader
        page="billing"
        title="Billing"
        subtitle="Plan and invoices."
        onNavigate={onNavigate}
      />
      {demo.state === 'loading' ? (
        <Card>
          <CardContent className="space-y-3">
            <Skeleton variant="text" className="w-40" />
            <Skeleton variant="text" className="w-64" />
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="flex flex-wrap items-center justify-between gap-4 pt-6">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-foreground text-lg font-semibold">Team plan</span>
                <Badge tone="accent">Current</Badge>
              </div>
              <p className="text-foreground-muted mt-1 text-sm">
                {usd(20)} / user / month · renews 2026-07-01
              </p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline">Manage</Button>
              <Button>Upgrade</Button>
            </div>
          </CardContent>
        </Card>
      )}
      <Card padding="none" className="mt-4">
        <CardHeader className="px-4 pt-4 md:px-6 md:pt-6">
          <h2 className="text-foreground text-base leading-none font-semibold">Invoices</h2>
        </CardHeader>
        {demo.state === 'loading' ? (
          <div className="space-y-3 px-4 pb-4 md:px-6 md:pb-6" aria-hidden>
            <Skeleton variant="text" className="w-full" />
            <Skeleton variant="text" className="w-full" />
            <Skeleton variant="text" className="w-2/3" />
          </div>
        ) : invoices.length === 0 ? (
          <EmptyState
            icon={<Receipt />}
            title="No invoices yet"
            description="Your first invoice is issued at the start of the next billing cycle."
            className="rounded-t-none border-0"
          />
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Invoice</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="text-right">Amount</TableHead>
                <TableHead className="text-right">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {INVOICES.map((inv) => (
                <TableRow key={inv.id}>
                  <TableCell className="text-foreground font-medium">{inv.id}</TableCell>
                  <TableCell className="tabular text-foreground-muted">{inv.date}</TableCell>
                  <TableCell className="tabular text-foreground text-right">
                    {usd(inv.amount)}
                  </TableCell>
                  <TableCell className="text-right">
                    <Badge tone="success" variant="outline">
                      <StatusIcon tone="success" />
                      {inv.status}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </Card>
    </div>
  );
}

/**
 * In-shell 404 — an unknown page key (stale bookmark, typo in the deep link)
 * keeps the chrome so the user can simply pick another destination.
 */
export function NotFoundPage({
  page,
  onNavigate,
}: {
  page: string;
  onNavigate: (key: string) => void;
}) {
  return (
    <div className="max-w-2xl">
      <EmptyState
        icon={<FileText />}
        title="Page not found"
        description={`There's no page called “${page}” in this workspace. It may have moved or the link is out of date.`}
        action={<Button onClick={() => onNavigate('overview')}>Back to overview</Button>}
        className="min-h-[320px]"
      />
    </div>
  );
}

/* ---------------------------------------------------------------------------
 *  Placeholder pages for the `dual` shell's extra modules (CRM, Finance,
 *  Content, Security) — real destinations with a breadcrumb and an empty
 *  state, driven by `STUB_PAGES`.
 * ------------------------------------------------------------------------ */

export function StubPage({
  page,
  onNavigate,
}: {
  page: string;
  onNavigate: (key: string) => void;
}) {
  const spec = STUB_PAGES[page];
  if (!spec) return null;
  const Icon = spec.icon;
  return (
    <div className="max-w-2xl">
      <PageHeader page={page} title={spec.title} subtitle={spec.subtitle} onNavigate={onNavigate} />
      <EmptyState
        icon={<Icon />}
        title={spec.emptyTitle}
        description={spec.emptyDescription}
        action={
          <Button variant="secondary" onClick={() => onNavigate('settings')}>
            Open settings
          </Button>
        }
      />
    </div>
  );
}

/**
 * Permission denied (403). Not an error page — the route exists, this account
 * just can't see it. Say what is restricted, who can grant it, and offer the
 * request as the primary action so the user isn't left at a dead end.
 */
export function PermissionDeniedPage({ onNavigate }: { onNavigate: (key: string) => void }) {
  const { push } = useToast();
  const [requested, setRequested] = useState(false);
  return (
    <div className="max-w-2xl">
      <PageHeader
        page="apikeys"
        title="API keys"
        subtitle="Tokens that let other systems call your workspace."
        onNavigate={onNavigate}
      />
      <EmptyState
        role="status"
        icon={<Lock />}
        title="You don't have access"
        description="API keys are limited to the Owner and Admin roles. A workspace Owner can grant you the Admin role from Team."
        action={
          <Button
            disabled={requested}
            onClick={() => {
              setRequested(true);
              push({
                variant: 'success',
                title: 'Access requested',
                description: 'The workspace Owner has been notified.',
              });
            }}
          >
            {requested ? 'Request sent' : 'Request access'}
          </Button>
        }
        secondaryAction={
          <Button variant="ghost" onClick={() => onNavigate('members')}>
            View team
          </Button>
        }
      />
    </div>
  );
}
