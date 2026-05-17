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

export const Default: Story = {
  render: () => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild><Button variant="outline">Actions</Button></DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuLabel>Item</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem><Edit3 className="size-4" />Rename<DropdownMenuShortcut>⌘R</DropdownMenuShortcut></DropdownMenuItem>
        <DropdownMenuItem><Copy className="size-4" />Duplicate<DropdownMenuShortcut>⌘D</DropdownMenuShortcut></DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="text-danger-text"><Trash2 className="size-4" />Delete<DropdownMenuShortcut>⌫</DropdownMenuShortcut></DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  ),
};
