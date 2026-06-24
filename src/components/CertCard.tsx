import type { Certification } from '../data/types';
import { domainStyle } from '../lib/domainStyle';
import { DomainChip, ExternalLink, LevelChip } from './ui';

interface CertCardProps {
  cert: Certification;
  /** Optional reason/explanation shown above the card body. */
  note?: string;
  /** Optional ordinal shown as a step number. */
  step?: number;
  compact?: boolean;
}

export default function CertCard({ cert, note, step, compact = false }: CertCardProps) {
  const primary = cert.domains[0];
  const s = domainStyle(primary);

  return (
    <article
      className={`animate-fade-in rounded-xl border ${s.border} bg-black/50 p-4 transition hover:${s.bgStrong}`}
    >
      <div className="flex items-start gap-3">
        {step !== undefined && (
          <span
            className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border ${s.borderStrong} ${s.text} font-mono text-xs`}
          >
            {step}
          </span>
        )}
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
            <h3 className="font-display text-base font-semibold text-slate-100">{cert.name}</h3>
            <span className="font-mono text-xs text-slate-500">{cert.vendor}</span>
          </div>

          {note && <p className={`mt-1 text-xs ${s.text}`}>{note}</p>}

          {!compact && <p className="mt-2 text-sm text-slate-400">{cert.summary}</p>}

          <div className="mt-3 flex flex-wrap items-center gap-1.5">
            {cert.domains.map((d) => (
              <DomainChip key={d} id={d} />
            ))}
            <LevelChip id={cert.level} />
          </div>

          <div className="mt-3">
            <ExternalLink href={cert.url}>página oficial</ExternalLink>
          </div>
        </div>
      </div>
    </article>
  );
}
