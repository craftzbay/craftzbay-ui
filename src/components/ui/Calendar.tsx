import { forwardRef } from 'react';
import { DayPicker, type DayPickerProps } from 'react-day-picker';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import 'react-day-picker/style.css';
import { cn } from '@/lib/utils';

export type CalendarProps = DayPickerProps & { className?: string };

/**
 * Standalone calendar surface. Used by DatePicker, but can also be embedded
 * directly in popovers, sheets, or inline forms. Wraps `react-day-picker`.
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
        months: 'flex flex-col gap-4',
        month: 'flex flex-col gap-3',
        caption: 'flex items-center justify-between px-1',
        caption_label: 'text-sm font-medium',
        nav: 'flex items-center gap-1',
        nav_button:
          'inline-flex h-7 w-7 items-center justify-center rounded-md text-foreground-muted hover:bg-background-muted focus-visible:ring-2 focus-visible:ring-ring outline-none',
        table: 'w-full border-collapse',
        head_row: 'flex',
        head_cell: 'w-9 text-[11px] font-medium text-foreground-subtle',
        row: 'mt-1 flex',
        cell: 'relative h-9 w-9 p-0 text-center',
        day: 'inline-flex h-9 w-9 items-center justify-center rounded-md text-sm hover:bg-background-muted focus-visible:ring-2 focus-visible:ring-ring outline-none',
        day_selected: 'bg-accent text-on-accent hover:bg-accent-700',
        day_today: 'border border-border',
        day_outside: 'text-foreground-subtle',
        day_disabled: 'opacity-40 pointer-events-none',
        day_range_middle: 'bg-accent-soft rounded-none',
        day_hidden: 'invisible',
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
