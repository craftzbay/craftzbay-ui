import { forwardRef } from 'react';
import { DayPicker, type DayPickerProps } from 'react-day-picker';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import 'react-day-picker/style.css';
import { cn } from '@/lib/utils';

export type CalendarProps = DayPickerProps & { className?: string };

/**
 * Standalone calendar surface. Used by DatePicker, but can also be embedded
 * directly in popovers, sheets, or inline forms. Wraps `react-day-picker` v9.
 */
export const Calendar = forwardRef<HTMLDivElement, CalendarProps>(function Calendar(
  { className, classNames, captionLayout = 'dropdown', startMonth, endMonth, ...props },
  _ref,
) {
  // Bound the month/year dropdowns. Consumers can narrow this with
  // startMonth / endMonth; the default spans a century back to a decade ahead
  // so the year dropdown is useful for both birthdays and future scheduling.
  const now = new Date();
  const start = startMonth ?? new Date(now.getFullYear() - 100, 0, 1);
  const end = endMonth ?? new Date(now.getFullYear() + 10, 11, 31);

  return (
    <DayPicker
      showOutsideDays
      captionLayout={captionLayout}
      startMonth={start}
      endMonth={end}
      className={cn('inline-block rounded-lg border border-border bg-card p-3', className)}
      classNames={{
        root: 'rdp',
        months: 'relative flex flex-col gap-4 sm:flex-row sm:gap-6',
        month: 'flex flex-col gap-3',
        month_caption: 'relative flex h-8 items-center justify-center px-8',
        caption_label: 'text-sm font-medium',
        dropdowns: 'flex items-center justify-center gap-1.5',
        dropdown_root: 'relative inline-flex items-center',
        dropdown:
          'cursor-pointer rounded-md border border-border bg-card px-2 py-1 text-sm font-medium text-foreground outline-none hover:bg-background-muted focus-visible:ring-2 focus-visible:ring-ring',
        nav: 'absolute inset-x-0 top-0 flex h-8 items-center justify-between',
        button_previous:
          'inline-flex h-7 w-7 items-center justify-center rounded-md text-foreground-muted hover:bg-background-muted focus-visible:ring-2 focus-visible:ring-ring outline-none disabled:opacity-40 disabled:pointer-events-none',
        button_next:
          'inline-flex h-7 w-7 items-center justify-center rounded-md text-foreground-muted hover:bg-background-muted focus-visible:ring-2 focus-visible:ring-ring outline-none disabled:opacity-40 disabled:pointer-events-none',
        month_grid: 'w-full border-collapse',
        weekdays: 'grid grid-cols-7',
        weekday:
          'h-8 w-9 text-center text-[11px] font-medium uppercase tracking-wide text-foreground-subtle',
        week: 'mt-0.5 grid grid-cols-7',
        day: 'relative h-9 w-9 p-0 text-center',
        day_button:
          'inline-flex h-9 w-9 items-center justify-center rounded-md text-sm hover:bg-background-muted focus-visible:ring-2 focus-visible:ring-ring outline-none aria-selected:bg-accent aria-selected:text-on-accent aria-selected:hover:bg-accent-700',
        today: '[&_button]:border [&_button]:border-border',
        outside: 'text-foreground-subtle',
        disabled: 'opacity-40 pointer-events-none',
        range_start:
          '[&_button]:bg-accent [&_button]:text-on-accent [&_button]:rounded-r-none',
        range_end:
          '[&_button]:bg-accent [&_button]:text-on-accent [&_button]:rounded-l-none',
        range_middle:
          '[&_button]:bg-accent-soft [&_button]:text-foreground [&_button]:rounded-none',
        hidden: 'invisible',
        ...classNames,
      }}
      components={{
        Chevron: ({ orientation }) =>
          orientation === 'left' ? (
            <ChevronLeft className="size-4" />
          ) : (
            <ChevronRight className="size-4" />
          ),
      }}
      {...props}
    />
  );
});
