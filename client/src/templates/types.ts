import type { ComponentType, Ref } from "react";

import type { ResumeLabels, ResumeView } from "@shared/resume";

export type ResumeTemplateMode = "print" | "thumbnail";

export interface ResumeTemplateProps {
  view: ResumeView;
  labels: ResumeLabels;
  mode?: ResumeTemplateMode;
  ref?: Ref<HTMLDivElement>;
}

export interface ResumeTemplate {
  id: string;
  name: string;
  description: string;
  accentColor: string;
  Component: ComponentType<ResumeTemplateProps>;
}
