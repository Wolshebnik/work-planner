import { useMutation, useQueryClient } from '@tanstack/react-query';

import { scheduleKeys } from '@/features/get-schedule-by-month';

import {
  clearScheduleEntry,
  type ClearScheduleEntryDto,
} from '../api/clear-schedule-entry';

export function useClearScheduleEntry() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (dto: ClearScheduleEntryDto) => clearScheduleEntry(dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: scheduleKeys.all });
    },
  });
}
