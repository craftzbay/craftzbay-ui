import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { brandPresets, type BrandName } from '@craftzbay/ui';

/* -----------------------------------------------------------------------------
 *  Theme + brand context.
 *
 *  Both are applied to <html> directly (not a wrapped <DesignSystemProvider>)
 *  so the choice reaches Radix portals (dialogs, toasts, dropdowns) that render
 *  at document.body — outside the React tree. Theme is the light/dark class;
 *  brand is a set of CSS-variable overrides drawn from the library's exported
 *  `brandPresets`. Both persist to localStorage and re-hydrate on the next tab.
 * --------------------------------------------------------------------------- */

export type Theme = 'light' | 'dark';

interface ThemeContextValue {
  theme: Theme;
  setTheme: (t: Theme) => void;
  toggleTheme: () => void;
  brand: BrandName;
  setBrand: (b: BrandName) => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

const THEME_KEY = 'theme';
const BRAND_KEY = 'brand';

/**
 * Apply the accent by toggling `data-accent` on <html>. The actual token
 * values (light + dark) live in globals.css under `[data-accent="…"]`, so a
 * switch is a single attribute write and dark mode adapts automatically.
 */
function applyBrand(brand: BrandName) {
  if (typeof document === 'undefined') return;
  const root = document.documentElement;
  if (brand === 'default') root.removeAttribute('data-accent');
  else root.setAttribute('data-accent', brand);
}

function readInitialTheme(): Theme {
  if (typeof document === 'undefined') return 'light';
  return document.documentElement.classList.contains('dark') ? 'dark' : 'light';
}

function readInitialBrand(): BrandName {
  if (typeof window === 'undefined') return 'default';
  try {
    const stored = localStorage.getItem(BRAND_KEY);
    if (stored && stored in brandPresets) return stored as BrandName;
  } catch {}
  return 'default';
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<Theme>(readInitialTheme);
  const [brand, setBrandState] = useState<BrandName>(readInitialBrand);

  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle('dark', theme === 'dark');
    try {
      localStorage.setItem(THEME_KEY, theme);
    } catch {}
  }, [theme]);

  useEffect(() => {
    applyBrand(brand);
    try {
      localStorage.setItem(BRAND_KEY, brand);
    } catch {}
  }, [brand]);

  // Keep tabs in sync — flip theme/brand here when the standalone preview tab
  // changes it (and vice-versa) via the storage event.
  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === THEME_KEY && (e.newValue === 'light' || e.newValue === 'dark')) {
        setThemeState(e.newValue);
      }
      if (e.key === BRAND_KEY && e.newValue && e.newValue in brandPresets) {
        setBrandState(e.newValue as BrandName);
      }
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  const value = useMemo<ThemeContextValue>(
    () => ({
      theme,
      setTheme: setThemeState,
      toggleTheme: () => setThemeState((t) => (t === 'light' ? 'dark' : 'light')),
      brand,
      setBrand: setBrandState,
    }),
    [theme, brand],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within <ThemeProvider>');
  return ctx;
}

/** Stable callback for non-provider call-sites that only need the toggle. */
export function useToggleTheme() {
  const { toggleTheme } = useTheme();
  return useCallback(toggleTheme, [toggleTheme]);
}
