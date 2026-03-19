# C4 Component: Core Application Shell

## Overview

| Property | Value |
|----------|-------|
| **Name** | Core Application Shell |
| **Description** | The top-level application structure that orchestrates routing, providers, error handling, and lazy loading |
| **Type** | Application Shell |
| **Technology** | React 19, Wouter, Framer Motion |

## Purpose

The Core Application Shell is the entry point of the Tipid application. It wraps the entire app in essential providers (ThemeProvider, TooltipProvider), sets up client-side routing via Wouter, manages lazy loading of page components with Suspense boundaries, and provides global error handling via ErrorBoundary. It also renders global UI elements like the Toaster (notifications), InstallPrompt (PWA), OfflineIndicator, and OnboardingWalkthrough.

## Code Elements

| File | Description | Lines |
|------|-------------|-------|
| `client/src/App.tsx` | Root component with providers, routing, and global UI | ~100 |
| `client/src/main.tsx` | React DOM entry point, renders `<App />` | ~10 |
| `client/src/components/AppLayout.tsx` | Layout wrapper for `/app/*` routes with bottom navigation | ~97 |
| `client/src/components/ErrorBoundary.tsx` | React error boundary with fallback UI | ~62 |

## Key Functions

| Function | Location | Description |
|----------|----------|-------------|
| `App()` | App.tsx | Root component: wraps everything in ErrorBoundary → ThemeProvider → TooltipProvider |
| `Router()` | App.tsx | Top-level route switch: `/` → Landing, `/app/*` → AppRoutes, `/404` → NotFound |
| `AppRoutes()` | App.tsx | App route switch with AppLayout wrapper, processes recurring transactions on mount |
| `AppSkeleton()` | App.tsx | Route-aware skeleton picker: shows DashboardSkeleton or HistorySkeleton based on current route |
| `PageLoader()` | App.tsx | Generic loading spinner for non-skeleton pages |

## Routing Structure

| Route | Component | Loading |
|-------|-----------|---------|
| `/` | Landing | Lazy + PageLoader |
| `/app` | Dashboard | Lazy + DashboardSkeleton |
| `/app/add` | AddTransaction | Lazy + PageLoader |
| `/app/wallets` | Wallets | Lazy + PageLoader |
| `/app/history` | History | Lazy + HistorySkeleton |
| `/app/settings` | Settings | Lazy + PageLoader |
| `/app/budgets` | Budgets | Lazy + PageLoader |
| `/app/goals` | Goals | Lazy + PageLoader |
| `/app/debts` | Debts | Lazy + PageLoader |
| `/app/recurring` | Recurring | Lazy + PageLoader |
| `/app/analytics` | Analytics | Lazy + PageLoader |
| `/app/transfer` | TransferPage | Lazy + PageLoader |
| `/app/summary` | MonthlySummary | Lazy + PageLoader |
| `*` | NotFound | Lazy + PageLoader |

## Dependencies

| Dependency | Type | Purpose |
|-----------|------|---------|
| ThemeProvider | Internal | Provides light/dark mode and color theme context |
| TooltipProvider | Internal (Radix) | Enables tooltips across the app |
| Toaster (Sonner) | Internal | Toast notification rendering |
| InstallPrompt | Internal | PWA install prompt |
| OfflineIndicator | Internal | Shows offline status banner |
| OnboardingWalkthrough | Internal | First-time user onboarding flow |
