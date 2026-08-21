import { ArrowRight } from '@/icons';
import { guideDocs } from '../registry/guides';
import { routeToHash } from '../routing';

export function GuidesIndexPage() {
  return (
    <div>
      <header className="border-border mb-10 border-b pb-6">
        <p className="text-accent text-xs font-medium tracking-wider uppercase">Guides</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight">Guides</h1>
        <p className="text-foreground-muted mt-3 max-w-2xl text-base leading-relaxed">
          Hands-on guides for installing, theming, integrating forms, dark mode, and responsive
          design.
        </p>
      </header>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {guideDocs.map((doc) => (
          <a
            key={doc.slug}
            href={`#${routeToHash({ kind: 'guide', slug: doc.slug })}`}
            className="group border-border bg-card hover:border-accent flex flex-col gap-1.5 rounded-md border p-5 transition-colors"
          >
            <div className="flex items-center justify-between">
              <div className="text-foreground text-sm font-medium">{doc.title}</div>
              <ArrowRight
                className="text-foreground-subtle group-hover:text-accent size-4 transition-transform group-hover:translate-x-0.5"
                aria-hidden
              />
            </div>
            <div className="text-foreground-muted text-xs leading-relaxed">{doc.description}</div>
          </a>
        ))}
      </div>
    </div>
  );
}
