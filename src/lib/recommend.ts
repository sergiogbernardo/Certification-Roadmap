import { CERTIFICATIONS, getCert } from '../data/certifications';
import { getLevel } from '../data/domains';
import type { Certification } from '../data/types';

export interface Suggestion {
  cert: Certification;
  /** Human-readable reason this came up. */
  reason: string;
  /** Higher = stronger suggestion. */
  score: number;
}

/**
 * Given an "anchor" certification, suggest sensible next certifications.
 *
 * The ranking blends three signals:
 *  - explicit `leadsTo` links authored in the dataset (strongest);
 *  - certifications that share a domain and sit one level higher;
 *  - certifications that explicitly list the anchor as a prerequisite.
 */
export function suggestNext(anchorId: string, limit = 5): Suggestion[] {
  const anchor = getCert(anchorId);
  if (!anchor) return [];

  const anchorRank = getLevel(anchor.level).rank;
  const scores = new Map<string, Suggestion>();

  const bump = (cert: Certification, points: number, reason: string) => {
    const existing = scores.get(cert.id);
    if (existing) {
      existing.score += points;
      // Keep the most informative reason (the highest-scoring contribution).
      if (points >= 3) existing.reason = reason;
    } else {
      scores.set(cert.id, { cert, score: points, reason });
    }
  };

  // 1. Explicit authored progression.
  for (const id of anchor.leadsTo ?? []) {
    const cert = getCert(id);
    if (cert) bump(cert, 5, `Próximo passo natural depois de ${anchor.acronym}.`);
  }

  for (const cert of CERTIFICATIONS) {
    if (cert.id === anchor.id) continue;
    const rank = getLevel(cert.level).rank;

    // 2. Same domain, one or two levels up.
    const sharedDomain = cert.domains.find((d) => anchor.domains.includes(d));
    if (sharedDomain && rank > anchorRank) {
      const step = rank - anchorRank;
      const points = step === 1 ? 3 : 1;
      bump(
        cert,
        points,
        `Avança no domínio "${sharedDomain}" a partir do nível de ${anchor.acronym}.`,
      );
    }

    // 3. Lists the anchor as a prerequisite.
    if (cert.prereqs?.includes(anchor.id)) {
      bump(cert, 3, `Tem ${anchor.acronym} como pré-requisito recomendado.`);
    }
  }

  return [...scores.values()].sort((a, b) => b.score - a.score).slice(0, limit);
}

/** Certifications that make a good foundation before tackling the anchor. */
export function prerequisitesFor(anchorId: string): Certification[] {
  const anchor = getCert(anchorId);
  if (!anchor) return [];
  return (anchor.prereqs ?? [])
    .map((id) => getCert(id))
    .filter((c): c is Certification => Boolean(c));
}
