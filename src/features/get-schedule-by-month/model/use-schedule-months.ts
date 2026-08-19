import { useQueries } from '@tanstack/react-query';

import { getScheduleByMonth } from '../api/get-schedule-by-month';
import { scheduleKeys } from './query-keys';

export function useScheduleMonths(monthKeys: string[], enabled = true) {
  const queries = useQueries({
    queries: monthKeys.map((monthKey) => ({
      queryKey: scheduleKeys.month(monthKey),
      queryFn: () => getScheduleByMonth(monthKey),
      enabled,
      staleTime: Infinity,
      gcTime: Infinity,
      refetchOnMount: false,
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
    })),
  });

  const isPending = queries.some(
    (query) => query.isPending || query.data === undefined,
  );
  const isLoading = queries.some((query) => query.isLoading);
  const isFetching = queries.some((query) => query.isFetching);
  const isError = queries.some((query) => query.isError);
  const error = queries.find((query) => query.error)?.error ?? null;
  const data = isPending ? [] : queries.flatMap((query) => query.data ?? []);

  return {
    data,
    isPending,
    isLoading: isPending || isLoading,
    isFetching,
    isError,
    error,
  };
}
