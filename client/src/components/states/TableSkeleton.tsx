import { Skeleton } from '@/components/ui/skeleton';

interface TableSkeletonProps {
  /** One Tailwind width class per column — the list is also the column count. */
  columns: string[];
  rows?: number;
}

export function TableSkeleton({ columns, rows = 8 }: TableSkeletonProps) {
  return (
    <div className="border-t" aria-hidden>
      <div className="flex gap-6 border-b px-3 py-3">
        {columns.map((width, index) => (
          <Skeleton key={index} className={`h-3 ${width}`} />
        ))}
      </div>
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <div key={rowIndex} className="flex gap-6 border-b px-3 py-3.5 last:border-0">
          {columns.map((width, index) => (
            <Skeleton key={index} className={`h-4 ${width}`} />
          ))}
        </div>
      ))}
    </div>
  );
}
