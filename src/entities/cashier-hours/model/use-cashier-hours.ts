import { useQuery } from '@tanstack/react-query';
import dayjs from 'dayjs';

import { cashierHoursMonthQueryOptions } from './query-keys';

export function useCashierHours(date: dayjs.Dayjs | string, enabled = true) {
  const monthDate = typeof date === 'string' ? dayjs(date) : date;
  const year = monthDate.year();
  const month = monthDate.month() + 1;

  return useQuery({
    ...cashierHoursMonthQueryOptions(year, month),
    enabled,
  });
}
