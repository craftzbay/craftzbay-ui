'use client';

import { createContext, useContext } from 'react';
import { defaultStrings, type UiStrings } from '@/lib/strings';

/** Resolved (complete) strings for the current subtree. */
export const StringsContext = createContext<UiStrings>(defaultStrings);

/** Read the library strings — falls back to the English defaults without a provider. */
export function useStrings(): UiStrings {
  return useContext(StringsContext);
}
