import { useMutation, useQueryClient } from '@tanstack/react-query';

import { scheduleStatusesQueryKey } from '@/features/get-schedule-statuses';

import { archiveScheduleStatus } from '../api/archive-schedule-status';

export function useArchiveScheduleStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => archiveScheduleStatus(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: scheduleStatusesQueryKey });
    },
  });
}
