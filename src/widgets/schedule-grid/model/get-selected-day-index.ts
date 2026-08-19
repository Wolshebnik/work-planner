import type dayjs from 'dayjs';

import type { WeekDay } from './types';

interface GetSelectedDayIndexParams {
  selectedCell?: { dayIndex: number; employeeIndex: number } | null;
  selectedDate?: dayjs.Dayjs;
  week: WeekDay[];
}

export function getSelectedDayIndex({
  selectedCell,
  selectedDate,
  week,
}: GetSelectedDayIndexParams): number {
  if (selectedCell?.dayIndex !== undefined && selectedCell.dayIndex !== null) {
    return selectedCell.dayIndex;
  }
  if (selectedDate) {
    const idx = week.findIndex((d) => d.date.isSame(selectedDate, 'day'));
    if (idx !== -1) return idx;
  }
  const todayIndex = week.findIndex((d) => d.isToday);
  return todayIndex !== -1 ? todayIndex : -1;
}
