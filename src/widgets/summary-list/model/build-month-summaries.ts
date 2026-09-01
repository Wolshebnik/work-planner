import dayjs from 'dayjs';

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
  const monthDate =
    typeof selectedDate === 'string' ? dayjs(selectedDate) : selectedDate;
  const monthStart = monthDate.startOf('month');
  const monthEnd = monthDate.endOf('month');
  const weekStarts = new Map<string, dayjs.Dayjs>();

  Array.from({ length: monthEnd.diff(monthStart, 'day') + 1 }, (_, index) =>
    monthStart.add(index, 'day'),
  ).forEach((current) => {
    const weekKey = getWeekKey(current);

    if (!weekStarts.has(weekKey))
      weekStarts.set(weekKey, current.startOf('isoWeek'));
  });

  const weekLabels = weekKeys.map((key) => {
    const start = weekStarts.get(key);
    const end = start?.add(6, 'day');

    if (!start || !end) {
      return '';
    }

    const visibleStart = start.isBefore(monthStart) ? monthStart : start;
    const visibleEnd = end.isAfter(monthEnd) ? monthEnd : end;

    const startLabel = visibleStart.format('D');
    const endLabel = visibleEnd.format('D');

    return startLabel === endLabel ? startLabel : `${startLabel}–${endLabel}`;
  });

  return employees.map((employee) => {
    const weekHoursMap = new Map<string, number>(
      weekKeys.map((key) => [key, 0]),
    );

    const weekWorkDaysMap = new Map<string, Set<string>>(
      weekKeys.map((key) => [key, new Set<string>()]),
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
        weekWorkDaysMap.get(weekKey)?.add(entry.work_date);
      }
    }

    const weeklyHours = weekKeys.map((key) => weekHoursMap.get(key) ?? 0);
    const monthlyHours = weeklyHours.reduce((acc, hours) => acc + hours, 0);
    const weeklyWorkDays = weekKeys.map(
      (key) => weekWorkDaysMap.get(key)?.size ?? 0,
    );

    return {
      employeeId: employee.id,
      weekLabels,
      weeklyWorkDays,
      weeklyHours,
      monthlyHours,
    };
  });
}
