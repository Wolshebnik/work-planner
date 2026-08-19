import type { QueryClient } from '@tanstack/react-query';
import type dayjs from 'dayjs';

import { generateCalendarDays } from '@/entities/calendar';
import { type ViewMode } from '@/shared/ui/view-switcher';

import { scheduleMonthQueryOptions } from './query-keys';

export function getRequiredMonthKeys(
  viewMode: ViewMode,
  currentDate: dayjs.Dayjs,
): string[] {
  if (viewMode === 'week') {
    const prevWeek = currentDate.subtract(1, 'week');
    const nextWeek = currentDate.add(1, 'week');

    const weeks = [prevWeek, currentDate, nextWeek];
    const monthKeys = new Set<string>();

    for (const week of weeks) {
      const start = week.startOf('isoWeek').format('YYYY-MM');
      const end = week.endOf('isoWeek').format('YYYY-MM');
      monthKeys.add(start);
      monthKeys.add(end);
    }

    return Array.from(monthKeys);
  }

  const prevPrevMonth = currentDate.subtract(2, 'month').format('YYYY-MM');
  const prevMonth = currentDate.subtract(1, 'month').format('YYYY-MM');
  const currMonth = currentDate.format('YYYY-MM');
  const nextMonth = currentDate.add(1, 'month').format('YYYY-MM');
  const nextNextMonth = currentDate.add(2, 'month').format('YYYY-MM');

  return Array.from(
    new Set([prevPrevMonth, prevMonth, currMonth, nextMonth, nextNextMonth]),
  );
}

export async function preparePagerMonths(
  currentDate: dayjs.Dayjs,
  viewMode: ViewMode,
  queryClient: QueryClient,
): Promise<void> {
  if (viewMode !== 'month') return;

  const pagerMonths = [
    currentDate.subtract(1, 'month'),
    currentDate,
    currentDate.add(1, 'month'),
  ];

  const touchedMonthKeys = new Set<string>();
  for (const monthDate of pagerMonths) {
    const days = generateCalendarDays(monthDate);
    for (const day of days) {
      touchedMonthKeys.add(day.date.format('YYYY-MM'));
    }
  }

  await Promise.allSettled(
    Array.from(touchedMonthKeys).map((monthKey) =>
      queryClient.ensureQueryData(scheduleMonthQueryOptions(monthKey)),
    ),
  );
}




