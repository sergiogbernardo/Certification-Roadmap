import { getDomain } from '../data/domains';
import type { DomainId } from '../data/types';

/**
 * Tailwind class bundles for a domain colour. The colour comes from the dataset
 * (`Domain.color`) and every class produced here is present in the Tailwind
 * safelist, so the JIT compiler keeps them in the build.
 */
export interface DomainStyle {
  text: string;
  bg: string;
  bgStrong: string;
  /** Solid fill, e.g. for progress bars. */
  fill: string;
  border: string;
  borderStrong: string;
  ring: string;
}

export function domainStyle(domainId: DomainId): DomainStyle {
  const c = getDomain(domainId).color;
  return {
    text: `text-${c}-300`,
    bg: `bg-${c}-400/10`,
    bgStrong: `bg-${c}-500/15`,
    fill: `bg-${c}-400`,
    border: `border-${c}-500/30`,
    borderStrong: `border-${c}-400/40`,
    ring: `ring-${c}-400/40`,
  };
}
