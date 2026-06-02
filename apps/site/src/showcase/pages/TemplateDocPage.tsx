import { lazy, Suspense, useEffect, useState } from 'react';
import { ExternalLink } from '@/icons';
import { Spinner } from '@/components/ui/Spinner';
import type { TemplateDoc } from '../registry/templates';
import { CodeBlock } from '../widgets/CodeBlock';
import { SectionAnchor } from '../widgets/SectionAnchor';
import { previewUrl } from '../routing';
import { SRC_BLOCKS } from '../site.config';

const BlockPreview = lazy(() => import('../blocks/Preview'));

interface TemplateDocPageProps {
  doc: TemplateDoc;
}

/**
 * A "block" page: a complete example composed from @craftzbay/ui primitives.
 * It is not an importable component — the deliverable is the source below,
 * which you copy into your app and adapt. The preview component and the source
 * text both load lazily, so they never weigh down the rest of the site.
 */
export function TemplateDocPage({ doc }: TemplateDocPageProps) {
  const [source, setSource] = useState<string | null>(null);
  const [screen, setScreen] = useState(doc.screens[0]?.key ?? 'home');

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

  return (
    <article className="max-w-4xl">
      <header className="mb-8 border-b border-border pb-6">
        <p className="text-xs font-medium uppercase tracking-wider text-accent">Block</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight">{doc.name}</h1>
        <p className="mt-3 text-base leading-relaxed text-foreground-muted">{doc.description}</p>
        <div className="mt-4 flex flex-wrap items-center gap-4">
          <a
            href={previewUrl(doc.slug)}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1 rounded-md bg-accent px-3 py-1.5 text-xs font-medium text-on-accent hover:opacity-90"
          >
            Open live preview <ExternalLink className="size-3" aria-hidden />
          </a>
          <a
            href={`${SRC_BLOCKS}/${doc.sourceFile}`}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1 text-xs text-foreground-muted hover:text-accent"
          >
            View on GitHub <ExternalLink className="size-3" aria-hidden />
          </a>
        </div>
      </header>

      {doc.useCases.length > 0 && (
        <>
          <SectionAnchor id="use-cases">Use cases</SectionAnchor>
          <ul className="space-y-1.5 text-sm text-foreground-muted">
            {doc.useCases.map((u, i) => (
              <li key={i} className="flex gap-2">
                <span aria-hidden className="mt-2 size-1 shrink-0 rounded-full bg-accent" />
                <span>{u}</span>
              </li>
            ))}
          </ul>
        </>
      )}

      <SectionAnchor id="preview">Preview</SectionAnchor>
      {doc.screens.length > 1 && (
        <div className="mb-3 flex flex-wrap gap-1.5">
          {doc.screens.map((s) => (
            <button
              key={s.key}
              type="button"
              onClick={() => setScreen(s.key)}
              aria-pressed={s.key === screen}
              className={`rounded-full border px-2.5 py-1 text-xs transition-colors ${
                s.key === screen
                  ? 'border-accent bg-accent-soft text-on-accent-soft'
                  : 'border-border text-foreground-muted hover:border-border-strong hover:text-foreground'
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>
      )}
      <div className="overflow-hidden rounded-lg border border-border bg-background">
        <div className="embedded-preview h-[540px] overflow-auto">
          <Suspense
            fallback={
              <div className="flex h-48 items-center justify-center">
                <Spinner />
              </div>
            }
          >
            <BlockPreview slug={doc.slug} screen={screen} setScreen={setScreen} />
          </Suspense>
        </div>
      </div>
      <p className="mt-2 text-xs text-foreground-subtle">
        Interactive. For the full-screen version,{' '}
        <a
          href={previewUrl(doc.slug)}
          target="_blank"
          rel="noreferrer"
          className="text-accent hover:underline"
        >
          open it in a new tab ↗
        </a>
        .
      </p>

      <SectionAnchor id="source">Source</SectionAnchor>
      <p className="mb-4 text-sm leading-relaxed text-foreground-muted">
        The template's entry file (
        <code className="rounded bg-background-muted px-1 py-0.5 font-mono text-xs">{doc.sourceFile}</code>),
        composed from <code className="rounded bg-background-muted px-1 py-0.5 font-mono text-xs">@craftzbay/ui</code>{' '}
        primitives. Copy it — plus the building blocks it imports — and wire your own data and handlers.
      </p>
      {source === null ? (
        <div className="flex h-24 items-center justify-center rounded-md border border-border">
          <Spinner />
        </div>
      ) : (
        <CodeBlock code={source} />
      )}
    </article>
  );
}
