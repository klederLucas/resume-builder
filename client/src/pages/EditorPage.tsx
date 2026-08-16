import { zodResolver } from "@hookform/resolvers/zod";
import {
  ArrowRight,
  Check,
  Download,
  Sparkles,
  Trash2,
  Upload,
} from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { useLocation } from "wouter";
import { toast } from "sonner";

import { BuilderShell } from "@/components/builder/BuilderShell";
import { ExperienceFields } from "@/components/builder/form/ExperienceFields";
import { ProfileFields } from "@/components/builder/form/ProfileFields";
import {
  CertificationFields,
  EducationFields,
} from "@/components/builder/form/SimpleListFields";
import { FormTextField } from "@/components/builder/form/FormTextField";
import { StringListField } from "@/components/builder/form/StringListField";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { FieldGroup } from "@/components/ui/field";
import { Spinner } from "@/components/ui/spinner";
import { useMessages } from "@/i18n/LocaleContext";
import type { Messages } from "@/i18n/messages";
import { downloadResumeJson, readResumeFile } from "@/lib/resumeFile";
import {
  createResumeFormSchema,
  fromFormValues,
  toFormValues,
  type ResumeFormValues,
} from "@/lib/resumeForm";
import { useResumeDraft } from "@/state/ResumeDraftContext";
import { DEFAULT_TEMPLATE_ID } from "@/templates/registry";
import { SAMPLE_RESUME } from "@/templates/sampleResume";
import {
  createEmptyResume,
  ResumeImportError,
  type Resume,
} from "@shared/resume";

const AUTOSAVE_DEBOUNCE_MS = 300;

export default function EditorPage() {
  const { draft, setDraft, replaceDraft, resetDraft, savedAt, isSaving } =
    useResumeDraft();
  const [, navigate] = useLocation();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const t = useMessages();

  // Rebuilt on a language switch so the required-field errors are raised in
  // the interface language. `useForm` re-reads its options on every render.
  const schema = useMemo(() => createResumeFormSchema(t.validation), [t]);

  const form = useForm<ResumeFormValues>({
    resolver: zodResolver(schema),
    defaultValues: toFormValues(draft),
    mode: "onBlur",
    reValidateMode: "onChange",
  });

  const draftRef = useRef(draft);
  draftRef.current = draft;

  useEffect(() => {
    let timer = 0;
    const subscription = form.watch(() => {
      window.clearTimeout(timer);
      timer = window.setTimeout(() => {
        setDraft(fromFormValues(form.getValues(), draftRef.current));
      }, AUTOSAVE_DEBOUNCE_MS);
    });

    return () => {
      window.clearTimeout(timer);
      subscription.unsubscribe();
    };
  }, [form, setDraft]);

  const loadResume = (resume: Resume) => {
    replaceDraft(resume);
    form.reset(toFormValues(resume));
  };

  const handleImport = async (file: File) => {
    try {
      const resume = await readResumeFile(file, DEFAULT_TEMPLATE_ID);
      loadResume(resume);
      toast.success(t.editor.imported);
    } catch (error) {
      toast.error(
        error instanceof ResumeImportError
          ? t.importError[error.code]
          : t.importError.unknown
      );
    }
  };

  const onSubmit = form.handleSubmit(
    values => {
      setDraft(fromFormValues(values, draftRef.current));
      navigate("/preview");
    },
    () => {
      toast.error(t.editor.invalidForm);
    }
  );

  return (
    <BuilderShell
      title={t.editor.title}
      description={t.editor.description}
      actions={
        <>
          <SaveIndicator savedAt={savedAt} isSaving={isSaving} t={t} />

          <input
            ref={fileInputRef}
            type="file"
            accept="application/json,.json"
            className="hidden"
            onChange={event => {
              const file = event.target.files?.[0];
              if (file) void handleImport(file);
              event.target.value = "";
            }}
          />

          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => fileInputRef.current?.click()}
          >
            <Upload className="mr-1.5 h-4 w-4" />
            {t.editor.import}
          </Button>

          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => downloadResumeJson(draft)}
          >
            <Download className="mr-1.5 h-4 w-4" />
            {t.editor.export}
          </Button>

          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => {
              loadResume({
                ...SAMPLE_RESUME,
                meta: { ...SAMPLE_RESUME.meta, ...draft.meta },
              });
              toast.success(t.editor.exampleLoaded);
            }}
          >
            <Sparkles className="mr-1.5 h-4 w-4" />
            {t.editor.example}
          </Button>

          <ClearDraftButton
            t={t}
            onConfirm={() => {
              resetDraft();
              form.reset(
                toFormValues(
                  createEmptyResume(draft.meta.templateId, draft.meta.language)
                )
              );
              toast.success(t.editor.draftCleared);
            }}
          />
        </>
      }
    >
      <FormProvider {...form}>
        <form onSubmit={onSubmit} className="flex flex-col gap-6">
          <section className="bg-background rounded-lg border p-4 sm:p-6">
            <h2 className="mb-1 text-lg font-semibold">
              {t.editor.identification}
            </h2>
            <p className="text-muted-foreground mb-4 text-sm">
              {t.editor.identificationHint}
            </p>
            <ProfileFields />
          </section>

          <Accordion
            type="multiple"
            defaultValue={["summary", "experience"]}
            className="bg-background rounded-lg border px-4 sm:px-6"
          >
            <AccordionItem value="summary">
              <AccordionTrigger>{t.editor.sections.summary}</AccordionTrigger>
              <AccordionContent>
                <FormTextField
                  multiline
                  rows={6}
                  name="summary"
                  label={t.form.summary.label}
                  placeholder={t.form.summary.placeholder}
                  description={t.form.summary.description}
                />
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="competencies">
              <AccordionTrigger>
                {t.editor.sections.competencies}
              </AccordionTrigger>
              <AccordionContent>
                <StringListField
                  name="coreCompetencies"
                  label={t.form.competencies.label}
                  description={t.form.competencies.description}
                  placeholder={t.form.competencies.placeholder}
                  addLabel={t.form.competencies.add}
                />
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="skills">
              <AccordionTrigger>{t.editor.sections.skills}</AccordionTrigger>
              <AccordionContent>
                <FieldGroup className="gap-6">
                  <StringListField
                    name="skills.programmingLanguages"
                    label={t.form.programmingLanguages.label}
                    placeholder={t.form.programmingLanguages.placeholder}
                    addLabel={t.form.programmingLanguages.add}
                  />
                  <StringListField
                    name="skills.technologies"
                    label={t.form.technologies.label}
                    placeholder={t.form.technologies.placeholder}
                    addLabel={t.form.technologies.add}
                  />
                  <StringListField
                    name="skills.toolsPlatforms"
                    label={t.form.toolsPlatforms.label}
                    placeholder={t.form.toolsPlatforms.placeholder}
                    addLabel={t.form.toolsPlatforms.add}
                  />
                </FieldGroup>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="experience">
              <AccordionTrigger>
                {t.editor.sections.experience}
              </AccordionTrigger>
              <AccordionContent>
                <ExperienceFields />
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="education">
              <AccordionTrigger>{t.editor.sections.education}</AccordionTrigger>
              <AccordionContent>
                <EducationFields />
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="certifications" className="border-b-0">
              <AccordionTrigger>
                {t.editor.sections.certifications}
              </AccordionTrigger>
              <AccordionContent>
                <CertificationFields />
              </AccordionContent>
            </AccordionItem>
          </Accordion>

          <div className="flex justify-end pb-8">
            <Button type="submit" size="lg">
              {t.editor.submit}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </form>
      </FormProvider>
    </BuilderShell>
  );
}

function SaveIndicator({
  savedAt,
  isSaving,
  t,
}: {
  savedAt: number | null;
  isSaving: boolean;
  t: Messages;
}) {
  const [, forceTick] = useState(0);

  useEffect(() => {
    const id = window.setInterval(() => forceTick(n => n + 1), 30_000);
    return () => window.clearInterval(id);
  }, []);

  return (
    <span
      aria-live="polite"
      className="text-muted-foreground flex w-44 shrink-0 items-center gap-1.5 truncate text-xs"
    >
      {isSaving ? (
        <>
          <Spinner />
          {t.editor.saving}
        </>
      ) : savedAt !== null ? (
        <>
          <Check className="h-3.5 w-3.5 shrink-0" />
          {formatSavedAt(savedAt, t)}
        </>
      ) : null}
    </span>
  );
}

function formatSavedAt(savedAt: number, t: Messages): string {
  const seconds = Math.round((Date.now() - savedAt) / 1000);
  if (seconds < 60) return t.editor.savedNow;
  const minutes = Math.round(seconds / 60);
  if (minutes < 60) return t.editor.savedMinutesAgo(minutes);
  return t.editor.savedHoursAgo(Math.round(minutes / 60));
}

function ClearDraftButton({
  t,
  onConfirm,
}: {
  t: Messages;
  onConfirm: () => void;
}) {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button type="button" variant="ghost" size="sm">
          <Trash2 className="mr-1.5 h-4 w-4" />
          {t.editor.clear}
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{t.editor.clearDialog.title}</AlertDialogTitle>
          <AlertDialogDescription>
            {t.editor.clearDialog.description}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>{t.editor.clearDialog.cancel}</AlertDialogCancel>
          <AlertDialogAction onClick={onConfirm}>
            {t.editor.clearDialog.confirm}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
