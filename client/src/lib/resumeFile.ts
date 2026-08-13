import { getResumeLabels, parseResumeFile, type Resume } from "@shared/resume";

function slugifyName(name: string): string {
  const cleaned = name
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^\w\s-]/g, "")
    .trim()
    .replace(/\s+/g, "_");
  return cleaned;
}

export function buildDocumentTitle(resume: Resume): string {
  const labels = getResumeLabels(resume.meta.language);
  const name = slugifyName(resume.profile.name);
  return name.length > 0
    ? `${name}_${labels.documentSuffix}`
    : labels.documentSuffix;
}

export function downloadResumeJson(resume: Resume): void {
  const blob = new Blob([JSON.stringify(resume, null, 2)], {
    type: "application/json",
  });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `${buildDocumentTitle(resume)}.json`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

export async function readResumeFile(
  file: File,
  fallbackTemplateId: string
): Promise<Resume> {
  const text = await file.text();
  return parseResumeFile(text, { templateId: fallbackTemplateId });
}
