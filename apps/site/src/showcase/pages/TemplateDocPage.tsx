import { ExternalLink } from '@/icons';
import type { TemplateDoc } from '../registry/templates';
import { CodeBlock } from '../widgets/CodeBlock';
import { SectionAnchor } from '../widgets/SectionAnchor';
import { previewUrl } from '../routing';
import { SRC_BLOCKS } from '../site.config';

interface TemplateDocPageProps {
  doc: TemplateDoc;
}

/**
 * A "block" page: a complete example composed from @craftzbay/ui primitives.
 * It is not an importable component — the deliverable is the source below,
 * which you copy into your app and adapt. The live preview opens in its own
 * tab (try the brand + theme switchers there).
 */
export function TemplateDocPage({ doc }: TemplateDocPageProps) {
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
      <div className="overflow-hidden rounded-lg border border-border bg-background">
        <div className="max-h-[480px] overflow-auto">{doc.render()}</div>
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
        A complete page built only from <code className="rounded bg-background-muted px-1 py-0.5 font-mono text-xs">@craftzbay/ui</code>{' '}
        primitives. Copy it into your project (e.g. <code className="rounded bg-background-muted px-1 py-0.5 font-mono text-xs">{doc.sourceFile}</code>),
        then wire your own data and handlers.
      </p>
      <CodeBlock code={doc.source} />
    </article>
  );
}
