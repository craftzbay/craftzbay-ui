import { RelativeTime } from '@/components/ui/RelativeTime';
import { DesignSystemProvider } from '@/components/ui/DesignSystemProvider';
import { mnStrings } from '@/lib/strings.mn';
import type { ComponentDoc } from '../registry/types';

const NOW = new Date('2026-08-21T09:00:00Z');
const ago = (ms: number) => new Date(NOW.getTime() - ms);
const MIN = 60_000;
const HOUR = 60 * MIN;
const DAY = 24 * HOUR;

const doc: ComponentDoc = {
  slug: 'relative-time',
  name: 'RelativeTime',
  group: 'Data Display',
  description:
    'A `<time>` that reads "5 min ago" with the absolute timestamp as its tooltip and a machine-readable `dateTime`. Past 30 days it falls back to the absolute date so text never goes stale.',
  exports: ['RelativeTime'],
  sourceFile: 'RelativeTime.tsx',
  i18n: 'Reads `relativeTime.justNow` / `minutesAgo` / `hoursAgo` / `daysAgo` / `inMinutes` / `inHours` / `inDays`.',
  examples: [
    {
      title: 'Default',
      description:
        'Hover for the absolute time. `now` is pinned here so the docs are deterministic — omit it in apps.',
      preview: (
        <ul className="space-y-1 text-sm">
          <li>
            <RelativeTime date={ago(20_000)} now={NOW} />
          </li>
          <li>
            <RelativeTime date={ago(5 * MIN)} now={NOW} />
          </li>
          <li>
            <RelativeTime date={ago(3 * HOUR)} now={NOW} />
          </li>
          <li>
            <RelativeTime date={ago(6 * DAY)} now={NOW} />
          </li>
          <li>
            <RelativeTime date={ago(45 * DAY)} now={NOW} />
          </li>
          <li>
            <RelativeTime date={new Date(NOW.getTime() + 2 * HOUR)} now={NOW} />
          </li>
        </ul>
      ),
      code: `<RelativeTime date={post.createdAt} />
// → <time dateTime="2026-08-21T08:55:00.000Z" title="2026-08-21 16:55">5 min ago</time>`,
    },
    {
      title: 'Localised + custom absolute format',
      description:
        'Strings come from the nearest DesignSystemProvider; `absolute` controls the tooltip (same options as `formatDate`).',
      preview: (
        <DesignSystemProvider strings={mnStrings}>
          <p className="text-sm">
            Сүүлд зассан:{' '}
            <RelativeTime
              date={ago(3 * HOUR)}
              now={NOW}
              absolute={{ pattern: 'yyyy.MM.dd HH:mm' }}
            />
          </p>
        </DesignSystemProvider>
      ),
      code: `<DesignSystemProvider strings={mnStrings}>
  <RelativeTime date={updatedAt} absolute={{ pattern: 'yyyy.MM.dd HH:mm' }} />
</DesignSystemProvider>`,
    },
  ],
  accessibility: [
    'Renders a native <time> with `dateTime`, so assistive tech and crawlers get the exact instant.',
    'The label does not tick live — re-render on your own interval (e.g. every minute) if a list stays open for long.',
  ],
  guidelines: {
    do: ['Use in activity feeds, comment threads, "last synced" indicators.'],
    dont: [
      'Use for deadlines or schedules — show the absolute date with formatDate instead.',
      'Render without a `now` in tests/SSR snapshots; pass one for stable output.',
    ],
  },
  related: [
    { slug: 'format', reason: '`formatDate` powers the tooltip.' },
    { slug: 'timeline', reason: 'Event lists that typically use relative timestamps.' },
  ],
};

export default doc;
