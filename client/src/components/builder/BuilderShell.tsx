import { Coffee } from "lucide-react";
import type { ReactNode } from "react";

import { LocaleSwitcher } from "@/components/builder/LocaleSwitcher";
import { StepNav } from "@/components/builder/StepNav";
import { useMessages } from "@/i18n/LocaleContext";
import { cn } from "@/lib/utils";

const BUY_ME_A_COFFEE_URL = "https://buymeacoffee.com/kledermonteiro";

interface BuilderShellProps {
  title: string;
  description?: string;
  actions?: ReactNode;
  children: ReactNode;
  wide?: boolean;
}

export function BuilderShell({
  title,
  description,
  actions,
  children,
  wide = false,
}: BuilderShellProps) {
  const t = useMessages();

  return (
    <div className="bg-muted/40 flex min-h-screen flex-col">
      <header className="no-print bg-background/95 supports-[backdrop-filter]:bg-background/80 sticky top-0 z-40 border-b backdrop-blur">
        <div
          className={cn(
            "mx-auto flex flex-wrap items-center justify-between gap-3 px-4 py-3",
            wide ? "max-w-none" : "max-w-4xl"
          )}
        >
          <StepNav />
          <div className="flex flex-wrap items-center gap-2">
            {actions}
            <LocaleSwitcher />
          </div>
        </div>
      </header>

      <main
        className={cn(
          "mx-auto w-full flex-1 px-4 py-8 print:px-0 print:py-0",
          wide ? "max-w-none" : "max-w-4xl"
        )}
      >
        <div className="no-print mb-6">
          <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
          {description && (
            <p className="text-muted-foreground mt-1 text-sm">{description}</p>
          )}
        </div>

        {children}
      </main>

      <footer className="no-print border-t">
        <div
          className={cn(
            "text-muted-foreground mx-auto flex flex-wrap items-center justify-center gap-x-2 gap-y-1 px-4 py-6 text-sm",
            wide ? "max-w-none" : "max-w-4xl"
          )}
        >
          <span>{t.footer.enjoying}</span>
          <a
            href={BUY_ME_A_COFFEE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="text-foreground inline-flex items-center gap-1.5 font-medium underline-offset-4 hover:underline"
          >
            <Coffee className="h-4 w-4" aria-hidden />
            {t.footer.buyMeACoffee}
          </a>
        </div>
      </footer>
    </div>
  );
}
