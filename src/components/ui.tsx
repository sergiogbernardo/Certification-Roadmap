import type { ReactNode } from 'react';
import { getDomain, getLevel } from '../data/domains';
import type { DomainId, LevelId } from '../data/types';
import { domainStyle } from '../lib/domainStyle';

/** Small coloured pill marking a certification's domain. */
export function DomainChip({ id }: { id: DomainId }) {
  const domain = getDomain(id);
  const s = domainStyle(id);
  return (
    <span className={`chip ${s.bg} ${s.border} ${s.text}`}>
      <span className={`h-1.5 w-1.5 rounded-full bg-current`} aria-hidden />
      {domain.short}
    </span>
  );
}

/** Neutral pill showing the seniority level. */
export function LevelChip({ id }: { id: LevelId }) {
  const level = getLevel(id);
  return (
    <span className="chip border-slate-700 bg-slate-800/60 text-slate-300">
      {'●'.repeat(level.rank)}
      <span className="text-slate-500">{'●'.repeat(4 - level.rank)}</span>
      <span className="ml-1 normal-case">{level.name}</span>
    </span>
  );
}

interface SectionHeadingProps {
  title: string;
  subtitle?: string;
  children?: ReactNode;
}

export function SectionHeading({ title, subtitle, children }: SectionHeadingProps) {
  return (
    <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
      <div>
        <h2 className="font-display text-xl font-semibold text-slate-100">{title}</h2>
        {subtitle && <p className="mt-1 max-w-2xl text-sm text-slate-400">{subtitle}</p>}
      </div>
      {children}
    </div>
  );
}

export function ExternalLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-1 font-mono text-xs text-emerald-300/80 transition hover:text-emerald-300"
    >
      {children}
      <span aria-hidden>↗</span>
    </a>
  );
}
