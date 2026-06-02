import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/DropdownMenu';
import { Button } from '@/components/ui/Button';
import type { ComponentDoc } from '../registry/types';

const doc: ComponentDoc = {
  slug: 'dropdown-menu',
  name: 'DropdownMenu',
  group: 'Overlays',
  description:
    'Action menu opened from a trigger button. Supports labels, separators, keyboard shortcuts, submenus. For ⌘K-style quick actions, use CommandPalette.',
  exports: ['DropdownMenu', 'DropdownMenuTrigger', 'DropdownMenuContent', 'DropdownMenuItem', 'DropdownMenuLabel', 'DropdownMenuSeparator'],
  sourceFile: 'DropdownMenu.tsx',
  examples: [
    {
      title: 'Basic',
      preview: (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">Actions</Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuLabel>Project</DropdownMenuLabel>
            <DropdownMenuItem>Rename</DropdownMenuItem>
            <DropdownMenuItem>Duplicate</DropdownMenuItem>
            <DropdownMenuItem>Archive</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-danger-text">Delete</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
      code: `<DropdownMenu>
  <DropdownMenuTrigger asChild>
    <Button>Actions</Button>
  </DropdownMenuTrigger>
  <DropdownMenuContent>
    <DropdownMenuLabel>Project</DropdownMenuLabel>
    <DropdownMenuItem>Rename</DropdownMenuItem>
    <DropdownMenuItem>Duplicate</DropdownMenuItem>
    <DropdownMenuSeparator />
    <DropdownMenuItem className="text-danger-text">Delete</DropdownMenuItem>
  </DropdownMenuContent>
</DropdownMenu>`,
    },
  ],
  api: [
    {
      title: 'DropdownMenuContent',
      rows: [
        { name: 'side', type: `'top' | 'right' | 'bottom' | 'left'`, default: `'bottom'`, description: 'Anchor side.' },
        { name: 'align', type: `'start' | 'center' | 'end'`, default: `'start'`, description: 'Alignment.' },
      ],
    },
    {
      title: 'DropdownMenuItem',
      rows: [
        { name: 'onSelect', type: '(e: Event) => void', description: 'Fires on click / Enter / Space.' },
        { name: 'disabled', type: 'boolean', default: 'false', description: 'Skip in keyboard nav.' },
      ],
    },
  ],
  accessibility: [
    'Backed by @radix-ui/react-dropdown-menu — arrow-key navigation, type-ahead, submenu Right/Left.',
    'Esc closes; focus returns to the trigger.',
  ],
  related: [
    { slug: 'context-menu', reason: 'Same menu, opened from right-click.' },
    { slug: 'command-palette', reason: 'For searchable command surfaces.' },
  ],
};

export default doc;
