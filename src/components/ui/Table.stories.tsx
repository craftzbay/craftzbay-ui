import type { Meta, StoryObj } from '@storybook/react-vite';
import { Badge } from './Badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './Table';

const meta: Meta = { title: 'Data Display/Table' };
export default meta;
type Story = StoryObj;

const rows = [
  { name: 'Atlas', owner: 'Bayar', status: 'Active' as const },
  { name: 'Beacon', owner: 'Sara', status: 'Paused' as const },
  { name: 'Cinder', owner: 'Mike', status: 'Active' as const },
  { name: 'Delta', owner: 'Lin', status: 'Archived' as const },
];

const toneFor: Record<string, 'success' | 'warning' | 'neutral'> = {
  Active: 'success',
  Paused: 'warning',
  Archived: 'neutral',
};

export const Default: Story = {
  render: () => (
    <Table className="w-[36rem]">
      <TableHeader>
        <TableRow>
          <TableHead>Project</TableHead>
          <TableHead>Owner</TableHead>
          <TableHead>Status</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {rows.map((r) => (
          <TableRow key={r.name}>
            <TableCell className="font-medium">{r.name}</TableCell>
            <TableCell>{r.owner}</TableCell>
            <TableCell><Badge tone={toneFor[r.status]}>{r.status}</Badge></TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  ),
};
