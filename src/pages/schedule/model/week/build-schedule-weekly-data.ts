import type dayjs from 'dayjs';

import {
  isEmployeeBeforeRestoreInMonth,
  isEmployeeScheduleDateLocked,
  isEmployeeVisibleOnDate,
  type Employee,
} from '@/entities/employee';
import type { ScheduleEntry } from '@/entities/schedule';
import type { DayCell, EmployeeRow } from '@/widgets/schedule-grid';

interface BuildScheduleWeeklyDataParams {
  employees: Employee[];
  scheduleEntries: ScheduleEntry[];
  startOfWeek: dayjs.Dayjs;
}

export function buildScheduleWeeklyData({
  employees,
  scheduleEntries,
  startOfWeek,
}: BuildScheduleWeeklyDataParams): EmployeeRow[] {
  const entriesByEmployeeAndDate = new Map<string, ScheduleEntry>();

  for (const entry of scheduleEntries) {
    entriesByEmployeeAndDate.set(
      `${entry.employee_id}:${entry.work_date}`,
      entry,
    );
  }

  const employeesForWeek = employees.filter((employee) =>
    Array.from({ length: 7 }, (_, dayIndex) =>
      isEmployeeVisibleOnDate(
        employee,
        startOfWeek.add(dayIndex, 'day').format('YYYY-MM-DD'),
      ),
    ).some(Boolean),
  );

  return employeesForWeek.map((employee) => {
    const values: (DayCell | null)[] = [];

    for (let dayIndex = 0; dayIndex < 7; dayIndex += 1) {
      const day = startOfWeek.add(dayIndex, 'day');
      const dateStr = day.format('YYYY-MM-DD');
      const isVisible = isEmployeeVisibleOnDate(employee, dateStr);
      const entry = entriesByEmployeeAndDate.get(`${employee.id}:${dateStr}`);

      if (!isVisible) {
        values.push(null);
        continue;
      }

      if (isEmployeeBeforeRestoreInMonth(employee, dateStr)) {
        values.push({ color: 'transparent', isLocked: true });
        continue;
      }

      if (entry) {
        values.push({
          color: entry.status.color,
          isLocked:
            entry.status.is_locked ||
            isEmployeeScheduleDateLocked(employee, dateStr),
          scheduleMark: entry.status.schedule_mark,
        });
        continue;
      }

      if (isEmployeeScheduleDateLocked(employee, dateStr)) {
        values.push({ color: 'transparent', isLocked: true });
        continue;
      }

      values.push(null);
    }

    return {
      id: employee.id,
      name: employee.last_name,
      values,
    };
  });
}
