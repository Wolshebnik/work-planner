import { useMutation, useQueryClient } from '@tanstack/react-query';

import type { Employee } from './schema';

import { updateEmployee, type UpdateEmployeeDto } from '../api/update-employee';

export function useUpdateEmployee() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (dto: UpdateEmployeeDto) => updateEmployee(dto),
    onMutate: async (variables) => {
      const queryKey = ['employees'];

      const previousEmployees = queryClient.getQueryData<Employee[]>(queryKey);

      queryClient.setQueryData<Employee[]>(queryKey, (old = []) => {
        return old.map((emp) =>
          emp.id === variables.id
            ? {
                ...emp,
                last_name: variables.lastName ?? emp.last_name,
                first_name: variables.firstName ?? emp.first_name,
                patronymic:
                  variables.patronymic !== undefined
                    ? variables.patronymic || null
                    : emp.patronymic,
              }
            : emp,
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