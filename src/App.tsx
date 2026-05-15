import { useEffect, useState, type ReactNode } from 'react';
import { ExternalLink, Moon, Sun } from '@/icons';
import { Badge } from '@/components/ui/Badge';
import { IconButton } from '@/components/ui/IconButton';
import { ToastProvider, ToastViewport } from '@/components/ui/Toast';
import { TooltipProvider } from '@/components/ui/Tooltip';
import {
  AuthLayout,
  ForgotPasswordForm,
  MagicLinkSent,
  SignInForm,
  SignUpForm,
} from '@/components/patterns/Authentication';
import { AppShell, Dashboard } from '@/components/patterns/AppShell';
import { SettingsPage } from '@/components/patterns/Settings';
import { DataTablePage } from '@/components/patterns/DataTablePage';
import { RecordDetail } from '@/components/patterns/RecordDetail';
import { Onboarding } from '@/components/patterns/Onboarding';
import { Pricing } from '@/components/patterns/Pricing';
import { FirstRunEmpty } from '@/components/patterns/FirstRunEmpty';
import { cn } from '@/lib/utils';

/* -----------------------------------------------------------------------------
 *  Showcase shell — a thin floating pill in the bottom-right lets the viewer
 *  swap between patterns. Each pattern renders full-screen so the layout
 *  reads at its intended scale.
 * --------------------------------------------------------------------------- */

type PatternKey =
  | 'home'
  | 'auth-signin'
  | 'auth-signup'
  | 'auth-forgot'
  | 'auth-magic'
  | 'dashboard'
  | 'settings'
  | 'data-table'
  | 'record'
  | 'onboarding'
  | 'pricing'
  | 'first-run';

interface PatternEntry {
  key: PatternKey;
  label: string;
  group: 'Overview' | 'Authentication' | 'App' | 'Marketing';
  badge?: 'new' | 'wip';
}

const patterns: PatternEntry[] = [
  { key: 'home', label: 'Overview', group: 'Overview' },
  { key: 'auth-signin', label: 'Sign in', group: 'Authentication' },
  { key: 'auth-signup', label: 'Sign up', group: 'Authentication' },
  { key: 'auth-forgot', label: 'Forgot password', group: 'Authentication' },
  { key: 'auth-magic', label: 'Magic link sent', group: 'Authentication' },
  { key: 'dashboard', label: 'Dashboard', group: 'App' },
  { key: 'settings', label: 'Settings', group: 'App' },
  { key: 'data-table', label: 'Data table page', group: 'App' },
  { key: 'record', label: 'Record detail', group: 'App' },
  { key: 'first-run', label: 'First-run empty', group: 'App' },
  { key: 'onboarding', label: 'Onboarding', group: 'Marketing' },
  { key: 'pricing', label: 'Pricing', group: 'Marketing' },
];

export function App() {
  const initial = (typeof window !== 'undefined'
    ? (window.location.hash.replace('#', '') as PatternKey)
    : 'home') || 'home';
  const [active, setActive] = useState<PatternKey>(
    patterns.find((p) => p.key === initial)?.key ?? 'home',
  );
  const [pickerOpen, setPickerOpen] = useState(false);
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    if (typeof document === 'undefined') return 'light';
    return document.documentElement.classList.contains('dark') ? 'dark' : 'light';
  });

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') root.classList.add('dark');
    else root.classList.remove('dark');
    try {
      localStorage.setItem('theme', theme);
    } catch {}
  }, [theme]);

  useEffect(() => {
    window.location.hash = active === 'home' ? '' : active;
  }, [active]);

  const toggleTheme = () => setTheme((t) => (t === 'light' ? 'dark' : 'light'));

  return (
    <TooltipProvider>
      <ToastProvider>
        <div className="min-h-screen bg-background text-foreground">
          {renderPattern(active)}

          {/* Floating pattern picker */}
          <div className="fixed bottom-4 right-4 z-[var(--z-sticky)]">
            {pickerOpen && (
              <div
                role="dialog"
                aria-label="Pattern picker"
                className="mb-2 w-72 rounded-lg border border-border bg-popover text-popover-foreground shadow-md overflow-hidden"
              >
                <div className="border-b border-border px-3 py-2 flex items-center justify-between">
                  <span className="text-xs font-medium text-foreground-subtle uppercase tracking-wide">
                    Patterns
                  </span>
                  <a
                    href="https://github.com/craftzbay/design-system"
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 text-xs text-foreground-muted hover:text-foreground"
                  >
                    GitHub <ExternalLink className="size-3" aria-hidden />
                  </a>
                </div>
                <div className="max-h-[60vh] overflow-y-auto p-1">
                  {(['Overview', 'Authentication', 'App', 'Marketing'] as const).map((group) => (
                    <div key={group} className="mb-1">
                      <div className="px-2 py-1.5 text-[10px] font-medium uppercase tracking-wider text-foreground-subtle">
                        {group}
                      </div>
                      {patterns
                        .filter((p) => p.group === group)
                        .map((p) => (
                          <button
                            key={p.key}
                            type="button"
                            onClick={() => {
                              setActive(p.key);
                              setPickerOpen(false);
                            }}
                            aria-current={p.key === active ? 'page' : undefined}
                            className={cn(
                              'flex w-full items-center justify-between gap-2 rounded-sm px-2 py-1.5 text-sm text-left outline-none transition-colors',
                              p.key === active
                                ? 'bg-accent-soft text-on-accent-soft font-medium'
                                : 'text-foreground hover:bg-background-muted',
                              'focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-popover',
                            )}
                          >
                            <span>{p.label}</span>
                          </button>
                        ))}
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="flex items-center gap-1 rounded-full border border-border bg-card pl-3 pr-1 py-1 shadow-md">
              <button
                type="button"
                onClick={() => setPickerOpen((o) => !o)}
                aria-expanded={pickerOpen}
                className="flex items-center gap-2 text-sm font-medium text-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-sm"
              >
                <span className="size-2 rounded-full bg-accent" aria-hidden />
                {patterns.find((p) => p.key === active)?.label}
              </button>
              <IconButton
                aria-label="Toggle theme"
                icon={theme === 'light' ? <Moon /> : <Sun />}
                size="sm"
                variant="ghost"
                onClick={toggleTheme}
              />
            </div>
          </div>

          <ToastViewport />
        </div>
      </ToastProvider>
    </TooltipProvider>
  );
}

function renderPattern(key: PatternKey): ReactNode {
  switch (key) {
    case 'home':
      return <OverviewPage />;
    case 'auth-signin':
      return (
        <AuthLayout
          brand={<Brand />}
          title="Sign in"
          subtitle="Welcome back. Sign in to continue."
          footer={
            <>
              New here?{' '}
              <a href="#auth-signup" className="font-medium text-accent hover:underline">
                Create an account
              </a>
            </>
          }
        >
          <SignInForm onSubmit={() => undefined} />
        </AuthLayout>
      );
    case 'auth-signup':
      return (
        <AuthLayout
          brand={<Brand />}
          title="Create your account"
          subtitle="Free for the first 14 days. No credit card required."
        >
          <SignUpForm onSubmit={() => undefined} />
        </AuthLayout>
      );
    case 'auth-forgot':
      return (
        <AuthLayout
          brand={<Brand />}
          title="Reset password"
          subtitle="Enter the email tied to your account."
        >
          <ForgotPasswordForm onSubmit={() => undefined} />
        </AuthLayout>
      );
    case 'auth-magic':
      return (
        <AuthLayout brand={<Brand />} title="Check your inbox">
          <MagicLinkSent email="you@company.com" />
        </AuthLayout>
      );
    case 'dashboard':
      return (
        <AppShell brand={<Brand />}>
          <Dashboard />
        </AppShell>
      );
    case 'settings':
      return (
        <AppShell brand={<Brand />}>
          <SettingsPage />
        </AppShell>
      );
    case 'data-table':
      return (
        <AppShell brand={<Brand />}>
          <DataTablePage />
        </AppShell>
      );
    case 'record':
      return (
        <AppShell brand={<Brand />}>
          <RecordDetail />
        </AppShell>
      );
    case 'first-run':
      return (
        <AppShell brand={<Brand />}>
          <FirstRunEmpty />
        </AppShell>
      );
    case 'onboarding':
      return <Onboarding />;
    case 'pricing':
      return <Pricing />;
    default:
      return null;
  }
}

function Brand() {
  return (
    <span className="flex items-center gap-2 font-semibold text-foreground">
      <span className="inline-flex size-6 items-center justify-center rounded-md bg-accent text-on-accent text-xs font-semibold">
        ✦
      </span>
      Design System
    </span>
  );
}

function OverviewPage() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-16 space-y-12">
      <header className="space-y-3">
        <Badge tone="accent" dot>
          Internal — v0.1
        </Badge>
        <h1 className="text-4xl font-semibold tracking-tight text-foreground">
          A refined-minimal design system.
        </h1>
        <p className="text-base text-foreground-muted leading-relaxed max-w-xl">
          40 component primitives and 8 composed patterns, built on Tailwind v4 + Radix UI.
          Neutral-dominant, one accent, hairline borders, generous whitespace. Use the picker
          in the bottom-right to browse.
        </p>
      </header>

      <section className="space-y-2">
        <h2 className="text-sm font-semibold text-foreground uppercase tracking-wide">
          Aesthetic direction
        </h2>
        <p className="text-sm text-foreground-muted leading-relaxed">
          Linear, Vercel, Stripe Dashboard, Notion, and Raycast — side by side. The UI
          disappears so content can lead. About 85% of any screen is neutral; colour appears
          only on action, status, and focus.
        </p>
      </section>

      <section className="grid gap-3 sm:grid-cols-2">
        <InfoCard label="Sans" value="Geist" hint="Vercel's grotesk, UI-tuned." />
        <InfoCard label="Mono" value="Geist Mono" hint="Pairs natively with Geist." />
        <InfoCard label="Neutrals" value="Cool gray" hint="Hue ≈ 220°, precise and technical." />
        <InfoCard label="Accent" value="Graphite indigo" hint="Desaturated, never decorative." />
      </section>

      <section className="space-y-2">
        <h2 className="text-sm font-semibold text-foreground uppercase tracking-wide">
          Live patterns
        </h2>
        <p className="text-sm text-foreground-muted leading-relaxed">
          Use the floating picker in the bottom-right corner to jump between patterns. Each
          pattern renders full-screen so the proportions read at intended scale.
        </p>
      </section>
    </main>
  );
}

function InfoCard({ label, value, hint }: { label: string; value: string; hint: string }) {
  return (
    <div className="rounded-lg border border-border bg-card p-4">
      <div className="text-[10px] font-medium uppercase tracking-wider text-foreground-subtle">
        {label}
      </div>
      <div className="mt-1 text-base font-semibold text-foreground">{value}</div>
      <div className="mt-0.5 text-xs text-foreground-muted">{hint}</div>
    </div>
  );
}
