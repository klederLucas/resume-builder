import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import {
  APP_LOCALES,
  LOCALE_HTML_LANG,
  MESSAGES,
  type AppLocale,
  type Messages,
} from "@/i18n/messages";

const STORAGE_KEY = "rb:locale:v1";

export function isAppLocale(value: unknown): value is AppLocale {
  return (
    typeof value === "string" &&
    (APP_LOCALES as readonly string[]).includes(value)
  );
}

/** First supported language in the browser's preference list. */
function detectLocale(): AppLocale {
  const tags =
    typeof navigator === "undefined"
      ? []
      : navigator.languages?.length
        ? navigator.languages
        : [navigator.language];

  for (const tag of tags) {
    const base = tag.toLowerCase().split("-")[0];
    if (isAppLocale(base)) return base;
  }

  return "en";
}

function readStoredLocale(): AppLocale | null {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return isAppLocale(raw) ? raw : null;
  } catch {
    return null;
  }
}

/**
 * An explicit choice wins over the browser default. Exported because
 * `ErrorBoundary` renders above the provider and still needs to pick a
 * language.
 */
export function getInitialLocale(): AppLocale {
  return readStoredLocale() ?? detectLocale();
}

interface LocaleContextValue {
  locale: AppLocale;
  setLocale: (locale: AppLocale) => void;
  t: Messages;
}

const LocaleContext = createContext<LocaleContextValue | undefined>(undefined);

export function LocaleProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<AppLocale>(getInitialLocale);
  const t = MESSAGES[locale];

  useEffect(() => {
    document.documentElement.lang = LOCALE_HTML_LANG[locale];
    document.title = t.documentTitle;
  }, [locale, t]);

  const setLocale = useCallback((next: AppLocale) => {
    setLocaleState(next);
    try {
      window.localStorage.setItem(STORAGE_KEY, next);
    } catch {
      // A blocked localStorage only costs the preference across reloads.
    }
  }, []);

  const value = useMemo<LocaleContextValue>(
    () => ({ locale, setLocale, t }),
    [locale, setLocale, t]
  );

  return (
    <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>
  );
}

export function useLocale(): LocaleContextValue {
  const context = useContext(LocaleContext);
  if (!context) {
    throw new Error("useLocale must be used within LocaleProvider");
  }
  return context;
}

/** Shorthand for components that only read copy. */
export function useMessages(): Messages {
  return useLocale().t;
}
