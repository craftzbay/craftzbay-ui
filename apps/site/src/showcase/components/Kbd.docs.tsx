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
          Open palette: <Kbd>⌘</Kbd>
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
  accessibility: [
    'Renders a native <kbd> element, which assistive tech announces as keyboard input.',
    'Purely presentational — never make it the only way a shortcut is documented for a focusable control; pair with a Tooltip or visible text.',
    'Compose chords as separate <Kbd> elements so each key is read individually.',
  ],
};

export default doc;
