import type dayjs from 'dayjs';

import { type ViewMode } from '@/shared/ui/view-switcher';

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

  const prevMonth = currentDate.subtract(1, 'month').format('YYYY-MM');
  const currMonth = currentDate.format('YYYY-MM');
  const nextMonth = currentDate.add(1, 'month').format('YYYY-MM');

  return Array.from(new Set([prevMonth, currMonth, nextMonth]));
}
