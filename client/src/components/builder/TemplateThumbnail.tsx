import { A4_HEIGHT_PX, A4_WIDTH_PX } from "@/lib/paper";
import { SAMPLE_RESUME_VIEW } from "@/templates/sampleResume";
import type { ResumeTemplate } from "@/templates/types";
import { getResumeLabels, type ResumeLanguage } from "@shared/resume";

interface TemplateThumbnailProps {
  template: ResumeTemplate;
  language: ResumeLanguage;
  width?: number;
}

export function TemplateThumbnail({
  template,
  language,
  width = 280,
}: TemplateThumbnailProps) {
  const scale = width / A4_WIDTH_PX;
  const labels = getResumeLabels(language);

  return (
    <div
      aria-hidden
      className="no-print pointer-events-none relative overflow-hidden rounded-md border bg-white select-none"
      style={{ width, height: A4_HEIGHT_PX * scale }}
    >
      <div
        className="absolute top-0 left-0 origin-top-left"
        style={{
          width: A4_WIDTH_PX,
          height: A4_HEIGHT_PX,
          transform: `scale(${scale})`,
        }}
      >
        <template.Component
          view={SAMPLE_RESUME_VIEW}
          labels={labels}
          mode="thumbnail"
        />
      </div>
    </div>
  );
}
