import { Check } from "lucide-react";
import { Link, useLocation } from "wouter";

import { useMessages } from "@/i18n/LocaleContext";
import { cn } from "@/lib/utils";
import { useResumeDraft } from "@/state/ResumeDraftContext";
import { isResumeComplete } from "@shared/resume";

export const BUILDER_STEPS = [
  { path: "/", key: "style" },
  { path: "/editor", key: "data" },
  { path: "/preview", key: "preview" },
] as const;

export function StepNav() {
  const [location] = useLocation();
  const { draft } = useResumeDraft();
  const t = useMessages();
  const canPreview = isResumeComplete(draft);

  const currentIndex = BUILDER_STEPS.findIndex(step => step.path === location);

  return (
    <nav aria-label={t.steps.navLabel} className="no-print">
      <ol className="flex flex-wrap items-center gap-1 sm:gap-2">
        {BUILDER_STEPS.map((step, index) => {
          const isCurrent = index === currentIndex;
          const isDone = currentIndex > index;
          const isLocked = step.path === "/preview" && !canPreview;

          const content = (
            <>
              <span
                className={cn(
                  "flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full border text-xs font-semibold",
                  isCurrent &&
                    "border-primary bg-primary text-primary-foreground",
                  isDone &&
                    !isCurrent &&
                    "border-primary/40 bg-primary/10 text-primary",
                  !isCurrent && !isDone && "border-border text-muted-foreground"
                )}
              >
                {isDone ? <Check className="h-3.5 w-3.5" /> : index + 1}
              </span>
              <span className="text-sm font-medium">{t.steps[step.key]}</span>
            </>
          );

          const className = cn(
            "flex items-center gap-2 rounded-md px-2 py-1.5 transition-colors",
            isCurrent ? "text-foreground" : "text-muted-foreground",
            isLocked
              ? "pointer-events-none opacity-50"
              : "hover:bg-accent hover:text-foreground"
          );

          return (
            <li key={step.path} className="flex items-center gap-1 sm:gap-2">
              {isLocked ? (
                <span
                  className={className}
                  aria-disabled="true"
                  title={t.steps.lockedHint}
                >
                  {content}
                </span>
              ) : (
                <Link
                  href={step.path}
                  className={className}
                  aria-current={isCurrent ? "step" : undefined}
                >
                  {content}
                </Link>
              )}

              {index < BUILDER_STEPS.length - 1 && (
                <span aria-hidden className="h-px w-4 bg-border sm:w-8" />
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
