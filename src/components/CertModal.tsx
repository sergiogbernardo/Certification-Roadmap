import { useEffect } from 'react';
import { getCert } from '../data/certifications';
import { getDomain } from '../data/domains';
import type { Certification } from '../data/types';
import { domainStyle } from '../lib/domainStyle';
import { DomainChip, ExternalLink, LevelChip } from './ui';

interface CertModalProps {
  cert: Certification;
  onClose: () => void;
  /** Navigate the modal to another certification (used by the next-step links). */
  onNavigate: (cert: Certification) => void;
}

export default function CertModal({ cert, onClose, onNavigate }: CertModalProps) {
  // Close on Escape and lock background scroll while the dialog is open.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = previousOverflow;
    };
  }, [onClose]);

  const primary = cert.domains[0];
  const s = domainStyle(primary);
  const domain = getDomain(primary);

  const nextSteps = (cert.leadsTo ?? [])
    .map((id) => getCert(id))
    .filter((c): c is Certification => Boolean(c));

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="cert-modal-title"
    >
      <div
        className="absolute inset-0 bg-black/75 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden
      />

      <div
        className={`relative z-10 max-h-[85vh] w-full max-w-lg animate-fade-in overflow-y-auto rounded-2xl border ${s.borderStrong} bg-slate-950/95 p-6 shadow-2xl`}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Fechar"
          className="absolute right-4 top-4 font-mono text-sm text-slate-500 transition hover:text-slate-200"
        >
          ✕
        </button>

        <p className={`font-mono text-xs uppercase tracking-wider ${s.text}`}>{domain.name}</p>
        <h2 id="cert-modal-title" className="mt-1 pr-8 font-display text-2xl font-bold text-slate-100">
          {cert.name}
        </h2>
        <p className="mt-1 font-mono text-xs text-slate-500">{cert.vendor}</p>

        <div className="mt-4 flex flex-wrap items-center gap-1.5">
          {cert.domains.map((d) => (
            <DomainChip key={d} id={d} />
          ))}
          <LevelChip id={cert.level} />
        </div>

        <p className="mt-4 text-sm leading-relaxed text-slate-300">{cert.summary}</p>
        <p className="mt-2 text-sm leading-relaxed text-slate-400">
          <span className={s.text}>Foco:</span> {cert.focus}.
        </p>

        {nextSteps.length > 0 && (
          <div className="mt-5">
            <p className="field-label">Próximos passos</p>
            <div className="flex flex-wrap gap-2">
              {nextSteps.map((next) => {
                const ns = domainStyle(next.domains[0]);
                return (
                  <button
                    key={next.id}
                    type="button"
                    onClick={() => onNavigate(next)}
                    className={`chip transition ${ns.bg} ${ns.border} ${ns.text} hover:${ns.bgStrong}`}
                  >
                    {next.acronym} →
                  </button>
                );
              })}
            </div>
          </div>
        )}

        <div className="mt-6 border-t border-slate-800 pt-4">
          <ExternalLink href={cert.url}>página oficial da certificação</ExternalLink>
        </div>
      </div>
    </div>
  );
}
