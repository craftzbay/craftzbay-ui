import { useEffect } from 'react';

/* =============================================================================
 *  URL state for the hash-routed preview (10 · "URL state for filter/sort/page").
 *
 *  The preview lives at `#preview/admin/app/<variant>/<page>`; list state is
 *  appended as a query-style tail: `…/projects?status=blocked&sort=updated&p=2`.
 *  Writes use `history.replaceState` so typing a filter never spams history,
 *  and `hashchange` does not fire — the showcase router keeps its route.
 *  In a real app swap this for your router's `useSearchParams`.
 * ========================================================================== */

export type HashParamValues = Record<string, string | number | undefined | null>;

function splitHash(): { path: string; query: string } {
  const raw = typeof window === 'undefined' ? '' : window.location.hash.replace(/^#/, '');
  const i = raw.indexOf('?');
  return i === -1 ? { path: raw, query: '' } : { path: raw.slice(0, i), query: raw.slice(i + 1) };
}

/** Read the `?…` tail of the current hash (empty when absent). */
export function readHashParams(): URLSearchParams {
  return new URLSearchParams(splitHash().query);
}

/** Replace the hash in place. `path` defaults to the current path; empty values are dropped. */
export function writeHash(values: HashParamValues, path = splitHash().path) {
  if (typeof window === 'undefined') return;
  const params = new URLSearchParams();
  // `lang` is owned by the preview shell (i18n/locale.tsx) — carry it over
  // unless the caller sets it explicitly.
  const lang = readHashParams().get('lang');
  if (lang && !('lang' in values)) params.set('lang', lang);
  for (const [k, v] of Object.entries(values)) {
    if (v !== undefined && v !== null && v !== '') params.set(k, String(v));
  }
  const q = params.toString();
  const next = `#${path}${q ? `?${q}` : ''}`;
  if (next === window.location.hash) return;
  window.history.replaceState(window.history.state, '', next);
}

/** Mirror `values` into the hash tail whenever they change. */
export function useHashParams(values: HashParamValues) {
  const serialized = JSON.stringify(values);
  useEffect(() => {
    writeHash(JSON.parse(serialized) as HashParamValues);
  }, [serialized]);
}
