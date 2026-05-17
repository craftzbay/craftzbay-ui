import type { Meta, StoryObj } from '@storybook/react-vite';
import { Button } from './Button';
import { Drawer, DrawerContent, DrawerDescription, DrawerFooter, DrawerHeader, DrawerTitle, DrawerTrigger } from './Drawer';

const meta: Meta = {
  title: 'Overlays/Drawer',
};
export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: () => (
    <Drawer>
      <DrawerTrigger asChild>
        <Button>Open drawer</Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Move to project</DrawerTitle>
          <DrawerDescription>Pick a destination for the selected items.</DrawerDescription>
        </DrawerHeader>
        <div className="px-4 pb-2 text-sm text-foreground-muted">
          (Body content goes here.)
        </div>
        <DrawerFooter>
          <Button>Move</Button>
          <Button variant="outline">Cancel</Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  ),
};
