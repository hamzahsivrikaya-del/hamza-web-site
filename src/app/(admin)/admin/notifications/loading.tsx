export default function Loading() {
  return (
    <div className="space-y-4 animate-pulse">
      <div className="h-8 bg-border rounded w-32" />
      <div className="space-y-3">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="bg-surface rounded-2xl border border-border p-4 flex items-center gap-3">
            <div className="w-8 h-8 bg-border rounded-full" />
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-border rounded w-3/4" />
              <div className="h-3 bg-border rounded w-1/3" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
