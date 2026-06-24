// Shared domain model for the certification roadmap.

/** A security/IT knowledge area. Each domain owns a colour used across the UI. */
export interface Domain {
  id: DomainId;
  name: string;
  /** Tailwind colour family (e.g. "violet"). Drives the colour-by-domain UI. */
  color: string;
  short: string;
  description: string;
}

export type DomainId =
  | 'foundations'
  | 'grc'
  | 'network'
  | 'iam'
  | 'offensive'
  | 'defensive'
  | 'cloud'
  | 'appsec'
  | 'management';

/** Seniority levels, ordered from entry (1) to expert (4). */
export type LevelId = 'entry' | 'associate' | 'professional' | 'expert';

export interface Level {
  id: LevelId;
  /** Numeric weight used for ranking and profile scoring. */
  rank: 1 | 2 | 3 | 4;
  name: string;
  description: string;
}

export interface Certification {
  id: string;
  name: string;
  /** Short code shown on the map tile, e.g. "Security+". */
  acronym: string;
  vendor: string;
  /** Primary domain first; extra domains broaden where it shows up. */
  domains: DomainId[];
  level: LevelId;
  /** One-line "what it is" used by the track builder. */
  focus: string;
  summary: string;
  url: string;
  /** Certifications that are natural prerequisites/foundations. */
  prereqs?: string[];
  /** Certifications it logically leads to next. */
  leadsTo?: string[];
  tags?: string[];
}

/** A curated, ordered learning path through several certifications. */
export interface Track {
  id: string;
  name: string;
  domain: DomainId;
  tagline: string;
  description: string;
  /** Certification ids, ordered from first to last step. */
  steps: string[];
}
