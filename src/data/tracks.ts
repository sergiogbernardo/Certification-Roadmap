import type { Track } from './types';

/**
 * Curated learning paths. Each `steps` entry is a certification id, ordered from
 * the recommended first step to the most advanced. These are opinionated
 * suggestions, not the only valid route.
 */
export const TRACKS: Track[] = [
  {
    id: 'soc-blue-team',
    name: 'Analista de SOC / Blue Team',
    domain: 'defensive',
    tagline: 'Monitorar, detectar e responder a incidentes.',
    description:
      'Trilha de defesa cibernética: da base de segurança às operações de SOC, resposta a incidentes e forense.',
    steps: ['comptia-security', 'sbt-btl1', 'comptia-cysa', 'sc-200', 'giac-gcih', 'giac-gcfa'],
  },
  {
    id: 'pentester-red-team',
    name: 'Pentester / Red Team',
    domain: 'offensive',
    tagline: 'Pensar como o atacante e testar defesas.',
    description:
      'Caminho ofensivo: começa com base sólida, passa por pentest prático e chega a red team avançado.',
    steps: ['comptia-security', 'ine-ejpt', 'comptia-pentest', 'offsec-oscp', 'altered-crtp', 'offsec-osep'],
  },
  {
    id: 'grc-audit',
    name: 'GRC & Auditoria',
    domain: 'grc',
    tagline: 'Governança, risco, compliance e auditoria.',
    description:
      'Para quem quer atuar com normas, auditoria e gestão de risco — da ISO 27001 ao CISM.',
    steps: ['iso27001-foundation', 'comptia-security', 'isaca-cisa', 'iso27001-lead-auditor', 'isaca-crisc', 'isaca-cism'],
  },
  {
    id: 'cloud-security',
    name: 'Cloud Security',
    domain: 'cloud',
    tagline: 'Proteger cargas de trabalho em nuvem.',
    description:
      'Trilha de segurança em nuvem: fundamentos, engenharia em Azure/AWS e arquitetura neutra com CCSP.',
    steps: ['sc-900', 'aws-ccp', 'az-500', 'aws-security', 'sc-200', 'isc2-ccsp'],
  },
  {
    id: 'appsec-devsecops',
    name: 'AppSec & DevSecOps',
    domain: 'appsec',
    tagline: 'Segurança de aplicações e código.',
    description:
      'Para desenvolvedores e especialistas em segurança de software: do web hacking ao SDLC seguro.',
    steps: ['comptia-security', 'portswigger-bscp', 'giac-gwapt', 'isc2-csslp'],
  },
  {
    id: 'leadership-ciso',
    name: 'Liderança & CISO',
    domain: 'management',
    tagline: 'Caminho até a liderança de segurança.',
    description:
      'Para quem busca cargos de gestão e estratégia: consolida visão ampla e governança rumo ao CISO.',
    steps: ['comptia-security', 'isc2-cissp', 'isaca-cism', 'isaca-crisc', 'iso27001-lead-implementer'],
  },
];
