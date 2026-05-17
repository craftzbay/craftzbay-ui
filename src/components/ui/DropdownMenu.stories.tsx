import type { Meta, StoryObj } from '@storybook/react-vite';
import { Copy, Edit3, Trash2 } from 'lucide-react';
import { Button } from './Button';
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel,
  DropdownMenuSeparator, DropdownMenuShortcut, DropdownMenuTrigger,
} from './DropdownMenu';

const meta: Meta = { title: 'Overlays/DropdownMenu' };
export default meta;
type Story = StoryObj;

function Menu({ side, align }: { side?: 'top' | 'right' | 'bottom' | 'left'; align?: 'start' | 'center' | 'end' }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm">
          {side ? `side=${side}` : align ? `align=${align}` : 'Actions'}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent side={side} align={align} className="w-56">
        <DropdownMenuLabel>Item</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem><Edit3 className="size-4" />Rename<DropdownMenuShortcut>⌘R</DropdownMenuShortcut></DropdownMenuItem>
        <DropdownMenuItem><Copy className="size-4" />Duplicate<DropdownMenuShortcut>⌘D</DropdownMenuShortcut></DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="text-danger-text"><Trash2 className="size-4" />Delete<DropdownMenuShortcut>⌫</DropdownMenuShortcut></DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export const Default: Story = {
  render: () => <Menu />,
};

export const Sides: Story = {
  render: () => (
    <div className="grid grid-cols-2 gap-4 p-16 sm:grid-cols-4">
      {(['top', 'right', 'bottom', 'left'] as const).map((s) => <Menu key={s} side={s} />)}
    </div>
  ),
};

export const Aligns: Story = {
  render: () => (
    <div className="flex flex-wrap gap-4 p-8">
      {(['start', 'center', 'end'] as const).map((a) => <Menu key={a} align={a} />)}
    </div>
  ),
};
