import { Languages } from "lucide-react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useLocale } from "@/i18n/LocaleContext";
import { APP_LOCALES, type AppLocale } from "@/i18n/messages";
import { RESUME_LANGUAGE_NAMES } from "@shared/resume";

export function LocaleSwitcher() {
  const { locale, setLocale, t } = useLocale();

  return (
    <Select
      value={locale}
      onValueChange={value => setLocale(value as AppLocale)}
    >
      <SelectTrigger
        size="sm"
        className="w-auto gap-1.5"
        aria-label={t.locale.label}
        title={t.locale.label}
      >
        <Languages className="h-4 w-4 shrink-0" aria-hidden />
        <SelectValue />
      </SelectTrigger>
      <SelectContent align="end">
        {APP_LOCALES.map(option => (
          <SelectItem key={option} value={option}>
            {RESUME_LANGUAGE_NAMES[option]}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
