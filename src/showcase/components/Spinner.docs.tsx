import { Spinner } from '@/components/ui/Spinner';
import type { ComponentDoc } from '../registry/types';

const doc: ComponentDoc = {
  slug: 'spinner',
  name: 'Spinner',
  group: 'Feedback',
  description:
    'Indeterminate loading indicator. Use inside buttons (Button does this for you), in small contexts (avatar swap, row load), or at page scale for first paint.',
  exports: ['Spinner'],
  sourceFile: 'Spinner.tsx',
  examples: [
    {
      title: 'Sizes',
      preview: (
        <div className="flex items-center gap-4">
          <Spinner size="sm" label="Loading" />
          <Spinner size="md" label="Loading" />
          <Spinner size="lg" label="Loading" />
        </div>
      ),
      code: `<Spinner size="sm" label="Loading" />
<Spinner size="md" label="Loading" />
<Spinner size="lg" label="Loading" />`,
    },
    {
      title: 'Tones',
      preview: (
        <div className="flex items-center gap-4">
          <Spinner tone="accent" label="Loading" />
          <Spinner tone="neutral" label="Loading" />
          <span className="rounded-md bg-accent px-3 py-2">
            <Spinner tone="on-accent" label="Loading" />
          </span>
        </div>
      ),
      code: `<Spinner tone="accent" />
<Spinner tone="neutral" />
<Spinner tone="on-accent" />`,
    },
  ],
  api: [
    {
      rows: [
        { name: 'size', type: `'sm' | 'md' | 'lg'`, default: `'md'`, description: 'Diameter.' },
        { name: 'tone', type: `'accent' | 'neutral' | 'on-accent'`, default: `'accent'`, description: 'Color tone.' },
        { name: 'label', type: 'string', description: 'Accessible name (defaults to "Loading"). Set decorative to omit.' },
        { name: 'decorative', type: 'boolean', default: 'false', description: 'Skip role="status" — use when redundant with neighbor text.' },
      ],
    },
  ],
  accessibility: [
    'role="status" + aria-label="Loading" by default; screen readers announce loading state.',
    'Animation respects prefers-reduced-motion (slows to a calm pulse).',
  ],
};

export default doc;
