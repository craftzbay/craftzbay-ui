import { forwardRef, type HTMLAttributes, type ReactNode } from 'react';
import { AlertTriangle, XCircle } from '@/icons';
import { cn } from '@/lib/utils';
import { Button } from './Button';

export interface ErrorStateProps extends HTMLAttributes<HTMLDivElement> {
  /** `404` not-found, `500` server, or `generic` (catch-all). */
  variant?: '404' | '500' | 'generic';
  /** Override the default title. */
  title?: ReactNode;
  /** Override the default description. */
  description?: ReactNode;
  /** Custom action node. Replaces the default retry button. */
  action?: ReactNode;
  /** When provided, renders a default "Try again" button calling this handler. */
  onRetry?: () => void;
}

const presets = {
  '404': {
    icon: <AlertTriangle />,
    title: 'Page not found',
    description: "We couldn't find what you were looking for.",
  },
  '500': {
    icon: <XCircle />,
    title: 'Something went wrong',
    description: "We're looking into it. Please try again in a moment.",
  },
  generic: {
    icon: <AlertTriangle />,
    title: 'Unexpected error',
    description: 'Something interrupted this action.',
  },
} as const;

/**
 * Page-level error placeholder. Pair with `onRetry` for transient failures.
 *
 * @example 500
 *   <ErrorState variant="500" onRetry={refetch} />
 *
 * @example Custom
 *   <ErrorState title="Quota exceeded"
 *               description="Your plan allows 1,000 events/day."
 *               action={<Button>Upgrade plan</Button>} />
 *
 * @do Match the tone to the cause — server errors apologise, user errors
 *      explain. Always offer a next step.
 * @dont Show a raw stack trace to end users.
 */
export const ErrorState = forwardRef<HTMLDivElement, ErrorStateProps>(function ErrorState(
  { variant = 'generic', title, description, action, onRetry, className, ...props },
  ref,
) {
  const preset = presets[variant];
  return (
    <div
      ref={ref}
      role="alert"
      className={cn(
        'flex flex-col items-center justify-center gap-3 rounded-lg border border-border bg-background-subtle p-10 text-center',
        className,
      )}
      {...props}
    >
      <div className="inline-flex size-12 items-center justify-center rounded-full bg-danger-soft text-danger-text [&_svg]:size-6">
        {preset.icon}
      </div>
      <h3 className="text-base font-semibold text-foreground leading-tight">
        {title ?? preset.title}
      </h3>
      <p className="max-w-md text-sm text-foreground-muted leading-relaxed">
        {description ?? preset.description}
      </p>
      {(action || onRetry) && (
        <div className="mt-2 flex items-center gap-2">
          {action ?? (
            <Button onClick={onRetry} variant="outline">
              Try again
            </Button>
          )}
        </div>
      )}
    </div>
  );
});
ErrorState.displayName = 'ErrorState';
