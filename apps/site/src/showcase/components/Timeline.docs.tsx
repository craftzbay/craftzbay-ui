import { Timeline, TimelineItem, TimelineTitle } from '@/components/ui/Timeline';
import type { ComponentDoc } from '../registry/types';

const doc: ComponentDoc = {
  slug: 'timeline',
  name: 'Timeline',
  group: 'Data Display',
  description:
    'Vertical activity feed with a connecting line. Use for audit logs, version history, project activity.',
  exports: ['Timeline', 'TimelineItem', 'TimelineTitle'],
  sourceFile: 'Timeline.tsx',
  examples: [
    {
      title: 'Default',
      preview: (
        <Timeline className="w-full max-w-sm">
          <TimelineItem>
            <TimelineTitle>Merged PR #142</TimelineTitle>
            <p className="text-foreground-muted text-xs">2 hours ago by Avery</p>
          </TimelineItem>
          <TimelineItem>
            <TimelineTitle>Opened PR #143</TimelineTitle>
            <p className="text-foreground-muted text-xs">3 hours ago by Jordan</p>
          </TimelineItem>
          <TimelineItem isLast>
            <TimelineTitle>Pushed 4 commits to main</TimelineTitle>
            <p className="text-foreground-muted text-xs">yesterday by Sam</p>
          </TimelineItem>
        </Timeline>
      ),
      code: `<Timeline>
  <TimelineItem>
    <TimelineTitle>Merged PR #142</TimelineTitle>
  </TimelineItem>
  <TimelineItem isLast>
    <TimelineTitle>Pushed 4 commits</TimelineTitle>
  </TimelineItem>
</Timeline>`,
    },
  ],
  api: [
    {
      title: 'TimelineItem',
      rows: [
        {
          name: 'isLast',
          type: 'boolean',
          default: 'false',
          description: 'Skips the connector line after this item.',
        },
        {
          name: 'icon',
          type: 'ReactNode',
          description: 'Custom dot / icon (defaults to a small dot).',
        },
      ],
    },
  ],
  accessibility: [
    'Renders an ordered list (<ol>/<li>) so item count and position are announced.',
    'Bullets and connector lines are aria-hidden — put dates and meaning in the item text.',
    'Use <TimelineTitle> for the heading of each item so the list reads as a sequence of events.',
  ],
};

export default doc;
