import type { ResumeTemplate } from "@/templates/types";

import { ClassicTealTemplate } from "./ClassicTealTemplate";

export const classicTealTemplate: ResumeTemplate = {
  id: "classic-teal",
  name: {
    pt: "Clássico Teal",
    en: "Classic Teal",
  },
  description: {
    pt: "Duas colunas com barra lateral escura: contato e competências à esquerda, experiência e formação à direita. Bom para currículos densos, de 1 a 3 páginas.",
    en: "Two columns with a dark sidebar: contact and competencies on the left, experience and education on the right. Good for dense resumes, 1 to 3 pages.",
  },
  accentColor: "#124355",
  Component: ClassicTealTemplate,
};
