# Tipid — Product Context

## One-Line Description

Tipid is a free, offline-first personal budget tracker Progressive Web App (PWA) designed for Filipino users, featuring a friendly carabao mascot and bilingual support (English/Filipino).

## Problem Statement

Many Filipinos struggle to manage their personal finances due to a lack of accessible, free budgeting tools that work offline and respect user privacy. Existing solutions often require sign-ups, internet connectivity, or paid subscriptions, creating barriers for budget-conscious users.

## Solution Approach

Tipid provides a zero-friction budgeting experience: no sign-up, no server dependency, and no cost. All data is stored locally in the browser via `localStorage` (Zustand persist), ensuring complete privacy. The app is installable as a PWA and works fully offline. The UI is designed with a warm, approachable Filipino aesthetic ("Sawali Weave" — Filipino Craft Minimalism) and a lovable carabao (water buffalo) mascot.

## Target User Personas

| Persona | Description |
|---------|-------------|
| **Young Filipino Professional** | First-time budgeter, uses GCash/bank apps, wants a simple way to track spending on their phone |
| **Student** | Limited income, needs to track allowance and expenses, prefers free tools |
| **Freelancer** | Irregular income, needs to manage multiple wallets (cash, bank, e-wallet) and set savings goals |
| **Privacy-Conscious User** | Wants a budgeting tool that does not require sign-up or send data to servers |

## Core Features and Capabilities

| Feature | Status | Description |
|---------|--------|-------------|
| **Smart Dashboard** | Implemented | Overview of total balance, income/expenses, monthly budget progress, quick-add templates |
| **Multiple Wallets** | Implemented | Track Cash, Bank, E-Wallet (GCash), and Credit Card accounts with transfers between them |
| **Transaction Tracking** | Implemented | Add income/expense transactions with categories, notes, and account selection |
| **Budget Management** | Implemented | Set monthly category budgets and track spending against limits |
| **Savings Goals** | Implemented | Set target amounts with deadlines, track progress (e.g., Emergency Fund, Japan Trip) |
| **Debt Tracking** | Implemented | Track money owed and money others owe you |
| **Recurring Transactions** | Implemented | Auto-create daily/weekly/monthly transactions |
| **Analytics & Insights** | Implemented | Donut chart breakdown by category, daily average spend, top category |
| **Calendar History** | Implemented | Calendar view with transaction dots, monthly income/expense summary |
| **Monthly Summary** | Implemented | Shareable monthly report card |
| **Bilingual Support** | Implemented | English and Filipino (Tagalog) language toggle |
| **6 Color Themes** | Implemented | Green, Ocean Blue, Terracotta, Lavender, Teal, Charcoal+Gold |
| **Dark Mode** | Implemented | Light/Dark/System theme support |
| **PWA / Installable** | Implemented | Add to home screen, works offline via Service Worker |
| **Data Export/Import** | Implemented | JSON backup and restore |
| **Demo Data** | Implemented | Load/clear mock data for testing |

## Success Metrics

- Zero-cost to operate (static hosting on Vercel)
- Works 100% offline after first load
- No user data leaves the device
- Installable as a native-like app on mobile
- Bilingual accessibility (English + Filipino)

## Product Roadmap (High-Level)

- **v1.0–v1.6**: Core budgeting features (completed)
- **Future**: Edit transactions, enhanced monthly summary sharing, quick-add template management, additional i18n keys
