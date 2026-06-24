import { CERTIFICATIONS, getCert } from '../data/certifications';
import { DOMAINS, getDomain, getLevel } from '../data/domains';
import type { Certification, Domain, DomainId, LevelId } from '../data/types';
import { suggestNext } from './recommend';

export interface DomainStrength {
  domain: Domain;
  /** Weighted score (sum of level ranks across owned certs in this domain). */
  score: number;
  /** Number of owned certifications touching this domain. */
  count: number;
  /** Highest level reached in the domain. */
  topLevel?: LevelId;
}

export interface ProfileResult {
  owned: Certification[];
  strengths: DomainStrength[];
  /** Domains with little or no coverage — opportunities to grow. */
  gaps: Domain[];
  /** Overall seniority label derived from the owned certifications. */
  seniority: { label: string; rank: number };
  /** A few suggested next certifications across the whole profile. */
  recommended: Certification[];
  /** A short, generated natural-language summary. */
  summary: string;
}

const SENIORITY_LABELS: Record<number, string> = {
  0: 'Iniciante',
  1: 'Entrada',
  2: 'Associado',
  3: 'Profissional',
  4: 'Especialista / Sênior',
};

/**
 * Evaluate a set of owned certifications and produce strengths, gaps, an
 * estimated seniority and a textual summary. Pure function — no side effects.
 */
export function evaluateProfile(ownedIds: string[]): ProfileResult {
  const owned = ownedIds
    .map((id) => getCert(id))
    .filter((c): c is Certification => Boolean(c));

  // Aggregate per-domain score and reach.
  const byDomain = new Map<DomainId, DomainStrength>(
    DOMAINS.map((d) => [d.id, { domain: d, score: 0, count: 0 }]),
  );

  let maxRank = 0;
  for (const cert of owned) {
    const rank = getLevel(cert.level).rank;
    maxRank = Math.max(maxRank, rank);
    for (const domainId of cert.domains) {
      const entry = byDomain.get(domainId);
      if (!entry) continue;
      entry.score += rank;
      entry.count += 1;
      if (!entry.topLevel || rank > getLevel(entry.topLevel).rank) {
        entry.topLevel = cert.level;
      }
    }
  }

  const allStrengths = [...byDomain.values()];
  const strengths = allStrengths
    .filter((s) => s.score > 0)
    .sort((a, b) => b.score - a.score || b.count - a.count);

  const gaps = allStrengths
    .filter((s) => s.count === 0)
    .map((s) => s.domain);

  // Seniority: a single entry-level cert shouldn't read as "specialist", so we
  // require at least two certs touching a level before fully crediting it.
  const seniorityRank = creditedSeniority(owned, maxRank);

  const recommended = recommendForProfile(owned, strengths);

  return {
    owned,
    strengths,
    gaps,
    seniority: { label: SENIORITY_LABELS[seniorityRank], rank: seniorityRank },
    recommended,
    summary: buildSummary(owned, strengths, gaps, seniorityRank),
  };
}

function creditedSeniority(owned: Certification[], maxRank: number): number {
  if (owned.length === 0) return 0;
  const atMax = owned.filter((c) => getLevel(c.level).rank === maxRank).length;
  // A lone top-level cert is credited one level below until reinforced.
  if (atMax < 2 && maxRank > 1 && owned.length < 3) return maxRank - 1;
  return maxRank;
}

function recommendForProfile(
  owned: Certification[],
  strengths: DomainStrength[],
): Certification[] {
  if (owned.length === 0) return [];
  const ownedIds = new Set(owned.map((c) => c.id));

  // Use the two strongest domains' top certs as anchors for suggestions.
  const anchors = strengths.slice(0, 2).map((s) => {
    const inDomain = owned
      .filter((c) => c.domains.includes(s.domain.id))
      .sort((a, b) => getLevel(b.level).rank - getLevel(a.level).rank);
    return inDomain[0];
  });

  const seen = new Map<string, number>();
  for (const anchor of anchors) {
    if (!anchor) continue;
    for (const sug of suggestNext(anchor.id, 4)) {
      if (ownedIds.has(sug.cert.id)) continue;
      seen.set(sug.cert.id, (seen.get(sug.cert.id) ?? 0) + sug.score);
    }
  }

  return [...seen.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 4)
    .map(([id]) => getCert(id))
    .filter((c): c is Certification => Boolean(c));
}

function buildSummary(
  owned: Certification[],
  strengths: DomainStrength[],
  gaps: Domain[],
  seniorityRank: number,
): string {
  if (owned.length === 0) {
    return 'Selecione as certificações que você já possui para gerar uma análise do seu perfil.';
  }

  const parts: string[] = [];
  const certWord = owned.length === 1 ? 'certificação' : 'certificações';
  parts.push(
    `Você selecionou ${owned.length} ${certWord} e seu perfil aponta para o nível ${SENIORITY_LABELS[seniorityRank].toLowerCase()}.`,
  );

  const top = strengths.slice(0, 2).map((s) => s.domain.name);
  if (top.length === 1) {
    parts.push(`Seu ponto mais forte é ${top[0]}.`);
  } else if (top.length === 2) {
    parts.push(`Seus pontos mais fortes são ${top[0]} e ${top[1]}.`);
  }

  // Vendor diversity is a small but meaningful signal of breadth.
  const vendors = new Set(owned.map((c) => c.vendor));
  if (vendors.size >= 3) {
    parts.push(`Há boa diversidade de fornecedores (${vendors.size}), o que mostra amplitude.`);
  }

  if (gaps.length > 0 && gaps.length <= DOMAINS.length - 1) {
    const gapNames = gaps.slice(0, 2).map((d) => d.name);
    parts.push(
      `Para ampliar o alcance, considere evoluir em ${gapNames.join(' e ')}${gaps.length > 2 ? ', entre outros' : ''}.`,
    );
  }

  return parts.join(' ');
}

/** Max possible domain score, used to normalise the strength bars. */
export function maxDomainScore(strengths: DomainStrength[]): number {
  return Math.max(1, ...strengths.map((s) => s.score));
}

export { getDomain, getLevel, CERTIFICATIONS };
