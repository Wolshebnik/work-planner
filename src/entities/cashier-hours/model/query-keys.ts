import { queryOptions } from '@tanstack/react-query';

import { getCashierHours } from '../api/get-cashier-hours';

export const cashierHoursKeys = {
  all: ['cashier-hours'] as const,
  month: (year: number, month: number) =>
    [...cashierHoursKeys.all, 'month', year, month] as const,
};

export function cashierHoursMonthQueryOptions(year: number, month: number) {
  return queryOptions({
    queryKey: cashierHoursKeys.month(year, month),
    queryFn: () => getCashierHours(year, month),
    staleTime: Infinity,
    gcTime: Infinity,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });
}
