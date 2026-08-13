import { z } from "zod";

import {
  certificationSchema,
  educationSchema,
  profileSchema,
  type Resume,
} from "@shared/resume";

const stringItemSchema = z.object({ value: z.string() });

export const resumeFormSchema = z.object({
  profile: profileSchema,
  summary: z.string(),
  coreCompetencies: z.array(stringItemSchema),
  skills: z.object({
    programmingLanguages: z.array(stringItemSchema),
    technologies: z.array(stringItemSchema),
    toolsPlatforms: z.array(stringItemSchema),
  }),
  experience: z.array(
    z.object({
      period: z.string(),
      role: z.string(),
      company: z.string(),
      description: z.string(),
      achievements: z.array(stringItemSchema),
    })
  ),
  education: z.array(educationSchema),
  certifications: z.array(certificationSchema),
});

export type ResumeFormValues = z.infer<typeof resumeFormSchema>;
export type StringItem = z.infer<typeof stringItemSchema>;

export type StringListName =
  | "coreCompetencies"
  | "skills.programmingLanguages"
  | "skills.technologies"
  | "skills.toolsPlatforms"
  | `experience.${number}.achievements`;

const toItems = (values: string[]): StringItem[] =>
  values.map(value => ({ value }));

const fromItems = (items: StringItem[]): string[] =>
  items.map(item => item.value);

export function toFormValues(resume: Resume): ResumeFormValues {
  return {
    profile: { ...resume.profile },
    summary: resume.summary,
    coreCompetencies: toItems(resume.coreCompetencies),
    skills: {
      programmingLanguages: toItems(resume.skills.programmingLanguages),
      technologies: toItems(resume.skills.technologies),
      toolsPlatforms: toItems(resume.skills.toolsPlatforms),
    },
    experience: resume.experience.map(entry => ({
      period: entry.period,
      role: entry.role,
      company: entry.company,
      description: entry.description,
      achievements: toItems(entry.achievements),
    })),
    education: resume.education.map(entry => ({ ...entry })),
    certifications: resume.certifications.map(entry => ({ ...entry })),
  };
}

export function fromFormValues(
  values: ResumeFormValues,
  previous: Resume
): Resume {
  return {
    meta: previous.meta,
    profile: { ...values.profile },
    summary: values.summary,
    coreCompetencies: fromItems(values.coreCompetencies),
    skills: {
      programmingLanguages: fromItems(values.skills.programmingLanguages),
      technologies: fromItems(values.skills.technologies),
      toolsPlatforms: fromItems(values.skills.toolsPlatforms),
    },
    experience: values.experience.map(entry => ({
      period: entry.period,
      role: entry.role,
      company: entry.company,
      description: entry.description,
      achievements: fromItems(entry.achievements),
    })),
    education: values.education.map(entry => ({ ...entry })),
    certifications: values.certifications.map(entry => ({ ...entry })),
  };
}
