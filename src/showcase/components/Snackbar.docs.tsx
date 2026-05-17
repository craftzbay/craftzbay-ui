import { Snackbar } from '@/components/ui/Snackbar';
import type { ComponentDoc } from '../registry/types';

const doc: ComponentDoc = {
  slug: 'snackbar',
  name: 'Snackbar',
  group: 'Feedback',
  description:
    'Inline, dismissible feedback bar — between Alert and Toast. Use for section-level confirmations that should stay until the user closes.',
  exports: ['Snackbar'],
  sourceFile: 'Snackbar.tsx',
  examples: [
    {
      title: 'Variants',
      preview: (
        <div className="flex w-full max-w-md flex-col gap-2">
          <Snackbar variant="info" title="Heads up" onClose={() => {}}>Read-only mode is on.</Snackbar>
          <Snackbar variant="success" title="Saved" onClose={() => {}}>Changes published.</Snackbar>
          <Snackbar variant="danger" title="Failed" onClose={() => {}}>Could not save changes.</Snackbar>
        </div>
      ),
      code: `<Snackbar variant="success" title="Saved" onClose={() => {}}>
  Changes published.
</Snackbar>`,
    },
  ],
  api: [
    {
      rows: [
        { name: 'variant', type: `'info' | 'success' | 'warning' | 'danger'`, default: `'info'`, description: 'Tone.' },
        { name: 'title', type: 'ReactNode', description: 'Bold leading text.' },
        { name: 'onClose', type: '() => void', description: 'Shows close button when provided.' },
      ],
    },
  ],
  accessibility: [
    'role="status" for non-urgent variants; role="alert" for danger.',
  ],
  related: [
    { slug: 'alert', reason: 'Without close button.' },
    { slug: 'toast', reason: 'Transient + queued.' },
  ],
};

export default doc;
