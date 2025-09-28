import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider, useAuth, AuthGuard, AdminGuard } from "@/lib/authContext";
import { Suspense, lazy } from "react";
import { Skeleton } from "@/components/ui/skeleton";

// Критически важные страницы - синхронная загрузка
import Home from "@/pages/Home";
import Landing from "@/pages/Landing";
import Login from "@/pages/Login";
import NotFound from "@/pages/not-found";

// Lazy-loaded страницы для оптимизации производительности
// Основные страницы
const VerifyEmail = lazy(() => import("@/pages/VerifyEmail"));
const OperatorConfirm = lazy(() => import("@/pages/operator-confirm"));
const About = lazy(() => import("@/pages/About"));
const DataBrokers = lazy(() => import("@/pages/DataBrokers"));
const FAQ = lazy(() => import("@/pages/FAQ"));
const Support = lazy(() => import("@/pages/Support"));
const Contacts = lazy(() => import("@/pages/Contacts"));
const Privacy = lazy(() => import("@/pages/Privacy"));
const Terms = lazy(() => import("@/pages/Terms"));
const InvitePage = lazy(() => import("@/pages/InvitePage"));

// Тяжелые статичные страницы
const Whitepaper = lazy(() => import("@/pages/Whitepaper"));
const Status = lazy(() => import("@/pages/Status"));
const Reports = lazy(() => import("@/pages/Reports"));

// Blog страницы
const Blog = lazy(() => import("@/pages/Blog"));
const BlogArticle = lazy(() => import("@/pages/BlogArticle"));
const CategoryBlog = lazy(() => import("@/pages/CategoryBlog"));

// Админские страницы (большие)
const AdminDashboard = lazy(() => import("@/pages/AdminDashboard"));
const AdminSetup = lazy(() => import("@/pages/AdminSetup"));
const AdminUsers = lazy(() => import("@/pages/AdminUsers"));
const AdminDataBrokers = lazy(() => import("@/pages/AdminDataBrokers"));
const AdminEmailTemplates = lazy(() => import("@/pages/AdminEmailTemplates"));
const AdminSecurityLogs = lazy(() => import("@/pages/AdminSecurityLogs"));
const AdminSystemMonitoring = lazy(() => import("@/pages/AdminSystemMonitoring"));
const AdminBlog = lazy(() => import("@/pages/AdminBlog"));

// САЗПД страницы
const AdminSAZPD = lazy(() => import("@/pages/admin-sazpd"));
const TestingMethodology = lazy(() => import("@/pages/testing-methodology"));

// Личный кабинет - страницы
const Dashboard = lazy(() => import("@/pages/Dashboard"));
const Requests = lazy(() => import("@/pages/Requests"));
const Profile = lazy(() => import("@/pages/Profile"));
const Documents = lazy(() => import("@/pages/Documents"));
const CreateRequest = lazy(() => import("@/pages/CreateRequest"));
const Notifications = lazy(() => import("@/pages/Notifications"));
const Monitoring = lazy(() => import("@/pages/Monitoring"));
const Subscription = lazy(() => import("@/pages/Subscription"));

// Бизнес платформа - все страницы lazy
const BusinessLanding = lazy(() => import("@/pages/business/BusinessLanding"));
const BusinessConsent = lazy(() => import("@/pages/business/BusinessConsent"));
const BusinessAtomization = lazy(() => import("@/pages/business/BusinessAtomization"));
const BusinessWhitepaper = lazy(() => import("@/pages/business/BusinessWhitepaper"));
const BusinessRoadmap = lazy(() => import("@/pages/business/BusinessRoadmap"));
const BusinessPricing = lazy(() => import("@/pages/business/BusinessPricing"));
const BusinessAPI = lazy(() => import("@/pages/business/BusinessAPI"));
const BusinessIntegrations = lazy(() => import("@/pages/business/BusinessIntegrations"));
const BusinessCases = lazy(() => import("@/pages/business/BusinessCases"));
const BusinessContact = lazy(() => import("@/pages/business/BusinessContact"));
const BusinessLogin = lazy(() => import("@/pages/business/BusinessLogin"));
const BusinessRegister = lazy(() => import("@/pages/business/BusinessRegister"));
const BusinessMonitoring = lazy(() => import("@/pages/business/BusinessMonitoring"));
const BusinessSupport = lazy(() => import("@/pages/business/BusinessSupport"));
import { AppSidebar } from "@/components/AppSidebar";
import { BottomNav } from "@/components/BottomNav";
import { SidebarProvider, SidebarTrigger, SidebarInset } from "@/components/ui/sidebar";
import { ScrollToTop } from "@/components/ScrollToTop";
import CookieConsentBanner from "@/components/CookieConsentBanner";

// Loading fallback компоненты для оптимизации UX
function PageLoadingFallback() {
  return (
    <div className="flex flex-col space-y-4 p-8 animate-pulse" data-testid="page-loading">
      <Skeleton className="h-8 w-3/4" />
      <Skeleton className="h-4 w-1/2" />
      <div className="space-y-2">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
        <Skeleton className="h-4 w-4/6" />
      </div>
    </div>
  );
}

// Админский loading fallback
function AdminLoadingFallback() {
  return (
    <div className="flex flex-col space-y-6 p-8 animate-pulse" data-testid="admin-loading">
      <div className="flex items-center justify-between">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-10 w-32" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="space-y-3">
            <Skeleton className="h-32 w-full rounded-lg" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
          </div>
        ))}
      </div>
    </div>
  );
}

function Router() {
  const { isAuthenticated, isLoading } = useAuth();
  const [, setLocation] = useLocation();

  return (
    <>
      <ScrollToTop />
      <Switch>
      {/* Public routes */}
      <Route path="/login" component={Login} />
      <Route path="/verify-email">
        <Suspense fallback={<PageLoadingFallback />}>
          <VerifyEmail />
        </Suspense>
      </Route>
      <Route path="/operator/confirm/:token">
        <Suspense fallback={<PageLoadingFallback />}>
          <OperatorConfirm />
        </Suspense>
      </Route>
      <Route path="/invite/:code">
        <Suspense fallback={<PageLoadingFallback />}>
          <InvitePage />
        </Suspense>
      </Route>
      <Route path="/blog/category/:category">
        <Suspense fallback={<PageLoadingFallback />}>
          <CategoryBlog />
        </Suspense>
      </Route>
      <Route path="/blog/:slug">
        <Suspense fallback={<PageLoadingFallback />}>
          <BlogArticle />
        </Suspense>
      </Route>
      <Route path="/blog">
        <Suspense fallback={<PageLoadingFallback />}>
          <Blog />
        </Suspense>
      </Route>
      <Route path="/data-brokers">
        <Suspense fallback={<PageLoadingFallback />}>
          <DataBrokers />
        </Suspense>
      </Route>
      <Route path="/about">
        <Suspense fallback={<PageLoadingFallback />}>
          <About />
        </Suspense>
      </Route>
      <Route path="/faq">
        <Suspense fallback={<PageLoadingFallback />}>
          <FAQ />
        </Suspense>
      </Route>
      <Route path="/support">
        <Suspense fallback={<PageLoadingFallback />}>
          <Support />
        </Suspense>
      </Route>
      <Route path="/contacts">
        <Suspense fallback={<PageLoadingFallback />}>
          <Contacts />
        </Suspense>
      </Route>
      <Route path="/privacy">
        <Suspense fallback={<PageLoadingFallback />}>
          <Privacy />
        </Suspense>
      </Route>
      <Route path="/terms">
        <Suspense fallback={<PageLoadingFallback />}>
          <Terms />
        </Suspense>
      </Route>
      <Route path="/whitepaper">
        <Suspense fallback={<PageLoadingFallback />}>
          <Whitepaper />
        </Suspense>
      </Route>
      <Route path="/testing-methodology">
        <Suspense fallback={<PageLoadingFallback />}>
          <TestingMethodology />
        </Suspense>
      </Route>
      <Route path="/reports">
        <Suspense fallback={<PageLoadingFallback />}>
          <Reports />
        </Suspense>
      </Route>
      <Route path="/status">
        <Suspense fallback={<PageLoadingFallback />}>
          <Status />
        </Suspense>
      </Route>
      
      {/* Business platform routes */}
      <Route path="/business/whitepaper">
        <Suspense fallback={<PageLoadingFallback />}>
          <BusinessWhitepaper />
        </Suspense>
      </Route>
      <Route path="/business/atomization">
        <Suspense fallback={<PageLoadingFallback />}>
          <BusinessAtomization />
        </Suspense>
      </Route>
      <Route path="/business/consent">
        <Suspense fallback={<PageLoadingFallback />}>
          <BusinessConsent />
        </Suspense>
      </Route>
      <Route path="/business/monitoring">
        <Suspense fallback={<PageLoadingFallback />}>
          <BusinessMonitoring />
        </Suspense>
      </Route>
      <Route path="/business/support">
        <Suspense fallback={<PageLoadingFallback />}>
          <BusinessSupport />
        </Suspense>
      </Route>
      <Route path="/business/roadmap">
        <Suspense fallback={<PageLoadingFallback />}>
          <BusinessRoadmap />
        </Suspense>
      </Route>
      <Route path="/business/pricing">
        <Suspense fallback={<PageLoadingFallback />}>
          <BusinessPricing />
        </Suspense>
      </Route>
      <Route path="/business/api">
        <Suspense fallback={<PageLoadingFallback />}>
          <BusinessAPI />
        </Suspense>
      </Route>
      <Route path="/business/integrations">
        <Suspense fallback={<PageLoadingFallback />}>
          <BusinessIntegrations />
        </Suspense>
      </Route>
      <Route path="/business/cases">
        <Suspense fallback={<PageLoadingFallback />}>
          <BusinessCases />
        </Suspense>
      </Route>
      <Route path="/business/contact">
        <Suspense fallback={<PageLoadingFallback />}>
          <BusinessContact />
        </Suspense>
      </Route>
      <Route path="/business/login">
        <Suspense fallback={<PageLoadingFallback />}>
          <BusinessLogin />
        </Suspense>
      </Route>
      <Route path="/business/register">
        <Suspense fallback={<PageLoadingFallback />}>
          <BusinessRegister />
        </Suspense>
      </Route>
      <Route path="/business">
        <Suspense fallback={<PageLoadingFallback />}>
          <BusinessLanding />
        </Suspense>
      </Route>
      
      {/* Protected Admin routes */}
      <Route path="/admin">
        <AdminGuard fallback={<Login />}>
          <Suspense fallback={<AdminLoadingFallback />}>
            <AdminDashboard />
          </Suspense>
        </AdminGuard>
      </Route>
      <Route path="/admin/users">
        <AdminGuard fallback={<Login />}>
          <Suspense fallback={<AdminLoadingFallback />}>
            <AdminUsers />
          </Suspense>
        </AdminGuard>
      </Route>
      <Route path="/admin/data-brokers">
        <AdminGuard fallback={<Login />}>
          <Suspense fallback={<AdminLoadingFallback />}>
            <AdminDataBrokers />
          </Suspense>
        </AdminGuard>
      </Route>
      <Route path="/admin/email-templates">
        <AdminGuard fallback={<Login />}>
          <Suspense fallback={<AdminLoadingFallback />}>
            <AdminEmailTemplates />
          </Suspense>
        </AdminGuard>
      </Route>
      <Route path="/admin/security">
        <AdminGuard fallback={<Login />}>
          <Suspense fallback={<AdminLoadingFallback />}>
            <AdminSecurityLogs />
          </Suspense>
        </AdminGuard>
      </Route>
      <Route path="/admin/monitoring">
        <AdminGuard fallback={<Login />}>
          <Suspense fallback={<AdminLoadingFallback />}>
            <AdminSystemMonitoring />
          </Suspense>
        </AdminGuard>
      </Route>
      <Route path="/admin/blog">
        <AdminGuard fallback={<Login />}>
          <Suspense fallback={<AdminLoadingFallback />}>
            <AdminBlog />
          </Suspense>
        </AdminGuard>
      </Route>
      <Route path="/admin/sazpd">
        <AdminGuard fallback={<Login />}>
          <Suspense fallback={<AdminLoadingFallback />}>
            <AdminSAZPD />
          </Suspense>
        </AdminGuard>
      </Route>
      <Route path="/admin-setup">
        <AdminGuard fallback={<Login />}>
          <Suspense fallback={<AdminLoadingFallback />}>
            <AdminSetup />
          </Suspense>
        </AdminGuard>
      </Route>
      
      {/* Protected app routes */}
      <Route path="/app/:rest*">
        <AuthGuard fallback={<Login />}>
          <AppRoutes />
        </AuthGuard>
      </Route>
      
      {/* Main landing/home route */}
      {isLoading || !isAuthenticated ? (
        <Route path="/">
          {(params) => {
            const urlParams = new URLSearchParams(window.location.search);
            const inviteCode = urlParams.get('invite');
            
            if (inviteCode) {
              // Redirect to proper invite page using wouter navigation
              setLocation(`/invite/${inviteCode}`);
              return null;
            }
            
            return <Landing />;
          }}
        </Route>
      ) : (
        <Route path="/" component={Home} />
      )}
      
      <Route component={NotFound} />
    </Switch>
    </>
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
      <div className="flex min-h-screen-mobile w-full">
        <AppSidebar />
        <SidebarInset>
          <div className="flex flex-col min-h-full">
            <header className="flex items-center justify-between p-4 border-b bg-background sticky top-0 z-40">
              <SidebarTrigger data-testid="button-sidebar-toggle" className="touch-target" />
              <div className="text-sm text-muted-foreground">
                Личный кабинет ReScrub
              </div>
            </header>
            <main className="flex-1 overflow-auto pb-20 md:pb-0">
              <AppRoutesInner />
            </main>
          </div>
        </SidebarInset>
        <BottomNav />
      </div>
    </SidebarProvider>
  );
}

// Inner routes without sidebar wrapper  
function AppRoutesInner() {
  return (
    <Switch>
      <Route path="/app/dashboard">
        <Suspense fallback={<PageLoadingFallback />}>
          <Dashboard />
        </Suspense>
      </Route>
      <Route path="/app/profile">
        <Suspense fallback={<PageLoadingFallback />}>
          <Profile />
        </Suspense>
      </Route>
      <Route path="/app/documents">
        <Suspense fallback={<PageLoadingFallback />}>
          <Documents />
        </Suspense>
      </Route>
      <Route path="/app/monitoring">
        <Suspense fallback={<PageLoadingFallback />}>
          <Monitoring />
        </Suspense>
      </Route>
      <Route path="/app/requests">
        <Suspense fallback={<PageLoadingFallback />}>
          <Requests />
        </Suspense>
      </Route>
      <Route path="/app/create-request">
        <Suspense fallback={<PageLoadingFallback />}>
          <CreateRequest />
        </Suspense>
      </Route>
      <Route path="/app/notifications">
        <Suspense fallback={<PageLoadingFallback />}>
          <Notifications />
        </Suspense>
      </Route>
      <Route path="/app/subscription">
        <Suspense fallback={<PageLoadingFallback />}>
          <Subscription />
        </Suspense>
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
          <CookieConsentBanner />
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
