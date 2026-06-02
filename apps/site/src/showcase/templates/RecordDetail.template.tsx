import type { TemplateDoc } from '../registry/types';

const doc: TemplateDoc = {
  slug: 'record',
  name: 'Record detail',
  description: 'Header with title + metadata + actions, Tabs for related views, optional side panel. Use for any "thing detail page" — user, project, ticket, order.',
  exports: ['RecordDetail'],
  sourceFile: 'RecordDetail.tsx',
  previewSlug: 'record',
  useCases: ['User profile', 'Project overview', 'Ticket detail', 'Order detail'],
  examples: [
    {
      title: 'Usage',
      preview: (
        <div className="text-sm text-foreground-muted">
          Open the <a className="text-accent hover:underline" href="#preview/record">full-page preview ↗</a>.
        </div>
      ),
      code: `<RecordDetail
  header={{
    title: project.name,
    subtitle: \`Created \${formatDate(project.createdAt)}\`,
    status: <Badge tone="success">Active</Badge>,
    actions: <Button>Share</Button>,
  }}
  tabs={[
    { id: 'overview', label: 'Overview', render: () => <Overview /> },
    { id: 'activity', label: 'Activity', render: () => <Activity /> },
    { id: 'files', label: 'Files', render: () => <Files /> },
  ]}
  sidePanel={<RelatedItems />}
/>`,
    },
  ],
};

export default doc;
