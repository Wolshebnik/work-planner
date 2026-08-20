import { useQueries } from '@tanstack/react-query';
import dayjs from 'dayjs';
import isoWeek from 'dayjs/plugin/isoWeek';

import { scheduleMonthQueryOptions } from './query-keys';

dayjs.extend(isoWeek);

export function useScheduleByWeek(
  date: dayjs.Dayjs | string,
  enabled = true,
) {
  const selectedDate = typeof date === 'string' ? dayjs(date) : date;
  const weekStart = selectedDate.startOf('isoWeek');
  const weekEnd = selectedDate.endOf('isoWeek');

  const startMonth = weekStart.format('YYYY-MM');
  const endMonth = weekEnd.format('YYYY-MM');

  const months =
    startMonth === endMonth ? [startMonth] : [startMonth, endMonth];

  const queries = useQueries({
    queries: months.map((monthKey) => ({
      ...scheduleMonthQueryOptions(monthKey),
      enabled,
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
