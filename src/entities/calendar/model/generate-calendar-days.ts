import dayjs from 'dayjs';

import { type CalendarDay } from './types';

export function generateCalendarDays(startDate: dayjs.Dayjs): CalendarDay[] {
  const startOfMonth = startDate.startOf('month').startOf('isoWeek');
  const days: CalendarDay[] = [];

  for (let i = 0; i < 42; i++) {
    const day = startOfMonth.add(i, 'day');
    days.push({
      date: day,
      label: day.format('dd'),
      number: day.format('D'),
      isToday: day.isSame(dayjs(), 'day'),
      isWeekend: day.day() === 6 || day.day() === 0,
      isCurrentMonth: day.isSame(startDate, 'month'),
    });
  }

  return days;
}
