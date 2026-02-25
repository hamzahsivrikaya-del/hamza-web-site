export default function Loading() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="h-8 bg-border rounded w-48" />
      <div className="bg-surface rounded-2xl border border-border p-5 space-y-4">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="flex items-center gap-4">
            <div className="w-10 h-10 bg-border rounded-full" />
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-border rounded w-3/4" />
              <div className="h-3 bg-border rounded w-1/2" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
