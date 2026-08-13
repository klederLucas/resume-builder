import { Briefcase, Plus } from "lucide-react";
import { useFieldArray, useFormContext } from "react-hook-form";

import { FormTextField } from "@/components/builder/form/FormTextField";
import { RepeatableCard } from "@/components/builder/form/RepeatableCard";
import { StringListField } from "@/components/builder/form/StringListField";
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

const EMPTY_ENTRY = {
  period: "",
  role: "",
  company: "",
  description: "",
  achievements: [],
};

export function ExperienceFields() {
  const { control } = useFormContext<ResumeFormValues>();
  const { fields, append, remove, move } = useFieldArray({
    control,
    name: "experience",
  });

  if (fields.length === 0) {
    return (
      <Empty className="border border-dashed py-6">
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <Briefcase />
          </EmptyMedia>
          <EmptyTitle>Nenhuma experiência adicionada</EmptyTitle>
          <EmptyDescription>
            Se você deixar esta seção vazia, ela não aparece no currículo.
          </EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
          <Button type="button" onClick={() => append(EMPTY_ENTRY)}>
            <Plus className="mr-1.5 h-4 w-4" />
            Adicionar experiência
          </Button>
        </EmptyContent>
      </Empty>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {fields.map((field, index) => (
        <ExperienceItem
          key={field.id}
          index={index}
          total={fields.length}
          onMoveUp={() => move(index, index - 1)}
          onMoveDown={() => move(index, index + 1)}
          onRemove={() => remove(index)}
        />
      ))}

      <Button
        type="button"
        variant="outline"
        className="self-start"
        onClick={() => append(EMPTY_ENTRY)}
      >
        <Plus className="mr-1.5 h-4 w-4" />
        Adicionar experiência
      </Button>
    </div>
  );
}

function ExperienceItem({
  index,
  total,
  onMoveUp,
  onMoveDown,
  onRemove,
}: {
  index: number;
  total: number;
  onMoveUp: () => void;
  onMoveDown: () => void;
  onRemove: () => void;
}) {
  const { watch } = useFormContext<ResumeFormValues>();
  const role = watch(`experience.${index}.role`);
  const company = watch(`experience.${index}.company`);

  const title =
    [role, company].filter(Boolean).join(" — ") || `Experiência ${index + 1}`;

  return (
    <RepeatableCard
      title={title}
      index={index}
      total={total}
      onMoveUp={onMoveUp}
      onMoveDown={onMoveDown}
      onRemove={onRemove}
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <FormTextField
          name={`experience.${index}.role`}
          label="Cargo"
          placeholder="Engenheira de Software Sênior"
        />
        <FormTextField
          name={`experience.${index}.company`}
          label="Empresa"
          placeholder="Norte Digital"
        />
      </div>

      <FormTextField
        name={`experience.${index}.period`}
        label="Período"
        placeholder="2022 - Atual"
        description="Texto livre — aparece na coluna à esquerda da entrada."
      />

      <FormTextField
        multiline
        name={`experience.${index}.description`}
        label="Descrição"
        placeholder="O que você fazia, com que tecnologias e com qual responsabilidade."
      />

      <StringListField
        name={`experience.${index}.achievements`}
        label="Principais conquistas"
        description="Resultados concretos, de preferência com número. Enter adiciona a próxima."
        placeholder="Reduziu o tempo de resposta da API em 70%."
        addLabel="Adicionar conquista"
      />
    </RepeatableCard>
  );
}
