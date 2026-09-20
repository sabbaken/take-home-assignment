import { useQuery } from '@tanstack/react-query';
import { fetchFilterOptions } from '../api';

export function useFilterOptions() {
  return useQuery({
    queryKey: ['filter-options'],
    queryFn: ({ signal }) => fetchFilterOptions(signal),
    // Reference data for the lifetime of the page.
    staleTime: Infinity,
  });
}
