import type dayjs from 'dayjs';

export function getWeekPeriodLabel(date: dayjs.Dayjs): string {
  const startOfWeek = date.startOf('isoWeek');
  const endOfWeek = startOfWeek.add(6, 'day');

  const isSameMonth = startOfWeek.isSame(endOfWeek, 'month');
  const isSameYear = startOfWeek.isSame(endOfWeek, 'year');

  if (isSameMonth) {
    return `${startOfWeek.format('D')}–${endOfWeek.format('D')} ${startOfWeek.format('MMMM YYYY')}`;
  }

  if (isSameYear) {
    return `${startOfWeek.format('D MMM')} – ${endOfWeek.format('D MMM YYYY')}`;
  }

  return `${startOfWeek.format('D MMM YYYY')} – ${endOfWeek.format('D MMM YYYY')}`;
}

export function getWeekNumberLabel(date: dayjs.Dayjs): string {
  return `Тиждень ${date.week()}`;
}

export function getMonthLabel(date: dayjs.Dayjs): string {
  const monthName = date.format('MMMM');
  return `${monthName.charAt(0).toUpperCase()}${monthName.slice(1)} ${date.format('YYYY')}`;
}
