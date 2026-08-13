import { useFormContext, useFormState, type Path } from "react-hook-form";

import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import type { ResumeFormValues } from "@/lib/resumeForm";

interface FormTextFieldProps {
  name: Path<ResumeFormValues>;
  label: string;
  placeholder?: string;
  description?: string;
  required?: boolean;
  multiline?: boolean;
  rows?: number;
}

export function FormTextField({
  name,
  label,
  placeholder,
  description,
  required = false,
  multiline = false,
  rows = 4,
}: FormTextFieldProps) {
  const { register, getFieldState } = useFormContext<ResumeFormValues>();
  const formState = useFormState<ResumeFormValues>({ name });
  const { error } = getFieldState(name, formState);

  const control = multiline ? Textarea : Input;
  const Control = control as typeof Input;

  return (
    <Field data-invalid={error ? true : undefined}>
      <FieldLabel htmlFor={name}>
        {label}
        {required && (
          <span className="text-destructive" aria-hidden>
            *
          </span>
        )}
      </FieldLabel>
      <Control
        id={name}
        placeholder={placeholder}
        aria-invalid={error ? true : undefined}
        {...(multiline ? { rows } : {})}
        {...register(name)}
      />
      {description && <FieldDescription>{description}</FieldDescription>}
      <FieldError errors={error ? [error] : undefined} />
    </Field>
  );
}
