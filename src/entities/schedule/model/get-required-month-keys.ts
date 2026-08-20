import type { QueryClient } from '@tanstack/react-query';
import dayjs from 'dayjs';
import isoWeek from 'dayjs/plugin/isoWeek';

import { type ViewMode } from '@/shared/ui/view-switcher';

import { scheduleMonthQueryOptions } from './query-keys';

dayjs.extend(isoWeek);

export function getRequiredMonthKeys(
  viewMode: ViewMode,
  currentDate: dayjs.Dayjs,
): string[] {
  const monthKeys = new Set<string>();

  if (viewMode === 'month') {
    // 5-month buffer for month view: [M-2, M-1, M, M+1, M+2]
    for (let offset = -2; offset <= 2; offset += 1) {
      monthKeys.add(currentDate.add(offset, 'month').format('YYYY-MM'));
    }
    return Array.from(monthKeys);
  }

  // 3-month sliding buffer for week view: [M-1, M, M+1]
  monthKeys.add(currentDate.subtract(1, 'month').format('YYYY-MM'));
  monthKeys.add(currentDate.format('YYYY-MM'));
  monthKeys.add(currentDate.add(1, 'month').format('YYYY-MM'));

  // Ensure cross-month boundary weeks in active 5-screen window are covered
  const prev2Weeks = currentDate.subtract(2, 'week');
  const next2Weeks = currentDate.add(2, 'week');
  monthKeys.add(prev2Weeks.startOf('isoWeek').format('YYYY-MM'));
  monthKeys.add(next2Weeks.endOf('isoWeek').format('YYYY-MM'));

  return Array.from(monthKeys);
}

export async function preparePagerMonths(
  currentDate: dayjs.Dayjs,
  viewMode: ViewMode,
  queryClient: QueryClient,
): Promise<void> {
  const monthKeys = getRequiredMonthKeys(viewMode, currentDate);

  await Promise.allSettled(
    monthKeys.map((monthKey) =>
      queryClient.ensureQueryData(scheduleMonthQueryOptions(monthKey)),
    ),
  );
}




