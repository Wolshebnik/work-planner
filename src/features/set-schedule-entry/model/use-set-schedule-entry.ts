import { useMutation, useQueryClient } from '@tanstack/react-query';

import { scheduleKeys } from '@/features/get-schedule-by-month';

import {
  setScheduleEntry,
  type SetScheduleEntryDto,
} from '../api/set-schedule-entry';

export function useSetScheduleEntry() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (dto: SetScheduleEntryDto) => setScheduleEntry(dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: scheduleKeys.all });
    },
  });
}
