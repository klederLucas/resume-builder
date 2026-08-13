export const RESUME_LANGUAGES = ["pt", "en"] as const;

export type ResumeLanguage = (typeof RESUME_LANGUAGES)[number];

export const SKILL_GROUP_KEYS = [
  "programmingLanguages",
  "technologies",
  "toolsPlatforms",
] as const;

export type SkillGroupKey = (typeof SKILL_GROUP_KEYS)[number];

export interface ResumeLabels {
  summary: string;
  experience: string;
  keyAchievements: string;
  education: string;
  certifications: string;
  coreCompetencies: string;
  technicalSummary: string;
  programmingLanguages: string;
  technologies: string;
  toolsPlatforms: string;
  documentSuffix: string;
}

export const RESUME_LABELS: Record<ResumeLanguage, ResumeLabels> = {
  pt: {
    summary: "Sumário",
    experience: "Experiência Profissional",
    keyAchievements: "Principais Conquistas",
    education: "Formação Acadêmica",
    certifications: "Licenças e Certificações",
    coreCompetencies: "Principais Competências",
    technicalSummary: "Resumo Técnico",
    programmingLanguages: "Linguagens de Programação",
    technologies: "Tecnologias",
    toolsPlatforms: "Ferramentas e Plataformas",
    documentSuffix: "Curriculo",
  },
  en: {
    summary: "Summary",
    experience: "Work Experience",
    keyAchievements: "Key Achievements",
    education: "Education",
    certifications: "Licenses & Certifications",
    coreCompetencies: "Core Competencies",
    technicalSummary: "Technical Summary",
    programmingLanguages: "Programming Languages",
    technologies: "Technologies",
    toolsPlatforms: "Tools & Platforms",
    documentSuffix: "Resume",
  },
};

export function getResumeLabels(language: ResumeLanguage): ResumeLabels {
  return RESUME_LABELS[language] ?? RESUME_LABELS.pt;
}

export const RESUME_LANGUAGE_NAMES: Record<ResumeLanguage, string> = {
  pt: "Português",
  en: "English",
};
