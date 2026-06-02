import { useState } from 'react';
import { Pagination } from '@/components/ui/Pagination';
import type { ComponentDoc } from '../registry/types';

function PaginationDemo() {
  const [page, setPage] = useState(3);
  return (
    <Pagination
      page={page}
      pageCount={12}
      totalItems={240}
      pageSize={20}
      onPageChange={setPage}
    />
  );
}

const doc: ComponentDoc = {
  slug: 'pagination',
  name: 'Pagination',
  group: 'Buttons',
  description:
    'Numbered page navigation for long lists. Includes prev/next, ellipses, and a page-size selector. Fully controlled — parent owns page + pageSize.',
  exports: ['Pagination'],
  sourceFile: 'Pagination.tsx',
  examples: [
    {
      title: 'Default',
      preview: <PaginationDemo />,
      code: `const [page, setPage] = useState(1);

<Pagination
  page={page}
  pageCount={12}
  totalItems={240}
  pageSize={20}
  onPageChange={setPage}
/>`,
    },
  ],
  api: [
    {
      rows: [
        { name: 'page', type: 'number', required: true, description: '1-indexed current page.' },
        { name: 'pageCount', type: 'number', required: true, description: 'Total number of pages.' },
        { name: 'totalItems', type: 'number', description: 'Used for the "showing X–Y of N" label.' },
        { name: 'pageSize', type: 'number', description: 'Current items-per-page selection.' },
        { name: 'pageSizeOptions', type: 'number[]', default: '[10, 20, 50, 100]', description: 'Page-size dropdown options.' },
        { name: 'onPageChange', type: '(page: number) => void', required: true, description: 'Fires when prev/next/numbered button is clicked.' },
        { name: 'onPageSizeChange', type: '(size: number) => void', description: 'Fires when the page-size dropdown changes.' },
      ],
    },
  ],
  accessibility: [
    'Renders as a <nav aria-label="Pagination">; current page sets aria-current="page".',
    'Prev/Next buttons disable at the bounds rather than disappearing — preserves layout.',
  ],
  related: [
    { slug: 'data-grid', reason: 'Pair with DataGrid for paginated tables.' },
  ],
};

export default doc;
