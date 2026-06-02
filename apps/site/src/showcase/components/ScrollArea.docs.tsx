import { ScrollArea } from '@/components/ui/ScrollArea';
import type { ComponentDoc } from '../registry/types';

const doc: ComponentDoc = {
  slug: 'scroll-area',
  name: 'ScrollArea',
  group: 'Layout',
  description:
    'Cross-browser styled scrollbars in a fixed-size area. Falls back to native scrollbars on touch devices.',
  exports: ['ScrollArea'],
  sourceFile: 'ScrollArea.tsx',
  examples: [
    {
      title: 'Vertical list',
      preview: (
        <ScrollArea className="h-48 w-full max-w-sm rounded-md border border-border p-3">
          <ul className="space-y-1 text-sm">
            {Array.from({ length: 30 }).map((_, i) => (
              <li key={i}>Row #{i + 1}</li>
            ))}
          </ul>
        </ScrollArea>
      ),
      code: `<ScrollArea className="h-48 rounded-md border border-border p-3">
  <ul className="space-y-1 text-sm">
    {rows.map((r) => <li key={r.id}>{r.label}</li>)}
  </ul>
</ScrollArea>`,
    },
  ],
  api: [
    {
      rows: [
        { name: 'className', type: 'string', description: 'Apply fixed height / width to enable scrolling.' },
        { name: 'children', type: 'ReactNode', description: 'Scrollable content.' },
      ],
    },
  ],
  accessibility: [
    'Backed by @radix-ui/react-scroll-area — proper keyboard scrolling and momentum on macOS / iOS.',
  ],
};

export default doc;
