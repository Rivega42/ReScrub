import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useAuth } from "@/hooks/useAuth";
import Home from "@/pages/Home";
import Landing from "@/pages/Landing";
import Login from "@/pages/Login";
import About from "@/pages/About";
import Reports from "@/pages/Reports";
import FAQ from "@/pages/FAQ";
import Support from "@/pages/Support";
import Contacts from "@/pages/Contacts";
import Privacy from "@/pages/Privacy";
import Terms from "@/pages/Terms";
import NotFound from "@/pages/not-found";

function Router() {
  const { isAuthenticated, isLoading } = useAuth();

  return (
    <Switch>
      <Route path="/login" component={Login} />
      <Route path="/about" component={About} />
      <Route path="/faq" component={FAQ} />
      <Route path="/support" component={Support} />
      <Route path="/contacts" component={Contacts} />
      <Route path="/privacy" component={Privacy} />
      <Route path="/terms" component={Terms} />
      <Route path="/reports" component={Reports} />
      {isLoading || !isAuthenticated ? (
        <Route path="/" component={Landing} />
      ) : (
        <>
          <Route path="/" component={Home} />
          {/* Protected routes would go here */}
        </>
      )}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
