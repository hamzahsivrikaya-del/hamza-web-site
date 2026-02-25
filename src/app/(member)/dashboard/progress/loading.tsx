export default function Loading() {
  return (
    <div className="space-y-4 animate-pulse">
      <div className="h-7 bg-border rounded w-28" />
      <div className="bg-surface rounded-2xl border border-border p-5">
        <div className="h-48 bg-border rounded-xl" />
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="bg-surface rounded-2xl border border-border p-4">
            <div className="h-3 bg-border rounded w-12 mb-2" />
            <div className="h-6 bg-border rounded w-16" />
          </div>
        ))}
      </div>
    </div>
  )
}
