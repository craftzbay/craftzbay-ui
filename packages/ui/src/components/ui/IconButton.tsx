'use client';

import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from 'react';
import { Loader2 } from '@/icons';
import { cn } from '@/lib/utils';
import { cva, type VariantProps } from '@/lib/cva';

const iconButton = cva(
  [
    'inline-flex items-center justify-center shrink-0',
    'rounded-md',
    'transition-colors duration-[var(--duration-fast)] ease-[var(--ease-out)]',
    'outline-none',
    'focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
    'focus-visible:ring-offset-background',
    'disabled:pointer-events-none disabled:opacity-50',
    '[&_svg]:pointer-events-none',
  ],
  {
    variants: {
      variant: {
        primary: 'bg-accent text-on-accent hover:bg-accent-hover active:bg-accent-active',
        secondary:
          'bg-background-muted text-foreground border border-border hover:bg-surface-hover active:bg-surface-active',
        outline:
          'border border-border bg-transparent text-foreground hover:bg-background-muted',
        ghost: 'bg-transparent text-foreground-muted hover:bg-background-muted hover:text-foreground',
        destructive: 'bg-danger text-on-danger hover:bg-danger-hover active:bg-danger-active',
      },
      size: {
        sm: 'h-7 w-7 [&_svg]:size-3.5',
        md: 'h-8 w-8 [&_svg]:size-4',
        lg: 'h-10 w-10 [&_svg]:size-5',
      },
    },
    defaultVariants: {
      variant: 'ghost',
      size: 'md',
    },
  },
);

export interface IconButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof iconButton> {
  /**
   * Accessible label for screen readers. **Required** — an icon-only button
   * with no label is invisible to assistive tech.
   */
  'aria-label': string;
  /** The Lucide icon to render. */
  icon: ReactNode;
  /** Show a spinner instead of the icon. */
  loading?: boolean;
}

/**
 * Square, icon-only button. Default variant is `ghost` because most
 * IconButtons sit in dense toolbars or tables. Always pass `aria-label`.
 *
 * @example Toolbar action
 *   <IconButton aria-label="Edit row" icon={<Edit2 />} onClick={onEdit} />
 *
 * @example Dismissible chip
 *   <IconButton aria-label="Remove tag" size="sm" icon={<X />} />
 *
 * @do Use `ghost` for in-row actions; `outline` when next to a label-less
 *      primary button you want users to consider as an alternative.
 * @dont Use IconButton when the action's meaning isn't universally
 *       recognised. If users need to learn the icon, ship a Button with text.
 */
export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(function IconButton(
  { className, variant, size, icon, loading, disabled, type = 'button', ...props },
  ref,
) {
  const isDisabled = disabled || loading;
  return (
    <button
      ref={ref}
      type={type}
      aria-busy={loading || undefined}
      disabled={isDisabled}
      className={cn(iconButton({ variant, size }), className)}
      {...props}
    >
      {loading ? <Loader2 className="animate-spin" aria-hidden="true" /> : icon}
    </button>
  );
});

IconButton.displayName = 'IconButton';
