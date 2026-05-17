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
 *  Settings shell with a sticky left sub-nav. Sections are anchor-linked so
 *  deep links land on the right card. Keep section copy short — the goal of
 *  Settings is recall, not reading.
 * --------------------------------------------------------------------------- */

interface NavSection {
  id: string;
  label: string;
  icon: ReactNode;
}

const sections: NavSection[] = [
  { id: 'profile', label: 'Profile', icon: <User /> },
  { id: 'security', label: 'Security', icon: <Lock /> },
  { id: 'notifications', label: 'Notifications', icon: <Bell /> },
  { id: 'billing', label: 'Billing', icon: <CreditCard /> },
  { id: 'team', label: 'Team', icon: <Users /> },
];

export function SettingsPage() {
  const [active, setActive] = useState('profile');

  return (
    <div className="mx-auto max-w-5xl space-y-8">
      <header>
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">Settings</h1>
        <p className="text-sm text-foreground-muted mt-1">
          Manage your account, preferences, and billing.
        </p>
      </header>

      <div className="grid gap-8 md:grid-cols-[200px_1fr]">
        <nav aria-label="Settings sections" className="md:sticky md:top-20 md:self-start">
          <ul className="flex flex-col gap-px">
            {sections.map((s) => (
              <li key={s.id}>
                <button
                  type="button"
                  onClick={() => setActive(s.id)}
                  className={cn(
                    'w-full text-left',
                    'flex h-9 items-center gap-2 rounded-md px-2 text-sm transition-colors duration-[var(--duration-fast)] outline-none',
                    'focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background',
                    active === s.id
                      ? 'bg-background-muted text-foreground font-medium'
                      : 'text-foreground-muted hover:bg-background-muted hover:text-foreground',
                  )}
                  aria-current={active === s.id ? 'page' : undefined}
                >
                  <span className="[&_svg]:size-4">{s.icon}</span>
                  {s.label}
                </button>
              </li>
            ))}
          </ul>
        </nav>

        <div className="space-y-8">
          <section id="profile" hidden={active !== 'profile'}>
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
                    <p className="text-xs text-foreground-subtle mt-2">JPG or PNG, max 2 MB.</p>
                  </div>
                </div>
                <Separator />
                <div className="grid gap-4 sm:grid-cols-2">
                  <Input label="First name" defaultValue="Bay" />
                  <Input label="Last name" defaultValue="Otgonbayar" />
                </div>
                <Input label="Display email" type="email" defaultValue="bay@company.com" />
                <div className="flex justify-end">
                  <Button>Save changes</Button>
                </div>
              </CardContent>
            </Card>
          </section>

          <section id="security" hidden={active !== 'security'}>
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
                    <p className="text-xs text-foreground-subtle">
                      Required for admin accounts on production.
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex justify-end">
                  <Button>Update password</Button>
                </div>
              </CardContent>
            </Card>
          </section>

          <section id="notifications" hidden={active !== 'notifications'}>
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
          </section>

          <section id="billing" hidden={active !== 'billing'}>
            <Card>
              <CardHeader>
                <CardTitle>Billing</CardTitle>
                <CardDescription>Your plan, invoices, and payment method.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="rounded-md border border-border bg-background-subtle p-4">
                  <p className="text-sm font-medium text-foreground">Team — $20/user/month</p>
                  <p className="text-xs text-foreground-subtle mt-1">
                    Renews on 1 June 2026 · 12 seats
                  </p>
                </div>
                <div className="flex justify-end gap-2">
                  <Button variant="outline">Manage seats</Button>
                  <Button>Upgrade plan</Button>
                </div>
              </CardContent>
            </Card>
          </section>

          <section id="team" hidden={active !== 'team'}>
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
          </section>
        </div>
      </div>
    </div>
  );
}
