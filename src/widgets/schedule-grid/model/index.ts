import dayjs from 'dayjs';
import isoWeek from 'dayjs/plugin/isoWeek';

dayjs.extend(isoWeek);
/**
 * Значение ячейки графика.
 * 'П'  — presence (success)
 * 'В'  — absence (danger)
 * '½'  — half day (warning)
 * 'lock' — locked slot (maroon, иконка добавляется отдельно)
 */
export type DayCell = 'П' | 'В' | '½' | 'lock';
export interface EmployeeRow {
  name: string;
  values: DayCell[];
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
/**
 * Строит 7 дней недели, начиная с Пн, из недели, содержащей `date`.
 */
export function getWeekDays(date: dayjs.Dayjs): WeekDay[] {
  // startOf('isoWeek') всегда возвращает понедельник.
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
/**
 * Хардкод-данные недели (пока без бэкенда).
 * Порядок сотрудников и дней соответствует скриншоту.
 */

export const scheduleData: EmployeeRow[] = [
  { name: 'Тесленко', values: ['П', 'П', 'П', 'П', 'П', 'В', 'В'] },
  { name: 'Чумач', values: ['½', 'П', 'В', 'П', 'В', 'lock', 'В'] },
  { name: 'Панько', values: ['В', 'В', 'П', 'П', 'П', 'П', 'П'] },
  { name: 'Черник', values: ['П', 'П', 'В', 'В', 'П', 'П', '½'] },
  { name: 'Кашкар', values: ['П', 'П', 'П', 'П', 'В', 'В', 'П'] },
  { name: 'Привал', values: ['В', 'В', 'П', 'П', 'П', 'П', 'П'] },
  { name: 'Жукова', values: ['П', 'П', 'П', 'П', 'В', 'В', 'П'] },
];

/**
 * Начало недели (Пн) — хардкод.
 * 2026-08-03 соответствует неделе 3–9 августа 2026.
 */
export const weekStart = dayjs('2026-08-03');
