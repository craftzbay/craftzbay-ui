import { forwardRef, type HTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

export interface SkeletonProps extends HTMLAttributes<HTMLDivElement> {
  /** Predefined silhouette presets. */
  variant?: 'text' | 'circle' | 'card' | 'avatar';
}

/**
 * Animated placeholder. Use `Skeleton.Text` / `Skeleton.Avatar` for common
 * shapes; pass `className` directly for one-off sizes.
 *
 * @example List item
 *   <div className="flex items-center gap-3">
 *     <Skeleton variant="avatar" />
 *     <div className="space-y-1.5 flex-1">
 *       <Skeleton variant="text" className="w-1/3" />
 *       <Skeleton variant="text" className="w-1/2" />
 *     </div>
 *   </div>
 *
 * @example Card
 *   <Skeleton variant="card" className="h-32" />
 *
 * @do Match the silhouette of the eventual content so the layout doesn't
 *      shift when data arrives.
 * @dont Show a full-page skeleton for sub-300ms loads — use a single Spinner.
 */
export const Skeleton = forwardRef<HTMLDivElement, SkeletonProps>(function Skeleton(
  { className, variant, ...props },
  ref,
) {
  return (
    <div
      ref={ref}
      aria-hidden
      className={cn(
        'animate-pulse bg-background-muted',
        variant === 'text' && 'h-3 rounded-sm',
        variant === 'circle' && 'rounded-full aspect-square',
        variant === 'avatar' && 'size-8 rounded-full',
        variant === 'card' && 'rounded-lg',
        !variant && 'rounded-md',
        className,
      )}
      {...props}
    />
  );
});
Skeleton.displayName = 'Skeleton';
