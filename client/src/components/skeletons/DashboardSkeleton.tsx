/**
 * Content-aware skeleton for Dashboard page.
 * Mirrors: greeting, balance card, budget bar, quick links grid,
 * spending insights, and recent transactions.
 */
export default function DashboardSkeleton() {
  return (
    <div className="p-4 pb-24 space-y-4 animate-pulse">
      {/* Greeting + avatar */}
      <div className="flex items-center justify-between">
        <div className="space-y-1.5">
          <div className="h-3 w-24 bg-muted rounded" />
          <div className="h-6 w-32 bg-muted rounded" />
        </div>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-muted rounded-lg" />
          <div className="w-10 h-10 bg-muted rounded-full" />
        </div>
      </div>

      {/* Tip bubble */}
      <div className="h-14 bg-muted rounded-2xl" />

      {/* Balance card */}
      <div className="bg-muted rounded-3xl p-5 space-y-4">
        <div className="h-3 w-24 bg-muted-foreground/10 rounded" />
        <div className="h-8 w-40 bg-muted-foreground/10 rounded" />
        <div className="flex gap-8">
          <div className="space-y-1">
            <div className="h-3 w-12 bg-muted-foreground/10 rounded" />
            <div className="h-4 w-24 bg-muted-foreground/10 rounded" />
          </div>
          <div className="space-y-1">
            <div className="h-3 w-12 bg-muted-foreground/10 rounded" />
            <div className="h-4 w-24 bg-muted-foreground/10 rounded" />
          </div>
        </div>
      </div>

      {/* Monthly Budget */}
      <div className="bg-card rounded-2xl p-4 space-y-3 border border-border">
        <div className="flex justify-between">
          <div className="h-4 w-28 bg-muted rounded" />
          <div className="h-4 w-16 bg-muted rounded" />
        </div>
        <div className="h-2.5 bg-muted rounded-full" />
        <div className="flex justify-between">
          <div className="h-3 w-20 bg-muted rounded" />
          <div className="h-3 w-20 bg-muted rounded" />
          <div className="h-3 w-20 bg-muted rounded" />
        </div>
      </div>

      {/* Quick Links 4x2 grid */}
      <div className="grid grid-cols-4 gap-2">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="flex flex-col items-center gap-1.5 py-3">
            <div className="w-10 h-10 bg-muted rounded-xl" />
            <div className="h-2.5 w-12 bg-muted rounded" />
          </div>
        ))}
      </div>

      {/* Spending Insights */}
      <div className="space-y-3">
        <div className="h-5 w-32 bg-muted rounded" />
        {Array.from({ length: 3 }).map((_, i) => (
          <div
            key={i}
            className="flex items-center gap-3 bg-card rounded-2xl p-4 border border-border"
          >
            <div className="w-8 h-8 bg-muted rounded-full" />
            <div className="flex-1 space-y-1.5">
              <div className="h-3 w-full bg-muted rounded" />
              <div className="h-3 w-3/4 bg-muted rounded" />
            </div>
            <div className="w-8 h-8 bg-muted rounded-full" />
          </div>
        ))}
      </div>

      {/* Recent Transactions */}
      <div className="space-y-3">
        <div className="flex justify-between">
          <div className="h-5 w-40 bg-muted rounded" />
          <div className="h-4 w-20 bg-muted rounded" />
        </div>
        {Array.from({ length: 3 }).map((_, i) => (
          <div
            key={i}
            className="flex items-center gap-3 bg-card rounded-xl p-3 border border-border"
          >
            <div className="w-10 h-10 bg-muted rounded-xl" />
            <div className="flex-1 space-y-1.5">
              <div className="h-3.5 w-24 bg-muted rounded" />
              <div className="h-2.5 w-16 bg-muted rounded" />
            </div>
            <div className="h-4 w-16 bg-muted rounded" />
          </div>
        ))}
      </div>
    </div>
  );
}
