import {
  forwardRef,
  useCallback,
  useEffect,
  useId,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import * as PopoverPrimitive from '@radix-ui/react-popover';
import { Command as CommandPrimitive } from 'cmdk';
import { Check, ChevronsUpDown, Loader2, X } from '@/icons';
import { cn } from '@/lib/utils';

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
    label,
    helperText,
    error,
    placeholder = 'Select…',
    searchPlaceholder = 'Search…',
    emptyText = 'No results.',
    clearable = true,
    disabled,
    size = 'md',
    className,
  },
  ref,
) {
  const autoId = useId();
  const helperId = `${autoId}-helper`;
  const errorId = `${autoId}-error`;

  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [loaded, setLoaded] = useState<ComboboxOption[]>([]);
  const [loading, setLoading] = useState(false);

  // Resolve options: static or async-loaded.
  const items = loadOptions ? loaded : options ?? [];

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

  const selected = useMemo(
    () => items.find((o) => o.value === value) ?? null,
    [items, value],
  );

  const triggerHeight = size === 'sm' ? 'h-8' : size === 'lg' ? 'h-10' : 'h-9';
  const triggerPadding = size === 'sm' ? 'px-2.5' : size === 'lg' ? 'px-3.5' : 'px-3';

  const handleClear = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      onChange(null);
    },
    [onChange],
  );

  const isError = Boolean(error);

  return (
    <div ref={ref} className={cn('flex flex-col gap-1.5', className)}>
      {label && (
        <label htmlFor={autoId} className="text-sm font-medium text-foreground">
          {label}
        </label>
      )}

      <PopoverPrimitive.Root open={open} onOpenChange={setOpen}>
        <PopoverPrimitive.Trigger asChild>
          <button
            id={autoId}
            type="button"
            role="combobox"
            aria-expanded={open}
            aria-invalid={isError || undefined}
            aria-describedby={isError ? errorId : helperText ? helperId : undefined}
            disabled={disabled}
            className={cn(
              'inline-flex w-full items-center justify-between gap-2 rounded-md border bg-card text-sm text-foreground',
              'transition-colors duration-[var(--duration-fast)] ease-[var(--ease-out)]',
              'outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-background',
              'disabled:opacity-50 disabled:cursor-not-allowed',
              triggerHeight,
              triggerPadding,
              isError
                ? 'border-danger focus-visible:border-danger focus-visible:ring-danger'
                : 'border-border focus-visible:border-accent focus-visible:ring-ring',
            )}
          >
            <span className={cn('truncate', !selected && 'text-foreground-subtle')}>
              {selected ? selected.label : placeholder}
            </span>
            <span className="ml-2 flex items-center gap-1 shrink-0">
              {clearable && selected && !disabled && (
                <span
                  role="button"
                  tabIndex={-1}
                  onClick={handleClear}
                  aria-label="Clear selection"
                  className="text-foreground-subtle hover:text-foreground"
                >
                  <X className="size-4" aria-hidden />
                </span>
              )}
              <ChevronsUpDown className="size-4 text-foreground-subtle" aria-hidden />
            </span>
          </button>
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
          >
            <CommandPrimitive shouldFilter={!loadOptions} className="flex h-full w-full flex-col">
              <div className="flex items-center border-b border-border px-3">
                <CommandPrimitive.Input
                  value={query}
                  onValueChange={setQuery}
                  placeholder={searchPlaceholder}
                  className="flex h-9 w-full bg-transparent py-2 text-sm outline-none placeholder:text-foreground-subtle"
                />
                {loading && (
                  <Loader2 className="size-4 animate-spin text-foreground-subtle" aria-hidden />
                )}
              </div>
              <CommandPrimitive.List className="max-h-64 overflow-y-auto p-1">
                {items.map((opt) => {
                  const isSelected = opt.value === value;
                  return (
                    <CommandPrimitive.Item
                      key={opt.value}
                      value={opt.value}
                      disabled={opt.disabled}
                      onSelect={(v) => {
                        onChange(v);
                        setOpen(false);
                      }}
                      className={cn(
                        'flex cursor-default items-center gap-2 rounded-sm px-2 py-1.5 text-sm text-foreground',
                        'data-[selected=true]:bg-background-muted',
                        'data-[disabled=true]:opacity-50 data-[disabled=true]:pointer-events-none',
                      )}
                    >
                      <span className="flex-1">{opt.label}</span>
                      {opt.description && (
                        <span className="text-xs text-foreground-subtle">{opt.description}</span>
                      )}
                      {isSelected && <Check className="size-4 text-accent" aria-hidden />}
                    </CommandPrimitive.Item>
                  );
                })}
                {!loading && items.length === 0 && (
                  <CommandPrimitive.Empty className="px-2 py-6 text-center text-sm text-foreground-subtle">
                    {emptyText}
                  </CommandPrimitive.Empty>
                )}
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

Combobox.displayName = 'Combobox';
