import { useQuery } from '@tanstack/react-query';
import { fetchDepartments } from './api';

export function useDepartments() {
  return useQuery({
    queryKey: ['departments'],
    queryFn: ({ signal }) => fetchDepartments(signal),
  });
}
