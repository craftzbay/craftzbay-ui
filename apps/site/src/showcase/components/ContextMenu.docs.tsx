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
  exports: [
    'ContextMenu',
    'ContextMenuTrigger',
    'ContextMenuContent',
    'ContextMenuItem',
    'ContextMenuCheckboxItem',
    'ContextMenuRadioItem',
    'ContextMenuLabel',
    'ContextMenuSeparator',
  ],
  sourceFile: 'ContextMenu.tsx',
  examples: [
    {
      title: 'Right-click target',
      preview: (
        <ContextMenu>
          <ContextMenuTrigger asChild>
            <div className="border-border text-foreground-muted flex h-24 w-full max-w-md items-center justify-center rounded-md border border-dashed text-xs">
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
  keyboard: [
    {
      key: 'Shift+F10 / Menu',
      action: 'Open the menu from the keyboard on the focused trigger area.',
    },
    { key: 'ArrowDown / ArrowUp', action: 'Move focus to the next / previous item (wraps).' },
    { key: 'Home / End', action: 'Jump to the first / last item.' },
    { key: 'ArrowRight / ArrowLeft', action: 'Open / close a submenu.' },
    { key: 'Enter / Space', action: 'Select the focused item and close the menu.' },
    { key: 'Esc', action: 'Close the menu without selecting.' },
  ],
  related: [{ slug: 'dropdown-menu', reason: 'For explicit-trigger menus.' }],
};

export default doc;
