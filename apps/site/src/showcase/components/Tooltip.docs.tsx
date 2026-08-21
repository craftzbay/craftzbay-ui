import { Copy, Trash2 } from '@/icons';
import { Tooltip, TooltipProvider } from '@/components/ui/Tooltip';
import { IconButton } from '@/components/ui/IconButton';
import type { ComponentDoc } from '../registry/types';

const doc: ComponentDoc = {
  slug: 'tooltip',
  name: 'Tooltip',
  group: 'Overlays',
  description:
    'Passive hint on hover / focus. Use only for affordance — never put crucial info in a tooltip. Mount one <TooltipProvider> at your app root.',
  exports: ['Tooltip', 'TooltipProvider', 'TooltipTrigger', 'TooltipContent'],
  sourceFile: 'Tooltip.tsx',
  examples: [
    {
      title: 'On icon buttons',
      preview: (
        <TooltipProvider>
          <div className="flex items-center gap-2">
            <Tooltip label="Copy link">
              <IconButton aria-label="Copy" icon={<Copy />} variant="outline" />
            </Tooltip>
            <Tooltip label="Delete project" side="bottom">
              <IconButton aria-label="Delete" icon={<Trash2 />} variant="ghost" />
            </Tooltip>
          </div>
        </TooltipProvider>
      ),
      code: `<TooltipProvider>
  <Tooltip label="Copy link">
    <IconButton aria-label="Copy" icon={<Copy />} variant="outline" />
  </Tooltip>
</TooltipProvider>`,
    },
  ],
  api: [
    {
      title: 'Tooltip',
      rows: [
        { name: 'label', type: 'ReactNode', required: true, description: 'Tooltip body text.' },
        {
          name: 'side',
          type: `'top' | 'right' | 'bottom' | 'left'`,
          default: `'top'`,
          description: 'Anchor side.',
        },
        {
          name: 'align',
          type: `'start' | 'center' | 'end'`,
          default: `'center'`,
          description: 'Alignment.',
        },
        { name: 'delayMs', type: 'number', default: '500', description: 'Open delay.' },
      ],
    },
  ],
  accessibility: [
    'Opens on hover or focus — keyboard users see tooltips too.',
    'Backed by @radix-ui/react-tooltip — proper role + aria-describedby on the trigger.',
  ],
  keyboard: [
    { key: 'Tab', action: 'Focusing the trigger shows the tooltip after `delayDuration`.' },
    { key: 'Esc', action: 'Dismiss the tooltip while it is open.' },
    { key: 'Shift+Tab / Tab', action: 'Blurring the trigger hides the tooltip.' },
  ],
  related: [{ slug: 'popover', reason: 'For interactive overlays.' }],
};

export default doc;
