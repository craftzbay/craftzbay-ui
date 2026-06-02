import {
  forwardRef,
  type ComponentPropsWithoutRef,
  type ElementRef,
  type SVGProps,
} from 'react';
import * as ProgressPrimitive from '@radix-ui/react-progress';
import { cn } from '@/lib/utils';

/* -----------------------------------------------------------------------------
 *  Linear — bar that fills left-to-right.
 *  Circular — SVG ring. Both support determinate (value 0..100) and
 *  indeterminate (`value` omitted) states.
 * --------------------------------------------------------------------------- */

export interface ProgressProps
  extends Omit<ComponentPropsWithoutRef<typeof ProgressPrimitive.Root>, 'value'> {
  /** 0–100. Omit for indeterminate. */
  value?: number | null;
  /** Bar height. */
  size?: 'sm' | 'md' | 'lg';
  /** Visual tone. Use `success`/`danger` to colour-code completion state. */
  tone?: 'accent' | 'success' | 'warning' | 'danger';
}

const heightMap = { sm: 'h-1', md: 'h-1.5', lg: 'h-2' } as const;
const fillTone = {
  accent: 'bg-accent',
  success: 'bg-success',
  warning: 'bg-warning',
  danger: 'bg-danger',
} as const;

/**
 * Linear progress bar.
 *
 * @example
 *   <Progress value={uploadPct} aria-label="Upload progress" />
 *   <Progress aria-label="Loading" /> // indeterminate
 *
 * @do Always pair Progress with an `aria-label` describing what is progressing.
 * @dont Use a Progress for an unknown-completion task — use a Spinner.
 */
export const Progress = forwardRef<ElementRef<typeof ProgressPrimitive.Root>, ProgressProps>(
  function Progress({ className, value, size = 'md', tone = 'accent', ...props }, ref) {
    const indeterminate = value === undefined || value === null;
    return (
      <ProgressPrimitive.Root
        ref={ref}
        value={indeterminate ? undefined : value}
        className={cn(
          'relative w-full overflow-hidden rounded-full bg-background-muted',
          heightMap[size],
          className,
        )}
        {...props}
      >
        <ProgressPrimitive.Indicator
          className={cn(
            'h-full w-full flex-1 transition-transform',
            fillTone[tone],
            indeterminate && 'animate-[progressIndeterminate_1.4s_ease-in-out_infinite] origin-left',
          )}
          style={
            indeterminate
              ? undefined
              : { transform: `translateX(-${100 - (value ?? 0)}%)` }
          }
        />
        {/* Keyframes inline so consumers don't need to register them globally. */}
        <style>{`
          @keyframes progressIndeterminate {
            0% { transform: translateX(-100%) scaleX(0.6); }
            50% { transform: translateX(0%) scaleX(0.4); }
            100% { transform: translateX(100%) scaleX(0.6); }
          }
        `}</style>
      </ProgressPrimitive.Root>
    );
  },
);
Progress.displayName = 'Progress';

export interface ProgressCircleProps extends SVGProps<SVGSVGElement> {
  /** 0–100. Omit for indeterminate. */
  value?: number;
  /** Pixel size of the SVG. */
  size?: number;
  /** Stroke thickness. */
  thickness?: number;
  /** Visible label for screen readers. */
  'aria-label': string;
  tone?: 'accent' | 'success' | 'warning' | 'danger';
}

const circleTone = {
  accent: 'stroke-accent',
  success: 'stroke-success',
  warning: 'stroke-warning',
  danger: 'stroke-danger',
} as const;

/**
 * Circular progress ring. Pairs with a numeric label for percentage-style
 * indicators.
 *
 * @example
 *   <ProgressCircle value={72} aria-label="Storage used" />
 */
export const ProgressCircle = forwardRef<SVGSVGElement, ProgressCircleProps>(function ProgressCircle(
  { value, size = 36, thickness = 3, className, tone = 'accent', ...props },
  ref,
) {
  const isIndeterminate = value === undefined;
  const radius = (size - thickness) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = isIndeterminate ? 0 : circumference - (Math.min(100, Math.max(0, value)) / 100) * circumference;

  return (
    <svg
      ref={ref}
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={isIndeterminate ? undefined : value}
      className={cn('shrink-0', isIndeterminate && 'animate-spin', className)}
      {...props}
    >
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        strokeWidth={thickness}
        className="stroke-background-muted fill-none"
      />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        strokeWidth={thickness}
        strokeLinecap="round"
        strokeDasharray={circumference}
        strokeDashoffset={isIndeterminate ? circumference * 0.7 : offset}
        className={cn(circleTone[tone], 'fill-none transition-[stroke-dashoffset]')}
        transform={`rotate(-90 ${size / 2} ${size / 2})`}
      />
    </svg>
  );
});
ProgressCircle.displayName = 'ProgressCircle';
