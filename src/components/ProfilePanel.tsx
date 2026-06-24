import { useMemo, useState } from 'react';
import { CERTIFICATIONS } from '../data/certifications';
import { DOMAINS } from '../data/domains';
import type { ProfileResult } from '../lib/profile';
import { evaluateProfile, maxDomainScore } from '../lib/profile';
import { domainStyle } from '../lib/domainStyle';
import CertCard from './CertCard';
import { SectionHeading } from './ui';

export default function ProfilePanel() {
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [result, setResult] = useState<ProfileResult | null>(null);

  const certsByDomain = useMemo(
    () =>
      DOMAINS.map((domain) => ({
        domain,
        certs: CERTIFICATIONS.filter((c) => c.domains[0] === domain.id).sort((a, b) =>
          a.name.localeCompare(b.name, 'pt-BR'),
        ),
      })),
    [],
  );

  const toggle = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const verify = () => setResult(evaluateProfile([...selected]));
  const reset = () => {
    setSelected(new Set());
    setResult(null);
  };

  return (
    <section>
      <SectionHeading
        title="Avalie seu perfil"
        subtitle="Marque as certificações que você já possui e clique em verificar. A análise é baseada nos dados do catálogo — não é uma validação oficial das suas credenciais."
      >
        <span className="font-mono text-xs text-slate-500">{selected.size} selecionada(s)</span>
      </SectionHeading>

      <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        {/* Selection */}
        <div className="space-y-4">
          {certsByDomain.map(({ domain, certs }) => {
            const s = domainStyle(domain.id);
            return (
              <fieldset key={domain.id} className="rounded-xl border border-slate-800/60 p-3">
                <legend className={`px-1 font-display text-sm font-semibold ${s.text}`}>
                  {domain.name}
                </legend>
                <div className="grid gap-1.5 sm:grid-cols-2">
                  {certs.map((cert) => {
                    const checked = selected.has(cert.id);
                    return (
                      <label
                        key={cert.id}
                        className={`flex cursor-pointer items-center gap-2 rounded-lg border px-2.5 py-1.5 text-sm transition ${checked ? `${s.borderStrong} ${s.bg}` : 'border-slate-800 hover:border-slate-700'}`}
                      >
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={() => toggle(cert.id)}
                          className="accent-emerald-400"
                        />
                        <span className="truncate text-slate-200" title={cert.name}>
                          {cert.acronym}
                        </span>
                      </label>
                    );
                  })}
                </div>
              </fieldset>
            );
          })}

          <div className="flex gap-2">
            <button
              type="button"
              onClick={verify}
              disabled={selected.size === 0}
              className="rounded-lg bg-emerald-400/15 px-5 py-2 font-display text-sm font-semibold text-emerald-300 transition hover:bg-emerald-400/25 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Verificar perfil
            </button>
            <button
              type="button"
              onClick={reset}
              className="rounded-lg px-4 py-2 font-mono text-xs text-slate-500 transition hover:text-slate-300"
            >
              limpar
            </button>
          </div>
        </div>

        {/* Results */}
        <div className="lg:sticky lg:top-20 lg:self-start">
          {result ? <ProfileResultView result={result} /> : <EmptyResult />}
        </div>
      </div>
    </section>
  );
}

function EmptyResult() {
  return (
    <div className="panel flex h-full min-h-[200px] flex-col items-center justify-center text-center">
      <p className="font-display text-sm text-slate-400">Sua análise aparece aqui</p>
      <p className="mt-1 font-mono text-xs text-slate-600">
        marque suas certificações e clique em verificar
      </p>
    </div>
  );
}

function ProfileResultView({ result }: { result: ProfileResult }) {
  const max = maxDomainScore(result.strengths);

  return (
    <div className="animate-fade-in space-y-5">
      <div className="panel">
        <div className="flex items-center justify-between">
          <p className="panel-title">Resumo</p>
          <span className="chip border-emerald-400/40 bg-emerald-400/10 text-emerald-300">
            {result.seniority.label}
          </span>
        </div>
        <p className="mt-3 text-sm leading-relaxed text-slate-300">{result.summary}</p>
      </div>

      {result.strengths.length > 0 && (
        <div className="panel">
          <p className="panel-title mb-3">Pontos fortes por domínio</p>
          <div className="space-y-2.5">
            {result.strengths.map((s) => {
              const ds = domainStyle(s.domain.id);
              const pct = Math.round((s.score / max) * 100);
              return (
                <div key={s.domain.id}>
                  <div className="mb-1 flex items-center justify-between text-xs">
                    <span className={ds.text}>{s.domain.name}</span>
                    <span className="font-mono text-slate-500">{s.count} cert(s)</span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-slate-800">
                    <div className={`h-full rounded-full ${ds.fill}`} style={{ width: `${pct}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {result.recommended.length > 0 && (
        <div>
          <p className="panel-title mb-2">Próximos passos sugeridos</p>
          <div className="space-y-2">
            {result.recommended.map((cert) => (
              <CertCard key={cert.id} cert={cert} compact />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
