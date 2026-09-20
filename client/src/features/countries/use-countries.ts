import { useQuery } from '@tanstack/react-query';
import { fetchCountries } from './api';

export function useCountries() {
  return useQuery({
    queryKey: ['countries'],
    queryFn: ({ signal }) => fetchCountries(signal),
  });
}
