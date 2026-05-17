import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import type { ComponentDoc } from '../registry/types';

const doc: ComponentDoc = {
  slug: 'breadcrumbs',
  name: 'Breadcrumbs',
  group: 'Navigation',
  description:
    'Linear path trail. Use only when the user is more than two levels deep in a hierarchy. Overflowing trails collapse with an ellipsis.',
  exports: ['Breadcrumbs'],
  sourceFile: 'Breadcrumbs.tsx',
  examples: [
    {
      title: 'Default',
      preview: (
        <Breadcrumbs
          items={[
            { label: 'Workspace', href: '#' },
            { label: 'Projects', href: '#' },
            { label: 'Atlas' },
          ]}
        />
      ),
      code: `<Breadcrumbs
  items={[
    { label: 'Workspace', href: '/' },
    { label: 'Projects', href: '/projects' },
    { label: 'Atlas' }, // last item has no href
  ]}
/>`,
    },
    {
      title: 'Overflow ellipsis',
      preview: (
        <Breadcrumbs
          items={[
            { label: 'Org', href: '#' },
            { label: 'Workspace', href: '#' },
            { label: 'Projects', href: '#' },
            { label: 'Frontend', href: '#' },
            { label: 'Atlas', href: '#' },
            { label: 'Settings' },
          ]}
        />
      ),
      code: `<Breadcrumbs items={[…6 items…]} /> /* auto-collapses middle */`,
    },
  ],
  api: [
    {
      rows: [
        { name: 'items', type: 'Array<{ label: ReactNode; href?: string }>', required: true, description: 'Trail items. The last item should omit href.' },
        { name: 'maxItems', type: 'number', default: '4', description: 'Collapse threshold.' },
      ],
    },
  ],
  accessibility: [
    'Renders as <nav aria-label="Breadcrumb"> with an <ol>.',
    'Current page sets aria-current="page".',
  ],
};

export default doc;
