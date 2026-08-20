import { useMemo } from 'react';

import { useQueries } from '@tanstack/react-query';

import { scheduleMonthQueryOptions } from './query-keys';

export function useScheduleMonths(monthKeys: string[], enabled = true) {
  const uniqueKeys = useMemo(() => Array.from(new Set(monthKeys)), [monthKeys]);

  const queries = useQueries({
    queries: uniqueKeys.map((monthKey) => ({
      ...scheduleMonthQueryOptions(monthKey),
      enabled,
    })),
  });

  const isAllPending = queries.every(
    (query) => query.isPending || query.data === undefined,
  );
  const isAnyPending = queries.some(
    (query) => query.isPending || query.data === undefined,
  );
  const isLoading = queries.some((query) => query.isLoading);
  const isFetching = queries.some((query) => query.isFetching);
  const isError = queries.some((query) => query.isError);
  const error = queries.find((query) => query.error)?.error ?? null;

  const dataDependency = queries.map((q) => q.dataUpdatedAt).join(',');
  const data = useMemo(
    () => queries.flatMap((query) => query.data ?? []),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [dataDependency],
  );

  return {
    data,
    isPending: isAllPending,
    isAnyPending,
    isLoading,
    isFetching,
    isError,
    error,
  };
}


