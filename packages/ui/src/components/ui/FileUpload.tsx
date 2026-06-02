import { forwardRef, useCallback, useId, useRef, useState, type DragEvent as ReactDragEvent, type ReactNode } from 'react';
import { File as FileIcon, Upload, X } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface FileUploadProps {
  /** Accepted file types, e.g. `image/*` or `.pdf,.docx`. */
  accept?: string;
  /** Allow multiple files. */
  multiple?: boolean;
  /** Max file size in bytes. Files larger than this are rejected. */
  maxSize?: number;
  /** Controlled file list. */
  value?: File[];
  /** Called when files are added or removed. */
  onChange?: (files: File[]) => void;
  /** Helper text inside the drop zone. */
  hint?: ReactNode;
  /** Disable the picker entirely. */
  disabled?: boolean;
  className?: string;
}

function formatSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}

/**
 * Drag-and-drop file picker with an inline file list. Uncontrolled by default;
 * pass `value` + `onChange` to control externally.
 */
export const FileUpload = forwardRef<HTMLDivElement, FileUploadProps>(function FileUpload(
  { accept, multiple, maxSize, value, onChange, hint, disabled, className },
  ref,
) {
  const inputRef = useRef<HTMLInputElement>(null);
  const inputId = useId();
  const [internal, setInternal] = useState<File[]>([]);
  const [over, setOver] = useState(false);
  const files = value ?? internal;

  const update = useCallback(
    (next: File[]) => {
      if (value === undefined) setInternal(next);
      onChange?.(next);
    },
    [onChange, value],
  );

  const addFiles = useCallback(
    (incoming: FileList | File[]) => {
      const arr = Array.from(incoming).filter(
        (f) => !maxSize || f.size <= maxSize,
      );
      update(multiple ? [...files, ...arr] : arr.slice(0, 1));
    },
    [files, maxSize, multiple, update],
  );

  const remove = (idx: number) => update(files.filter((_, i) => i !== idx));

  const onDrop = (e: ReactDragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    setOver(false);
    if (disabled) return;
    addFiles(e.dataTransfer.files);
  };

  return (
    <div ref={ref} className={cn('flex flex-col gap-3', className)}>
      <label
        htmlFor={inputId}
        onDragOver={(e) => {
          e.preventDefault();
          if (!disabled) setOver(true);
        }}
        onDragLeave={() => setOver(false)}
        onDrop={onDrop}
        className={cn(
          'group relative flex cursor-pointer flex-col items-center justify-center gap-2',
          'rounded-md border border-dashed border-border bg-background-subtle px-6 py-8',
          'text-center transition-colors',
          'hover:border-border-strong hover:bg-background-muted',
          over && 'border-accent bg-accent-soft',
          disabled && 'pointer-events-none opacity-50',
        )}
      >
        <Upload className="size-5 text-foreground-muted" aria-hidden />
        <div className="space-y-1">
          <p className="text-sm font-medium">Drop files here, or click to browse</p>
          {hint && <p className="text-xs text-foreground-muted">{hint}</p>}
        </div>
        <input
          ref={inputRef}
          id={inputId}
          type="file"
          accept={accept}
          multiple={multiple}
          disabled={disabled}
          className="sr-only"
          onChange={(e) => e.target.files && addFiles(e.target.files)}
        />
      </label>

      {files.length > 0 && (
        <ul className="flex flex-col gap-2">
          {files.map((file, idx) => (
            <li
              key={`${file.name}-${idx}`}
              className="flex items-center gap-3 rounded-md border border-border bg-card px-3 py-2"
            >
              <FileIcon className="size-4 shrink-0 text-foreground-muted" aria-hidden />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm">{file.name}</p>
                <p className="text-xs text-foreground-muted">{formatSize(file.size)}</p>
              </div>
              <button
                type="button"
                onClick={() => remove(idx)}
                className="rounded p-1 text-foreground-muted hover:bg-background-muted hover:text-foreground"
                aria-label={`Remove ${file.name}`}
              >
                <X className="size-4" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
});
