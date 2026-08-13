import { classicTealTemplate } from "./classic-teal";
import type { ResumeTemplate } from "./types";

export const RESUME_TEMPLATES: readonly ResumeTemplate[] = [
  classicTealTemplate,
];

export const DEFAULT_TEMPLATE_ID = classicTealTemplate.id;

export function getTemplate(id: string | undefined): ResumeTemplate {
  return (
    RESUME_TEMPLATES.find(template => template.id === id) ?? classicTealTemplate
  );
}
