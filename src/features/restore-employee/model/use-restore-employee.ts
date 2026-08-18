import { useMutation, useQueryClient } from '@tanstack/react-query';

import { restoreEmployee } from '../api/restore-employee';

export function useRestoreEmployee() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => restoreEmployee(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employees'] });
    },
  });
}