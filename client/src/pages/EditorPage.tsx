import { zodResolver } from "@hookform/resolvers/zod";
import {
  ArrowRight,
  Check,
  Download,
  Sparkles,
  Trash2,
  Upload,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
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
import { downloadResumeJson, readResumeFile } from "@/lib/resumeFile";
import {
  fromFormValues,
  resumeFormSchema,
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

  const form = useForm<ResumeFormValues>({
    resolver: zodResolver(resumeFormSchema),
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
      toast.success("Currículo importado.");
    } catch (error) {
      toast.error(
        error instanceof ResumeImportError
          ? error.message
          : "Não foi possível ler o arquivo."
      );
    }
  };

  const onSubmit = form.handleSubmit(
    values => {
      setDraft(fromFormValues(values, draftRef.current));
      navigate("/preview");
    },
    () => {
      toast.error("Revise os campos obrigatórios destacados.");
    }
  );

  return (
    <BuilderShell
      title="Seus dados"
      description="Só nome, cargo, localização, telefone e e-mail são obrigatórios. As demais seções aparecem no currículo apenas se você preenchê-las."
      actions={
        <>
          <SaveIndicator savedAt={savedAt} isSaving={isSaving} />

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
            Importar
          </Button>

          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => downloadResumeJson(draft)}
          >
            <Download className="mr-1.5 h-4 w-4" />
            Exportar
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
              toast.success("Dados de exemplo carregados.");
            }}
          >
            <Sparkles className="mr-1.5 h-4 w-4" />
            Exemplo
          </Button>

          <ClearDraftButton
            onConfirm={() => {
              resetDraft();
              form.reset(
                toFormValues(
                  createEmptyResume(draft.meta.templateId, draft.meta.language)
                )
              );
              toast.success("Rascunho limpo.");
            }}
          />
        </>
      }
    >
      <FormProvider {...form}>
        <form onSubmit={onSubmit} className="flex flex-col gap-6">
          <section className="bg-background rounded-lg border p-4 sm:p-6">
            <h2 className="mb-1 text-lg font-semibold">Identificação</h2>
            <p className="text-muted-foreground mb-4 text-sm">
              Campos obrigatórios.
            </p>
            <ProfileFields />
          </section>

          <Accordion
            type="multiple"
            defaultValue={["summary", "experience"]}
            className="bg-background rounded-lg border px-4 sm:px-6"
          >
            <AccordionItem value="summary">
              <AccordionTrigger>Sumário</AccordionTrigger>
              <AccordionContent>
                <FormTextField
                  multiline
                  rows={6}
                  name="summary"
                  label="Sumário profissional"
                  placeholder="Um parágrafo sobre sua atuação, especialidade e o que você procura."
                  description="Aparece no topo da coluna principal."
                />
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="competencies">
              <AccordionTrigger>Principais competências</AccordionTrigger>
              <AccordionContent>
                <StringListField
                  name="coreCompetencies"
                  label="Competências"
                  description="Itens curtos, listados na barra lateral. Enter adiciona a próxima."
                  placeholder="Desenvolvimento Back-End"
                  addLabel="Adicionar competência"
                />
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="skills">
              <AccordionTrigger>Resumo técnico</AccordionTrigger>
              <AccordionContent>
                <FieldGroup className="gap-6">
                  <StringListField
                    name="skills.programmingLanguages"
                    label="Linguagens de programação"
                    placeholder="TypeScript"
                    addLabel="Adicionar linguagem"
                  />
                  <StringListField
                    name="skills.technologies"
                    label="Tecnologias"
                    placeholder="Node.js"
                    addLabel="Adicionar tecnologia"
                  />
                  <StringListField
                    name="skills.toolsPlatforms"
                    label="Ferramentas e plataformas"
                    placeholder="Docker"
                    addLabel="Adicionar ferramenta"
                  />
                </FieldGroup>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="experience">
              <AccordionTrigger>Experiência profissional</AccordionTrigger>
              <AccordionContent>
                <ExperienceFields />
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="education">
              <AccordionTrigger>Formação acadêmica</AccordionTrigger>
              <AccordionContent>
                <EducationFields />
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="certifications" className="border-b-0">
              <AccordionTrigger>Licenças e certificações</AccordionTrigger>
              <AccordionContent>
                <CertificationFields />
              </AccordionContent>
            </AccordionItem>
          </Accordion>

          <div className="flex justify-end pb-8">
            <Button type="submit" size="lg">
              Visualizar currículo
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
}: {
  savedAt: number | null;
  isSaving: boolean;
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
          Salvando…
        </>
      ) : savedAt !== null ? (
        <>
          <Check className="h-3.5 w-3.5 shrink-0" />
          Rascunho salvo {formatElapsed(savedAt)}
        </>
      ) : null}
    </span>
  );
}

function formatElapsed(savedAt: number): string {
  const seconds = Math.round((Date.now() - savedAt) / 1000);
  if (seconds < 60) return "agora";
  const minutes = Math.round(seconds / 60);
  if (minutes < 60) return `há ${minutes} min`;
  return `há ${Math.round(minutes / 60)} h`;
}

function ClearDraftButton({ onConfirm }: { onConfirm: () => void }) {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button type="button" variant="ghost" size="sm">
          <Trash2 className="mr-1.5 h-4 w-4" />
          Limpar
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Limpar todos os dados?</AlertDialogTitle>
          <AlertDialogDescription>
            Isso apaga o currículo salvo neste navegador. O estilo e o idioma
            escolhidos são mantidos. Se quiser guardar o que preencheu, use
            “Exportar” antes.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <AlertDialogAction onClick={onConfirm}>
            Limpar mesmo assim
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
