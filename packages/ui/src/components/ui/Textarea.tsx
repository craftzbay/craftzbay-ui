'use client';

import {
  forwardRef,
  useCallback,
  useEffect,
  useId,
  useRef,
  type TextareaHTMLAttributes,
  type ReactNode,
} from 'react';
import { cn } from '@/lib/utils';

export interface TextareaProps
  extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  /** Visible label above the field. */
  label?: ReactNode;
  /** Hint below the field. Hidden when `error` is set. */
  helperText?: ReactNode;
  /** Validation message. Sets `aria-invalid`. */
  error?: ReactNode;
  /** Grow vertically as content is added. */
  autoResize?: boolean;
  /** Minimum rows when `autoResize`. Defaults to 3. */
  minRows?: number;
  /** Maximum rows before scrolling when `autoResize`. Defaults to 12. */
  maxRows?: number;
  /** Visually hide the label while keeping it accessible. */
  hideLabel?: boolean;
}

/**
 * Multi-line text input. With `autoResize`, height tracks content from
 * `minRows` to `maxRows`. Without it, behaves like a native `<textarea>`.
 *
 * @example Comment box
 *   <Textarea label="Note" autoResize minRows={3} maxRows={10} />
 *
 * @example With error
 *   <Textarea label="Description"
 *             error={errors.description?.message}
 *             {...register('description')} />
 *
 * @do Default to `autoResize` for multi-line free-form input.
 * @dont Add `resize-none` without auto-resize — users will be stuck with a
 *       3-line box for long content.
 */
export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(function Textarea(
  {
    className,
    label,
    helperText,
    error,
    autoResize,
    minRows = 3,
    maxRows = 12,
    hideLabel,
    id,
    onChange,
    value,
    defaultValue,
    ...props
  },
  ref,
) {
  const autoId = useId();
  const fieldId = id ?? autoId;
  const helperId = `${fieldId}-helper`;
  const errorId = `${fieldId}-error`;
  const innerRef = useRef<HTMLTextAreaElement | null>(null);

  // Stash a ref locally and forward to the consumer.
  const setRef = (node: HTMLTextAreaElement | null) => {
    innerRef.current = node;
    if (typeof ref === 'function') ref(node);
    else if (ref) (ref as React.MutableRefObject<HTMLTextAreaElement | null>).current = node;
  };

  const recompute = useCallback(() => {
    const el = innerRef.current;
    if (!el || !autoResize) return;
    el.style.height = 'auto';
    const lineHeight = parseFloat(getComputedStyle(el).lineHeight) || 20;
    const maxH = lineHeight * maxRows;
    el.style.height = `${Math.min(el.scrollHeight, maxH)}px`;
    el.style.overflowY = el.scrollHeight > maxH ? 'auto' : 'hidden';
  }, [autoResize, maxRows]);

  useEffect(() => {
    if (autoResize) recompute();
  }, [autoResize, recompute, value, defaultValue]);

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
      <textarea
        ref={setRef}
        id={fieldId}
        rows={minRows}
        value={value}
        defaultValue={defaultValue}
        onChange={(e) => {
          onChange?.(e);
          if (autoResize) recompute();
        }}
        aria-invalid={Boolean(error) || undefined}
        aria-describedby={error ? errorId : helperText ? helperId : undefined}
        className={cn(
          'rounded-md border bg-card px-3 py-2 text-lg md:text-sm text-foreground',
          'placeholder:text-foreground-subtle',
          'transition-colors duration-[var(--duration-fast)] ease-[var(--ease-out)]',
          'outline-none',
          'focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
          'focus-visible:ring-offset-background',
          'disabled:opacity-50 disabled:cursor-not-allowed',
          error
            ? 'border-danger focus-visible:border-danger focus-visible:ring-danger'
            : 'border-border-input focus-visible:border-accent',
          autoResize ? 'resize-none' : 'resize-y min-h-20',
        )}
        {...props}
      />
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

Textarea.displayName = 'Textarea';
