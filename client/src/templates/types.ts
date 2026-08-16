import type { ComponentType, Ref } from "react";

import type { LocalizedText } from "@/i18n/messages";
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
  /** Card copy, in every interface language. */
  name: LocalizedText;
  description: LocalizedText;
  accentColor: string;
  Component: ComponentType<ResumeTemplateProps>;
}
