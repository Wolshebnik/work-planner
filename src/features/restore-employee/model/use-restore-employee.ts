import { useMutation, useQueryClient } from '@tanstack/react-query';

import type { Employee } from '@/entities/employee';

import { restoreEmployee } from '../api/restore-employee';

export function useRestoreEmployee() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => restoreEmployee(id),
    onMutate: async (id: string) => {
      const queryKey = ['employees'];

      const previousEmployees = queryClient.getQueryData<Employee[]>(queryKey);

      queryClient.setQueryData<Employee[]>(queryKey, (old = []) => {
        return old.map((emp) =>
          emp.id === id ? { ...emp, is_active: true } : emp,
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