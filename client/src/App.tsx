import { useEffect, lazy, Suspense } from "react";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Route, Switch, useRoute } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import AppLayout from "./components/AppLayout";
import InstallPrompt from "./components/InstallPrompt";
import OnboardingWalkthrough from "./components/OnboardingWalkthrough";
import DashboardSkeleton from "./components/skeletons/DashboardSkeleton";
import HistorySkeleton from "./components/skeletons/HistorySkeleton";
import { useTipidStore } from "@/lib/store";

/* ── Lazy-loaded pages ── */
const Landing = lazy(() => import("./pages/Landing"));
const NotFound = lazy(() => import("./pages/NotFound"));
const Dashboard = lazy(() => import("./pages/app/Dashboard"));
const AddTransaction = lazy(() => import("./pages/app/AddTransaction"));
const Wallets = lazy(() => import("./pages/app/Wallets"));
const History = lazy(() => import("./pages/app/History"));
const Settings = lazy(() => import("./pages/app/Settings"));
const Budgets = lazy(() => import("./pages/app/Budgets"));
const Goals = lazy(() => import("./pages/app/Goals"));
const Debts = lazy(() => import("./pages/app/Debts"));
const Recurring = lazy(() => import("./pages/app/Recurring"));
const Analytics = lazy(() => import("./pages/app/Analytics"));
const TransferPage = lazy(() => import("./pages/app/TransferPage"));
const MonthlySummary = lazy(() => import("./pages/app/MonthlySummary"));

/* ── Generic loading spinner for non-skeleton pages ── */
function PageLoader() {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="w-8 h-8 border-3 border-primary/30 border-t-primary rounded-full animate-spin" />
    </div>
  );
}

/* ── Route-aware skeleton picker ── */
function AppSkeleton() {
  const [isDashboard] = useRoute("/app");
  const [isHistory] = useRoute("/app/history");

  if (isDashboard) return <DashboardSkeleton />;
  if (isHistory) return <HistorySkeleton />;
  return <PageLoader />;
}

function AppRoutes() {
  const processRecurring = useTipidStore((s) => s.processRecurring);
  useEffect(() => {
    processRecurring();
  }, [processRecurring]);

  return (
    <AppLayout>
      <Suspense fallback={<AppSkeleton />}>
        <Switch>
          <Route path="/app" component={Dashboard} />
          <Route path="/app/add" component={AddTransaction} />
          <Route path="/app/wallets" component={Wallets} />
          <Route path="/app/history" component={History} />
          <Route path="/app/settings" component={Settings} />
          <Route path="/app/budgets" component={Budgets} />
          <Route path="/app/goals" component={Goals} />
          <Route path="/app/debts" component={Debts} />
          <Route path="/app/recurring" component={Recurring} />
          <Route path="/app/analytics" component={Analytics} />
          <Route path="/app/transfer" component={TransferPage} />
          <Route path="/app/summary" component={MonthlySummary} />
          <Route component={NotFound} />
        </Switch>
      </Suspense>
    </AppLayout>
  );
}

function Router() {
  return (
    <Suspense fallback={<PageLoader />}>
      <Switch>
        <Route path="/" component={Landing} />
        <Route path="/app/:rest*" component={AppRoutes} />
        <Route path="/app" component={AppRoutes} />
        <Route path="/404" component={NotFound} />
        <Route component={NotFound} />
      </Switch>
    </Suspense>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light" switchable>
        <TooltipProvider>
          <Toaster position="top-center" />
          <Router />
          <InstallPrompt />
          <OnboardingWalkthrough />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
