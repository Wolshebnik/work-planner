import { useMutation, useQueryClient } from '@tanstack/react-query';

import type { ScheduleStatus } from '@/entities/schedule-status';
import { scheduleStatusesQueryKey } from '@/features/get-schedule-statuses';

import { addScheduleStatus, type AddScheduleStatusInput } from '../api/add-schedule-status';

export function useAddScheduleStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: AddScheduleStatusInput) => addScheduleStatus(input),
    onMutate: async (variables) => {
      const queryKey = scheduleStatusesQueryKey;

      const previousStatuses = queryClient.getQueryData<ScheduleStatus[]>(queryKey);

      queryClient.setQueryData<ScheduleStatus[]>(queryKey, (old = []) => {
        const optimisticStatus: ScheduleStatus = {
          id: `optimistic-${Date.now()}`,
          name: variables.name,
          description: variables.description ?? null,
          schedule_mark: variables.scheduleMark ?? null,
          excel_mark: variables.excelMark ?? null,
          color: variables.color ?? '#E1E2E5',
          is_active: variables.isActive ?? true,
          is_locked: variables.isLocked ?? false,
          is_system: false,
          sort_order: old.length + 1,
        };

        return [...old, optimisticStatus];
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