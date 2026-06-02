import { Skeleton } from '@/components/ui/Skeleton';
import type { ComponentDoc } from '../registry/types';

const doc: ComponentDoc = {
  slug: 'skeleton',
  name: 'Skeleton',
  group: 'Feedback',
  description:
    'Placeholder shimmer for content that is loading. Compose multiple Skeletons to mirror the eventual layout — preserves perceived speed.',
  exports: ['Skeleton'],
  sourceFile: 'Skeleton.tsx',
  examples: [
    {
      title: 'List item placeholder',
      preview: (
        <div className="flex w-full max-w-md flex-col gap-3">
          {[0, 1, 2].map((i) => (
            <div key={i} className="flex items-center gap-3">
              <Skeleton className="size-9 rounded-full" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-3 w-2/3" />
                <Skeleton className="h-3 w-1/3" />
              </div>
            </div>
          ))}
        </div>
      ),
      code: `<div className="flex items-center gap-3">
  <Skeleton className="size-9 rounded-full" />
  <div className="flex-1 space-y-2">
    <Skeleton className="h-3 w-2/3" />
    <Skeleton className="h-3 w-1/3" />
  </div>
</div>`,
    },
    {
      title: 'Card placeholder',
      preview: (
        <div className="w-full max-w-md space-y-3 rounded-md border border-border bg-card p-4">
          <Skeleton className="h-4 w-1/2" />
          <Skeleton className="h-3 w-full" />
          <Skeleton className="h-3 w-5/6" />
          <Skeleton className="mt-2 h-24 w-full rounded-md" />
        </div>
      ),
      code: `<div className="space-y-3 rounded-md border border-border bg-card p-4">
  <Skeleton className="h-4 w-1/2" />
  <Skeleton className="h-3 w-full" />
  <Skeleton className="h-3 w-5/6" />
  <Skeleton className="mt-2 h-24 w-full rounded-md" />
</div>`,
    },
  ],
  api: [
    {
      rows: [
        { name: 'className', type: 'string', description: 'Tailwind classes for size, shape, and spacing.' },
      ],
    },
  ],
  accessibility: [
    'aria-busy="true" — screen readers ignore decorative shimmer.',
    'Shimmer animation respects prefers-reduced-motion (turns off entirely).',
  ],
};

export default doc;
