import { useState } from 'react';
import { getCert } from '../data/certifications';
import { getDomain } from '../data/domains';
import { TRACKS } from '../data/tracks';
import type { Track } from '../data/types';
import { domainStyle } from '../lib/domainStyle';
import CertCard from './CertCard';
import { SectionHeading } from './ui';

export default function TracksPanel() {
  const [openId, setOpenId] = useState<string>(TRACKS[0]?.id ?? '');

  return (
    <section>
      <SectionHeading
        title="Trilhas prontas"
        subtitle="Caminhos sugeridos por área. Cada trilha vai do primeiro passo até o nível mais avançado."
      />

      <div className="space-y-3">
        {TRACKS.map((track) => (
          <TrackRow
            key={track.id}
            track={track}
            open={openId === track.id}
            onToggle={() => setOpenId(openId === track.id ? '' : track.id)}
          />
        ))}
      </div>
    </section>
  );
}

function TrackRow({
  track,
  open,
  onToggle,
}: {
  track: Track;
  open: boolean;
  onToggle: () => void;
}) {
  const domain = getDomain(track.domain);
  const s = domainStyle(track.domain);

  return (
    <div className={`rounded-xl border ${s.border} bg-black/40 overflow-hidden`}>
      <button
        type="button"
        onClick={onToggle}
        className={`flex w-full items-center justify-between gap-3 px-4 py-3 text-left transition hover:${s.bg}`}
        aria-expanded={open}
      >
        <div>
          <div className="flex items-center gap-2">
            <span className={`h-2 w-2 rounded-full bg-current ${s.text}`} aria-hidden />
            <h3 className="font-display text-base font-semibold text-slate-100">{track.name}</h3>
          </div>
          <p className="mt-0.5 text-sm text-slate-400">{track.tagline}</p>
        </div>
        <span className={`shrink-0 font-mono text-xs ${s.text}`}>
          {track.steps.length} passos {open ? '▲' : '▼'}
        </span>
      </button>

      {open && (
        <div className="animate-fade-in border-t border-slate-800/60 px-4 py-4">
          <p className="mb-4 text-sm text-slate-400">
            <span className={`font-mono text-xs uppercase ${s.text}`}>{domain.name}</span> ·{' '}
            {track.description}
          </p>
          <ol className="space-y-2.5">
            {track.steps.map((id, i) => {
              const cert = getCert(id);
              if (!cert) return null;
              return (
                <li key={id}>
                  <CertCard cert={cert} step={i + 1} compact />
                </li>
              );
            })}
          </ol>
        </div>
      )}
    </div>
  );
}
