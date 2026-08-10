import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="container-luxury section-padding space-y-8">
      <Skeleton className="h-12 w-64 rounded-2xl" />
      <Skeleton className="h-6 w-96 max-w-full rounded-xl" />
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="space-y-3">
            <Skeleton className="aspect-[4/3] w-full rounded-2xl" />
            <Skeleton className="h-5 w-3/4 rounded-lg" />
            <Skeleton className="h-4 w-1/2 rounded-lg" />
          </div>
        ))}
      </div>
    </div>
  );
}
