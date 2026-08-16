import { ArrowLeft, Printer } from "lucide-react";
import { useEffect, useRef } from "react";
import { useReactToPrint } from "react-to-print";
import { Link, Redirect } from "wouter";
import { toast } from "sonner";

import { BuilderShell } from "@/components/builder/BuilderShell";
import { ResumeDocument } from "@/components/builder/ResumeDocument";
import { ScaledSheet } from "@/components/builder/ScaledSheet";
import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
import { useMessages } from "@/i18n/LocaleContext";
import { buildDocumentTitle } from "@/lib/resumeFile";
import { useResumeDraft } from "@/state/ResumeDraftContext";
import {
  isResumeComplete,
  RESUME_LANGUAGES,
  RESUME_LANGUAGE_NAMES,
} from "@shared/resume";

export default function PreviewPage() {
  const { draft, setLanguage } = useResumeDraft();
  const contentRef = useRef<HTMLDivElement>(null);
  const t = useMessages();
  const isComplete = isResumeComplete(draft);

  const handlePrint = useReactToPrint({
    contentRef,
    documentTitle: buildDocumentTitle(draft),
  });

  useEffect(() => {
    if (!isComplete) {
      toast.error(t.preview.incomplete);
    }
  }, [isComplete, t]);

  if (!isComplete) return <Redirect to="/editor" />;

  return (
    <BuilderShell
      wide
      title={t.preview.title}
      description={t.preview.description}
      actions={
        <>
          <ButtonGroup aria-label={t.preview.resumeLanguageLabel}>
            {RESUME_LANGUAGES.map(option => (
              <Button
                key={option}
                size="sm"
                variant={option === draft.meta.language ? "default" : "outline"}
                aria-pressed={option === draft.meta.language}
                onClick={() => setLanguage(option)}
              >
                {RESUME_LANGUAGE_NAMES[option]}
              </Button>
            ))}
          </ButtonGroup>

          <Button variant="outline" asChild>
            <Link href="/editor">
              <ArrowLeft className="mr-2 h-4 w-4" />
              {t.preview.back}
            </Link>
          </Button>
          <Button onClick={() => handlePrint()}>
            <Printer className="mr-2 h-4 w-4" />
            {t.preview.print}
          </Button>
        </>
      }
    >
      <div className="pb-12 print:pb-0">
        <ScaledSheet>
          <div className="shadow-2xl print:shadow-none">
            <ResumeDocument resume={draft} ref={contentRef} />
          </div>
        </ScaledSheet>
      </div>
    </BuilderShell>
  );
}
