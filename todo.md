# Tipid v1.2 — Todo

## 1. Replace Emoji Icons with Lucide SVG Icons
- [ ] Create a category icon mapping component using Lucide React icons
- [ ] Assign distinct colors per category (orange for food, blue for transport, pink for shopping, etc.)
- [ ] Replace emoji icons in store default categories
- [ ] Update all pages that render category icons: Dashboard, AddTransaction, History, Recurring, Analytics, Budgets

## 2. Export to CSV/JSON
- [ ] Add export section in Settings page
- [ ] Implement JSON export (full data backup)
- [ ] Implement CSV export (transaction history)
- [ ] Add download trigger using Blob + URL.createObjectURL

## 3. Category Customization
- [ ] Add "Manage Categories" section in Settings
- [ ] Build add category form with name, icon picker, color picker
- [ ] Build edit category flow
- [ ] Build delete category with safety check (no transactions using it)
- [ ] Update store with addCategory, updateCategory, deleteCategory actions

## 4. Onboarding Walkthrough
- [ ] Create onboarding state in store (hasCompletedOnboarding)
- [ ] Build multi-step walkthrough overlay component
- [ ] Design 4-5 steps with kalabaw mascot guiding user
- [ ] Auto-show on first visit, skip option, manual trigger from Settings
