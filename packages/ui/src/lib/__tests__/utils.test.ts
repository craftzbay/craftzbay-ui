import { describe, expect, it } from 'vitest';
import { cn } from '../utils';
import { cva, type VariantProps } from '../cva';

describe('cn', () => {
  it('joins and dedupes conflicting Tailwind utilities (last wins)', () => {
    expect(cn('p-2', 'p-4')).toBe('p-4');
    expect(cn('px-2 py-2', 'p-4')).toBe('p-4');
    expect(cn('text-sm', 'text-lg')).toBe('text-lg');
  });

  it('handles conditionals, arrays and objects', () => {
    expect(cn('a', false && 'b', undefined, null, 0, ['c', { d: true, e: false }])).toBe('a c d');
  });

  it('keeps non-conflicting classes and variants apart', () => {
    expect(cn('bg-accent', 'hover:bg-accent-hover', 'dark:bg-background')).toBe(
      'bg-accent hover:bg-accent-hover dark:bg-background',
    );
    expect(cn('hover:p-2', 'p-4')).toBe('hover:p-2 p-4');
  });

  it('resolves arbitrary values and important modifiers', () => {
    expect(cn('w-[10px]', 'w-4')).toBe('w-4');
    expect(cn('!p-2', 'p-4')).toBe('!p-2 p-4');
  });

  it('returns empty string for no input', () => {
    expect(cn()).toBe('');
    expect(cn(undefined, null, false)).toBe('');
  });
});

describe('cva re-export', () => {
  const button = cva('base', {
    variants: {
      variant: { primary: 'bg-accent', ghost: 'bg-transparent' },
      size: { sm: 'h-8', md: 'h-9' },
    },
    compoundVariants: [{ variant: 'ghost', size: 'sm', className: 'px-1' }],
    defaultVariants: { variant: 'primary', size: 'md' },
  });
  type Props = VariantProps<typeof button>;

  it('applies defaults, variants and compound variants', () => {
    expect(button()).toBe('base bg-accent h-9');
    expect(button({ variant: 'ghost', size: 'sm' })).toBe('base bg-transparent h-8 px-1');
    const p: Props = { variant: 'ghost' };
    expect(button({ ...p, className: 'extra' })).toBe('base bg-transparent h-9 extra');
  });
});
