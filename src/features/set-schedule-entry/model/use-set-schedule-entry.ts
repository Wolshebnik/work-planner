import { useMutation, useQueryClient } from '@tanstack/react-query';

import type { ScheduleEntry } from '@/entities/schedule';
import { scheduleKeys } from '@/features/get-schedule-by-month';

import {
  setScheduleEntry,
  type SetScheduleEntryDto,
} from '../api/set-schedule-entry';

export function useSetScheduleEntry() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (dto: SetScheduleEntryDto) => setScheduleEntry(dto),
    onMutate: async (variables) => {
      const monthKey = variables.workDate.slice(0, 7);
      const queryKey = scheduleKeys.month(monthKey);

      const previousEntries = queryClient.getQueryData<ScheduleEntry[]>(queryKey);

      queryClient.setQueryData<ScheduleEntry[]>(queryKey, (old = []) => {
        const withoutCurrent = old.filter(
          (entry) =>
            !(
              entry.employee_id === variables.employeeId &&
              entry.work_date === variables.workDate
            ),
        );

        if (!variables.status) {
          return withoutCurrent;
        }

        const optimisticEntry: ScheduleEntry = {
          id: `optimistic-${Date.now()}`,
          employee_id: variables.employeeId,
          work_date: variables.workDate,
          status_id: variables.statusId,
          status: variables.status,
        };

        return [...withoutCurrent, optimisticEntry];
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
