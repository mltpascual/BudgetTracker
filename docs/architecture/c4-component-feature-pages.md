# C4 Component: Feature Pages

## Overview

| Property | Value |
|----------|-------|
| **Name** | Feature Pages |
| **Description** | Route-level page components providing all user-facing features |
| **Type** | UI Pages |
| **Technology** | React 19, Recharts, Framer Motion, React Hook Form, date-fns |

## Purpose

Feature Pages are the primary user-facing screens of the application. Each page corresponds to a route and provides a complete feature experience. All pages are lazy-loaded via `React.lazy()` for optimal bundle splitting. Pages consume data from the Zustand store and compose UI from the Shared UI Library and Domain Components.

## Pages

| Page | Route | Lines | Description |
|------|-------|-------|-------------|
| **Dashboard** | `/app` | 804 | Main overview: total balance card, income/expense summary, monthly budget progress, quick-add templates, recent transactions, spending insights |
| **Settings** | `/app/settings` | 991 | User preferences: name, currency, language, color theme, dark mode, data export/import, mock data, reset, about section |
| **History** | `/app/history` | 574 | Calendar view with transaction dots, daily transaction list, monthly income/expense summary |
| **Landing** | `/` | 415 | Marketing page: hero with mascot, 4-phone preview, 6 feature sections with mockup images, CTA |
| **MonthlySummary** | `/app/summary` | 398 | Shareable monthly report: income/expenses, top categories, budget status, savings progress |
| **Analytics** | `/app/analytics` | 378 | Spending breakdown: donut chart by category, daily average, top category, total spend |
| **Recurring** | `/app/recurring` | 375 | Manage recurring transactions: create, toggle active/inactive, delete, frequency settings |
| **Debts** | `/app/debts` | 288 | Debt tracking: add debts (owe/owed), record payments, track progress |
| **TransferPage** | `/app/transfer` | 275 | Transfer funds between accounts: select source/destination, enter amount |
| **AddTransaction** | `/app/add` | 246 | Add new transaction: type toggle, amount input, category picker, account selector, date, note |
| **Goals** | `/app/goals` | 247 | Savings goals: create goals with targets/deadlines, add savings, track progress bars |
| **Wallets** | `/app/wallets` | 234 | Account management: view all wallets, balances, add/edit accounts |
| **Budgets** | `/app/budgets` | 210 | Budget management: set monthly category limits, view spending vs. limit |
| **Home** | (redirect) | 8 | Simple redirect to `/app` |
| **NotFound** | `/404` | 49 | 404 error page with navigation back |

## Key Patterns

All feature pages follow consistent patterns. They consume state from the Zustand store using `useTipidStore` with selector functions. They compose UI from shadcn/ui primitives (Card, Button, Dialog, etc.) and domain components (CategoryIcon, AccountTypeIcon). Financial amounts are formatted using `formatCurrency()`. Pages use Framer Motion for entrance animations and Recharts for data visualizations.

## Dependencies

| Dependency | Type | Purpose |
|-----------|------|---------|
| State Management Layer | Internal | All data access via `useTipidStore` |
| Shared UI Library | Internal | Card, Button, Dialog, Select, Progress, etc. |
| Domain Components | Internal | CategoryIcon, AccountTypeIcon, SwipeableRow, SpendingInsights |
| Recharts | External | Donut charts (Analytics), bar charts (Dashboard) |
| Framer Motion | External | Page transitions and animations |
| React Hook Form + Zod | External | Form handling and validation |
| date-fns | External | Date formatting and manipulation |
| Lucide React | External | Icons throughout all pages |
