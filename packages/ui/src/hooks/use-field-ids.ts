'use client';

import { useId } from 'react';

export interface FieldIds {
  /** Id for the control itself (`<input id>` / `<label htmlFor>`). */
  fieldId: string;
  /** Id for the description / helper text element. */
  helperId: string;
  /** Id for the validation message element. */
  errorId: string;
  /**
   * `aria-describedby` value computed from what actually renders — the error
   * wins over the helper; `undefined` when neither is present.
   */
  describedBy: string | undefined;
}

/**
 * Shared id wiring for form fields: one stable id for the control plus
 * derived helper / error ids, and an `aria-describedby` that only references
 * elements that exist. Pass a consumer `id` to keep `<label htmlFor>` in sync.
 *
 * @example
 *   const { fieldId, helperId, errorId, describedBy } = useFieldIds(id, {
 *     hasHelper: Boolean(helperText),
 *     hasError: Boolean(error),
 *   });
 */
export function useFieldIds(
  id?: string,
  present: { hasHelper?: boolean; hasError?: boolean; extra?: string } = {},
): FieldIds {
  const autoId = useId();
  const fieldId = id ?? autoId;
  const helperId = `${fieldId}-helper`;
  const errorId = `${fieldId}-error`;
  const parts = [
    present.hasError ? errorId : present.hasHelper ? helperId : undefined,
    present.extra,
  ].filter(Boolean);
  return {
    fieldId,
    helperId,
    errorId,
    describedBy: parts.length ? parts.join(' ') : undefined,
  };
}
