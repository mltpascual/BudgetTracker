# Design System: Tipid

**Tech Stack:** React 19 + Vite 7 + Tailwind CSS 4 + Radix UI (shadcn/ui pattern)
**CSS Approach:** Tailwind utility-first with OKLCH CSS custom properties and 6 switchable color themes
**Last Updated:** March 19, 2026

## 1. Visual Theme and Atmosphere

Tipid's design philosophy is called **"Sawali Weave" — Filipino Craft Minimalism**. The aesthetic draws inspiration from traditional Filipino woven bamboo (sawali) patterns, translating their warmth and texture into a digital interface that feels handcrafted, approachable, and distinctly Filipino.

The overall mood is **warm, friendly, and spacious**. The app uses generous whitespace, softly rounded corners, and a light mint-green wash that evokes sunlight filtering through leaves. Cards use a frosted-glass translucency (`85% opacity` on card backgrounds) to create a dreamy, layered depth without heavy shadows. Text is rendered in warm charcoal tones rather than pure black, maintaining a gentle contrast that is easy on the eyes.

The app features a lovable **carabao (water buffalo) mascot** that appears on the Dashboard and Landing page, reinforcing the Filipino identity and adding personality. The mascot is a cozy companion rather than a corporate logo — it lives naturally within the UI.

Tipid supports both **light and dark modes** via a `ThemeProvider` that applies `.dark` class to the HTML root. Dark mode shifts backgrounds to deep teal-charcoal tones while maintaining the same warm, approachable character. The system also supports automatic detection via `prefers-color-scheme`.

## 2. Color Palette and Roles

Tipid offers **6 switchable color themes**, each with light and dark variants. Colors are defined using the **OKLCH color space** for perceptual uniformity. The default theme is "Deep Teal."

### Default Theme: Deep Teal (Light Mode)

| Role | Descriptive Name | OKLCH Value | CSS Variable | Usage |
|------|-----------------|-------------|-------------|-------|
| Primary | Deep Teal | `oklch(0.58 0.14 195)` | `--primary` | Action buttons, active nav indicators, progress bars, links |
| Primary Foreground | Near-White Teal Tint | `oklch(0.99 0.01 195)` | `--primary-foreground` | Text on primary-colored backgrounds |
| Background | Pale Mint Wash | `oklch(0.96 0.02 190)` | `--background` | Page background, overall canvas |
| Foreground | Deep Teal-Charcoal | `oklch(0.20 0.04 195)` | `--foreground` | Primary body text, headings |
| Card | Frosted White Glass | `oklch(0.99 0.005 190 / 85%)` | `--card` | Card backgrounds with 85% opacity for frosted effect |
| Secondary | Soft Mint | `oklch(0.93 0.025 190)` | `--secondary` | Secondary buttons, subtle backgrounds |
| Muted | Whisper Mint | `oklch(0.93 0.02 190)` | `--muted` | Disabled states, placeholder areas |
| Muted Foreground | Mid-Tone Sage | `oklch(0.50 0.04 195)` | `--muted-foreground` | Secondary text, captions, timestamps |
| Destructive | Warm Coral-Red | `oklch(0.60 0.22 25)` | `--destructive` | Delete buttons, error states, negative amounts |
| Border | Soft Sage Line | `oklch(0.88 0.025 190)` | `--border` | Card borders, dividers, input borders |
| Ring | Teal Focus Glow | `oklch(0.58 0.14 195)` | `--ring` | Focus ring on interactive elements |

### All 6 Color Themes

| Theme ID | Display Name | Filipino Name | Primary Preview Color | Hue Family |
|----------|-------------|---------------|----------------------|------------|
| `teal` | Deep Teal | Malalim na Teal | `oklch(0.58 0.14 195)` | Teal (195) |
| `green` | Fresh Green | Berdeng Mint | `oklch(0.65 0.19 145)` | Green (145) |
| `ocean` | Ocean Blue | Asul ng Dagat | `oklch(0.55 0.18 250)` | Blue (250) |
| `terracotta` | Warm Terracotta | Mainit na Terracotta | `oklch(0.62 0.16 45)` | Orange-Brown (45) |
| `lavender` | Soft Lavender | Malambot na Lavender | `oklch(0.58 0.18 300)` | Purple (300) |
| `charcoal` | Charcoal + Gold | Uling at Ginto | `oklch(0.72 0.16 85)` | Gold (85) |

Theme switching is implemented via CSS classes on the `<html>` element (e.g., `html.theme-ocean`, `html.theme-charcoal`). Each theme redefines all CSS custom properties to maintain a cohesive palette.

### Chart Colors

Five chart colors are defined per theme for data visualizations (Recharts donut charts, bar charts):

| Variable | Purpose |
|----------|---------|
| `--chart-1` | Primary data series |
| `--chart-2` | Secondary data series |
| `--chart-3` | Tertiary data series |
| `--chart-4` | Quaternary data series |
| `--chart-5` | Quinary data series |

### Semantic Colors (Category-Specific)

Transaction categories use fixed colors independent of the theme:

| Category | Color | Hex |
|----------|-------|-----|
| Food | Warm Orange | `#f97316` |
| Transport | Sky Blue | `#3b82f6` |
| Bills | Violet | `#8b5cf6` |
| Shopping | Hot Pink | `#ec4899` |
| Health | Red | `#ef4444` |
| Entertainment | Indigo | `#6366f1` |
| Education | Cyan | `#0ea5e9` |
| Groceries | Green | `#22c55e` |
| Rent | Purple | `#a855f7` |
| Others | Slate | `#64748b` |

## 3. Typography System

### Font Stack

Tipid uses a **single font family** across all elements for a unified, cohesive feel:

| Role | Font Family | CSS Variable | Fallback |
|------|------------|-------------|----------|
| Display (Headings) | Nunito | `--font-display` | system-ui, sans-serif |
| Body Text | Nunito | `--font-body` | system-ui, sans-serif |
| Sans (Default) | Nunito | `--font-sans` | system-ui, sans-serif |

**Nunito** is a well-balanced sans-serif with rounded terminals, giving the entire app a friendly, approachable character. It is loaded from Google Fonts with weights 400 through 900.

### Type Scale

| Level | Usage | Weight | Tailwind Class | Notes |
|-------|-------|--------|---------------|-------|
| Page Title | "Dashboard", "Wallets" | 900 (Black) | `font-black font-display` | Largest text, one per page |
| Section Heading | "Monthly Budget", "Quick Add" | 700 (Bold) | `font-bold` | Card/section titles |
| Body | Transaction descriptions, labels | 400–500 | `font-body` / `font-medium` | Default reading text |
| Caption | Timestamps, secondary info | 400 | `text-muted-foreground` | Smaller, muted color |
| Financial Numbers | ₱17,461.00 | 600–700 | `tabular-nums` | Tabular number variant for alignment |

Headings use `tracking-tight` (tighter letter spacing) applied globally via the base layer. Financial figures use `font-variant-numeric: tabular-nums` for proper column alignment.

## 4. Spacing and Layout

### Spacing Scale

The app follows Tailwind's default 4px-based spacing scale. Common spacing patterns observed:

| Context | Value | Tailwind | Usage |
|---------|-------|----------|-------|
| Card internal padding | 16px | `p-4` | Standard card content padding |
| Section gap | 16–24px | `gap-4` / `gap-6` | Space between cards and sections |
| Page padding | 16px (mobile), 24px (tablet), 32px (desktop) | `px-4` / `px-6` / `px-8` | Responsive page margins |
| Button padding | 16px horizontal, 8px vertical | `px-4 py-2` | Default button size |

### Grid and Container

The app uses a **single-column mobile-first layout** with a maximum container width of `1280px` on large screens. The container is centered with auto margins and responsive padding:

| Breakpoint | Container Padding | Max Width |
|-----------|-------------------|-----------|
| Default (mobile) | 16px (`1rem`) | 100% |
| `sm` (640px+) | 24px (`1.5rem`) | 100% |
| `lg` (1024px+) | 32px (`2rem`) | 1280px |

### Responsive Behavior

The app is designed **mobile-first** for iPhone-sized viewports (tested at 430x932, iPhone 15 Pro Max). The layout is a single column with a fixed bottom navigation bar. On larger screens, the content area expands but maintains the single-column card layout.

## 5. Component Stylings

### Buttons

Buttons use `class-variance-authority` for variant management with 6 variants and 6 sizes:

| Variant | Appearance | Usage |
|---------|-----------|-------|
| `default` | Solid primary background, white text | Primary actions (Add Transaction, Save) |
| `destructive` | Solid red background, white text | Delete, remove actions |
| `outline` | Transparent with border | Secondary actions, filters |
| `secondary` | Soft secondary background | Less prominent actions |
| `ghost` | Transparent, hover reveals accent | Toolbar actions, icon buttons |
| `link` | Text-only with underline on hover | Inline navigation links |

All buttons have `rounded-md` corners (subtly rounded), `transition-all` for smooth state changes, and a 3px focus ring using `--ring` color. Disabled buttons use `opacity-50` with `pointer-events-none`.

### Cards and Containers

Cards are the primary content containers, featuring the signature frosted-glass effect:

| Property | Value | Description |
|----------|-------|-------------|
| Background | `oklch(0.99 0.005 190 / 85%)` | Near-white with 85% opacity for translucency |
| Border Radius | `var(--radius)` = `1rem` (16px) | Generously rounded, "bubble" feel |
| Border | `1px solid var(--border)` | Subtle sage-tinted border |
| Shadow | None (flat design) | Depth from translucency, not shadows |
| Padding | `1rem` (16px) | Comfortable internal spacing |

The total balance card on the Dashboard uses a solid primary-colored background (`--primary`) with white text, creating a prominent visual anchor.

### Inputs and Forms

| Property | Value | Description |
|----------|-------|-------------|
| Border | `1px solid var(--input)` | Matches the overall border tone |
| Border Radius | `rounded-md` | Consistent with button rounding |
| Focus Ring | `3px ring` in `--ring` color | Clear focus indicator for accessibility |
| Error State | `ring-destructive/20` | Red-tinted ring for validation errors |

### Navigation

The app uses a **fixed bottom tab bar** with 5 tabs: Home, Wallets, (+) Add, History, Settings. The center "+" button is a prominent circular primary-colored FAB (Floating Action Button). Active tabs are indicated by the primary color on both icon and label text.

### Modals and Dialogs

Modals use Radix UI's Dialog primitive with:

| Property | Value |
|----------|-------|
| Overlay | Semi-transparent dark backdrop |
| Container | Card-styled with `--card` background |
| Border Radius | `var(--radius-lg)` |
| Animation | Fade-in with subtle scale (Framer Motion) |

### Data Display

Financial data uses `tabular-nums` for aligned columns. Transaction lists use swipeable rows (`SwipeableRow` component) with swipe-to-reveal actions. Category breakdowns use Recharts donut charts with the 5 chart colors.

## 6. Depth and Elevation

Tipid follows a **deliberately flat design philosophy**. Depth is achieved through **layered translucency** rather than shadows:

| Layer | Technique | Example |
|-------|-----------|---------|
| Background | Solid pale mint wash | Page canvas |
| Cards | 85% opacity frosted white | Content containers |
| Overlays | Semi-transparent dark backdrop | Modal overlays |
| FAB | Solid primary color, slightly elevated | Center "+" button |

There are no box-shadow definitions in the design system. The z-index strategy is minimal, primarily used for the fixed bottom navigation and modal overlays.

## 7. Motion and Animation

Tipid uses **Framer Motion** for page transitions and component animations. The motion philosophy is "slow and organic — like a hammock swaying":

| Pattern | Duration | Easing | Description |
|---------|----------|--------|-------------|
| Page fade-up | 600ms | `[0, 0, 0.2, 1]` | Content rises gently into view |
| Page fade-left/right | 600ms | `[0, 0, 0.2, 1]` | Alternating feature sections on Landing |
| Button/link transitions | Default (`150ms`) | `transition-all` | Smooth color/opacity changes |
| Skeleton pulse | CSS animation | `animate-pulse` | Loading placeholder shimmer |

The `viewport: { once: true, margin: "-60px" }` pattern ensures animations trigger once when elements scroll into view, with a 60px offset for early triggering.

## 8. Iconography and Assets

### Icon Library

Tipid uses **Lucide React** (`lucide-react@0.453.0`) for all UI icons. Icons are rendered at `size-4` (16px) by default within buttons, with larger sizes for navigation and feature icons.

### Mascot Assets

The carabao mascot is served from CloudFront CDN in three poses:

| Pose | Usage |
|------|-------|
| Hero | Landing page main illustration |
| Happy | Feature sections, success states |
| Coin | Dashboard companion, financial tips |

### PWA Icons

The app icon is a 512x512 PNG of the Tipid mascot, served from CloudFront with `purpose: "any maskable"` for PWA installation.

## 9. Accessibility Notes

The design system incorporates several accessibility considerations:

| Feature | Implementation |
|---------|---------------|
| Focus Indicators | 3px ring using `--ring` color on all interactive elements |
| Color Contrast | Foreground/background pairs maintain readable contrast in all 6 themes |
| ARIA Patterns | Radix UI primitives provide built-in ARIA attributes for dialogs, menus, tabs |
| Keyboard Navigation | All interactive elements are keyboard-accessible via Radix primitives |
| Reduced Motion | Not explicitly implemented (potential improvement area) |
| Screen Reader | Error boundaries provide fallback content; form validation uses `aria-invalid` |

## 10. Design Conventions and Rules

**Naming Convention:** Components follow PascalCase (`AddTransaction.tsx`), utilities use camelCase (`formatCurrency`), and CSS variables use kebab-case (`--primary-foreground`).

**Color Application Rule:** Never use raw color values in components. Always reference CSS custom properties via Tailwind's semantic color classes (`bg-primary`, `text-muted-foreground`, `border-border`). This ensures all 6 themes and dark mode work automatically.

**Card Composition Pattern:** Every content section is wrapped in a card container. Cards stack vertically in a single column. The top card (balance/summary) uses a primary-colored background; subsequent cards use the frosted-glass style.

**Financial Display Rule:** All currency amounts use `formatCurrency()` which prepends the correct symbol (₱, $, etc.) and formats with 2 decimal places using `en-PH` locale. Negative amounts show a minus sign before the symbol.

**Responsive Strategy:** Design mobile-first at 430px width. Content reflows naturally on larger screens via Tailwind responsive utilities. No separate desktop layout exists — the app is fundamentally a mobile experience.

**Theme Switching:** Color themes are applied via CSS class on `<html>` (e.g., `html.theme-ocean`). Dark mode is a separate toggle via `.dark` class. Both can be combined (e.g., `html.theme-ocean.dark`). All 12 combinations (6 themes x 2 modes) are fully defined.

**Custom Scrollbar:** A themed scrollbar is applied globally using `--scrollbar-color`, appearing as a thin 5px rounded track that matches the current theme's primary color at 25% opacity.
