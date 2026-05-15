import { forwardRef, type HTMLAttributes, type ReactNode } from 'react';
import { ChevronRight, MoreHorizontal } from '@/icons';
import { cn } from '@/lib/utils';

export interface BreadcrumbItem {
  /** Visible label. */
  label: ReactNode;
  /** Optional URL. Last item is treated as current page even if href is set. */
  href?: string;
}

export interface BreadcrumbsProps extends HTMLAttributes<HTMLElement> {
  items: BreadcrumbItem[];
  /** Collapse to first + ellipsis + last `n` when items.length exceeds this. */
  maxItems?: number;
  /** Custom link renderer (for next/link, react-router, etc.). */
  renderLink?: (href: string, children: ReactNode) => ReactNode;
}

/**
 * Breadcrumb trail. Collapses with an ellipsis when there are too many crumbs.
 *
 * @example
 *   <Breadcrumbs items={[
 *     { label: 'Projects', href: '/projects' },
 *     { label: 'Nova', href: '/projects/nova' },
 *     { label: 'Settings' },
 *   ]} />
 *
 * @example With react-router
 *   <Breadcrumbs items={trail} renderLink={(href, c) => <Link to={href}>{c}</Link>} />
 *
 * @do Always omit `href` on the last item — it represents the current page.
 * @dont Use Breadcrumbs for flat navigation. Use TopNav links instead.
 */
export const Breadcrumbs = forwardRef<HTMLElement, BreadcrumbsProps>(function Breadcrumbs(
  { items, maxItems = 4, renderLink, className, ...props },
  ref,
) {
  const shouldCollapse = items.length > maxItems;
  const displayItems =
    !shouldCollapse
      ? items
      : [items[0], { collapsed: true } as const, ...items.slice(-2)];

  return (
    <nav ref={ref} aria-label="Breadcrumb" className={cn('text-sm', className)} {...props}>
      <ol className="flex flex-wrap items-center gap-1.5 text-foreground-subtle">
        {displayItems.map((it, i) => {
          const isLast = i === displayItems.length - 1;
          if ('collapsed' in it) {
            return (
              <li key={`ellipsis-${i}`} className="flex items-center gap-1.5">
                <MoreHorizontal className="size-4" aria-hidden />
                <ChevronRight className="size-3.5" aria-hidden />
              </li>
            );
          }
          const item = it as BreadcrumbItem;
          const labelNode = isLast ? (
            <span aria-current="page" className="font-medium text-foreground">
              {item.label}
            </span>
          ) : item.href ? (
            renderLink ? (
              renderLink(item.href, item.label)
            ) : (
              <a
                href={item.href}
                className="hover:text-foreground transition-colors duration-[var(--duration-fast)] outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-sm"
              >
                {item.label}
              </a>
            )
          ) : (
            <span>{item.label}</span>
          );
          return (
            <li key={i} className="flex items-center gap-1.5">
              {labelNode}
              {!isLast && <ChevronRight className="size-3.5" aria-hidden />}
            </li>
          );
        })}
      </ol>
    </nav>
  );
});
Breadcrumbs.displayName = 'Breadcrumbs';
