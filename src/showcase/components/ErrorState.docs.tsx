import { ErrorState } from '@/components/ui/ErrorState';
import type { ComponentDoc } from '../registry/types';

const doc: ComponentDoc = {
  slug: 'error-state',
  name: 'ErrorState',
  group: 'Feedback',
  description:
    'Full-page error scaffolding for 404, 500, and generic crash screens. Comes with line illustrations and a single primary action.',
  exports: ['ErrorState'],
  sourceFile: 'ErrorState.tsx',
  examples: [
    {
      title: '404',
      preview: <ErrorState variant="404" />,
      code: `<ErrorState variant="404" />`,
      surfaceClassName: 'min-h-[300px]',
    },
    {
      title: '500',
      preview: <ErrorState variant="500" />,
      code: `<ErrorState variant="500" />`,
      surfaceClassName: 'min-h-[300px]',
    },
    {
      title: 'Generic',
      preview: <ErrorState variant="generic" title="Something broke" description="We've been notified and are looking into it." />,
      code: `<ErrorState
  variant="generic"
  title="Something broke"
  description="We've been notified and are looking into it."
/>`,
      surfaceClassName: 'min-h-[300px]',
    },
  ],
  api: [
    {
      rows: [
        { name: 'variant', type: `'404' | '500' | 'generic'`, default: `'generic'`, description: 'Preset illustration + default copy.' },
        { name: 'title', type: 'ReactNode', description: 'Override the default title.' },
        { name: 'description', type: 'ReactNode', description: 'Override the default body.' },
        { name: 'action', type: 'ReactNode', description: 'Primary CTA. Defaults to "Go home".' },
      ],
    },
  ],
  related: [
    { slug: 'empty-state', reason: 'For non-error "nothing here yet" cases.' },
  ],
};

export default doc;
