import { RESUME_SCHEMA_VERSION } from "./schema";
import type {
  Resume,
  ResumeCertification,
  ResumeEducation,
  ResumeExperience,
} from "./schema";
import type { ResumeLanguage } from "./labels";

export function createEmptyExperience(): ResumeExperience {
  return {
    period: "",
    role: "",
    company: "",
    description: "",
    achievements: [],
  };
}

export function createEmptyEducation(): ResumeEducation {
  return { degree: "", institution: "" };
}

export function createEmptyCertification(): ResumeCertification {
  return { name: "", issuer: "" };
}

export function createEmptyResume(
  templateId: string,
  language: ResumeLanguage = "pt"
): Resume {
  return {
    meta: { version: RESUME_SCHEMA_VERSION, templateId, language },
    profile: { name: "", title: "", location: "", phone: "", email: "" },
    summary: "",
    coreCompetencies: [],
    skills: {
      programmingLanguages: [],
      technologies: [],
      toolsPlatforms: [],
    },
    experience: [],
    education: [],
    certifications: [],
  };
}
