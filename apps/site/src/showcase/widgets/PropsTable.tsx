import type { PropGroup } from '../registry/types';

interface PropsTableProps {
  groups: PropGroup[];
}

/**
 * Renders one or more prop-reference tables. Types are shown as inline
 * `code` so long unions wrap cleanly.
 */
export function PropsTable({ groups }: PropsTableProps) {
  return (
    <div className="space-y-8">
      {groups.map((group, gi) => (
        <div key={gi}>
          {group.title && (
            <h3 className="mb-3 text-sm font-semibold text-foreground">{group.title}</h3>
          )}
          <div className="overflow-x-auto rounded-md border border-border">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-border bg-background-subtle/60 text-[11px] uppercase tracking-wider text-foreground-subtle">
                  <th className="px-3 py-2 font-medium">Prop</th>
                  <th className="px-3 py-2 font-medium">Type</th>
                  <th className="px-3 py-2 font-medium">Default</th>
                  <th className="px-3 py-2 font-medium">Description</th>
                </tr>
              </thead>
              <tbody>
                {group.rows.map((r) => (
                  <tr key={r.name} className="border-b border-border last:border-b-0 align-top">
                    <td className="whitespace-nowrap px-3 py-2 font-mono text-[12.5px] text-foreground">
                      {r.name}
                      {r.required && <span className="ml-0.5 text-danger-text">*</span>}
                    </td>
                    <td className="px-3 py-2 font-mono text-[12px] text-foreground-muted">
                      <span className="rounded bg-background-muted px-1.5 py-0.5">{r.type}</span>
                    </td>
                    <td className="whitespace-nowrap px-3 py-2 font-mono text-[12px] text-foreground-subtle">
                      {r.default ?? '—'}
                    </td>
                    <td className="px-3 py-2 text-foreground-muted">{r.description}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ))}
    </div>
  );
}
