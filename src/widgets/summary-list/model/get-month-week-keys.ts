import dayjs from 'dayjs';
import isoWeek from 'dayjs/plugin/isoWeek';

dayjs.extend(isoWeek);

export function getWeekKey(date: dayjs.Dayjs | string): string {
  const value = typeof date === 'string' ? dayjs(date) : date;

  return `${value.isoWeekYear()}-${value.isoWeek()}`;
}

export function getMonthWeekKeys(date: dayjs.Dayjs | string): string[] {
  const monthDate = typeof date === 'string' ? dayjs(date) : date;
  const start = monthDate.startOf('month');
  const end = monthDate.endOf('month');
  const weekKeys: string[] = [];

  const totalDays = end.diff(start, 'day');

  for (let dayOffset = 0; dayOffset <= totalDays; dayOffset += 1) {
    const current = start.add(dayOffset, 'day');
    const key = getWeekKey(current);

    if (!weekKeys.includes(key)) {
      weekKeys.push(key);
    }
  }

  return weekKeys;
}
