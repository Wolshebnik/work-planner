import type dayjs from 'dayjs';

import type { Employee } from '@/entities/employee';
import type { ScheduleEntry } from '@/entities/schedule';

import { getMonthWeekKeys, getWeekKey } from './get-month-week-keys';
import { getWorkHours } from './get-work-hours';
import type { EmployeeMonthSummary } from './types';

export function buildMonthSummaries(
  employees: Employee[],
  scheduleEntries: ScheduleEntry[],
  selectedDate: dayjs.Dayjs | string,
): EmployeeMonthSummary[] {
  const weekKeys = getMonthWeekKeys(selectedDate);

  return employees.map((employee) => {
    const weekHoursMap = new Map<string, number>(
      weekKeys.map((key) => [key, 0]),
    );

    for (const entry of scheduleEntries) {
      if (entry.employee_id !== employee.id) {
        continue;
      }

      const hours = getWorkHours(entry.status?.excel_mark);
      if (hours <= 0) {
        continue;
      }

      const weekKey = getWeekKey(entry.work_date);
      if (weekHoursMap.has(weekKey)) {
        const currentHours = weekHoursMap.get(weekKey) ?? 0;
        weekHoursMap.set(weekKey, currentHours + hours);
      }
    }

    const weeklyHours = weekKeys.map((key) => weekHoursMap.get(key) ?? 0);
    const monthlyHours = weeklyHours.reduce((acc, hours) => acc + hours, 0);

    return {
      employeeId: employee.id,
      weeklyHours,
      monthlyHours,
    };
  });
}
