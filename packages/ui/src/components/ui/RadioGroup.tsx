'use client';

import {
  forwardRef,
  useId,
  type ComponentPropsWithoutRef,
  type ElementRef,
  type ReactNode,
} from 'react';
import * as RadioGroupPrimitive from '@radix-ui/react-radio-group';
import { cn } from '@/lib/utils';

export interface RadioGroupProps
  extends ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Root> {
  /** Lay out the radios horizontally (default) or vertically. */
  orientation?: 'horizontal' | 'vertical';
}

export const RadioGroup = forwardRef<
  ElementRef<typeof RadioGroupPrimitive.Root>,
  RadioGroupProps
>(function RadioGroup({ className, orientation = 'vertical', ...props }, ref) {
  return (
    <RadioGroupPrimitive.Root
      ref={ref}
      className={cn(
        'flex gap-3',
        orientation === 'vertical' ? 'flex-col' : 'flex-row flex-wrap',
        className,
      )}
      {...props}
    />
  );
});
RadioGroup.displayName = 'RadioGroup';

export interface RadioItemProps
  extends Omit<ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Item>, 'asChild'> {
  label?: ReactNode;
  description?: ReactNode;
  hideLabel?: boolean;
}

/**
 * One radio option with inline label + description.
 *
 * @example
 *   <RadioGroup defaultValue="weekly">
 *     <RadioItem value="daily" label="Daily" description="Every morning at 9am" />
 *     <RadioItem value="weekly" label="Weekly" description="Monday mornings" />
 *     <RadioItem value="never" label="Never" />
 *   </RadioGroup>
 *
 * @do Pair every RadioItem with a label — naked radios are unreachable for
 *      screen reader users.
 * @dont Use RadioGroup for binary choices — use Switch.
 */
export const RadioItem = forwardRef<
  ElementRef<typeof RadioGroupPrimitive.Item>,
  RadioItemProps
>(function RadioItem({ className, label, description, hideLabel, id, disabled, ...props }, ref) {
  const autoId = useId();
  const fieldId = id ?? autoId;
  const descId = description ? `${fieldId}-desc` : undefined;

  return (
    <div className={cn('flex items-start gap-2.5', className)}>
      <RadioGroupPrimitive.Item
        ref={ref}
        id={fieldId}
        disabled={disabled}
        aria-describedby={descId}
        className={cn(
          'mt-0.5 flex size-4 shrink-0 items-center justify-center rounded-full border bg-card',
          'transition-colors duration-[var(--duration-fast)] ease-[var(--ease-out)]',
          'outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background',
          'data-[state=checked]:border-accent',
          'disabled:cursor-not-allowed disabled:opacity-50',
          'border-border-input',
        )}
        {...props}
      >
        <RadioGroupPrimitive.Indicator className="flex items-center justify-center">
          <span className="size-2 rounded-full bg-accent" aria-hidden />
        </RadioGroupPrimitive.Indicator>
      </RadioGroupPrimitive.Item>

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
  );
});
RadioItem.displayName = 'RadioItem';
