import { useEffect, useState } from 'react';

export type Theme = 'dark' | 'light';

const STORAGE_KEY = 'cert-roadmap-theme';

/** Read the persisted preference; the app defaults to the dark "hacker" look. */
function readInitial(): Theme {
  if (typeof localStorage === 'undefined') return 'dark';
  return localStorage.getItem(STORAGE_KEY) === 'light' ? 'light' : 'dark';
}

/**
 * Tracks the colour theme, mirrors it onto the <html> element (so the
 * CSS-variable palette flips) and persists the choice. An inline script in
 * index.html applies the saved class before paint to avoid a flash.
 */
export function useTheme() {
  const [theme, setTheme] = useState<Theme>(readInitial);

  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle('light', theme === 'light');
    root.classList.toggle('dark', theme === 'dark');
    try {
      localStorage.setItem(STORAGE_KEY, theme);
    } catch {
      // Ignore storage errors (e.g. private mode) — the theme still applies.
    }
  }, [theme]);

  const toggle = () => setTheme((current) => (current === 'dark' ? 'light' : 'dark'));

  return { theme, toggle };
}
