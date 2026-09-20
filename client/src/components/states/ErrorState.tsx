import { ArrowClockwise, WarningCircle } from '@phosphor-icons/react';
import { Button } from '@/components/ui/button';

interface ErrorStateProps {
  message: string;
  onRetry: () => void;
}

export function ErrorState({ message, onRetry }: ErrorStateProps) {
  return (
    <div
      role="alert"
      className="border-destructive/30 bg-destructive/5 flex flex-col items-start gap-3 rounded-xl border p-5"
    >
      <p className="text-destructive flex items-center gap-2 text-sm font-medium">
        <WarningCircle aria-hidden />
        {message}
      </p>
      <p className="text-muted-foreground text-sm">
        Make sure the database and the API server are running.
      </p>
      <Button variant="outline" size="sm" onClick={onRetry}>
        <ArrowClockwise aria-hidden />
        Try again
      </Button>
    </div>
  );
}
