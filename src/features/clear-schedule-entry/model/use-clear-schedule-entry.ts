import { useMutation, useQueryClient } from '@tanstack/react-query';

import type { ScheduleEntry } from '@/entities/schedule';
import { scheduleKeys } from '@/features/get-schedule-by-month';

import {
  clearScheduleEntry,
  type ClearScheduleEntryDto,
} from '../api/clear-schedule-entry';

export function useClearScheduleEntry() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (dto: ClearScheduleEntryDto) => clearScheduleEntry(dto),
    onMutate: async (variables) => {
      const monthKey = variables.workDate.slice(0, 7);
      const queryKey = scheduleKeys.month(monthKey);

      const previousEntries = queryClient.getQueryData<ScheduleEntry[]>(queryKey);

      queryClient.setQueryData<ScheduleEntry[]>(queryKey, (old = []) => {
        return old.filter(
          (entry) =>
            !(
              entry.employee_id === variables.employeeId &&
              entry.work_date === variables.workDate
            ),
        );
      });

      await queryClient.cancelQueries({ queryKey });

      return { previousEntries, queryKey };
    },
    onError: (_err, _variables, context) => {
      if (context?.queryKey && context.previousEntries) {
        queryClient.setQueryData(context.queryKey, context.previousEntries);
      }
    },
    onSettled: (_data, _error, _variables, context) => {
      if (context?.queryKey) {
        queryClient.invalidateQueries({ queryKey: context.queryKey });
      }
    },
  });
}
