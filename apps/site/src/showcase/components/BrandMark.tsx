import { cn } from '@/lib/utils';
import { PKG_NAME } from '../site.config';

/**
 * The product wordmark — accent glyph + package name. Used in the top bar,
 * footer, and as the `brand` slot passed into template previews so the brand
 * tokens visibly drive the logo tint too.
 */
export function BrandMark({
  className,
  showName = true,
}: {
  className?: string;
  showName?: boolean;
}) {
  return (
    <span className={cn('flex items-center gap-2 font-semibold', className)}>
      <span className="inline-flex size-6 items-center justify-center rounded-md bg-accent text-xs text-on-accent">
        ✦
      </span>
      {showName && <span>{PKG_NAME}</span>}
    </span>
  );
}
