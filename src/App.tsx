import { useEffect, useState, type ReactNode } from 'react';
import { ArrowRight, Check, Copy, ExternalLink, Moon, Sun } from '@/icons';
import { Github, Package, Sparkles } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Avatar } from '@/components/ui/Avatar';
import { Input } from '@/components/ui/Input';
import { Switch } from '@/components/ui/Switch';
import { Checkbox } from '@/components/ui/Checkbox';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/Tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Alert } from '@/components/ui/Alert';
import { Progress } from '@/components/ui/Progress';
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

const VERSION = '0.2.0';
const STORYBOOK_URL = 'https://storybook.runestonetechnologies.com';
const GITHUB_URL = 'https://github.com/craftzbay/design-system';
const NPM_URL = 'https://www.npmjs.com/package/@craftzbay/ui';

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
  description?: string;
}

const patterns: PatternEntry[] = [
  { key: 'home', label: 'Overview', group: 'Overview' },
  { key: 'auth-signin', label: 'Sign in', group: 'Authentication', description: 'Email + password with social options' },
  { key: 'auth-signup', label: 'Sign up', group: 'Authentication', description: 'Account creation' },
  { key: 'auth-forgot', label: 'Forgot password', group: 'Authentication', description: 'Password reset request' },
  { key: 'auth-magic', label: 'Magic link sent', group: 'Authentication', description: 'Post-submit confirmation' },
  { key: 'dashboard', label: 'Dashboard', group: 'App', description: 'Stats, chart, recent activity' },
  { key: 'settings', label: 'Settings', group: 'App', description: 'Sub-nav + 5 sections' },
  { key: 'data-table', label: 'Data table page', group: 'App', description: 'Filter, search, bulk actions' },
  { key: 'record', label: 'Record detail', group: 'App', description: 'Header + tabs + side panel' },
  { key: 'first-run', label: 'First-run empty', group: 'App', description: 'Hero + next-step cards' },
  { key: 'onboarding', label: 'Onboarding', group: 'Marketing', description: '4-step stepper flow' },
  { key: 'pricing', label: 'Pricing', group: 'Marketing', description: '3-tier comparison' },
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

  useEffect(() => {
    const onHash = () => {
      const k = (window.location.hash.replace('#', '') as PatternKey) || 'home';
      setActive(patterns.find((p) => p.key === k)?.key ?? 'home');
    };
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, []);

  const toggleTheme = () => setTheme((t) => (t === 'light' ? 'dark' : 'light'));
  const isHome = active === 'home';

  return (
    <TooltipProvider>
      <ToastProvider>
        <div className="min-h-screen bg-background text-foreground">
          {isHome && <TopBar theme={theme} onToggleTheme={toggleTheme} />}
          {renderPattern(active, setActive)}

          {!isHome && (
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
                    <button
                      type="button"
                      onClick={() => {
                        setActive('home');
                        setPickerOpen(false);
                      }}
                      className="text-xs text-foreground-muted hover:text-foreground"
                    >
                      Back to overview
                    </button>
                  </div>
                  <div className="max-h-[60vh] overflow-y-auto p-1">
                    {(['Authentication', 'App', 'Marketing'] as const).map((group) => (
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
          )}

          <ToastViewport />
        </div>
      </ToastProvider>
    </TooltipProvider>
  );
}

function TopBar({ theme, onToggleTheme }: { theme: 'light' | 'dark'; onToggleTheme: () => void }) {
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-6xl items-center gap-6 px-6">
        <a href="#" className="flex items-center gap-2 font-semibold">
          <span className="inline-flex size-6 items-center justify-center rounded-md bg-accent text-on-accent text-xs">
            ✦
          </span>
          @craftzbay/ui
        </a>
        <nav className="hidden items-center gap-1 text-sm text-foreground-muted sm:flex">
          <a className="rounded-md px-3 py-1.5 hover:bg-background-muted hover:text-foreground" href={STORYBOOK_URL} target="_blank" rel="noreferrer">
            Storybook
          </a>
          <a className="rounded-md px-3 py-1.5 hover:bg-background-muted hover:text-foreground" href={GITHUB_URL} target="_blank" rel="noreferrer">
            GitHub
          </a>
          <a className="rounded-md px-3 py-1.5 hover:bg-background-muted hover:text-foreground" href={NPM_URL} target="_blank" rel="noreferrer">
            npm
          </a>
        </nav>
        <div className="ml-auto flex items-center gap-2">
          <IconButton
            aria-label="Toggle theme"
            icon={theme === 'light' ? <Moon /> : <Sun />}
            size="sm"
            variant="ghost"
            onClick={onToggleTheme}
          />
        </div>
      </div>
    </header>
  );
}

function renderPattern(key: PatternKey, setActive: (k: PatternKey) => void): ReactNode {
  switch (key) {
    case 'home':
      return <OverviewPage onPick={setActive} />;
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
      Atlas
    </span>
  );
}

function OverviewPage({ onPick }: { onPick: (k: PatternKey) => void }) {
  return (
    <>
      <Hero />
      <Stats />
      <ComponentShowcase />
      <QuickStart />
      <Features />
      <PatternGallery onPick={onPick} />
      <Footer />
    </>
  );
}

function Hero() {
  return (
    <section className="mx-auto max-w-6xl px-6 pt-20 pb-16 sm:pt-28 sm:pb-24">
      <div className="mx-auto flex max-w-3xl flex-col items-center gap-6 text-center">
        <a
          href={NPM_URL}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-xs text-foreground-muted transition-colors hover:bg-background-muted hover:text-foreground"
        >
          <Sparkles className="size-3" aria-hidden />
          v{VERSION} · public on npm
          <ArrowRight className="size-3" aria-hidden />
        </a>
        <h1 className="text-5xl font-semibold tracking-tight text-foreground sm:text-6xl">
          A refined-minimal
          <br />
          design system.
        </h1>
        <p className="max-w-xl text-base text-foreground-muted sm:text-lg">
          49 accessible React components and 8 ready-made page patterns. Built on
          Tailwind v4 + Radix UI. Tree-shakeable, fully typed, MIT licensed.
        </p>

        <InstallSnippet />

        <div className="mt-2 flex flex-wrap items-center justify-center gap-3">
          <Button asChild>
            <a href={STORYBOOK_URL} target="_blank" rel="noreferrer">
              View Storybook
              <ArrowRight className="size-4" />
            </a>
          </Button>
          <Button asChild variant="outline">
            <a href={GITHUB_URL} target="_blank" rel="noreferrer">
              <Github className="size-4" />
              GitHub
            </a>
          </Button>
        </div>
      </div>
    </section>
  );
}

function InstallSnippet() {
  const [copied, setCopied] = useState(false);
  const text = 'pnpm add @craftzbay/ui';

  return (
    <div className="group flex items-center gap-3 rounded-md border border-border bg-card px-4 py-2.5 font-mono text-sm">
      <span className="text-foreground-subtle">$</span>
      <code>{text}</code>
      <button
        type="button"
        aria-label="Copy install command"
        className="ml-2 rounded p-1 text-foreground-subtle transition-colors hover:bg-background-muted hover:text-foreground"
        onClick={() => {
          navigator.clipboard.writeText(text).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 1500);
          });
        }}
      >
        {copied ? <Check className="size-3.5 text-success-text" /> : <Copy className="size-3.5" />}
      </button>
    </div>
  );
}

function Stats() {
  const items = [
    { value: '49', label: 'Components' },
    { value: '8', label: 'Page patterns' },
    { value: '124', label: 'Storybook stories' },
    { value: '56 KB', label: 'Gzipped (ESM)' },
  ];
  return (
    <section className="mx-auto max-w-6xl px-6 pb-16">
      <div className="grid grid-cols-2 gap-px overflow-hidden rounded-lg border border-border bg-border sm:grid-cols-4">
        {items.map((it) => (
          <div key={it.label} className="flex flex-col gap-1 bg-card p-5">
            <span className="text-3xl font-semibold tabular-nums text-foreground">{it.value}</span>
            <span className="text-xs text-foreground-subtle">{it.label}</span>
          </div>
        ))}
      </div>
    </section>
  );
}

function ComponentShowcase() {
  return (
    <section className="mx-auto max-w-6xl px-6 pb-20">
      <SectionHeader
        eyebrow="Components"
        title="Production-grade primitives."
        subtitle="Every component ships with default, hover, focus-visible, active, disabled, and loading states — plus dark mode and a11y wiring."
      />

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Demo title="Buttons">
          <div className="flex flex-wrap items-center gap-2">
            <Button size="sm">Primary</Button>
            <Button size="sm" variant="secondary">Secondary</Button>
            <Button size="sm" variant="outline">Outline</Button>
            <Button size="sm" variant="ghost">Ghost</Button>
            <Button size="sm" variant="destructive">Delete</Button>
          </div>
        </Demo>

        <Demo title="Form input">
          <div className="flex flex-col gap-2">
            <Input placeholder="jane@example.com" defaultValue="jane@example.com" />
            <Input placeholder="Empty" />
            <Input placeholder="Invalid" error="Email is required" />
          </div>
        </Demo>

        <Demo title="Badges & status">
          <div className="flex flex-wrap items-center gap-2">
            <Badge tone="success" dot>Active</Badge>
            <Badge tone="warning">Pending</Badge>
            <Badge tone="danger">Failed</Badge>
            <Badge tone="info">Beta</Badge>
            <Badge tone="accent" variant="outline">v0.2.0</Badge>
          </div>
        </Demo>

        <Demo title="Avatars">
          <div className="flex items-center gap-3">
            <Avatar size="sm" fallback="AB" status="online" />
            <Avatar size="md" fallback="CD" status="busy" />
            <Avatar size="lg" fallback="EF" status="away" />
            <Avatar size="xl" fallback="GH" />
          </div>
        </Demo>

        <Demo title="Toggles">
          <div className="flex flex-col gap-3">
            <Switch label="Email notifications" defaultChecked />
            <Switch label="SMS notifications" />
            <Checkbox label="I agree to the terms" defaultChecked />
          </div>
        </Demo>

        <Demo title="Tabs">
          <Tabs defaultValue="day">
            <TabsList variant="pills">
              <TabsTrigger value="day">Day</TabsTrigger>
              <TabsTrigger value="week">Week</TabsTrigger>
              <TabsTrigger value="month">Month</TabsTrigger>
            </TabsList>
          </Tabs>
        </Demo>

        <Demo title="Alerts">
          <Alert variant="success" title="Saved">
            All changes published.
          </Alert>
        </Demo>

        <Demo title="Progress">
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between text-xs text-foreground-muted">
              <span>Upload</span>
              <span>62%</span>
            </div>
            <Progress value={62} aria-label="Upload" />
            <div className="flex items-center justify-between text-xs text-foreground-muted">
              <span>Storage</span>
              <span>92%</span>
            </div>
            <Progress value={92} aria-label="Storage" />
          </div>
        </Demo>

        <Demo title="Card">
          <Card>
            <CardHeader>
              <CardTitle>Project Atlas</CardTitle>
              <CardDescription>4 contributors · updated 2h ago</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-foreground-muted">
                Tailwind v4 + Radix primitives, refined-minimal aesthetic.
              </p>
            </CardContent>
          </Card>
        </Demo>
      </div>
    </section>
  );
}

function Demo({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="flex flex-col gap-3 rounded-lg border border-border bg-card p-5">
      <div className="text-[10px] font-medium uppercase tracking-wider text-foreground-subtle">
        {title}
      </div>
      <div className="flex min-h-[5rem] flex-col justify-center">{children}</div>
    </div>
  );
}

function QuickStart() {
  return (
    <section className="mx-auto max-w-6xl px-6 pb-20">
      <SectionHeader
        eyebrow="Quick start"
        title="Three lines and you're in."
        subtitle="Install, import the stylesheet once, and start composing."
      />

      <div className="grid gap-4 lg:grid-cols-[1fr_1fr]">
        <CodeBlock
          label="Install"
          code={`# pnpm\npnpm add @craftzbay/ui\n\n# or npm\nnpm install @craftzbay/ui`}
        />
        <CodeBlock
          label="Use"
          code={`import { Button, Dialog } from '@craftzbay/ui';\nimport '@craftzbay/ui/styles.css';\n\nexport function App() {\n  return <Button>Save changes</Button>;\n}`}
        />
      </div>
    </section>
  );
}

function CodeBlock({ label, code }: { label: string; code: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <div className="overflow-hidden rounded-lg border border-border bg-card">
      <div className="flex items-center justify-between border-b border-border px-4 py-2">
        <span className="text-[10px] font-medium uppercase tracking-wider text-foreground-subtle">
          {label}
        </span>
        <button
          type="button"
          aria-label={`Copy ${label}`}
          onClick={() => {
            navigator.clipboard.writeText(code).then(() => {
              setCopied(true);
              setTimeout(() => setCopied(false), 1500);
            });
          }}
          className="rounded p-1 text-foreground-subtle hover:bg-background-muted hover:text-foreground"
        >
          {copied ? <Check className="size-3.5 text-success-text" /> : <Copy className="size-3.5" />}
        </button>
      </div>
      <pre className="overflow-x-auto px-4 py-3 font-mono text-[13px] leading-relaxed text-foreground">
        <code>{code}</code>
      </pre>
    </div>
  );
}

function Features() {
  const items = [
    {
      title: 'Tailwind v4 native',
      body: 'Tokens defined in @theme — no JS, no PostCSS plugins, just CSS variables you can override.',
    },
    {
      title: 'Accessibility built-in',
      body: 'Radix primitives handle keyboard, focus, and ARIA. WCAG AA contrast across light + dark.',
    },
    {
      title: 'Light + dark out of the box',
      body: 'Class-based theme switch. Every component renders in both, no extra config.',
    },
    {
      title: 'Tree-shakeable, peer-React',
      body: 'ESM + CJS + .d.ts. 56 KB gzipped — and that’s only what you import.',
    },
  ];

  return (
    <section className="mx-auto max-w-6xl px-6 pb-20">
      <SectionHeader eyebrow="Why" title="Built to disappear." />
      <div className="grid gap-4 sm:grid-cols-2">
        {items.map((it) => (
          <div key={it.title} className="rounded-lg border border-border bg-card p-5">
            <h3 className="text-base font-semibold">{it.title}</h3>
            <p className="mt-1 text-sm text-foreground-muted">{it.body}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function PatternGallery({ onPick }: { onPick: (k: PatternKey) => void }) {
  const items = patterns.filter((p) => p.key !== 'home');
  return (
    <section className="mx-auto max-w-6xl px-6 pb-20">
      <SectionHeader
        eyebrow="Page patterns"
        title="Ship a screen in minutes."
        subtitle="Composed from the primitives — open one to see the layout at intended scale."
      />
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((p) => (
          <button
            key={p.key}
            type="button"
            onClick={() => onPick(p.key)}
            className="group flex flex-col gap-2 rounded-lg border border-border bg-card p-5 text-left outline-none transition-colors hover:border-border-strong hover:bg-background-muted focus-visible:ring-2 focus-visible:ring-ring"
          >
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-medium uppercase tracking-wider text-foreground-subtle">
                {p.group}
              </span>
              <ArrowRight className="size-4 text-foreground-subtle transition-transform group-hover:translate-x-0.5" />
            </div>
            <span className="text-base font-semibold">{p.label}</span>
            {p.description && (
              <span className="text-sm text-foreground-muted">{p.description}</span>
            )}
          </button>
        ))}
      </div>
    </section>
  );
}

function SectionHeader({
  eyebrow,
  title,
  subtitle,
}: {
  eyebrow: string;
  title: string;
  subtitle?: string;
}) {
  return (
    <header className="mb-8 flex flex-col gap-2">
      <span className="text-[10px] font-medium uppercase tracking-wider text-accent">
        {eyebrow}
      </span>
      <h2 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
        {title}
      </h2>
      {subtitle && (
        <p className="max-w-2xl text-sm text-foreground-muted sm:text-base">{subtitle}</p>
      )}
    </header>
  );
}

function Footer() {
  return (
    <footer className="border-t border-border">
      <div className="mx-auto flex max-w-6xl flex-col gap-3 px-6 py-8 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-xs text-foreground-subtle">
          © 2026 craftzbay · MIT
        </p>
        <nav className="flex items-center gap-4 text-xs text-foreground-muted">
          <a className="inline-flex items-center gap-1 hover:text-foreground" href={NPM_URL} target="_blank" rel="noreferrer">
            <Package className="size-3" /> npm <ExternalLink className="size-3" />
          </a>
          <a className="inline-flex items-center gap-1 hover:text-foreground" href={GITHUB_URL} target="_blank" rel="noreferrer">
            <Github className="size-3" /> GitHub <ExternalLink className="size-3" />
          </a>
          <a className="inline-flex items-center gap-1 hover:text-foreground" href={STORYBOOK_URL} target="_blank" rel="noreferrer">
            Storybook <ExternalLink className="size-3" />
          </a>
        </nav>
      </div>
    </footer>
  );
}
