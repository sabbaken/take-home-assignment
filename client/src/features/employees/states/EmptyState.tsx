import { MagnifyingGlass } from '@phosphor-icons/react';
import { Button } from '@/components/ui/button';

export function EmptyState({ onClear }: { onClear?: () => void }) {
  return (
    <div className="flex flex-col items-center border-t px-6 py-20 text-center">
      <MagnifyingGlass size={28} className="text-muted-foreground mb-4" aria-hidden />
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
