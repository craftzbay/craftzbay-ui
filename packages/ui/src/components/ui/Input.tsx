'use client';

import {
  forwardRef,
  useRef,
  useState,
  type FormEvent,
  type InputHTMLAttributes,
  type ReactNode,
} from 'react';
import { Eye, EyeOff, Search, X } from '@/icons';
import { cn } from '@/lib/utils';
import { useStrings } from '@/hooks/use-strings';
import { cva, type VariantProps } from '@/lib/cva';
import { useFieldIds } from '@/hooks/use-field-ids';

/* -----------------------------------------------------------------------------
 *  Field-shell variants. The inner <input> is unstyled background and gets all
 *  its visual treatment from this wrapper so prefix / suffix / clear slots
 *  share the same border + focus state with no double rings.
 * --------------------------------------------------------------------------- */
const field = cva(
  [
    'group inline-flex items-center w-full',
    'rounded-md border border-border-input bg-card text-sm',
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
        default: 'focus-within:border-accent focus-within:ring-ring',
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
  // 16px below md so iOS Safari does not zoom the page on focus; --text-lg = 1rem.
  'text-lg md:text-sm',
  'disabled:cursor-not-allowed',
]);

type InputType = NonNullable<InputHTMLAttributes<HTMLInputElement>['type']>;

export interface InputProps
  extends
    Omit<InputHTMLAttributes<HTMLInputElement>, 'size' | 'prefix'>,
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
  /**
   * Fires when the clear button is pressed. Controlled inputs own their state
   * and should reset `value` here; uncontrolled inputs are cleared for you.
   */
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
    defaultValue,
    onInput,
    ...props
  },
  ref,
) {
  const strings = useStrings();
  const isError = Boolean(error);
  const { fieldId, helperId, errorId, describedBy } = useFieldIds(id, {
    hasHelper: Boolean(helperText),
    hasError: isError,
  });
  const innerRef = useRef<HTMLInputElement | null>(null);
  const setRefs = (el: HTMLInputElement | null) => {
    innerRef.current = el;
    if (typeof ref === 'function') ref(el);
    else if (ref) ref.current = el;
  };

  const [showPassword, setShowPassword] = useState(false);
  const effectiveType = type === 'password' ? (showPassword ? 'text' : 'password') : type;

  const effectiveTone = isError ? 'error' : tone;

  // Pre-fill prefix slot for search type.
  const renderedPrefix =
    prefix ??
    (type === 'search' ? <Search className="text-foreground-subtle size-4" aria-hidden /> : null);

  // Track the value of uncontrolled inputs so `clearable` can show/hide the
  // button without the consumer wiring state.
  const isControlled = value !== undefined;
  const [localValue, setLocalValue] = useState<string>(
    defaultValue === undefined || defaultValue === null ? '' : String(defaultValue),
  );
  const current = isControlled ? value : localValue;
  const hasValue = current !== undefined && current !== '' && current !== null;

  const handleInput = (e: FormEvent<HTMLInputElement>) => {
    if (!isControlled) setLocalValue(e.currentTarget.value);
    onInput?.(e);
  };

  const handleClear = () => {
    if (!isControlled && innerRef.current) {
      // Use the native setter so React's onChange/onInput listeners fire.
      const setter = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value')?.set;
      setter?.call(innerRef.current, '');
      innerRef.current.dispatchEvent(new Event('input', { bubbles: true }));
      setLocalValue('');
    }
    onClear?.();
    innerRef.current?.focus();
  };

  return (
    <div className={cn('flex flex-col gap-1.5', className)}>
      {label && (
        <label
          htmlFor={fieldId}
          className={cn('text-foreground text-sm font-medium', hideLabel && 'sr-only')}
        >
          {label}
        </label>
      )}

      <div className={cn(field({ size, tone: effectiveTone }))}>
        {renderedPrefix && (
          <span className="text-foreground-subtle flex items-center [&_svg]:size-4">
            {renderedPrefix}
          </span>
        )}

        <input
          ref={setRefs}
          id={fieldId}
          type={effectiveType}
          disabled={disabled}
          value={value}
          defaultValue={defaultValue}
          onInput={handleInput}
          aria-invalid={isError || undefined}
          aria-describedby={describedBy}
          className={cn(innerInput())}
          {...props}
        />

        {clearable && hasValue && (
          <button
            type="button"
            onClick={handleClear}
            aria-label={strings.input.clear}
            className="text-foreground-subtle hover:text-foreground focus-visible:ring-ring flex items-center rounded-sm outline-none focus-visible:ring-2"
          >
            <X className="size-4" aria-hidden />
          </button>
        )}

        {type === 'password' && (
          <button
            type="button"
            onClick={() => setShowPassword((p) => !p)}
            aria-label={showPassword ? strings.input.hidePassword : strings.input.showPassword}
            aria-pressed={showPassword}
            className="text-foreground-subtle hover:text-foreground focus-visible:ring-ring flex items-center rounded-sm outline-none focus-visible:ring-2"
          >
            {showPassword ? (
              <EyeOff className="size-4" aria-hidden />
            ) : (
              <Eye className="size-4" aria-hidden />
            )}
          </button>
        )}

        {suffix && (
          <span className="text-foreground-subtle flex items-center [&_svg]:size-4">{suffix}</span>
        )}
      </div>

      {error ? (
        <p id={errorId} role="alert" className="text-danger-text text-xs">
          {error}
        </p>
      ) : helperText ? (
        <p id={helperId} className="text-foreground-subtle text-xs">
          {helperText}
        </p>
      ) : null}
    </div>
  );
});

Input.displayName = 'Input';
