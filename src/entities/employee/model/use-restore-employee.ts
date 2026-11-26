import { useMutation, useQueryClient } from '@tanstack/react-query';

import type { Employee } from './schema';

import { restoreEmployee } from '../api/restore-employee';
import { closeEmployeeArchivePeriod } from '../lib/employee-archive';

interface RestoreEmployeeVariables {
  id: string;
  restoreDate: string;
}

export function useRestoreEmployee() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, restoreDate }: RestoreEmployeeVariables) =>
      restoreEmployee(id, restoreDate),
    onMutate: async ({ id, restoreDate }: RestoreEmployeeVariables) => {
      const queryKey = ['employees'];

      await queryClient.cancelQueries({ queryKey });

      const previousEmployees = queryClient.getQueryData<Employee[]>(queryKey);

      queryClient.setQueryData<Employee[]>(queryKey, (old = []) => {
        return old.map((emp) =>
          emp.id === id
            ? {
                ...emp,
                is_active: true,
                archive_periods: closeEmployeeArchivePeriod(
                  emp.archive_periods,
                  restoreDate,
                ),
              }
            : emp,
        );
      });

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
