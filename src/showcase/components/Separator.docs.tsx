import { Separator } from '@/components/ui/Separator';
import type { ComponentDoc } from '../registry/types';

const doc: ComponentDoc = {
  slug: 'separator',
  name: 'Separator',
  group: 'Layout',
  description:
    'Hairline divider for grouping content. Decorative by default — set decorative={false} to make it semantic for screen readers.',
  exports: ['Separator'],
  sourceFile: 'Separator.tsx',
  examples: [
    {
      title: 'Horizontal',
      preview: (
        <div className="w-full max-w-sm space-y-2 text-sm">
          <p>Above the line.</p>
          <Separator />
          <p>Below the line.</p>
        </div>
      ),
      code: `<Separator />`,
    },
    {
      title: 'Vertical',
      preview: (
        <div className="flex h-12 items-center gap-3 text-sm">
          <span>Item A</span>
          <Separator orientation="vertical" />
          <span>Item B</span>
          <Separator orientation="vertical" />
          <span>Item C</span>
        </div>
      ),
      code: `<Separator orientation="vertical" />`,
    },
  ],
  api: [
    {
      rows: [
        { name: 'orientation', type: `'horizontal' | 'vertical'`, default: `'horizontal'`, description: 'Layout direction.' },
        { name: 'decorative', type: 'boolean', default: 'true', description: 'When false, exposes role="separator" to a11y tree.' },
      ],
    },
  ],
};

export default doc;
