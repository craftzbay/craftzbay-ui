import { forwardRef, useCallback, useState, type KeyboardEvent } from 'react';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface TagInputProps {
  /** Controlled list of tags. */
  value?: string[];
  /** Default tags when uncontrolled. */
  defaultValue?: string[];
  /** Called when the tag list changes. */
  onChange?: (tags: string[]) => void;
  /** Placeholder shown inside the inline input. */
  placeholder?: string;
  /** Maximum number of tags. */
  max?: number;
  /** Disable the editor. */
  disabled?: boolean;
  /** Show a danger border. */
  error?: boolean;
  /** Treat these characters as separators (default: Enter + comma). */
  separators?: string[];
  className?: string;
}

/**
 * Chip-based multi-value input. Press Enter or comma to add. Backspace on an
 * empty input removes the last tag.
 */
export const TagInput = forwardRef<HTMLDivElement, TagInputProps>(function TagInput(
  {
    value,
    defaultValue = [],
    onChange,
    placeholder = 'Add and press Enter',
    max,
    disabled,
    error,
    separators = ['Enter', ','],
    className,
  },
  ref,
) {
  const [internal, setInternal] = useState<string[]>(defaultValue);
  const [draft, setDraft] = useState('');
  const tags = value ?? internal;

  const update = useCallback(
    (next: string[]) => {
      if (value === undefined) setInternal(next);
      onChange?.(next);
    },
    [onChange, value],
  );

  const commit = (raw: string) => {
    const t = raw.trim();
    if (!t || tags.includes(t) || (max !== undefined && tags.length >= max)) return;
    update([...tags, t]);
  };

  const remove = (idx: number) => update(tags.filter((_, i) => i !== idx));

  const onKey = (e: KeyboardEvent<HTMLInputElement>) => {
    if (separators.includes(e.key)) {
      e.preventDefault();
      commit(draft);
      setDraft('');
    } else if (e.key === 'Backspace' && !draft && tags.length) {
      remove(tags.length - 1);
    }
  };

  return (
    <div
      ref={ref}
      className={cn(
        'flex min-h-9 w-full flex-wrap items-center gap-1.5 rounded-md border bg-card px-2 py-1.5',
        'transition-colors focus-within:border-ring focus-within:ring-2 focus-within:ring-ring',
        error ? 'border-danger focus-within:border-danger focus-within:ring-danger' : 'border-border',
        disabled && 'pointer-events-none opacity-50',
        className,
      )}
    >
      {tags.map((t, i) => (
        <span
          key={`${t}-${i}`}
          className="inline-flex items-center gap-1 rounded bg-background-muted px-2 py-0.5 text-xs"
        >
          {t}
          <button
            type="button"
            onClick={() => remove(i)}
            className="rounded p-0.5 text-foreground-muted hover:bg-background-subtle hover:text-foreground"
            aria-label={`Remove ${t}`}
          >
            <X className="size-3" />
          </button>
        </span>
      ))}
      <input
        value={draft}
        disabled={disabled}
        onChange={(e) => setDraft(e.target.value)}
        onKeyDown={onKey}
        onBlur={() => {
          if (draft) {
            commit(draft);
            setDraft('');
          }
        }}
        placeholder={tags.length === 0 ? placeholder : undefined}
        className="min-w-[8ch] flex-1 bg-transparent text-sm outline-none placeholder:text-foreground-subtle"
      />
    </div>
  );
});
