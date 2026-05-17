import type { TemplateDoc } from '../registry/types';

const doc: TemplateDoc = {
  slug: 'data-table',
  name: 'Data table page',
  description: 'Filter bar + search + bulk-action toolbar + DataGrid + Pagination. Generic over your row type — pass columns + a fetcher.',
  exports: ['DataTablePage'],
  sourceFile: 'DataTablePage.tsx',
  previewSlug: 'data-table',
  useCases: ['Project list', 'User management', 'Audit log'],
  examples: [
    {
      title: 'Usage',
      preview: (
        <div className="text-sm text-foreground-muted">
          Open the <a className="text-accent hover:underline" href="#preview/data-table">full-page preview ↗</a>.
        </div>
      ),
      code: `<DataTablePage<Project>
  title="Projects"
  columns={[
    { key: 'name', header: 'Name', sortable: true },
    { key: 'owner', header: 'Owner', sortable: true },
    { key: 'status', header: 'Status', cell: (r) => <Badge>{r.status}</Badge> },
  ]}
  rows={projects}
  filters={[
    { key: 'status', label: 'Status', options: ['Active', 'Paused', 'Archived'] },
  ]}
  bulkActions={[
    { label: 'Archive', onAction: (ids) => api.archive(ids) },
    { label: 'Delete', variant: 'destructive', onAction: (ids) => api.delete(ids) },
  ]}
/>`,
    },
  ],
  api: [
    {
      title: 'DataTablePage<T>',
      rows: [
        { name: 'title', type: 'ReactNode', description: 'Page title.' },
        { name: 'columns', type: 'DataGridColumn<T>[]', required: true, description: 'Column descriptors.' },
        { name: 'rows', type: 'T[]', required: true, description: 'Row data.' },
        { name: 'filters', type: 'FilterDescriptor[]', description: 'Filter chips in the toolbar.' },
        { name: 'bulkActions', type: 'BulkAction[]', description: 'Actions shown when rows are selected.' },
        { name: 'onSearch', type: '(q: string) => void', description: 'Search query handler.' },
        { name: 'pageSize', type: 'number', default: '20', description: 'Rows per page.' },
      ],
    },
  ],
};

export default doc;
