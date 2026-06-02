import { Badge } from '@/components/ui/Badge';
import type { ComponentDoc } from '../registry/types';

const doc: ComponentDoc = {
  slug: 'badge',
  name: 'Badge',
  group: 'Data Display',
  description:
    'Status pill. 2 visual variants × 6 tones for any combination you need. Use dot for state indicators (online / offline), without dot for counts and version tags.',
  exports: ['Badge'],
  sourceFile: 'Badge.tsx',
  examples: [
    {
      title: 'Subtle (default)',
      preview: (
        <div className="flex flex-wrap items-center gap-2">
          <Badge tone="neutral">Neutral</Badge>
          <Badge tone="accent">Accent</Badge>
          <Badge tone="success">Success</Badge>
          <Badge tone="warning">Warning</Badge>
          <Badge tone="danger">Danger</Badge>
          <Badge tone="info">Info</Badge>
        </div>
      ),
      code: `<Badge tone="neutral">Neutral</Badge>
<Badge tone="success">Success</Badge>
<Badge tone="danger">Danger</Badge>`,
    },
    {
      title: 'Outline',
      preview: (
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="outline" tone="neutral">Neutral</Badge>
          <Badge variant="outline" tone="accent">v0.5</Badge>
          <Badge variant="outline" tone="success">Active</Badge>
          <Badge variant="outline" tone="warning">Pending</Badge>
        </div>
      ),
      code: `<Badge variant="outline" tone="accent">v0.5</Badge>`,
    },
    {
      title: 'With dot',
      preview: (
        <div className="flex flex-wrap items-center gap-2">
          <Badge tone="success" dot>Online</Badge>
          <Badge tone="warning" dot>Idle</Badge>
          <Badge tone="danger" dot>Offline</Badge>
          <Badge tone="neutral" dot>Away</Badge>
        </div>
      ),
      code: `<Badge tone="success" dot>Online</Badge>
<Badge tone="warning" dot>Idle</Badge>`,
    },
  ],
  api: [
    {
      rows: [
        { name: 'variant', type: `'subtle' | 'outline'`, default: `'subtle'`, description: 'Filled vs bordered.' },
        { name: 'tone', type: `'neutral' | 'accent' | 'success' | 'warning' | 'danger' | 'info'`, default: `'neutral'`, description: 'Semantic color.' },
        { name: 'dot', type: 'boolean', default: 'false', description: 'Show a leading status dot.' },
      ],
    },
  ],
};

export default doc;
