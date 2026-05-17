import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/Sheet';
import { Button } from '@/components/ui/Button';
import type { ComponentDoc } from '../registry/types';

const doc: ComponentDoc = {
  slug: 'sheet',
  name: 'Sheet',
  group: 'Overlays',
  description:
    'Edge-anchored modal panel. Use for filters, contextual settings, mobile-friendly menus — anything that benefits from staying anchored to a screen edge.',
  exports: ['Sheet', 'SheetTrigger', 'SheetContent', 'SheetHeader', 'SheetTitle', 'SheetClose'],
  sourceFile: 'Sheet.tsx',
  examples: [
    {
      title: 'Sides',
      preview: (
        <div className="flex flex-wrap gap-2">
          {(['left', 'right', 'top', 'bottom'] as const).map((side) => (
            <Sheet key={side}>
              <SheetTrigger asChild>
                <Button variant="outline" size="sm">{side}</Button>
              </SheetTrigger>
              <SheetContent side={side}>
                <SheetHeader><SheetTitle>From the {side}</SheetTitle></SheetHeader>
              </SheetContent>
            </Sheet>
          ))}
        </div>
      ),
      code: `<Sheet>
  <SheetTrigger asChild><Button>Open</Button></SheetTrigger>
  <SheetContent side="right">
    <SheetHeader><SheetTitle>Filters</SheetTitle></SheetHeader>
  </SheetContent>
</Sheet>`,
    },
  ],
  api: [
    {
      title: 'SheetContent',
      rows: [
        { name: 'side', type: `'left' | 'right' | 'top' | 'bottom'`, default: `'right'`, description: 'Edge to anchor to.' },
        { name: 'showClose', type: 'boolean', default: 'true', description: 'Render the close X.' },
      ],
    },
  ],
  accessibility: [
    'Same focus management as Dialog (Radix-backed).',
    'On mobile, prefer Drawer for bottom-side panels with drag-to-dismiss.',
  ],
  related: [
    { slug: 'dialog', reason: 'Centered modal alternative.' },
    { slug: 'drawer', reason: 'Touch-first bottom sheet.' },
  ],
};

export default doc;
