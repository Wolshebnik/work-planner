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

export function getWeekMonthLabel(date: dayjs.Dayjs): string {
  const midWeek = date.startOf('isoWeek').add(3, 'day');
  return getMonthLabel(midWeek);
}

export interface ExportPeriodOption {
  monthKey: string;
  monthLabel: string;
  weekLabel: string;
}

export function getExportWeekPeriodOptions(date: dayjs.Dayjs): {
  defaultIndex: number;
  isCrossMonth: boolean;
  options: ExportPeriodOption[];
} {
  const startOfWeek = date.startOf('isoWeek');
  const endOfWeek = startOfWeek.add(6, 'day');

  const isSameMonth = startOfWeek.isSame(endOfWeek, 'month');

  if (isSameMonth) {
    const monthLabel = getMonthLabel(startOfWeek);
    const weekLabel = getWeekPeriodLabel(date);
    return {
      isCrossMonth: false,
      defaultIndex: 0,
      options: [
        {
          monthKey: startOfWeek.format('YYYY-MM'),
          monthLabel,
          weekLabel,
        },
      ],
    };
  }

  const endOfFirstMonth = startOfWeek.endOf('month');
  const startOfSecondMonth = endOfWeek.startOf('month');

  const firstMonthLabel = getMonthLabel(startOfWeek);
  const secondMonthLabel = getMonthLabel(endOfWeek);

  const firstWeekLabel =
    startOfWeek.date() === endOfFirstMonth.date()
      ? `${startOfWeek.format('D')} ${startOfWeek.format('MMMM YYYY')}`
      : `${startOfWeek.format('D')}–${endOfFirstMonth.format('D')} ${startOfWeek.format('MMMM YYYY')}`;

  const secondWeekLabel =
    startOfSecondMonth.date() === endOfWeek.date()
      ? `${startOfSecondMonth.format('D')} ${endOfWeek.format('MMMM YYYY')}`
      : `${startOfSecondMonth.format('D')}–${endOfWeek.format('D')} ${endOfWeek.format('MMMM YYYY')}`;

  const midWeek = startOfWeek.add(3, 'day');
  const defaultIndex = midWeek.isSame(endOfWeek, 'month') ? 1 : 0;

  return {
    isCrossMonth: true,
    defaultIndex,
    options: [
      {
        monthKey: startOfWeek.format('YYYY-MM'),
        monthLabel: firstMonthLabel,
        weekLabel: firstWeekLabel,
      },
      {
        monthKey: endOfWeek.format('YYYY-MM'),
        monthLabel: secondMonthLabel,
        weekLabel: secondWeekLabel,
      },
    ],
  };
}
