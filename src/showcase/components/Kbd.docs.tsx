import { Kbd } from '@/components/ui/Kbd';
import type { ComponentDoc } from '../registry/types';

const doc: ComponentDoc = {
  slug: 'kbd',
  name: 'Kbd',
  group: 'Typography',
  description:
    'Renders a single key cap. Use to label keyboard shortcuts inside menus, tooltips, and help text.',
  exports: ['Kbd'],
  sourceFile: 'Kbd.tsx',
  examples: [
    {
      title: 'Default',
      preview: (
        <div className="flex items-center gap-2 text-sm">
          Open palette:{' '}
          <Kbd>⌘</Kbd>
          <span className="text-foreground-subtle">+</span>
          <Kbd>K</Kbd>
        </div>
      ),
      code: `Open palette: <Kbd>⌘</Kbd> + <Kbd>K</Kbd>`,
    },
  ],
  api: [
    {
      rows: [
        { name: 'children', type: 'ReactNode', required: true, description: 'Key glyph or label.' },
      ],
    },
  ],
};

export default doc;
