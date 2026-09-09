import { type Employee, matchEmployeesWithSheet } from '@/entities/employee';
import { findSpreadsheetDateColumns } from '@/entities/google-sheets';

import type {
  CompareScheduleWithSheetParams,
  ScheduleSheetComparison,
  ScheduleSheetDifference,
} from './types';

export function getScheduleSheetEmployeeSignature(
  employees: Employee[],
): string {
  return employees
    .map((employee) =>
      [employee.id, employee.last_name.trim(), employee.first_name.trim()].join(
        ':',
      ),
    )
    .sort()
    .join('|');
}

export function compareScheduleWithSheet({
  employees,
  endDate,
  rows,
  scheduleEntries,
  startDate,
}: CompareScheduleWithSheetParams): ScheduleSheetComparison {
  const dateColumns = findSpreadsheetDateColumns(
    rows.map((row) => row.map(String)),
    startDate,
    endDate,
  );
  const missingDays: string[] = [];
  const dates: string[] = [];

  for (
    let current = startDate;
    current.isBefore(endDate, 'day') || current.isSame(endDate, 'day');
    current = current.add(1, 'day')
  ) {
    const date = current.format('YYYY-MM-DD');
    dates.push(date);

    if (!dateColumns.has(date)) {
      missingDays.push(date);
    }
  }

  const { ambiguousEmployees, matchedMap, missingEmployees } =
    matchEmployeesWithSheet(employees, rows);
  const scheduleMarks = new Map(
    scheduleEntries.map((entry) => [
      `${entry.employee_id}:${entry.work_date}`,
      entry.status.excel_mark?.trim() ?? '',
    ]),
  );
  const differences: ScheduleSheetDifference[] = [];

  for (const employee of employees) {
    const rowIndex = matchedMap.get(employee.id);
    if (rowIndex === undefined) continue;

    for (const date of dates) {
      const columnIndex = dateColumns.get(date);
      if (columnIndex === undefined) continue;

      const sheetMark = String(rows[rowIndex]?.[columnIndex] ?? '').trim();
      const scheduleMark = scheduleMarks.get(`${employee.id}:${date}`) ?? '';

      if (sheetMark !== scheduleMark) {
        differences.push({
          date,
          employeeId: employee.id,
          rowIndex,
          sheetMark,
          scheduleMark,
        });
      }
    }
  }

  return {
    ambiguousEmployees,
    differences,
    employeeSignature: getScheduleSheetEmployeeSignature(employees),
    missingDays,
    missingEmployees,
  };
}
