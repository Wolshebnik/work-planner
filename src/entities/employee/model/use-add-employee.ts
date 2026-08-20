import { useMutation, useQueryClient } from '@tanstack/react-query';

import type { Employee } from './schema';

import { addEmployee, type AddEmployeeInput } from '../api/add-employee';

export function useAddEmployee() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: AddEmployeeInput) => addEmployee(input),
    onMutate: async (variables) => {
      const queryKey = ['employees'];

      const previousEmployees = queryClient.getQueryData<Employee[]>(queryKey);

      queryClient.setQueryData<Employee[]>(queryKey, (old = []) => {
        const optimisticEmployee: Employee = {
          id: `optimistic-${Date.now()}`,
          last_name: variables.lastName,
          first_name: variables.firstName,
          patronymic: variables.patronymic ?? null,
          is_active: true,
          sort_order: old.length + 1,
        };

        return [...old, optimisticEmployee];
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