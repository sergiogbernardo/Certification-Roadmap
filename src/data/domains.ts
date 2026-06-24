import type { Domain, DomainId, Level, LevelId } from './types';

/**
 * The eight columns of the roadmap. Colours are Tailwind families; the matching
 * classes are kept in the Tailwind safelist so the JIT compiler emits them.
 */
export const DOMAINS: Domain[] = [
  {
    id: 'foundations',
    name: 'Fundamentos',
    color: 'sky',
    short: 'Base',
    description: 'Conceitos essenciais de TI e segurança — o ponto de partida de qualquer trilha.',
  },
  {
    id: 'grc',
    name: 'Governança, Risco & Compliance',
    color: 'violet',
    short: 'GRC',
    description: 'Políticas, auditoria, gestão de risco e normas como ISO 27001 e LGPD.',
  },
  {
    id: 'network',
    name: 'Redes & Infraestrutura',
    color: 'cyan',
    short: 'Redes',
    description: 'Fundamentos de redes, infraestrutura e a segurança que as protege.',
  },
  {
    id: 'iam',
    name: 'Identidade & Acesso',
    color: 'indigo',
    short: 'IAM',
    description: 'Gestão de identidades, autenticação, acessos privilegiados (PAM) e Zero Trust.',
  },
  {
    id: 'offensive',
    name: 'Ofensiva & Pentest',
    color: 'rose',
    short: 'Red',
    description: 'Testes de intrusão, red team e exploração — pensar como o atacante.',
  },
  {
    id: 'defensive',
    name: 'Defensiva, SOC & DFIR',
    color: 'amber',
    short: 'Blue',
    description: 'Monitoramento, resposta a incidentes, forense e caça a ameaças.',
  },
  {
    id: 'cloud',
    name: 'Cloud Security',
    color: 'blue',
    short: 'Cloud',
    description: 'Segurança em AWS, Azure e GCP, do fundamento à arquitetura.',
  },
  {
    id: 'appsec',
    name: 'AppSec & DevSecOps',
    color: 'fuchsia',
    short: 'AppSec',
    description: 'Segurança de aplicações, código seguro e pipelines de desenvolvimento.',
  },
  {
    id: 'management',
    name: 'Gestão & Liderança',
    color: 'teal',
    short: 'Gestão',
    description: 'Liderança de segurança, estratégia e o caminho até o CISO.',
  },
];

export const LEVELS: Level[] = [
  {
    id: 'entry',
    rank: 1,
    name: 'Entrada',
    description: 'Primeiros passos, sem pré-requisitos formais.',
  },
  {
    id: 'associate',
    rank: 2,
    name: 'Associado',
    description: 'Valida fundamentos sólidos e prática inicial.',
  },
  {
    id: 'professional',
    rank: 3,
    name: 'Profissional',
    description: 'Exige experiência real e profundidade técnica.',
  },
  {
    id: 'expert',
    rank: 4,
    name: 'Especialista',
    description: 'Senioridade comprovada, liderança e domínio amplo.',
  },
];

const domainMap = new Map<DomainId, Domain>(DOMAINS.map((d) => [d.id, d]));
const levelMap = new Map<LevelId, Level>(LEVELS.map((l) => [l.id, l]));

export function getDomain(id: DomainId): Domain {
  const d = domainMap.get(id);
  if (!d) throw new Error(`Unknown domain: ${id}`);
  return d;
}

export function getLevel(id: LevelId): Level {
  const l = levelMap.get(id);
  if (!l) throw new Error(`Unknown level: ${id}`);
  return l;
}
