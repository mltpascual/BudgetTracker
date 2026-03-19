/**
 * Content-aware skeleton for History page.
 * Mirrors: header, month selector, calendar grid, and transaction list.
 */
export default function HistorySkeleton() {
  return (
    <div className="p-4 pb-24 space-y-4 animate-pulse">
      {/* Header */}
      <div className="space-y-1">
        <div className="h-3 w-20 bg-muted rounded" />
        <div className="h-7 w-28 bg-muted rounded" />
      </div>

      {/* Month selector */}
      <div className="flex items-center justify-between">
        <div className="w-8 h-8 bg-muted rounded-lg" />
        <div className="h-5 w-32 bg-muted rounded" />
        <div className="w-8 h-8 bg-muted rounded-lg" />
      </div>

      {/* Income/Expense summary */}
      <div className="flex gap-3">
        <div className="flex-1 bg-card rounded-2xl p-3 border border-border space-y-1.5">
          <div className="h-3 w-12 bg-muted rounded" />
          <div className="h-5 w-20 bg-muted rounded" />
        </div>
        <div className="flex-1 bg-card rounded-2xl p-3 border border-border space-y-1.5">
          <div className="h-3 w-14 bg-muted rounded" />
          <div className="h-5 w-20 bg-muted rounded" />
        </div>
      </div>

      {/* Calendar grid */}
      <div className="bg-card rounded-2xl p-4 border border-border space-y-3">
        {/* Day headers */}
        <div className="grid grid-cols-7 gap-1">
          {["S", "M", "T", "W", "T", "F", "S"].map((d, i) => (
            <div key={i} className="flex justify-center">
              <div className="h-3 w-4 bg-muted rounded" />
            </div>
          ))}
        </div>
        {/* Calendar rows */}
        {Array.from({ length: 5 }).map((_, row) => (
          <div key={row} className="grid grid-cols-7 gap-1">
            {Array.from({ length: 7 }).map((_, col) => (
              <div key={col} className="flex justify-center">
                <div className="w-9 h-9 bg-muted rounded-xl" />
              </div>
            ))}
          </div>
        ))}
      </div>

      {/* Transaction list */}
      <div className="space-y-3">
        <div className="h-5 w-36 bg-muted rounded" />
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="flex items-center gap-3 bg-card rounded-xl p-3 border border-border"
          >
            <div className="w-10 h-10 bg-muted rounded-xl" />
            <div className="flex-1 space-y-1.5">
              <div className="h-3.5 w-28 bg-muted rounded" />
              <div className="h-2.5 w-20 bg-muted rounded" />
            </div>
            <div className="text-right space-y-1.5">
              <div className="h-3.5 w-16 bg-muted rounded ml-auto" />
              <div className="h-2.5 w-12 bg-muted rounded ml-auto" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
