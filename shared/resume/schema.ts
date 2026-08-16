import { z } from "zod";

import { RESUME_LANGUAGES } from "./labels";

export const RESUME_SCHEMA_VERSION = 1;

const emailFormat = z.email();

/**
 * The only user-facing copy in the shared layer. It is injected rather than
 * hard-coded so the editor can raise the errors in the interface language,
 * which is independent from the document language.
 */
export interface ProfileValidationMessages {
  name: string;
  title: string;
  location: string;
  phone: string;
  email: string;
  emailInvalid: string;
}

export const DEFAULT_PROFILE_MESSAGES: ProfileValidationMessages = {
  name: "Informe seu nome completo.",
  title: "Informe seu cargo ou área de atuação.",
  location: "Informe sua cidade e estado.",
  phone: "Informe um telefone para contato.",
  email: "Informe um e-mail para contato.",
  emailInvalid: "E-mail inválido.",
};

export function createProfileSchema(
  messages: ProfileValidationMessages = DEFAULT_PROFILE_MESSAGES
) {
  return z.object({
    name: z.string().trim().min(1, messages.name),
    title: z.string().trim().min(1, messages.title),
    location: z.string().trim().min(1, messages.location),
    phone: z.string().trim().min(1, messages.phone),
    email: z
      .string()
      .trim()
      .min(1, messages.email)
      .refine(
        value => emailFormat.safeParse(value).success,
        messages.emailInvalid
      ),
  });
}

export const profileSchema = createProfileSchema();

export const experienceSchema = z.object({
  period: z.string(),
  role: z.string(),
  company: z.string(),
  description: z.string(),
  achievements: z.array(z.string()),
});

export const educationSchema = z.object({
  degree: z.string(),
  institution: z.string(),
});

export const certificationSchema = z.object({
  name: z.string(),
  issuer: z.string(),
});

export const skillsSchema = z.object({
  programmingLanguages: z.array(z.string()),
  technologies: z.array(z.string()),
  toolsPlatforms: z.array(z.string()),
});

export const resumeSchema = z.object({
  meta: z.object({
    version: z.literal(RESUME_SCHEMA_VERSION),
    templateId: z.string().min(1),
    language: z.enum(RESUME_LANGUAGES),
  }),
  profile: profileSchema,
  summary: z.string(),
  coreCompetencies: z.array(z.string()),
  skills: skillsSchema,
  experience: z.array(experienceSchema),
  education: z.array(educationSchema),
  certifications: z.array(certificationSchema),
});

export type Resume = z.infer<typeof resumeSchema>;
export type ResumeProfile = z.infer<typeof profileSchema>;
export type ResumeExperience = z.infer<typeof experienceSchema>;
export type ResumeEducation = z.infer<typeof educationSchema>;
export type ResumeCertification = z.infer<typeof certificationSchema>;
export type ResumeSkills = z.infer<typeof skillsSchema>;

export function isResumeComplete(resume: Resume): boolean {
  return resumeSchema.safeParse(resume).success;
}
