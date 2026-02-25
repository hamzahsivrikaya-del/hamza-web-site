export default function Loading() {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Hoşgeldin kartı skeleton */}
      <div className="bg-surface rounded-2xl border border-border p-5">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-border" />
          <div className="space-y-2 flex-1">
            <div className="h-5 bg-border rounded w-40" />
            <div className="h-3 bg-border rounded w-32" />
          </div>
          <div className="h-6 bg-border rounded-full w-16" />
        </div>
        <div className="mt-4 space-y-3">
          <div className="h-4 bg-border rounded w-20" />
          <div className="h-2 bg-border rounded-full w-full" />
        </div>
      </div>

      {/* Beslenme kartı skeleton */}
      <div className="bg-surface rounded-2xl border border-border p-5">
        <div className="h-5 bg-border rounded w-36 mb-3" />
        <div className="flex gap-2">
          <div className="flex-1 h-10 bg-border rounded-lg" />
          <div className="flex-1 h-10 bg-border rounded-lg" />
          <div className="flex-1 h-10 bg-border rounded-lg" />
        </div>
      </div>

      {/* Hızlı linkler skeleton */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-surface rounded-2xl border border-border p-5 text-center">
            <div className="w-6 h-6 bg-border rounded mx-auto mb-2" />
            <div className="h-4 bg-border rounded w-16 mx-auto" />
          </div>
        ))}
      </div>
    </div>
  )
}
