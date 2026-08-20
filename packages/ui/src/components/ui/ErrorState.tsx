'use client';

import { forwardRef, type HTMLAttributes, type ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { useStrings } from '@/hooks/use-strings';
import type { UiStrings } from '@/lib/strings';
import { NotFound, ServerError, ConnectionLost } from '@/illustrations';
import { Button } from './Button';

export interface ErrorStateProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
  /** `404` not-found, `500` server, or `generic` (catch-all). */
  variant?: '404' | '500' | 'generic';
  /** Override the default title. */
  title?: ReactNode;
  /** Override the default description. */
  description?: ReactNode;
  /**
   * Override the variant's default illustration. Pass any ReactNode (e.g.
   * `<Illustrations.Construction className="size-32" />`).
   */
  illustration?: ReactNode;
  /** Custom action node. Replaces the default retry button. */
  action?: ReactNode;
  /** When provided, renders a default "Try again" button calling this handler. */
  onRetry?: () => void;
}

const presets = (s: UiStrings) => ({
  '404': {
    illustration: <NotFound className="size-32" />,
    title: s.errorState.notFoundTitle,
    description: s.errorState.notFoundDescription,
  },
  '500': {
    illustration: <ServerError className="size-32" />,
    title: s.errorState.serverTitle,
    description: s.errorState.serverDescription,
  },
  generic: {
    illustration: <ConnectionLost className="size-32" />,
    title: s.errorState.genericTitle,
    description: s.errorState.genericDescription,
  },
});

/**
 * Page-level error placeholder. Pair with `onRetry` for transient failures.
 *
 * @example 404 (uses built-in line illustration)
 *   <ErrorState variant="404" />
 *
 * @example 500 with retry
 *   <ErrorState variant="500" onRetry={refetch} />
 *
 * @example Custom
 *   <ErrorState
 *     title="Quota exceeded"
 *     description="Your plan allows 1,000 events/day."
 *     illustration={<Illustrations.Construction className="size-32" />}
 *     action={<Button>Upgrade plan</Button>}
 *   />
 *
 * @do Match the tone to the cause — server errors apologise, user errors
 *      explain. Always offer a next step.
 * @dont Show a raw stack trace to end users.
 */
export const ErrorState = forwardRef<HTMLDivElement, ErrorStateProps>(function ErrorState(
  { variant = 'generic', title, description, illustration, action, onRetry, className, ...props },
  ref,
) {
  const strings = useStrings();
  const preset = presets(strings)[variant];
  return (
    <div
      ref={ref}
      className={cn(
        'flex flex-col items-center justify-center gap-3 rounded-lg border border-border bg-background-subtle p-10 text-center',
        className,
      )}
      {...props}
    >
      {illustration ?? preset.illustration}
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
              {strings.errorState.tryAgain}
            </Button>
          )}
        </div>
      )}
    </div>
  );
});
ErrorState.displayName = 'ErrorState';
