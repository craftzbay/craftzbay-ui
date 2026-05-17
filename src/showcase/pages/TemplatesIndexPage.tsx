import { useMemo, useState } from 'react';
import { ArrowRight, X } from '@/icons';
import { templateDocs } from '../registry/templates';
import { routeToHash } from '../routing';

export function TemplatesIndexPage() {
  const allUseCases = useMemo(() => {
    const set = new Set<string>();
    for (const t of templateDocs) {
      for (const u of t.useCases ?? []) set.add(u);
    }
    return Array.from(set).sort();
  }, []);

  const [active, setActive] = useState<Set<string>>(new Set());

  const filtered = useMemo(() => {
    if (active.size === 0) return templateDocs;
    return templateDocs.filter((t) =>
      (t.useCases ?? []).some((u) => active.has(u)),
    );
  }, [active]);

  const toggle = (u: string) =>
    setActive((prev) => {
      const next = new Set(prev);
      if (next.has(u)) next.delete(u);
      else next.add(u);
      return next;
    });

  return (
    <div>
      <header className="mb-10 border-b border-border pb-6">
        <p className="text-xs font-medium uppercase tracking-wider text-accent">Templates</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight">Page templates</h1>
        <p className="mt-3 max-w-2xl text-base leading-relaxed text-foreground-muted">
          Ready-made layouts composed from primitives. Each one ships with a docs page
          (API + usage) and a full-bleed live preview. Drop in, wire your data, ship.
        </p>
      </header>

      {allUseCases.length > 0 && (
        <div className="mb-6">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-xs uppercase tracking-wider text-foreground-subtle">
              Filter by use case
            </span>
            {active.size > 0 && (
              <button
                type="button"
                onClick={() => setActive(new Set())}
                className="inline-flex items-center gap-1 text-xs text-foreground-muted hover:text-foreground"
              >
                <X className="size-3" />
                Clear
              </button>
            )}
          </div>
          <div className="flex flex-wrap gap-1.5">
            {allUseCases.map((u) => {
              const on = active.has(u);
              return (
                <button
                  key={u}
                  type="button"
                  onClick={() => toggle(u)}
                  aria-pressed={on}
                  className={`rounded-full border px-2.5 py-1 text-xs transition-colors ${
                    on
                      ? 'border-accent bg-accent-soft text-on-accent-soft'
                      : 'border-border bg-background text-foreground-muted hover:border-border-strong hover:text-foreground'
                  }`}
                >
                  {u}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {filtered.length === 0 ? (
        <p className="rounded-md border border-dashed border-border bg-background-subtle p-6 text-center text-sm text-foreground-muted">
          No templates match the selected use cases.
        </p>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {filtered.map((doc) => (
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
                      className={`rounded-full border px-2 py-0.5 text-[11px] ${
                        active.has(u)
                          ? 'border-accent bg-accent-soft text-on-accent-soft'
                          : 'border-border bg-background text-foreground-subtle'
                      }`}
                    >
                      {u}
                    </span>
                  ))}
                </div>
              )}
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
