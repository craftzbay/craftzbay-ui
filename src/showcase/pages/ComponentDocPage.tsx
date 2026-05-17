import { ExternalLink } from '@/icons';
import type { ComponentDoc } from '../registry/types';
import { getRelatedDocs } from '../registry/components';
import { CodeBlock } from '../widgets/CodeBlock';
import { CodePreview } from '../widgets/CodePreview';
import { PropsTable } from '../widgets/PropsTable';
import { SectionAnchor } from '../widgets/SectionAnchor';
import { routeToHash } from '../routing';

const GITHUB_BLOB = 'https://github.com/craftzbay/design-system/blob/main/src/components/ui';

interface ComponentDocPageProps {
  doc: ComponentDoc;
}

export function ComponentDocPage({ doc }: ComponentDocPageProps) {
  const related = doc.related ? getRelatedDocs(doc.related.map((r) => r.slug)) : [];

  const importLine = `import { ${doc.exports.join(', ')} } from '@craftzbay/ui';`;

  return (
    <article className="max-w-3xl">
      <header className="mb-10 border-b border-border pb-6">
        <p className="text-xs font-medium uppercase tracking-wider text-accent">
          {doc.group}
        </p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight">{doc.name}</h1>
        <p className="mt-3 text-base leading-relaxed text-foreground-muted">
          {doc.description}
        </p>
        <a
          href={`${GITHUB_BLOB}/${doc.sourceFile}`}
          target="_blank"
          rel="noreferrer"
          className="mt-4 inline-flex items-center gap-1 text-xs text-foreground-muted hover:text-accent"
        >
          View source <ExternalLink className="size-3" aria-hidden />
        </a>
      </header>

      <SectionAnchor id="import">Import</SectionAnchor>
      <CodeBlock code={importLine} />

      {doc.examples.length > 0 && (
        <>
          <SectionAnchor id="examples">Examples</SectionAnchor>
          <div className="space-y-10">
            {doc.examples.map((ex, i) => {
              const exId = `ex-${slugify(ex.title)}-${i}`;
              return (
                <section key={exId}>
                  <SectionAnchor id={exId} level={3}>
                    {ex.title}
                  </SectionAnchor>
                  {ex.description && (
                    <p className="mb-4 text-sm leading-relaxed text-foreground-muted">
                      {ex.description}
                    </p>
                  )}
                  <CodePreview
                    preview={ex.preview}
                    code={ex.code}
                    surfaceClassName={ex.surfaceClassName}
                  />
                </section>
              );
            })}
          </div>
        </>
      )}

      {doc.api && doc.api.length > 0 && (
        <>
          <SectionAnchor id="api">API reference</SectionAnchor>
          <PropsTable groups={doc.api} />
        </>
      )}

      {doc.accessibility && doc.accessibility.length > 0 && (
        <>
          <SectionAnchor id="accessibility">Accessibility</SectionAnchor>
          <ul className="space-y-1.5 text-sm text-foreground-muted">
            {doc.accessibility.map((line, i) => (
              <li key={i} className="flex gap-2">
                <span aria-hidden className="mt-2 size-1 shrink-0 rounded-full bg-accent" />
                <span className="leading-relaxed">{line}</span>
              </li>
            ))}
          </ul>
        </>
      )}

      {related.length > 0 && (
        <>
          <SectionAnchor id="related">Related</SectionAnchor>
          <div className="grid gap-3 sm:grid-cols-2">
            {related.map((rel) => {
              const reason = doc.related?.find((r) => r.slug === rel.slug)?.reason;
              return (
                <a
                  key={rel.slug}
                  href={`#${routeToHash({ kind: 'component', slug: rel.slug })}`}
                  className="block rounded-md border border-border bg-card p-4 transition-colors hover:border-accent"
                >
                  <div className="text-sm font-medium text-foreground">{rel.name}</div>
                  {reason && (
                    <div className="mt-1 text-xs text-foreground-muted">{reason}</div>
                  )}
                </a>
              );
            })}
          </div>
        </>
      )}
    </article>
  );
}

function slugify(s: string): string {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}
