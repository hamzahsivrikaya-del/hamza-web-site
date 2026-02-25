export default function Loading() {
  return (
    <div className="space-y-4 animate-pulse">
      <div className="flex items-center justify-between">
        <div className="h-8 bg-border rounded w-24" />
        <div className="h-10 bg-border rounded-lg w-32" />
      </div>
      <div className="space-y-3">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-surface rounded-2xl border border-border p-4 space-y-2">
            <div className="h-5 bg-border rounded w-3/4" />
            <div className="h-3 bg-border rounded w-24" />
          </div>
        ))}
      </div>
    </div>
  )
}
