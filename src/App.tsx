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
import { Tooltip } from '@/components/ui/Tooltip';
import { Separator } from '@/components/ui/Separator';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/Accordion';
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  useCommandPaletteShortcut,
} from '@/components/ui/CommandPalette';
import { useSidebar } from '@/components/ui/Sidebar';
import { useCatalogEntries } from './catalog';
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
const GITHUB_URL = 'https://github.com/craftzbay/design-system';
const NPM_URL = 'https://www.npmjs.com/package/@craftzbay/ui';

type PatternKey =
  | 'home'
  | 'catalog'
  | 'docs'
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
  group: 'Overview' | 'Catalog' | 'Docs' | 'Authentication' | 'App' | 'Marketing';
  description?: string;
}

const patterns: PatternEntry[] = [
  { key: 'home', label: 'Overview', group: 'Overview' },
  { key: 'catalog', label: 'Components catalog', group: 'Catalog', description: 'Every primitive on one page' },
  { key: 'docs', label: 'Docs', group: 'Docs', description: 'Quick start, theming, a11y, FAQ' },
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
      const k = window.location.hash.replace('#', '');
      // Empty hash → overview. Unknown hash (e.g. a Settings sub-section
      // anchor like #profile) is ignored so the current pattern stays put.
      if (k === '') setActive('home');
      else if (patterns.some((p) => p.key === k)) setActive(k as PatternKey);
    };
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, []);

  const [cmdOpen, setCmdOpen] = useState(false);
  useCommandPaletteShortcut(setCmdOpen);

  const toggleTheme = () => setTheme((t) => (t === 'light' ? 'dark' : 'light'));
  const isHome = active === 'home';

  return (
    <TooltipProvider>
      <ToastProvider>
        <div className="min-h-screen bg-background text-foreground">
          {isHome && <TopBar theme={theme} onToggleTheme={toggleTheme} onOpenPalette={() => setCmdOpen(true)} />}
          {renderPattern(active, setActive)}

          <CommandDialog open={cmdOpen} onOpenChange={setCmdOpen}>
            <CommandInput placeholder="Jump to a pattern or component…" />
            <CommandList>
              <CommandEmpty>No results.</CommandEmpty>
              {(['Overview', 'Authentication', 'App', 'Marketing'] as const).map((group) => (
                <CommandGroup key={group} heading={group}>
                  {patterns
                    .filter((p) => p.group === group)
                    .map((p) => (
                      <CommandItem
                        key={p.key}
                        value={`${p.label} ${p.key}`}
                        onSelect={() => {
                          setActive(p.key);
                          setCmdOpen(false);
                        }}
                      >
                        {p.label}
                      </CommandItem>
                    ))}
                </CommandGroup>
              ))}
              <CommandGroup heading="Resources">
                <CommandItem
                  value="catalog all components"
                  onSelect={() => {
                    setActive('catalog');
                    setCmdOpen(false);
                  }}
                >
                  Components catalog
                </CommandItem>
                <CommandItem
                  value="github source"
                  onSelect={() => {
                    window.open(GITHUB_URL, '_blank', 'noopener,noreferrer');
                    setCmdOpen(false);
                  }}
                >
                  Open GitHub ↗
                </CommandItem>
                <CommandItem
                  value="npm package"
                  onSelect={() => {
                    window.open(NPM_URL, '_blank', 'noopener,noreferrer');
                    setCmdOpen(false);
                  }}
                >
                  Open npm ↗
                </CommandItem>
                <CommandItem
                  value="theme"
                  onSelect={() => {
                    toggleTheme();
                    setCmdOpen(false);
                  }}
                >
                  Toggle theme
                </CommandItem>
              </CommandGroup>
            </CommandList>
          </CommandDialog>

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

function TopBar({
  theme,
  onToggleTheme,
  onOpenPalette,
}: {
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
  onOpenPalette: () => void;
}) {
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
          <a className="rounded-md px-3 py-1.5 hover:bg-background-muted hover:text-foreground" href="#catalog">
            Components
          </a>
          <a className="rounded-md px-3 py-1.5 hover:bg-background-muted hover:text-foreground" href="#docs">
            Docs
          </a>
          <a className="rounded-md px-3 py-1.5 hover:bg-background-muted hover:text-foreground" href={GITHUB_URL} target="_blank" rel="noreferrer">
            GitHub
          </a>
          <a className="rounded-md px-3 py-1.5 hover:bg-background-muted hover:text-foreground" href={NPM_URL} target="_blank" rel="noreferrer">
            npm
          </a>
        </nav>
        <div className="ml-auto flex items-center gap-2">
          <button
            type="button"
            onClick={onOpenPalette}
            className="hidden h-8 items-center gap-2 rounded-md border border-border bg-card px-2.5 text-sm text-foreground-muted transition-colors hover:bg-background-muted hover:text-foreground sm:flex"
          >
            <span className="text-xs">Search…</span>
            <span className="rounded border border-border bg-background px-1.5 py-0.5 font-mono text-[10px] text-foreground-subtle">
              ⌘K
            </span>
          </button>
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
    case 'catalog':
      return <CatalogPage />;
    case 'docs':
      return <DocsPage />;
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
          <SignInForm onSubmit={() => setActive('dashboard')} />
        </AuthLayout>
      );
    case 'auth-signup':
      return (
        <AuthLayout
          brand={<Brand />}
          title="Create your account"
          subtitle="Free for the first 14 days. No credit card required."
        >
          <SignUpForm onSubmit={() => setActive('onboarding')} />
        </AuthLayout>
      );
    case 'auth-forgot':
      return (
        <AuthLayout
          brand={<Brand />}
          title="Reset password"
          subtitle="Enter the email tied to your account."
        >
          <ForgotPasswordForm onSubmit={() => setActive('auth-magic')} />
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
        <AppShell brand={<Brand />} active="home">
          <Dashboard />
        </AppShell>
      );
    case 'settings':
      return (
        <AppShell brand={<Brand />} active="settings">
          <SettingsPage />
        </AppShell>
      );
    case 'data-table':
      return (
        <AppShell brand={<Brand />} active="projects">
          <DataTablePage />
        </AppShell>
      );
    case 'record':
      return (
        <AppShell brand={<Brand />} active="members">
          <RecordDetail />
        </AppShell>
      );
    case 'first-run':
      return (
        <AppShell brand={<Brand />} active="inbox">
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

/* -----------------------------------------------------------------------------
 *  CatalogPage — every primitive on one page. Mini-demo + Storybook link.
 * --------------------------------------------------------------------------- */

function CatalogPage() {
  const entries = useCatalogEntries();
  const groups = Array.from(new Set(entries.map((e) => e.group)));

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-40 border-b border-border bg-background/85 backdrop-blur">
        <div className="mx-auto flex h-14 max-w-7xl items-center gap-4 px-6">
          <a href="#" className="flex items-center gap-2 font-semibold">
            <span className="inline-flex size-6 items-center justify-center rounded-md bg-accent text-on-accent text-xs">
              ✦
            </span>
            Components
          </a>
          <span className="text-xs text-foreground-subtle">{entries.length} primitives</span>
          <nav className="ml-auto hidden flex-wrap items-center gap-1 text-xs text-foreground-muted md:flex">
            {groups.map((g) => (
              <a
                key={g}
                href={`#group-${g.toLowerCase().replace(/\s+/g, '-')}`}
                className="rounded-md px-2 py-1 hover:bg-background-muted hover:text-foreground"
              >
                {g}
              </a>
            ))}
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-6 py-10">
        {groups.map((group) => {
          const groupEntries = entries.filter((e) => e.group === group);
          const anchor = `group-${group.toLowerCase().replace(/\s+/g, '-')}`;
          return (
            <section key={group} id={anchor} className="mb-12 scroll-mt-20">
              <div className="mb-4 flex items-baseline justify-between">
                <h2 className="text-xl font-semibold tracking-tight">{group}</h2>
                <span className="text-xs text-foreground-subtle">{groupEntries.length}</span>
              </div>
              <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
                {groupEntries.map((e) => (
                  <Card key={e.name} className="flex flex-col gap-3 p-5">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">{e.name}</span>
                      <a
                        href={`${GITHUB_URL}/blob/main/src/components/ui/${e.name}.tsx`}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 text-[11px] text-foreground-subtle hover:text-accent"
                      >
                        Source <ExternalLink className="size-3" aria-hidden />
                      </a>
                    </div>
                    <div className="flex min-h-[5rem] flex-1 items-center justify-center">
                      {e.render()}
                    </div>
                  </Card>
                ))}
              </div>
            </section>
          );
        })}
      </main>
    </div>
  );
}

/* -----------------------------------------------------------------------------
 *  DocsPage — Quick start + Theming + Accessibility + FAQ in one scrollable
 *  article with sticky section nav.
 * --------------------------------------------------------------------------- */

const docsSections = [
  { id: 'quickstart', label: 'Quick start' },
  { id: 'theming', label: 'Theming' },
  { id: 'accessibility', label: 'Accessibility' },
  { id: 'faq', label: 'FAQ' },
] as const;

function DocsPage() {
  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-40 border-b border-border bg-background/85 backdrop-blur">
        <div className="mx-auto flex h-14 max-w-5xl items-center gap-4 px-6">
          <a href="#" className="flex items-center gap-2 font-semibold">
            <span className="inline-flex size-6 items-center justify-center rounded-md bg-accent text-on-accent text-xs">
              ✦
            </span>
            Docs
          </a>
          <nav className="ml-auto hidden flex-wrap items-center gap-1 text-xs text-foreground-muted md:flex">
            {docsSections.map((s) => (
              <a
                key={s.id}
                href={`#docs-${s.id}`}
                className="rounded-md px-2 py-1 hover:bg-background-muted hover:text-foreground"
              >
                {s.label}
              </a>
            ))}
            <a href="#catalog" className="rounded-md px-2 py-1 hover:bg-background-muted hover:text-foreground">
              Components ↗
            </a>
          </nav>
        </div>
      </header>

      <article className="mx-auto max-w-3xl px-6 py-12 [&_h2]:mt-12 [&_h2]:mb-4 [&_h2]:text-2xl [&_h2]:font-semibold [&_h2]:tracking-tight [&_h3]:mt-8 [&_h3]:mb-2 [&_h3]:text-base [&_h3]:font-semibold [&_p]:mb-3 [&_p]:text-sm [&_p]:text-foreground-muted [&_p]:leading-relaxed [&_ul]:mb-3 [&_ul]:list-disc [&_ul]:pl-6 [&_li]:text-sm [&_li]:text-foreground-muted [&_li]:mt-1 [&_code]:rounded [&_code]:bg-background-muted [&_code]:px-1 [&_code]:py-0.5 [&_code]:text-[12.5px] [&_code]:text-foreground [&_pre]:mb-4 [&_pre]:overflow-x-auto [&_pre]:rounded-md [&_pre]:border [&_pre]:border-border [&_pre]:bg-card [&_pre]:p-4 [&_pre]:text-[13px] [&_pre_code]:bg-transparent [&_pre_code]:p-0 [&_a]:text-accent [&_a]:hover:underline">
        <section id="docs-quickstart" className="scroll-mt-20">
          <p className="text-xs uppercase tracking-wider text-accent">@craftzbay/ui</p>
          <h1 className="mb-2 text-4xl font-semibold tracking-tight">Documentation</h1>
          <p>
            A refined-minimal Tailwind v4 + React design system. 49 components,
            8 page patterns, dark mode out of the box.
          </p>

          <h2>Quick start</h2>
          <h3>1. Install</h3>
          <pre><code>pnpm add @craftzbay/ui</code></pre>
          <p>Peer dependencies: <code>react@&gt;=18</code>, <code>react-dom@&gt;=18</code>.</p>

          <h3>2. Import the stylesheet</h3>
          <p>Once, at the top of your app entry:</p>
          <pre><code>{`import '@craftzbay/ui/styles.css';`}</code></pre>

          <h3>3. Use a component</h3>
          <pre><code>{`import { Button, Dialog, DialogContent, DialogTrigger, DialogTitle } from '@craftzbay/ui';

export function ExportDialog() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Export…</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogTitle>Export workspace</DialogTitle>
        …
      </DialogContent>
    </Dialog>
  );
}`}</code></pre>

          <h3>4. Dark mode</h3>
          <p>
            Toggle the <code>dark</code> class on any container — usually <code>&lt;html&gt;</code>. All token-coloured
            surfaces flip automatically.
          </p>
        </section>

        <section id="docs-theming" className="scroll-mt-20">
          <h2>Theming</h2>
          <p>
            The library is built on Tailwind v4 CSS variables. Every visual
            decision flows through a token. There are three override surfaces.
          </p>

          <h3>1. Global override — CSS variables</h3>
          <pre><code>{`@import '@craftzbay/ui/styles.css';

:root {
  --color-accent: oklch(0.55 0.18 250);
  --color-accent-700: oklch(0.46 0.16 250);
  --radius-md: 8px;
}

.dark {
  --color-accent: oklch(0.65 0.18 250);
}`}</code></pre>

          <h3>2. Per-subtree — DesignSystemProvider</h3>
          <pre><code>{`import { DesignSystemProvider, brandPresets } from '@craftzbay/ui';

<DesignSystemProvider tokens={brandPresets.edgelog}>
  <Card>…</Card>
</DesignSystemProvider>`}</code></pre>
          <p>
            Presets: <code>default</code>, <code>edgelog</code>, <code>gerege</code>, <code>forest</code>.
            Or pass any token map with or without the <code>--</code> prefix.
          </p>

          <h3>3. Per-component — className</h3>
          <pre><code>{`<Button className="rounded-full px-6">Round once</Button>`}</code></pre>
          <p>Conflicts resolve cleanly via <code>tailwind-merge</code>.</p>
        </section>

        <section id="docs-accessibility" className="scroll-mt-20">
          <h2>Accessibility</h2>
          <p>Every primitive ships a11y-correct by default. The library follows three non-negotiable rules:</p>
          <ul>
            <li><strong>WCAG AA contrast</strong> on text + interactive UI.</li>
            <li><strong>Keyboard parity</strong> — Tab, Enter, Space, Arrow, Escape, ⌘K.</li>
            <li><strong>Screen-reader semantics</strong> — labels required, ARIA set by Radix.</li>
          </ul>
          <p>
            The library tests itself with <code>jest-axe</code>. Run <code>pnpm test</code>
            in the repo to see the suite. You can do the same in your app.
          </p>

          <h3>Patterns to follow</h3>
          <ul>
            <li>Always pair icon-only buttons with <code>aria-label</code>.</li>
            <li>Use the <code>label</code> prop on form inputs — it wires <code>htmlFor</code>.</li>
            <li>Always include a <code>DialogTitle</code> / <code>SheetTitle</code> / <code>DrawerTitle</code>.</li>
            <li>Pass <code>aria-label</code> on <code>Progress</code>, <code>Spinner</code>, <code>IconButton</code>.</li>
          </ul>
        </section>

        <section id="docs-faq" className="scroll-mt-20">
          <h2>FAQ</h2>

          <h3>Can I use it without Tailwind in my consumer app?</h3>
          <p>
            Yes. The library ships a precompiled <code>styles.css</code>. If you do
            have Tailwind in your app, no conflict either.
          </p>

          <h3>Why Tailwind v4 specifically?</h3>
          <p>
            CSS-first config (tokens in <code>@theme</code> blocks), 3× faster
            builds, native CSS variable output, and automatic dark mode via class.
          </p>

          <h3>How big is the bundle?</h3>
          <p>
            ESM <code>index.js</code> is ~142 KB / ~33 KB gzipped. Plus
            <code>styles.css</code> at 8 KB / 2 KB gzipped. Tree-shakeable.
          </p>

          <h3>Does it work with Next.js / Remix / TanStack Start?</h3>
          <p>
            Yes. For React Server Components, interactive primitives need
            <code>'use client'</code> at the consuming file — standard for any
            Radix-based library.
          </p>

          <h3>Where do I see every component?</h3>
          <p>
            On the <a href="#catalog">Components catalog</a> page — every primitive
            with a live mini-demo and a link to its source on GitHub.
          </p>

          <h3>Where do I report bugs?</h3>
          <p>
            <a href="https://github.com/craftzbay/design-system/issues" target="_blank" rel="noreferrer">GitHub Issues</a>.
            PRs welcome — CI runs typecheck, tests, and all builds on every PR.
          </p>
        </section>
      </article>
    </div>
  );
}

function Brand() {
  const { collapsed } = useSidebar();
  return (
    <a href="#" className="flex items-center gap-2 font-semibold text-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-md">
      <span className="inline-flex size-6 shrink-0 items-center justify-center rounded-md bg-accent text-on-accent text-xs font-semibold">
        ✦
      </span>
      {!collapsed && <span className="truncate">Atlas</span>}
    </a>
  );
}

function OverviewPage({ onPick }: { onPick: (k: PatternKey) => void }) {
  return (
    <>
      <Hero />
      <Stats />
      <Separator className="mx-auto max-w-6xl" />
      <ComponentShowcase />
      <Separator className="mx-auto max-w-6xl" />
      <QuickStart />
      <Separator className="mx-auto max-w-6xl" />
      <Features />
      <Separator className="mx-auto max-w-6xl" />
      <PatternGallery onPick={onPick} />
      <Separator className="mx-auto max-w-6xl" />
      <FAQ />
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
            <a href="#catalog">
              Browse components
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
  const [pkgMgr, setPkgMgr] = useState<'pnpm' | 'npm' | 'yarn' | 'bun'>('pnpm');
  const commands = {
    pnpm: 'pnpm add @craftzbay/ui',
    npm: 'npm install @craftzbay/ui',
    yarn: 'yarn add @craftzbay/ui',
    bun: 'bun add @craftzbay/ui',
  };
  const text = commands[pkgMgr];

  return (
    <Card className="w-full max-w-md p-0 overflow-hidden">
      <Tabs value={pkgMgr} onValueChange={(v) => setPkgMgr(v as typeof pkgMgr)}>
        <div className="flex items-center justify-between border-b border-border px-2">
          <TabsList variant="underline" size="sm" className="border-b-0 gap-2">
            <TabsTrigger value="pnpm">pnpm</TabsTrigger>
            <TabsTrigger value="npm">npm</TabsTrigger>
            <TabsTrigger value="yarn">yarn</TabsTrigger>
            <TabsTrigger value="bun">bun</TabsTrigger>
          </TabsList>
          <Tooltip label={copied ? 'Copied!' : 'Copy'}>
            <IconButton
              aria-label="Copy install command"
              size="sm"
              variant="ghost"
              icon={copied ? <Check className="text-success-text" /> : <Copy />}
              onClick={() => {
                navigator.clipboard.writeText(text).then(() => {
                  setCopied(true);
                  setTimeout(() => setCopied(false), 1500);
                });
              }}
            />
          </Tooltip>
        </div>
        <div className="flex items-center gap-3 px-4 py-3 font-mono text-sm">
          <span className="text-foreground-subtle">$</span>
          <code>{text}</code>
        </div>
      </Tabs>
    </Card>
  );
}

function Stats() {
  const items = [
    { value: '49', label: 'Components', trend: '+9 in 0.3' },
    { value: '8', label: 'Page patterns', trend: 'ready-to-ship' },
    { value: '124', label: 'Storybook stories' },
    { value: '33 KB', label: 'Gzipped (ESM)', trend: '−35% in 0.5', tone: 'success' as const },
  ];
  return (
    <section className="mx-auto max-w-6xl px-6 pb-16">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {items.map((it) => (
          <Card key={it.label} className="p-5">
            <div className="flex flex-col gap-2">
              <span className="text-3xl font-semibold tabular-nums text-foreground">{it.value}</span>
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs text-foreground-subtle">{it.label}</span>
                {it.trend && (
                  <Badge tone={it.tone ?? 'neutral'} variant="outline" className="text-[10px]">
                    {it.trend}
                  </Badge>
                )}
              </div>
            </div>
          </Card>
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
    <Card className="flex flex-col gap-3 p-5">
      <div className="text-[10px] font-medium uppercase tracking-wider text-foreground-subtle">
        {title}
      </div>
      <div className="flex min-h-[5rem] flex-col justify-center">{children}</div>
    </Card>
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
    <Card className="overflow-hidden p-0">
      <div className="flex items-center justify-between border-b border-border px-4 py-2">
        <span className="text-[10px] font-medium uppercase tracking-wider text-foreground-subtle">
          {label}
        </span>
        <Tooltip label={copied ? 'Copied!' : 'Copy'}>
          <IconButton
            aria-label={`Copy ${label}`}
            size="sm"
            variant="ghost"
            icon={copied ? <Check className="text-success-text" /> : <Copy />}
            onClick={() => {
              navigator.clipboard.writeText(code).then(() => {
                setCopied(true);
                setTimeout(() => setCopied(false), 1500);
              });
            }}
          />
        </Tooltip>
      </div>
      <pre className="overflow-x-auto px-4 py-3 font-mono text-[13px] leading-relaxed text-foreground">
        <code>{code}</code>
      </pre>
    </Card>
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
          <Card key={it.title} className="p-5">
            <CardHeader className="p-0">
              <CardTitle className="text-base">{it.title}</CardTitle>
              <CardDescription>{it.body}</CardDescription>
            </CardHeader>
          </Card>
        ))}
      </div>
    </section>
  );
}

function FAQ() {
  const items = [
    {
      q: 'Can I use it without Tailwind in my consumer app?',
      a: 'Yes. The library ships a precompiled styles.css — your app does not need its own Tailwind setup. If you do have Tailwind, no conflict either.',
    },
    {
      q: 'Why Tailwind v4 specifically?',
      a: 'CSS-first config (tokens in @theme blocks), 3× faster builds, native CSS variable output that is easy to override in consumer apps, and automatic dark mode via class selector.',
    },
    {
      q: 'How big is the bundle?',
      a: 'ESM 142 KB / 33 KB gzipped, plus 8 KB / 2 KB gzipped CSS. Tree-shakeable — you only pay for what you import.',
    },
    {
      q: 'Does it work with Next.js / Remix / TanStack Start?',
      a: 'Yes. Pure React, no runtime side effects. For React Server Components, interactive primitives need a "use client" directive at the consuming file (standard for any Radix-based library).',
    },
    {
      q: 'How do I theme it for my brand?',
      a: 'Three ways: (1) override CSS variables globally in your app stylesheet, (2) wrap a subtree in <DesignSystemProvider tokens={...}> for per-section brands, (3) pass className for one-off tweaks.',
    },
    {
      q: 'Where do I report bugs?',
      a: 'GitHub Issues at craftzbay/design-system. PRs welcome too — CI runs typecheck, tests, and all 3 builds on every PR.',
    },
  ];

  return (
    <section className="mx-auto max-w-3xl px-6 pb-20">
      <SectionHeader
        eyebrow="FAQ"
        title="Common questions."
        subtitle="The same questions teams ask the first week they pick it up."
      />
      <Accordion type="single" collapsible>
        {items.map((it, i) => (
          <AccordionItem key={i} value={`item-${i}`}>
            <AccordionTrigger>{it.q}</AccordionTrigger>
            <AccordionContent>{it.a}</AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
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
            className="group flex flex-col gap-2 rounded-md border border-border bg-card p-5 text-left outline-none transition-colors hover:border-border-strong hover:bg-background-muted focus-visible:ring-2 focus-visible:ring-ring"
          >
            <div className="flex items-center justify-between">
              <Badge tone="neutral" variant="outline" className="text-[10px]">
                {p.group}
              </Badge>
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
          <a className="inline-flex items-center gap-1 hover:text-foreground" href="#catalog">
            Components
          </a>
          <a className="inline-flex items-center gap-1 hover:text-foreground" href="#docs">
            Docs
          </a>
        </nav>
      </div>
    </footer>
  );
}
