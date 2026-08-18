import { useMutation, useQueryClient } from '@tanstack/react-query';

import { addEmployee, type AddEmployeeInput } from '../api/add-employee';

export function useAddEmployee() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: AddEmployeeInput) => addEmployee(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employees'] });
    },
  });
}