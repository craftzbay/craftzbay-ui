import { describe, expect, it } from 'vitest';
import { defaultStrings, formatString, type UiStrings } from '../strings';
import { mnStrings } from '../strings.mn';

type Leaf = { path: string; value: string };

function leaves(obj: Record<string, unknown>, prefix = ''): Leaf[] {
  return Object.entries(obj).flatMap(([k, v]) => {
    const path = prefix ? `${prefix}.${k}` : k;
    if (typeof v === 'string') return [{ path, value: v }];
    if (v && typeof v === 'object') return leaves(v as Record<string, unknown>, path);
    throw new Error(`non-string leaf at ${path}: ${typeof v}`);
  });
}

const placeholders = (s: string) =>
  [...s.matchAll(/\{(\w+)\}/g)]
    .map((m) => m[1])
    .sort()
    .join(',');

const en = leaves(defaultStrings as unknown as Record<string, unknown>);
const mn = leaves(mnStrings as unknown as Record<string, unknown>);

describe('string catalogues', () => {
  it('mn has every key of default and nothing more', () => {
    const enKeys = en.map((l) => l.path).sort();
    const mnKeys = mn.map((l) => l.path).sort();
    expect(mnKeys).toEqual(enKeys);
  });

  it('has a reasonable number of keys', () => {
    expect(en.length).toBeGreaterThan(100);
  });

  it.each([
    ['default', en],
    ['mn', mn],
  ])('%s: no empty or whitespace-only strings', (_n, list) => {
    const empty = list.filter((l) => l.value.trim() === '');
    expect(empty).toEqual([]);
  });

  it('placeholder sets are identical per key', () => {
    const mnMap = new Map(mn.map((l) => [l.path, l.value]));
    const diff = en
      .map((l) => ({
        path: l.path,
        en: placeholders(l.value),
        mn: placeholders(mnMap.get(l.path) ?? ''),
      }))
      .filter((d) => d.en !== d.mn);
    expect(diff).toEqual([]);
  });

  it('mn strings are actually Cyrillic (not untranslated copies)', () => {
    const enMap = new Map(en.map((l) => [l.path, l.value]));
    const copies = mn.filter(
      (l) => l.value === enMap.get(l.path) && /[a-z]{3,}/i.test(l.value.replace(/\{\w+\}/g, '')),
    );
    expect(copies.map((c) => c.path)).toEqual([]);
  });

  it('no stray double spaces or leading/trailing whitespace', () => {
    const bad = [...en, ...mn].filter((l) => l.value !== l.value.trim() || /  /.test(l.value));
    expect(bad).toEqual([]);
  });
});

describe('formatString', () => {
  it('expands placeholders with strings and numbers', () => {
    expect(formatString('{from}–{to} of {total}', { from: 1, to: 10, total: 42 })).toBe(
      '1–10 of 42',
    );
  });

  it('leaves unknown and undefined placeholders as-is', () => {
    expect(formatString('Remove {label}', {})).toBe('Remove {label}');
    expect(formatString('Remove {label}', { label: undefined })).toBe('Remove {label}');
  });

  it('treats 0 and empty string as values', () => {
    expect(formatString('{n} more', { n: 0 })).toBe('0 more');
    expect(formatString('[{x}]', { x: '' })).toBe('[]');
  });

  it('expands repeated placeholders and ignores non-word braces', () => {
    expect(formatString('{a}{a} {a-b} {}', { a: 'x' })).toBe('xx {a-b} {}');
  });

  it('does not recursively expand substituted values', () => {
    expect(formatString('{a}', { a: '{b}', b: 'no' })).toBe('{b}');
  });

  it('keeps Cyrillic suffixes attached', () => {
    expect(formatString((mnStrings as UiStrings).multiSelect.remove, { label: 'Бат' })).toBe(
      'Бат-г устгах',
    );
  });
});
