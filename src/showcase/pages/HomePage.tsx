import { ArrowRight, Package, Sparkles } from '@/icons';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { componentDocs } from '../registry/components';
import { templateDocs } from '../registry/templates';
import { guideDocs } from '../registry/guides';
import { routeToHash } from '../routing';

const VERSION = '0.7.0'; // bumped in lockstep with package.json via changeset

export function HomePage() {
  return (
    <div className="mx-auto max-w-6xl px-6 py-16 lg:py-24">
      {/* Hero */}
      <div className="max-w-3xl">
        <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-xs text-foreground-muted">
          <Sparkles className="size-3 text-accent" aria-hidden />
          Refined-minimal · Tailwind v4 · React 18
        </div>
        <h1 className="text-4xl font-semibold leading-tight tracking-tight sm:text-5xl">
          A design system you can actually <span className="text-accent">use today</span>.
        </h1>
        <p className="mt-4 text-lg leading-relaxed text-foreground-muted">
          {componentDocs.length} accessible primitives, {templateDocs.length} page templates, {guideDocs.length} guides. All
          dark-mode-ready, all keyboard-accessible, all on a single Tailwind v4 token system.
        </p>
        <div className="mt-8 flex flex-wrap items-center gap-3">
          <Button asChild>
            <a href={`#${routeToHash({ kind: 'components-index' })}`}>
              Browse components <ArrowRight className="ml-1 size-4" aria-hidden />
            </a>
          </Button>
          <Button variant="outline" asChild>
            <a href={`#${routeToHash({ kind: 'templates-index' })}`}>Browse templates</a>
          </Button>
          <Button variant="ghost" asChild>
            <a href={`#${routeToHash({ kind: 'guide', slug: 'quickstart' })}`}>Quick start</a>
          </Button>
        </div>

        <div className="mt-6 flex flex-wrap items-center gap-2 text-xs text-foreground-muted">
          <a
            href="https://github.com/craftzbay/design-system/blob/main/CHANGELOG.md"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1 hover:text-accent"
            aria-label="View release notes"
          >
            <Badge variant="outline" tone="neutral">v{VERSION}</Badge>
            <span className="text-[10px] text-foreground-subtle">release notes ↗</span>
          </a>
          <span>·</span>
          <code className="rounded bg-background-muted px-1.5 py-0.5 font-mono">pnpm add @craftzbay/ui</code>
        </div>
      </div>

      {/* Stat cards */}
      <div className="mt-16 grid grid-cols-1 gap-3 sm:grid-cols-3">
        {[
          { label: 'Components', value: componentDocs.length, href: routeToHash({ kind: 'components-index' }) },
          { label: 'Templates', value: templateDocs.length, href: routeToHash({ kind: 'templates-index' }) },
          { label: 'Guides', value: guideDocs.length, href: routeToHash({ kind: 'guides-index' }) },
        ].map((s) => (
          <a
            key={s.label}
            href={`#${s.href}`}
            className="group flex items-baseline justify-between rounded-md border border-border bg-card p-5 transition-colors hover:border-accent"
          >
            <div>
              <div className="text-xs uppercase tracking-wider text-foreground-subtle">{s.label}</div>
              <div className="mt-1 text-3xl font-semibold tracking-tight">{s.value}</div>
            </div>
            <ArrowRight
              className="size-4 text-foreground-subtle transition-transform group-hover:translate-x-0.5 group-hover:text-accent"
              aria-hidden
            />
          </a>
        ))}
      </div>

      {/* Highlighted templates */}
      <section className="mt-20">
        <div className="mb-6 flex items-baseline justify-between">
          <h2 className="text-2xl font-semibold tracking-tight">Templates</h2>
          <a
            href={`#${routeToHash({ kind: 'templates-index' })}`}
            className="text-sm text-foreground-muted hover:text-accent"
          >
            View all →
          </a>
        </div>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {templateDocs.slice(0, 6).map((t) => (
            <a
              key={t.slug}
              href={`#${routeToHash({ kind: 'template', slug: t.slug })}`}
              className="group flex flex-col gap-1.5 rounded-md border border-border bg-card p-4 transition-colors hover:border-accent"
            >
              <div className="text-sm font-medium text-foreground">{t.name}</div>
              <div className="text-xs leading-relaxed text-foreground-muted">{t.description}</div>
            </a>
          ))}
        </div>
      </section>

      {/* Featured components */}
      <section className="mt-16">
        <div className="mb-6 flex items-baseline justify-between">
          <h2 className="text-2xl font-semibold tracking-tight">Featured components</h2>
          <a
            href={`#${routeToHash({ kind: 'components-index' })}`}
            className="text-sm text-foreground-muted hover:text-accent"
          >
            View all →
          </a>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {['button', 'input', 'dialog', 'data-grid', 'card', 'toast', 'command-palette', 'date-picker']
            .map((slug) => componentDocs.find((d) => d.slug === slug))
            .filter((d): d is NonNullable<typeof d> => Boolean(d))
            .map((d) => (
              <a
                key={d.slug}
                href={`#${routeToHash({ kind: 'component', slug: d.slug })}`}
                className="group flex flex-col gap-1.5 rounded-md border border-border bg-card p-4 transition-colors hover:border-accent"
              >
                <div className="text-sm font-medium text-foreground">{d.name}</div>
                <div className="text-[11px] uppercase tracking-wide text-foreground-subtle">{d.group}</div>
              </a>
            ))}
        </div>
      </section>

      {/* Install strip */}
      <section className="mt-20 rounded-lg border border-border bg-card p-8">
        <div className="flex flex-col items-start gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-2 text-sm font-medium">
              <Package className="size-4 text-accent" aria-hidden />
              Install in seconds
            </div>
            <pre className="mt-3 overflow-x-auto rounded-md bg-background-muted px-4 py-3 font-mono text-sm">
              <code>pnpm add @craftzbay/ui</code>
            </pre>
          </div>
          <Button asChild>
            <a href={`#${routeToHash({ kind: 'guide', slug: 'quickstart' })}`}>
              Read the Quick start <ArrowRight className="ml-1 size-4" aria-hidden />
            </a>
          </Button>
        </div>
      </section>
    </div>
  );
}
