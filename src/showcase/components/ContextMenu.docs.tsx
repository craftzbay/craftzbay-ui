import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuTrigger,
} from '@/components/ui/ContextMenu';
import type { ComponentDoc } from '../registry/types';

const doc: ComponentDoc = {
  slug: 'context-menu',
  name: 'ContextMenu',
  group: 'Overlays',
  description:
    'Right-click menu. Same API surface as DropdownMenu; trigger is whatever element the user right-clicks on.',
  exports: ['ContextMenu', 'ContextMenuTrigger', 'ContextMenuContent', 'ContextMenuItem', 'ContextMenuSeparator'],
  sourceFile: 'ContextMenu.tsx',
  examples: [
    {
      title: 'Right-click target',
      preview: (
        <ContextMenu>
          <ContextMenuTrigger asChild>
            <div className="flex h-24 w-full max-w-md items-center justify-center rounded-md border border-dashed border-border text-xs text-foreground-muted">
              Right-click anywhere in this box
            </div>
          </ContextMenuTrigger>
          <ContextMenuContent>
            <ContextMenuItem>Cut</ContextMenuItem>
            <ContextMenuItem>Copy</ContextMenuItem>
            <ContextMenuItem>Paste</ContextMenuItem>
            <ContextMenuSeparator />
            <ContextMenuItem className="text-danger-text">Delete</ContextMenuItem>
          </ContextMenuContent>
        </ContextMenu>
      ),
      code: `<ContextMenu>
  <ContextMenuTrigger asChild>
    <div>Right-click me</div>
  </ContextMenuTrigger>
  <ContextMenuContent>
    <ContextMenuItem>Cut</ContextMenuItem>
    <ContextMenuItem>Copy</ContextMenuItem>
    <ContextMenuItem>Paste</ContextMenuItem>
  </ContextMenuContent>
</ContextMenu>`,
    },
  ],
  accessibility: [
    'Triggerable via Shift+F10 / context-menu keyboard key for keyboard users.',
    'Backed by @radix-ui/react-context-menu.',
  ],
  related: [
    { slug: 'dropdown-menu', reason: 'For explicit-trigger menus.' },
  ],
};

export default doc;
