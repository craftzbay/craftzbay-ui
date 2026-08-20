'use client';

import { forwardRef, useState, type HTMLAttributes, type ReactNode } from 'react';
import { AlertTriangle, CheckCircle2, Info, X, XCircle } from '@/icons';
import { cn } from '@/lib/utils';
import { useStrings } from '@/hooks/use-strings';
import { cva, type VariantProps } from '@/lib/cva';

const alert = cva(['relative flex w-full gap-3 rounded-lg border p-4', 'text-sm'], {
  variants: {
    variant: {
      default: 'border-border bg-background-subtle text-foreground',
      info: 'border-info-border-soft bg-info-soft text-info-text',
      success: 'border-success-border-soft bg-success-soft text-success-text',
      warning: 'border-warning-border-soft bg-warning-soft text-warning-text',
      danger: 'border-danger-border-soft bg-danger-soft text-danger-text',
    },
  },
  defaultVariants: { variant: 'default' },
});

const iconForVariant = {
  default: null,
  info: <Info className="mt-0.5 size-4 shrink-0" aria-hidden />,
  success: <CheckCircle2 className="mt-0.5 size-4 shrink-0" aria-hidden />,
  warning: <AlertTriangle className="mt-0.5 size-4 shrink-0" aria-hidden />,
  danger: <XCircle className="mt-0.5 size-4 shrink-0" aria-hidden />,
};

export interface AlertProps
  extends Omit<HTMLAttributes<HTMLDivElement>, 'title'>, VariantProps<typeof alert> {
  /** Heading. Renders bold above the description. */
  title?: ReactNode;
  /** Show a dismiss (×) button. */
  dismissible?: boolean;
  /** Called when the user dismisses. */
  onDismiss?: () => void;
  /** Override the variant's default icon. Pass `false` to suppress the icon. */
  icon?: ReactNode | false;
}

/**
 * Inline banner for static page-level or section-level state. For transient
 * notifications use `Toast` instead.
 *
 * @example Inline error
 *   <Alert variant="danger" title="Payment failed">
 *     Your card was declined. Update your billing info to retry.
 *   </Alert>
 *
 * @example Dismissible info
 *   <Alert variant="info" dismissible onDismiss={dismiss}>
 *     We're improving search — give us feedback at #search-feedback.
 *   </Alert>
 *
 * @do Use the closest semantic variant — `info` for neutral facts,
 *      `warning` for "watch out", `danger` for "this is broken".
 * @dont Use Alert for one-time confirmations — that's Toast.
 */
export const Alert = forwardRef<HTMLDivElement, AlertProps>(function Alert(
  { className, variant = 'default', title, dismissible, onDismiss, icon, children, ...props },
  ref,
) {
  const strings = useStrings();
  const [open, setOpen] = useState(true);
  if (!open) return null;

  const handleDismiss = () => {
    setOpen(false);
    onDismiss?.();
  };

  const renderedIcon = icon === false ? null : (icon ?? iconForVariant[variant ?? 'default']);

  return (
    <div
      ref={ref}
      // Only errors interrupt the screen reader; everything else is polite.
      role={variant === 'danger' ? 'alert' : 'status'}
      className={cn(alert({ variant }), className)}
      {...props}
    >
      {renderedIcon}
      <div className="min-w-0 flex-1">
        {title && <h5 className="mb-1 leading-tight font-medium">{title}</h5>}
        <div className="text-sm leading-relaxed [&_p]:leading-relaxed">{children}</div>
      </div>
      {dismissible && (
        <button
          type="button"
          aria-label={strings.alert.dismiss}
          onClick={handleDismiss}
          className={cn(
            'inline-flex size-6 shrink-0 items-center justify-center rounded-md',
            'outline-none hover:bg-current/10',
            'focus-visible:ring-ring focus-visible:ring-offset-background focus-visible:ring-2 focus-visible:ring-offset-2',
          )}
        >
          <X className="size-3.5" aria-hidden />
        </button>
      )}
    </div>
  );
});
Alert.displayName = 'Alert';
