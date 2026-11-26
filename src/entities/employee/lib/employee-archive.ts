import type { Employee, EmployeeArchivePeriod } from '../model/schema';

function getMonthKey(date: string): string {
  return date.slice(0, 7);
}

export function appendEmployeeArchivePeriod(
  archivePeriods: EmployeeArchivePeriod[],
  archiveDate: string,
): EmployeeArchivePeriod[] {
  return [
    ...archivePeriods,
    { archived_at: archiveDate, restored_at: null },
  ];
}

export function closeEmployeeArchivePeriod(
  archivePeriods: EmployeeArchivePeriod[],
  restoreDate: string,
): EmployeeArchivePeriod[] {
  let openPeriodIndex = -1;

  for (let index = archivePeriods.length - 1; index >= 0; index -= 1) {
    if (archivePeriods[index]?.restored_at === null) {
      openPeriodIndex = index;
      break;
    }
  }

  if (openPeriodIndex === -1) return archivePeriods;

  return archivePeriods.map((period, index) =>
    index === openPeriodIndex
      ? { ...period, restored_at: restoreDate }
      : period,
  );
}

export function isEmployeeVisibleOnDate(
  employee: Employee,
  workDate: string,
): boolean {
  const selectedMonth = getMonthKey(workDate);

  if (!employee.is_active) {
    const openArchivePeriod = employee.archive_periods.find(
      (period) => period.restored_at === null,
    );

    if (!openArchivePeriod) return false;

    return selectedMonth <= getMonthKey(openArchivePeriod.archived_at);
  }

  return !employee.archive_periods.some((period) => {
    if (!period.restored_at) return false;

    const archivedMonth = getMonthKey(period.archived_at);
    const restoredMonth = getMonthKey(period.restored_at);

    return selectedMonth > archivedMonth && selectedMonth < restoredMonth;
  });
}

export function isEmployeeScheduleDateLocked(
  employee: Employee,
  workDate: string,
): boolean {
  if (!employee.is_active) return true;

  return employee.archive_periods.some(
    (period) =>
      workDate >= period.archived_at &&
      (!period.restored_at || workDate < period.restored_at),
  );
}

export function isEmployeeBeforeRestoreInMonth(
  employee: Employee,
  workDate: string,
): boolean {
  return employee.archive_periods.some(
    (period) =>
      period.restored_at !== null &&
      workDate >= period.archived_at &&
      workDate < period.restored_at &&
      getMonthKey(workDate) === getMonthKey(period.restored_at),
  );
}
