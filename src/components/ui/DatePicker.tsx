import { forwardRef, useId, useState, type ReactNode } from 'react';
import * as PopoverPrimitive from '@radix-ui/react-popover';
import { DayPicker, type DateRange } from 'react-day-picker';
import 'react-day-picker/style.css';
import { Calendar, ChevronLeft, ChevronRight } from '@/icons';
import { cn } from '@/lib/utils';

/* -----------------------------------------------------------------------------
 *  Two related components share the same trigger shell:
 *
 *    <DatePicker value={date} onChange={setDate} />        // single date
 *    <DateRangePicker value={range} onChange={setRange} /> // {from,to}
 * --------------------------------------------------------------------------- */

const calendarClassNames = {
  root: 'p-3',
  month: 'space-y-2',
  caption: 'flex items-center justify-between px-1 pb-2',
  caption_label: 'text-sm font-medium text-foreground',
  nav: 'flex items-center gap-1',
  nav_button:
    'inline-flex size-7 items-center justify-center rounded-md text-foreground-muted hover:bg-background-muted hover:text-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring',
  table: 'w-full border-collapse',
  head_row: 'flex',
  head_cell: 'w-9 text-xs font-medium text-foreground-subtle',
  row: 'flex w-full mt-1',
  cell: 'relative size-9 p-0 text-center',
  day: 'inline-flex size-9 items-center justify-center rounded-md text-sm text-foreground transition-colors outline-none hover:bg-background-muted focus-visible:ring-2 focus-visible:ring-ring',
  day_selected: 'bg-accent text-on-accent hover:bg-accent hover:text-on-accent',
  day_today: 'font-semibold text-accent',
  day_outside: 'text-foreground-subtle opacity-50',
  day_disabled: 'text-foreground-subtle opacity-50 pointer-events-none',
  day_range_start: 'rounded-l-md',
  day_range_end: 'rounded-r-md',
  day_range_middle: 'bg-accent-soft text-on-accent-soft rounded-none',
} as const;

const calendarComponents = {
  IconLeft: () => <ChevronLeft className="size-4" aria-hidden />,
  IconRight: () => <ChevronRight className="size-4" aria-hidden />,
};

function formatDate(d?: Date): string {
  if (!d) return '';
  return d.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
}

function PickerTrigger({
  label,
  placeholder,
  hasValue,
  children,
  error,
  fieldId,
  disabled,
}: {
  label?: ReactNode;
  placeholder: string;
  hasValue: boolean;
  children: ReactNode;
  error?: ReactNode;
  fieldId: string;
  disabled?: boolean;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label htmlFor={fieldId} className="text-sm font-medium text-foreground">
          {label}
        </label>
      )}
      <PopoverPrimitive.Trigger asChild>
        <button
          id={fieldId}
          type="button"
          disabled={disabled}
          aria-invalid={Boolean(error) || undefined}
          className={cn(
            'inline-flex h-9 w-full items-center justify-start gap-2 rounded-md border bg-card px-3 text-left text-sm',
            'transition-colors duration-[var(--duration-fast)] ease-[var(--ease-out)]',
            'outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-background',
            'disabled:opacity-50 disabled:cursor-not-allowed',
            error
              ? 'border-danger focus-visible:border-danger focus-visible:ring-danger'
              : 'border-border focus-visible:border-accent focus-visible:ring-ring',
            !hasValue && 'text-foreground-subtle',
          )}
        >
          <Calendar className="size-4 text-foreground-subtle" aria-hidden />
          <span className="truncate">{hasValue ? children : placeholder}</span>
        </button>
      </PopoverPrimitive.Trigger>
      {error && (
        <p role="alert" className="text-xs text-danger-text">
          {error}
        </p>
      )}
    </div>
  );
}

export interface DatePickerProps {
  value?: Date;
  onChange: (date: Date | undefined) => void;
  label?: ReactNode;
  placeholder?: string;
  error?: ReactNode;
  disabled?: boolean;
  /** Restrict to a date range. Days outside are not selectable. */
  fromDate?: Date;
  toDate?: Date;
  className?: string;
}

/**
 * Single-date picker.
 *
 * @example
 *   <DatePicker label="Date of birth" value={dob} onChange={setDob} />
 *
 * @do Use locale-aware formatting via the consumer's display layer.
 * @dont Roll a custom calendar — Radix Popover + react-day-picker handles a11y.
 */
export const DatePicker = forwardRef<HTMLDivElement, DatePickerProps>(function DatePicker(
  { value, onChange, label, placeholder = 'Pick a date', error, disabled, fromDate, toDate, className },
  ref,
) {
  const fieldId = useId();
  const [open, setOpen] = useState(false);

  return (
    <div ref={ref} className={cn(className)}>
      <PopoverPrimitive.Root open={open} onOpenChange={setOpen}>
        <PickerTrigger
          label={label}
          placeholder={placeholder}
          hasValue={Boolean(value)}
          error={error}
          fieldId={fieldId}
          disabled={disabled}
        >
          {formatDate(value)}
        </PickerTrigger>
        <PopoverPrimitive.Portal>
          <PopoverPrimitive.Content
            align="start"
            sideOffset={4}
            className="z-[var(--z-popover)] rounded-lg border border-border bg-popover text-popover-foreground shadow-md"
          >
            <DayPicker
              mode="single"
              selected={value}
              onSelect={(d) => {
                onChange(d ?? undefined);
                if (d) setOpen(false);
              }}
              fromDate={fromDate}
              toDate={toDate}
              classNames={calendarClassNames}
              components={calendarComponents}
            />
          </PopoverPrimitive.Content>
        </PopoverPrimitive.Portal>
      </PopoverPrimitive.Root>
    </div>
  );
});
DatePicker.displayName = 'DatePicker';

export interface DateRangePickerProps {
  value?: DateRange;
  onChange: (range: DateRange | undefined) => void;
  label?: ReactNode;
  placeholder?: string;
  error?: ReactNode;
  disabled?: boolean;
  fromDate?: Date;
  toDate?: Date;
  className?: string;
}

/**
 * Two-date range picker. `value` is `{from, to}`.
 *
 * @example
 *   <DateRangePicker label="Reporting period" value={range} onChange={setRange} />
 */
export const DateRangePicker = forwardRef<HTMLDivElement, DateRangePickerProps>(function DateRangePicker(
  { value, onChange, label, placeholder = 'Pick a range', error, disabled, fromDate, toDate, className },
  ref,
) {
  const fieldId = useId();
  const [open, setOpen] = useState(false);
  const hasValue = Boolean(value?.from);

  return (
    <div ref={ref} className={cn(className)}>
      <PopoverPrimitive.Root open={open} onOpenChange={setOpen}>
        <PickerTrigger
          label={label}
          placeholder={placeholder}
          hasValue={hasValue}
          error={error}
          fieldId={fieldId}
          disabled={disabled}
        >
          {value?.from && value.to
            ? `${formatDate(value.from)} – ${formatDate(value.to)}`
            : value?.from
              ? formatDate(value.from)
              : ''}
        </PickerTrigger>
        <PopoverPrimitive.Portal>
          <PopoverPrimitive.Content
            align="start"
            sideOffset={4}
            className="z-[var(--z-popover)] rounded-lg border border-border bg-popover text-popover-foreground shadow-md"
          >
            <DayPicker
              mode="range"
              selected={value}
              onSelect={onChange}
              numberOfMonths={2}
              fromDate={fromDate}
              toDate={toDate}
              classNames={calendarClassNames}
              components={calendarComponents}
            />
          </PopoverPrimitive.Content>
        </PopoverPrimitive.Portal>
      </PopoverPrimitive.Root>
    </div>
  );
});
DateRangePicker.displayName = 'DateRangePicker';
