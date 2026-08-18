import { useMutation, useQueryClient } from '@tanstack/react-query';

import { archiveEmployee } from '../api/archive-employee';

export function useArchiveEmployee() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => archiveEmployee(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employees'] });
    },
  });
}