import { normalizeResume, type Resume } from "@shared/resume";

const STORAGE_KEY = "rb:draft:v1";
const ENVELOPE_VERSION = 1;

export interface StoredDraft {
  resume: Resume;
  savedAt: number;
}

export function loadDraft(fallbackTemplateId: string): StoredDraft | null {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;

    const envelope = JSON.parse(raw) as {
      version?: number;
      savedAt?: number;
      resume?: unknown;
    };

    const resume = normalizeResume(envelope.resume, {
      templateId: fallbackTemplateId,
    });

    return {
      resume,
      savedAt:
        typeof envelope.savedAt === "number" ? envelope.savedAt : Date.now(),
    };
  } catch {
    return null;
  }
}

export function saveDraft(resume: Resume): number | null {
  const savedAt = Date.now();
  try {
    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ version: ENVELOPE_VERSION, savedAt, resume })
    );
    return savedAt;
  } catch {
    return null;
  }
}

export function clearDraft(): void {
  try {
    window.localStorage.removeItem(STORAGE_KEY);
  } catch {
    return;
  }
}
