import { useMutation, useQueryClient } from '@tanstack/react-query';

import type { Employee } from './schema';

import { archiveEmployee } from '../api/archive-employee';

export function useArchiveEmployee() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => archiveEmployee(id),
    onMutate: async (id: string) => {
      const queryKey = ['employees'];

      const previousEmployees = queryClient.getQueryData<Employee[]>(queryKey);

      queryClient.setQueryData<Employee[]>(queryKey, (old = []) => {
        return old.map((emp) =>
          emp.id === id ? { ...emp, is_active: false } : emp,
        );
      });

      await queryClient.cancelQueries({ queryKey });

      return { previousEmployees, queryKey };
    },
    onError: (_err, _variables, context) => {
      if (context?.queryKey && context.previousEmployees) {
        queryClient.setQueryData(context.queryKey, context.previousEmployees);
      }
    },
    onSettled: (_data, _error, _variables, context) => {
      if (context?.queryKey) {
        queryClient.invalidateQueries({ queryKey: context.queryKey });
      }
      queryClient.invalidateQueries({ queryKey: ['schedule'] });
    },
  });
}