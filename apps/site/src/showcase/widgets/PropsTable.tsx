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
            <h3 className="text-foreground mb-3 text-sm font-semibold">{group.title}</h3>
          )}
          <div
            className="border-border scroll-region overflow-x-auto rounded-md border"
            tabIndex={0}
            role="region"
            aria-label={group.title ? `${group.title} props` : 'Props'}
          >
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-border bg-background-subtle/60 text-foreground-subtle border-b text-xs tracking-wider uppercase">
                  <th className="px-3 py-2 font-medium">Prop</th>
                  <th className="px-3 py-2 font-medium">Type</th>
                  <th className="px-3 py-2 font-medium">Default</th>
                  <th className="px-3 py-2 font-medium">Description</th>
                </tr>
              </thead>
              <tbody>
                {group.rows.map((r) => (
                  <tr key={r.name} className="border-border border-b align-top last:border-b-0">
                    <td className="text-foreground px-3 py-2 font-mono text-xs whitespace-nowrap">
                      {r.name}
                      {r.required && <span className="text-danger-text ml-0.5">*</span>}
                    </td>
                    <td className="text-foreground-muted px-3 py-2 font-mono text-xs">
                      <span className="bg-background-muted rounded px-1.5 py-0.5">{r.type}</span>
                    </td>
                    <td className="text-foreground-subtle px-3 py-2 font-mono text-xs whitespace-nowrap">
                      {r.default ?? '—'}
                    </td>
                    <td className="text-foreground-muted px-3 py-2">{r.description}</td>
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
