import { useQuery } from '@tanstack/react-query';
import dayjs from 'dayjs';

import { getScheduleByMonth } from '../api/get-schedule-by-month';
import { scheduleKeys } from './query-keys';

export function useScheduleByMonth(month: dayjs.Dayjs | string) {
  const monthDate = typeof month === 'string' ? dayjs(month) : month;
  const monthKey = monthDate.format('YYYY-MM');

  return useQuery({
    queryKey: scheduleKeys.month(monthKey),
    queryFn: () => getScheduleByMonth(monthDate),
  });
}
