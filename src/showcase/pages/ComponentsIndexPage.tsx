import { componentDocs } from '../registry/components';
import { routeToHash } from '../routing';

export function ComponentsIndexPage() {
  const groups = Array.from(new Set(componentDocs.map((d) => d.group)));

  return (
    <div>
      <header className="mb-10 border-b border-border pb-6">
        <p className="text-xs font-medium uppercase tracking-wider text-accent">
          Reference
        </p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight">Components</h1>
        <p className="mt-3 max-w-2xl text-base leading-relaxed text-foreground-muted">
          {componentDocs.length} accessible primitives grouped by intent. Pick one to see
          examples, props, and accessibility notes.
        </p>
      </header>

      {groups.map((group) => {
        const items = componentDocs.filter((d) => d.group === group);
        return (
          <section key={group} className="mb-12">
            <div className="mb-4 flex items-baseline justify-between">
              <h2 className="text-lg font-semibold tracking-tight">{group}</h2>
              <span className="text-xs text-foreground-subtle">{items.length}</span>
            </div>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {items.map((doc) => (
                <a
                  key={doc.slug}
                  href={`#${routeToHash({ kind: 'component', slug: doc.slug })}`}
                  className="flex flex-col gap-1.5 rounded-md border border-border bg-card p-4 transition-colors hover:border-accent"
                >
                  <div className="text-sm font-medium text-foreground">{doc.name}</div>
                  <div className="text-xs leading-relaxed text-foreground-muted">
                    {doc.description}
                  </div>
                </a>
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}
