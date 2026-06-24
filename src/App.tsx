import { useEffect, useState } from 'react';
import MatrixRain from './components/MatrixRain';
import TopBar from './components/TopBar';
import RoadmapPanel from './components/RoadmapPanel';
import TracksPanel from './components/TracksPanel';
import TrackBuilderPanel from './components/TrackBuilderPanel';
import ProfilePanel from './components/ProfilePanel';
import { setPageTitle } from './lib/seo';
import { useTheme } from './lib/theme';

const TABS = [
  { id: 'map', label: 'Mapa', title: 'Mapa de certificações' },
  { id: 'tracks', label: 'Trilhas', title: 'Trilhas prontas' },
  { id: 'builder', label: 'Montar trilha', title: 'Monte sua trilha' },
  { id: 'profile', label: 'Avaliar perfil', title: 'Avalie seu perfil' },
] as const;

type TabId = (typeof TABS)[number]['id'];

export default function App() {
  const [tab, setTab] = useState<TabId>('map');
  const { theme, toggle } = useTheme();

  useEffect(() => {
    const active = TABS.find((t) => t.id === tab);
    setPageTitle(active?.title);
  }, [tab]);

  return (
    <div className="relative min-h-screen bg-grid-glow">
      <MatrixRain theme={theme} />
      <div className="relative z-10">
        <TopBar theme={theme} onToggleTheme={toggle} />

        <main className="mx-auto w-full px-4 py-10 lg:px-8">
          {/* Visually hidden but kept as the page's single H1 for SEO. */}
          <h1 className="sr-only">
            Certification Roadmap — Trilhas e certificações de cibersegurança
          </h1>

          <nav className="mb-8 flex flex-wrap justify-center gap-2" aria-label="Seções">
            {TABS.map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => setTab(t.id)}
                aria-current={tab === t.id ? 'page' : undefined}
                className={`rounded-lg px-4 py-1.5 font-display text-sm font-semibold transition ${
                  tab === t.id
                    ? 'bg-emerald-400/15 text-emerald-300'
                    : 'text-slate-500 hover:text-slate-300'
                }`}
              >
                {t.label}
              </button>
            ))}
          </nav>

          {/* The map fills the full page width; the reading-oriented tabs stay
              within a comfortable measure so lines don't get too long. */}
          {tab === 'map' && <RoadmapPanel />}
          {tab === 'tracks' && (
            <div className="mx-auto max-w-5xl">
              <TracksPanel />
            </div>
          )}
          {tab === 'builder' && (
            <div className="mx-auto max-w-5xl">
              <TrackBuilderPanel />
            </div>
          )}
          {tab === 'profile' && (
            <div className="mx-auto max-w-6xl">
              <ProfilePanel />
            </div>
          )}
        </main>

        <footer className="border-t border-emerald-500/10 py-8 text-center">
          <p className="font-mono text-xs text-slate-600">
            Conteúdo educativo e vendor-neutral · sem afiliação com os fornecedores citados ·
            verifique sempre os requisitos na página oficial de cada certificação.
          </p>
          <p className="mt-2 font-mono text-xs text-slate-600">© 2026 Sergio Bernardo</p>
        </footer>
      </div>
    </div>
  );
}
