import { queryOptions } from '@tanstack/react-query';

import { getScheduleByMonth } from '../api/get-schedule-by-month';

export const scheduleKeys = {
  all: ['schedule'] as const,
  month: (monthKey: string) =>
    [...scheduleKeys.all, 'month', monthKey] as const,
};

export function scheduleMonthQueryOptions(monthKey: string) {
  return queryOptions({
    queryKey: scheduleKeys.month(monthKey),
    queryFn: () => getScheduleByMonth(monthKey),
    staleTime: Infinity,
    gcTime: Infinity,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });
}

