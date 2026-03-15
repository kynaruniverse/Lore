// LORE — Ember Archive Design System
// Dark warm charcoal + burnt orange. Lora serif + Inter UI.
// Routes: / (discovery), /lore/:slug (lore hub), /lore/:loreSlug/:pageSlug (page view),
//         /create (create lore), /lore/:slug/create-page (create page), /search

import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider, useTheme } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import LoreHub from "./pages/LoreHub";
import PageView from "./pages/PageView";
import CreateLore from "./pages/CreateLore";
import CreatePage from "./pages/CreatePage";
import SearchPage from "./pages/SearchPage";
import NotFound from "./pages/NotFound";
import GraphView from "./pages/GraphView";
import EditPage from "./pages/EditPage";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/search" component={SearchPage} />
      <Route path="/create" component={CreateLore} />
      <Route path="/lore/:loreSlug/create-page" component={CreatePage} />
      <Route path="/lore/:loreSlug/:pageSlug/edit" component={EditPage} />
      <Route path="/lore/:loreSlug/graph" component={GraphView} />
      <Route path="/lore/:loreSlug/:pageSlug" component={PageView} />
      <Route path="/lore/:loreSlug" component={LoreHub} />
      <Route component={NotFound} />
    </Switch>
  );
}

function AppContent() {
  const { theme } = useTheme();
  return (
    <TooltipProvider>
      <Toaster
        theme={theme}
        toastOptions={{
          style:
            theme === "dark"
              ? {
                  background: "oklch(0.22 0.016 45)",
                  border: "1px solid oklch(0.28 0.012 45)",
                  color: "oklch(0.93 0.01 65)",
                }
              : {
                  background: "#ffffff",
                  border: "1px solid #e5e7eb",
                  color: "#1a1a1a",
                },
        }}
      />
      <Router />
    </TooltipProvider>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="dark" switchable>
        <AppContent />
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
