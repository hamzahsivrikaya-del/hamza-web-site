export default function Loading() {
  return (
    <div className="space-y-4 animate-pulse">
      <div className="flex items-center justify-between">
        <div className="h-8 bg-border rounded w-40" />
        <div className="flex gap-2">
          <div className="h-8 w-8 bg-border rounded-lg" />
          <div className="h-8 bg-border rounded w-32" />
          <div className="h-8 w-8 bg-border rounded-lg" />
        </div>
      </div>
      <div className="grid gap-3">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="bg-surface rounded-2xl border border-border p-4">
            <div className="h-5 bg-border rounded w-24 mb-3" />
            <div className="space-y-2">
              <div className="h-4 bg-border rounded w-full" />
              <div className="h-4 bg-border rounded w-3/4" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
