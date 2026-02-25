export default function Loading() {
  return (
    <div className="space-y-4 animate-pulse">
      <div className="flex items-center justify-between">
        <div className="h-7 bg-border rounded w-40" />
        <div className="h-4 bg-border rounded w-24" />
      </div>
      {[...Array(3)].map((_, i) => (
        <div key={i} className="bg-surface rounded-2xl border border-border p-4 space-y-3">
          <div className="flex items-center justify-between">
            <div className="h-5 bg-border rounded w-24" />
            <div className="h-8 bg-border rounded-lg w-20" />
          </div>
          <div className="h-24 bg-border rounded-xl" />
        </div>
      ))}
    </div>
  )
}
