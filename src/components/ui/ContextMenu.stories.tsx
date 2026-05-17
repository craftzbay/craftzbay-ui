import type { Meta, StoryObj } from '@storybook/react-vite';
import {
  ContextMenu, ContextMenuContent, ContextMenuItem, ContextMenuSeparator,
  ContextMenuShortcut, ContextMenuTrigger,
} from './ContextMenu';

const meta: Meta = { title: 'Overlays/ContextMenu' };
export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: () => (
    <ContextMenu>
      <ContextMenuTrigger asChild>
        <div className="flex h-32 w-72 items-center justify-center rounded-md border border-dashed border-border text-sm text-foreground-muted">
          Right-click here
        </div>
      </ContextMenuTrigger>
      <ContextMenuContent>
        <ContextMenuItem>Cut<ContextMenuShortcut>⌘X</ContextMenuShortcut></ContextMenuItem>
        <ContextMenuItem>Copy<ContextMenuShortcut>⌘C</ContextMenuShortcut></ContextMenuItem>
        <ContextMenuItem>Paste<ContextMenuShortcut>⌘V</ContextMenuShortcut></ContextMenuItem>
        <ContextMenuSeparator />
        <ContextMenuItem>Inspect element</ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  ),
};
