import { useMutation, useQueryClient } from '@tanstack/react-query';

import { updateEmployee, type UpdateEmployeeDto } from '../api/update-employee';

export function useUpdateEmployee() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (dto: UpdateEmployeeDto) => updateEmployee(dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employees'] });
    },
  });
}