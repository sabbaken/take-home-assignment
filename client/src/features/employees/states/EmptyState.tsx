import { MagnifyingGlass } from '@phosphor-icons/react';
import { Button } from '@/components/ui/button';

export function EmptyState({ onClear }: { onClear?: () => void }) {
  return (
    <div className="bg-card flex flex-col items-center rounded-xl border px-6 py-16 text-center">
      <div className="bg-muted text-muted-foreground mb-4 rounded-full p-3">
        <MagnifyingGlass size={24} aria-hidden />
      </div>
      <p className="font-medium">Nothing found</p>
      <p className="text-muted-foreground mt-1 max-w-sm text-sm">
        No employee matches the selected filters. Try removing one of them.
      </p>
      {onClear ? (
        <Button variant="outline" size="sm" className="mt-5" onClick={onClear}>
          Clear all filters
        </Button>
      ) : null}
    </div>
  );
}
