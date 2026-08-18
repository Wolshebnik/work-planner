import dayjs from 'dayjs';
import isoWeek from 'dayjs/plugin/isoWeek';

import { type WeekDay } from './types';

dayjs.extend(isoWeek);

const WEEKDAY_LABELS: Record<string, string> = {
  Mon: 'Пн',
  Tue: 'Вт',
  Wed: 'Ср',
  Thu: 'Чт',
  Fri: 'Пт',
  Sat: 'Сб',
  Sun: 'Нд',
};

export function getWeekDays(date: dayjs.Dayjs): WeekDay[] {
  const start = date.startOf('isoWeek');
  const today = dayjs();

  const result: WeekDay[] = [];
  for (let i = 0; i < 7; i += 1) {
    const current = start.add(i, 'day');
    const en = current.format('ddd');

    result.push({
      date: current,
      label: WEEKDAY_LABELS[en] ?? en,
      number: current.format('D'),
      isToday: current.isSame(today, 'day'),
    });
  }
  return result;
}
