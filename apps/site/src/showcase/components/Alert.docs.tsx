import { useState } from 'react';
import { Alert } from '@/components/ui/Alert';
import { Button } from '@/components/ui/Button';
import type { ComponentDoc } from '../registry/types';

function ControlledAlertDemo() {
  const [open, setOpen] = useState(false);
  return (
    <div className="flex w-full max-w-md flex-col gap-3">
      <div>
        <Button variant="outline" size="sm" onClick={() => setOpen(true)} disabled={open}>
          Simulate failure
        </Button>
      </div>
      <Alert
        variant="danger"
        title="Save failed"
        live
        dismissible
        open={open}
        onOpenChange={setOpen}
      >
        Your changes were not saved. Check your connection and retry.
      </Alert>
    </div>
  );
}

const doc: ComponentDoc = {
  slug: 'alert',
  name: 'Alert',
  group: 'Feedback',
  description:
    'Static, in-page banner. Use for messages tied to a section of the page — not for transient feedback (use Toast) or destructive confirms (use ConfirmationDialog).',
  i18n: 'Reads `alert.dismiss` (dismiss button aria-label).',
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
    {
      title: 'Controlled + live',
      description:
        'Drive visibility with `open` / `onOpenChange` when the alert reflects app state (a failed save, a lost connection). Add `live` so an alert that appears *after* load is announced: `danger` maps to role="alert", everything else to role="status". Leave `live` off for banners present at page load.',
      preview: <ControlledAlertDemo />,
      code: `const [open, setOpen] = useState(false);

<Button onClick={() => setOpen(true)}>Simulate failure</Button>
<Alert
  variant="danger"
  title="Save failed"
  live
  dismissible
  open={open}
  onOpenChange={setOpen}
>
  Your changes were not saved. Check your connection and retry.
</Alert>`,
    },
    {
      title: 'Heading level',
      description:
        'The title renders as an `<h3>` by default. Set `headingLevel` to keep the document outline in order — `2` directly under a page title, `4` inside a card section.',
      preview: (
        <Alert
          variant="warning"
          title="Trial ends in 3 days"
          headingLevel={4}
          className="w-full max-w-md"
        >
          Add a payment method to keep your workspace.
        </Alert>
      ),
      code: `<Alert variant="warning" title="Trial ends in 3 days" headingLevel={4}>
  Add a payment method to keep your workspace.
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
