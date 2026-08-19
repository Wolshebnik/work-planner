import type dayjs from 'dayjs';

import type { WeekDay } from './types';

interface GetSelectedDayIndexParams {
  selectedCell?: { dayIndex: number; employeeIndex: number } | null;
  selectedDate?: dayjs.Dayjs | null;
  week: WeekDay[];
}

export function getSelectedDayIndex({
  selectedCell,
  selectedDate,
  week,
}: GetSelectedDayIndexParams): number {
  if (selectedDate) {
    const idx = week.findIndex((d) => d.date.isSame(selectedDate, 'day'));
    if (idx !== -1) return idx;
  }
  if (selectedCell?.dayIndex !== undefined && selectedCell.dayIndex !== null) {
    return selectedCell.dayIndex;
  }
  return -1;
}

export function getTodayDayIndex(week: WeekDay[]): number {
  return week.findIndex((d) => d.isToday);
}
