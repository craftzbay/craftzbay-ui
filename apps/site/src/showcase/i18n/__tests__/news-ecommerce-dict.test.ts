import { describe, expect, it } from 'vitest';
import { newsDict } from '../news';
import { ecommerceDict } from '../ecommerce';

/**
 * Keys whose MN value is legitimately identical to EN — proper nouns, brand
 * names, example addresses. Anything else identical means a string was left
 * untranslated.
 */
const ALLOW_IDENTICAL: Record<string, ReadonlySet<string>> = {
  news: new Set<string>(['newsletter.placeholder']),
  ecommerce: new Set<string>([]),
};

const CYRILLIC = /[Ѐ-ӿ]/;

describe.each([
  ['news', newsDict],
  ['ecommerce', ecommerceDict],
] as const)('%s dictionary', (name, dict) => {
  const allow = ALLOW_IDENTICAL[name];
  const keys = Object.keys(dict.en);

  it('has the same key set in en and mn', () => {
    expect(Object.keys(dict.mn).sort()).toEqual([...keys].sort());
  });

  it.each(keys)('mn[%s] is non-empty, Cyrillic and differs from en', (key) => {
    const en = dict.en[key as keyof typeof dict.en];
    const mn = dict.mn[key as keyof typeof dict.mn];
    expect(mn.trim()).not.toBe('');
    if (allow.has(key)) return;
    expect(mn).not.toBe(en);
    expect(mn).toMatch(CYRILLIC);
  });

  it.each(keys)('mn[%s] keeps the placeholders of en', (key) => {
    const placeholders = (s: string) => (s.match(/\{\w+\}/g) ?? []).sort();
    expect(placeholders(dict.mn[key as keyof typeof dict.mn])).toEqual(
      placeholders(dict.en[key as keyof typeof dict.en]),
    );
  });
});
