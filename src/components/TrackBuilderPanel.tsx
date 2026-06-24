import { useMemo, useState } from 'react';
import { CERTIFICATIONS, getCert } from '../data/certifications';
import { getDomain } from '../data/domains';
import { domainStyle } from '../lib/domainStyle';
import { prerequisitesFor, suggestNext } from '../lib/recommend';
import CertCard from './CertCard';
import { DomainChip, LevelChip, SectionHeading } from './ui';

const SORTED = [...CERTIFICATIONS].sort((a, b) => a.name.localeCompare(b.name, 'pt-BR'));

export default function TrackBuilderPanel() {
  const [anchorId, setAnchorId] = useState<string>('');

  const anchor = anchorId ? getCert(anchorId) : undefined;
  const suggestions = useMemo(() => (anchorId ? suggestNext(anchorId) : []), [anchorId]);
  const prereqs = useMemo(() => (anchorId ? prerequisitesFor(anchorId) : []), [anchorId]);

  return (
    <section>
      <SectionHeading
        title="Monte sua trilha"
        subtitle="Escolha uma certificação âncora. A ferramenta explica do que ela se trata e sugere os próximos passos que fazem sentido a partir dela."
      />

      <div className="panel mb-6">
        <label htmlFor="anchor" className="field-label">
          Certificação âncora
        </label>
        <select
          id="anchor"
          value={anchorId}
          onChange={(e) => setAnchorId(e.target.value)}
          className="w-full rounded-lg border border-emerald-500/20 bg-black/60 px-3 py-2 font-sans text-sm text-slate-100 outline-none transition focus:border-emerald-400/50"
        >
          <option value="">— selecione uma certificação —</option>
          {SORTED.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name} ({c.vendor})
            </option>
          ))}
        </select>
      </div>

      {!anchor && (
        <p className="panel text-center font-mono text-sm text-slate-500">
          Selecione uma certificação acima para ver a referência e as sugestões.
        </p>
      )}

      {anchor && (
        <div className="space-y-6">
          <AnchorReference anchorId={anchor.id} />

          {prereqs.length > 0 && (
            <div>
              <p className="panel-title mb-2">Antes dela, ajuda ter</p>
              <div className="grid gap-3 sm:grid-cols-2">
                {prereqs.map((c) => (
                  <CertCard key={c.id} cert={c} compact />
                ))}
              </div>
            </div>
          )}

          <div>
            <p className="panel-title mb-2">A partir daqui, faz sentido seguir para</p>
            {suggestions.length === 0 ? (
              <p className="panel font-mono text-sm text-slate-500">
                Esta já é uma certificação de ponta na trilha — foque em experiência prática e
                especializações.
              </p>
            ) : (
              <div className="grid gap-3 sm:grid-cols-2">
                {suggestions.map((sug) => (
                  <CertCard key={sug.cert.id} cert={sug.cert} note={sug.reason} compact />
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </section>
  );
}

/** The "what is this certification" reference block. */
function AnchorReference({ anchorId }: { anchorId: string }) {
  const cert = getCert(anchorId);
  if (!cert) return null;
  const primary = cert.domains[0];
  const s = domainStyle(primary);
  const domain = getDomain(primary);

  return (
    <div className={`rounded-xl border ${s.borderStrong} ${s.bg} p-5`}>
      <p className={`font-mono text-xs uppercase tracking-wider ${s.text}`}>Referência</p>
      <h3 className="mt-1 font-display text-xl font-semibold text-slate-100">{cert.name}</h3>
      <p className="mt-2 text-sm text-slate-300">
        Trata-se de uma certificação de <strong className={s.text}>{domain.name}</strong>, do
        fornecedor <strong>{cert.vendor}</strong>, voltada a {cert.focus}.
      </p>
      <p className="mt-2 text-sm text-slate-400">{cert.summary}</p>
      <div className="mt-3 flex flex-wrap items-center gap-1.5">
        {cert.domains.map((d) => (
          <DomainChip key={d} id={d} />
        ))}
        <LevelChip id={cert.level} />
      </div>
    </div>
  );
}
