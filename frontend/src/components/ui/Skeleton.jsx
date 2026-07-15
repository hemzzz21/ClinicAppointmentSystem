function Skeleton({ className = "" }) {
  return (
    <div
      className={`animate-pulse rounded-2xl bg-slate-200/70 ${className}`}
    />
  );
}

function SkeletonCard() {
  return (
    <div className="rounded-3xl border border-white/70 bg-white/75 p-6 shadow-sm">
      <div className="flex items-center gap-4">
        <Skeleton className="h-14 w-14 rounded-2xl" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-4 w-2/3" />
          <Skeleton className="h-3 w-1/2" />
        </div>
      </div>
      <div className="mt-5 space-y-2">
        <Skeleton className="h-3 w-full" />
        <Skeleton className="h-3 w-3/4" />
      </div>
      <Skeleton className="mt-5 h-11 w-full rounded-2xl" />
    </div>
  );
}

function SkeletonStats() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {[0, 1, 2, 3].map((index) => (
        <div
          key={index}
          className="rounded-3xl border border-white/70 bg-white/75 p-5 shadow-sm"
        >
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <Skeleton className="h-3 w-24" />
              <Skeleton className="h-8 w-16" />
            </div>
            <Skeleton className="h-12 w-12 rounded-2xl" />
          </div>
        </div>
      ))}
    </div>
  );
}

export { Skeleton as default, Skeleton as Skeleton, SkeletonCard, SkeletonStats };