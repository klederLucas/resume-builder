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
import { useMessages } from "@/i18n/LocaleContext";
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
  const t = useMessages().form;
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
          <EmptyTitle>{t.experience.emptyTitle}</EmptyTitle>
          <EmptyDescription>{t.hiddenWhenEmpty}</EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
          <Button type="button" onClick={() => append(EMPTY_ENTRY)}>
            <Plus className="mr-1.5 h-4 w-4" />
            {t.experience.add}
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
        {t.experience.add}
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
  const t = useMessages().form;
  const role = watch(`experience.${index}.role`);
  const company = watch(`experience.${index}.company`);

  const title =
    [role, company].filter(Boolean).join(" — ") ||
    `${t.experience.entryLabel} ${index + 1}`;

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
          label={t.experience.jobRole.label}
          placeholder={t.experience.jobRole.placeholder}
        />
        <FormTextField
          name={`experience.${index}.company`}
          label={t.experience.company.label}
          placeholder={t.experience.company.placeholder}
        />
      </div>

      <FormTextField
        name={`experience.${index}.period`}
        label={t.experience.period.label}
        placeholder={t.experience.period.placeholder}
        description={t.experience.period.description}
      />

      <FormTextField
        multiline
        name={`experience.${index}.description`}
        label={t.experience.description.label}
        placeholder={t.experience.description.placeholder}
      />

      <StringListField
        name={`experience.${index}.achievements`}
        label={t.experience.achievements.label}
        description={t.experience.achievements.description}
        placeholder={t.experience.achievements.placeholder}
        addLabel={t.experience.achievements.add}
      />
    </RepeatableCard>
  );
}
