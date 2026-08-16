import { createEmptyResume } from "./empty";
import { RESUME_LANGUAGES } from "./labels";
import type { ResumeLanguage } from "./labels";
import type {
  Resume,
  ResumeCertification,
  ResumeEducation,
  ResumeExperience,
} from "./schema";

/** Stable identifier so the UI can show the failure in its own language. */
export type ResumeImportErrorCode = "not-json" | "not-object" | "not-resume";

export class ResumeImportError extends Error {
  readonly code: ResumeImportErrorCode;

  constructor(code: ResumeImportErrorCode, message: string) {
    super(message);
    this.name = "ResumeImportError";
    this.code = code;
  }
}

export interface NormalizeOptions {
  templateId: string;
  language?: ResumeLanguage;
}

type UnknownRecord = Record<string, unknown>;

function asRecord(value: unknown): UnknownRecord | null {
  return typeof value === "object" && value !== null && !Array.isArray(value)
    ? (value as UnknownRecord)
    : null;
}

function asText(value: unknown): string {
  if (typeof value === "string") return value;
  if (typeof value === "number") return String(value);
  return "";
}

function asList(value: unknown): unknown[] {
  if (Array.isArray(value)) return value;
  const record = asRecord(value);
  if (!record) return [];
  if (record.visible === false) return [];
  return Array.isArray(record.items) ? record.items : [];
}

function asNameList(value: unknown): string[] {
  return asList(value)
    .map(item => {
      if (typeof item === "string") return item;
      const record = asRecord(item);
      return record ? asText(record.name ?? record.value ?? record.label) : "";
    })
    .filter(name => name.trim().length > 0);
}

function firstDefined(record: UnknownRecord, ...keys: string[]): unknown {
  for (const key of keys) {
    if (record[key] !== undefined) return record[key];
  }
  return undefined;
}

function toExperience(value: unknown): ResumeExperience | null {
  const record = asRecord(value);
  if (!record) return null;
  return {
    period: asText(firstDefined(record, "period", "date")),
    role: asText(firstDefined(record, "role", "title", "position")),
    company: asText(firstDefined(record, "company", "employer")),
    description: asText(record.description),
    achievements: asNameList(record.achievements),
  };
}

function toEducation(value: unknown): ResumeEducation | null {
  const record = asRecord(value);
  if (!record) return null;
  return {
    degree: asText(firstDefined(record, "degree", "course", "title")),
    institution: asText(firstDefined(record, "institution", "school")),
  };
}

function toCertification(value: unknown): ResumeCertification | null {
  const record = asRecord(value);
  if (!record) return null;
  return {
    name: asText(firstDefined(record, "name", "title")),
    issuer: asText(firstDefined(record, "issuer", "organization")),
  };
}

function isNonEmpty<T>(value: T | null): value is T {
  return value !== null;
}

const KNOWN_TOP_LEVEL_KEYS = [
  "profile",
  "sidebar",
  "mainContent",
  "summary",
  "experience",
  "workExperience",
  "education",
  "coreCompetencies",
  "skills",
  "technicalSummary",
  "certifications",
  "licensesCertifications",
  "meta",
];

export function normalizeResume(
  input: unknown,
  options: NormalizeOptions
): Resume {
  const root = asRecord(input);
  if (!root) {
    throw new ResumeImportError(
      "not-object",
      "O arquivo não contém um objeto JSON válido."
    );
  }

  const looksLikeResume = KNOWN_TOP_LEVEL_KEYS.some(
    key => root[key] !== undefined
  );
  if (!looksLikeResume) {
    throw new ResumeImportError(
      "not-resume",
      "O arquivo não parece ser um currículo exportado por este app."
    );
  }

  const sidebar = asRecord(root.sidebar) ?? {};
  const mainContent = asRecord(root.mainContent) ?? {};
  const meta = asRecord(root.meta) ?? {};

  const profileSource =
    asRecord(root.profile) ?? asRecord(sidebar.profile) ?? {};

  const skillsSource =
    asRecord(root.skills) ??
    asRecord(sidebar.technicalSummary) ??
    asRecord(root.technicalSummary) ??
    {};

  const language = RESUME_LANGUAGES.includes(meta.language as ResumeLanguage)
    ? (meta.language as ResumeLanguage)
    : (options.language ?? "pt");

  const templateId =
    typeof meta.templateId === "string" && meta.templateId.trim().length > 0
      ? meta.templateId
      : options.templateId;

  const resume = createEmptyResume(templateId, language);

  resume.profile = {
    name: asText(profileSource.name),
    title: asText(firstDefined(profileSource, "title", "role")),
    location: asText(firstDefined(profileSource, "location", "address")),
    phone: asText(profileSource.phone),
    email: asText(profileSource.email),
  };

  resume.summary = asText(firstDefined(root, "summary") ?? mainContent.summary);

  resume.coreCompetencies = asNameList(
    firstDefined(root, "coreCompetencies") ?? sidebar.coreCompetencies
  );

  resume.skills = {
    programmingLanguages: asNameList(skillsSource.programmingLanguages),
    technologies: asNameList(skillsSource.technologies),
    toolsPlatforms: asNameList(
      firstDefined(skillsSource, "toolsPlatforms", "tools")
    ),
  };

  resume.experience = asList(
    firstDefined(root, "experience", "workExperience") ??
      mainContent.workExperience ??
      mainContent.experience
  )
    .map(toExperience)
    .filter(isNonEmpty);

  resume.education = asList(
    firstDefined(root, "education") ?? mainContent.education
  )
    .map(toEducation)
    .filter(isNonEmpty);

  resume.certifications = asList(
    firstDefined(root, "certifications", "licensesCertifications") ??
      mainContent.licensesCertifications ??
      mainContent.certifications
  )
    .map(toCertification)
    .filter(isNonEmpty);

  return resume;
}

export function parseResumeFile(
  text: string,
  options: NormalizeOptions
): Resume {
  let parsed: unknown;
  try {
    parsed = JSON.parse(text);
  } catch {
    throw new ResumeImportError("not-json", "O arquivo não é um JSON válido.");
  }
  return normalizeResume(parsed, options);
}
