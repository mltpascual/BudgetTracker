# C4 Component: PWA and Infrastructure

## Overview

| Property | Value |
|----------|-------|
| **Name** | PWA and Infrastructure |
| **Description** | Progressive Web App support, internationalization, theming, and cross-cutting infrastructure concerns |
| **Type** | Infrastructure / Cross-Cutting |
| **Technology** | Workbox (vite-plugin-pwa), React Context, Custom Hooks |

## Purpose

This component encompasses all cross-cutting infrastructure concerns that support the application but are not tied to specific features. It includes the PWA layer (Service Worker, offline support, install prompt), the internationalization system (English/Filipino), the theme system (6 color themes + light/dark mode), and custom React hooks used across the application.

## Sub-Components

### Service Worker (Workbox)

The Service Worker is auto-generated at build time by `vite-plugin-pwa` using Workbox. It provides three caching strategies:

| Strategy | Target | Cache Name | Expiry |
|----------|--------|-----------|--------|
| **Precache** | All build assets (JS, CSS, HTML, images, fonts) | Workbox default | Updated on new build |
| **CacheFirst** | CloudFront CDN images | `cdn-images` | 30 days, max 50 entries |
| **CacheFirst** | Google Fonts webfonts | `google-fonts-webfonts` | 1 year, max 20 entries |
| **StaleWhileRevalidate** | Google Fonts stylesheets | `google-fonts-stylesheets` | Always fresh |

SPA navigation is handled via `navigateFallback: 'index.html'` with a denylist for `/api` routes.

### Internationalization (i18n)

| File | Description | Lines |
|------|-------------|-------|
| `client/src/lib/i18n.ts` | Translation system with English and Filipino dictionaries | 599 |

The i18n system provides a `useLanguage()` hook that returns the current language's translation object. It supports two languages: English (`en`) and Filipino (`fil`). The language preference is stored in `localStorage`. All user-facing strings are defined as translation keys.

### Theme System

| File | Description | Lines |
|------|-------------|-------|
| `client/src/contexts/ThemeContext.tsx` | Theme provider with color theme and dark mode support | 119 |
| `client/src/index.css` | CSS custom properties for all 12 theme combinations (6 colors x 2 modes) | ~500 |

The theme system manages two independent axes: **color theme** (teal, green, ocean, terracotta, lavender, charcoal) and **mode** (light, dark, system). Both are persisted to `localStorage`. The system uses OKLCH color space for perceptual uniformity.

### Custom Hooks

| Hook | File | Lines | Description |
|------|------|-------|-------------|
| `useMobile` | useMobile.tsx | 21 | Detects mobile viewport using `matchMedia('(max-width: 768px)')` |
| `useNotifications` | useNotifications.ts | 138 | Manages browser notification permissions and scheduling |
| `useComposition` | useComposition.ts | 81 | Handles IME composition events for input fields |
| `usePersistFn` | usePersistFn.ts | 20 | Memoizes callback functions that persist across renders |

## Build Configuration

| File | Description |
|------|-------------|
| `vite.config.ts` | Vite build config with PWA plugin, path aliases, manual chunk splitting |
| `tsconfig.json` | TypeScript configuration |
| `vercel.json` | Vercel deployment config with SPA rewrites |
| `playwright.config.ts` | E2E test configuration (Chromium, iPhone 15 Pro Max viewport) |

## Dependencies

| Dependency | Type | Purpose |
|-----------|------|---------|
| vite-plugin-pwa | External | Service Worker generation |
| Workbox | External | Caching strategies |
| React Context | Internal | Theme state distribution |
| localStorage | External | Language and theme persistence |
