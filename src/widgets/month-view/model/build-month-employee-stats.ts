import {
  isEmployeeBeforeRestoreInMonth,
  isEmployeeVisibleOnDate,
  type Employee,
} from '@/entities/employee';
import { isWorkStatus, type ScheduleEntry } from '@/entities/schedule';

import type { DayEmployeeStats, EmployeeDayInfo } from './types';

export function buildMonthEmployeeStats(
  employees: Employee[],
  scheduleEntries: ScheduleEntry[],
): Map<string, DayEmployeeStats> {
  const employeesById = new Map(employees.map((employee) => [employee.id, employee]));

  const entriesByDate = new Map<string, Map<string, ScheduleEntry>>();

  for (const entry of scheduleEntries) {
    const employee = employeesById.get(entry.employee_id);

    if (
      !employee ||
      !isEmployeeVisibleOnDate(employee, entry.work_date) ||
      isEmployeeBeforeRestoreInMonth(employee, entry.work_date)
    ) {
      continue;
    }

    let dateMap = entriesByDate.get(entry.work_date);
    if (!dateMap) {
      dateMap = new Map<string, ScheduleEntry>();
      entriesByDate.set(entry.work_date, dateMap);
    }
    dateMap.set(entry.employee_id, entry);
  }

  const statsByDate = new Map<string, DayEmployeeStats>();

  for (const [workDate, dateEntries] of entriesByDate.entries()) {
    const working: EmployeeDayInfo[] = [];
    const absent: EmployeeDayInfo[] = [];

    for (const employee of employees) {
      if (!isEmployeeVisibleOnDate(employee, workDate)) continue;

      const entry = dateEntries.get(employee.id);
      if (!entry || !entry.status) {
        continue;
      }

      if (isWorkStatus(entry.status.excel_mark)) {
        working.push({
          employee,
          status: entry.status,
        });
      } else {
        absent.push({
          employee,
          status: entry.status,
        });
      }
    }

    statsByDate.set(workDate, {
      working,
      absent,
      workingCount: working.length,
      absentCount: absent.length,
    });
  }

  return statsByDate;
}
