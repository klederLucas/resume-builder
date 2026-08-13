import {
  RESUME_SCHEMA_VERSION,
  selectResumeView,
  type Resume,
} from "@shared/resume";

import { DEFAULT_TEMPLATE_ID } from "./registry";

export const SAMPLE_RESUME: Resume = {
  meta: {
    version: RESUME_SCHEMA_VERSION,
    templateId: DEFAULT_TEMPLATE_ID,
    language: "pt",
  },
  profile: {
    name: "ANA BEATRIZ COSTA",
    title: "Engenheira de Software",
    location: "São Paulo, SP - Brasil",
    phone: "+55 11 90000-0000",
    email: "ana.costa@exemplo.com",
  },
  summary:
    "Engenheira de software com foco em back-end e sistemas distribuídos, especializada em APIs de alta disponibilidade e na modernização de aplicações legadas. Experiência conduzindo migrações para a nuvem, definindo padrões de arquitetura e elevando a cobertura de testes de times inteiros. Busco posições em que a decisão técnica caminhe junto com o impacto no produto.",
  coreCompetencies: [
    "Desenvolvimento Back-End",
    "Arquitetura de APIs",
    "Integração Contínua",
    "Modelagem de Dados",
    "Observabilidade",
    "Computação em Nuvem",
    "Otimização de Performance",
  ],
  skills: {
    programmingLanguages: ["TypeScript", "Python", "Go", "SQL"],
    technologies: ["Node.js", "NestJS", "PostgreSQL", "Redis", "React"],
    toolsPlatforms: ["AWS", "Docker", "Kubernetes", "Terraform", "Grafana"],
  },
  experience: [
    {
      period: "2022 - Atual",
      role: "Engenheira de Software Sênior",
      company: "NORTE DIGITAL",
      description:
        "Responsável pela plataforma de pagamentos que processa o faturamento recorrente da empresa. Liderou a quebra do monólito em serviços de domínio, desenhou o contrato de eventos entre eles e conduziu a migração sem janela de indisponibilidade para os clientes.",
      achievements: [
        "Reduziu o tempo de resposta médio da API de checkout de 820ms para 190ms.",
        "Elevou a cobertura de testes do time de 34% para 81% em dois trimestres.",
        "Automatizou o pipeline de releases, derrubando o lead time de deploy de 3 dias para 40 minutos.",
      ],
    },
    {
      period: "2019 - 2022",
      role: "Engenheira de Software Plena",
      company: "COOPERATIVA TECH",
      description:
        "Atuou no time de integrações, construindo conectores entre o ERP interno e serviços externos de logística e emissão fiscal. Introduziu contratos versionados e testes de contrato, reduzindo quebras em produção causadas por mudanças de parceiros.",
      achievements: [
        "Padronizou 12 integrações sob um mesmo contrato, cortando pela metade o tempo de onboarding de novos parceiros.",
        "Implementou reprocessamento idempotente, eliminando a duplicidade de notas fiscais.",
      ],
    },
    {
      period: "2017 - 2019",
      role: "Desenvolvedora de Software",
      company: "ESTÚDIO ALFA",
      description:
        "Desenvolvimento full-stack de aplicações sob demanda para clientes dos setores de educação e varejo, do levantamento de requisitos à sustentação em produção.",
      achievements: [
        "Entregou um portal de matrículas que absorveu 40 mil inscrições no primeiro semestre.",
        "Criou a biblioteca interna de componentes reutilizada em quatro projetos.",
      ],
    },
    {
      period: "2015 - 2017",
      role: "Desenvolvedora Júnior",
      company: "INSTITUTO ORION",
      description:
        "Manutenção e evolução de sistemas internos de gestão acadêmica, com foco em correção de defeitos críticos e melhoria de relatórios.",
      achievements: [
        "Reescreveu a rotina de fechamento de notas, reduzindo o processamento de 6 horas para 20 minutos.",
      ],
    },
  ],
  education: [
    {
      degree: "Bacharelado em Ciência da Computação",
      institution: "Universidade Federal do Paraná, 2015",
    },
  ],
  certifications: [
    {
      name: "AWS Certified Solutions Architect – Associate",
      issuer: "Amazon Web Services, 2023",
    },
  ],
};

export const SAMPLE_RESUME_VIEW = selectResumeView(SAMPLE_RESUME);
