import { createContext, useContext, useEffect } from 'react';

/* =============================================================================
 *  Unsaved-changes guard. A page with an explicit Save registers its dirty
 *  flag; the shell then (a) warns on tab close via `beforeunload` and (b)
 *  intercepts in-app navigation with a "Discard changes?" confirmation.
 * ========================================================================== */

export const UnsavedContext = createContext<(dirty: boolean) => void>(() => {});

export function useUnsavedGuard(dirty: boolean) {
  const setDirty = useContext(UnsavedContext);

  useEffect(() => {
    setDirty(dirty);
    return () => setDirty(false);
  }, [dirty, setDirty]);

  useEffect(() => {
    if (!dirty) return;
    const warn = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      // Legacy browsers need a returnValue to show the prompt.
      e.returnValue = '';
    };
    window.addEventListener('beforeunload', warn);
    return () => window.removeEventListener('beforeunload', warn);
  }, [dirty]);
}
