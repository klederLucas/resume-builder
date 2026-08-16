import { Route, Switch } from "wouter";

import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { LocaleProvider } from "@/i18n/LocaleContext";
import EditorPage from "@/pages/EditorPage";
import NotFound from "@/pages/NotFound";
import PreviewPage from "@/pages/PreviewPage";
import TemplatePickerPage from "@/pages/TemplatePickerPage";
import { ResumeDraftProvider } from "@/state/ResumeDraftContext";

import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";

function Router() {
  return (
    <Switch>
      <Route path="/" component={TemplatePickerPage} />
      <Route path="/editor" component={EditorPage} />
      <Route path="/preview" component={PreviewPage} />
      <Route path="/404" component={NotFound} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light">
        <LocaleProvider>
          <TooltipProvider>
            <Toaster />
            <ResumeDraftProvider>
              <Router />
            </ResumeDraftProvider>
          </TooltipProvider>
        </LocaleProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
