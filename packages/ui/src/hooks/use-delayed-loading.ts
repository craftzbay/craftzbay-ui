'use client';

import { useEffect, useState } from 'react';

/**
 * Returns `false` until `ms` has elapsed, then `true`. Gate skeletons and
 * spinners behind it so sub-300ms loads never flash a placeholder.
 * `ms <= 0` returns `true` immediately (and synchronously on first render).
 *
 * @example
 *   const showSkeleton = useDelayedLoading(300);
 *   if (isLoading) return showSkeleton ? <Skeleton /> : null;
 */
export function useDelayedLoading(ms: number): boolean {
  const [ready, setReady] = useState(ms <= 0);
  useEffect(() => {
    if (ms <= 0) {
      setReady(true);
      return;
    }
    setReady(false);
    const t = window.setTimeout(() => setReady(true), ms);
    return () => window.clearTimeout(t);
  }, [ms]);
  return ready;
}
