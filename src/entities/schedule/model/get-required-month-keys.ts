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

  if (viewMode === 'month' || viewMode === 'summary') {
    for (let offset = -2; offset <= 2; offset += 1) {
      monthKeys.add(currentDate.add(offset, 'month').format('YYYY-MM'));
    }
    return Array.from(monthKeys);
  }

  monthKeys.add(currentDate.subtract(1, 'month').format('YYYY-MM'));
  monthKeys.add(currentDate.format('YYYY-MM'));
  monthKeys.add(currentDate.add(1, 'month').format('YYYY-MM'));

  const prevWeek = currentDate.subtract(1, 'week');
  const nextWeek = currentDate.add(1, 'week');
  monthKeys.add(prevWeek.startOf('isoWeek').format('YYYY-MM'));
  monthKeys.add(nextWeek.endOf('isoWeek').format('YYYY-MM'));

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
