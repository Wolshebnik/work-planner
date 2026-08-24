import { useMutation, useQueryClient } from '@tanstack/react-query';

import { employeeKeys } from './query-keys';
import type { Employee } from './schema';

import { addEmployee, type AddEmployeeInput } from '../api/add-employee';

export function useAddEmployee() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: AddEmployeeInput) => addEmployee(input),
    onMutate: async (variables) => {
      const queryKey = employeeKeys.all;

      await queryClient.cancelQueries({ queryKey });

      const previousEmployees = queryClient.getQueryData<Employee[]>(queryKey);
      const optimisticEmployeeId = `optimistic-${Date.now()}`;

      queryClient.setQueryData<Employee[]>(queryKey, (old = []) => {
        const optimisticEmployee: Employee = {
          id: optimisticEmployeeId,
          last_name: variables.lastName,
          first_name: variables.firstName,
          patronymic: variables.patronymic ?? null,
          is_active: true,
          sort_order: Math.max(0, ...old.map((employee) => employee.sort_order)) + 10,
        };

        return [...old, optimisticEmployee].sort(
          (first, second) => first.sort_order - second.sort_order,
        );
      });

      return { previousEmployees, queryKey, optimisticEmployeeId };
    },
    onError: (_err, _variables, context) => {
      if (!context?.queryKey) return;

      queryClient.setQueryData<Employee[]>(context.queryKey, (old = []) =>
        context.previousEmployees ??
        old.filter((item) => item.id !== context.optimisticEmployeeId),
      );
    },
    onSuccess: async (employee, _variables, context) => {
      if (context?.queryKey && context.optimisticEmployeeId) {
        queryClient.setQueryData<Employee[]>(context.queryKey, (old = []) =>
          old
            .map((item) =>
              item.id === context.optimisticEmployeeId ? employee : item,
            )
            .sort((first, second) => first.sort_order - second.sort_order),
        );

        await queryClient.refetchQueries({ queryKey: employeeKeys.all });
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['schedule'] });
    },
  });
}