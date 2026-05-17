import type { Meta, StoryObj } from '@storybook/react-vite';
import { Badge } from './Badge';
import { DataGrid, type DataGridColumn } from './DataGrid';

interface Row {
  id: string;
  name: string;
  owner: string;
  status: 'Active' | 'Paused' | 'Archived';
  mrr: number;
}

const data: Row[] = [
  { id: '1', name: 'Atlas', owner: 'Bayar', status: 'Active', mrr: 1200 },
  { id: '2', name: 'Beacon', owner: 'Sara', status: 'Paused', mrr: 480 },
  { id: '3', name: 'Cinder', owner: 'Mike', status: 'Active', mrr: 920 },
  { id: '4', name: 'Delta', owner: 'Lin', status: 'Archived', mrr: 0 },
];

const toneFor = { Active: 'success', Paused: 'warning', Archived: 'neutral' } as const;

const columns: DataGridColumn<Row>[] = [
  { key: 'name', header: 'Project', sortable: true },
  { key: 'owner', header: 'Owner', sortable: true },
  { key: 'status', header: 'Status', cell: (r) => <Badge tone={toneFor[r.status]}>{r.status}</Badge> },
  { key: 'mrr', header: 'MRR', align: 'right', cell: (r) => `$${r.mrr.toLocaleString()}` },
];

const meta: Meta = { title: 'Data Display/DataGrid' };
export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: () => (
    <div className="w-[44rem]">
      <DataGrid rows={data} columns={columns} />
    </div>
  ),
};
