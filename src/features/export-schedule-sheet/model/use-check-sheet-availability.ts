import { useQuery } from '@tanstack/react-query';
import dayjs from 'dayjs';

import { getEmployees, matchEmployeesWithSheet } from '@/entities/employee';
import { useGoogleAuth } from '@/entities/google-auth';
import {
  extractSpreadsheetId,
  fetchSpreadsheetValues,
  useGoogleSheets,
} from '@/entities/google-sheets';
import { getScheduleByMonth } from '@/entities/schedule';

import { type CheckPeriodParams } from './types';

export function useCheckSheetAvailability({
  endDate,
  monthLabel,
  monthName,
  startDate,
}: CheckPeriodParams) {
  const { data: sheets = [], isLoading: isLoadingSheets } = useGoogleSheets();
  const { ensureSheetsScopeAndGetToken } = useGoogleAuth();

  const activeSheet = sheets[0];
  const spreadsheetId = activeSheet
    ? extractSpreadsheetId(activeSheet.url)
    : null;

  const range = `'${monthName}'!A1:AZ100`;

  const {
    data: queryResult,
    error: queryError,
    isFetching,
    isLoading: isLoadingValues,
  } = useQuery({
    queryKey: [
      'spreadsheet-period-check',
      spreadsheetId,
      monthName,
      startDate.format('YYYY-MM-DD'),
      endDate.format('YYYY-MM-DD'),
    ],
    queryFn: async () => {
      if (!spreadsheetId) return null;
      const accessToken = await ensureSheetsScopeAndGetToken();

      let rows: (string | number)[][] = [];
      try {
        rows = await fetchSpreadsheetValues({
          accessToken,
          range,
          spreadsheetId,
        });
      } catch (err) {
        try {
          rows = await fetchSpreadsheetValues({
            accessToken,
            range: `'${monthLabel}'!A1:AZ100`,
            spreadsheetId,
          });
        } catch {
          throw err;
        }
      }

      const [employees, scheduleEntries] = await Promise.all([
        getEmployees(),
        getScheduleByMonth(startDate),
      ]);

      return {
        employees,
        rows,
        scheduleEntries,
      };
    },
    enabled: Boolean(spreadsheetId),
    gcTime: 0,
    refetchOnMount: 'always',
    retry: false,
    staleTime: 0,
  });

  const isLoading =
    isLoadingSheets ||
    (Boolean(spreadsheetId) && (isLoadingValues || isFetching));

  let monthError: string | null = null;
  let weekError: string | null = null;
  let employeeError: string | null = null;

  if (!isLoading) {
    if (!activeSheet || !spreadsheetId) {
      monthError = 'Google Таблицю не підключено';
    } else if (queryError || !queryResult || !queryResult.rows) {
      monthError = `Вкладку "${monthLabel}" не знайдено в таблиці`;
    } else {
      const { rows, employees, scheduleEntries } = queryResult;

      const headerCells = rows
        .slice(0, 5)
        .flat()
        .map((c) => String(c).trim().toLowerCase());

      let missingDay: number | null = null;
      let curr = startDate;

      while (curr.isBefore(endDate, 'day') || curr.isSame(endDate, 'day')) {
        const dayNum = curr.date();
        const dayNumStr = String(dayNum);
        const dayPadStr = curr.format('DD');
        const dayDotStr = curr.format('DD.MM');

        const hasDay = headerCells.some((cell) => {
          if (
            cell === dayNumStr ||
            cell === dayPadStr ||
            cell === dayDotStr ||
            cell.includes(dayDotStr)
          ) {
            return true;
          }
          if (
            cell.startsWith(`${dayNumStr} `) ||
            cell.endsWith(` ${dayNumStr}`) ||
            cell.startsWith(`${dayPadStr} `) ||
            cell.endsWith(` ${dayPadStr}`)
          ) {
            return true;
          }
          return false;
        });

        if (!hasDay) {
          missingDay = dayNum;
          break;
        }

        curr = curr.add(1, 'day');
      }

      if (missingDay !== null) {
        weekError = `День ${missingDay} відсутній у вкладці`;
      } else {
        const scheduledEmployeeIds = new Set(
          scheduleEntries
            .filter((entry) => {
              const entryDate = dayjs(entry.work_date);
              return (
                (entryDate.isAfter(startDate, 'day') ||
                  entryDate.isSame(startDate, 'day')) &&
                (entryDate.isBefore(endDate, 'day') ||
                  entryDate.isSame(endDate, 'day'))
              );
            })
            .map((entry) => entry.employee_id),
        );

        const activeScheduledEmployees = employees.filter((emp) =>
          scheduledEmployeeIds.has(emp.id),
        );

        const { missingEmployees } = matchEmployeesWithSheet(
          activeScheduledEmployees,
          rows,
        );

        if (missingEmployees.length > 0) {
          const missingNames = missingEmployees.map((emp) =>
            `${emp.last_name} ${emp.first_name}`.trim(),
          );
          const prefix =
            missingNames.length === 1 ? 'Працівника' : 'Працівників';
          employeeError = `${prefix} "${missingNames.join(', ')}" не знайдено в Google Таблиці`;
        }
      }
    }
  }

  return {
    employeeError,
    isAvailable: !isLoading && !monthError && !weekError && !employeeError,
    isLoading,
    monthError,
    weekError,
  };
}