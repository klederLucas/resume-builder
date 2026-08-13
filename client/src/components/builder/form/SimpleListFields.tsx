import { Award, GraduationCap, Plus } from "lucide-react";
import type { ComponentType } from "react";
import { useFieldArray, useFormContext } from "react-hook-form";

import { FormTextField } from "@/components/builder/form/FormTextField";
import { RepeatableCard } from "@/components/builder/form/RepeatableCard";
import { Button } from "@/components/ui/button";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import type { ResumeFormValues } from "@/lib/resumeForm";

interface TwoFieldListProps {
  name: "education" | "certifications";
  icon: ComponentType<{ className?: string }>;
  emptyTitle: string;
  addLabel: string;
  entryLabel: string;
  firstField: { key: "degree" | "name"; label: string; placeholder: string };
  secondField: {
    key: "institution" | "issuer";
    label: string;
    placeholder: string;
  };
}

function TwoFieldList({
  name,
  icon: Icon,
  emptyTitle,
  addLabel,
  entryLabel,
  firstField,
  secondField,
}: TwoFieldListProps) {
  const { control, watch } = useFormContext<ResumeFormValues>();
  const { fields, append, remove, move } = useFieldArray({ control, name });

  const emptyEntry = {
    [firstField.key]: "",
    [secondField.key]: "",
  } as never;

  if (fields.length === 0) {
    return (
      <Empty className="border border-dashed py-6">
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <Icon />
          </EmptyMedia>
          <EmptyTitle>{emptyTitle}</EmptyTitle>
          <EmptyDescription>
            Se você deixar esta seção vazia, ela não aparece no currículo.
          </EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
          <Button type="button" onClick={() => append(emptyEntry)}>
            <Plus className="mr-1.5 h-4 w-4" />
            {addLabel}
          </Button>
        </EmptyContent>
      </Empty>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {fields.map((field, index) => {
        const heading =
          watch(`${name}.${index}.${firstField.key}` as never) ||
          `${entryLabel} ${index + 1}`;

        return (
          <RepeatableCard
            key={field.id}
            title={String(heading)}
            index={index}
            total={fields.length}
            onMoveUp={() => move(index, index - 1)}
            onMoveDown={() => move(index, index + 1)}
            onRemove={() => remove(index)}
          >
            <FormTextField
              name={`${name}.${index}.${firstField.key}` as never}
              label={firstField.label}
              placeholder={firstField.placeholder}
            />
            <FormTextField
              name={`${name}.${index}.${secondField.key}` as never}
              label={secondField.label}
              placeholder={secondField.placeholder}
            />
          </RepeatableCard>
        );
      })}

      <Button
        type="button"
        variant="outline"
        className="self-start"
        onClick={() => append(emptyEntry)}
      >
        <Plus className="mr-1.5 h-4 w-4" />
        {addLabel}
      </Button>
    </div>
  );
}

export function EducationFields() {
  return (
    <TwoFieldList
      name="education"
      icon={GraduationCap}
      emptyTitle="Nenhuma formação adicionada"
      addLabel="Adicionar formação"
      entryLabel="Formação"
      firstField={{
        key: "degree",
        label: "Curso / grau",
        placeholder: "Bacharelado em Ciência da Computação",
      }}
      secondField={{
        key: "institution",
        label: "Instituição",
        placeholder: "Universidade Federal do Paraná, 2015",
      }}
    />
  );
}

export function CertificationFields() {
  return (
    <TwoFieldList
      name="certifications"
      icon={Award}
      emptyTitle="Nenhuma certificação adicionada"
      addLabel="Adicionar certificação"
      entryLabel="Certificação"
      firstField={{
        key: "name",
        label: "Certificação",
        placeholder: "AWS Certified Solutions Architect",
      }}
      secondField={{
        key: "issuer",
        label: "Emissor",
        placeholder: "Amazon Web Services, 2023",
      }}
    />
  );
}
