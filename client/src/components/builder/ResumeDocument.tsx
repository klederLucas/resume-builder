import { useMemo, type Ref } from "react";

import { getTemplate } from "@/templates/registry";
import type { ResumeTemplateMode } from "@/templates/types";
import { getResumeLabels, selectResumeView, type Resume } from "@shared/resume";

interface ResumeDocumentProps {
  resume: Resume;
  mode?: ResumeTemplateMode;
  ref?: Ref<HTMLDivElement>;
}

export function ResumeDocument({
  resume,
  mode = "print",
  ref,
}: ResumeDocumentProps) {
  const template = getTemplate(resume.meta.templateId);
  const view = useMemo(() => selectResumeView(resume), [resume]);
  const labels = getResumeLabels(resume.meta.language);

  return (
    <template.Component view={view} labels={labels} mode={mode} ref={ref} />
  );
}
