# C4 Component: Domain Components

## Overview

| Property | Value |
|----------|-------|
| **Name** | Domain Components |
| **Description** | Business-specific shared components that encode Tipid's domain logic and UI patterns |
| **Type** | Domain UI Components |
| **Technology** | React 19, Framer Motion, Recharts |

## Purpose

Domain Components are shared React components that encapsulate Tipid-specific business logic and UI patterns. Unlike the generic Shared UI Library, these components understand the app's domain: financial categories, account types, transaction display, spending analysis, and user onboarding. They are reused across multiple Feature Pages.

## Components

| Component | File | Lines | Description |
|-----------|------|-------|-------------|
| **CategoryIcon** | CategoryIcon.tsx | 165 | Renders the appropriate Lucide icon for a transaction category with its associated color. Maps category IDs (food, transport, bills, etc.) to icon components. |
| **AccountTypeIcon** | AccountTypeIcon.tsx | 53 | Renders the appropriate icon for an account type (cash, bank, ewallet, credit) with color coding. |
| **SwipeableRow** | SwipeableRow.tsx | 201 | Touch-enabled swipeable list row with reveal actions (edit, delete). Uses touch events for mobile gesture support. |
| **SpendingInsights** | SpendingInsights.tsx | 278 | AI-style spending analysis widget that calculates and displays insights: daily average, top category, budget warnings, savings rate, spending trends. |
| **EditTransactionDialog** | EditTransactionDialog.tsx | 287 | Modal dialog for editing existing transactions. Pre-fills form with transaction data, validates changes, updates store. |
| **AppLayout** | AppLayout.tsx | 97 | Layout wrapper for all `/app/*` routes. Provides the fixed bottom navigation bar with 5 tabs (Home, Wallets, +Add, History, Settings). |
| **OnboardingWalkthrough** | OnboardingWalkthrough.tsx | 223 | Multi-step onboarding flow for first-time users. Introduces app features with animated slides. Checks `hasOnboarded` setting. |
| **Onboarding** | Onboarding.tsx | 194 | Welcome screen component with name input and currency selection for initial setup. |
| **InstallPrompt** | InstallPrompt.tsx | 177 | Custom PWA install prompt that appears after the user has used the app. Detects `beforeinstallprompt` event. |
| **OfflineIndicator** | OfflineIndicator.tsx | 60 | Banner that appears when the device goes offline, using `navigator.onLine` detection. |
| **ManusDialog** | ManusDialog.tsx | 85 | Specialized dialog component for the Manus platform integration. |
| **Map** | Map.tsx | 155 | Map component (likely for location-based features, future use). |
| **DashboardSkeleton** | skeletons/DashboardSkeleton.tsx | 104 | Loading skeleton that mimics the Dashboard layout during lazy loading. |
| **HistorySkeleton** | skeletons/HistorySkeleton.tsx | 77 | Loading skeleton that mimics the History page layout during lazy loading. |
| **ErrorBoundary** | ErrorBoundary.tsx | 62 | React error boundary that catches render errors and displays a friendly fallback UI. |

## Dependencies

| Dependency | Type | Purpose |
|-----------|------|---------|
| State Management Layer | Internal | Data access via `useTipidStore` |
| Shared UI Library | Internal | Card, Button, Dialog, Progress, etc. |
| Lucide React | External | Icon rendering for categories and accounts |
| Framer Motion | External | Onboarding animations, swipe gestures |
| Recharts | External | SpendingInsights charts |
