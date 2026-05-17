import type { Meta, StoryObj } from '@storybook/react-vite';
import { useEffect, useState } from 'react';
import { Button } from './Button';
import { IconButton } from './IconButton';
import { X } from '@/icons';
import {
  Toast,
  ToastAction,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from './Toast';

const meta: Meta<typeof Toast> = {
  title: 'Feedback/Toast',
  component: Toast,
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <ToastProvider swipeDirection="right" duration={Infinity}>
        <Story />
      </ToastProvider>
    ),
  ],
};
export default meta;
type Story = StoryObj<typeof Toast>;

/** Inline viewport so static-render demos stay inside the story canvas
 *  instead of using the default `fixed top-4 right-4` Radix viewport. */
const inlineViewport =
  '!static !w-full !max-w-sm !flex-col !gap-3 !p-0';

/** Static visual — what a single toast looks like. */
export const Default: Story = {
  render: () => (
    <ToastViewport className={inlineViewport}>
      <Toast open variant="default">
        <div className="grid gap-0.5">
          <ToastTitle>Changes saved</ToastTitle>
          <ToastDescription>Your settings have been updated.</ToastDescription>
        </div>
        <ToastClose className="absolute right-2 top-2 rounded p-1 text-foreground-muted hover:bg-background-muted">
          <X className="size-4" />
        </ToastClose>
      </Toast>
    </ToastViewport>
  ),
};

export const Variants: Story = {
  render: () => (
    <ToastViewport className={inlineViewport}>
      {(['default', 'info', 'success', 'warning', 'danger'] as const).map((v) => (
        <Toast key={v} open variant={v}>
          <div className="grid gap-0.5">
            <ToastTitle className="capitalize">{v}</ToastTitle>
            <ToastDescription>This is a {v} toast.</ToastDescription>
          </div>
        </Toast>
      ))}
    </ToastViewport>
  ),
};

export const WithAction: Story = {
  render: () => (
    <ToastViewport className={inlineViewport}>
      <Toast open>
        <div className="grid gap-0.5">
          <ToastTitle>Project archived</ToastTitle>
          <ToastDescription>“Atlas” moved to the archive.</ToastDescription>
        </div>
        <ToastAction altText="Undo archive" asChild>
          <Button size="sm" variant="ghost">Undo</Button>
        </ToastAction>
      </Toast>
    </ToastViewport>
  ),
};

/**
 * Interactive demo — click the button to push a real toast through the
 * Provider + Viewport. The viewport is anchored to this story container so
 * it stays visible inside the Storybook canvas.
 */
export const Interactive: Story = {
  render: () => {
    const [items, setItems] = useState<{ id: number; variant: 'default' | 'success' | 'danger' | 'warning' | 'info'; title: string; body: string }[]>([]);
    const [next, setNext] = useState(1);

    function push(variant: 'default' | 'success' | 'danger' | 'warning' | 'info', title: string, body: string) {
      const id = next;
      setItems((cur) => [...cur, { id, variant, title, body }]);
      setNext((n) => n + 1);
    }

    useEffect(() => {
      if (items.length === 0) return;
      const timers = items.map((t) =>
        setTimeout(() => setItems((cur) => cur.filter((x) => x.id !== t.id)), 4000),
      );
      return () => timers.forEach(clearTimeout);
    }, [items]);

    return (
      <div className="relative h-[24rem] overflow-hidden rounded-md border border-border bg-background-subtle p-4">
        <div className="flex flex-wrap items-start gap-2">
            <Button size="sm" onClick={() => push('default', 'Changes saved', 'Your settings have been updated.')}>
              Default
            </Button>
            <Button size="sm" variant="secondary" onClick={() => push('success', 'Published', 'Live in production.')}>
              Success
            </Button>
            <Button size="sm" variant="secondary" onClick={() => push('warning', 'Heads up', '82% of monthly quota used.')}>
              Warning
            </Button>
            <Button size="sm" variant="destructive" onClick={() => push('danger', 'Upload failed', 'Network error — try again.')}>
              Danger
            </Button>
            <Button size="sm" variant="ghost" onClick={() => push('info', 'Heads up', 'Read-only mode is on.')}>
              Info
            </Button>
          </div>

          {items.map((t) => (
            <Toast
              key={t.id}
              variant={t.variant}
              open
              onOpenChange={(open) => {
                if (!open) setItems((cur) => cur.filter((x) => x.id !== t.id));
              }}
            >
              <div className="grid gap-0.5">
                <ToastTitle>{t.title}</ToastTitle>
                <ToastDescription>{t.body}</ToastDescription>
              </div>
              <ToastClose asChild>
                <IconButton aria-label="Close" icon={<X />} variant="ghost" size="sm" className="absolute right-1 top-1" />
              </ToastClose>
            </Toast>
          ))}

        {/* Anchor the viewport to THIS story instead of the page so it
            stays inside the canvas frame. */}
        <ToastViewport className="!absolute !bottom-2 !right-2 !top-auto !w-auto !max-w-sm !p-0" />
      </div>
    );
  },
};
