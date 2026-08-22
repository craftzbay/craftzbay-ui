import { describe, expect, it } from 'vitest';
import { landingDict } from '../landing';
import { authDict } from '../auth';

/** Keys whose MN value is legitimately identical to EN (proper nouns, codes). */
const SAME_OK = new Set(['quoteName', 'footApi', 'tierEnterpriseF2']);

describe.each([
  ['landing', landingDict],
  ['auth', authDict],
] as const)('%s dictionary', (_name, dict) => {
  const keys = Object.keys(dict.en) as (keyof typeof dict.en)[];

  it('mn covers every en key with a non-empty string', () => {
    for (const k of keys) {
      expect(dict.mn[k], String(k)).toBeTypeOf('string');
      expect(dict.mn[k].trim(), String(k)).not.toBe('');
    }
    expect(Object.keys(dict.mn).sort()).toEqual([...keys].sort());
  });

  it('mn is translated (not identical to en) outside the allow-list', () => {
    const same = keys.filter((k) => !SAME_OK.has(k) && dict.mn[k] === dict.en[k]);
    expect(same).toEqual([]);
  });

  it('placeholders match between en and mn', () => {
    const ph = (s: string) => (s.match(/\{\w+\}/g) ?? []).sort();
    for (const k of keys) expect(ph(dict.mn[k]), String(k)).toEqual(ph(dict.en[k]));
  });
});
