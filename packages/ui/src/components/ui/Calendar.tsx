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
  { className, classNames, ...props },
  _ref,
) {
  return (
    <DayPicker
      showOutsideDays
      className={cn('p-3', className)}
      classNames={{
        root: 'rdp',
        months: 'flex flex-col gap-4 sm:flex-row sm:gap-6',
        month: 'flex flex-col gap-3',
        month_caption: 'relative flex h-8 items-center justify-center',
        caption_label: 'text-sm font-medium',
        nav: 'absolute inset-x-0 top-0 flex h-8 items-center justify-between',
        button_previous:
          'inline-flex h-7 w-7 items-center justify-center rounded-md text-foreground-muted hover:bg-background-muted focus-visible:ring-2 focus-visible:ring-ring outline-none',
        button_next:
          'inline-flex h-7 w-7 items-center justify-center rounded-md text-foreground-muted hover:bg-background-muted focus-visible:ring-2 focus-visible:ring-ring outline-none',
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
