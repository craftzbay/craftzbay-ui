import { forwardRef, useMemo, type HTMLAttributes } from 'react';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from '@/icons';
import { cn } from '@/lib/utils';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from './Select';

export interface PaginationProps extends HTMLAttributes<HTMLElement> {
  /** 1-indexed current page. */
  page: number;
  /** Total number of pages. Set to 0 to hide page numbers. */
  pageCount: number;
  /** Called with the new page when navigating. */
  onPageChange: (page: number) => void;
  /** Total item count, for the "Showing 1-20 of 200" hint. Omit to hide. */
  totalItems?: number;
  /** Items shown per page (controlled if `onPageSizeChange` is provided). */
  pageSize?: number;
  /** Options for the page-size select. */
  pageSizeOptions?: number[];
  /** Called when the user picks a new page size. */
  onPageSizeChange?: (size: number) => void;
  /** Show first/last (« ») jump buttons. Default true. */
  showJump?: boolean;
}

function pageRange(current: number, total: number, max = 7): (number | 'gap')[] {
  if (total <= max) return Array.from({ length: total }, (_, i) => i + 1);
  const window = 1;
  const result: (number | 'gap')[] = [];
  const start = Math.max(2, current - window);
  const end = Math.min(total - 1, current + window);

  result.push(1);
  if (start > 2) result.push('gap');
  for (let i = start; i <= end; i++) result.push(i);
  if (end < total - 1) result.push('gap');
  result.push(total);
  return result;
}

/**
 * Numbered pagination with prev/next, first/last jumps, page-size selector,
 * and item-count summary.
 *
 * @example
 *   <Pagination page={page} pageCount={20} onPageChange={setPage}
 *               totalItems={400} pageSize={20}
 *               pageSizeOptions={[10, 20, 50]} onPageSizeChange={setSize} />
 *
 * @do Place the count summary on the left and controls on the right.
 * @dont Show numbers when there are >100 pages — use a "jump to" input instead.
 */
export const Pagination = forwardRef<HTMLElement, PaginationProps>(function Pagination(
  {
    page,
    pageCount,
    onPageChange,
    totalItems,
    pageSize,
    pageSizeOptions,
    onPageSizeChange,
    showJump = true,
    className,
    ...props
  },
  ref,
) {
  const pages = useMemo(() => pageRange(page, pageCount), [page, pageCount]);

  const from = pageSize ? (page - 1) * pageSize + 1 : undefined;
  const to = pageSize && totalItems ? Math.min(page * pageSize, totalItems) : undefined;

  const goto = (p: number) => {
    if (p < 1 || p > pageCount || p === page) return;
    onPageChange(p);
  };

  return (
    <nav
      ref={ref}
      aria-label="Pagination"
      className={cn('flex flex-wrap items-center justify-between gap-3', className)}
      {...props}
    >
      <div className="flex items-center gap-3 text-sm text-foreground-muted">
        {totalItems !== undefined && pageSize !== undefined && (
          <span className="tabular">
            Showing {from}–{to} of {totalItems}
          </span>
        )}
        {pageSizeOptions && onPageSizeChange && pageSize !== undefined && (
          <div className="flex items-center gap-2">
            <label htmlFor="page-size" className="sr-only">
              Rows per page
            </label>
            <Select value={String(pageSize)} onValueChange={(v) => onPageSizeChange(Number(v))}>
              <SelectTrigger size="sm" className="w-20" />
              <SelectContent>
                {pageSizeOptions.map((s) => (
                  <SelectItem key={s} value={String(s)}>
                    {s} / page
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}
      </div>

      <ul className="flex items-center gap-1">
        {showJump && (
          <li>
            <button
              type="button"
              aria-label="Go to first page"
              disabled={page === 1}
              onClick={() => goto(1)}
              className={navButtonClass}
            >
              <ChevronsLeft className="size-4" aria-hidden />
            </button>
          </li>
        )}
        <li>
          <button
            type="button"
            aria-label="Previous page"
            disabled={page === 1}
            onClick={() => goto(page - 1)}
            className={navButtonClass}
          >
            <ChevronLeft className="size-4" aria-hidden />
          </button>
        </li>
        {pages.map((p, i) =>
          p === 'gap' ? (
            <li key={`gap-${i}`} className="px-2 text-foreground-subtle">
              …
            </li>
          ) : (
            <li key={p}>
              <button
                type="button"
                aria-label={`Page ${p}`}
                aria-current={p === page ? 'page' : undefined}
                onClick={() => goto(p)}
                className={cn(
                  'inline-flex size-8 items-center justify-center rounded-md text-sm tabular outline-none',
                  'transition-colors duration-[var(--duration-fast)]',
                  'focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background',
                  p === page
                    ? 'bg-accent text-on-accent font-medium'
                    : 'text-foreground-muted hover:bg-background-muted hover:text-foreground',
                )}
              >
                {p}
              </button>
            </li>
          ),
        )}
        <li>
          <button
            type="button"
            aria-label="Next page"
            disabled={page === pageCount}
            onClick={() => goto(page + 1)}
            className={navButtonClass}
          >
            <ChevronRight className="size-4" aria-hidden />
          </button>
        </li>
        {showJump && (
          <li>
            <button
              type="button"
              aria-label="Go to last page"
              disabled={page === pageCount}
              onClick={() => goto(pageCount)}
              className={navButtonClass}
            >
              <ChevronsRight className="size-4" aria-hidden />
            </button>
          </li>
        )}
      </ul>
    </nav>
  );
});
Pagination.displayName = 'Pagination';

const navButtonClass = cn(
  'inline-flex size-8 items-center justify-center rounded-md text-foreground-muted',
  'transition-colors duration-[var(--duration-fast)]',
  'hover:bg-background-muted hover:text-foreground',
  'disabled:opacity-50 disabled:pointer-events-none',
  'outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background',
);
