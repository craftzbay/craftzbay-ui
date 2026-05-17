import { useMemo, useState, type ReactNode } from 'react';
import { Settings } from '@/icons';
import { cn } from '@/lib/utils';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './DropdownMenu';
import { IconButton } from './IconButton';
import { Input } from './Input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  TableSortHeader,
} from './Table';
import { Skeleton } from './Skeleton';

export interface DataGridColumn<TRow> {
  /** Stable key used for visibility, sort, and React lists. */
  key: string;
  /** Header label. */
  header: ReactNode;
  /** Render the cell. Defaults to the value at `row[key]`. */
  cell?: (row: TRow) => ReactNode;
  /** Cell width — passed to `<col>` so the grid keeps shape during loading. */
  width?: string;
  /** Allow sorting on this column. */
  sortable?: boolean;
  /** Right-align numeric / monetary columns. */
  align?: 'left' | 'right';
}

export interface DataGridProps<TRow extends { id: string | number }> {
  columns: DataGridColumn<TRow>[];
  rows: TRow[];
  loading?: boolean;
  /** Initial sort state. */
  sort?: { key: string; direction: 'asc' | 'desc' } | null;
  onSortChange?: (sort: { key: string; direction: 'asc' | 'desc' }) => void;
  /** Show a filter input row above the grid. */
  filter?: { value: string; onChange: (q: string) => void; placeholder?: string };
  /** Empty-state node when no rows are visible. */
  emptyState?: ReactNode;
  className?: string;
}

/**
 * Composite grid built from `Table` + DropdownMenu + Input. Provides
 * column visibility toggle, an inline filter, sortable headers, and
 * loading / empty states.
 *
 * @example
 *   <DataGrid
 *     columns={[
 *       { key: 'name', header: 'Name', sortable: true },
 *       { key: 'status', header: 'Status', cell: r => <Badge tone={...}>{r.status}</Badge> },
 *       { key: 'updatedAt', header: 'Updated', align: 'right' },
 *     ]}
 *     rows={rows}
 *     filter={{ value: q, onChange: setQ }}
 *     sort={sort}
 *     onSortChange={setSort}
 *   />
 *
 * @do Provide a meaningful empty state with a primary action when the grid
 *      starts empty (no items at all, not just filtered out).
 * @dont Render thousands of rows synchronously — virtualise with `@tanstack/react-virtual`
 *       and wrap with this component's headers as a shell.
 */
export function DataGrid<TRow extends { id: string | number }>({
  columns,
  rows,
  loading,
  sort,
  onSortChange,
  filter,
  emptyState,
  className,
}: DataGridProps<TRow>) {
  const [hidden, setHidden] = useState<Record<string, boolean>>({});
  const visibleColumns = useMemo(() => columns.filter((c) => !hidden[c.key]), [columns, hidden]);

  const renderRows = () => {
    if (loading) {
      return Array.from({ length: 5 }).map((_, i) => (
        <TableRow key={`skel-${i}`}>
          {visibleColumns.map((c) => (
            <TableCell key={c.key}>
              <Skeleton variant="text" className="w-3/4" />
            </TableCell>
          ))}
        </TableRow>
      ));
    }
    if (rows.length === 0) {
      return (
        <TableRow>
          <TableCell colSpan={visibleColumns.length} className="h-32 text-center">
            {emptyState ?? (
              <span className="text-foreground-subtle">No results.</span>
            )}
          </TableCell>
        </TableRow>
      );
    }
    return rows.map((row) => (
      <TableRow key={row.id}>
        {visibleColumns.map((c) => (
          <TableCell
            key={c.key}
            className={cn(c.align === 'right' && 'text-right tabular')}
          >
            {c.cell ? c.cell(row) : (row as Record<string, unknown>)[c.key] as ReactNode}
          </TableCell>
        ))}
      </TableRow>
    ));
  };

  return (
    <div className={cn('flex flex-col gap-3', className)}>
      <div className="flex items-center justify-between gap-2">
        {filter ? (
          <Input
            type="search"
            placeholder={filter.placeholder ?? 'Filter…'}
            value={filter.value}
            onChange={(e) => filter.onChange(e.target.value)}
            clearable
            onClear={() => filter.onChange('')}
            className="max-w-sm w-full"
            hideLabel
            label="Filter rows"
          />
        ) : (
          <div />
        )}
        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <IconButton aria-label="Column visibility" icon={<Settings />} variant="outline" />
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuLabel>Columns</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {columns.map((c) => (
                <DropdownMenuCheckboxItem
                  key={c.key}
                  checked={!hidden[c.key]}
                  onCheckedChange={(v) =>
                    setHidden((prev) => ({ ...prev, [c.key]: !v }))
                  }
                >
                  {c.header}
                </DropdownMenuCheckboxItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div className="rounded-lg border border-border overflow-hidden">
        <Table>
          <colgroup>
            {visibleColumns.map((c) => (
              <col key={c.key} style={c.width ? { width: c.width } : undefined} />
            ))}
          </colgroup>
          <TableHeader>
            <TableRow>
              {visibleColumns.map((c) =>
                c.sortable && onSortChange ? (
                  <TableSortHeader
                    key={c.key}
                    sortKey={c.key}
                    currentSort={sort ?? null}
                    onSortChange={(k, d) => onSortChange({ key: k, direction: d })}
                  >
                    {c.header}
                  </TableSortHeader>
                ) : (
                  <TableHead key={c.key} className={cn(c.align === 'right' && 'text-right')}>
                    {c.header}
                  </TableHead>
                ),
              )}
            </TableRow>
          </TableHeader>
          <TableBody>{renderRows()}</TableBody>
        </Table>
      </div>
    </div>
  );
}
