import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Landing from "./pages/Landing";
import AppLayout from "./components/AppLayout";
import Dashboard from "./pages/app/Dashboard";
import AddTransaction from "./pages/app/AddTransaction";
import Wallets from "./pages/app/Wallets";
import History from "./pages/app/History";
import Settings from "./pages/app/Settings";
import Budgets from "./pages/app/Budgets";
import Goals from "./pages/app/Goals";
import Debts from "./pages/app/Debts";
import Recurring from "./pages/app/Recurring";
import Analytics from "./pages/app/Analytics";
import TransferPage from "./pages/app/TransferPage";
import MonthlySummary from "./pages/app/MonthlySummary";

function AppRoutes() {
  return (
    <AppLayout>
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
    </AppLayout>
  );
}

function Router() {
  return (
    <Switch>
      <Route path="/" component={Landing} />
      <Route path="/app/:rest*" component={AppRoutes} />
      <Route path="/app" component={AppRoutes} />
      <Route path="/404" component={NotFound} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light" switchable>
        <TooltipProvider>
          <Toaster position="top-center" />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
