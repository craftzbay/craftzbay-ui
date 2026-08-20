'use client';

import { forwardRef, useCallback, useEffect, useMemo, useState, type ReactNode } from 'react';
import * as PopoverPrimitive from '@radix-ui/react-popover';
import { Command as CommandPrimitive } from 'cmdk';
import { Check, ChevronsUpDown, Loader2, X } from '@/icons';
import { cn } from '@/lib/utils';
import { useStrings } from '@/hooks/use-strings';
import { useFieldIds } from '@/hooks/use-field-ids';
import { IconButton } from './IconButton';

export interface ComboboxOption {
  value: string;
  label: string;
  description?: string;
  disabled?: boolean;
}

export interface ComboboxProps {
  /** Currently selected value (controlled). */
  value: string | null;
  /** Called when a value is picked or cleared. */
  onChange: (value: string | null) => void;
  /** Static options. Ignored if `loadOptions` is provided. */
  options?: ComboboxOption[];
  /**
   * Async loader called with the current query each time it changes.
   * Use for server-side search.
   */
  loadOptions?: (query: string) => Promise<ComboboxOption[]>;
  /**
   * Label to show for a preset `value` in `loadOptions` mode before the
   * first search has resolved (the component has no option list yet).
   */
  selectedLabel?: string;
  /** Visible label above the field. */
  label?: ReactNode;
  /** Hint below the field. Hidden when `error` is set. */
  helperText?: ReactNode;
  /** Validation error. */
  error?: ReactNode;
  /** Placeholder shown when no value is selected. */
  placeholder?: string;
  /** Search placeholder inside the popover. */
  searchPlaceholder?: string;
  /** Empty state copy when nothing matches. */
  emptyText?: string;
  /** Allow clearing the selection with an inline ×. */
  clearable?: boolean;
  /** Disable the entire field. */
  disabled?: boolean;
  /** Field size, matches Input. */
  size?: 'sm' | 'md' | 'lg';
  /** Consumer-supplied id for the trigger (label association). */
  id?: string;
  className?: string;
}

/**
 * Single-select with typeahead. Use `options` for client-side filtering or
 * `loadOptions` for server-side search.
 *
 * @example Client-side
 *   <Combobox label="Country" options={countries} value={c} onChange={setC} />
 *
 * @example Server-side
 *   <Combobox label="Assignee"
 *             value={user}
 *             onChange={setUser}
 *             loadOptions={async (q) => api.searchUsers(q)} />
 *
 * @do Use Combobox over Select for >12 options or when the user is expected
 *      to know what they want.
 * @dont Re-query on every keystroke without debouncing — pass a debounced
 *       `loadOptions` to avoid hammering the server.
 */
export const Combobox = forwardRef<HTMLDivElement, ComboboxProps>(function Combobox(
  {
    value,
    onChange,
    options,
    loadOptions,
    selectedLabel,
    label,
    helperText,
    error,
    placeholder: placeholderProp,
    searchPlaceholder: searchPlaceholderProp,
    emptyText: emptyTextProp,
    clearable = true,
    disabled,
    size = 'md',
    id,
    className,
  },
  ref,
) {
  const strings = useStrings();
  const placeholder = placeholderProp ?? strings.combobox.placeholder;
  const searchPlaceholder = searchPlaceholderProp ?? strings.combobox.searchPlaceholder;
  const emptyText = emptyTextProp ?? strings.combobox.empty;
  const isError = Boolean(error);
  const { fieldId, helperId, errorId, describedBy } = useFieldIds(id, {
    hasHelper: Boolean(helperText),
    hasError: isError,
  });
  const listId = `${fieldId}-list`;

  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [loaded, setLoaded] = useState<ComboboxOption[]>([]);
  const [loading, setLoading] = useState(false);
  // In async mode the option list only exists after the first search, so the
  // chosen option is remembered here to keep its label on the trigger.
  const [selectedOption, setSelectedOption] = useState<ComboboxOption | null>(null);

  // Resolve options: static or async-loaded.
  const items = useMemo(
    () => (loadOptions ? loaded : (options ?? [])),
    [loadOptions, loaded, options],
  );

  useEffect(() => {
    if (!loadOptions || !open) return;
    let cancelled = false;
    setLoading(true);
    loadOptions(query)
      .then((res) => {
        if (!cancelled) setLoaded(res);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [query, open, loadOptions]);

  const selected = useMemo<ComboboxOption | null>(() => {
    if (value === null || value === undefined) return null;
    const fromItems = items.find((o) => o.value === value);
    if (fromItems) return fromItems;
    if (selectedOption?.value === value) return selectedOption;
    if (selectedLabel !== undefined) return { value, label: selectedLabel };
    return null;
  }, [items, value, selectedOption, selectedLabel]);

  const triggerHeight = size === 'sm' ? 'h-8' : size === 'lg' ? 'h-10' : 'h-9';
  const triggerPadding = size === 'sm' ? 'px-2.5' : size === 'lg' ? 'px-3.5' : 'px-3';
  // Leave room on the right for the clear button + chevron.
  const triggerPaddingRight = clearable ? 'pr-14' : 'pr-9';

  const handleClear = useCallback(() => {
    setSelectedOption(null);
    onChange(null);
  }, [onChange]);

  return (
    <div ref={ref} className={cn('flex flex-col gap-1.5', className)}>
      {label && (
        <label htmlFor={fieldId} className="text-foreground text-sm font-medium">
          {label}
        </label>
      )}

      <PopoverPrimitive.Root open={open} onOpenChange={setOpen}>
        <div className="relative w-full">
          <PopoverPrimitive.Trigger asChild>
            <button
              id={fieldId}
              type="button"
              role="combobox"
              aria-expanded={open}
              aria-haspopup="listbox"
              aria-controls={listId}
              aria-invalid={isError || undefined}
              aria-describedby={describedBy}
              disabled={disabled}
              className={cn(
                'bg-card text-foreground inline-flex w-full items-center justify-between gap-2 rounded-md border text-sm',
                'transition-colors duration-[var(--duration-fast)] ease-[var(--ease-out)]',
                'focus-visible:ring-offset-background outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
                'disabled:cursor-not-allowed disabled:opacity-50',
                triggerHeight,
                triggerPadding,
                triggerPaddingRight,
                isError
                  ? 'border-danger focus-visible:border-danger focus-visible:ring-danger'
                  : 'border-border-input focus-visible:border-accent focus-visible:ring-ring',
              )}
            >
              <span
                className={cn('truncate', !selected && 'text-foreground-subtle')}
                title={selected ? selected.label : undefined}
              >
                {selected ? selected.label : placeholder}
              </span>
            </button>
          </PopoverPrimitive.Trigger>

          {/* Controls sit outside the trigger: a button inside a button is invalid HTML. */}
          <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center gap-0.5 pr-2">
            {clearable && selected && !disabled && (
              <IconButton
                size="sm"
                variant="ghost"
                aria-label={strings.combobox.clear}
                icon={<X />}
                onClick={handleClear}
                className="text-foreground-subtle hover:text-foreground pointer-events-auto size-6"
              />
            )}
            <ChevronsUpDown className="text-foreground-subtle size-4" aria-hidden />
          </span>
        </div>

        <PopoverPrimitive.Portal>
          <PopoverPrimitive.Content
            align="start"
            sideOffset={4}
            className={cn(
              'border-border bg-popover text-popover-foreground z-[var(--z-popover)] w-[var(--radix-popover-trigger-width)] overflow-hidden rounded-lg border shadow-md',
              'data-[state=open]:animate-in data-[state=closed]:animate-out',
              'data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0',
              'data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95',
            )}
          >
            <CommandPrimitive shouldFilter={!loadOptions} className="flex h-full w-full flex-col">
              <div className="border-border flex items-center border-b px-3">
                <CommandPrimitive.Input
                  value={query}
                  onValueChange={setQuery}
                  placeholder={searchPlaceholder}
                  className="placeholder:text-foreground-subtle flex h-9 w-full bg-transparent py-2 text-lg outline-none md:text-sm"
                />
                {loading && (
                  <Loader2 className="text-foreground-subtle size-4 animate-spin" aria-hidden />
                )}
              </div>
              <CommandPrimitive.List id={listId} className="max-h-64 overflow-y-auto p-1">
                {items.map((opt) => {
                  const isSelected = opt.value === value;
                  return (
                    <CommandPrimitive.Item
                      key={opt.value}
                      value={opt.value}
                      disabled={opt.disabled}
                      onSelect={(v) => {
                        setSelectedOption(opt);
                        onChange(v);
                        setOpen(false);
                      }}
                      className={cn(
                        'text-foreground flex cursor-default items-center gap-2 rounded-sm px-2 py-1.5 text-sm',
                        'data-[selected=true]:bg-background-muted',
                        'data-[disabled=true]:pointer-events-none data-[disabled=true]:opacity-50',
                      )}
                    >
                      <span className="flex-1">{opt.label}</span>
                      {opt.description && (
                        <span className="text-foreground-subtle text-xs">{opt.description}</span>
                      )}
                      {isSelected && <Check className="text-accent size-4" aria-hidden />}
                    </CommandPrimitive.Item>
                  );
                })}
                {!loading && items.length === 0 && (
                  <CommandPrimitive.Empty className="text-foreground-subtle px-2 py-6 text-center text-sm">
                    {emptyText}
                  </CommandPrimitive.Empty>
                )}
              </CommandPrimitive.List>
            </CommandPrimitive>
          </PopoverPrimitive.Content>
        </PopoverPrimitive.Portal>
      </PopoverPrimitive.Root>

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

Combobox.displayName = 'Combobox';
