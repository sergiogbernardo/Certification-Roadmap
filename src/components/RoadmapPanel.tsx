import { Fragment, useMemo, useState } from 'react';
import { CERTIFICATIONS } from '../data/certifications';
import { DOMAINS, LEVELS } from '../data/domains';
import type { Certification, Domain, DomainId, Level } from '../data/types';
import { domainStyle } from '../lib/domainStyle';
import CertModal from './CertModal';
import { DomainChip } from './ui';

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

  return (
    <section>
      {/* Heading kept for screen readers / SEO, hidden visually to keep the UI clean. */}
      <h2 className="sr-only">Mapa de certificações</h2>

      {/* Toolbar: domain filter on the left, view toggle on the right. */}
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap gap-2">
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
        {/* The view toggle only applies to the desktop matrix. */}
        <div className="hidden lg:block">
          <ViewToggle view={view} onChange={setView} />
        </div>
      </div>

      {/* Desktop: the full matrix (domains as columns or rows). */}
      <div className="hidden lg:block">
        {view === 'columns' ? (
          <ColumnsView domains={visibleDomains} selected={selected} onSelect={setSelected} />
        ) : (
          <RowsView domains={visibleDomains} selected={selected} onSelect={setSelected} />
        )}
      </div>

      {/* Mobile: a level-grouped accordion list, no horizontal scrolling. */}
      <div className="lg:hidden">
        <MobileListView domains={visibleDomains} onSelect={setSelected} />
      </div>

      {selected && (
        <CertModal cert={selected} onClose={() => setSelected(null)} onNavigate={setSelected} />
      )}
    </section>
  );
}

/* ── Mobile list view ──────────────────────────────────────────────────────── */

const DOMAIN_ORDER = new Map(DOMAINS.map((d, i) => [d.id, i]));

/** Certs at a given level whose primary domain is currently visible. */
function levelCerts(domains: Domain[], levelId: string): Certification[] {
  const visible = new Set(domains.map((d) => d.id));
  return CERTIFICATIONS.filter((c) => c.level === levelId && visible.has(c.domains[0])).sort(
    (a, b) =>
      (DOMAIN_ORDER.get(a.domains[0]) ?? 0) - (DOMAIN_ORDER.get(b.domains[0]) ?? 0) ||
      a.name.localeCompare(b.name, 'pt-BR'),
  );
}

function MobileListView({
  domains,
  onSelect,
}: {
  domains: Domain[];
  onSelect: (cert: Certification) => void;
}) {
  // Single-open accordion; entry level starts expanded.
  const [openLevel, setOpenLevel] = useState<string>('entry');

  return (
    <div className="space-y-2.5">
      {LEVELS.map((level) => {
        const certs = levelCerts(domains, level.id);
        if (certs.length === 0) return null;
        const open = openLevel === level.id;
        return (
          <div
            key={level.id}
            className="overflow-hidden rounded-xl border border-slate-800/60 bg-black/40"
          >
            <button
              type="button"
              onClick={() => setOpenLevel(open ? '' : level.id)}
              aria-expanded={open}
              className="flex w-full items-center justify-between gap-3 px-4 py-3 text-left"
            >
              <span className="flex items-center gap-2">
                <span className="font-mono text-[10px] text-emerald-400">
                  {'●'.repeat(level.rank)}
                  <span className="text-slate-700">{'●'.repeat(4 - level.rank)}</span>
                </span>
                <span className="font-display text-sm font-semibold text-slate-100">
                  {level.name}
                </span>
              </span>
              <span className="font-mono text-xs text-slate-500">
                {certs.length} {open ? '▲' : '▼'}
              </span>
            </button>

            {open && (
              <ul className="divide-y divide-slate-800/40 border-t border-slate-800/60">
                {certs.map((cert) => (
                  <MobileCertRow key={cert.id} cert={cert} onSelect={onSelect} />
                ))}
              </ul>
            )}
          </div>
        );
      })}
    </div>
  );
}

function MobileCertRow({
  cert,
  onSelect,
}: {
  cert: Certification;
  onSelect: (cert: Certification) => void;
}) {
  const s = domainStyle(cert.domains[0]);
  return (
    <li>
      <button
        type="button"
        onClick={() => onSelect(cert)}
        className={`flex w-full items-center gap-3 px-4 py-2.5 text-left transition hover:${s.bg}`}
      >
        <span className={`h-9 w-1 shrink-0 rounded-full ${s.fill}`} aria-hidden />
        <span className="min-w-0 flex-1">
          <span className="block font-display text-sm font-semibold text-slate-100">
            {cert.acronym}
            <span className="font-sans font-normal text-slate-400"> · {cert.name}</span>
          </span>
          <span className="block truncate font-mono text-[11px] text-slate-500">{cert.vendor}</span>
        </span>
        <DomainChip id={cert.domains[0]} />
      </button>
    </li>
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
