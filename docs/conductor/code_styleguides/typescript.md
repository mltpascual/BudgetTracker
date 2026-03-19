# Tipid — TypeScript / React Style Guide

## Naming Conventions

| Element | Convention | Example |
|---------|-----------|---------|
| React Components | PascalCase | `Dashboard.tsx`, `AddTransaction.tsx` |
| Hooks | camelCase with `use` prefix | `useMobile.tsx`, `useNotifications.ts` |
| Utilities | camelCase | `utils.ts`, `store.ts` |
| Types/Interfaces | PascalCase | `Transaction`, `Account`, `UserSettings` |
| Constants | UPPER_SNAKE_CASE | `DEFAULT_CATEGORIES`, `CURRENCY_SYMBOLS` |
| Store actions | camelCase verbs | `addTransaction`, `updateSettings`, `exportData` |

## Component Patterns

- **Lazy loading**: All page components are lazy-loaded via `React.lazy()` with Suspense fallbacks
- **Skeleton loading**: Dashboard and History pages have dedicated skeleton components
- **Error boundaries**: Top-level `ErrorBoundary` wraps the entire app
- **Layout wrapper**: `AppLayout` provides consistent navigation for all `/app/*` routes

## State Management

- **Zustand** with `persist` middleware for all application state
- Single store (`useTipidStore`) contains all data models
- Selectors are used for derived data (e.g., `formatCurrency`)
- No server state — everything is client-side

## Styling

- **Tailwind CSS** utility classes as the primary styling method
- **CSS custom properties** for theme colors (defined in `index.css`)
- **class-variance-authority** for component variants
- **tailwind-merge** for class conflict resolution via `cn()` utility

## File Structure

- One component per file
- Co-locate related types with their store/component
- UI primitives in `components/ui/` (shadcn/ui pattern)
- Feature pages in `pages/app/`
