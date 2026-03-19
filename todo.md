# Tipid v1.1 — New Features

## Recurring Transactions
- [ ] Add RecurringEntry type to store (frequency: daily/weekly/monthly/yearly, nextDue, active)
- [ ] Add CRUD actions for recurring entries in store
- [ ] Add auto-processing logic that creates transactions from due recurring entries on app load
- [ ] Build RecurringTransactions page with list, add dialog, edit/delete
- [ ] Add route and navigation link

## Spending Analytics
- [ ] Build Analytics page with date range selector (monthly)
- [ ] Add pie chart for expense category breakdown (Recharts PieChart)
- [ ] Add bar chart for monthly income vs expense trend (Recharts BarChart)
- [ ] Add summary stats (top category, average daily spend, etc.)
- [ ] Add route and navigation link

## Transfer Between Wallets
- [ ] Add Transfer type to store (fromAccountId, toAccountId, amount, date, note)
- [ ] Add transfer action that debits source and credits destination
- [ ] Build Transfer page/dialog accessible from Wallets page
- [ ] Show transfers in transaction history with distinct styling
- [ ] Add route and navigation link

## Integration
- [ ] Update Dashboard with quick links to new features
- [ ] Update AppLayout bottom nav or add to settings/more menu
- [ ] Test all features end-to-end
- [ ] Save checkpoint
