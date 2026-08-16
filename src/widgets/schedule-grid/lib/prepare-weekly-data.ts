import dayjs from 'dayjs';
import { type EmployeeRow, type EmployeeRow1 } from '../model';

export function prepareWeeklyData(
  data: EmployeeRow1[],
  startOfWeek: dayjs.Dayjs,
): EmployeeRow[] {
  return data.map((employee) => ({
    name: employee.name,
    values: Array.from({ length: 7 }).map((_, i) => {
      const day = startOfWeek.add(i, 'day');
      const dateStr = day.format('YYYY-MM-DD');
      const value = employee.values.find((v) => v.date === dateStr);
      return value ? { short: value.short, isLocked: value.isLocked } : { short: '' };
    }),
  }));
}
