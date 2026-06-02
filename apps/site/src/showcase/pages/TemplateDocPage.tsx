import { ExternalLink } from '@/icons';
import type { TemplateDoc } from '../registry/types';
import { CodeBlock } from '../widgets/CodeBlock';
import { CodePreview } from '../widgets/CodePreview';
import { PropsTable } from '../widgets/PropsTable';
import { SectionAnchor } from '../widgets/SectionAnchor';
import { previewUrl } from '../routing';
import { SRC_PATTERNS } from '../site.config';

interface TemplateDocPageProps {
  doc: TemplateDoc;
}

export function TemplateDocPage({ doc }: TemplateDocPageProps) {
  const importLine = `import { ${doc.exports.join(', ')} } from '@craftzbay/ui';`;

  return (
    <article className="max-w-3xl">
      <header className="mb-10 border-b border-border pb-6">
        <p className="text-xs font-medium uppercase tracking-wider text-accent">Template</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight">{doc.name}</h1>
        <p className="mt-3 text-base leading-relaxed text-foreground-muted">{doc.description}</p>
        <div className="mt-4 flex flex-wrap items-center gap-4">
          {doc.previewSlug && (
            <a
              href={previewUrl(doc.previewSlug)}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 rounded-md bg-accent px-3 py-1.5 text-xs font-medium text-on-accent hover:opacity-90"
            >
              Open live preview <ExternalLink className="size-3" aria-hidden />
            </a>
          )}
          <a
            href={`${SRC_PATTERNS}/${doc.sourceFile}`}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1 text-xs text-foreground-muted hover:text-accent"
          >
            View source <ExternalLink className="size-3" aria-hidden />
          </a>
        </div>
      </header>

      {doc.useCases && doc.useCases.length > 0 && (
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

      <SectionAnchor id="import">Import</SectionAnchor>
      <CodeBlock code={importLine} />

      {doc.examples.length > 0 && (
        <>
          <SectionAnchor id="examples">Examples</SectionAnchor>
          <div className="space-y-10">
            {doc.examples.map((ex, i) => (
              <section key={i}>
                <SectionAnchor id={`tpl-ex-${i}`} level={3}>
                  {ex.title}
                </SectionAnchor>
                {ex.description && (
                  <p className="mb-4 text-sm leading-relaxed text-foreground-muted">{ex.description}</p>
                )}
                <CodePreview preview={ex.preview} code={ex.code} surfaceClassName={ex.surfaceClassName} />
              </section>
            ))}
          </div>
        </>
      )}

      {doc.api && doc.api.length > 0 && (
        <>
          <SectionAnchor id="api">API reference</SectionAnchor>
          <PropsTable groups={doc.api} />
        </>
      )}
    </article>
  );
}
