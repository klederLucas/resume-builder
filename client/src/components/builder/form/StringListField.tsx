import { Plus, X } from "lucide-react";
import {
  useFieldArray,
  useFormContext,
  type FieldArrayPath,
  type Path,
} from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Field, FieldDescription, FieldLabel } from "@/components/ui/field";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group";
import type { ResumeFormValues, StringListName } from "@/lib/resumeForm";

interface StringListFieldProps {
  name: StringListName;
  label: string;
  description?: string;
  placeholder?: string;
  addLabel?: string;
}

export function StringListField({
  name,
  label,
  description,
  placeholder,
  addLabel = "Adicionar item",
}: StringListFieldProps) {
  const { control, register, setFocus } = useFormContext<ResumeFormValues>();
  const { fields, append, remove } = useFieldArray({
    control,
    name: name as FieldArrayPath<ResumeFormValues>,
  });

  const appendAndFocus = () => {
    append({ value: "" } as never);
    window.setTimeout(() => {
      setFocus(`${name}.${fields.length}.value` as Path<ResumeFormValues>);
    }, 0);
  };

  return (
    <Field>
      <FieldLabel>{label}</FieldLabel>
      {description && <FieldDescription>{description}</FieldDescription>}

      {fields.length > 0 && (
        <div className="flex flex-col gap-2">
          {fields.map((field, index) => (
            <InputGroup key={field.id}>
              <InputGroupInput
                placeholder={placeholder}
                aria-label={`${label} ${index + 1}`}
                {...register(
                  `${name}.${index}.value` as Path<ResumeFormValues>
                )}
                onKeyDown={event => {
                  if (event.key === "Enter") {
                    event.preventDefault();
                    appendAndFocus();
                  }
                }}
              />
              <InputGroupAddon align="inline-end">
                <InputGroupButton
                  type="button"
                  variant="ghost"
                  size="icon-xs"
                  aria-label={`Remover ${label} ${index + 1}`}
                  onClick={() => remove(index)}
                >
                  <X />
                </InputGroupButton>
              </InputGroupAddon>
            </InputGroup>
          ))}
        </div>
      )}

      <Button
        type="button"
        variant="outline"
        size="sm"
        className="self-start"
        onClick={appendAndFocus}
      >
        <Plus className="mr-1.5 h-4 w-4" />
        {addLabel}
      </Button>
    </Field>
  );
}
