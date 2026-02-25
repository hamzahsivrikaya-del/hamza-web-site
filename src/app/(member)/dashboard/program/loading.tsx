export default function Loading() {
  return (
    <div className="space-y-4 animate-pulse">
      <div className="h-7 bg-border rounded w-36" />
      <div className="h-4 bg-border rounded w-48" />
      <div className="grid gap-3">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="bg-surface rounded-2xl border border-border p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-border rounded-xl" />
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-border rounded w-24" />
                <div className="h-3 bg-border rounded w-40" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
