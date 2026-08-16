import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";

import { useLocale } from "@/i18n/LocaleContext";
import { clearDraft, loadDraft, saveDraft } from "@/lib/draftStorage";
import { DEFAULT_TEMPLATE_ID } from "@/templates/registry";
import {
  createEmptyResume,
  type Resume,
  type ResumeLanguage,
} from "@shared/resume";

const SAVE_DEBOUNCE_MS = 400;

interface ResumeDraftContextValue {
  draft: Resume;
  setDraft: (next: Resume | ((previous: Resume) => Resume)) => void;
  setTemplateId: (templateId: string) => void;
  setLanguage: (language: ResumeLanguage) => void;
  replaceDraft: (next: Resume) => void;
  resetDraft: () => void;
  savedAt: number | null;
  isSaving: boolean;
}

const ResumeDraftContext = createContext<ResumeDraftContextValue | undefined>(
  undefined
);

export function ResumeDraftProvider({ children }: { children: ReactNode }) {
  // A brand-new resume starts in the language the browser asked for; an
  // existing draft keeps whatever language it was saved with.
  const { locale } = useLocale();
  const [stored] = useState(() => loadDraft(DEFAULT_TEMPLATE_ID, locale));
  const [draft, setDraftState] = useState<Resume>(
    () => stored?.resume ?? createEmptyResume(DEFAULT_TEMPLATE_ID, locale)
  );
  const [savedAt, setSavedAt] = useState<number | null>(
    stored?.savedAt ?? null
  );
  const [isSaving, setIsSaving] = useState(false);

  const unsavedRef = useRef<Resume | null>(null);
  const isFirstRender = useRef(true);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    unsavedRef.current = draft;
    setIsSaving(true);

    const timer = window.setTimeout(() => {
      const at = saveDraft(draft);
      unsavedRef.current = null;
      setIsSaving(false);
      if (at !== null) setSavedAt(at);
    }, SAVE_DEBOUNCE_MS);

    return () => window.clearTimeout(timer);
  }, [draft]);

  useEffect(() => {
    const flush = () => {
      if (!unsavedRef.current) return;
      const at = saveDraft(unsavedRef.current);
      unsavedRef.current = null;
      if (at !== null) setSavedAt(at);
    };
    const onVisibilityChange = () => {
      if (document.visibilityState === "hidden") flush();
    };

    window.addEventListener("pagehide", flush);
    document.addEventListener("visibilitychange", onVisibilityChange);
    return () => {
      window.removeEventListener("pagehide", flush);
      document.removeEventListener("visibilitychange", onVisibilityChange);
    };
  }, []);

  const setDraft = useCallback(
    (next: Resume | ((previous: Resume) => Resume)) => {
      setDraftState(previous =>
        typeof next === "function" ? next(previous) : next
      );
    },
    []
  );

  const setTemplateId = useCallback((templateId: string) => {
    setDraftState(previous => ({
      ...previous,
      meta: { ...previous.meta, templateId },
    }));
  }, []);

  const setLanguage = useCallback((language: ResumeLanguage) => {
    setDraftState(previous => ({
      ...previous,
      meta: { ...previous.meta, language },
    }));
  }, []);

  const replaceDraft = useCallback((next: Resume) => {
    setDraftState(next);
  }, []);

  const resetDraft = useCallback(() => {
    clearDraft();
    unsavedRef.current = null;
    setSavedAt(null);
    setDraftState(previous =>
      createEmptyResume(previous.meta.templateId, previous.meta.language)
    );
  }, []);

  const value = useMemo<ResumeDraftContextValue>(
    () => ({
      draft,
      setDraft,
      setTemplateId,
      setLanguage,
      replaceDraft,
      resetDraft,
      savedAt,
      isSaving,
    }),
    [
      draft,
      setDraft,
      setTemplateId,
      setLanguage,
      replaceDraft,
      resetDraft,
      savedAt,
      isSaving,
    ]
  );

  return (
    <ResumeDraftContext.Provider value={value}>
      {children}
    </ResumeDraftContext.Provider>
  );
}

export function useResumeDraft(): ResumeDraftContextValue {
  const context = useContext(ResumeDraftContext);
  if (!context) {
    throw new Error("useResumeDraft must be used within ResumeDraftProvider");
  }
  return context;
}
