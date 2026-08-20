'use client';

import {
  forwardRef,
  type ComponentPropsWithoutRef,
  type ElementRef,
  type HTMLAttributes,
  type ReactNode,
} from 'react';
import * as DialogPrimitive from '@radix-ui/react-dialog';
import { X } from '@/icons';
import { cn } from '@/lib/utils';
import { useStrings } from '@/hooks/use-strings';
import { Button, type ButtonProps } from './Button';

export const Dialog = DialogPrimitive.Root;
export const DialogTrigger = DialogPrimitive.Trigger;
export const DialogPortal = DialogPrimitive.Portal;
export const DialogClose = DialogPrimitive.Close;

export const DialogOverlay = forwardRef<
  ElementRef<typeof DialogPrimitive.Overlay>,
  ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>
>(function DialogOverlay({ className, ...props }, ref) {
  return (
    <DialogPrimitive.Overlay
      ref={ref}
      className={cn(
        'fixed inset-0 z-[var(--z-overlay)] bg-overlay',
        'data-[state=open]:animate-in data-[state=closed]:animate-out',
        'data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0',
        className,
      )}
      {...props}
    />
  );
});
DialogOverlay.displayName = 'DialogOverlay';

export interface DialogContentProps
  extends ComponentPropsWithoutRef<typeof DialogPrimitive.Content> {
  /** Show the default close (×) button in the top-right. */
  showClose?: boolean;
  /** Dialog width — `sm` 400 / `md` 520 / `lg` 720. */
  size?: 'sm' | 'md' | 'lg';
}

export const DialogContent = forwardRef<
  ElementRef<typeof DialogPrimitive.Content>,
  DialogContentProps
>(function DialogContent({ className, children, showClose = true, size = 'md', ...props }, ref) {
  const strings = useStrings();
  return (
    <DialogPortal>
      <DialogOverlay />
      <DialogPrimitive.Content
        ref={ref}
        className={cn(
          'fixed left-1/2 top-1/2 z-[var(--z-modal)] -translate-x-1/2 -translate-y-1/2',
          'w-[calc(100%-2rem)] rounded-lg border border-border bg-card text-card-foreground shadow-lg',
          'p-6',
          'data-[state=open]:animate-in data-[state=closed]:animate-out',
          'data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0',
          'data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95',
          size === 'sm' && 'max-w-[400px]',
          size === 'md' && 'max-w-[520px]',
          size === 'lg' && 'max-w-[720px]',
          className,
        )}
        {...props}
      >
        {children}
        {showClose && (
          <DialogPrimitive.Close
            aria-label={strings.dialog.close}
            className={cn(
              'absolute right-4 top-4 inline-flex size-8 items-center justify-center rounded-md text-foreground-subtle',
              'hover:bg-background-muted hover:text-foreground',
              'outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-card',
              'transition-colors duration-[var(--duration-fast)]',
            )}
          >
            <X className="size-4" aria-hidden />
          </DialogPrimitive.Close>
        )}
      </DialogPrimitive.Content>
    </DialogPortal>
  );
});
DialogContent.displayName = 'DialogContent';

export function DialogHeader({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('flex flex-col gap-1 pb-4', className)} {...props} />;
}
DialogHeader.displayName = 'DialogHeader';

export function DialogFooter({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn('flex flex-col-reverse gap-2 pt-6 sm:flex-row sm:justify-end', className)}
      {...props}
    />
  );
}
DialogFooter.displayName = 'DialogFooter';

export const DialogTitle = forwardRef<
  ElementRef<typeof DialogPrimitive.Title>,
  ComponentPropsWithoutRef<typeof DialogPrimitive.Title>
>(function DialogTitle({ className, ...props }, ref) {
  return (
    <DialogPrimitive.Title
      ref={ref}
      className={cn('text-lg font-semibold text-foreground leading-tight', className)}
      {...props}
    />
  );
});
DialogTitle.displayName = 'DialogTitle';

export const DialogDescription = forwardRef<
  ElementRef<typeof DialogPrimitive.Description>,
  ComponentPropsWithoutRef<typeof DialogPrimitive.Description>
>(function DialogDescription({ className, ...props }, ref) {
  return (
    <DialogPrimitive.Description
      ref={ref}
      className={cn('text-sm text-foreground-muted', className)}
      {...props}
    />
  );
});
DialogDescription.displayName = 'DialogDescription';

/* -----------------------------------------------------------------------------
 *  ConfirmationDialog — pre-composed pattern for destructive/important
 *  confirmations. Use this when the body is a single sentence and the only
 *  controls are Cancel + Confirm.
 * --------------------------------------------------------------------------- */

export interface ConfirmationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: ReactNode;
  description?: ReactNode;
  /** Label of the confirm button. */
  confirmLabel?: string;
  /** Label of the cancel button. */
  cancelLabel?: string;
  /** Variant of the confirm button — typically `primary` or `destructive`. */
  confirmVariant?: ButtonProps['variant'];
  /** Called when the user confirms. Awaited — shows a spinner while pending. */
  onConfirm: () => void | Promise<void>;
  /** Whether the confirm button is currently submitting. */
  loading?: boolean;
}

/**
 * Confirmation dialog with title, description, cancel + confirm buttons.
 *
 * @example Destructive confirmation
 *   <ConfirmationDialog
 *     open={open} onOpenChange={setOpen}
 *     title="Delete project?"
 *     description="This permanently deletes the project and all its data."
 *     confirmLabel="Delete project"
 *     confirmVariant="destructive"
 *     onConfirm={handleDelete}
 *   />
 *
 * @do Lead the title with the action: "Delete project?" not "Are you sure?".
 *      State consequences in the description.
 * @dont Use for low-risk reversible actions — those don't need a dialog.
 */
export function ConfirmationDialog({
  open,
  onOpenChange,
  title,
  description,
  confirmLabel,
  cancelLabel,
  confirmVariant = 'primary',
  onConfirm,
  loading,
}: ConfirmationDialogProps) {
  const strings = useStrings();
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent size="sm">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          {description && <DialogDescription>{description}</DialogDescription>}
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">{cancelLabel ?? strings.confirmationDialog.cancel}</Button>
          </DialogClose>
          <Button variant={confirmVariant} loading={loading} onClick={onConfirm}>
            {confirmLabel ?? strings.confirmationDialog.confirm}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
ConfirmationDialog.displayName = 'ConfirmationDialog';
