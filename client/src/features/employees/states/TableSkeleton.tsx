import { Skeleton } from '@/components/ui/skeleton';

const COLUMN_WIDTHS = ['w-8', 'w-24', 'w-28', 'w-24', 'w-28', 'w-24'];

export function TableSkeleton({ rows = 8 }: { rows?: number }) {
  return (
    <div className="bg-card overflow-hidden rounded-xl border" aria-hidden>
      <div className="flex gap-6 border-b px-3 py-3">
        {COLUMN_WIDTHS.map((width, index) => (
          <Skeleton key={index} className={`h-3 ${width}`} />
        ))}
      </div>
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <div key={rowIndex} className="flex gap-6 border-b px-3 py-3.5 last:border-0">
          {COLUMN_WIDTHS.map((width, index) => (
            <Skeleton key={index} className={`h-4 ${width}`} />
          ))}
        </div>
      ))}
    </div>
  );
}
