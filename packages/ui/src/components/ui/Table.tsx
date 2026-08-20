'use client';

import { forwardRef, type HTMLAttributes, type ThHTMLAttributes, type TdHTMLAttributes } from 'react';
import { ArrowDown, ArrowUp, ArrowUpDown } from '@/icons';
import { cn } from '@/lib/utils';

/* -----------------------------------------------------------------------------
 *  Table primitives — minimal sugar over <table>. Pair with a sortable
 *  header helper (`TableSortHeader`) when you need built-in sort visuals.
 *  Empty + loading states are pure composition with the rest of the system.
 * --------------------------------------------------------------------------- */

export const Table = forwardRef<HTMLTableElement, HTMLAttributes<HTMLTableElement>>(
  function Table({ className, ...props }, ref) {
    return (
      <div className="relative w-full overflow-auto">
        <table
          ref={ref}
          className={cn('w-full caption-bottom text-sm border-collapse', className)}
          {...props}
        />
      </div>
    );
  },
);
Table.displayName = 'Table';

export const TableHeader = forwardRef<HTMLTableSectionElement, HTMLAttributes<HTMLTableSectionElement>>(
  function TableHeader({ className, ...props }, ref) {
    return (
      <thead
        ref={ref}
        className={cn(
          'sticky top-0 z-10 bg-background-subtle text-foreground-muted',
          '[&_tr]:border-b [&_tr]:border-border',
          className,
        )}
        {...props}
      />
    );
  },
);
TableHeader.displayName = 'TableHeader';

export const TableBody = forwardRef<HTMLTableSectionElement, HTMLAttributes<HTMLTableSectionElement>>(
  function TableBody({ className, ...props }, ref) {
    return (
      <tbody
        ref={ref}
        className={cn('[&_tr:last-child]:border-0', className)}
        {...props}
      />
    );
  },
);
TableBody.displayName = 'TableBody';

export const TableFooter = forwardRef<HTMLTableSectionElement, HTMLAttributes<HTMLTableSectionElement>>(
  function TableFooter({ className, ...props }, ref) {
    return (
      <tfoot
        ref={ref}
        className={cn('border-t border-border bg-background-subtle font-medium', className)}
        {...props}
      />
    );
  },
);
TableFooter.displayName = 'TableFooter';

export const TableRow = forwardRef<
  HTMLTableRowElement,
  HTMLAttributes<HTMLTableRowElement> & { selected?: boolean }
>(function TableRow({ className, selected, ...props }, ref) {
  return (
    <tr
      ref={ref}
      data-selected={selected || undefined}
      aria-selected={selected || undefined}
      className={cn(
        'border-b border-border transition-colors duration-[var(--duration-fast)]',
        'hover:bg-background-subtle',
        'data-[selected]:bg-accent-soft data-[selected]:hover:bg-accent-soft',
        className,
      )}
      {...props}
    />
  );
});
TableRow.displayName = 'TableRow';

export interface TableHeadProps extends ThHTMLAttributes<HTMLTableCellElement> {
  /**
   * Render the header label in small caps (`uppercase tracking-wide`).
   * Off by default — mixed case reads better for long / Cyrillic labels.
   * @default false
   */
  uppercase?: boolean;
}

export const TableHead = forwardRef<HTMLTableCellElement, TableHeadProps>(function TableHead(
  { className, uppercase = false, ...props },
  ref,
) {
  return (
    <th
      ref={ref}
      className={cn(
        'h-10 px-3 text-left align-middle text-xs font-medium text-foreground-subtle',
        uppercase && 'uppercase tracking-wide',
        '[&:has([role=checkbox])]:w-10 [&:has([role=checkbox])]:pr-0',
        className,
      )}
      {...props}
    />
  );
});
TableHead.displayName = 'TableHead';

export const TableCell = forwardRef<
  HTMLTableCellElement,
  TdHTMLAttributes<HTMLTableCellElement>
>(function TableCell({ className, ...props }, ref) {
  return (
    <td
      ref={ref}
      className={cn('px-3 py-3 align-middle text-foreground', className)}
      {...props}
    />
  );
});
TableCell.displayName = 'TableCell';

export const TableCaption = forwardRef<HTMLTableCaptionElement, HTMLAttributes<HTMLTableCaptionElement>>(
  function TableCaption({ className, ...props }, ref) {
    return (
      <caption
        ref={ref}
        className={cn('mt-4 text-sm text-foreground-subtle', className)}
        {...props}
      />
    );
  },
);
TableCaption.displayName = 'TableCaption';

export interface TableSortHeaderProps extends ThHTMLAttributes<HTMLTableCellElement> {
  /** Stable column key used in `currentSort.key`. */
  sortKey: string;
  /** Currently sorted column + direction (or null). */
  currentSort: { key: string; direction: 'asc' | 'desc' } | null;
  /** Called when the user clicks the header. */
  onSortChange: (key: string, direction: 'asc' | 'desc') => void;
}

/**
 * Sortable column header. Click toggles asc → desc → asc; the icon reflects
 * the current state.
 *
 * @example
 *   <TableSortHeader sortKey="name" currentSort={sort} onSortChange={onSort}>
 *     Name
 *   </TableSortHeader>
 *
 * @do Sort by one column at a time. Multi-sort hides state from users.
 * @dont Sort silently — the icon must change so users see what changed.
 */
export const TableSortHeader = forwardRef<HTMLTableCellElement, TableSortHeaderProps>(
  function TableSortHeader(
    { sortKey, currentSort, onSortChange, children, className, ...props },
    ref,
  ) {
    const active = currentSort?.key === sortKey;
    const direction = active ? currentSort?.direction : undefined;
    const handle = () => {
      onSortChange(sortKey, active && direction === 'asc' ? 'desc' : 'asc');
    };
    return (
      <TableHead ref={ref} className={cn('p-0', className)} aria-sort={active ? (direction === 'asc' ? 'ascending' : 'descending') : 'none'} {...props}>
        <button
          type="button"
          onClick={handle}
          className={cn(
            'inline-flex h-10 w-full items-center gap-1.5 px-3 outline-none',
            'transition-colors duration-[var(--duration-fast)]',
            'hover:text-foreground focus-visible:text-foreground',
            'focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background rounded-sm',
            active && 'text-foreground',
          )}
        >
          {children}
          {direction === 'asc' ? (
            <ArrowUp className="size-3.5" aria-hidden />
          ) : direction === 'desc' ? (
            <ArrowDown className="size-3.5" aria-hidden />
          ) : (
            <ArrowUpDown className="size-3.5 opacity-40" aria-hidden />
          )}
        </button>
      </TableHead>
    );
  },
);
TableSortHeader.displayName = 'TableSortHeader';
