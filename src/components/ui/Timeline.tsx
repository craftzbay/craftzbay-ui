import { forwardRef, type HTMLAttributes, type ReactNode } from 'react';
import { cn } from '@/lib/utils';

export interface TimelineProps extends HTMLAttributes<HTMLOListElement> {}

export const Timeline = forwardRef<HTMLOListElement, TimelineProps>(function Timeline(
  { className, children, ...props },
  ref,
) {
  return (
    <ol ref={ref} className={cn('relative flex flex-col gap-6', className)} {...props}>
      {children}
    </ol>
  );
});

export interface TimelineItemProps extends HTMLAttributes<HTMLLIElement> {
  /** Optional bullet override. Default: small accent dot. */
  bullet?: ReactNode;
  /** Hide the connector line below this item — use for the last item. */
  isLast?: boolean;
}

export const TimelineItem = forwardRef<HTMLLIElement, TimelineItemProps>(function TimelineItem(
  { bullet, isLast, className, children, ...props },
  ref,
) {
  return (
    <li ref={ref} className={cn('relative flex gap-4 pb-1', className)} {...props}>
      <div className="relative flex shrink-0 flex-col items-center">
        <div className="flex size-6 items-center justify-center rounded-full border border-border bg-card text-foreground-muted">
          {bullet ?? <span className="size-2 rounded-full bg-accent" aria-hidden />}
        </div>
        {!isLast && <span className="mt-1 flex-1 w-px bg-border" aria-hidden />}
      </div>
      <div className="min-w-0 flex-1 pb-4">{children}</div>
    </li>
  );
});

export function TimelineTime({ className, children }: { className?: string; children: ReactNode }) {
  return (
    <p className={cn('text-xs text-foreground-subtle', className)}>{children}</p>
  );
}

export function TimelineTitle({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  return <p className={cn('text-sm font-medium', className)}>{children}</p>;
}

export function TimelineDescription({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  return <p className={cn('mt-0.5 text-sm text-foreground-muted', className)}>{children}</p>;
}
