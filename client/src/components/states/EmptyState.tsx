import { Tray, type Icon } from '@phosphor-icons/react';
import type { ReactNode } from 'react';

interface EmptyStateProps {
  title: string;
  description: string;
  /** Defaults to a neutral tray; pages that can explain the emptiness pass their own. */
  icon?: Icon;
  /** Optional way out of the empty state — a button, rendered under the copy. */
  action?: ReactNode;
}

export function EmptyState({
  title,
  description,
  icon: EmptyIcon = Tray,
  action,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center border-t px-6 py-20 text-center">
      <EmptyIcon size={28} className="text-muted-foreground mb-4" aria-hidden />
      <p className="font-medium">{title}</p>
      <p className="text-muted-foreground mt-1 max-w-sm text-sm">{description}</p>
      {action ? <div className="mt-5">{action}</div> : null}
    </div>
  );
}
