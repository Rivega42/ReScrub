import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider, useAuth, AuthGuard } from "@/lib/authContext";
import Home from "@/pages/Home";
import Landing from "@/pages/Landing";
import Login from "@/pages/Login";
import VerifyEmail from "@/pages/VerifyEmail";
import About from "@/pages/About";
import Blog from "@/pages/Blog";
import BlogArticle from "@/pages/BlogArticle";
import DataBrokers from "@/pages/DataBrokers";
import Reports from "@/pages/Reports";
import FAQ from "@/pages/FAQ";
import Support from "@/pages/Support";
import Contacts from "@/pages/Contacts";
import Privacy from "@/pages/Privacy";
import Terms from "@/pages/Terms";
import Whitepaper from "@/pages/Whitepaper";
import Status from "@/pages/Status";
import NotFound from "@/pages/not-found";
import Dashboard from "@/pages/Dashboard";

function Router() {
  const { isAuthenticated, isLoading } = useAuth();

  return (
    <Switch>
      {/* Public routes */}
      <Route path="/login" component={Login} />
      <Route path="/verify-email" component={VerifyEmail} />
      <Route path="/blog/:slug" component={BlogArticle} />
      <Route path="/blog" component={Blog} />
      <Route path="/data-brokers" component={DataBrokers} />
      <Route path="/about" component={About} />
      <Route path="/faq" component={FAQ} />
      <Route path="/support" component={Support} />
      <Route path="/contacts" component={Contacts} />
      <Route path="/privacy" component={Privacy} />
      <Route path="/terms" component={Terms} />
      <Route path="/whitepaper" component={Whitepaper} />
      <Route path="/reports" component={Reports} />
      <Route path="/status" component={Status} />
      
      {/* Protected app routes */}
      <Route path="/app/:rest*">
        <AuthGuard fallback={<Login />}>
          <AppRoutes />
        </AuthGuard>
      </Route>
      
      {/* Main landing/home route */}
      {isLoading || !isAuthenticated ? (
        <Route path="/" component={Landing} />
      ) : (
        <Route path="/" component={Home} />
      )}
      
      <Route component={NotFound} />
    </Switch>
  );
}

// Protected app routes component
function AppRoutes() {
  return (
    <Switch>
      <Route path="/app/dashboard" component={Dashboard} />
      <Route path="/app/profile">
        <div className="p-8">
          <h1 className="text-2xl font-bold">Профиль</h1>
          <p className="text-muted-foreground">Управление профилем и настройками</p>
          {/* TODO: Implement profile */}
        </div>
      </Route>
      <Route path="/app/documents">
        <div className="p-8">
          <h1 className="text-2xl font-bold">Документы</h1>
          <p className="text-muted-foreground">Загрузка и управление документами</p>
          {/* TODO: Implement documents */}
        </div>
      </Route>
      <Route path="/app/monitoring">
        <div className="p-8">
          <h1 className="text-2xl font-bold">Мониторинг</h1>
          <p className="text-muted-foreground">Отслеживание процесса удаления данных</p>
          {/* TODO: Implement monitoring */}
        </div>
      </Route>
      <Route path="/app/requests">
        <div className="p-8">
          <h1 className="text-2xl font-bold">Запросы</h1>
          <p className="text-muted-foreground">История запросов на удаление</p>
          {/* TODO: Implement requests */}
        </div>
      </Route>
      {/* Default app route */}
      <Route path="/app">
        <div className="p-8">
          <h1 className="text-2xl font-bold">ReScrub Dashboard</h1>
          <p className="text-muted-foreground">Выберите раздел из меню</p>
        </div>
      </Route>
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
