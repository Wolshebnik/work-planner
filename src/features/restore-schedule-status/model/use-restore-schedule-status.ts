import { useMutation, useQueryClient } from '@tanstack/react-query';

import { scheduleStatusesQueryKey } from '@/features/get-schedule-statuses';

import { restoreScheduleStatus } from '../api/restore-schedule-status';

export function useRestoreScheduleStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => restoreScheduleStatus(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: scheduleStatusesQueryKey });
    },
  });
}
