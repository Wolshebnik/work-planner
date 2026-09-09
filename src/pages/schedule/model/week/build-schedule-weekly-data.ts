import type dayjs from 'dayjs';

import type { Employee } from '@/entities/employee';
import type { ScheduleEntry } from '@/entities/schedule';
import type { DayCell, EmployeeRow } from '@/widgets/schedule-grid';

interface BuildScheduleWeeklyDataParams {
  activeEmployees: Employee[];
  scheduleEntries: ScheduleEntry[];
  startOfWeek: dayjs.Dayjs;
}

export function buildScheduleWeeklyData({
  activeEmployees,
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

  return activeEmployees.map((employee) => {
    const values: (DayCell | null)[] = [];

    for (let dayIndex = 0; dayIndex < 7; dayIndex += 1) {
      const day = startOfWeek.add(dayIndex, 'day');
      const dateStr = day.format('YYYY-MM-DD');
      const entry = entriesByEmployeeAndDate.get(`${employee.id}:${dateStr}`);

      if (entry) {
        values.push({
          color: entry.status.color,
          isLocked: entry.status.is_locked,
          scheduleMark: entry.status.schedule_mark,
        });
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
