import {
  Toast,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from '@/components/ui/Toast';
import { Button } from '@/components/ui/Button';
import { useToast } from '@/hooks/use-toast';
import type { ComponentDoc } from '../registry/types';

function TriggerDemo() {
  const { push } = useToast();
  return (
    <Button
      onClick={() =>
        push({
          title: 'Saved',
          description: 'All changes published.',
          variant: 'success',
        })
      }
    >
      Show toast
    </Button>
  );
}

const doc: ComponentDoc = {
  slug: 'toast',
  name: 'Toast',
  group: 'Feedback',
  description:
    'Transient, non-blocking feedback. Toasts queue and auto-dismiss. Use the useToast hook imperatively — do not render <Toast> directly outside the ToastProvider.',
  exports: ['Toast', 'ToastProvider', 'ToastViewport', 'ToastTitle', 'ToastDescription', 'useToast'],
  sourceFile: 'Toast.tsx',
  examples: [
    {
      title: 'Imperative (useToast)',
      description: 'Mount <ToastProvider> + <ToastViewport /> once at your app root, then call push() from anywhere.',
      preview: <TriggerDemo />,
      code: `// app.tsx
<ToastProvider>
  <App />
  <ToastViewport />
</ToastProvider>

// anywhere inside
const { push } = useToast();
push({ title: 'Saved', description: 'All changes published.', variant: 'success' });`,
    },
    {
      title: 'Static (preview)',
      description: 'Renders a stationary toast for documentation / screenshots.',
      preview: (
        <ToastProvider duration={Infinity}>
          <ToastViewport className="!static !w-full !max-w-sm !p-0">
            <Toast open variant="success">
              <div>
                <ToastTitle>Saved</ToastTitle>
                <ToastDescription>All changes published.</ToastDescription>
              </div>
            </Toast>
          </ToastViewport>
        </ToastProvider>
      ),
      code: `<ToastProvider duration={Infinity}>
  <ToastViewport>
    <Toast open variant="success">
      <ToastTitle>Saved</ToastTitle>
      <ToastDescription>All changes published.</ToastDescription>
    </Toast>
  </ToastViewport>
</ToastProvider>`,
    },
  ],
  api: [
    {
      title: 'useToast()',
      rows: [
        { name: 'push', type: '(t: ToastDescriptor) => string', description: 'Show a toast. Returns the toast id.' },
        { name: 'dismiss', type: '(id: string) => void', description: 'Hide a toast by id (allowing exit animation).' },
        { name: 'remove', type: '(id: string) => void', description: 'Immediately remove a toast from state.' },
        { name: 'toasts', type: 'InternalToast[]', description: 'Live toast list (mostly for ToastViewport internals).' },
      ],
    },
    {
      title: 'ToastDescriptor',
      rows: [
        { name: 'title', type: 'ReactNode', description: 'Bold leading text.' },
        { name: 'description', type: 'ReactNode', description: 'Body text.' },
        { name: 'variant', type: `'default' | 'success' | 'warning' | 'danger' | 'info'`, default: `'default'`, description: 'Tone.' },
        { name: 'duration', type: 'number', default: '5000', description: 'Milliseconds before auto-dismiss; Infinity to require manual close.' },
        { name: 'action', type: 'ReactNode', description: 'Optional action button rendered on the right.' },
      ],
    },
  ],
  accessibility: [
    'Backed by @radix-ui/react-toast — toasts are announced via aria-live polite/assertive based on variant.',
    'Focus is preserved — toasts do not steal focus from the page.',
    'Esc dismisses the most recent toast.',
  ],
  related: [
    { slug: 'alert', reason: 'For persistent in-page messages.' },
    { slug: 'snackbar', reason: 'For inline, section-level feedback.' },
  ],
};

export default doc;
