import { useQuery } from '@tanstack/react-query';
import { fetchReference } from './api';
import type { ReferenceResource } from './resources';

export function useReference(resource: ReferenceResource) {
  return useQuery({
    queryKey: ['reference', resource],
    queryFn: ({ signal }) => fetchReference(resource, signal),
  });
}
