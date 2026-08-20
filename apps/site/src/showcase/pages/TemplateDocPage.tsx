import { useEffect, useState } from 'react';
import { ExternalLink } from '@/icons';
import { Spinner } from '@/components/ui/Spinner';
import { cn } from '@/lib/utils';
import type { TemplateDoc } from '../registry/templates';
import { CodeBlock } from '../widgets/CodeBlock';
import { SectionAnchor } from '../widgets/SectionAnchor';
import { previewUrl } from '../routing';
import { SRC_BLOCKS } from '../site.config';

interface TemplateDocPageProps {
  doc: TemplateDoc;
}

/** Preview frame widths — the checklist's 375 / 768 / desktop breakpoints. */
const WIDTHS = [
  { key: 'mobile', label: 'Mobile', hint: '375px', width: 375 },
  { key: 'tablet', label: 'Tablet', hint: '768px', width: 768 },
  { key: 'desktop', label: 'Desktop', hint: 'Fill', width: null },
] as const;
type WidthKey = (typeof WIDTHS)[number]['key'];

const pillClass = (active: boolean) =>
  cn(
    'rounded-full border px-2.5 py-1 text-xs outline-none transition-colors',
    'focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background',
    active
      ? 'border-accent bg-accent-soft text-on-accent-soft'
      : 'border-border text-foreground-muted hover:border-border-strong hover:text-foreground',
  );

/**
 * A "block" page: a complete example composed from @craftzbay/ui primitives.
 * It is not an importable component — the deliverable is the source below,
 * which you copy into your app and adapt. The preview is the real
 * `#preview/<slug>` route in an iframe, so the width toggle exercises the
 * template's actual breakpoints; the source text loads lazily.
 */
export function TemplateDocPage({ doc }: TemplateDocPageProps) {
  const [source, setSource] = useState<string | null>(null);
  const [screen, setScreen] = useState(doc.screens[0]?.key ?? 'home');
  const [width, setWidth] = useState<WidthKey>('desktop');

  useEffect(() => {
    setScreen(doc.screens[0]?.key ?? 'home');
    let alive = true;
    setSource(null);
    import('../blocks/sources').then((m) => {
      if (alive) setSource(m.blockSources[doc.slug] ?? '');
    });
    return () => {
      alive = false;
    };
  }, [doc.slug, doc.screens]);

  const frameWidth = WIDTHS.find((w) => w.key === width)?.width ?? null;
  const src = previewUrl(doc.slug, screen);

  return (
    <article className="max-w-4xl">
      <header className="border-border mb-8 border-b pb-6">
        <p className="text-accent text-xs font-medium tracking-wider uppercase">Block</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight">{doc.name}</h1>
        <p className="text-foreground-muted mt-3 text-base leading-relaxed">{doc.description}</p>
        <div className="mt-4 flex flex-wrap items-center gap-4">
          <a
            href={previewUrl(doc.slug)}
            target="_blank"
            rel="noreferrer"
            className="bg-accent text-on-accent focus-visible:ring-ring focus-visible:ring-offset-background inline-flex items-center gap-1 rounded-md px-3 py-1.5 text-xs font-medium outline-none hover:opacity-90 focus-visible:ring-2 focus-visible:ring-offset-2"
          >
            Open live preview <ExternalLink className="size-3" aria-hidden />
          </a>
          <a
            href={`${SRC_BLOCKS}/${doc.sourceFile}`}
            target="_blank"
            rel="noreferrer"
            className="text-foreground-muted hover:text-accent focus-visible:ring-ring focus-visible:ring-offset-background inline-flex items-center gap-1 rounded-sm text-xs outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
          >
            View on GitHub <ExternalLink className="size-3" aria-hidden />
          </a>
        </div>
      </header>

      {doc.useCases.length > 0 && (
        <>
          <SectionAnchor id="use-cases">Use cases</SectionAnchor>
          <ul className="text-foreground-muted space-y-1.5 text-sm">
            {doc.useCases.map((u, i) => (
              <li key={i} className="flex gap-2">
                <span aria-hidden className="bg-accent mt-2 size-1 shrink-0 rounded-full" />
                <span>{u}</span>
              </li>
            ))}
          </ul>
        </>
      )}

      {doc.patterns && doc.patterns.length > 0 && (
        <>
          <SectionAnchor id="patterns">Patterns demonstrated</SectionAnchor>
          <p className="text-foreground-muted mb-3 text-sm leading-relaxed">
            What to look for in the preview. Section names refer to the design-research guides.
          </p>
          <ul className="text-foreground-muted space-y-1.5 text-sm">
            {doc.patterns.map((p, i) => (
              <li key={i} className="flex gap-2">
                <span aria-hidden className="bg-accent mt-2 size-1 shrink-0 rounded-full" />
                <span className="leading-relaxed">{p}</span>
              </li>
            ))}
          </ul>
        </>
      )}

      <SectionAnchor id="preview">Preview</SectionAnchor>
      <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
        {doc.screens.length > 1 ? (
          <div className="flex flex-wrap gap-1.5" role="group" aria-label="Screen">
            {doc.screens.map((s) => (
              <button
                key={s.key}
                type="button"
                onClick={() => setScreen(s.key)}
                aria-pressed={s.key === screen}
                className={pillClass(s.key === screen)}
              >
                {s.label}
              </button>
            ))}
          </div>
        ) : (
          <span />
        )}
        <div className="flex flex-wrap gap-1.5" role="group" aria-label="Preview width">
          {WIDTHS.map((w) => (
            <button
              key={w.key}
              type="button"
              onClick={() => setWidth(w.key)}
              aria-pressed={w.key === width}
              className={pillClass(w.key === width)}
              title={w.hint}
            >
              {w.label}
            </button>
          ))}
        </div>
      </div>
      <div className="border-border bg-background-subtle overflow-x-auto rounded-lg border p-0">
        <iframe
          // Remount on screen change so the template opens at that screen.
          key={`${doc.slug}/${screen}`}
          src={src}
          title={`${doc.name} preview`}
          loading="lazy"
          style={{ width: frameWidth ?? '100%' }}
          className={cn(
            'bg-background block h-[640px] max-w-full transition-[width] duration-[var(--duration-base)]',
            frameWidth && 'border-border mx-auto border-x',
          )}
        />
      </div>
      <p className="text-foreground-subtle mt-2 text-xs">
        Interactive. For the full-screen version,{' '}
        <a
          href={previewUrl(doc.slug, screen)}
          target="_blank"
          rel="noreferrer"
          className="text-accent focus-visible:ring-ring rounded-sm outline-none hover:underline focus-visible:ring-2"
        >
          open it in a new tab ↗
        </a>
        .
      </p>

      <SectionAnchor id="source">Source</SectionAnchor>
      <p className="text-foreground-muted mb-4 text-sm leading-relaxed">
        The template's entry file (
        <code className="bg-background-muted rounded px-1 py-0.5 font-mono text-xs">
          {doc.sourceFile}
        </code>
        ), composed from{' '}
        <code className="bg-background-muted rounded px-1 py-0.5 font-mono text-xs">
          @craftzbay/ui
        </code>{' '}
        primitives. Copy it — plus the building blocks it imports — and wire your own data and
        handlers.
      </p>
      {source === null ? (
        <div className="border-border flex h-24 items-center justify-center rounded-md border">
          <Spinner />
        </div>
      ) : (
        <CodeBlock code={source} />
      )}
    </article>
  );
}
