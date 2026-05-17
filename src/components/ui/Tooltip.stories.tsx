import type { Meta, StoryObj } from '@storybook/react-vite';
import { IconButton } from './IconButton';
import { Copy, Info } from 'lucide-react';
import { Tooltip, TooltipProvider } from './Tooltip';

const meta: Meta = {
  title: 'Overlays/Tooltip',
  decorators: [(Story) => <TooltipProvider><Story /></TooltipProvider>],
};
export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: () => (
    <Tooltip label="Copy link">
      <IconButton aria-label="Copy" icon={<Copy />} />
    </Tooltip>
  ),
};

export const Sides: Story = {
  render: () => (
    <div className="flex items-center gap-6 p-8">
      {(['top', 'right', 'bottom', 'left'] as const).map((side) => (
        <Tooltip key={side} label={`Side: ${side}`} side={side}>
          <IconButton aria-label={side} icon={<Info />} variant="outline" />
        </Tooltip>
      ))}
    </div>
  ),
};
