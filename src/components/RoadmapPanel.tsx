import { Fragment, useMemo, useState } from 'react';
import { CERTIFICATIONS } from '../data/certifications';
import { DOMAINS, LEVELS } from '../data/domains';
import type { Certification, Domain, DomainId, Level } from '../data/types';
import { domainStyle } from '../lib/domainStyle';
import CertCard from './CertCard';
import { SectionHeading } from './ui';

type ViewMode = 'columns' | 'rows';

/** Certifications whose PRIMARY domain matches a column, grouped per level. */
function cellCerts(domainId: DomainId, levelId: string): Certification[] {
  return CERTIFICATIONS.filter((c) => c.domains[0] === domainId && c.level === levelId);
}

export default function RoadmapPanel() {
  const [selected, setSelected] = useState<Certification | null>(null);
  const [activeDomain, setActiveDomain] = useState<DomainId | 'all'>('all');
  const [view, setView] = useState<ViewMode>('columns');

  const visibleDomains = useMemo(
    () => (activeDomain === 'all' ? DOMAINS : DOMAINS.filter((d) => d.id === activeDomain)),
    [activeDomain],
  );

  const subtitle =
    view === 'columns'
      ? 'Domínios nas colunas, senioridade nas linhas (entrada no topo, especialista na base). Clique numa certificação para ver os detalhes à direita.'
      : 'Domínios nas linhas (à esquerda), senioridade nas colunas. Clique numa certificação para ver os detalhes à direita.';

  return (
    <section>
      <SectionHeading title="Mapa de certificações" subtitle={subtitle}>
        <ViewToggle view={view} onChange={setView} />
      </SectionHeading>

      <div className="flex flex-col gap-5 lg:flex-row">
        {/* Map column (main, on the left). */}
        <div className="min-w-0 flex-1">
          {/* Domain legend doubles as a filter. */}
          <div className="mb-4 flex flex-wrap gap-2">
            <FilterButton active={activeDomain === 'all'} onClick={() => setActiveDomain('all')}>
              Todos
            </FilterButton>
            {DOMAINS.map((d) => {
              const s = domainStyle(d.id);
              const active = activeDomain === d.id;
              return (
                <button
                  key={d.id}
                  type="button"
                  onClick={() => setActiveDomain(active ? 'all' : d.id)}
                  className={`chip transition ${active ? `${s.bgStrong} ${s.borderStrong} ${s.text}` : `border-slate-700 text-slate-400 hover:${s.text}`}`}
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-current" aria-hidden />
                  {d.name}
                </button>
              );
            })}
          </div>

          {view === 'columns' ? (
            <ColumnsView
              domains={visibleDomains}
              selected={selected}
              onSelect={setSelected}
            />
          ) : (
            <RowsView domains={visibleDomains} selected={selected} onSelect={setSelected} />
          )}
        </div>

        {/* Detail sidebar — now on the right, sticky while the map scrolls. */}
        <aside className="lg:w-80 lg:shrink-0">
          <div className="lg:sticky lg:top-20">
            {selected ? (
              <div className="animate-fade-in">
                <div className="mb-2 flex items-center justify-between">
                  <p className="panel-title">Detalhe</p>
                  <button
                    type="button"
                    onClick={() => setSelected(null)}
                    className="font-mono text-xs text-slate-500 transition hover:text-slate-300"
                  >
                    fechar ✕
                  </button>
                </div>
                <CertCard cert={selected} />
              </div>
            ) : (
              <div className="panel flex min-h-[160px] flex-col items-center justify-center text-center">
                <p className="font-display text-sm text-slate-400">Detalhe da certificação</p>
                <p className="mt-1 font-mono text-xs text-slate-600">
                  clique num bloco do mapa para ver aqui
                </p>
              </div>
            )}
          </div>
        </aside>
      </div>
    </section>
  );
}

/* ── Views ─────────────────────────────────────────────────────────────────── */

interface ViewProps {
  domains: Domain[];
  selected: Certification | null;
  onSelect: (cert: Certification) => void;
}

/** Domains across the top (columns), seniority down the side (rows). */
function ColumnsView({ domains, selected, onSelect }: ViewProps) {
  return (
    <div className="overflow-x-auto pb-2">
      <div
        className="grid gap-2.5"
        style={{
          gridTemplateColumns: `minmax(84px, auto) repeat(${domains.length}, minmax(150px, 1fr))`,
        }}
      >
        {/* Header row: empty corner + domain headers. */}
        <div aria-hidden />
        {domains.map((d) => (
          <DomainHeader key={`head-${d.id}`} domain={d} />
        ))}

        {/* One row per level, entry first (top). */}
        {LEVELS.map((level) => (
          <Fragment key={level.id}>
            <LevelRowLabel level={level} />
            {domains.map((d) => (
              <Cell
                key={`${level.id}-${d.id}`}
                domainId={d.id}
                levelId={level.id}
                selected={selected}
                onSelect={onSelect}
              />
            ))}
          </Fragment>
        ))}
      </div>
    </div>
  );
}

/** Domains down the side (rows), seniority across the top (columns). */
function RowsView({ domains, selected, onSelect }: ViewProps) {
  return (
    <div className="overflow-x-auto pb-2">
      <div
        className="grid gap-2.5"
        style={{
          gridTemplateColumns: `minmax(140px, 0.8fr) repeat(${LEVELS.length}, minmax(150px, 1fr))`,
        }}
      >
        {/* Header row: empty corner + level headers. */}
        <div aria-hidden />
        {LEVELS.map((level) => (
          <LevelHeader key={`head-${level.id}`} level={level} />
        ))}

        {/* One row per domain. */}
        {domains.map((d) => (
          <Fragment key={d.id}>
            <DomainRowLabel domain={d} />
            {LEVELS.map((level) => (
              <Cell
                key={`${d.id}-${level.id}`}
                domainId={d.id}
                levelId={level.id}
                selected={selected}
                onSelect={onSelect}
              />
            ))}
          </Fragment>
        ))}
      </div>
    </div>
  );
}

/* ── Shared cells ──────────────────────────────────────────────────────────── */

function Cell({
  domainId,
  levelId,
  selected,
  onSelect,
}: {
  domainId: DomainId;
  levelId: string;
  selected: Certification | null;
  onSelect: (cert: Certification) => void;
}) {
  const certs = cellCerts(domainId, levelId);
  return (
    <div className="flex min-h-[52px] flex-col gap-1.5 rounded-lg border border-slate-800/50 bg-black/30 p-1.5">
      {certs.map((cert) => (
        <CertTile
          key={cert.id}
          cert={cert}
          active={selected?.id === cert.id}
          onSelect={onSelect}
        />
      ))}
    </div>
  );
}

function CertTile({
  cert,
  active,
  onSelect,
}: {
  cert: Certification;
  active: boolean;
  onSelect: (cert: Certification) => void;
}) {
  const s = domainStyle(cert.domains[0]);
  return (
    <button
      type="button"
      onClick={() => onSelect(cert)}
      title={cert.name}
      className={`rounded-md border ${s.border} ${s.bg} px-2 py-1 text-left transition hover:${s.bgStrong} ${active ? `ring-2 ${s.ring}` : ''}`}
    >
      <span className={`block font-display text-xs font-semibold ${s.text}`}>{cert.acronym}</span>
      <span className="block truncate font-mono text-[10px] text-slate-500">{cert.vendor}</span>
    </button>
  );
}

function DomainHeader({ domain }: { domain: Domain }) {
  const s = domainStyle(domain.id);
  return (
    <div className={`rounded-lg border ${s.border} ${s.bg} px-3 py-2`}>
      <p className={`font-display text-sm font-semibold ${s.text}`}>{domain.name}</p>
      <p className="mt-0.5 text-[11px] leading-snug text-slate-500">{domain.description}</p>
    </div>
  );
}

function DomainRowLabel({ domain }: { domain: Domain }) {
  const s = domainStyle(domain.id);
  return (
    <div className={`flex flex-col justify-center rounded-lg border ${s.border} ${s.bg} px-3 py-2`}>
      <p className={`font-display text-sm font-semibold ${s.text}`}>{domain.name}</p>
      <p className="mt-0.5 hidden text-[11px] leading-snug text-slate-500 lg:block">
        {domain.description}
      </p>
    </div>
  );
}

function LevelHeader({ level }: { level: Level }) {
  return (
    <div className="rounded-lg border border-slate-700/50 bg-slate-900/40 px-3 py-2">
      <p className="font-display text-sm font-semibold text-slate-200">{level.name}</p>
      <p className="mt-0.5 text-[11px] leading-snug text-slate-500">{level.description}</p>
    </div>
  );
}

function LevelRowLabel({ level }: { level: Level }) {
  return (
    <div className="flex items-center justify-end pr-2">
      <span className="text-right font-mono text-[10px] uppercase leading-tight tracking-wider text-slate-500">
        {level.name}
      </span>
    </div>
  );
}

/* ── Controls ──────────────────────────────────────────────────────────────── */

function ViewToggle({ view, onChange }: { view: ViewMode; onChange: (v: ViewMode) => void }) {
  return (
    <div
      className="inline-flex rounded-lg border border-slate-700 bg-black/40 p-0.5"
      role="group"
      aria-label="Modo de visualização"
    >
      <ToggleButton active={view === 'columns'} onClick={() => onChange('columns')}>
        ▦ Domínios em colunas
      </ToggleButton>
      <ToggleButton active={view === 'rows'} onClick={() => onChange('rows')}>
        ▤ Domínios em linhas
      </ToggleButton>
    </div>
  );
}

function ToggleButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`rounded-md px-3 py-1 font-mono text-xs transition ${
        active ? 'bg-emerald-400/15 text-emerald-300' : 'text-slate-500 hover:text-slate-300'
      }`}
    >
      {children}
    </button>
  );
}

function FilterButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`chip transition ${active ? 'border-emerald-400/40 bg-emerald-400/10 text-emerald-300' : 'border-slate-700 text-slate-400 hover:text-emerald-300'}`}
    >
      {children}
    </button>
  );
}
