import { DataGrid, type DataGridColumn } from '@/components/ui/DataGrid';
import { Badge } from '@/components/ui/Badge';
import type { ComponentDoc } from '../registry/types';

interface Row {
  id: string;
  name: string;
  owner: string;
  status: 'Active' | 'Paused' | 'Archived';
}

const rows: Row[] = [
  { id: '1', name: 'Atlas', owner: 'Avery', status: 'Active' },
  { id: '2', name: 'Beacon', owner: 'Jordan', status: 'Paused' },
  { id: '3', name: 'Cosmo', owner: 'Sam', status: 'Archived' },
  { id: '4', name: 'Drift', owner: 'Robin', status: 'Active' },
];

const columns: DataGridColumn<Row>[] = [
  { key: 'name', header: 'Project', sortable: true },
  { key: 'owner', header: 'Owner', sortable: true },
  {
    key: 'status',
    header: 'Status',
    cell: (r) => (
      <Badge tone={r.status === 'Active' ? 'success' : r.status === 'Paused' ? 'warning' : 'neutral'}>
        {r.status}
      </Badge>
    ),
  },
];

const doc: ComponentDoc = {
  slug: 'data-grid',
  name: 'DataGrid',
  group: 'Data Display',
  description:
    'Sortable, filterable, column-visibility table. Stateless — pass in rows + columns and handle interactions in your own state. Pair with Pagination for large lists.',
  exports: ['DataGrid', 'DataGridColumn'],
  sourceFile: 'DataGrid.tsx',
  examples: [
    {
      title: 'Default',
      preview: <DataGrid rows={rows} columns={columns} />,
      code: `interface Row { id: string; name: string; owner: string; status: string }

const columns: DataGridColumn<Row>[] = [
  { key: 'name',   header: 'Project', sortable: true },
  { key: 'owner',  header: 'Owner',   sortable: true },
  { key: 'status', header: 'Status',  cell: (r) => <Badge>{r.status}</Badge> },
];

<DataGrid rows={rows} columns={columns} />`,
    },
  ],
  api: [
    {
      title: 'DataGrid props',
      rows: [
        { name: 'rows', type: 'T[]', required: true, description: 'Row data. Each row must have a stable id.' },
        { name: 'columns', type: 'DataGridColumn<T>[]', required: true, description: 'Column descriptors.' },
        { name: 'sort', type: '{ key: keyof T; dir: "asc" | "desc" } | null', description: 'Controlled sort state.' },
        { name: 'onSortChange', type: '(sort) => void', description: 'Fires when a sortable header is clicked.' },
        { name: 'selection', type: 'Set<string>', description: 'Selected row ids (controlled).' },
        { name: 'onSelectionChange', type: '(ids: Set<string>) => void', description: 'Fires on row selection.' },
      ],
    },
    {
      title: 'DataGridColumn<T>',
      rows: [
        { name: 'key', type: 'keyof T', required: true, description: 'Field to render / sort.' },
        { name: 'header', type: 'ReactNode', required: true, description: 'Header label.' },
        { name: 'sortable', type: 'boolean', default: 'false', description: 'Render as a TableSortHeader.' },
        { name: 'cell', type: '(row: T) => ReactNode', description: 'Custom cell renderer.' },
        { name: 'width', type: 'string', description: 'CSS width (e.g. "120px", "20%").' },
      ],
    },
  ],
  related: [
    { slug: 'pagination', reason: 'For paginated tables.' },
    { slug: 'table', reason: 'For simple static tables.' },
  ],
};

export default doc;
