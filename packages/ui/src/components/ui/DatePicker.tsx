'use client';

import { forwardRef, useId, useMemo, useState, type ReactNode } from 'react';
import * as PopoverPrimitive from '@radix-ui/react-popover';
import type { DateRange, DayPickerProps, Matcher } from 'react-day-picker';
import { Calendar as CalendarIcon } from '@/icons';
import { Calendar } from './Calendar';
import { cn } from '@/lib/utils';
import { useStrings } from '@/hooks/use-strings';

/* -----------------------------------------------------------------------------
 *  Two related components share the same trigger shell:
 *
 *    <DatePicker value={date} onChange={setDate} />        // single date
 *    <DateRangePicker value={range} onChange={setRange} /> // {from,to}
 * --------------------------------------------------------------------------- */

type CalendarLocale = DayPickerProps['locale'];

function defaultFormatDate(d: Date): string {
  return d.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
}

/** Merge the fromDate/toDate bounds with any consumer-supplied RDP matcher. */
function useBounds(fromDate?: Date, toDate?: Date, disabled?: Matcher | Matcher[]) {
  return useMemo<Matcher[] | undefined>(() => {
    const list: Matcher[] = [];
    if (fromDate) list.push({ before: fromDate });
    if (toDate) list.push({ after: toDate });
    if (disabled) list.push(...(Array.isArray(disabled) ? disabled : [disabled]));
    return list.length ? list : undefined;
  }, [fromDate, toDate, disabled]);
}

function PickerTrigger({
  label,
  placeholder,
  hasValue,
  children,
  error,
  fieldId,
  disabled,
  open,
}: {
  label?: ReactNode;
  placeholder: string;
  hasValue: boolean;
  children: ReactNode;
  error?: ReactNode;
  fieldId: string;
  disabled?: boolean;
  open: boolean;
}) {
  const errorId = `${fieldId}-error`;
  const calendarId = `${fieldId}-calendar`;
  const text = hasValue ? children : placeholder;
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label htmlFor={fieldId} className="text-foreground text-sm font-medium">
          {label}
        </label>
      )}
      <PopoverPrimitive.Trigger asChild>
        <button
          id={fieldId}
          type="button"
          // combobox-with-dialog pattern: lets the field carry aria-invalid like other inputs.
          role="combobox"
          aria-expanded={open}
          aria-controls={calendarId}
          disabled={disabled}
          aria-invalid={Boolean(error) || undefined}
          aria-describedby={error ? errorId : undefined}
          className={cn(
            'bg-card inline-flex h-9 w-full items-center justify-start gap-2 rounded-md border px-3 text-left text-sm',
            'transition-colors duration-[var(--duration-fast)] ease-[var(--ease-out)]',
            'focus-visible:ring-offset-background outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
            'disabled:cursor-not-allowed disabled:opacity-50',
            error
              ? 'border-danger focus-visible:border-danger focus-visible:ring-danger'
              : 'border-border-input focus-visible:border-accent focus-visible:ring-ring',
            !hasValue && 'text-foreground-subtle',
          )}
        >
          <CalendarIcon className="text-foreground-subtle size-4" aria-hidden />
          <span className="truncate" title={typeof text === 'string' ? text : undefined}>
            {text}
          </span>
        </button>
      </PopoverPrimitive.Trigger>
      {error && (
        <p id={errorId} role="alert" className="text-danger-text text-xs">
          {error}
        </p>
      )}
    </div>
  );
}

interface PickerCommonProps {
  label?: ReactNode;
  placeholder?: string;
  error?: ReactNode;
  disabled?: boolean;
  /** Restrict to a date range. Days outside are not selectable. */
  fromDate?: Date;
  toDate?: Date;
  /** Extra RDP matcher(s) for disabled days, merged with `fromDate`/`toDate`. */
  disabledDays?: Matcher | Matcher[];
  /** Custom display formatter for the trigger text. */
  formatDate?: (d: Date) => string;
  /** date-fns locale object passed through to react-day-picker. */
  locale?: CalendarLocale;
  className?: string;
}

export interface DatePickerProps extends PickerCommonProps {
  value?: Date;
  onChange: (date: Date | undefined) => void;
}

/**
 * Single-date picker.
 *
 * @example
 *   <DatePicker label="Date of birth" value={dob} onChange={setDob} />
 *
 * @do Use locale-aware formatting via `formatDate` / `locale`.
 * @dont Roll a custom calendar — Radix Popover + react-day-picker handles a11y.
 */
export const DatePicker = forwardRef<HTMLDivElement, DatePickerProps>(function DatePicker(
  {
    value,
    onChange,
    label,
    placeholder: placeholderProp,
    error,
    disabled,
    fromDate,
    toDate,
    disabledDays,
    formatDate = defaultFormatDate,
    locale,
    className,
  },
  ref,
) {
  const strings = useStrings();
  const placeholder = placeholderProp ?? strings.datePicker.pickDate;
  const fieldId = useId();
  const [open, setOpen] = useState(false);
  const bounds = useBounds(fromDate, toDate, disabledDays);

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
          open={open}
        >
          {value ? formatDate(value) : ''}
        </PickerTrigger>
        <PopoverPrimitive.Portal>
          <PopoverPrimitive.Content
            id={`${fieldId}-calendar`}
            align="start"
            sideOffset={4}
            className="text-popover-foreground z-[var(--z-popover)] rounded-lg shadow-lg"
          >
            <Calendar
              mode="single"
              selected={value}
              onSelect={(d) => {
                onChange(d ?? undefined);
                if (d) setOpen(false);
              }}
              startMonth={fromDate}
              endMonth={toDate}
              disabled={bounds}
              locale={locale}
            />
          </PopoverPrimitive.Content>
        </PopoverPrimitive.Portal>
      </PopoverPrimitive.Root>
    </div>
  );
});
DatePicker.displayName = 'DatePicker';

export interface DateRangePickerProps extends PickerCommonProps {
  value?: DateRange;
  onChange: (range: DateRange | undefined) => void;
}

/**
 * Two-date range picker. `value` is `{from, to}`.
 *
 * @example
 *   <DateRangePicker label="Reporting period" value={range} onChange={setRange} />
 */
export const DateRangePicker = forwardRef<HTMLDivElement, DateRangePickerProps>(
  function DateRangePicker(
    {
      value,
      onChange,
      label,
      placeholder: placeholderProp,
      error,
      disabled,
      fromDate,
      toDate,
      disabledDays,
      formatDate = defaultFormatDate,
      locale,
      className,
    },
    ref,
  ) {
    const strings = useStrings();
    const placeholder = placeholderProp ?? strings.datePicker.pickRange;
    const fieldId = useId();
    const [open, setOpen] = useState(false);
    const hasValue = Boolean(value?.from);
    const bounds = useBounds(fromDate, toDate, disabledDays);

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
            open={open}
          >
            {value?.from && value.to
              ? `${formatDate(value.from)} – ${formatDate(value.to)}`
              : value?.from
                ? formatDate(value.from)
                : ''}
          </PickerTrigger>
          <PopoverPrimitive.Portal>
            <PopoverPrimitive.Content
              id={`${fieldId}-calendar`}
              align="start"
              sideOffset={4}
              className="text-popover-foreground z-[var(--z-popover)] rounded-lg shadow-lg"
            >
              <Calendar
                mode="range"
                selected={value}
                onSelect={onChange}
                numberOfMonths={2}
                startMonth={fromDate}
                endMonth={toDate}
                disabled={bounds}
                locale={locale}
              />
            </PopoverPrimitive.Content>
          </PopoverPrimitive.Portal>
        </PopoverPrimitive.Root>
      </div>
    );
  },
);
DateRangePicker.displayName = 'DateRangePicker';
