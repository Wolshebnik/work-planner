import { useQuery } from '@tanstack/react-query';

import { getScheduleStatuses } from '../api/get-schedule-statuses';

export const scheduleStatusesQueryKey = ['schedule-statuses'] as const;

export function useGetScheduleStatuses() {
  return useQuery({
    queryKey: scheduleStatusesQueryKey,
    queryFn: getScheduleStatuses,
  });
}