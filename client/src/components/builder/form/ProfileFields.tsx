import { FormTextField } from "@/components/builder/form/FormTextField";
import { FieldGroup } from "@/components/ui/field";
import { useMessages } from "@/i18n/LocaleContext";

export function ProfileFields() {
  const t = useMessages().form;

  return (
    <FieldGroup className="gap-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <FormTextField
          required
          name="profile.name"
          label={t.name.label}
          placeholder={t.name.placeholder}
        />
        <FormTextField
          required
          name="profile.title"
          label={t.role.label}
          placeholder={t.role.placeholder}
          description={t.role.description}
        />
      </div>

      <FormTextField
        required
        name="profile.location"
        label={t.location.label}
        placeholder={t.location.placeholder}
      />

      <div className="grid gap-4 sm:grid-cols-2">
        <FormTextField
          required
          name="profile.phone"
          label={t.phone.label}
          placeholder={t.phone.placeholder}
        />
        <FormTextField
          required
          name="profile.email"
          label={t.email.label}
          placeholder={t.email.placeholder}
        />
      </div>
    </FieldGroup>
  );
}
