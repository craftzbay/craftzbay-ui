import type { Meta, StoryObj } from '@storybook/react-vite';
import { Button } from './Button';
import { Popover, PopoverContent, PopoverTrigger } from './Popover';

const meta: Meta = { title: 'Overlays/Popover' };
export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: () => (
    <Popover>
      <PopoverTrigger asChild><Button variant="outline">Open popover</Button></PopoverTrigger>
      <PopoverContent className="w-72">
        <p className="text-sm font-medium">Quick note</p>
        <p className="mt-1 text-sm text-foreground-muted">
          Popovers are non-modal — clicking outside closes them.
        </p>
      </PopoverContent>
    </Popover>
  ),
};
