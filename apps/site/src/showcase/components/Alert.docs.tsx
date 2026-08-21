import { Alert } from '@/components/ui/Alert';
import type { ComponentDoc } from '../registry/types';

const doc: ComponentDoc = {
  slug: 'alert',
  name: 'Alert',
  group: 'Feedback',
  description:
    'Static, in-page banner. Use for messages tied to a section of the page — not for transient feedback (use Toast) or destructive confirms (use ConfirmationDialog).',
  exports: ['Alert'],
  sourceFile: 'Alert.tsx',
  examples: [
    {
      title: 'Variants',
      preview: (
        <div className="flex w-full max-w-md flex-col gap-2">
          <Alert variant="info" title="Heads up">
            Read-only mode is on.
          </Alert>
          <Alert variant="success" title="Saved">
            All changes published.
          </Alert>
          <Alert variant="warning" title="Approaching limit">
            You have used 85% of your quota.
          </Alert>
          <Alert variant="danger" title="Build failed">
            Check the deploy logs for details.
          </Alert>
        </div>
      ),
      code: `<Alert variant="info" title="Heads up">Read-only mode is on.</Alert>
<Alert variant="success" title="Saved">All changes published.</Alert>
<Alert variant="warning" title="Approaching limit">You have used 85% of your quota.</Alert>
<Alert variant="danger" title="Build failed">Check the deploy logs for details.</Alert>`,
    },
    {
      title: 'Dismissible',
      preview: (
        <Alert variant="info" title="New feature" dismissible className="w-full max-w-md">
          DataGrid now supports column drag-to-reorder.
        </Alert>
      ),
      code: `<Alert variant="info" title="New feature" dismissible onDismiss={() => …}>
  DataGrid now supports column drag-to-reorder.
</Alert>`,
    },
  ],
  api: [
    {
      rows: [
        {
          name: 'variant',
          type: `'default' | 'info' | 'success' | 'warning' | 'danger'`,
          default: `'default'`,
          description: 'Tone + auto icon.',
        },
        { name: 'title', type: 'ReactNode', description: 'Bold leading text.' },
        {
          name: 'icon',
          type: 'ReactNode | null',
          description: 'Override (or null to hide) the auto icon.',
        },
        {
          name: 'dismissible',
          type: 'boolean',
          default: 'false',
          description: 'Render a close button.',
        },
        { name: 'onDismiss', type: '() => void', description: 'Fires when close is clicked.' },
      ],
    },
  ],
  accessibility: [
    'role="status" for non-urgent variants; role="alert" for warning / danger so screen readers interrupt.',
  ],
  related: [
    { slug: 'toast', reason: 'For transient feedback.' },
    { slug: 'snackbar', reason: 'For inline section-level messages with close.' },
  ],
};

export default doc;
