# Tipid — Workflow

## Development Methodology

- Feature development follows an iterative approach with version milestones (v1.0 through v1.6+)
- Each version introduces a focused set of features documented in test result files (`v1.x-test-results.md`)
- UI/UX changes are brainstormed before implementation using the "Sawali Weave" design philosophy

## Git Workflow

| Aspect | Convention |
|--------|-----------|
| **Primary Branch** | `main` |
| **Commit Style** | Descriptive messages |
| **Hosting** | GitHub (`mltpascual/BudgetTracker`) |
| **Deployment** | Auto-deploy to Vercel on push to `main` |

## Development Commands

| Command | Purpose |
|---------|---------|
| `pnpm dev` | Start Vite dev server on port 3000 |
| `pnpm build` | Production build to `dist/public` |
| `pnpm preview` | Preview production build locally |
| `pnpm check` | TypeScript type checking (`tsc --noEmit`) |
| `pnpm format` | Format code with Prettier |

## Testing Requirements

- **E2E Tests**: Playwright tests in `e2e/tipid.spec.ts` covering core user flows
- **Viewport**: Tests run against iPhone 15 Pro Max (430x932) to ensure mobile-first quality
- **Test Results**: Documented per version in `v1.x-test-results.md` files

## Quality Assurance Gates

1. TypeScript compilation must pass (`pnpm check`)
2. Prettier formatting must be applied (`pnpm format`)
3. E2E tests must pass on Chromium
4. Manual testing on mobile viewport

## Deployment Procedure

1. Push changes to `main` branch
2. Vercel automatically builds and deploys
3. Build command: `vite build`
4. Output: `dist/public`
5. SPA routing handled by Vercel rewrites configuration

## File Organization Conventions

| Directory | Purpose |
|-----------|---------|
| `client/src/pages/` | Top-level route pages (Landing, Home, NotFound) |
| `client/src/pages/app/` | App feature pages (Dashboard, Wallets, etc.) |
| `client/src/components/` | Shared React components |
| `client/src/components/ui/` | Radix-based UI primitives (shadcn/ui pattern) |
| `client/src/components/skeletons/` | Loading skeleton components |
| `client/src/contexts/` | React context providers |
| `client/src/hooks/` | Custom React hooks |
| `client/src/lib/` | Utilities, store, i18n, mock data |
| `shared/` | Shared constants between client and server |
| `server/` | Minimal Express server for production serving |
| `e2e/` | Playwright E2E test files |
