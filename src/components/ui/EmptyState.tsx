import { forwardRef, type HTMLAttributes, type ReactNode } from 'react';
import { cn } from '@/lib/utils';

export interface EmptyStateProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
  /** Visual marker — small Lucide icon or custom illustration. */
  icon?: ReactNode;
  /** Heading. One short sentence. */
  title: ReactNode;
  /** Description. One or two sentences max. */
  description?: ReactNode;
  /** Primary action — usually a `<Button>` that creates the missing item. */
  action?: ReactNode;
  /** Secondary helper link — "Learn more", "Import existing", etc. */
  secondaryAction?: ReactNode;
}

/**
 * Shown when a list / dataset / surface has no content yet. Tone is helpful,
 * never apologetic.
 *
 * @example
 *   <EmptyState
 *     icon={<Folder className="size-6" />}
 *     title="No projects yet"
 *     description="Create a project to start tracking work."
 *     action={<Button>New project</Button>}
 *   />
 *
 * @do Lead with the next action. The icon is decoration; the button is the
 *      point.
 * @dont Use elaborate illustrations on internal product surfaces — they
 *       break the refined-minimal direction.
 */
export const EmptyState = forwardRef<HTMLDivElement, EmptyStateProps>(function EmptyState(
  { icon, title, description, action, secondaryAction, className, ...props },
  ref,
) {
  return (
    <div
      ref={ref}
      className={cn(
        'flex flex-col items-center justify-center gap-3 rounded-lg border border-dashed border-border bg-background-subtle p-10 text-center',
        className,
      )}
      {...props}
    >
      {icon && (
        <div className="inline-flex size-12 items-center justify-center rounded-full bg-background-muted text-foreground-muted [&_svg]:size-6">
          {icon}
        </div>
      )}
      <h3 className="text-base font-semibold text-foreground leading-tight">{title}</h3>
      {description && (
        <p className="max-w-md text-sm text-foreground-muted leading-relaxed">{description}</p>
      )}
      {(action || secondaryAction) && (
        <div className="mt-2 flex items-center gap-2">
          {action}
          {secondaryAction}
        </div>
      )}
    </div>
  );
});
EmptyState.displayName = 'EmptyState';
