'use client';

/**
 * Every user-facing string the library renders on its own (aria-labels,
 * placeholders, empty states, …). Consumers override any subset through
 * `<DesignSystemProvider strings={…}>`; per-component props still win.
 *
 * Placeholders use `{name}` and are expanded with `formatString`.
 */
export interface UiStrings {
  alert: { dismiss: string };
  snackbar: { dismiss: string };
  dialog: { close: string };
  sheet: { close: string };
  toast: { close: string; region: string };
  confirmationDialog: { confirm: string; cancel: string };
  commandDialog: { title: string };
  carousel: { label: string; previous: string; next: string; slide: string };
  pagination: {
    showing: string;
    rowsPerPage: string;
    first: string;
    last: string;
    prev: string;
    next: string;
    page: string;
    perPage: string;
    nav: string;
  };
  breadcrumbs: { label: string };
  stepper: { label: string };
  sidebar: { label: string; collapse: string; expand: string; collapseShort: string };
  combobox: { placeholder: string; searchPlaceholder: string; empty: string; clear: string };
  multiSelect: { placeholder: string; empty: string; clearAll: string; remove: string };
  tagInput: { placeholder: string; remove: string };
  dataGrid: {
    filterPlaceholder: string;
    empty: string;
    columns: string;
    columnVisibility: string;
    filterRows: string;
  };
  datePicker: { pickDate: string; pickRange: string };
  fileUpload: { drop: string; remove: string };
  input: { clear: string; showPassword: string; hidePassword: string };
  slider: { minimum: string; maximum: string; value: string };
  spinner: { loading: string };
  errorState: {
    notFoundTitle: string;
    notFoundDescription: string;
    serverTitle: string;
    serverDescription: string;
    genericTitle: string;
    genericDescription: string;
    tryAgain: string;
  };
  avatar: { status: string; more: string };
  tree: { label: string };
}

export type DeepPartial<T> = { [K in keyof T]?: T[K] extends object ? DeepPartial<T[K]> : T[K] };

export const defaultStrings: UiStrings = {
  alert: { dismiss: 'Dismiss' },
  snackbar: { dismiss: 'Dismiss' },
  dialog: { close: 'Close' },
  sheet: { close: 'Close' },
  toast: { close: 'Close', region: 'Notifications' },
  confirmationDialog: { confirm: 'Confirm', cancel: 'Cancel' },
  commandDialog: { title: 'Command palette' },
  carousel: { label: 'Carousel', previous: 'Previous', next: 'Next', slide: '{index} of {count}' },
  pagination: {
    showing: 'Showing {from}–{to} of {total}',
    rowsPerPage: 'Rows per page',
    first: 'Go to first page',
    last: 'Go to last page',
    prev: 'Previous page',
    next: 'Next page',
    page: 'Page {n}',
    perPage: '{n} / page',
    nav: 'Pagination',
  },
  breadcrumbs: { label: 'Breadcrumb' },
  stepper: { label: 'Progress' },
  sidebar: {
    label: 'Primary',
    collapse: 'Collapse sidebar',
    expand: 'Expand sidebar',
    collapseShort: 'Collapse',
  },
  combobox: {
    placeholder: 'Select…',
    searchPlaceholder: 'Search…',
    empty: 'No results.',
    clear: 'Clear selection',
  },
  multiSelect: {
    placeholder: 'Select…',
    empty: 'No results.',
    clearAll: 'Clear all',
    remove: 'Remove {label}',
  },
  tagInput: { placeholder: 'Add and press Enter', remove: 'Remove {tag}' },
  dataGrid: {
    filterPlaceholder: 'Filter…',
    empty: 'No results.',
    columns: 'Columns',
    columnVisibility: 'Column visibility',
    filterRows: 'Filter rows',
  },
  datePicker: { pickDate: 'Pick a date', pickRange: 'Pick a range' },
  fileUpload: { drop: 'Drop files here, or click to browse', remove: 'Remove {name}' },
  input: { clear: 'Clear input', showPassword: 'Show password', hidePassword: 'Hide password' },
  slider: { minimum: 'Minimum', maximum: 'Maximum', value: 'Value' },
  spinner: { loading: 'Loading' },
  errorState: {
    notFoundTitle: 'Page not found',
    notFoundDescription: "We couldn't find what you were looking for.",
    serverTitle: 'Something went wrong',
    serverDescription: "We're looking into it. Please try again in a moment.",
    genericTitle: 'Unexpected error',
    genericDescription: 'Something interrupted this action.',
    tryAgain: 'Try again',
  },
  avatar: { status: 'Status: {status}', more: '{n} more' },
  tree: { label: 'Tree' },
};

/** Expand `{name}` placeholders. Unknown placeholders are left as-is. */
export function formatString(
  template: string,
  vars: Record<string, string | number | undefined>,
): string {
  return template.replace(/\{(\w+)\}/g, (match, key: string) => {
    const v = vars[key];
    return v === undefined ? match : String(v);
  });
}

/** Deep-merge a partial override on top of a complete strings object. */
export function mergeStrings(base: UiStrings, override?: DeepPartial<UiStrings>): UiStrings {
  if (!override) return base;
  const out = { ...base } as Record<string, Record<string, string>>;
  for (const [group, values] of Object.entries(override)) {
    if (!values) continue;
    out[group] = { ...out[group], ...(values as Record<string, string>) };
  }
  return out as unknown as UiStrings;
}
