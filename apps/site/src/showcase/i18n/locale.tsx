import { createContext, useContext, useMemo, type ReactNode } from 'react';
import { formatString } from '@/lib/strings';

/* =============================================================================
 *  Template-level i18n (EN / MN) for the showcase templates.
 *
 *  The library's own strings come from `DesignSystemProvider strings`; this
 *  layer covers template copy (nav labels, headings, demo data labels). Each
 *  template ships a dictionary built with `defineDict` — the `mn` object must
 *  contain every key of `en` (type-checked), so no string can fall back to
 *  English silently. Locale lives in the preview hash (`?lang=mn`), persisted
 *  in localStorage, and is exposed via `useLocale` / `useT`.
 * ========================================================================== */

export type Locale = 'en' | 'mn';
export const LOCALES: readonly Locale[] = ['en', 'mn'];
export const LOCALE_STORAGE_KEY = 'cb-locale';

export const isLocale = (v: unknown): v is Locale => v === 'en' || v === 'mn';

/** Typed EN/MN dictionary: `mn` must have exactly the keys of `en`. */
export function defineDict<const E extends Record<string, string>>(dict: {
  en: E;
  mn: { [K in keyof E]: string };
}) {
  return dict;
}
export type Dict = ReturnType<typeof defineDict<Record<string, string>>>;

const LocaleContext = createContext<Locale>('en');
const SetLocaleContext = createContext<((next: Locale) => void) | null>(null);

export function LocaleProvider({
  locale,
  onChange,
  children,
}: {
  locale: Locale;
  /** Optional — lets templates (admin top bar) switch the language themselves. */
  onChange?: (next: Locale) => void;
  children: ReactNode;
}) {
  return (
    <LocaleContext.Provider value={locale}>
      <SetLocaleContext.Provider value={onChange ?? null}>{children}</SetLocaleContext.Provider>
    </LocaleContext.Provider>
  );
}

/** Setter from the nearest provider; `null` when the host doesn't allow switching. */
export function useSetLocale(): ((next: Locale) => void) | null {
  return useContext(SetLocaleContext);
}

export function useLocale(): Locale {
  return useContext(LocaleContext);
}

/**
 * `const t = useT(dict)` → `t('key')` / `t('key', { n: 3 })`.
 * Placeholders use `{name}` (same convention as the library strings).
 */
export function useT<E extends Record<string, string>>(dict: {
  en: E;
  mn: { [K in keyof E]: string };
}) {
  const locale = useLocale();
  return useMemo(() => {
    const table = dict[locale];
    const t = (key: keyof E, vars?: Record<string, string | number | undefined>) => {
      const s = table[key] ?? dict.en[key];
      return vars ? formatString(s, vars) : s;
    };
    return Object.assign(t, { locale });
  }, [dict, locale]);
}

/** Resolve the locale for a preview: `?lang=` in the hash → localStorage → 'en'. */
export function readInitialLocale(): Locale {
  if (typeof window === 'undefined') return 'en';
  const q = window.location.hash.split('?')[1];
  const fromHash = q ? new URLSearchParams(q).get('lang') : null;
  if (isLocale(fromHash)) return fromHash;
  try {
    const stored = window.localStorage.getItem(LOCALE_STORAGE_KEY);
    if (isLocale(stored)) return stored;
  } catch {
    /* storage unavailable */
  }
  return 'en';
}

/** Persist + mirror the locale into the hash (`?lang=`) and `<html lang>`. */
export function applyLocale(locale: Locale) {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(LOCALE_STORAGE_KEY, locale);
  } catch {
    /* ignore */
  }
  document.documentElement.lang = locale;
  const raw = window.location.hash.replace(/^#/, '');
  const [path, q = ''] = raw.split('?');
  const params = new URLSearchParams(q);
  if (locale === 'en') params.delete('lang');
  else params.set('lang', locale);
  const qs = params.toString();
  const next = `#${path}${qs ? `?${qs}` : ''}`;
  if (next !== window.location.hash) window.history.replaceState(window.history.state, '', next);
}
