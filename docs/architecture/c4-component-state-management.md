# C4 Component: State Management Layer

## Overview

| Property | Value |
|----------|-------|
| **Name** | State Management Layer |
| **Description** | Centralized Zustand store managing all application data with localStorage persistence |
| **Type** | Data Layer / State Management |
| **Technology** | Zustand 5.0.12 with persist middleware |

## Purpose

The State Management Layer is the single source of truth for all application data. It defines the complete data model (8 entity types), provides CRUD actions for each entity, handles derived computations (currency formatting, budget calculations), and automatically persists all state changes to `localStorage` under the key `tipid-storage`. This component also includes mock data generation for demo purposes and data export/import for backup functionality.

## Data Model

### Entity Types

| Entity | Key Fields | Description |
|--------|-----------|-------------|
| **Transaction** | id, amount, type (income/expense), categoryId, accountId, date, note, currency | Individual financial transaction |
| **Account** | id, name, type (cash/bank/ewallet/credit), balance, currency, icon, color | Financial account/wallet |
| **Category** | id, name, icon, color, type (income/expense) | Transaction category (Food, Transport, Salary, etc.) |
| **Budget** | id, categoryId, limit, period (monthly), currency | Monthly spending limit per category |
| **Goal** | id, name, targetAmount, currentAmount, deadline, note, currency | Savings goal with target and deadline |
| **Debt** | id, name, totalAmount, paidAmount, dueDate, note, type (owe/owed), currency | Debt tracking (I owe / They owe me) |
| **RecurringEntry** | id, amount, type, categoryId, accountId, note, frequency, nextDue, currency, active | Auto-recurring transaction template |
| **Transfer** | id, fromAccountId, toAccountId, amount, date, note, currency | Inter-account fund transfer |
| **QuickTemplate** | id, name, amount, type, categoryId, accountId, note, currency | One-tap transaction template |
| **UserSettings** | name, currency, theme, hasOnboarded | User preferences |

### Default Data

The store initializes with 15 default categories (10 expense, 5 income), 3 default accounts (Cash, Bank Account, GCash), and default settings (PHP currency, light theme).

## Store Actions

| Action | Parameters | Description |
|--------|-----------|-------------|
| `addTransaction` | Omit<Transaction, "id"> | Create transaction and update account balance |
| `deleteTransaction` | id | Delete transaction and reverse balance change |
| `updateTransaction` | id, Partial<Transaction> | Update transaction fields |
| `addAccount` | Omit<Account, "id"> | Create new financial account |
| `updateAccount` | id, Partial<Account> | Update account fields |
| `deleteAccount` | id | Remove account |
| `addBudget` | Omit<Budget, "id"> | Create category budget |
| `updateBudget` | id, Partial<Budget> | Update budget limit |
| `deleteBudget` | id | Remove budget |
| `addGoal` | Omit<Goal, "id"> | Create savings goal |
| `updateGoal` | id, Partial<Goal> | Update goal (add savings, change target) |
| `deleteGoal` | id | Remove goal |
| `addDebt` | Omit<Debt, "id"> | Create debt entry |
| `updateDebt` | id, Partial<Debt> | Update debt (add payment) |
| `deleteDebt` | id | Remove debt |
| `addRecurring` | Omit<RecurringEntry, "id"> | Create recurring entry |
| `updateRecurring` | id, Partial<RecurringEntry> | Update recurring entry |
| `deleteRecurring` | id | Remove recurring entry |
| `processRecurring` | (none) | Auto-create transactions for all due recurring entries |
| `addTransfer` | Omit<Transfer, "id"> | Create transfer between accounts |
| `deleteTransfer` | id | Remove transfer and reverse balance changes |
| `addTemplate` | Omit<QuickTemplate, "id"> | Create quick-add template |
| `deleteTemplate` | id | Remove template |
| `updateSettings` | Partial<UserSettings> | Update user preferences |
| `exportData` | (none) | Serialize all data to JSON string |
| `importData` | json: string | Restore all data from JSON string |
| `resetAll` | (none) | Reset to default state |
| `loadMockData` | (none) | Load demo data for testing |
| `clearMockData` | (none) | Remove demo data |

## Utility Functions

| Function | Signature | Description |
|----------|-----------|-------------|
| `generateId()` | `() => string` | Generate unique ID using timestamp + random |
| `formatCurrency(amount, currency)` | `(number, string) => string` | Format number with currency symbol (₱, $, etc.) |

## Supported Currencies

| Code | Symbol |
|------|--------|
| PHP | ₱ |
| USD | $ |
| EUR | € |
| JPY | ¥ |
| GBP | £ |
| KRW | ₩ |
| SGD | S$ |
| AUD | A$ |
| CAD | C$ |

## Code Elements

| File | Description | Lines |
|------|-------------|-------|
| `client/src/lib/store.ts` | Main Zustand store with all types, actions, and persistence | 565 |
| `client/src/lib/mockData.ts` | Mock data generator for demo mode | 281 |
| `client/src/lib/utils.ts` | `cn()` utility for Tailwind class merging | 6 |
| `shared/const.ts` | Shared constants (cookie name, time values) | 2 |

## Dependencies

| Dependency | Type | Purpose |
|-----------|------|---------|
| Zustand | External | State management library |
| zustand/middleware (persist) | External | localStorage persistence |
| Browser localStorage | External | Data storage under `tipid-storage` key |
