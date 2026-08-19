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

  let current = start;
  while (current.isBefore(end) || current.isSame(end, 'day')) {
    const key = getWeekKey(current);
    if (!weekKeys.includes(key)) {
      weekKeys.push(key);
    }
    current = current.add(1, 'day');
  }

  return weekKeys;
}
