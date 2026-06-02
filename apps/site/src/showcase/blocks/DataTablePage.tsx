import { useMemo, useState, type ReactNode } from 'react';
import { Download, Filter, Plus, Trash2, Upload } from 'lucide-react';
import { Badge } from '@craftzbay/ui';
import { Button, type ButtonProps } from '@craftzbay/ui';
import { Checkbox } from '@craftzbay/ui';
import { DataGrid, type DataGridColumn } from '@craftzbay/ui';
import { EmptyState } from '@craftzbay/ui';
import { Pagination } from '@craftzbay/ui';
import { Select, SelectContent, SelectItem, SelectTrigger } from '@craftzbay/ui';

/* -----------------------------------------------------------------------------
 *  DataTablePage — generic filter + search + bulk-action + grid + pagination
 *  scaffold. Generic over row type T (must have an `id`).
 * --------------------------------------------------------------------------- */

export interface DataTableFilter {
  /** Field key used by the default predicate, and as the React key. */
  key: string;
  label: string;
  /** First option should be the "all" / cleared value. */
  options: { value: string; label: string }[];
  /** Initial value. Defaults to the first option's value. */
  defaultValue?: string;
}

export interface DataTableBulkAction<T> {
  label: string;
  /** Optional leading icon. */
  icon?: ReactNode;
  variant?: ButtonProps['variant'];
  /** Receives the selected rows. Awaited — toolbar shows a spinner while pending. */
  onAction: (selected: T[]) => void | Promise<void>;
}

export interface DataTablePageProps<T extends { id: string | number }> {
  /** Page heading. */
  title?: ReactNode;
  /** Optional subtitle — defaults to a row-count line. */
  subtitle?: ReactNode;
  /** Right-aligned header actions (e.g. New / Import buttons). */
  headerActions?: ReactNode;
  /** Row data. */
  rows?: T[];
  /** Column descriptors. */
  columns?: DataGridColumn<T>[];
  /** Filter selects to render in the toolbar. */
  filters?: DataTableFilter[];
  /** Custom predicate. Receives the row + the active filter values. */
  predicate?: (row: T, filterValues: Record<string, string>, search: string) => boolean;
  /** Search placeholder. */
  searchPlaceholder?: string;
  /** Available rows-per-page sizes. */
  pageSizeOptions?: number[];
  /** Initial page size. */
  defaultPageSize?: number;
  /** Bulk-action buttons shown when rows are selected. */
  bulkActions?: DataTableBulkAction<T>[];
  /** EmptyState rendered when the filtered rows are empty. */
  emptyState?: ReactNode;
  className?: string;
}

/* -----------------------------------------------------------------------------
 *  Default demo data + columns
 * --------------------------------------------------------------------------- */

interface DemoProject {
  id: string;
  name: string;
  status: 'active' | 'paused' | 'archived';
  owner: string;
  updatedAt: string;
}

const DEMO_ROWS: DemoProject[] = [
  { id: 'p1', name: 'Pulse onboarding', status: 'active', owner: 'Anu B.', updatedAt: '2 hours ago' },
  { id: 'p2', name: 'Q2 OKRs rollout', status: 'active', owner: 'Bat E.', updatedAt: 'Yesterday' },
  { id: 'p3', name: 'Legacy export', status: 'paused', owner: 'Tuya G.', updatedAt: '3 days ago' },
  { id: 'p4', name: 'Billing spike', status: 'archived', owner: 'Khulan O.', updatedAt: 'Last week' },
  { id: 'p5', name: 'Marketing refresh', status: 'active', owner: 'Anu B.', updatedAt: 'Last week' },
];

const STATUS_TONE = {
  active: { tone: 'success' as const, label: 'Active' },
  paused: { tone: 'warning' as const, label: 'Paused' },
  archived: { tone: 'neutral' as const, label: 'Archived' },
};

const DEMO_COLUMNS: DataGridColumn<DemoProject>[] = [
  {
    key: 'name',
    header: 'Name',
    sortable: true,
    cell: (r) => <span className="font-medium text-foreground">{r.name}</span>,
  },
  {
    key: 'status',
    header: 'Status',
    cell: (r) => (
      <Badge tone={STATUS_TONE[r.status].tone} dot>
        {STATUS_TONE[r.status].label}
      </Badge>
    ),
  },
  { key: 'owner', header: 'Owner' },
  { key: 'updatedAt', header: 'Updated', align: 'right' },
];

const DEMO_FILTERS: DataTableFilter[] = [
  {
    key: 'status',
    label: 'Status',
    options: [
      { value: 'all', label: 'All statuses' },
      { value: 'active', label: 'Active' },
      { value: 'paused', label: 'Paused' },
      { value: 'archived', label: 'Archived' },
    ],
  },
];

const DEMO_HEADER_ACTIONS: ReactNode = (
  <>
    <Button variant="outline" leadingIcon={<Upload />}>Import</Button>
    <Button leadingIcon={<Plus />}>New project</Button>
  </>
);

const DEMO_BULK_ACTIONS: DataTableBulkAction<DemoProject>[] = [
  { label: 'Export', icon: <Download />, variant: 'ghost', onAction: () => {} },
  { label: 'Delete', icon: <Trash2 />, variant: 'ghost', onAction: () => {} },
];

/**
 * Generic data-table page.
 *
 * @example
 *   interface User { id: string; name: string; role: string; status: 'active' | 'invited' }
 *
 *   <DataTablePage<User>
 *     title="Members"
 *     rows={users}
 *     columns={[
 *       { key: 'name', header: 'Name', sortable: true },
 *       { key: 'role', header: 'Role' },
 *       { key: 'status', header: 'Status', cell: (r) => <Badge>{r.status}</Badge> },
 *     ]}
 *     filters={[
 *       { key: 'status', label: 'Status', options: [
 *         { value: 'all', label: 'All' },
 *         { value: 'active', label: 'Active' },
 *         { value: 'invited', label: 'Invited' },
 *       ]},
 *     ]}
 *     bulkActions={[
 *       { label: 'Remove', variant: 'destructive', onAction: (rows) => api.remove(rows) },
 *     ]}
 *   />
 */
export function DataTablePage<T extends { id: string | number }>({
  title = 'Projects',
  subtitle,
  headerActions = DEMO_HEADER_ACTIONS,
  rows: rowsProp,
  columns: columnsProp,
  filters: filtersProp,
  predicate,
  searchPlaceholder = 'Search…',
  pageSizeOptions = [10, 20, 50],
  defaultPageSize = 10,
  bulkActions: bulkActionsProp,
  emptyState,
  className,
}: DataTablePageProps<T> = {}) {
  // Defaults — typed back through `T` via assertions. Consumers replace
  // everything when they pass their own rows/columns.
  const rows = (rowsProp ?? (DEMO_ROWS as unknown as T[])) as T[];
  const columns =
    (columnsProp ?? (DEMO_COLUMNS as unknown as DataGridColumn<T>[])) as DataGridColumn<T>[];
  const filters = filtersProp ?? DEMO_FILTERS;
  const bulkActions =
    (bulkActionsProp ?? (DEMO_BULK_ACTIONS as unknown as DataTableBulkAction<T>[])) as DataTableBulkAction<T>[];

  const [query, setQuery] = useState('');
  const [filterValues, setFilterValues] = useState<Record<string, string>>(() => {
    const init: Record<string, string> = {};
    for (const f of filters) init[f.key] = f.defaultValue ?? f.options[0]?.value ?? '';
    return init;
  });
  const [selectedIds, setSelectedIds] = useState<(string | number)[]>([]);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(defaultPageSize);

  const filtered = useMemo(() => {
    const defaultPred = (row: T) => {
      // Default behavior: substring match on every string field for `query`,
      // and exact-match on filterValues[key] === row[key] (skipping 'all').
      const q = query.toLowerCase();
      if (q) {
        const hasMatch = Object.values(row as Record<string, unknown>).some(
          (v) => typeof v === 'string' && v.toLowerCase().includes(q),
        );
        if (!hasMatch) return false;
      }
      for (const [key, value] of Object.entries(filterValues)) {
        if (!value || value === 'all') continue;
        if ((row as Record<string, unknown>)[key] !== value) return false;
      }
      return true;
    };
    return rows.filter((row) =>
      predicate ? predicate(row, filterValues, query) : defaultPred(row),
    );
  }, [rows, query, filterValues, predicate]);

  const allOnPageSelected =
    filtered.length > 0 && filtered.every((r) => selectedIds.includes(r.id));
  const someSelected = selectedIds.length > 0 && !allOnPageSelected;

  const selectedRows = useMemo(
    () => rows.filter((r) => selectedIds.includes(r.id)),
    [rows, selectedIds],
  );

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const pageRows = filtered.slice((page - 1) * pageSize, page * pageSize);

  const augmentedColumns: DataGridColumn<T>[] = [
    {
      key: '__select',
      header: (
        <Checkbox
          checked={allOnPageSelected ? true : someSelected ? 'indeterminate' : false}
          onCheckedChange={(v) =>
            setSelectedIds(v ? filtered.map((r) => r.id) : [])
          }
          aria-label="Select all rows"
        />
      ),
      width: '32px',
      cell: (r: T) => (
        <Checkbox
          checked={selectedIds.includes(r.id)}
          onCheckedChange={(v) =>
            setSelectedIds((prev) =>
              v ? [...prev, r.id] : prev.filter((id) => id !== r.id),
            )
          }
          aria-label="Select row"
        />
      ),
    },
    ...columns,
  ];

  return (
    <div className={`space-y-6 ${className ?? ''}`}>
      <header className="flex items-end justify-between gap-4">
        <div>
          {title && (
            <h1 className="text-2xl font-semibold tracking-tight text-foreground">{title}</h1>
          )}
          <p className="mt-1 text-sm text-foreground-muted">
            {subtitle ?? `${filtered.length} item${filtered.length === 1 ? '' : 's'} match your filters.`}
          </p>
        </div>
        {headerActions && <div className="flex items-center gap-2">{headerActions}</div>}
      </header>

      {(filters.length > 0 || bulkActions.length > 0) && (
        <div className="flex flex-wrap items-center gap-2">
          {filters.map((f) => (
            <Select
              key={f.key}
              value={filterValues[f.key]}
              onValueChange={(v) => setFilterValues((prev) => ({ ...prev, [f.key]: v }))}
            >
              <SelectTrigger className="w-40" placeholder={f.label} />
              <SelectContent>
                {f.options.map((o) => (
                  <SelectItem key={o.value} value={o.value}>
                    {o.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          ))}
          <Button variant="outline" size="sm" leadingIcon={<Filter />}>
            More filters
          </Button>
        </div>
      )}

      {selectedIds.length > 0 && bulkActions.length > 0 && (
        <div className="flex items-center justify-between rounded-md border border-border bg-background-subtle px-4 py-2">
          <div className="flex items-center gap-3">
            <Checkbox
              checked={allOnPageSelected ? true : someSelected ? 'indeterminate' : false}
              onCheckedChange={(v) =>
                setSelectedIds(v ? filtered.map((r) => r.id) : [])
              }
              aria-label="Select all"
            />
            <span className="text-sm text-foreground">{selectedIds.length} selected</span>
          </div>
          <div className="flex items-center gap-2">
            {bulkActions.map((a) => (
              <Button
                key={a.label}
                variant={a.variant ?? 'ghost'}
                size="sm"
                leadingIcon={a.icon}
                onClick={() => a.onAction(selectedRows)}
              >
                {a.label}
              </Button>
            ))}
          </div>
        </div>
      )}

      <DataGrid
        rows={pageRows}
        filter={{ value: query, onChange: setQuery, placeholder: searchPlaceholder }}
        emptyState={
          emptyState ?? (
            <EmptyState
              title="No results"
              description="Try adjusting filters or your search."
              className="border-0 bg-transparent"
            />
          )
        }
        columns={augmentedColumns}
      />

      <Pagination
        page={page}
        pageCount={totalPages}
        onPageChange={setPage}
        totalItems={filtered.length}
        pageSize={pageSize}
        pageSizeOptions={pageSizeOptions}
        onPageSizeChange={(s) => {
          setPageSize(s);
          setPage(1);
        }}
      />
    </div>
  );
}
