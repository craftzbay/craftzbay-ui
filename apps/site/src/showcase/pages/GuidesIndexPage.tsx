import { ArrowRight } from '@/icons';
import { guideDocs } from '../registry/guides';
import { routeToHash } from '../routing';

export function GuidesIndexPage() {
  return (
    <div>
      <header className="mb-10 border-b border-border pb-6">
        <p className="text-xs font-medium uppercase tracking-wider text-accent">Guides</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight">Guides</h1>
        <p className="mt-3 max-w-2xl text-base leading-relaxed text-foreground-muted">
          Hands-on guides for installing, theming, integrating forms, dark mode, and responsive design.
        </p>
      </header>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {guideDocs.map((doc) => (
          <a
            key={doc.slug}
            href={`#${routeToHash({ kind: 'guide', slug: doc.slug })}`}
            className="group flex flex-col gap-1.5 rounded-md border border-border bg-card p-5 transition-colors hover:border-accent"
          >
            <div className="flex items-center justify-between">
              <div className="text-sm font-medium text-foreground">{doc.title}</div>
              <ArrowRight
                className="size-4 text-foreground-subtle transition-transform group-hover:translate-x-0.5 group-hover:text-accent"
                aria-hidden
              />
            </div>
            <div className="text-xs leading-relaxed text-foreground-muted">{doc.description}</div>
          </a>
        ))}
      </div>
    </div>
  );
}
