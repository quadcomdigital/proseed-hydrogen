export function Skeleton({className}: {className?: string}) {
  return <div className={`animate-pulse bg-gray-200 rounded-lg ${className || ''}`} />;
}

export function ProductCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-sm">
      <Skeleton className="aspect-[4/5] rounded-none" />
      <div className="p-4 space-y-3">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-5 w-1/3" />
        <div className="flex gap-2 pt-2">
          <Skeleton className="h-9 flex-1 rounded-xl" />
          <Skeleton className="h-9 w-9 rounded-xl" />
        </div>
      </div>
    </div>
  );
}

export function ProductGridSkeleton({count = 8}: {count?: number}) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
      {Array.from({length: count}).map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  );
}

export function BlogCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-sm">
      <Skeleton className="aspect-[16/10] rounded-none" />
      <div className="p-5 space-y-3">
        <Skeleton className="h-3 w-1/4" />
        <Skeleton className="h-5 w-full" />
        <Skeleton className="h-4 w-2/3" />
        <Skeleton className="h-4 w-1/2" />
        <div className="flex justify-between items-center pt-2">
          <Skeleton className="h-3 w-1/4" />
          <Skeleton className="h-8 w-24 rounded-xl" />
        </div>
      </div>
    </div>
  );
}

export function HeroSkeleton() {
  return (
    <section className="relative h-[60vh] lg:h-[80vh] min-h-[400px] lg:min-h-[600px] w-full px-2 lg:px-4">
      <div className="mx-auto max-w-7xl h-full relative overflow-hidden rounded-[24px] lg:rounded-[40px] bg-gray-200 animate-pulse">
        <div className="absolute bottom-10 left-10 space-y-4 w-96">
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-6 w-3/4" />
          <div className="flex gap-3 pt-4">
            <Skeleton className="h-12 w-36 rounded-2xl" />
            <Skeleton className="h-12 w-36 rounded-2xl" />
          </div>
        </div>
      </div>
    </section>
  );
}

export function AccountLayoutSkeleton() {
  return (
    <div className="flex flex-col lg:flex-row mx-auto max-w-7xl px-4 py-10 gap-8">
      <aside className="lg:w-64 shrink-0">
        <div className="space-y-2">
          {Array.from({length: 5}).map((_, i) => (
            <Skeleton key={i} className="h-10 w-full rounded-xl" />
          ))}
        </div>
      </aside>
      <main className="flex-1 space-y-6">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-64 w-full rounded-2xl" />
      </main>
    </div>
  );
}
