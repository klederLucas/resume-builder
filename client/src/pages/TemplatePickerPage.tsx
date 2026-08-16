import { ArrowRight, Check, Eye, FilePlus2 } from "lucide-react";
import { useMemo, useState } from "react";
import { useLocation } from "wouter";
import { toast } from "sonner";

import { BuilderShell } from "@/components/builder/BuilderShell";
import { ResumeDocument } from "@/components/builder/ResumeDocument";
import { ScaledSheet } from "@/components/builder/ScaledSheet";
import { TemplateThumbnail } from "@/components/builder/TemplateThumbnail";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useLocale } from "@/i18n/LocaleContext";
import type { AppLocale, Messages } from "@/i18n/messages";
import { cn } from "@/lib/utils";
import { useResumeDraft } from "@/state/ResumeDraftContext";
import { RESUME_TEMPLATES } from "@/templates/registry";
import { SAMPLE_RESUME } from "@/templates/sampleResume";
import type { ResumeTemplate } from "@/templates/types";
import {
  RESUME_LANGUAGES,
  RESUME_LANGUAGE_NAMES,
  isResumeBlank,
  type ResumeLanguage,
} from "@shared/resume";

export default function TemplatePickerPage() {
  const { draft, setTemplateId, setLanguage, replaceDraft } = useResumeDraft();
  const [, navigate] = useLocation();
  const { locale, t } = useLocale();

  const language = draft.meta.language;
  const hasDraft = !isResumeBlank(draft);

  return (
    <BuilderShell title={t.picker.title} description={t.picker.description}>
      <div className="flex flex-col gap-8">
        <RadioGroup
          value={draft.meta.templateId}
          onValueChange={setTemplateId}
          className="grid gap-4 sm:grid-cols-2"
        >
          {RESUME_TEMPLATES.map(template => (
            <TemplateCard
              key={template.id}
              template={template}
              language={language}
              locale={locale}
              t={t}
              selected={template.id === draft.meta.templateId}
              onUseSample={() => {
                replaceDraft({
                  ...SAMPLE_RESUME,
                  meta: {
                    ...SAMPLE_RESUME.meta,
                    templateId: template.id,
                    language,
                  },
                });
                toast.success(t.picker.sampleLoaded);
                navigate("/editor");
              }}
            />
          ))}
        </RadioGroup>

        <section className="bg-background rounded-lg border p-4">
          <h2 className="text-sm font-semibold">
            {t.picker.resumeLanguageTitle}
          </h2>
          <p className="text-muted-foreground mt-1 text-sm">
            {t.picker.resumeLanguageDescription}
          </p>
          <RadioGroup
            value={language}
            onValueChange={value => setLanguage(value as ResumeLanguage)}
            className="mt-3 flex flex-wrap gap-2"
          >
            {RESUME_LANGUAGES.map(option => (
              <Label
                key={option}
                htmlFor={`language-${option}`}
                className={cn(
                  "flex cursor-pointer items-center gap-2 rounded-md border px-3 py-2 text-sm transition-colors",
                  option === language
                    ? "border-primary bg-primary/5"
                    : "hover:bg-accent"
                )}
              >
                <RadioGroupItem value={option} id={`language-${option}`} />
                {RESUME_LANGUAGE_NAMES[option]}
              </Label>
            ))}
          </RadioGroup>
        </section>

        <div className="flex flex-wrap items-center gap-3">
          <Button size="lg" onClick={() => navigate("/editor")}>
            {hasDraft ? t.picker.continueDraft : t.picker.start}
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
          {hasDraft && (
            <p className="text-muted-foreground text-sm">
              {t.picker.draftHint}
            </p>
          )}
        </div>
      </div>
    </BuilderShell>
  );
}

function TemplateCard({
  template,
  language,
  locale,
  t,
  selected,
  onUseSample,
}: {
  template: ResumeTemplate;
  language: ResumeLanguage;
  locale: AppLocale;
  t: Messages;
  selected: boolean;
  onUseSample: () => void;
}) {
  const [exampleOpen, setExampleOpen] = useState(false);

  const sampleResume = useMemo(
    () => ({
      ...SAMPLE_RESUME,
      meta: { ...SAMPLE_RESUME.meta, templateId: template.id, language },
    }),
    [template.id, language]
  );

  return (
    <div
      className={cn(
        "bg-background flex flex-col gap-4 rounded-lg border p-4 transition-colors",
        selected
          ? "border-primary ring-primary/20 ring-2"
          : "hover:border-primary/40"
      )}
    >
      <Label
        htmlFor={`template-${template.id}`}
        className="flex cursor-pointer flex-col items-start gap-3"
      >
        <div className="flex w-full items-start gap-3">
          <RadioGroupItem
            value={template.id}
            id={`template-${template.id}`}
            className="mt-1"
          />
          <div className="flex-1">
            <span className="flex items-center gap-2 font-semibold">
              {template.name[locale]}
              {selected && <Check className="text-primary h-4 w-4" />}
            </span>
            <span className="text-muted-foreground mt-1 block text-sm font-normal">
              {template.description[locale]}
            </span>
          </div>
        </div>

        <TemplateThumbnail template={template} language={language} />
      </Label>

      <Dialog open={exampleOpen} onOpenChange={setExampleOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" size="sm" className="self-start">
            <Eye className="mr-2 h-4 w-4" />
            {t.picker.viewExample}
          </Button>
        </DialogTrigger>
        <DialogContent className="max-h-[90vh] gap-4 overflow-y-auto sm:max-w-3xl">
          <DialogHeader>
            <DialogTitle>
              {t.picker.exampleTitle(template.name[locale])}
            </DialogTitle>
            <DialogDescription>{t.picker.exampleDescription}</DialogDescription>
          </DialogHeader>

          <ScaledSheet>
            <ResumeDocument resume={sampleResume} />
          </ScaledSheet>

          <DialogFooter className="sm:justify-start">
            <Button onClick={onUseSample}>
              <FilePlus2 className="mr-2 h-4 w-4" />
              {t.picker.useExample}
            </Button>
            <Button variant="ghost" onClick={() => setExampleOpen(false)}>
              {t.picker.close}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
