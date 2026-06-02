import { useState, type ReactNode } from 'react';
import { Bell, CreditCard, Lock, User, Users } from '@/icons';
import { Avatar } from '@/components/ui/Avatar';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Separator } from '@/components/ui/Separator';
import { Switch } from '@/components/ui/Switch';
import { cn } from '@/lib/utils';

/* -----------------------------------------------------------------------------
 *  Settings shell with a sticky left sub-nav. Sections are declared as data so
 *  consumers can add / remove / reorder without touching the layout.
 * --------------------------------------------------------------------------- */

export interface SettingsSection {
  id: string;
  label: string;
  icon?: ReactNode;
  render: () => ReactNode;
}

export interface SettingsPageProps {
  /** Page title — defaults to "Settings". */
  title?: ReactNode;
  /** Subtitle under the heading. */
  subtitle?: ReactNode;
  sections?: SettingsSection[];
  /** Initially active section id. Defaults to the first section. */
  defaultSection?: string;
  /** Controlled active section id. */
  activeSection?: string;
  /** Fires when the active section changes (controlled mode). */
  onActiveSectionChange?: (id: string) => void;
  className?: string;
}

/* -----------------------------------------------------------------------------
 *  Default demo sections — used when the consumer renders <SettingsPage /> with
 *  no `sections` prop, and on the showcase preview.
 * --------------------------------------------------------------------------- */

const DEMO_SECTIONS: SettingsSection[] = [
  {
    id: 'profile',
    label: 'Profile',
    icon: <User />,
    render: () => (
      <Card>
        <CardHeader>
          <CardTitle>Profile</CardTitle>
          <CardDescription>Visible to your teammates.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4">
            <Avatar size="xl" fallback="BO" />
            <div>
              <Button variant="outline" size="sm">Change photo</Button>
              <p className="mt-2 text-xs text-foreground-subtle">JPG or PNG, max 2 MB.</p>
            </div>
          </div>
          <Separator />
          <div className="grid gap-4 sm:grid-cols-2">
            <Input label="First name" defaultValue="Alex" />
            <Input label="Last name" defaultValue="Morgan" />
          </div>
          <Input label="Display email" type="email" defaultValue="alex@example.com" />
          <div className="flex justify-end">
            <Button>Save changes</Button>
          </div>
        </CardContent>
      </Card>
    ),
  },
  {
    id: 'security',
    label: 'Security',
    icon: <Lock />,
    render: () => (
      <Card>
        <CardHeader>
          <CardTitle>Security</CardTitle>
          <CardDescription>How you sign in and protect your account.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input label="Current password" type="password" />
          <Input label="New password" type="password" helperText="At least 8 characters." />
          <Separator />
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-foreground">Two-factor authentication</p>
              <p className="text-xs text-foreground-subtle">Required for admin accounts on production.</p>
            </div>
            <Switch defaultChecked />
          </div>
          <div className="flex justify-end">
            <Button>Update password</Button>
          </div>
        </CardContent>
      </Card>
    ),
  },
  {
    id: 'notifications',
    label: 'Notifications',
    icon: <Bell />,
    render: () => (
      <Card>
        <CardHeader>
          <CardTitle>Notifications</CardTitle>
          <CardDescription>Choose what we email and ping you about.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Switch label="Product updates" description="A short note when we ship something." defaultChecked />
          <Separator />
          <Switch label="Mentions" description="When a teammate @ mentions you in a comment." defaultChecked />
          <Separator />
          <Switch label="Weekly digest" description="A Monday-morning summary of last week's activity." />
        </CardContent>
      </Card>
    ),
  },
  {
    id: 'billing',
    label: 'Billing',
    icon: <CreditCard />,
    render: () => (
      <Card>
        <CardHeader>
          <CardTitle>Billing</CardTitle>
          <CardDescription>Your plan, invoices, and payment method.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="rounded-md border border-border bg-background-subtle p-4">
            <p className="text-sm font-medium text-foreground">Team — $20/user/month</p>
            <p className="mt-1 text-xs text-foreground-subtle">Renews on 1 June 2026 · 12 seats</p>
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline">Manage seats</Button>
            <Button>Upgrade plan</Button>
          </div>
        </CardContent>
      </Card>
    ),
  },
  {
    id: 'team',
    label: 'Team',
    icon: <Users />,
    render: () => (
      <Card>
        <CardHeader>
          <CardTitle>Team</CardTitle>
          <CardDescription>Invite teammates and manage roles.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input
              type="email"
              placeholder="teammate@company.com"
              hideLabel
              label="Invite email"
              className="flex-1"
            />
            <Button>Send invite</Button>
          </div>
          <p className="text-xs text-foreground-subtle">
            Invited members will receive a sign-up link by email.
          </p>
        </CardContent>
      </Card>
    ),
  },
];

/**
 * Settings page with a sticky sub-nav on the left and section cards on the right.
 *
 * @example
 *   <SettingsPage
 *     sections={[
 *       { id: 'profile', label: 'Profile', icon: <User />, render: () => <ProfileForm /> },
 *       { id: 'team', label: 'Team', icon: <Users />, render: () => <TeamForm /> },
 *     ]}
 *     defaultSection="profile"
 *   />
 */
export function SettingsPage({
  title = 'Settings',
  subtitle = 'Manage your account, preferences, and billing.',
  sections = DEMO_SECTIONS,
  defaultSection,
  activeSection,
  onActiveSectionChange,
  className,
}: SettingsPageProps = {}) {
  const isControlled = activeSection !== undefined;
  const [internal, setInternal] = useState<string>(
    defaultSection ?? sections[0]?.id ?? '',
  );
  const active = isControlled ? activeSection! : internal;
  const setActive = (id: string) => {
    if (!isControlled) setInternal(id);
    onActiveSectionChange?.(id);
  };

  return (
    <div className={cn('mx-auto max-w-5xl space-y-8', className)}>
      {(title || subtitle) && (
        <header>
          {title && (
            <h1 className="text-2xl font-semibold tracking-tight text-foreground">{title}</h1>
          )}
          {subtitle && <p className="mt-1 text-sm text-foreground-muted">{subtitle}</p>}
        </header>
      )}

      <div className="grid gap-8 md:grid-cols-[200px_1fr]">
        <nav aria-label="Settings sections" className="md:sticky md:top-20 md:self-start">
          <ul className="flex flex-col gap-px">
            {sections.map((s) => (
              <li key={s.id}>
                <button
                  type="button"
                  onClick={() => setActive(s.id)}
                  className={cn(
                    'flex h-9 w-full items-center gap-2 rounded-md px-2 text-left text-sm transition-colors duration-[var(--duration-fast)] outline-none',
                    'focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background',
                    active === s.id
                      ? 'bg-background-muted font-medium text-foreground'
                      : 'text-foreground-muted hover:bg-background-muted hover:text-foreground',
                  )}
                  aria-current={active === s.id ? 'page' : undefined}
                >
                  {s.icon && <span className="[&_svg]:size-4">{s.icon}</span>}
                  {s.label}
                </button>
              </li>
            ))}
          </ul>
        </nav>

        <div className="space-y-8">
          {sections.map((s) => (
            <section key={s.id} id={s.id} hidden={active !== s.id}>
              {s.render()}
            </section>
          ))}
        </div>
      </div>
    </div>
  );
}
