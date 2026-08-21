import { Progress, ProgressCircle } from '@/components/ui/Progress';
import type { ComponentDoc } from '../registry/types';

const doc: ComponentDoc = {
  slug: 'progress',
  name: 'Progress',
  group: 'Feedback',
  description:
    'Linear or circular progress bar. Use determinate (known %) whenever possible — pass a negative value for indeterminate.',
  exports: ['Progress', 'ProgressCircle'],
  sourceFile: 'Progress.tsx',
  examples: [
    {
      title: 'Linear',
      preview: (
        <div className="flex w-full max-w-sm flex-col gap-3">
          <Progress value={62} aria-label="Upload progress" />
          <Progress value={100} aria-label="Complete" />
          <Progress value={-1} aria-label="Working" />
        </div>
      ),
      code: `<Progress value={62} aria-label="Upload progress" />
<Progress value={100} aria-label="Complete" />
<Progress value={-1} aria-label="Working" /> {/* indeterminate */}`,
    },
    {
      title: 'Circular',
      preview: (
        <div className="flex items-center gap-4">
          <ProgressCircle value={28} aria-label="Storage" />
          <ProgressCircle value={72} aria-label="Storage" />
          <ProgressCircle value={100} aria-label="Done" />
        </div>
      ),
      code: `<ProgressCircle value={72} aria-label="Storage" />`,
    },
  ],
  api: [
    {
      rows: [
        {
          name: 'value',
          type: 'number',
          description: '0–100 for determinate. Negative for indeterminate.',
        },
        {
          name: 'aria-label',
          type: 'string',
          required: true,
          description: 'Required accessible name.',
        },
        {
          name: 'className',
          type: 'string',
          description: 'Height (Progress) / size (ProgressCircle) overrides.',
        },
      ],
    },
  ],
  accessibility: [
    'Backed by @radix-ui/react-progress — proper role="progressbar" + aria-valuenow.',
  ],
  related: [{ slug: 'spinner', reason: 'For unknowable durations.' }],
};

export default doc;
