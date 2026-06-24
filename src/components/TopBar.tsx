import type { Theme } from '../lib/theme';

const HUB_URL = 'https://sergiogbernardo.github.io/';

interface TopBarProps {
  theme: Theme;
  onToggleTheme: () => void;
}

export default function TopBar({ theme, onToggleTheme }: TopBarProps) {
  const isDark = theme === 'dark';
  return (
    <header className="sticky top-0 z-20 border-b border-emerald-500/10 bg-black/60 backdrop-blur-md">
      <div className="flex w-full items-center justify-between gap-4 px-4 py-3 lg:px-8">
        <span className="font-display text-lg font-bold tracking-tight text-emerald-300">
          Certification Roadmap
        </span>

        <div className="flex items-center gap-4">
          <span className="hidden items-center gap-1.5 font-mono text-xs text-slate-400 sm:flex">
            <span className="h-1.5 w-1.5 animate-pulse-live rounded-full bg-emerald-400" />
            client-side
          </span>

          <button
            type="button"
            onClick={onToggleTheme}
            aria-label={isDark ? 'Ativar tema claro' : 'Ativar tema escuro'}
            title={isDark ? 'Tema claro' : 'Tema escuro'}
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-emerald-500/20 text-emerald-300 transition hover:bg-emerald-400/10"
          >
            {isDark ? <SunIcon /> : <MoonIcon />}
          </button>

          <a
            href={HUB_URL}
            aria-label="Hub de Projetos"
            title="Hub de Projetos"
            className="flex shrink-0 items-center transition hover:scale-105"
          >
            <img
              src={`${import.meta.env.BASE_URL}hub-icon.png`}
              alt="Hub de Projetos"
              className="h-8 w-8"
            />
          </a>
        </div>
      </div>
    </header>
  );
}

function SunIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="16"
      height="16"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M2 12h2M20 12h2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M19.1 4.9l-1.4 1.4M6.3 17.7l-1.4 1.4" />
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="16"
      height="16"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z" />
    </svg>
  );
}
