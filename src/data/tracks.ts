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
    steps: ['comptia-security', 'ine-ejpt', 'comptia-pentest', 'offsec-oscp', 'altered-crtp', 'zps-crto', 'offsec-osep'],
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
    steps: ['sc-900', 'aws-ccp', 'csa-ccsk', 'az-500', 'aws-security', 'gcp-security', 'sc-200', 'isc2-ccsp'],
  },
  {
    id: 'appsec-devsecops',
    name: 'AppSec & DevSecOps',
    domain: 'appsec',
    tagline: 'Segurança de aplicações e código.',
    description:
      'Para desenvolvedores e especialistas em segurança de software: do web hacking ao SDLC seguro.',
    steps: ['comptia-security', 'portswigger-bscp', 'giac-gwapt', 'isc2-csslp', 'offsec-oswe'],
  },
  {
    id: 'dfir-forensics',
    name: 'Forense & DFIR',
    domain: 'defensive',
    tagline: 'Forense digital e resposta a incidentes.',
    description:
      'Trilha de DFIR: da base defensiva à resposta a incidentes, forense de endpoint e de rede e análise de malware.',
    steps: ['comptia-security', 'comptia-cysa', 'giac-gcih', 'giac-gcfe', 'giac-gcfa', 'giac-gnfa', 'giac-grem'],
  },
  {
    id: 'iam-identity',
    name: 'IAM & Identidade',
    domain: 'iam',
    tagline: 'Identidade, acesso e gestão de privilégios.',
    description:
      'Trilha de IAM: dos fundamentos de identidade à engenharia de acesso, gestão de privilégios (PAM) e identidade de clientes (CIAM).',
    steps: ['sc-900', 'okta-pro', 'ms-sc300', 'cyberark-defender', 'imi-ciam'],
  },
  {
    id: 'network-infra',
    name: 'Redes & Infraestrutura',
    domain: 'network',
    tagline: 'Redes e infraestrutura, da base ao expert.',
    description:
      'Trilha de redes: dos fundamentos ao roteamento e switching profissional e à arquitetura de redes em nível expert, com base de segurança.',
    steps: ['comptia-network', 'cisco-ccna', 'comptia-security', 'cisco-ccnp', 'cisco-ccie'],
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
