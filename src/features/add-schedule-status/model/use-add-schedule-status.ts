import { useMutation, useQueryClient } from '@tanstack/react-query';

import { addScheduleStatus, type AddScheduleStatusInput } from '../api/add-schedule-status';

export function useAddScheduleStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: AddScheduleStatusInput) => addScheduleStatus(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['schedule-statuses'] });
    },
  });
}