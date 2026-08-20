import { forwardRef, useImperativeHandle, useState } from 'react';
import { Mail, Plus, Trash2 } from '@/icons';
import {
  Avatar,
  Badge,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  ConfirmationDialog,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  EmptyState,
  IconButton,
  Input,
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
  cn,
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
import { PageHeader } from './shell';

/* =============================================================================
 *  Admin template — Inbox, Team, Settings, Billing
 * ========================================================================== */

export function InboxPage({ onNavigate }: { onNavigate: (key: string) => void }) {
  const [items, setItems] = useState<Message[]>(SEED_MESSAGES);
  const [pendingDelete, setPendingDelete] = useState<Message | null>(null);
  const unread = items.filter((m) => m.unread).length;
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
                  'hover:bg-background-muted flex items-start gap-3 px-5 py-3.5',
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
                  onClick={() => setPendingDelete(m)}
                />
              </li>
            ))}
          </ul>
        </Card>
      )}
      <ConfirmationDialog
        open={pendingDelete !== null}
        onOpenChange={(o) => !o && setPendingDelete(null)}
        title="Delete conversation?"
        description={
          pendingDelete
            ? `“${pendingDelete.subject}” from ${pendingDelete.from} will be removed for everyone.`
            : undefined
        }
        confirmLabel="Delete"
        confirmVariant="destructive"
        onConfirm={() => {
          setItems((xs) => xs.filter((x) => x.id !== pendingDelete?.id));
          setPendingDelete(null);
        }}
      />
    </div>
  );
}

export interface MembersHandle {
  invite: () => void;
}

export const Members = forwardRef<MembersHandle, { onNavigate: (key: string) => void }>(
  function Members({ onNavigate }, ref) {
    const { push } = useToast();
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

    return (
      <div>
        <PageHeader
          page="members"
          title="Team"
          subtitle="People with access to this workspace."
          actions={
            <Button size="sm" leadingIcon={<Plus />} onClick={() => setOpen(true)}>
              Invite
            </Button>
          }
          onNavigate={onNavigate}
        />
        <Card padding="none">
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
              {items.map((m) => (
                <TableRow key={m.id}>
                  <TableCell>
                    <div className="flex items-center gap-2.5">
                      <Avatar size="sm" fallback={m.initials} alt="" />
                      <div className="leading-tight">
                        <div className="text-foreground font-medium">{m.name}</div>
                        <div className="text-foreground-subtle text-xs">{m.email}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Select
                      value={m.role}
                      onValueChange={(v) =>
                        setItems((xs) =>
                          xs.map((x) => (x.id === m.id ? { ...x, role: v as Member['role'] } : x)),
                        )
                      }
                    >
                      <SelectTrigger
                        size="sm"
                        aria-label={`Role for ${m.name}`}
                        className="w-32"
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
                  </TableCell>
                  <TableCell>
                    <Badge
                      tone={m.status === 'Active' ? 'success' : 'warning'}
                      variant="outline"
                      dot
                    >
                      {m.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <IconButton
                      aria-label={`Remove ${m.name}`}
                      icon={<Trash2 />}
                      variant="ghost"
                      size="sm"
                      disabled={m.role === 'Owner'}
                      title={m.role === 'Owner' ? 'The owner cannot be removed' : undefined}
                      onClick={() => setPendingRemove(m)}
                    />
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
            setItems((xs) => xs.filter((x) => x.id !== pendingRemove?.id));
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
  const [dirty, setDirty] = useState(false);
  const [savedAt, setSavedAt] = useState<string | null>(null);
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
            <CardTitle>Profile</CardTitle>
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
          <CardHeader className="flex-row items-start justify-between">
            <div>
              <CardTitle>Notifications</CardTitle>
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
                  onCheckedChange={() =>
                    setSavedAt(
                      new Date().toLocaleTimeString('en-GB', {
                        hour: '2-digit',
                        minute: '2-digit',
                      }),
                    )
                  }
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

export function BillingPage({ onNavigate }: { onNavigate: (key: string) => void }) {
  return (
    <div className="max-w-3xl">
      <PageHeader
        page="billing"
        title="Billing"
        subtitle="Plan and invoices."
        onNavigate={onNavigate}
      />
      <Card>
        <CardContent className="flex flex-wrap items-center justify-between gap-4 pt-6">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-foreground text-lg font-semibold">Team plan</span>
              <Badge tone="accent">Current</Badge>
            </div>
            <p className="text-foreground-muted mt-1 text-sm">
              $20 / user / month · renews 2026-07-01
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline">Manage</Button>
            <Button>Upgrade</Button>
          </div>
        </CardContent>
      </Card>
      <Card padding="none" className="mt-4">
        <CardHeader className="px-5 pt-5">
          <CardTitle>Invoices</CardTitle>
        </CardHeader>
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
                <TableCell className="tabular text-foreground text-right">{inv.amount}</TableCell>
                <TableCell className="text-right">
                  <Badge tone="success" variant="outline" dot>
                    {inv.status}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
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
