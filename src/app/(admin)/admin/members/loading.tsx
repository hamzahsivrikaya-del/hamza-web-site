export default function Loading() {
  return (
    <div className="space-y-4 animate-pulse">
      <div className="flex items-center justify-between">
        <div className="h-8 bg-border rounded w-32" />
        <div className="h-10 bg-border rounded-lg w-28" />
      </div>
      <div className="h-10 bg-border rounded-lg w-full" />
      <div className="space-y-3">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="bg-surface rounded-2xl border border-border p-4 flex items-center gap-4">
            <div className="w-10 h-10 bg-border rounded-full" />
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-border rounded w-40" />
              <div className="h-3 bg-border rounded w-24" />
            </div>
            <div className="h-6 bg-border rounded-full w-16" />
          </div>
        ))}
      </div>
    </div>
  )
}
