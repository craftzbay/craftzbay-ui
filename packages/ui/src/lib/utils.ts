import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Compose Tailwind class names safely.
 *
 * - `clsx` handles conditionals, arrays, and objects.
 * - `tailwind-merge` resolves conflicts: `cn('p-2', condition && 'p-4')` returns `'p-4'`.
 *
 * Use this everywhere classes are composed. Never concatenate Tailwind
 * classes with template strings — they will not de-duplicate.
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}
