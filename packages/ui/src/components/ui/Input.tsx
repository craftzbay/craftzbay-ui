import {
  forwardRef,
  useId,
  useState,
  type InputHTMLAttributes,
  type ReactNode,
} from 'react';
import { Eye, EyeOff, Search, X } from '@/icons';
import { cn } from '@/lib/utils';
import { cva, type VariantProps } from '@/lib/cva';

/* -----------------------------------------------------------------------------
 *  Field-shell variants. The inner <input> is unstyled background and gets all
 *  its visual treatment from this wrapper so prefix / suffix / clear slots
 *  share the same border + focus state with no double rings.
 * --------------------------------------------------------------------------- */
const field = cva(
  [
    'group inline-flex items-center w-full',
    'rounded-md border bg-card text-sm',
    'transition-colors duration-[var(--duration-fast)] ease-[var(--ease-out)]',
    'has-disabled:opacity-50 has-disabled:pointer-events-none',
    'focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-offset-background',
  ],
  {
    variants: {
      size: {
        sm: 'h-8 px-2.5 gap-1.5',
        md: 'h-9 px-3 gap-2',
        lg: 'h-10 px-3.5 gap-2',
      },
      tone: {
        default: 'border-border focus-within:border-accent focus-within:ring-ring',
        error: 'border-danger focus-within:border-danger focus-within:ring-danger',
      },
    },
    defaultVariants: {
      size: 'md',
      tone: 'default',
    },
  },
);

const innerInput = cva([
  'flex-1 min-w-0 bg-transparent outline-none',
  'placeholder:text-foreground-subtle',
  'text-foreground',
  'disabled:cursor-not-allowed',
]);

type InputType = 'text' | 'email' | 'password' | 'number' | 'search' | 'tel' | 'url';

export interface InputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size' | 'prefix'>,
    VariantProps<typeof field> {
  /** Field type. `password` enables a show/hide toggle; `search` adds a clear button. */
  type?: InputType;
  /** Visible label rendered above the input. */
  label?: ReactNode;
  /** Hint below the input. Hidden while `error` is set. */
  helperText?: ReactNode;
  /** Validation message. Renders in `danger` colour and sets `aria-invalid`. */
  error?: ReactNode;
  /** Content rendered inside the field, before the input — icon or short text. */
  prefix?: ReactNode;
  /** Content rendered inside the field, after the input. */
  suffix?: ReactNode;
  /** Show an inline clear (×) button when the input has a value. */
  clearable?: boolean;
  /** Fires when the clear button is pressed. The consumer owns the state. */
  onClear?: () => void;
  /** Visually conceal the label while keeping it for screen readers. */
  hideLabel?: boolean;
}

/**
 * Text-style input with optional label, helper / error, prefix / suffix,
 * clear, and password show-hide. Wraps a single native `<input>` so it works
 * with `react-hook-form` and any controlled / uncontrolled pattern.
 *
 * @example Email with helper
 *   <Input type="email" label="Work email" helperText="We never share this." />
 *
 * @example Password with show/hide
 *   <Input type="password" label="Password" autoComplete="current-password" />
 *
 * @example Search with clear
 *   <Input type="search" placeholder="Search…" value={q} onChange={…}
 *          clearable onClear={() => setQ('')} />
 *
 * @do Always pair an input with a visible label. If space forces hiding it,
 *      use `hideLabel` so the label stays in the accessibility tree.
 * @dont Use placeholder as the only label — placeholders disappear on input
 *       and fail accessibility.
 */
export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  {
    className,
    type = 'text',
    size,
    tone,
    label,
    helperText,
    error,
    prefix,
    suffix,
    clearable,
    onClear,
    hideLabel,
    id,
    disabled,
    value,
    ...props
  },
  ref,
) {
  const autoId = useId();
  const fieldId = id ?? autoId;
  const helperId = `${fieldId}-helper`;
  const errorId = `${fieldId}-error`;

  const [showPassword, setShowPassword] = useState(false);
  const effectiveType =
    type === 'password' ? (showPassword ? 'text' : 'password') : type;

  const isError = Boolean(error);
  const effectiveTone = isError ? 'error' : tone;

  // Pre-fill prefix slot for search type.
  const renderedPrefix =
    prefix ?? (type === 'search' ? <Search className="size-4 text-foreground-subtle" aria-hidden /> : null);

  const hasValue = value !== undefined && value !== '' && value !== null;

  return (
    <div className={cn('flex flex-col gap-1.5', className)}>
      {label && (
        <label
          htmlFor={fieldId}
          className={cn(
            'text-sm font-medium text-foreground',
            hideLabel && 'sr-only',
          )}
        >
          {label}
        </label>
      )}

      <div className={cn(field({ size, tone: effectiveTone }))}>
        {renderedPrefix && (
          <span className="flex items-center text-foreground-subtle [&_svg]:size-4">
            {renderedPrefix}
          </span>
        )}

        <input
          ref={ref}
          id={fieldId}
          type={effectiveType}
          disabled={disabled}
          value={value}
          aria-invalid={isError || undefined}
          aria-describedby={
            error ? errorId : helperText ? helperId : undefined
          }
          className={cn(innerInput())}
          {...props}
        />

        {clearable && hasValue && (
          <button
            type="button"
            onClick={onClear}
            tabIndex={-1}
            aria-label="Clear input"
            className="flex items-center text-foreground-subtle hover:text-foreground"
          >
            <X className="size-4" aria-hidden />
          </button>
        )}

        {type === 'password' && (
          <button
            type="button"
            onClick={() => setShowPassword((p) => !p)}
            tabIndex={-1}
            aria-label={showPassword ? 'Hide password' : 'Show password'}
            aria-pressed={showPassword}
            className="flex items-center text-foreground-subtle hover:text-foreground"
          >
            {showPassword ? (
              <EyeOff className="size-4" aria-hidden />
            ) : (
              <Eye className="size-4" aria-hidden />
            )}
          </button>
        )}

        {suffix && (
          <span className="flex items-center text-foreground-subtle [&_svg]:size-4">
            {suffix}
          </span>
        )}
      </div>

      {error ? (
        <p id={errorId} role="alert" className="text-xs text-danger-text">
          {error}
        </p>
      ) : helperText ? (
        <p id={helperId} className="text-xs text-foreground-subtle">
          {helperText}
        </p>
      ) : null}
    </div>
  );
});

Input.displayName = 'Input';
