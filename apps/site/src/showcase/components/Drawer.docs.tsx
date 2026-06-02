import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerTrigger } from '@/components/ui/Drawer';
import { Button } from '@/components/ui/Button';
import type { ComponentDoc } from '../registry/types';

const doc: ComponentDoc = {
  slug: 'drawer',
  name: 'Drawer',
  group: 'Overlays',
  description:
    'Bottom-anchored sheet with drag-to-dismiss. Native-feeling on mobile (powered by Vaul). Use for quick actions, image previews, comment composers.',
  exports: ['Drawer', 'DrawerTrigger', 'DrawerContent', 'DrawerHeader', 'DrawerTitle'],
  sourceFile: 'Drawer.tsx',
  examples: [
    {
      title: 'Basic',
      preview: (
        <Drawer>
          <DrawerTrigger asChild>
            <Button variant="outline">Open drawer</Button>
          </DrawerTrigger>
          <DrawerContent>
            <DrawerHeader>
              <DrawerTitle>Quick action</DrawerTitle>
            </DrawerHeader>
            <div className="p-4 text-sm text-foreground-muted">
              Drag the handle (or background) down to dismiss.
            </div>
          </DrawerContent>
        </Drawer>
      ),
      code: `<Drawer>
  <DrawerTrigger asChild>
    <Button>Open drawer</Button>
  </DrawerTrigger>
  <DrawerContent>
    <DrawerHeader>
      <DrawerTitle>Quick action</DrawerTitle>
    </DrawerHeader>
  </DrawerContent>
</Drawer>`,
    },
  ],
  api: [
    {
      rows: [
        { name: 'open', type: 'boolean', description: 'Controlled open state.' },
        { name: 'onOpenChange', type: '(open: boolean) => void', description: 'Fires when open changes.' },
        { name: 'shouldScaleBackground', type: 'boolean', default: 'true', description: 'iOS-style background scale.' },
      ],
    },
  ],
  accessibility: [
    'Backed by Vaul which uses Radix Dialog under the hood — focus trap + Esc + click-outside.',
    'Drag handle is exposed as a button; can be dragged or clicked.',
  ],
  related: [
    { slug: 'sheet', reason: 'For non-touch side panels.' },
    { slug: 'dialog', reason: 'For centered modals.' },
  ],
};

export default doc;
