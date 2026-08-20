import dayjs from 'dayjs';

import { type ExportPeriodOption } from './types';

export function getExportWeekPeriodOptions(date: dayjs.Dayjs): {
  defaultIndex: number;
  isCrossMonth: boolean;
  options: ExportPeriodOption[];
} {
  const startOfWeek = date.startOf('isoWeek');
  const endOfWeek = startOfWeek.add(6, 'day');

  const isSameMonth = startOfWeek.isSame(endOfWeek, 'month');

  if (isSameMonth) {
    const rawMonth = startOfWeek.format('MMMM');
    const monthName = `${rawMonth.charAt(0).toUpperCase()}${rawMonth.slice(1)}`;
    const monthLabel = `${monthName} ${startOfWeek.format('YYYY')}`;
    const weekLabel = `${startOfWeek.format('D')}–${endOfWeek.format('D MMMM YYYY')}`;

    return {
      isCrossMonth: false,
      defaultIndex: 0,
      options: [
        {
          endDate: endOfWeek,
          monthKey: startOfWeek.format('YYYY-MM'),
          monthLabel,
          monthName,
          startDate: startOfWeek,
          weekLabel,
        },
      ],
    };
  }

  const endOfFirstMonth = startOfWeek.endOf('month');
  const startOfSecondMonth = endOfWeek.startOf('month');

  const rawFirstMonth = startOfWeek.format('MMMM');
  const firstMonthName = `${rawFirstMonth.charAt(0).toUpperCase()}${rawFirstMonth.slice(1)}`;
  const firstMonthLabel = `${firstMonthName} ${startOfWeek.format('YYYY')}`;

  const rawSecondMonth = endOfWeek.format('MMMM');
  const secondMonthName = `${rawSecondMonth.charAt(0).toUpperCase()}${rawSecondMonth.slice(1)}`;
  const secondMonthLabel = `${secondMonthName} ${endOfWeek.format('YYYY')}`;

  const firstWeekLabel =
    startOfWeek.date() === endOfFirstMonth.date()
      ? `${startOfWeek.format('D MMMM YYYY')}`
      : `${startOfWeek.format('D')}–${endOfFirstMonth.format('D MMMM YYYY')}`;

  const secondWeekLabel =
    startOfSecondMonth.date() === endOfWeek.date()
      ? `${startOfSecondMonth.format('D MMMM YYYY')}`
      : `${startOfSecondMonth.format('D')}–${endOfWeek.format('D MMMM YYYY')}`;

  let defaultIndex = 0;

  const today = dayjs();
  const isTodayInWeek =
    (today.isAfter(startOfWeek, 'day') || today.isSame(startOfWeek, 'day')) &&
    (today.isBefore(endOfWeek, 'day') || today.isSame(endOfWeek, 'day'));

  if (isTodayInWeek && today.isSame(endOfWeek, 'month')) {
    defaultIndex = 1;
  }

  return {
    isCrossMonth: true,
    defaultIndex,
    options: [
      {
        endDate: endOfFirstMonth,
        monthKey: startOfWeek.format('YYYY-MM'),
        monthLabel: firstMonthLabel,
        monthName: firstMonthName,
        startDate: startOfWeek,
        weekLabel: firstWeekLabel,
      },
      {
        endDate: endOfWeek,
        monthKey: endOfWeek.format('YYYY-MM'),
        monthLabel: secondMonthLabel,
        monthName: secondMonthName,
        startDate: startOfSecondMonth,
        weekLabel: secondWeekLabel,
      },
    ],
  };
}