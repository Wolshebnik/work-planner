import dayjs from 'dayjs';
import isoWeek from 'dayjs/plugin/isoWeek';

dayjs.extend(isoWeek);

export interface DayCell {
  short: string;
  isLocked?: boolean;
}

export interface EmployeeValue extends DayCell {
  date: string;
}

export interface EmployeeRow {
  name: string;
  values: DayCell[];
}

export interface EmployeeRow1 {
  id: string;
  name: string;
  values: EmployeeValue[];
}
export interface WeekDay {
  /** dayjs-объект дня */
  date: dayjs.Dayjs;
  /** число месяца: 2, 3, … */
  number: string;
  /** короткий день недели: Пн, Вт, … */
  label: string;
  /** true, если день совпадает с текущей датой */
  isToday: boolean;
}

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

export const scheduleData: EmployeeRow1[] = [
  {
    id: '1',
    name: 'Тесленко',
    values: [
      { date: '2026-08-01', short: '9' },
      { date: '2026-08-02', short: '-' },
      { date: '2026-08-03', short: '9' },
      { date: '2026-08-04', short: '9' },
      { date: '2026-08-05', short: '9' },
      { date: '2026-08-06', short: '9' },
      { date: '2026-08-07', short: '9' },
      { date: '2026-08-08', short: 'Б' },
      { date: '2026-08-09', short: '-' },
      { date: '2026-08-10', short: 'Б' },
      { date: '2026-08-11', short: '9' },
      { date: '2026-08-12', short: '9' },
      { date: '2026-08-13', short: '9' },
      { date: '2026-08-14', short: '9' },
      { date: '2026-08-15', short: '9' },
      { date: '2026-08-16', short: '-' },
      { date: '2026-08-17', short: '9' },
      { date: '2026-08-18', short: '9' },
      { date: '2026-08-19', short: '9' },
      { date: '2026-08-20', short: '9' },
      { date: '2026-08-21', short: '9' },
      { date: '2026-08-22', short: '9' },
      { date: '2026-08-23', short: '-' },
      { date: '2026-08-24', short: '9' },
      { date: '2026-08-25', short: 'О' },
      { date: '2026-08-26', short: 'О' },
      { date: '2026-08-27', short: 'О' },
      { date: '2026-08-28', short: '9' },
      { date: '2026-08-29', short: '9' },
      { date: '2026-08-30', short: '-' },
      { date: '2026-08-31', short: '9' },
    ],
  },

  {
    id: '2',
    name: 'Чумаченко',
    values: [
      { date: '2026-08-01', short: '9' },
      { date: '2026-08-02', short: '-' },
      { date: '2026-08-03', short: '9' },
      { date: '2026-08-04', short: '9' },
      { date: '2026-08-05', short: 'О' },
      { date: '2026-08-06', short: 'О' },
      { date: '2026-08-07', short: '9' },
      { date: '2026-08-08', short: '9' },
      { date: '2026-08-09', short: '-' },
      { date: '2026-08-10', short: '9' },
      { date: '2026-08-11', short: '9' },
      { date: '2026-08-12', short: '9' },
      { date: '2026-08-13', short: 'НА' },
      { date: '2026-08-14', short: '9' },
      { date: '2026-08-15', short: '9' },
      { date: '2026-08-16', short: '-' },
      { date: '2026-08-17', short: '9' },
      { date: '2026-08-18', short: '9' },
      { date: '2026-08-19', short: '9' },
      { date: '2026-08-20', short: '9' },
      { date: '2026-08-21', short: '9' },
      { date: '2026-08-22', short: '9' },
      { date: '2026-08-23', short: '-', isLocked: true },
      { date: '2026-08-24', short: '9' },
      { date: '2026-08-25', short: 'Б' },
      { date: '2026-08-26', short: '9' },
      { date: '2026-08-27', short: '9' },
      { date: '2026-08-28', short: '9' },
      { date: '2026-08-29', short: '9' },
      { date: '2026-08-30', short: '-' },
      { date: '2026-08-31', short: '9' },
    ],
  },

  {
    id: '3',
    name: 'Панько',
    values: [
      { date: '2026-08-01', short: '9' },
      { date: '2026-08-02', short: '-' },
      { date: '2026-08-03', short: '9' },
      { date: '2026-08-04', short: '9' },
      { date: '2026-08-05', short: '9' },
      { date: '2026-08-06', short: '9' },
      { date: '2026-08-07', short: '9' },
      { date: '2026-08-08', short: '9' },
      { date: '2026-08-09', short: '-' },
      { date: '2026-08-10', short: '9' },
      { date: '2026-08-11', short: 'Б' },
      { date: '2026-08-12', short: 'Б' },
      { date: '2026-08-13', short: '9' },
      { date: '2026-08-14', short: '9' },
      { date: '2026-08-15', short: '9' },
      { date: '2026-08-16', short: '-' },
      { date: '2026-08-17', short: '9' },
      { date: '2026-08-18', short: '9' },
      { date: '2026-08-19', short: 'НА' },
      { date: '2026-08-20', short: '9' },
      { date: '2026-08-21', short: '9' },
      { date: '2026-08-22', short: '9' },
      { date: '2026-08-23', short: '-' },
      { date: '2026-08-24', short: '9' },
      { date: '2026-08-25', short: '9' },
      { date: '2026-08-26', short: '9' },
      { date: '2026-08-27', short: '9' },
      { date: '2026-08-28', short: '9' },
      { date: '2026-08-29', short: '9' },
      { date: '2026-08-30', short: '-' },
      { date: '2026-08-31', short: '9' },
    ],
  },

  {
    id: '4',
    name: 'Черник',
    values: [
      { date: '2026-08-01', short: '9' },
      { date: '2026-08-02', short: '-' },
      { date: '2026-08-03', short: '9' },
      { date: '2026-08-04', short: 'ПР' },
      { date: '2026-08-05', short: '9' },
      { date: '2026-08-06', short: '9' },
      { date: '2026-08-07', short: '9' },
      { date: '2026-08-08', short: '9' },
      { date: '2026-08-09', short: '-' },
      { date: '2026-08-10', short: '9' },
      { date: '2026-08-11', short: '9' },
      { date: '2026-08-12', short: '9' },
      { date: '2026-08-13', short: '9' },
      { date: '2026-08-14', short: '9' },
      { date: '2026-08-15', short: '9' },
      { date: '2026-08-16', short: '-' },
      { date: '2026-08-17', short: 'ПР' },
      { date: '2026-08-18', short: '9' },
      { date: '2026-08-19', short: '9' },
      { date: '2026-08-20', short: '9' },
      { date: '2026-08-21', short: '9' },
      { date: '2026-08-22', short: '9' },
      { date: '2026-08-23', short: '-' },
      { date: '2026-08-24', short: '9' },
      { date: '2026-08-25', short: '9' },
      { date: '2026-08-26', short: 'Б' },
      { date: '2026-08-27', short: '9' },
      { date: '2026-08-28', short: '9' },
      { date: '2026-08-29', short: '9' },
      { date: '2026-08-30', short: '-' },
      { date: '2026-08-31', short: '9' },
    ],
  },

  {
    id: '5',
    name: 'Кашкар',
    values: [
      { date: '2026-08-01', short: '9' },
      { date: '2026-08-02', short: '-' },
      { date: '2026-08-03', short: '9' },
      { date: '2026-08-04', short: '9' },
      { date: '2026-08-05', short: '9' },
      { date: '2026-08-06', short: '9' },
      { date: '2026-08-07', short: '9' },
      { date: '2026-08-08', short: '9' },
      { date: '2026-08-09', short: '-' },
      { date: '2026-08-10', short: '9' },
      { date: '2026-08-11', short: '9' },
      { date: '2026-08-12', short: '9' },
      { date: '2026-08-13', short: '9' },
      { date: '2026-08-14', short: '9' },
      { date: '2026-08-15', short: '9' },
      { date: '2026-08-16', short: '-' },
      { date: '2026-08-17', short: '9' },
      { date: '2026-08-18', short: '9' },
      { date: '2026-08-19', short: '9' },
      { date: '2026-08-20', short: 'УВ' },
      { date: '2026-08-21', short: 'УВ' },
      { date: '2026-08-22', short: 'УВ' },
      { date: '2026-08-23', short: 'УВ' },
      { date: '2026-08-24', short: 'УВ' },
      { date: '2026-08-25', short: 'УВ' },
      { date: '2026-08-26', short: 'УВ' },
      { date: '2026-08-27', short: 'УВ' },
      { date: '2026-08-28', short: 'УВ' },
      { date: '2026-08-29', short: 'УВ' },
      { date: '2026-08-30', short: 'УВ' },
      { date: '2026-08-31', short: 'УВ' },
    ],
  },

  {
    id: '6',
    name: 'Привал',
    values: [
      { date: '2026-08-01', short: 'О' },
      { date: '2026-08-02', short: 'О' },
      { date: '2026-08-03', short: 'О' },
      { date: '2026-08-04', short: 'О' },
      { date: '2026-08-05', short: '9' },
      { date: '2026-08-06', short: '9' },
      { date: '2026-08-07', short: '9' },
      { date: '2026-08-08', short: '9' },
      { date: '2026-08-09', short: '-' },
      { date: '2026-08-10', short: '9' },
      { date: '2026-08-11', short: '9' },
      { date: '2026-08-12', short: 'Б' },
      { date: '2026-08-13', short: '9' },
      { date: '2026-08-14', short: '9' },
      { date: '2026-08-15', short: '9' },
      { date: '2026-08-16', short: '-' },
      { date: '2026-08-17', short: '9' },
      { date: '2026-08-18', short: '9' },
      { date: '2026-08-19', short: '9' },
      { date: '2026-08-20', short: '9' },
      { date: '2026-08-21', short: '9' },
      { date: '2026-08-22', short: '9' },
      { date: '2026-08-23', short: '-' },
      { date: '2026-08-24', short: '9' },
      { date: '2026-08-25', short: '9' },
      { date: '2026-08-26', short: '9' },
      { date: '2026-08-27', short: 'Б' },
      { date: '2026-08-28', short: '9' },
      { date: '2026-08-29', short: '9' },
      { date: '2026-08-30', short: '-' },
      { date: '2026-08-31', short: '9' },
    ],
  },

  {
    id: '7',
    name: 'Жукова',
    values: [
      { date: '2026-08-01', short: '9' },
      { date: '2026-08-02', short: '-' },
      { date: '2026-08-03', short: '9' },
      { date: '2026-08-04', short: 'НА' },
      { date: '2026-08-05', short: '9' },
      { date: '2026-08-06', short: '9' },
      { date: '2026-08-07', short: '9' },
      { date: '2026-08-08', short: '9' },
      { date: '2026-08-09', short: '-' },
      { date: '2026-08-10', short: '9' },
      { date: '2026-08-11', short: '9' },
      { date: '2026-08-12', short: 'ПР' },
      { date: '2026-08-13', short: '9' },
      { date: '2026-08-14', short: '9' },
      { date: '2026-08-15', short: 'СТ' },
      { date: '2026-08-16', short: '-' },
      { date: '2026-08-17', short: '9' },
      { date: '2026-08-18', short: 'НА' },
      { date: '2026-08-19', short: '9' },
      { date: '2026-08-20', short: '9' },
      { date: '2026-08-21', short: '9' },
      { date: '2026-08-22', short: '9' },
      { date: '2026-08-23', short: '-' },
      { date: '2026-08-24', short: '9' },
      { date: '2026-08-25', short: 'Б' },
      { date: '2026-08-26', short: '9' },
      { date: '2026-08-27', short: '9' },
      { date: '2026-08-28', short: '9' },
      { date: '2026-08-29', short: '9' },
      { date: '2026-08-30', short: '-' },
      { date: '2026-08-31', short: '9' },
    ],
  },
];
