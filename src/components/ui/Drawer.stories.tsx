import type { Meta, StoryObj } from '@storybook/react-vite';
import { Button } from './Button';
import { Drawer, DrawerContent, DrawerDescription, DrawerFooter, DrawerHeader, DrawerTitle, DrawerTrigger } from './Drawer';

const meta: Meta = {
  title: 'Overlays/Drawer',
};
export default meta;
type Story = StoryObj;

function Variant({ direction }: { direction: 'top' | 'right' | 'bottom' | 'left' }) {
  return (
    <Drawer direction={direction}>
      <DrawerTrigger asChild>
        <Button variant="outline">{direction}</Button>
      </DrawerTrigger>
      <DrawerContent direction={direction}>
        <DrawerHeader>
          <DrawerTitle>Move to project</DrawerTitle>
          <DrawerDescription>Pick a destination for the selected items.</DrawerDescription>
        </DrawerHeader>
        <div className="px-4 pb-2 text-sm text-foreground-muted">(Body content goes here.)</div>
        <DrawerFooter>
          <Button>Move</Button>
          <Button variant="outline">Cancel</Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}

export const Default: Story = {
  render: () => <Variant direction="bottom" />,
};

export const Directions: Story = {
  render: () => (
    <div className="flex gap-3">
      <Variant direction="left" />
      <Variant direction="right" />
      <Variant direction="top" />
      <Variant direction="bottom" />
    </div>
  ),
};
