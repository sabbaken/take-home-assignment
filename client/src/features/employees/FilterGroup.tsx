import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import type { FilterKey, FilterOption } from './types';

interface FilterGroupProps {
  title: string;
  filterKey: FilterKey;
  options: FilterOption[];
  selectedIds: number[];
  onToggle: (key: FilterKey, id: number) => void;
}

export function FilterGroup({
  title,
  filterKey,
  options,
  selectedIds,
  onToggle,
}: FilterGroupProps) {
  return (
    <fieldset>
      <legend className="text-muted-foreground mb-2 text-xs font-medium tracking-wide uppercase">
        {title}
      </legend>
      <div className="space-y-2">
        {options.map((option) => {
          const inputId = `${filterKey}-${option.id}`;

          return (
            <div key={option.id} className="flex items-center gap-2">
              <Checkbox
                id={inputId}
                checked={selectedIds.includes(option.id)}
                onCheckedChange={() => onToggle(filterKey, option.id)}
              />
              <Label htmlFor={inputId} className="cursor-pointer font-normal">
                {option.name}
              </Label>
            </div>
          );
        })}
      </div>
    </fieldset>
  );
}
