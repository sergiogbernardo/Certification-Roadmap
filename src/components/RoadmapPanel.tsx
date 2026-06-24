import { useMemo, useState } from 'react';
import { CERTIFICATIONS } from '../data/certifications';
import { DOMAINS, LEVELS } from '../data/domains';
import type { Certification, DomainId } from '../data/types';
import { domainStyle } from '../lib/domainStyle';
import CertCard from './CertCard';
import { SectionHeading } from './ui';

/** Certifications whose PRIMARY domain matches a column, grouped per level. */
function cellCerts(domainId: DomainId, levelId: string): Certification[] {
  return CERTIFICATIONS.filter((c) => c.domains[0] === domainId && c.level === levelId);
}

export default function RoadmapPanel() {
  const [selected, setSelected] = useState<Certification | null>(null);
  const [activeDomain, setActiveDomain] = useState<DomainId | 'all'>('all');

  const visibleDomains = useMemo(
    () => (activeDomain === 'all' ? DOMAINS : DOMAINS.filter((d) => d.id === activeDomain)),
    [activeDomain],
  );

  // Rows top→bottom: expert first, entry last (mirrors the classic roadmap).
  const rows = [...LEVELS].reverse();

  return (
    <section>
      <SectionHeading
        title="Mapa de certificações"
        subtitle="Colunas por domínio, linhas por senioridade. Clique numa certificação para ver os detalhes."
      />

      {/* Domain legend doubles as a filter. */}
      <div className="mb-5 flex flex-wrap gap-2">
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

      <div className="overflow-x-auto pb-2">
        <div
          className="grid gap-3"
          style={{
            gridTemplateColumns: `repeat(${visibleDomains.length}, minmax(180px, 1fr))`,
          }}
        >
          {/* Column headers */}
          {visibleDomains.map((d) => {
            const s = domainStyle(d.id);
            return (
              <div
                key={`head-${d.id}`}
                className={`rounded-lg border ${s.border} ${s.bg} px-3 py-2`}
              >
                <p className={`font-display text-sm font-semibold ${s.text}`}>{d.name}</p>
                <p className="mt-0.5 text-[11px] leading-snug text-slate-500">{d.description}</p>
              </div>
            );
          })}

          {/* Cells, row by row (level by level). */}
          {rows.map((level) =>
            visibleDomains.map((d) => {
              const certs = cellCerts(d.id, level.id);
              const s = domainStyle(d.id);
              return (
                <div
                  key={`${level.id}-${d.id}`}
                  className="min-h-[64px] rounded-lg border border-slate-800/60 bg-black/30 p-1.5"
                >
                  <span className="mb-1 block font-mono text-[10px] uppercase tracking-wider text-slate-600">
                    {level.name}
                  </span>
                  <div className="flex flex-col gap-1.5">
                    {certs.map((cert) => (
                      <button
                        key={cert.id}
                        type="button"
                        onClick={() => setSelected(cert)}
                        title={cert.name}
                        className={`rounded-md border ${s.border} ${s.bg} px-2 py-1 text-left transition hover:${s.bgStrong} ${selected?.id === cert.id ? `ring-2 ${s.ring}` : ''}`}
                      >
                        <span className={`block font-display text-xs font-semibold ${s.text}`}>
                          {cert.acronym}
                        </span>
                        <span className="block truncate font-mono text-[10px] text-slate-500">
                          {cert.vendor}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              );
            }),
          )}
        </div>
      </div>

      {selected && (
        <div className="mt-6">
          <div className="mb-2 flex items-center justify-between">
            <p className="panel-title">Detalhe</p>
            <button
              type="button"
              onClick={() => setSelected(null)}
              className="font-mono text-xs text-slate-500 hover:text-slate-300"
            >
              fechar ✕
            </button>
          </div>
          <CertCard cert={selected} />
        </div>
      )}
    </section>
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
