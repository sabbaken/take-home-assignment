import { useQuery } from '@tanstack/react-query';
import { fetchRoles } from './api';

export function useRoles() {
  return useQuery({
    queryKey: ['roles'],
    queryFn: ({ signal }) => fetchRoles(signal),
  });
}
