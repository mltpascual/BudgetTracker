# Design System: TipidBudget

**Tech Stack:** React + Vite + Tailwind CSS v4 + shadcn/ui + Framer Motion
**CSS Approach:** Tailwind CSS v4 with OKLCH CSS custom properties
**Last Updated:** March 2026

## 1. Brand Identity & Visual Atmosphere

Tipid is a mobile-first Progressive Web App (PWA) designed for "budgeting without the stress." The aesthetic is officially described in the codebase as **"Sawali Weave" — Filipino Craft Minimalism**.

The overall visual atmosphere is friendly, approachable, clean, and airy. It embraces a distinctly Filipino identity through its name ("Tipid" means thrifty/frugal), its carabao (water buffalo) mascot, and bilingual support (English and casual Taglish). The design prioritizes a generous use of whitespace, soft rounded corners, and a light, modern aesthetic that feels more like a native iOS application than a traditional website. The application features a mobile-first shell with a bottom navigation bar, constraining the desktop view to a phone-width centered layout to maintain the intended experience.

The system includes robust theming support, offering both Light and Dark modes, along with six distinct color themes that users can switch between.

## 2. Color Palette & Roles

The design system uses modern OKLCH color spaces for vibrant, perceptual color definition. The application supports six distinct color themes: Mint Green, Ocean Blue, Warm Terracotta, Soft Lavender, Deep Teal (Default), and Charcoal + Gold. 

The following table details the default **Deep Teal** theme.

### Core Colors (Deep Teal Theme)

| Role | Name | Value (Hex / OKLCH) | CSS Variable | Usage |
|------|------|---------------------|--------------|-------|
| **Primary** | Deep Teal | `#009294` / `oklch(0.58 0.14 195)` | `--primary` | Primary action buttons, active states, active navigation icons, and key highlights. |
| **Primary Foreground** | Ice White | `#f5fefe` / `oklch(0.99 0.01 195)` | `--primary-foreground` | Text color on primary buttons. |
| **Background** | Light Mint | `#e3f6f5` / `oklch(0.96 0.02 190)` | `--background` | The main application background, providing an airy, fresh feel. |
| **Foreground** | Near Black | `#001b1c` / `oklch(0.20 0.04 195)` | `--foreground` | Primary text color for headings and main body content. |
| **Card** | Crisp White | `#f8fdfc` / `oklch(0.99 0.005 190)` | `--card` | Background color for cards, panels, and elevated containers (often with 85% opacity for blur effects). |
| **Secondary** | Pale Teal | `#d6eeeb` / `oklch(0.93 0.025 190)` | `--secondary` | Secondary buttons and subtle background highlights. |
| **Muted** | Soft Gray-Teal | `#daeceb` / `oklch(0.93 0.02 190)` | `--muted` | Backgrounds for disabled states or subtle structural elements. |
| **Muted Foreground**| Medium Gray | `#486b6a` / `oklch(0.50 0.04 195)` | `--muted-foreground` | Secondary text, descriptions, inactive icons, and placeholders. |

### Semantic Colors

| Role | Name | Value (Hex / OKLCH) | CSS Variable | Usage |
|------|------|---------------------|--------------|-------|
| **Destructive** | Vibrant Red | `#e62b34` / `oklch(0.60 0.22 25)` | `--destructive` | Error states, delete actions, and negative financial values (expenses). |
| **Border / Input** | Soft Border | `#c6dddb` / `oklch(0.88 0.025 190)` | `--border` / `--input` | Borders for cards, inputs, and dividers. |
| **Ring** | Focus Ring | `#009294` / `oklch(0.58 0.14 195)` | `--ring` | Accessibility focus rings on interactive elements. |

### Dark Mode Adjustments

In dark mode, the application shifts to a deep, dark teal background (`oklch(0.13 0.02 195)`) with bright, high-contrast foreground text (`oklch(0.93 0.015 190)`). Cards become slightly lighter than the background to maintain elevation (`oklch(0.21 0.02 195)`), and borders become semi-transparent white (`oklch(1 0 0 / 15%)`). The primary accent colors remain vibrant but are slightly adjusted for better contrast against dark backgrounds.

## 3. Typography System

The application uses a single, unified font family across all elements to maintain the clean, minimalist aesthetic.

### Font Stack

**Primary Font:** `Nunito`, falling back to `system-ui, sans-serif`.
Nunito provides a friendly, rounded appearance that perfectly complements the approachable brand identity and the "Sawali Weave" aesthetic.

### Type Scale

| Level | Size | Weight | Line Height | Letter Spacing | Usage |
|-------|------|--------|-------------|----------------|-------|
| **Hero Heading** | 48px (`text-5xl`) | 900 (Black) | 60px | -1.2px | Main landing page hero text. |
| **Section Heading**| 36px (`text-4xl`) | 900 (Black) | 40px | Tight | Feature section titles. |
| **Card Title** | 18px (`text-lg`) | 600 (Semibold)| 28px | Normal | Titles within cards and dashboard widgets. |
| **Body Large** | 18px (`text-lg`) | 400 (Regular)| 29px | Normal | Hero descriptions and feature descriptions. |
| **Body Default** | 16px (`text-base`) | 400 (Regular)| 24px | Normal | Standard paragraph text and form inputs. |
| **Body Small** | 14px (`text-sm`) | 400/500 | 20px | Normal | Secondary text, buttons, and badges. |
| **Section Label** | 12px (`text-xs`) | 700 (Bold) | 16px | 1.2px (Widest) | Uppercase labels above section headings. |
| **Nav Label** | 10px | 400/600 | 12px | Normal | Bottom navigation icon labels. |

**Note:** Financial data and numbers utilize the `tabular-nums` CSS property to ensure digits align vertically in lists and tables.

## 4. Spacing & Layout

### Spacing Scale

The project relies on the standard Tailwind CSS spacing scale (4px base unit). 
Commonly observed spacing patterns:
- **Section Padding:** Generous vertical padding (`py-14` to `py-24`, or 56px to 96px) to create an airy feel.
- **Component Gap:** Standard gaps of `gap-2` (8px) for tight groupings and `gap-6` (24px) for looser associations.

### Grid & Container

- **Landing Page:** Uses a max-width container strategy. Hero sections use `max-w-5xl`, while feature sections use `max-w-6xl` with `mx-auto` and `px-5` for consistent edge padding.
- **App Layout:** The core application enforces a strict mobile-first container with `max-w-[430px]`. On desktop devices, this container is centered on the screen, mimicking a physical phone device.

## 5. Component Stylings

The project utilizes shadcn/ui components customized to fit the Tipid brand.

### Buttons
- **Shape:** Generously rounded. Default buttons use `rounded-md`, but primary call-to-action buttons on the landing page use full pill shapes (`rounded-full`).
- **Primary Variant:** Solid Deep Teal background (`bg-primary`) with Ice White text.
- **Outline Variant:** Transparent background with a 1px solid border (`border-border`) and text matching the foreground color. Used for secondary actions like "See how it works".
- **Interaction:** Buttons feature a subtle scale-down effect on click (`active:scale-95`) and smooth color transitions (`transition-colors`).

### Cards & Containers
- **Shape:** Soft, rounded corners (`rounded-xl` or `rounded-2xl`).
- **Surface:** Crisp White background (`bg-card`). In the app layout, navigational elements often use a slightly transparent background (`bg-card/90`) with a backdrop blur (`backdrop-blur-xl`) for a glassmorphism effect.
- **Borders:** Subtle 1px borders (`border-border`) are used to define edges without heavy shadows.

### Inputs & Forms
- **Shape:** `rounded-md` with a height of 36px (`h-9`).
- **Surface:** Transparent background with a solid border (`border-input`).
- **Focus State:** Features a distinct focus ring using the primary color (`focus-visible:ring-ring/50 focus-visible:ring-[3px]`), providing excellent accessibility.

### Navigation
- **Top Nav (Landing):** Sticky header with a glassmorphism effect (`bg-background/80 backdrop-blur-xl`) and a subtle bottom border.
- **Bottom Nav (App):** Fixed to the bottom of the screen, mimicking iOS native apps. Features 5 icons. The active state is denoted by the primary color, a thicker stroke weight, bold text, and an animated underline indicator (`layoutId="nav-indicator"`). The center "Add" button is elevated as a floating action button (FAB) with a solid primary background and full rounding.

### Badges
- **Shape:** Small, pill-like indicators (`rounded-md px-2 py-0.5`).
- **Usage:** Used for categories, status indicators, and small tags.

## 6. Depth & Elevation

The design system relies heavily on flat design with subtle borders rather than heavy drop shadows, aligning with the "minimalism" aspect of the brand.

- **Level 0 (Base):** The main background (`bg-background`).
- **Level 1 (Cards):** Defined primarily by borders and background color differences rather than shadows.
- **Level 2 (Floating Elements):** Elements like the bottom navigation bar and the floating action button use subtle shadows (`shadow-sm` or `shadow-lg shadow-primary/30`) to establish hierarchy.
- **Glassmorphism:** Used sparingly for sticky navigation elements, employing `backdrop-blur-xl` to allow underlying content to peek through softly.

## 7. Motion & Animation

Framer Motion and Tailwind's transition utilities are used to create a fluid, responsive feel.

- **Micro-interactions:** Buttons and clickable elements use `active:scale-95` for immediate tactile feedback.
- **Page Transitions:** Elements fade in and slide up (`y: 30` to `y: 0`) or slide in from the sides as they scroll into view, using a smooth easing curve (`ease: [0, 0, 0.2, 1]`).
- **Nav Indicator:** The active tab indicator in the bottom navigation uses a spring animation (`type: "spring", stiffness: 400, damping: 30`) to snap into place.

## 8. Iconography & Assets

- **Icons:** The project exclusively uses **Lucide React** for UI icons. Icons are typically rendered with a standard `strokeWidth` of 2, increasing to 2.5 for active states.
- **Mascot:** The carabao mascot is used strategically to inject personality. Different variations (Hero, Happy, with Coin) are used depending on the context.
- **Mockups:** High-quality device mockups are used extensively on the landing page to demonstrate the mobile-first nature of the application.

## 9. Accessibility Notes

- **Focus Indicators:** All interactive elements feature highly visible focus rings (`focus-visible:ring-[3px]`) using the primary brand color.
- **Color Contrast:** The text colors (`--foreground` and `--muted-foreground`) are designed to maintain strong contrast against their respective backgrounds in both light and dark modes.
- **Semantic HTML:** The use of shadcn/ui ensures that complex components (like dialogs, select menus, and tabs) utilize proper ARIA attributes and keyboard navigation patterns.

## 10. Design Conventions & Rules

- **Mobile-First Constraint:** The application strictly enforces a mobile form factor. Any new features or layouts must be designed for a narrow viewport (max 430px) first.
- **Theming:** All custom colors must be defined using OKLCH variables to support the dynamic theme-switching architecture. Hardcoded hex values should be avoided in component styles.
- **Bilingual Design:** UI elements must be designed to accommodate text expansion, as Filipino translations are often longer than their English counterparts.
- **Friendly Tone:** The visual design should always support the brand's goal of "budgeting without the stress." Avoid overly dense data displays or aggressive, alarming colors unless strictly necessary for destructive actions.
