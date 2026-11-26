import { useMutation, useQueryClient } from '@tanstack/react-query';

import type { Employee } from './schema';

import { archiveEmployee } from '../api/archive-employee';
import { appendEmployeeArchivePeriod } from '../lib/employee-archive';

interface ArchiveEmployeeVariables {
  archiveDate: string;
  id: string;
}

export function useArchiveEmployee() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, archiveDate }: ArchiveEmployeeVariables) =>
      archiveEmployee(id, archiveDate),
    onMutate: async ({ id, archiveDate }: ArchiveEmployeeVariables) => {
      const queryKey = ['employees'];

      await queryClient.cancelQueries({ queryKey });

      const previousEmployees = queryClient.getQueryData<Employee[]>(queryKey);

      queryClient.setQueryData<Employee[]>(queryKey, (old = []) => {
        return old.map((emp) =>
          emp.id === id
            ? {
                ...emp,
                is_active: false,
                archive_periods: appendEmployeeArchivePeriod(
                  emp.archive_periods,
                  archiveDate,
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
