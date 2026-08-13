import type { ResumeTemplate } from "@/templates/types";

import { ClassicTealTemplate } from "./ClassicTealTemplate";

export const classicTealTemplate: ResumeTemplate = {
  id: "classic-teal",
  name: "Clássico Teal",
  description:
    "Duas colunas com barra lateral escura: contato e competências à esquerda, experiência e formação à direita. Bom para currículos densos, de 1 a 3 páginas.",
  accentColor: "#124355",
  Component: ClassicTealTemplate,
};
