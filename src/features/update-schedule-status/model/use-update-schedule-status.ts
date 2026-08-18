import { useMutation, useQueryClient } from '@tanstack/react-query';

import { updateStatus, type UpdateStatusDto } from '../api/update-schedule-status';
import { scheduleStatusesQueryKey } from '@/features/get-schedule-statuses';

export function useUpdateScheduleStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (dto: UpdateStatusDto) => updateStatus(dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: scheduleStatusesQueryKey });
    },
  });
}