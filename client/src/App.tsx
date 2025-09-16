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
import Requests from "@/pages/Requests";
import Profile from "@/pages/Profile";
import Documents from "@/pages/Documents";
import CreateRequest from "@/pages/CreateRequest";
import Notifications from "@/pages/Notifications";
import { AppSidebar } from "@/components/AppSidebar";
import { SidebarProvider, SidebarTrigger, SidebarInset } from "@/components/ui/sidebar";

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
  // Custom sidebar width for personal cabinet
  const style = {
    "--sidebar-width": "20rem",       // 320px for better content
    "--sidebar-width-icon": "4rem",   // default icon width
  };

  return (
    <SidebarProvider style={style as React.CSSProperties}>
      <div className="flex h-screen w-full">
        <AppSidebar />
        <SidebarInset>
          <div className="flex flex-col">
            <header className="flex items-center justify-between p-4 border-b">
              <SidebarTrigger data-testid="button-sidebar-toggle" />
              <div className="text-sm text-muted-foreground">
                Личный кабинет ReScrub
              </div>
            </header>
            <main className="flex-1 overflow-auto">
              <AppRoutesInner />
            </main>
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}

// Inner routes without sidebar wrapper
function AppRoutesInner() {
  return (
    <Switch>
      <Route path="/app/dashboard" component={Dashboard} />
      <Route path="/app/profile" component={Profile} />
      <Route path="/app/documents" component={Documents} />
      <Route path="/app/monitoring">
        <div className="p-8">
          <h1 className="text-2xl font-bold">Мониторинг</h1>
          <p className="text-muted-foreground">Отслеживание процесса удаления данных</p>
          {/* TODO: Implement monitoring */}
        </div>
      </Route>
      <Route path="/app/requests" component={Requests} />
      <Route path="/app/create-request" component={CreateRequest} />
      <Route path="/app/notifications" component={Notifications} />
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
