import { FormTextField } from "@/components/builder/form/FormTextField";
import { FieldGroup } from "@/components/ui/field";

export function ProfileFields() {
  return (
    <FieldGroup className="gap-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <FormTextField
          required
          name="profile.name"
          label="Nome completo"
          placeholder="Ana Beatriz Costa"
        />
        <FormTextField
          required
          name="profile.title"
          label="Cargo / área"
          placeholder="Engenheira de Software"
          description="Aparece em itálico logo abaixo do nome."
        />
      </div>

      <FormTextField
        required
        name="profile.location"
        label="Localização"
        placeholder="São Paulo, SP - Brasil"
      />

      <div className="grid gap-4 sm:grid-cols-2">
        <FormTextField
          required
          name="profile.phone"
          label="Telefone"
          placeholder="+55 11 90000-0000"
        />
        <FormTextField
          required
          name="profile.email"
          label="E-mail"
          placeholder="ana.costa@exemplo.com"
        />
      </div>
    </FieldGroup>
  );
}
