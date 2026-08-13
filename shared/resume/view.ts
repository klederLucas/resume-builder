import { SKILL_GROUP_KEYS } from "./labels";
import type { SkillGroupKey } from "./labels";
import type { Resume } from "./schema";

export type ContactKind = "location" | "phone" | "email";

export interface ResumeContact {
  kind: ContactKind;
  value: string;
}

export interface ResumeSkillGroupView {
  key: SkillGroupKey;
  items: string[];
}

export interface ResumeExperienceView {
  period: string;
  role: string;
  company: string;
  description: string;
  achievements: string[];
}

export interface ResumeEducationView {
  degree: string;
  institution: string;
}

export interface ResumeCertificationView {
  name: string;
  issuer: string;
}

export interface ResumeView {
  profile: {
    name: string;
    nameLines: string[];
    title: string;
    contacts: ResumeContact[];
  };
  summary: string;
  coreCompetencies: string[];
  skillGroups: ResumeSkillGroupView[];
  experience: ResumeExperienceView[];
  education: ResumeEducationView[];
  certifications: ResumeCertificationView[];
}

function hasText(value: string | undefined): boolean {
  return typeof value === "string" && value.trim().length > 0;
}

function compactStrings(values: string[]): string[] {
  return values.map(value => value.trim()).filter(value => value.length > 0);
}

function splitNameLines(name: string): string[] {
  const words = name.trim().split(/\s+/).filter(Boolean);
  if (words.length === 0) return [];
  if (words.length === 1) return words;
  return [words[0], words.slice(1).join(" ")];
}

export function selectResumeView(resume: Resume): ResumeView {
  const { profile } = resume;

  const contacts: ResumeContact[] = (
    [
      { kind: "location", value: profile.location },
      { kind: "phone", value: profile.phone },
      { kind: "email", value: profile.email },
    ] as const
  )
    .filter(contact => hasText(contact.value))
    .map(contact => ({ kind: contact.kind, value: contact.value.trim() }));

  const skillGroups = SKILL_GROUP_KEYS.map(key => ({
    key,
    items: compactStrings(resume.skills[key]),
  })).filter(group => group.items.length > 0);

  return {
    profile: {
      name: profile.name.trim(),
      nameLines: splitNameLines(profile.name),
      title: profile.title.trim(),
      contacts,
    },
    summary: resume.summary.trim(),
    coreCompetencies: compactStrings(resume.coreCompetencies),
    skillGroups,
    experience: resume.experience
      .filter(
        entry =>
          hasText(entry.role) ||
          hasText(entry.company) ||
          hasText(entry.description)
      )
      .map(entry => ({
        period: entry.period.trim(),
        role: entry.role.trim(),
        company: entry.company.trim(),
        description: entry.description.trim(),
        achievements: compactStrings(entry.achievements),
      })),
    education: resume.education
      .filter(entry => hasText(entry.degree) || hasText(entry.institution))
      .map(entry => ({
        degree: entry.degree.trim(),
        institution: entry.institution.trim(),
      })),
    certifications: resume.certifications
      .filter(entry => hasText(entry.name) || hasText(entry.issuer))
      .map(entry => ({
        name: entry.name.trim(),
        issuer: entry.issuer.trim(),
      })),
  };
}

export function isResumeBlank(resume: Resume): boolean {
  const view = selectResumeView(resume);
  return (
    !hasText(view.profile.name) &&
    !hasText(view.profile.title) &&
    view.profile.contacts.length === 0 &&
    !hasText(view.summary) &&
    view.coreCompetencies.length === 0 &&
    view.skillGroups.length === 0 &&
    view.experience.length === 0 &&
    view.education.length === 0 &&
    view.certifications.length === 0
  );
}
