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
    'Friendly "nothing here yet" panel. Defaults to the built-in InboxEmpty line illustration; pass `icon` for a compact look or `illustration` to swap in another one. Always pair with at least one next-step action.',
  exports: ['EmptyState'],
  sourceFile: 'EmptyState.tsx',
  examples: [
    {
      title: 'Default (built-in illustration)',
      description: 'No icon or illustration prop — falls back to the InboxEmpty line illustration.',
      preview: (
        <EmptyState
          title="No projects yet"
          description="Create your first project to get started."
          action={<Button size="sm" leadingIcon={<Plus />}>New project</Button>}
        />
      ),
      code: `<EmptyState
  title="No projects yet"
  description="Create your first project to get started."
  action={<Button size="sm" leadingIcon={<Plus />}>New project</Button>}
/>`,
    },
    {
      title: 'Compact (icon)',
      description: 'Pass `icon` for a small Lucide glyph in a 48 px circular container. Use for table cells and sidebar panes.',
      preview: (
        <EmptyState
          icon={<Folder className="size-6" />}
          title="No items"
          description="Drag a file in or create one."
        />
      ),
      code: `<EmptyState
  icon={<Folder className="size-6" />}
  title="No items"
  description="Drag a file in or create one."
/>`,
    },
    {
      title: 'Custom illustration',
      description: 'Use any of the built-in line illustrations via the `Illustrations` namespace.',
      preview: (
        <EmptyState
          illustration={<Illustrations.NoSearchResults className="size-32" />}
          title="No results"
          description="Try a different search term or clear your filters."
        />
      ),
      code: `import { Illustrations } from '@craftzbay/ui';

<EmptyState
  illustration={<Illustrations.NoSearchResults className="size-32" />}
  title="No results"
  description="Try a different search term or clear your filters."
/>`,
    },
  ],
  api: [
    {
      rows: [
        { name: 'title', type: 'ReactNode', required: true, description: 'Primary line.' },
        { name: 'description', type: 'ReactNode', description: 'Body copy.' },
        { name: 'illustration', type: 'ReactNode', description: 'Full-size illustration. Takes precedence over `icon`. If neither is set, the default InboxEmpty illustration is used.' },
        { name: 'icon', type: 'ReactNode', description: 'Small Lucide-sized icon in a 48 px circular container.' },
        { name: 'action', type: 'ReactNode', description: 'Primary CTA — usually a Button.' },
        { name: 'secondaryAction', type: 'ReactNode', description: 'Optional secondary action next to the primary.' },
      ],
    },
  ],
  related: [
    { slug: 'error-state', reason: 'For error / 404 / 500 scenarios.' },
  ],
};

export default doc;
