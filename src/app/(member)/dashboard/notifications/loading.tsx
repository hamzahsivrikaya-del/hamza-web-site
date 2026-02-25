export default function Loading() {
  return (
    <div className="space-y-3 animate-pulse">
      <div className="h-7 bg-border rounded w-32" />
      {[...Array(5)].map((_, i) => (
        <div key={i} className="bg-surface rounded-2xl border border-border p-4 flex items-start gap-3">
          <div className="w-8 h-8 bg-border rounded-full shrink-0" />
          <div className="flex-1 space-y-2">
            <div className="h-4 bg-border rounded w-3/4" />
            <div className="h-3 bg-border rounded w-1/2" />
          </div>
        </div>
      ))}
    </div>
  )
}
