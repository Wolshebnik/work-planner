import { useMutation, useQueryClient } from '@tanstack/react-query';

import type { ScheduleStatus } from '@/entities/schedule-status';
import { scheduleStatusesQueryKey } from '@/features/get-schedule-statuses';

import { updateStatus, type UpdateStatusDto } from '../api/update-schedule-status';

export function useUpdateScheduleStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (dto: UpdateStatusDto) => updateStatus(dto),
    onMutate: async (variables) => {
      const queryKey = scheduleStatusesQueryKey;

      const previousStatuses = queryClient.getQueryData<ScheduleStatus[]>(queryKey);

      queryClient.setQueryData<ScheduleStatus[]>(queryKey, (old = []) => {
        return old.map((status) =>
          status.id === variables.id
            ? {
                ...status,
                name: variables.name ?? status.name,
                description:
                  variables.description !== undefined
                    ? variables.description || null
                    : status.description,
                schedule_mark:
                  variables.scheduleMark !== undefined
                    ? variables.scheduleMark || null
                    : status.schedule_mark,
                excel_mark:
                  variables.excelMark !== undefined
                    ? variables.excelMark || null
                    : status.excel_mark,
                color:
                  variables.color !== undefined ? variables.color : status.color,
                is_locked:
                  variables.isLocked !== undefined
                    ? variables.isLocked
                    : status.is_locked,
                is_active:
                  variables.isActive !== undefined
                    ? variables.isActive
                    : status.is_active,
                sort_order:
                  variables.sortOrder !== undefined
                    ? variables.sortOrder
                    : status.sort_order,
              }
            : status,
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