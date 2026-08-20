import { useMutation, useQueryClient } from '@tanstack/react-query';

import { employeeKeys } from './query-keys';
import { type Employee } from './schema';

import { reorderEmployees } from '../api/reorder-employees';


export function useReorderEmployees() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (reorderedEmployees: Employee[]) =>
      reorderEmployees(
        reorderedEmployees.map(({ id, sort_order }) => ({ id, sort_order })),
      ),
    onMutate: async (reorderedEmployees: Employee[]) => {
      const queryKey = employeeKeys.all;

      await queryClient.cancelQueries({ queryKey });

      const previousEmployees = queryClient.getQueryData<Employee[]>(queryKey);

      queryClient.setQueryData<Employee[]>(queryKey, (old = []) => {
        const archivedEmployees = old.filter((emp) => !emp.is_active);
        return [...reorderedEmployees, ...archivedEmployees];
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
