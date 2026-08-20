import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/Sheet';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select, SelectContent, SelectItem, SelectTrigger } from '@/components/ui/Select';
import { Checkbox } from '@/components/ui/Checkbox';
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
      title: 'Filters panel',
      description: 'The most common shape: header, a short form, and a footer with the actions.',
      preview: (
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline">Open filters</Button>
          </SheetTrigger>
          <SheetContent side="right">
            <SheetHeader>
              <SheetTitle>Filters</SheetTitle>
              <SheetDescription>
                Narrow down the order list. Filters apply on save.
              </SheetDescription>
            </SheetHeader>
            <div className="flex flex-col gap-4 py-4">
              <Input label="Customer" placeholder="Search by name or email" />
              <Select defaultValue="any">
                <SelectTrigger placeholder="Status" />
                <SelectContent>
                  <SelectItem value="any">Any status</SelectItem>
                  <SelectItem value="paid">Paid</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="refunded">Refunded</SelectItem>
                </SelectContent>
              </Select>
              <div className="flex flex-col gap-2">
                <Checkbox label="Only orders over $100" />
                <Checkbox label="Include archived" />
              </div>
            </div>
            <SheetFooter>
              <SheetClose asChild>
                <Button variant="outline">Cancel</Button>
              </SheetClose>
              <SheetClose asChild>
                <Button>Apply filters</Button>
              </SheetClose>
            </SheetFooter>
          </SheetContent>
        </Sheet>
      ),
      code: `<Sheet>
  <SheetTrigger asChild>
    <Button variant="outline">Open filters</Button>
  </SheetTrigger>
  <SheetContent side="right">
    <SheetHeader>
      <SheetTitle>Filters</SheetTitle>
      <SheetDescription>Narrow down the order list. Filters apply on save.</SheetDescription>
    </SheetHeader>
    <div className="flex flex-col gap-4 py-4">
      <Input label="Customer" placeholder="Search by name or email" />
      <Select defaultValue="any">
        <SelectTrigger placeholder="Status" />
        <SelectContent>
          <SelectItem value="any">Any status</SelectItem>
          <SelectItem value="paid">Paid</SelectItem>
          <SelectItem value="pending">Pending</SelectItem>
          <SelectItem value="refunded">Refunded</SelectItem>
        </SelectContent>
      </Select>
      <Checkbox label="Only orders over $100" />
      <Checkbox label="Include archived" />
    </div>
    <SheetFooter>
      <SheetClose asChild><Button variant="outline">Cancel</Button></SheetClose>
      <SheetClose asChild><Button>Apply filters</Button></SheetClose>
    </SheetFooter>
  </SheetContent>
</Sheet>`,
    },
    {
      title: 'Sides',
      description:
        'Anchor to any edge. Right is the desktop default; bottom suits mobile (or use Drawer).',
      preview: (
        <div className="flex flex-wrap gap-2">
          {(['left', 'right', 'top', 'bottom'] as const).map((side) => (
            <Sheet key={side}>
              <SheetTrigger asChild>
                <Button variant="outline" size="sm">
                  {side}
                </Button>
              </SheetTrigger>
              <SheetContent side={side}>
                <SheetHeader>
                  <SheetTitle>From the {side}</SheetTitle>
                  <SheetDescription>
                    Edge-anchored panel sliding in from the {side}.
                  </SheetDescription>
                </SheetHeader>
                <p className="text-foreground-muted py-4 text-sm">
                  Put filters, contextual settings, or a compact navigation menu here. The panel
                  traps focus like a Dialog and closes with Esc or the X.
                </p>
              </SheetContent>
            </Sheet>
          ))}
        </div>
      ),
      code: `<Sheet>
  <SheetTrigger asChild><Button>Open</Button></SheetTrigger>
  <SheetContent side="right">
    <SheetHeader>
      <SheetTitle>Filters</SheetTitle>
      <SheetDescription>Edge-anchored panel.</SheetDescription>
    </SheetHeader>
    <p className="py-4 text-sm text-foreground-muted">Panel content…</p>
  </SheetContent>
</Sheet>`,
    },
  ],
  api: [
    {
      title: 'SheetContent',
      rows: [
        {
          name: 'side',
          type: `'left' | 'right' | 'top' | 'bottom'`,
          default: `'right'`,
          description: 'Edge to anchor to.',
        },
        { name: 'showClose', type: 'boolean', default: 'true', description: 'Render the close X.' },
      ],
    },
  ],
  accessibility: [
    'Same focus management as Dialog (Radix-backed).',
    'On mobile, prefer Drawer for bottom-side panels with drag-to-dismiss.',
  ],
  keyboard: [
    {
      key: 'Tab / Shift+Tab',
      action: 'Cycle focus inside the panel — focus is trapped while open.',
    },
    { key: 'Esc', action: 'Close the sheet and return focus to the trigger.' },
    {
      key: 'Enter / Space',
      action: 'Activate the focused control (trigger, close button, footer actions).',
    },
  ],
  related: [
    { slug: 'dialog', reason: 'Centered modal alternative.' },
    { slug: 'drawer', reason: 'Touch-first bottom sheet.' },
  ],
};

export default doc;
