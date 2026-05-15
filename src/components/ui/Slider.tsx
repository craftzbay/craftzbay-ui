import {
  forwardRef,
  type ComponentPropsWithoutRef,
  type ElementRef,
  type ReactNode,
} from 'react';
import * as SliderPrimitive from '@radix-ui/react-slider';
import { cn } from '@/lib/utils';

export interface SliderProps
  extends Omit<ComponentPropsWithoutRef<typeof SliderPrimitive.Root>, 'value' | 'defaultValue'> {
  /**
   * Controlled value. Pass `[n]` for a single-thumb slider, `[a, b]` for a range slider.
   */
  value?: number[];
  defaultValue?: number[];
  /** Inline label rendered above the slider. */
  label?: ReactNode;
  /** Show the numeric value next to the label. */
  showValue?: boolean;
  /** Format the displayed value (e.g. `(v) => \`${v}%\``). */
  formatValue?: (value: number) => string;
}

/**
 * Single- or range-thumb slider. Pass one item in `value` for a single
 * thumb, two for a range.
 *
 * @example Single value
 *   <Slider label="Volume" showValue defaultValue={[60]} max={100} step={1} />
 *
 * @example Price range
 *   <Slider label="Price"
 *           defaultValue={[50, 250]}
 *           min={0} max={500} step={10}
 *           formatValue={(v) => \`$\${v}\`}
 *           showValue />
 *
 * @do Use `showValue` when the absolute number matters (price, volume, weight).
 * @dont Hide the value when users will need to reason about exact thresholds.
 */
export const Slider = forwardRef<ElementRef<typeof SliderPrimitive.Root>, SliderProps>(
  function Slider(
    {
      className,
      label,
      showValue,
      formatValue = (v) => String(v),
      value,
      defaultValue,
      ...props
    },
    ref,
  ) {
    const currentValue = value ?? defaultValue ?? [0];
    const isRange = currentValue.length > 1;

    return (
      <div className={cn('flex flex-col gap-2', className)}>
        {(label || showValue) && (
          <div className="flex items-center justify-between">
            {label && <span className="text-sm font-medium text-foreground">{label}</span>}
            {showValue && (
              <span className="text-xs tabular text-foreground-muted font-mono">
                {isRange
                  ? `${formatValue(currentValue[0])} – ${formatValue(currentValue[1])}`
                  : formatValue(currentValue[0])}
              </span>
            )}
          </div>
        )}

        <SliderPrimitive.Root
          ref={ref}
          value={value}
          defaultValue={defaultValue}
          className="relative flex w-full touch-none select-none items-center"
          {...props}
        >
          <SliderPrimitive.Track className="relative h-1 w-full grow overflow-hidden rounded-full bg-background-muted">
            <SliderPrimitive.Range className="absolute h-full bg-accent" />
          </SliderPrimitive.Track>
          {currentValue.map((_, i) => (
            <SliderPrimitive.Thumb
              key={i}
              className={cn(
                'block size-4 rounded-full border-2 border-accent bg-card shadow-sm',
                'outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background',
                'transition-transform duration-[var(--duration-fast)] ease-[var(--ease-out)]',
                'hover:scale-110 disabled:pointer-events-none disabled:opacity-50',
              )}
              aria-label={isRange ? (i === 0 ? 'Minimum' : 'Maximum') : (label ? String(label) : 'Value')}
            />
          ))}
        </SliderPrimitive.Root>
      </div>
    );
  },
);

Slider.displayName = 'Slider';
