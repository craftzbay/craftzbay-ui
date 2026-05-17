import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/Table';
import { Badge } from '@/components/ui/Badge';
import type { ComponentDoc } from '../registry/types';

const doc: ComponentDoc = {
  slug: 'table',
  name: 'Table',
  group: 'Data Display',
  description:
    'Semantic HTML table with refined-minimal styling. Use for simple data; for sorting, filtering, and column visibility, reach for DataGrid.',
  exports: ['Table', 'TableHeader', 'TableBody', 'TableRow', 'TableHead', 'TableCell', 'TableSortHeader'],
  sourceFile: 'Table.tsx',
  examples: [
    {
      title: 'Default',
      preview: (
        <Table className="w-full max-w-lg">
          <TableHeader>
            <TableRow>
              <TableHead>Project</TableHead>
              <TableHead>Owner</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell>Atlas</TableCell>
              <TableCell>Avery</TableCell>
              <TableCell><Badge tone="success" dot>Active</Badge></TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Beacon</TableCell>
              <TableCell>Jordan</TableCell>
              <TableCell><Badge tone="warning" dot>Paused</Badge></TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Cosmo</TableCell>
              <TableCell>Sam</TableCell>
              <TableCell><Badge tone="neutral" dot>Archived</Badge></TableCell>
            </TableRow>
          </TableBody>
        </Table>
      ),
      code: `<Table>
  <TableHeader>
    <TableRow>
      <TableHead>Project</TableHead>
      <TableHead>Owner</TableHead>
      <TableHead>Status</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    <TableRow>
      <TableCell>Atlas</TableCell>
      <TableCell>Avery</TableCell>
      <TableCell><Badge tone="success" dot>Active</Badge></TableCell>
    </TableRow>
  </TableBody>
</Table>`,
    },
  ],
  api: [
    {
      rows: [
        { name: 'Table / TableHeader / TableBody / …', type: 'component', description: 'Thin styled wrappers around the corresponding HTML elements.' },
        { name: 'TableSortHeader', type: 'component', description: 'Header cell with built-in asc/desc/none cycle button.' },
      ],
    },
  ],
  related: [
    { slug: 'data-grid', reason: 'For sortable, filterable tables.' },
  ],
};

export default doc;
