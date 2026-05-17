import { Folder, Plus } from '@/icons';
import { EmptyState } from '@/components/ui/EmptyState';
import { Button } from '@/components/ui/Button';
import * as Illustrations from '@/illustrations';
import type { ComponentDoc } from '../registry/types';

const doc: ComponentDoc = {
  slug: 'empty-state',
  name: 'EmptyState',
  group: 'Feedback',
  description:
    'Friendly "nothing here yet" panel. Always pair with at least one next-step action — empty + no action is a dead end.',
  exports: ['EmptyState'],
  sourceFile: 'EmptyState.tsx',
  examples: [
    {
      title: 'With icon + action',
      preview: (
        <EmptyState
          icon={<Folder className="size-6" />}
          title="No projects yet"
          description="Create your first project to get started."
          action={<Button size="sm" leadingIcon={<Plus />}>New project</Button>}
        />
      ),
      code: `<EmptyState
  icon={<Folder className="size-6" />}
  title="No projects yet"
  description="Create your first project to get started."
  action={<Button size="sm" leadingIcon={<Plus />}>New project</Button>}
/>`,
    },
    {
      title: 'With illustration',
      description: 'Use one of the built-in line illustrations for a softer, more on-brand empty state.',
      preview: (
        <EmptyState
          icon={<Illustrations.InboxEmpty className="size-32" />}
          title="Inbox zero"
          description="You're all caught up. Take a breath."
        />
      ),
      code: `import { Illustrations } from '@craftzbay/ui';

<EmptyState
  icon={<Illustrations.InboxEmpty className="size-32" />}
  title="Inbox zero"
  description="You're all caught up. Take a breath."
/>`,
    },
  ],
  api: [
    {
      rows: [
        { name: 'title', type: 'ReactNode', required: true, description: 'Primary line.' },
        { name: 'description', type: 'ReactNode', description: 'Body copy.' },
        { name: 'icon', type: 'ReactNode', description: 'Icon or illustration above the title.' },
        { name: 'action', type: 'ReactNode', description: 'Primary CTA — usually a Button.' },
      ],
    },
  ],
  related: [
    { slug: 'error-state', reason: 'For error / 404 / 500 scenarios.' },
  ],
};

export default doc;
