import { useMutation, useQueryClient } from '@tanstack/react-query';

import { type ScheduleStatus } from '@/entities/schedule-status';
import { scheduleStatusesQueryKey } from '@/features/get-schedule-statuses';

import { reorderScheduleStatuses } from '../api/reorder-schedule-statuses';

export function useReorderScheduleStatuses() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (reorderedStatuses: ScheduleStatus[]) =>
      reorderScheduleStatuses(
        reorderedStatuses.map(({ id, sort_order }) => ({ id, sort_order })),
      ),
    onMutate: async (reorderedStatuses: ScheduleStatus[]) => {
      const queryKey = scheduleStatusesQueryKey;

      await queryClient.cancelQueries({ queryKey });

      const previousStatuses =
        queryClient.getQueryData<ScheduleStatus[]>(queryKey);

      queryClient.setQueryData<ScheduleStatus[]>(queryKey, (old = []) => {
        const archivedStatuses = old.filter((s) => !s.is_active);
        return [...reorderedStatuses, ...archivedStatuses];
      });

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
    },
  });
}
