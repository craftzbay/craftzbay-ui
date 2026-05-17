import { useEffect, useMemo, useState } from 'react';
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  useCommandPaletteShortcut,
} from '@/components/ui/CommandPalette';
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
import { Button } from '@/components/ui/Button';
import { ErrorState } from '@/components/ui/ErrorState';
import { SettingsPage } from '@/components/patterns/Settings';
import { DataTablePage } from '@/components/patterns/DataTablePage';
import { RecordDetail } from '@/components/patterns/RecordDetail';
import { Onboarding } from '@/components/patterns/Onboarding';
import { Pricing } from '@/components/patterns/Pricing';
import { FirstRunEmpty } from '@/components/patterns/FirstRunEmpty';

import { isFullBleedRoute, parseHash, routeToHash, type Route } from './showcase/routing';
import { ShowcaseTopBar } from './showcase/layout/ShowcaseTopBar';
import { ShowcaseFooter } from './showcase/layout/ShowcaseFooter';
import { DocLayout } from './showcase/layout/DocLayout';
import {
  buildComponentSidebar,
  buildCrossKindSections,
  buildGuideSidebar,
  buildTemplateSidebar,
  docTopLinks,
} from './showcase/layout/sidebars';
import { HomePage } from './showcase/pages/HomePage';
import { ComponentsIndexPage } from './showcase/pages/ComponentsIndexPage';
import { ComponentDocPage } from './showcase/pages/ComponentDocPage';
import { TemplatesIndexPage } from './showcase/pages/TemplatesIndexPage';
import { TemplateDocPage } from './showcase/pages/TemplateDocPage';
import { GuidesIndexPage } from './showcase/pages/GuidesIndexPage';
import { GuidePage } from './showcase/pages/GuidePage';
import { getComponentDoc, componentDocs } from './showcase/registry/components';
import { getTemplateDoc, templateDocs } from './showcase/registry/templates';
import { getGuideDoc, guideDocs } from './showcase/registry/guides';

/* -----------------------------------------------------------------------------
 *  Root showcase shell.
 *
 *  Routing is hash-based and parsed by parseHash(). Render strategy:
 *    - Full-bleed routes (#preview/*) skip the showcase TopBar entirely.
 *    - All doc routes (#components/*, #templates/*, #guides/*) render in the
 *      DocLayout with the relevant sidebar + top links.
 *    - Home / index pages render with the TopBar but no DocLayout.
 * --------------------------------------------------------------------------- */

const Brand = () => (
  <span className="flex items-center gap-2 font-semibold">
    <span className="inline-flex size-6 items-center justify-center rounded-md bg-accent text-on-accent text-xs">
      ✦
    </span>
    @craftzbay/ui
  </span>
);

export function App() {
  const [route, setRoute] = useState<Route>(() =>
    typeof window === 'undefined' ? { kind: 'home' } : parseHash(window.location.hash),
  );

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
    const onHash = () => setRoute(parseHash(window.location.hash));
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, []);

  const [cmdOpen, setCmdOpen] = useState(false);
  useCommandPaletteShortcut(setCmdOpen);
  const toggleTheme = () => setTheme((t) => (t === 'light' ? 'dark' : 'light'));

  const fullBleed = isFullBleedRoute(route);

  return (
    <TooltipProvider>
      <ToastProvider>
        <div className="min-h-screen bg-background text-foreground">
          {!fullBleed && (
            <ShowcaseTopBar
              theme={theme}
              onToggleTheme={toggleTheme}
              onOpenPalette={() => setCmdOpen(true)}
              current={route}
            />
          )}

          <RouteView route={route} brand={<Brand />} />

          {route.kind !== 'preview' && <ShowcaseFooter />}

          <ShowcasePalette
            open={cmdOpen}
            onOpenChange={setCmdOpen}
            onToggleTheme={() => {
              toggleTheme();
              setCmdOpen(false);
            }}
          />

          <ToastViewport />
        </div>
      </ToastProvider>
    </TooltipProvider>
  );
}

function RouteView({ route, brand }: { route: Route; brand: React.ReactNode }) {
  switch (route.kind) {
    case 'home':
      return <HomePage />;

    case 'catalog':
      // Back-compat: redirect to the components index in the new URL space.
      if (typeof window !== 'undefined') {
        window.location.hash = routeToHash({ kind: 'components-index' });
      }
      return null;

    case 'components-index':
      return (
        <DocLayout
          sidebar={buildComponentSidebar()}
          topLinks={docTopLinks}
          current={{ kind: route.kind }}
          crossKindSections={buildCrossKindSections('component')}
        >
          <ComponentsIndexPage />
        </DocLayout>
      );

    case 'component': {
      const doc = getComponentDoc(route.slug);
      if (!doc) return <NotFound />;
      return (
        <DocLayout
          sidebar={buildComponentSidebar()}
          topLinks={docTopLinks}
          current={{ kind: 'component', slug: doc.slug }}
          crossKindSections={buildCrossKindSections('component')}
        >
          <ComponentDocPage doc={doc} />
        </DocLayout>
      );
    }

    case 'templates-index':
      return (
        <DocLayout
          sidebar={buildTemplateSidebar()}
          topLinks={docTopLinks}
          current={{ kind: route.kind }}
          crossKindSections={buildCrossKindSections('template')}
        >
          <TemplatesIndexPage />
        </DocLayout>
      );

    case 'template': {
      const doc = getTemplateDoc(route.slug);
      if (!doc) return <NotFound />;
      return (
        <DocLayout
          sidebar={buildTemplateSidebar()}
          topLinks={docTopLinks}
          current={{ kind: 'template', slug: doc.slug }}
          crossKindSections={buildCrossKindSections('template')}
        >
          <TemplateDocPage doc={doc} />
        </DocLayout>
      );
    }

    case 'guides-index':
      return (
        <DocLayout
          sidebar={buildGuideSidebar()}
          topLinks={docTopLinks}
          current={{ kind: route.kind }}
          crossKindSections={buildCrossKindSections('guide')}
        >
          <GuidesIndexPage />
        </DocLayout>
      );

    case 'guide': {
      const doc = getGuideDoc(route.slug);
      if (!doc) return <NotFound />;
      return (
        <DocLayout
          sidebar={buildGuideSidebar()}
          topLinks={docTopLinks}
          current={{ kind: 'guide', slug: doc.slug }}
          crossKindSections={buildCrossKindSections('guide')}
        >
          <GuidePage doc={doc} />
        </DocLayout>
      );
    }

    case 'preview':
      return <PreviewView slug={route.slug} brand={brand} />;
  }
}

function NotFound() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <ErrorState
        variant="404"
        title="Page not found"
        description="The doc page you are looking for does not exist."
        action={
          <Button asChild>
            <a href="#">Back to overview</a>
          </Button>
        }
      />
    </div>
  );
}

function PreviewView({ slug, brand }: { slug: string; brand: React.ReactNode }) {
  const doc = getTemplateDoc(slug);
  if (!doc) return <NotFound />;

  return (
    <>
      <div className="border-b border-border bg-background-subtle/70">
        <div className="mx-auto flex max-w-[1400px] items-center justify-between gap-3 px-4 py-2 text-xs md:px-6">
          <div className="flex items-center gap-2 text-foreground-muted">
            <span className="inline-flex size-1.5 rounded-full bg-accent" aria-hidden />
            <span>
              Live preview · <span className="font-medium text-foreground">{doc.name}</span>
            </span>
          </div>
          <a
            href={`#${routeToHash({ kind: 'template', slug })}`}
            className="inline-flex items-center gap-1 font-medium text-accent hover:underline"
          >
            Back to template docs ↗
          </a>
        </div>
      </div>
      <PreviewBody slug={slug} brand={brand} />
    </>
  );
}

function PreviewBody({ slug, brand }: { slug: string; brand: React.ReactNode }) {
  const noopSubmit = async () => {};
  switch (slug) {
    case 'auth-signin':
      return (
        <AuthLayout brand={brand} title="Sign in" subtitle="Welcome back. Sign in to continue.">
          <SignInForm onSubmit={noopSubmit} />
        </AuthLayout>
      );
    case 'auth-signup':
      return (
        <AuthLayout brand={brand} title="Create your account" subtitle="Start free, no credit card.">
          <SignUpForm onSubmit={noopSubmit} />
        </AuthLayout>
      );
    case 'auth-forgot':
      return (
        <AuthLayout brand={brand} title="Forgot password?" subtitle="We'll email you a reset link.">
          <ForgotPasswordForm onSubmit={noopSubmit} />
        </AuthLayout>
      );
    case 'auth-magic':
      return (
        <AuthLayout brand={brand} title="Check your inbox" subtitle="We sent a magic link to your email.">
          <MagicLinkSent email="you@company.com" />
        </AuthLayout>
      );
    case 'dashboard':
      return (
        <AppShell brand={brand} active="home">
          <Dashboard />
        </AppShell>
      );
    case 'settings':
      return <SettingsPage />;
    case 'data-table':
      return <DataTablePage />;
    case 'record':
      return <RecordDetail />;
    case 'onboarding':
      return <Onboarding />;
    case 'pricing':
      return <Pricing />;
    case 'first-run':
      return <FirstRunEmpty />;
    default:
      return <NotFound />;
  }
}

function ShowcasePalette({
  open,
  onOpenChange,
  onToggleTheme,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onToggleTheme: () => void;
}) {
  const componentItems = useMemo(
    () =>
      componentDocs.map((d) => ({
        value: `${d.name} ${d.group} ${d.slug}`,
        label: d.name,
        hint: d.group,
        href: routeToHash({ kind: 'component', slug: d.slug }),
      })),
    [],
  );
  const templateItems = useMemo(
    () =>
      templateDocs.map((d) => ({
        value: `${d.name} template ${d.slug}`,
        label: d.name,
        hint: 'Template',
        href: routeToHash({ kind: 'template', slug: d.slug }),
      })),
    [],
  );
  const guideItems = useMemo(
    () =>
      guideDocs.map((d) => ({
        value: `${d.title} guide ${d.slug}`,
        label: d.title,
        hint: 'Guide',
        href: routeToHash({ kind: 'guide', slug: d.slug }),
      })),
    [],
  );

  return (
    <CommandDialog open={open} onOpenChange={onOpenChange}>
      <CommandInput placeholder="Jump to component, template, or guide…" />
      <CommandList>
        <CommandEmpty>No results.</CommandEmpty>
        <CommandGroup heading="Components">
          {componentItems.map((it) => (
            <CommandItem
              key={it.href}
              value={it.value}
              onSelect={() => {
                window.location.hash = it.href;
                onOpenChange(false);
              }}
            >
              <span>{it.label}</span>
              <span className="ml-auto text-xs text-foreground-subtle">{it.hint}</span>
            </CommandItem>
          ))}
        </CommandGroup>
        <CommandGroup heading="Templates">
          {templateItems.map((it) => (
            <CommandItem
              key={it.href}
              value={it.value}
              onSelect={() => {
                window.location.hash = it.href;
                onOpenChange(false);
              }}
            >
              <span>{it.label}</span>
              <span className="ml-auto text-xs text-foreground-subtle">{it.hint}</span>
            </CommandItem>
          ))}
        </CommandGroup>
        <CommandGroup heading="Guides">
          {guideItems.map((it) => (
            <CommandItem
              key={it.href}
              value={it.value}
              onSelect={() => {
                window.location.hash = it.href;
                onOpenChange(false);
              }}
            >
              <span>{it.label}</span>
              <span className="ml-auto text-xs text-foreground-subtle">{it.hint}</span>
            </CommandItem>
          ))}
        </CommandGroup>
        <CommandGroup heading="Actions">
          <CommandItem value="toggle theme dark light" onSelect={onToggleTheme}>
            Toggle theme
          </CommandItem>
          <CommandItem
            value="github source"
            onSelect={() => {
              window.open('https://github.com/craftzbay/design-system', '_blank', 'noopener,noreferrer');
              onOpenChange(false);
            }}
          >
            Open GitHub ↗
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}
