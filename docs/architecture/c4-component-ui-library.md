# C4 Component: Shared UI Library

## Overview

| Property | Value |
|----------|-------|
| **Name** | Shared UI Library |
| **Description** | 50+ accessible UI primitives following the shadcn/ui pattern built on Radix UI |
| **Type** | Component Library |
| **Technology** | Radix UI, class-variance-authority, tailwind-merge |

## Purpose

The Shared UI Library provides the foundational building blocks for all user interfaces in Tipid. It follows the shadcn/ui pattern: each component is a thin wrapper around a Radix UI primitive, styled with Tailwind CSS classes and managed with class-variance-authority (CVA) for variant support. Components are fully accessible (ARIA-compliant) and theme-aware via CSS custom properties.

## Components

| Component | File | Based On | Description |
|-----------|------|----------|-------------|
| Accordion | accordion.tsx | @radix-ui/react-accordion | Collapsible content sections |
| Alert | alert.tsx | Native | Status messages (info, warning, error) |
| Alert Dialog | alert-dialog.tsx | @radix-ui/react-alert-dialog | Confirmation dialogs |
| Aspect Ratio | aspect-ratio.tsx | @radix-ui/react-aspect-ratio | Maintain aspect ratios |
| Avatar | avatar.tsx | @radix-ui/react-avatar | User avatar with fallback |
| Badge | badge.tsx | Native | Status labels and tags |
| Breadcrumb | breadcrumb.tsx | Native | Navigation breadcrumbs |
| Button | button.tsx | @radix-ui/react-slot | 6 variants, 6 sizes, CVA-managed |
| Button Group | button-group.tsx | Native | Grouped button container |
| Calendar | calendar.tsx | react-day-picker | Date picker calendar |
| Card | card.tsx | Native | Content container with header/footer |
| Carousel | carousel.tsx | embla-carousel-react | Swipeable content carousel |
| Chart | chart.tsx | Recharts | Chart container with theme integration |
| Checkbox | checkbox.tsx | @radix-ui/react-checkbox | Boolean input |
| Collapsible | collapsible.tsx | @radix-ui/react-collapsible | Expandable content |
| Command | command.tsx | cmdk | Command palette / search |
| Context Menu | context-menu.tsx | @radix-ui/react-context-menu | Right-click menu |
| Dialog | dialog.tsx | @radix-ui/react-dialog | Modal dialog |
| Drawer | drawer.tsx | vaul | Bottom sheet drawer |
| Dropdown Menu | dropdown-menu.tsx | @radix-ui/react-dropdown-menu | Dropdown action menu |
| Empty | empty.tsx | Native | Empty state placeholder |
| Field | field.tsx | Native | Form field wrapper |
| Form | form.tsx | react-hook-form | Form context and validation |
| Hover Card | hover-card.tsx | @radix-ui/react-hover-card | Hover-triggered card |
| Input | input.tsx | Native | Text input field |
| Input Group | input-group.tsx | Native | Input with prefix/suffix |
| Input OTP | input-otp.tsx | input-otp | One-time password input |
| Item | item.tsx | Native | List item component |
| Kbd | kbd.tsx | Native | Keyboard shortcut display |
| Label | label.tsx | @radix-ui/react-label | Form label |
| Menubar | menubar.tsx | @radix-ui/react-menubar | Horizontal menu bar |
| Navigation Menu | navigation-menu.tsx | @radix-ui/react-navigation-menu | Navigation links |
| Pagination | pagination.tsx | Native | Page navigation |
| Popover | popover.tsx | @radix-ui/react-popover | Floating content |
| Progress | progress.tsx | @radix-ui/react-progress | Progress bar |
| Radio Group | radio-group.tsx | @radix-ui/react-radio-group | Single-select options |
| Resizable | resizable.tsx | react-resizable-panels | Resizable panels |
| Scroll Area | scroll-area.tsx | @radix-ui/react-scroll-area | Custom scrollbar container |
| Select | select.tsx | @radix-ui/react-select | Dropdown select |
| Separator | separator.tsx | @radix-ui/react-separator | Visual divider |
| Sheet | sheet.tsx | @radix-ui/react-dialog | Side panel overlay |
| Sidebar | sidebar.tsx | Native | Collapsible sidebar |
| Skeleton | skeleton.tsx | Native | Loading placeholder |
| Slider | slider.tsx | @radix-ui/react-slider | Range input |
| Sonner | sonner.tsx | sonner | Toast notifications |
| Spinner | spinner.tsx | Native | Loading spinner |
| Switch | switch.tsx | @radix-ui/react-switch | Toggle switch |
| Table | table.tsx | Native | Data table |
| Tabs | tabs.tsx | @radix-ui/react-tabs | Tabbed content |
| Textarea | textarea.tsx | Native | Multi-line text input |
| Toggle | toggle.tsx | @radix-ui/react-toggle | Toggle button |
| Toggle Group | toggle-group.tsx | @radix-ui/react-toggle-group | Grouped toggles |
| Tooltip | tooltip.tsx | @radix-ui/react-tooltip | Hover tooltip |

## Dependencies

| Dependency | Type | Purpose |
|-----------|------|---------|
| Radix UI | External | Accessible, unstyled UI primitives |
| class-variance-authority | External | Component variant management |
| tailwind-merge | External | Tailwind class conflict resolution |
| clsx | External | Conditional class joining |
| Embla Carousel | External | Carousel/swipe functionality |
| React Day Picker | External | Calendar component |
| Recharts | External | Chart rendering |
| Sonner | External | Toast notification system |
