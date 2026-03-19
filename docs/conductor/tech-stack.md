# Tipid — Tech Stack

## Architecture Overview

Tipid is a **client-side-only Progressive Web App** (PWA). There is no backend database or API — all data is persisted in the browser's `localStorage` via Zustand's persist middleware. A minimal Express server exists solely to serve the static build in production, but the app is deployed as a static site on Vercel.

## Primary Languages and Frameworks

| Technology | Version | Purpose |
|-----------|---------|---------|
| **TypeScript** | 5.6.3 | Primary language for all source code |
| **React** | 19.2.1 | UI framework |
| **Vite** | 7.1.7 | Build tool and dev server |
| **Tailwind CSS** | 4.1.14 | Utility-first CSS framework |
| **Zustand** | 5.0.12 | Client-side state management with localStorage persistence |
| **Wouter** | 3.3.5 | Lightweight client-side routing (patched) |

## Key Dependencies

| Package | Version | Purpose |
|---------|---------|---------|
| **Radix UI** | Various (latest) | Accessible, unstyled UI primitives (Dialog, Select, Tabs, Popover, etc.) |
| **Framer Motion** | 12.23.22 | Animations and transitions |
| **Recharts** | 2.15.2 | Chart components (donut charts, bar charts) |
| **Lucide React** | 0.453.0 | Icon library |
| **date-fns** | 4.1.0 | Date manipulation utilities |
| **React Hook Form** | 7.64.0 | Form state management |
| **Zod** | 4.1.12 | Schema validation |
| **Sonner** | 2.0.7 | Toast notifications |
| **React Day Picker** | 9.11.1 | Calendar component |
| **class-variance-authority** | 0.7.1 | Component variant management |
| **tailwind-merge** | 3.3.1 | Tailwind class conflict resolution |
| **nanoid** | 5.1.5 | Unique ID generation |
| **next-themes** | 0.4.6 | Theme (light/dark/system) management |
| **Embla Carousel** | 8.6.0 | Carousel/swipe component |

## Infrastructure and Deployment

| Aspect | Details |
|--------|---------|
| **Hosting** | Vercel (static site) |
| **Domain** | tipidbudget.vercel.app |
| **Build Command** | `vite build` |
| **Output Directory** | `dist/public` |
| **Routing** | Client-side SPA with Vercel rewrites (`/* → /index.html`) |
| **CDN** | CloudFront for mascot images and PWA icons |
| **PWA** | vite-plugin-pwa with Workbox for offline caching |

## Development Tools and Environment

| Tool | Purpose |
|------|---------|
| **pnpm** | Package manager (v10.4.1) |
| **Prettier** | Code formatting |
| **TypeScript Compiler** | Type checking (`tsc --noEmit`) |
| **Playwright** | End-to-end testing |
| **Vitest** | Unit testing (configured but not heavily used) |

## Testing Frameworks

| Framework | Scope | Config |
|-----------|-------|--------|
| **Playwright** | E2E testing | `playwright.config.ts` — Chromium, iPhone 15 Pro Max viewport (430x932) |
| **Vitest** | Unit testing | Available via Vite integration |

## Code Quality Tools

- **Prettier** for consistent formatting (`.prettierrc`, `.prettierignore`)
- **TypeScript strict mode** for type safety
- **ESLint** (implicit via Vite React plugin)

## Build Optimization

The Vite config includes manual chunk splitting for optimal loading:
- `vendor-react`: React and React DOM
- `vendor-charts`: Recharts
- `vendor-motion`: Framer Motion
- `vendor-ui`: All Radix UI components

## Data Persistence

All application data is stored in `localStorage` under the key `tipid-storage` using Zustand's persist middleware. The data model includes:
- Transactions, Accounts, Categories, Budgets, Goals, Debts, Recurring Entries, Transfers, Quick Templates, and User Settings.
