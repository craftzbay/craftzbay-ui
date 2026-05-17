import type { Meta, StoryObj } from '@storybook/react-vite';
import { Button } from './Button';
import { Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from './Sheet';

const meta: Meta = { title: 'Overlays/Sheet' };
export default meta;
type Story = StoryObj;

function Variant({ side }: { side: 'left' | 'right' | 'top' | 'bottom' }) {
  return (
    <Sheet>
      <SheetTrigger asChild><Button variant="outline">{side}</Button></SheetTrigger>
      <SheetContent side={side}>
        <SheetHeader>
          <SheetTitle>Filters</SheetTitle>
          <SheetDescription>Narrow down the project list.</SheetDescription>
        </SheetHeader>
        <div className="p-4 text-sm text-foreground-muted">Body</div>
        <SheetFooter className="px-4 pb-4"><Button>Apply</Button></SheetFooter>
      </SheetContent>
    </Sheet>
  );
}

export const Sides: Story = {
  render: () => (
    <div className="flex gap-3">
      <Variant side="left" /><Variant side="right" /><Variant side="top" /><Variant side="bottom" />
    </div>
  ),
};
