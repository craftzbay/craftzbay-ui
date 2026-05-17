import { ArrowRight } from '@/icons';
import { templateDocs } from '../registry/templates';
import { routeToHash } from '../routing';

export function TemplatesIndexPage() {
  return (
    <div>
      <header className="mb-10 border-b border-border pb-6">
        <p className="text-xs font-medium uppercase tracking-wider text-accent">Templates</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight">Page templates</h1>
        <p className="mt-3 max-w-2xl text-base leading-relaxed text-foreground-muted">
          Ready-made layouts composed from primitives. Each one ships with a docs page (API + usage)
          and a full-bleed live preview. Drop in, wire your data, ship.
        </p>
      </header>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {templateDocs.map((doc) => (
          <a
            key={doc.slug}
            href={`#${routeToHash({ kind: 'template', slug: doc.slug })}`}
            className="group flex flex-col gap-2 rounded-md border border-border bg-card p-5 transition-colors hover:border-accent"
          >
            <div className="flex items-center justify-between">
              <div className="text-base font-medium text-foreground">{doc.name}</div>
              <ArrowRight
                className="size-4 text-foreground-subtle transition-transform group-hover:translate-x-0.5 group-hover:text-accent"
                aria-hidden
              />
            </div>
            <div className="text-sm leading-relaxed text-foreground-muted">{doc.description}</div>
            {doc.useCases && doc.useCases.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-1.5">
                {doc.useCases.map((u, i) => (
                  <span
                    key={i}
                    className="rounded-full border border-border bg-background px-2 py-0.5 text-[11px] text-foreground-subtle"
                  >
                    {u}
                  </span>
                ))}
              </div>
            )}
          </a>
        ))}
      </div>
    </div>
  );
}
