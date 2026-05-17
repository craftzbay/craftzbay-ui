import { useMemo, useState } from 'react';
import { Download, Filter, Plus, Trash2, Upload } from '@/icons';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Checkbox } from '@/components/ui/Checkbox';
import { DataGrid } from '@/components/ui/DataGrid';
import { EmptyState } from '@/components/ui/EmptyState';
import { Pagination } from '@/components/ui/Pagination';
import { Select, SelectContent, SelectItem, SelectTrigger } from '@/components/ui/Select';

/* -----------------------------------------------------------------------------
 *  Data table page — filters + search + bulk action bar + grid + pagination.
 *  All state stays local so the file is drop-in reviewable.
 * --------------------------------------------------------------------------- */

interface Project {
  id: string;
  name: string;
  status: 'active' | 'paused' | 'archived';
  owner: string;
  updatedAt: string;
}

const sample: Project[] = [
  { id: 'p1', name: 'Pulse onboarding', status: 'active', owner: 'Anu B.', updatedAt: '2 hours ago' },
  { id: 'p2', name: 'Q2 OKRs rollout', status: 'active', owner: 'Bat E.', updatedAt: 'Yesterday' },
  { id: 'p3', name: 'Legacy export', status: 'paused', owner: 'Tuya G.', updatedAt: '3 days ago' },
  { id: 'p4', name: 'Billing spike', status: 'archived', owner: 'Khulan O.', updatedAt: 'Last week' },
  { id: 'p5', name: 'Marketing refresh', status: 'active', owner: 'Anu B.', updatedAt: 'Last week' },
];

const statusTone = {
  active: { tone: 'success' as const, label: 'Active' },
  paused: { tone: 'warning' as const, label: 'Paused' },
  archived: { tone: 'neutral' as const, label: 'Archived' },
};

export function DataTablePage() {
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState<string>('all');
  const [selected, setSelected] = useState<string[]>([]);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const filtered = useMemo(() => {
    return sample.filter((p) => {
      const matchesQuery = p.name.toLowerCase().includes(query.toLowerCase());
      const matchesStatus = status === 'all' || p.status === status;
      return matchesQuery && matchesStatus;
    });
  }, [query, status]);

  const allSelected = filtered.length > 0 && selected.length === filtered.length;
  const someSelected = selected.length > 0 && !allSelected;

  return (
    <div className="space-y-6">
      <header className="flex items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">Projects</h1>
          <p className="text-sm text-foreground-muted mt-1">
            {filtered.length} project{filtered.length === 1 ? '' : 's'} match your filters.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" leadingIcon={<Upload />}>
            Import
          </Button>
          <Button leadingIcon={<Plus />}>New project</Button>
        </div>
      </header>

      <div className="flex flex-wrap items-center gap-2">
        <Select value={status} onValueChange={setStatus}>
          <SelectTrigger className="w-36" placeholder="Status" />
          <SelectContent>
            <SelectItem value="all">All statuses</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="paused">Paused</SelectItem>
            <SelectItem value="archived">Archived</SelectItem>
          </SelectContent>
        </Select>
        <Button variant="outline" size="sm" leadingIcon={<Filter />}>
          More filters
        </Button>
      </div>

      {selected.length > 0 && (
        <div className="flex items-center justify-between rounded-md border border-border bg-background-subtle px-4 py-2">
          <div className="flex items-center gap-3">
            <Checkbox
              checked={allSelected ? true : someSelected ? 'indeterminate' : false}
              onCheckedChange={(v) => setSelected(v ? filtered.map((p) => p.id) : [])}
              aria-label="Select all"
            />
            <span className="text-sm text-foreground">
              {selected.length} selected
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" leadingIcon={<Download />}>
              Export
            </Button>
            <Button variant="ghost" size="sm" leadingIcon={<Trash2 />}>
              Delete
            </Button>
          </div>
        </div>
      )}

      <DataGrid
        rows={filtered.slice((page - 1) * pageSize, page * pageSize)}
        filter={{ value: query, onChange: setQuery, placeholder: 'Search projects…' }}
        emptyState={
          <EmptyState
            title="No projects match"
            description="Try adjusting filters or creating a new project."
            action={<Button leadingIcon={<Plus />}>New project</Button>}
            className="border-0 bg-transparent"
          />
        }
        columns={[
          {
            key: 'select',
            header: (
              <Checkbox
                checked={allSelected ? true : someSelected ? 'indeterminate' : false}
                onCheckedChange={(v) => setSelected(v ? filtered.map((p) => p.id) : [])}
                aria-label="Select all rows"
              />
            ),
            width: '32px',
            cell: (r) => (
              <Checkbox
                checked={selected.includes(r.id)}
                onCheckedChange={(v) =>
                  setSelected((prev) => (v ? [...prev, r.id] : prev.filter((id) => id !== r.id)))
                }
                aria-label={`Select ${r.name}`}
              />
            ),
          },
          { key: 'name', header: 'Name', sortable: true, cell: (r) => <span className="font-medium text-foreground">{r.name}</span> },
          {
            key: 'status',
            header: 'Status',
            cell: (r) => (
              <Badge tone={statusTone[r.status].tone} dot>
                {statusTone[r.status].label}
              </Badge>
            ),
          },
          { key: 'owner', header: 'Owner' },
          { key: 'updatedAt', header: 'Updated', align: 'right' },
        ]}
      />

      <Pagination
        page={page}
        pageCount={Math.max(1, Math.ceil(filtered.length / pageSize))}
        onPageChange={setPage}
        totalItems={filtered.length}
        pageSize={pageSize}
        pageSizeOptions={[10, 20, 50]}
        onPageSizeChange={(s) => {
          setPageSize(s);
          setPage(1);
        }}
      />
    </div>
  );
}
