import { useQuery } from '@tanstack/react-query';
import dayjs from 'dayjs';

import { scheduleMonthQueryOptions } from './query-keys';

export function useScheduleByMonth(
  month: dayjs.Dayjs | string,
  enabled = true,
) {
  const monthDate = typeof month === 'string' ? dayjs(month) : month;
  const monthKey = monthDate.format('YYYY-MM');

  return useQuery({
    ...scheduleMonthQueryOptions(monthKey),
    enabled,
  });
}


