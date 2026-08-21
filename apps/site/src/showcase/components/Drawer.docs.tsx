import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/Drawer';
import { Button } from '@/components/ui/Button';
import type { ComponentDoc } from '../registry/types';

const doc: ComponentDoc = {
  slug: 'drawer',
  name: 'Drawer',
  group: 'Overlays',
  description:
    'Drag-to-dismiss panel anchored to any edge (bottom by default). Native-feeling on mobile (powered by Vaul). Use for quick actions, image previews, comment composers; prefer Sheet for desktop side panels.',
  exports: [
    'Drawer',
    'DrawerTrigger',
    'DrawerContent',
    'DrawerHeader',
    'DrawerFooter',
    'DrawerTitle',
    'DrawerDescription',
    'DrawerClose',
  ],
  i18n: 'Reads `drawer.close` (aria-label of the built-in close button).',
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
            <div className="text-foreground-muted p-4 text-sm">
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
    {
      title: 'Direction + close button',
      description:
        'Set `direction` on the root (`left` / `right` / `top` / `bottom`) — DrawerContent reads it for the slide-in side and handle placement. `showClose` (default true) renders an explicit close button; turn it off for bottom drawers where the drag handle is enough.',
      preview: (
        <div className="flex flex-wrap gap-2">
          <Drawer direction="right">
            <DrawerTrigger asChild>
              <Button variant="outline">From the right</Button>
            </DrawerTrigger>
            <DrawerContent>
              <DrawerHeader>
                <DrawerTitle>Filters</DrawerTitle>
                <DrawerDescription>Swipe right or press Esc to close.</DrawerDescription>
              </DrawerHeader>
            </DrawerContent>
          </Drawer>
          <Drawer>
            <DrawerTrigger asChild>
              <Button variant="outline">No close button</Button>
            </DrawerTrigger>
            <DrawerContent showClose={false}>
              <DrawerHeader>
                <DrawerTitle>Share</DrawerTitle>
                <DrawerDescription>Drag the handle down to dismiss.</DrawerDescription>
              </DrawerHeader>
            </DrawerContent>
          </Drawer>
        </div>
      ),
      code: `<Drawer direction="right">
  <DrawerTrigger asChild><Button>Filters</Button></DrawerTrigger>
  <DrawerContent>…</DrawerContent>
</Drawer>

<Drawer>
  <DrawerContent showClose={false}>…</DrawerContent>
</Drawer>`,
    },
  ],
  api: [
    {
      rows: [
        { name: 'open', type: 'boolean', description: 'Controlled open state.' },
        {
          name: 'onOpenChange',
          type: '(open: boolean) => void',
          description: 'Fires when open changes.',
        },
        {
          name: 'shouldScaleBackground',
          type: 'boolean',
          default: 'true',
          description: 'iOS-style background scale.',
        },
      ],
    },
  ],
  accessibility: [
    'Backed by Vaul which uses Radix Dialog under the hood — focus trap + Esc + click-outside.',
    'Drag handle is exposed as a button; can be dragged or clicked.',
  ],
  keyboard: [
    { key: 'Tab / Shift+Tab', action: 'Cycle focus inside the drawer content.' },
    { key: 'Esc', action: 'Close the drawer.' },
    { key: 'Enter / Space', action: 'Activate the focused trigger or action.' },
  ],
  related: [
    { slug: 'sheet', reason: 'For non-touch side panels.' },
    { slug: 'dialog', reason: 'For centered modals.' },
  ],
};

export default doc;
