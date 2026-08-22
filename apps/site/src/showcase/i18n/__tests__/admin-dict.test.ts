import { describe, expect, it } from 'vitest';
import { adminDict } from '../admin';

/** Values that are legitimately the same in both languages. */
const SAME_ALLOWED = new Set(['CRM', 'Enterprise', 'Staging', 'OK', 'name@company.com']);
/** Keys whose value is a proper noun / identifier rather than copy. */
const KEYS_ALLOWED = new Set<string>(['msg.1.subject', 'msg.4.subject']);

describe('admin dictionary', () => {
  const keys = Object.keys(adminDict.en);

  it('mn has every en key and nothing extra', () => {
    expect(Object.keys(adminDict.mn).sort()).toEqual([...keys].sort());
  });

  it('mn has no empty strings', () => {
    const empty = keys.filter((k) => !adminDict.mn[k as keyof typeof adminDict.mn].trim());
    expect(empty).toEqual([]);
  });

  it('mn is translated (no value identical to en outside the allow-list)', () => {
    const same = keys.filter((k) => {
      const en = adminDict.en[k as keyof typeof adminDict.en];
      const mn = adminDict.mn[k as keyof typeof adminDict.mn];
      if (en !== mn) return false;
      if (KEYS_ALLOWED.has(k) || SAME_ALLOWED.has(en)) return false;
      // Numbers / punctuation-only values (no letters) have nothing to translate.
      return /\p{L}/u.test(en);
    });
    expect(same).toEqual([]);
  });

  it('mn keeps every {placeholder} of en', () => {
    const ph = (s: string) => (s.match(/\{\w+\}/g) ?? []).sort();
    const broken = keys.filter(
      (k) =>
        ph(adminDict.en[k as keyof typeof adminDict.en]).join() !==
        ph(adminDict.mn[k as keyof typeof adminDict.mn]).join(),
    );
    expect(broken).toEqual([]);
  });

  it('mn uses sentence case (no Title Case phrases)', () => {
    const titleCase = keys.filter((k) =>
      /^[А-ЯӨҮ][а-яөү]+ [А-ЯӨҮ][а-яөү]+/.test(adminDict.mn[k as keyof typeof adminDict.mn]),
    );
    expect(titleCase).toEqual([]);
  });
});
