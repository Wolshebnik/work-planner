import { useMutation, useQueryClient } from '@tanstack/react-query';

import type { ScheduleStatus } from './schema';
import { scheduleStatusesQueryKey } from './use-get-schedule-statuses';

import { archiveScheduleStatus } from '../api/archive-schedule-status';

export function useArchiveScheduleStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => archiveScheduleStatus(id),
    onMutate: async (id: string) => {
      const queryKey = scheduleStatusesQueryKey;

      const previousStatuses = queryClient.getQueryData<ScheduleStatus[]>(queryKey);

      queryClient.setQueryData<ScheduleStatus[]>(queryKey, (old = []) => {
        return old.map((status) =>
          status.id === id ? { ...status, is_active: false } : status,
        );
      });

      await queryClient.cancelQueries({ queryKey });

      return { previousStatuses, queryKey };
    },
    onError: (_err, _variables, context) => {
      if (context?.queryKey && context.previousStatuses) {
        queryClient.setQueryData(context.queryKey, context.previousStatuses);
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
