import { useQuery } from '@tanstack/react-query';
import dayjs from 'dayjs';

import { getEmployees, matchEmployeesWithSheet } from '@/entities/employee';
import { useGoogleAuth } from '@/entities/google-auth';
import {
  extractSpreadsheetId,
  fetchSpreadsheetSheetTitles,
  fetchSpreadsheetValues,
  findSpreadsheetDateColumns,
  findSpreadsheetSheetTitle,
  useGoogleSheets,
} from '@/entities/google-sheets';
import { getScheduleByMonth } from '@/entities/schedule';

import { type CheckPeriodParams } from './types';

export function useCheckSheetAvailability({
  endDate,
  monthLabel,
  startDate,
}: CheckPeriodParams) {
  const { data: sheets = [], isLoading: isLoadingSheets } = useGoogleSheets();
  const { ensureSheetsScopeAndGetToken } = useGoogleAuth();

  const activeSheet = sheets[0];
  const spreadsheetId = activeSheet
    ? extractSpreadsheetId(activeSheet.url)
    : null;

  const {
    data: queryResult,
    error: queryError,
    isFetching,
    isLoading: isLoadingValues,
  } = useQuery({
    queryKey: [
      'spreadsheet-period-check',
      spreadsheetId,
      monthLabel,
      startDate.format('YYYY-MM-DD'),
      endDate.format('YYYY-MM-DD'),
    ],
    queryFn: async () => {
      if (!spreadsheetId) return null;
      const accessToken = await ensureSheetsScopeAndGetToken();

      const sheetTitles = await fetchSpreadsheetSheetTitles({
        accessToken,
        spreadsheetId,
      });
      const sheetTitle = findSpreadsheetSheetTitle(sheetTitles, monthLabel);

      if (!sheetTitle) return null;

      const [rows, employees, scheduleEntries] = await Promise.all([
        fetchSpreadsheetValues({
          accessToken,
          range: `'${sheetTitle}'`,
          spreadsheetId,
        }),
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

      const dateColumns = findSpreadsheetDateColumns(rows, startDate, endDate);

      let missingDay: number | null = null;
      let curr = startDate;

      while (curr.isBefore(endDate, 'day') || curr.isSame(endDate, 'day')) {
        const dayNum = curr.date();
        const hasDay = dateColumns.has(curr.format('YYYY-MM-DD'));

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
