import { Skeleton } from '@/components/ui/skeleton';

/** Placeholder groups while the options load: three legends with a few checkbox rows each. */
export function FiltersSkeleton() {
  return (
    <div className="space-y-6">
      {[4, 5, 4].map((rows, groupIndex) => (
        <div key={groupIndex} className="space-y-2">
          <Skeleton className="h-3 w-20" />
          {Array.from({ length: rows }).map((_, rowIndex) => (
            <Skeleton key={rowIndex} className="h-4 w-32" />
          ))}
        </div>
      ))}
    </div>
  );
}
