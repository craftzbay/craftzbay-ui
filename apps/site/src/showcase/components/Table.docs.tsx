import { useMemo, useState } from 'react';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
  TableSortHeader,
} from '@/components/ui/Table';
import { Badge } from '@/components/ui/Badge';
import { IconButton } from '@/components/ui/IconButton';
import { MoreHorizontal } from '@/icons';
import type { ComponentDoc } from '../registry/types';

const INVOICES = [
  { id: 'INV-0042', customer: 'Northwind', status: 'Paid', tone: 'success' as const, amount: 1250.0 },
  { id: 'INV-0041', customer: 'Acme Corp', status: 'Pending', tone: 'warning' as const, amount: 860.5 },
  { id: 'INV-0040', customer: 'Globex', status: 'Paid', tone: 'success' as const, amount: 3120.0 },
  { id: 'INV-0039', customer: 'Initech', status: 'Overdue', tone: 'danger' as const, amount: 440.0 },
  { id: 'INV-0038', customer: 'Umbrella', status: 'Refunded', tone: 'neutral' as const, amount: 199.99 },
];

const fmt = (n: number) =>
  n.toLocaleString('en-US', { style: 'currency', currency: 'USD' });

function InvoicesDemo() {
  const total = INVOICES.reduce((sum, i) => sum + i.amount, 0);
  return (
    <Table className="w-full max-w-2xl">
      <TableCaption>Latest invoices, updated hourly.</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>Invoice</TableHead>
          <TableHead>Customer</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="text-right">Amount</TableHead>
          <TableHead className="w-10" aria-label="Actions" />
        </TableRow>
      </TableHeader>
      <TableBody>
        {INVOICES.map((inv) => (
          <TableRow key={inv.id}>
            <TableCell className="font-medium">{inv.id}</TableCell>
            <TableCell>{inv.customer}</TableCell>
            <TableCell>
              <Badge tone={inv.tone} dot>{inv.status}</Badge>
            </TableCell>
            <TableCell className="text-right tabular">{fmt(inv.amount)}</TableCell>
            <TableCell>
              <IconButton aria-label={`Actions for ${inv.id}`} icon={<MoreHorizontal />} variant="ghost" size="sm" />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
      <TableFooter>
        <TableRow>
          <TableCell colSpan={3}>Total</TableCell>
          <TableCell className="text-right tabular">{fmt(total)}</TableCell>
          <TableCell />
        </TableRow>
      </TableFooter>
    </Table>
  );
}

type Sort = { key: string; direction: 'asc' | 'desc' } | null;

function SortableDemo() {
  const [sort, setSort] = useState<Sort>({ key: 'amount', direction: 'desc' });

  const rows = useMemo(() => {
    if (!sort) return INVOICES;
    const dir = sort.direction === 'asc' ? 1 : -1;
    return [...INVOICES].sort((a, b) => {
      const av = a[sort.key as 'customer' | 'amount'];
      const bv = b[sort.key as 'customer' | 'amount'];
      return (typeof av === 'number' ? av - (bv as number) : String(av).localeCompare(String(bv))) * dir;
    });
  }, [sort]);

  const onSort = (key: string, direction: 'asc' | 'desc') => setSort({ key, direction });

  return (
    <Table className="w-full max-w-xl">
      <TableHeader>
        <TableRow>
          <TableHead>Invoice</TableHead>
          <TableSortHeader sortKey="customer" currentSort={sort} onSortChange={onSort}>
            Customer
          </TableSortHeader>
          <TableSortHeader sortKey="amount" currentSort={sort} onSortChange={onSort} className="text-right">
            Amount
          </TableSortHeader>
        </TableRow>
      </TableHeader>
      <TableBody>
        {rows.map((inv) => (
          <TableRow key={inv.id}>
            <TableCell className="font-medium">{inv.id}</TableCell>
            <TableCell>{inv.customer}</TableCell>
            <TableCell className="text-right tabular">{fmt(inv.amount)}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

const doc: ComponentDoc = {
  slug: 'table',
  name: 'Table',
  group: 'Data Display',
  description:
    'Semantic HTML table with refined-minimal styling. Use for simple data; for sorting, filtering, and column visibility, reach for DataGrid.',
  exports: ['Table', 'TableHeader', 'TableBody', 'TableFooter', 'TableRow', 'TableHead', 'TableCell', 'TableCaption', 'TableSortHeader'],
  sourceFile: 'Table.tsx',
  examples: [
    {
      title: 'Invoices',
      description: 'The full anatomy: caption, header, status badges, right-aligned tabular numbers, a row-actions column, and a footer with the total.',
      preview: <InvoicesDemo />,
      code: `<Table>
  <TableCaption>Latest invoices, updated hourly.</TableCaption>
  <TableHeader>
    <TableRow>
      <TableHead>Invoice</TableHead>
      <TableHead>Customer</TableHead>
      <TableHead>Status</TableHead>
      <TableHead className="text-right">Amount</TableHead>
      <TableHead className="w-10" aria-label="Actions" />
    </TableRow>
  </TableHeader>
  <TableBody>
    {invoices.map((inv) => (
      <TableRow key={inv.id}>
        <TableCell className="font-medium">{inv.id}</TableCell>
        <TableCell>{inv.customer}</TableCell>
        <TableCell><Badge tone={inv.tone} dot>{inv.status}</Badge></TableCell>
        <TableCell className="text-right tabular">{fmt(inv.amount)}</TableCell>
        <TableCell>
          <IconButton aria-label="Actions" icon={<MoreHorizontal />} variant="ghost" size="sm" />
        </TableCell>
      </TableRow>
    ))}
  </TableBody>
  <TableFooter>
    <TableRow>
      <TableCell colSpan={3}>Total</TableCell>
      <TableCell className="text-right tabular">{fmt(total)}</TableCell>
      <TableCell />
    </TableRow>
  </TableFooter>
</Table>`,
    },
    {
      title: 'Sortable columns',
      description: 'TableSortHeader owns the asc/desc visuals; you own the state and the actual sort. Click Customer or Amount.',
      preview: <SortableDemo />,
      code: `const [sort, setSort] = useState({ key: 'amount', direction: 'desc' });
const rows = useMemo(() => sortRows(invoices, sort), [sort]);

<TableHeader>
  <TableRow>
    <TableHead>Invoice</TableHead>
    <TableSortHeader sortKey="customer" currentSort={sort}
                     onSortChange={(key, direction) => setSort({ key, direction })}>
      Customer
    </TableSortHeader>
    <TableSortHeader sortKey="amount" currentSort={sort}
                     onSortChange={(key, direction) => setSort({ key, direction })}>
      Amount
    </TableSortHeader>
  </TableRow>
</TableHeader>`,
    },
  ],
  api: [
    {
      rows: [
        { name: 'Table / TableHeader / TableBody / …', type: 'component', description: 'Thin styled wrappers around the corresponding HTML elements.' },
        { name: 'TableSortHeader', type: 'component', description: 'Header cell with built-in asc/desc/none cycle button.' },
        { name: 'sortKey', type: 'string', description: 'TableSortHeader: stable column key reported to onSortChange.' },
        { name: 'currentSort', type: `{ key: string; direction: 'asc' | 'desc' } | null`, description: 'TableSortHeader: controlled sort state.' },
        { name: 'onSortChange', type: `(key, direction) => void`, description: 'TableSortHeader: fires on header click.' },
      ],
    },
  ],
  related: [
    { slug: 'data-grid', reason: 'For sortable, filterable tables.' },
  ],
};

export default doc;
