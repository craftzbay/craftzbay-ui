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

export const Sides: Story = {
  render: () => (
    <div className="grid place-items-center gap-12 p-16">
      <div className="grid grid-cols-3 gap-12">
        {(['top', 'right', 'bottom', 'left'] as const).map((side) => (
          <Popover key={side}>
            <PopoverTrigger asChild>
              <Button variant="outline" size="sm">side={side}</Button>
            </PopoverTrigger>
            <PopoverContent side={side} className="w-48 text-sm">
              I open on the <strong>{side}</strong>.
            </PopoverContent>
          </Popover>
        ))}
      </div>
    </div>
  ),
};

export const Aligns: Story = {
  render: () => (
    <div className="flex flex-wrap gap-4 p-8">
      {(['start', 'center', 'end'] as const).map((align) => (
        <Popover key={align}>
          <PopoverTrigger asChild>
            <Button variant="outline" size="sm">align={align}</Button>
          </PopoverTrigger>
          <PopoverContent side="bottom" align={align} className="w-48 text-sm">
            Aligned to <strong>{align}</strong>.
          </PopoverContent>
        </Popover>
      ))}
    </div>
  ),
};
