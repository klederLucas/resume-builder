import type { ReactNode } from "react";

import { LocaleSwitcher } from "@/components/builder/LocaleSwitcher";
import { StepNav } from "@/components/builder/StepNav";
import { cn } from "@/lib/utils";

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
  return (
    <div className="bg-muted/40 min-h-screen">
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
          "mx-auto px-4 py-8 print:px-0 print:py-0",
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
    </div>
  );
}
