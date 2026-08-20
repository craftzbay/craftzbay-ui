'use client';

import { forwardRef, useId, type ComponentPropsWithoutRef, type ElementRef, type ReactNode } from 'react';
import * as CheckboxPrimitive from '@radix-ui/react-checkbox';
import { Check, Minus } from '@/icons';
import { cn } from '@/lib/utils';

export interface CheckboxProps
  extends Omit<ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root>, 'asChild'> {
  /** Visible label rendered to the right of the box. */
  label?: ReactNode;
  /** Secondary description rendered below the label. */
  description?: ReactNode;
  /** Validation error message. */
  error?: ReactNode;
  /** Hide the label visually while keeping it in the a11y tree. */
  hideLabel?: boolean;
}

/**
 * Checkbox with optional inline label + description. Pass `checked="indeterminate"`
 * for the indeterminate state — Radix renders a `Minus` icon automatically.
 *
 * @example Single
 *   <Checkbox label="I agree to the terms" checked={ok} onCheckedChange={setOk} />
 *
 * @example Tri-state header
 *   <Checkbox aria-label="Select all"
 *             checked={allSelected ? true : someSelected ? 'indeterminate' : false}
 *             onCheckedChange={toggleAll} />
 *
 * @do Use indeterminate to summarise child rows in a table header.
 * @dont Use a Checkbox for mutually exclusive choices — use RadioGroup.
 */
export const Checkbox = forwardRef<ElementRef<typeof CheckboxPrimitive.Root>, CheckboxProps>(
  function Checkbox({ className, label, description, error, hideLabel, id, disabled, ...props }, ref) {
    const autoId = useId();
    const fieldId = id ?? autoId;
    const descId = description ? `${fieldId}-desc` : undefined;
    const errorId = error ? `${fieldId}-error` : undefined;

    return (
      <div className={cn('flex flex-col gap-1', className)}>
        <div className="flex items-start gap-2.5">
          <CheckboxPrimitive.Root
            ref={ref}
            id={fieldId}
            disabled={disabled}
            aria-describedby={errorId ?? descId}
            aria-invalid={Boolean(error) || undefined}
            className={cn(
              'peer mt-0.5 flex size-4 shrink-0 items-center justify-center rounded-sm border',
              'transition-colors duration-[var(--duration-fast)] ease-[var(--ease-out)]',
              'outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background',
              'data-[state=checked]:bg-accent data-[state=checked]:border-accent data-[state=checked]:text-on-accent',
              'data-[state=indeterminate]:bg-accent data-[state=indeterminate]:border-accent data-[state=indeterminate]:text-on-accent',
              'disabled:cursor-not-allowed disabled:opacity-50',
              error ? 'border-danger' : 'border-border-input',
            )}
            {...props}
          >
            <CheckboxPrimitive.Indicator className="flex items-center justify-center">
              {props.checked === 'indeterminate' ? (
                <Minus className="size-3" aria-hidden strokeWidth={3} />
              ) : (
                <Check className="size-3" aria-hidden strokeWidth={3} />
              )}
            </CheckboxPrimitive.Indicator>
          </CheckboxPrimitive.Root>

          {label && (
            <div className={cn('flex flex-col gap-0.5', hideLabel && 'sr-only')}>
              <label
                htmlFor={fieldId}
                className={cn(
                  'text-sm text-foreground select-none',
                  disabled && 'opacity-50 cursor-not-allowed',
                )}
              >
                {label}
              </label>
              {description && (
                <p id={descId} className="text-xs text-foreground-subtle">
                  {description}
                </p>
              )}
            </div>
          )}
        </div>
        {error && (
          <p id={errorId} role="alert" className="text-xs text-danger-text">
            {error}
          </p>
        )}
      </div>
    );
  },
);

Checkbox.displayName = 'Checkbox';
