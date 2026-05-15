import {
  forwardRef,
  useCallback,
  useId,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent,
  type ReactNode,
} from 'react';
import * as PopoverPrimitive from '@radix-ui/react-popover';
import { Command as CommandPrimitive } from 'cmdk';
import { Check, ChevronsUpDown, X } from '@/icons';
import { cn } from '@/lib/utils';

export interface MultiSelectOption {
  /** Stable, unique value submitted in `onChange`. */
  value: string;
  /** Visible label shown both in the menu and in the selected chip. */
  label: string;
  /** Optional secondary text shown after the label in the menu. */
  description?: string;
  /** Disable selecting this option. */
  disabled?: boolean;
}

export interface MultiSelectProps {
  /** All possible options. */
  options: MultiSelectOption[];
  /** Currently selected values. Controlled. */
  value: string[];
  /** Called whenever the selection changes. */
  onChange: (next: string[]) => void;
  /** Visible label above the field. */
  label?: ReactNode;
  /** Hint below the field. Hidden when `error` is set. */
  helperText?: ReactNode;
  /** Validation message. */
  error?: ReactNode;
  /** Empty-state placeholder shown when nothing is selected. */
  placeholder?: string;
  /** Text shown when no options match the search. */
  emptyText?: string;
  /** Max number of chips rendered inline; remainder shown as "+N more". */
  maxVisibleChips?: number;
  /** Whether the user can clear all selections with a single click. */
  clearable?: boolean;
  /** Disable the entire field. */
  disabled?: boolean;
  className?: string;
}

/**
 * Chip-based multi-select with a searchable menu (cmdk under the hood).
 *
 * Keyboard:
 *   - Backspace on the input with empty query removes the last chip
 *   - Enter / Space toggles the highlighted option
 *   - Escape closes the menu
 *
 * @example Tag picker
 *   <MultiSelect label="Tags"
 *                options={tags}
 *                value={selected}
 *                onChange={setSelected}
 *                placeholder="Pick tags" />
 *
 * @example Bounded with overflow chip
 *   <MultiSelect options={users}
 *                value={value}
 *                onChange={setValue}
 *                maxVisibleChips={3} />
 *
 * @do Cap `maxVisibleChips` (3–5) on narrow surfaces so the field doesn't
 *      reflow as the user adds selections.
 * @dont Use MultiSelect for fewer than ~6 options. CheckboxGroup is clearer.
 */
export const MultiSelect = forwardRef<HTMLDivElement, MultiSelectProps>(function MultiSelect(
  {
    options,
    value,
    onChange,
    label,
    helperText,
    error,
    placeholder = 'Select…',
    emptyText = 'No results.',
    maxVisibleChips = 4,
    clearable = true,
    disabled,
    className,
  },
  ref,
) {
  const autoId = useId();
  const fieldId = autoId;
  const helperId = `${autoId}-helper`;
  const errorId = `${autoId}-error`;

  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const selected = useMemo(
    () => options.filter((o) => value.includes(o.value)),
    [options, value],
  );

  const toggle = useCallback(
    (v: string) => {
      if (value.includes(v)) onChange(value.filter((x) => x !== v));
      else onChange([...value, v]);
    },
    [value, onChange],
  );

  const clear = useCallback(() => onChange([]), [onChange]);

  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Backspace' && query === '' && value.length > 0) {
      onChange(value.slice(0, -1));
    }
  };

  const visibleChips = selected.slice(0, maxVisibleChips);
  const overflow = selected.length - visibleChips.length;
  const isError = Boolean(error);

  return (
    <div ref={ref} className={cn('flex flex-col gap-1.5', className)}>
      {label && (
        <label htmlFor={fieldId} className="text-sm font-medium text-foreground">
          {label}
        </label>
      )}

      <PopoverPrimitive.Root open={open} onOpenChange={setOpen}>
        <PopoverPrimitive.Trigger asChild>
          <div
            role="combobox"
            aria-expanded={open}
            aria-controls={`${fieldId}-list`}
            aria-haspopup="listbox"
            id={fieldId}
            tabIndex={disabled ? -1 : 0}
            onKeyDown={handleKeyDown}
            aria-disabled={disabled || undefined}
            aria-invalid={isError || undefined}
            aria-describedby={isError ? errorId : helperText ? helperId : undefined}
            className={cn(
              'flex w-full min-h-9 cursor-text flex-wrap items-center gap-1.5 rounded-md border bg-card px-2 py-1 text-sm',
              'transition-colors duration-[var(--duration-fast)] ease-[var(--ease-out)]',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-background',
              isError
                ? 'border-danger focus-visible:border-danger focus-visible:ring-danger'
                : 'border-border focus-visible:border-accent focus-visible:ring-ring',
              disabled && 'opacity-50 pointer-events-none',
            )}
            onClick={() => inputRef.current?.focus()}
          >
            {visibleChips.length === 0 && (
              <span className="text-foreground-subtle px-1">{placeholder}</span>
            )}
            {visibleChips.map((opt) => (
              <span
                key={opt.value}
                className="inline-flex items-center gap-1 rounded-md bg-accent-soft px-1.5 py-0.5 text-xs font-medium text-on-accent-soft"
              >
                {opt.label}
                <button
                  type="button"
                  aria-label={`Remove ${opt.label}`}
                  className="inline-flex items-center text-on-accent-soft hover:text-foreground"
                  onClick={(e) => {
                    e.stopPropagation();
                    toggle(opt.value);
                  }}
                >
                  <X className="size-3" aria-hidden />
                </button>
              </span>
            ))}
            {overflow > 0 && (
              <span className="rounded-md bg-background-muted px-1.5 py-0.5 text-xs font-medium text-foreground-muted">
                +{overflow} more
              </span>
            )}
            <input
              ref={inputRef}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onFocus={() => setOpen(true)}
              className="flex-1 min-w-[8ch] bg-transparent text-sm outline-none placeholder:text-foreground-subtle"
              placeholder={selected.length === 0 ? '' : ''}
              disabled={disabled}
            />
            <span className="ml-auto flex items-center gap-1">
              {clearable && selected.length > 0 && (
                <button
                  type="button"
                  aria-label="Clear all"
                  onClick={(e) => {
                    e.stopPropagation();
                    clear();
                  }}
                  className="text-foreground-subtle hover:text-foreground"
                >
                  <X className="size-4" aria-hidden />
                </button>
              )}
              <ChevronsUpDown className="size-4 text-foreground-subtle" aria-hidden />
            </span>
          </div>
        </PopoverPrimitive.Trigger>

        <PopoverPrimitive.Portal>
          <PopoverPrimitive.Content
            align="start"
            sideOffset={4}
            className={cn(
              'z-[var(--z-popover)] w-[var(--radix-popover-trigger-width)] overflow-hidden rounded-lg border border-border bg-popover text-popover-foreground shadow-md',
              'data-[state=open]:animate-in data-[state=closed]:animate-out',
              'data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0',
              'data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95',
            )}
            onOpenAutoFocus={(e) => e.preventDefault()}
          >
            <CommandPrimitive shouldFilter={false} className="flex h-full w-full flex-col">
              <CommandPrimitive.List
                id={`${fieldId}-list`}
                className="max-h-64 overflow-y-auto p-1"
              >
                {options
                  .filter((o) => o.label.toLowerCase().includes(query.toLowerCase()))
                  .map((opt) => {
                    const isSelected = value.includes(opt.value);
                    return (
                      <CommandPrimitive.Item
                        key={opt.value}
                        value={opt.value}
                        disabled={opt.disabled}
                        onSelect={() => toggle(opt.value)}
                        className={cn(
                          'flex cursor-default items-center gap-2 rounded-sm px-2 py-1.5 text-sm text-foreground',
                          'data-[selected=true]:bg-background-muted',
                          'data-[disabled=true]:opacity-50 data-[disabled=true]:pointer-events-none',
                        )}
                      >
                        <span
                          aria-hidden
                          className={cn(
                            'flex size-4 items-center justify-center rounded-sm border',
                            isSelected ? 'border-accent bg-accent text-on-accent' : 'border-border',
                          )}
                        >
                          {isSelected && <Check className="size-3" aria-hidden />}
                        </span>
                        <span className="flex-1">{opt.label}</span>
                        {opt.description && (
                          <span className="text-xs text-foreground-subtle">{opt.description}</span>
                        )}
                      </CommandPrimitive.Item>
                    );
                  })}
                <CommandPrimitive.Empty className="px-2 py-6 text-center text-sm text-foreground-subtle">
                  {emptyText}
                </CommandPrimitive.Empty>
              </CommandPrimitive.List>
            </CommandPrimitive>
          </PopoverPrimitive.Content>
        </PopoverPrimitive.Portal>
      </PopoverPrimitive.Root>

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

MultiSelect.displayName = 'MultiSelect';
