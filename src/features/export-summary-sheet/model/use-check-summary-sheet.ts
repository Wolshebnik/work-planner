import { useQuery } from '@tanstack/react-query';
import dayjs from 'dayjs';

import { getCashierHours } from '@/entities/cashier-hours';
import { getEmployees, matchEmployeesWithSheet } from '@/entities/employee';
import { useGoogleAuth } from '@/entities/google-auth';
import {
  extractSpreadsheetId,
  fetchSpreadsheetValues,
  useGoogleSheets,
} from '@/entities/google-sheets';

interface CheckSummarySheetParams {
  columnTitle: string;
  date: dayjs.Dayjs;
  isOpen?: boolean;
}

export function useCheckSummarySheet({
  date,
  columnTitle,
  isOpen = true,
}: CheckSummarySheetParams) {
  const { data: sheets = [], isLoading: isLoadingSheets } = useGoogleSheets();
  const { ensureSheetsScopeAndGetToken } = useGoogleAuth();

  const activeSheet = sheets[0];
  const spreadsheetId = activeSheet
    ? extractSpreadsheetId(activeSheet.url)
    : null;

  const year = date.year();
  const month = date.month() + 1;
  const monthName = date.format('MMMM');
  const monthLabel =
    monthName.charAt(0).toUpperCase() +
    monthName.slice(1) +
    ' ' +
    date.format('YYYY');

  const range = `'${monthName}'!A1:AZ100`;

  const {
    data: queryResult,
    error: queryError,
    isFetching,
    isLoading: isLoadingValues,
  } = useQuery({
    queryKey: [
      'spreadsheet-summary-check',
      spreadsheetId,
      monthName,
      columnTitle,
    ],
    queryFn: async () => {
      if (!spreadsheetId) return null;
      const accessToken = await ensureSheetsScopeAndGetToken();

      let rows: (string | number)[][] = [];
      try {
        rows = await fetchSpreadsheetValues({
          spreadsheetId,
          range,
          accessToken,
        });
      } catch (err) {
        try {
          rows = await fetchSpreadsheetValues({
            spreadsheetId,
            range: `'${monthLabel}'!A1:AZ100`,
            accessToken,
          });
        } catch {
          throw err;
        }
      }

      const [employees, cashierEntries] = await Promise.all([
        getEmployees(),
        getCashierHours(year, month),
      ]);

      return {
        cashierEntries,
        employees,
        rows,
      };
    },
    enabled: isOpen && Boolean(spreadsheetId) && Boolean(columnTitle.trim()),
    gcTime: 0,
    refetchOnMount: 'always',
    retry: false,
    staleTime: 0,
  });

  const isLoading =
    isOpen &&
    (isLoadingSheets ||
      (Boolean(spreadsheetId) && (isLoadingValues || isFetching)));

  let monthError: string | null = null;
  let columnError: string | null = null;
  let employeeError: string | null = null;

  if (isOpen && !isLoading) {
    if (!activeSheet || !spreadsheetId) {
      monthError = 'Google Таблицю не підключено';
    } else if (queryError || !queryResult || !queryResult.rows) {
      monthError = `Вкладку "${monthLabel}" не знайдено в таблиці`;
    } else if (!columnTitle.trim()) {
      columnError = 'Введіть назву столбця';
    } else {
      const { rows, employees, cashierEntries } = queryResult;

      const headerCells = rows
        .slice(0, 5)
        .flat()
        .map((c) => String(c).trim().toLowerCase());
      const targetTitleClean = columnTitle.trim().toLowerCase();

      const hasColumn = headerCells.some(
        (cell) =>
          cell.length > 0 &&
          (cell === targetTitleClean || cell.includes(targetTitleClean)),
      );

      if (!hasColumn) {
        columnError = `Столбець "${columnTitle}" не знайдено в таблиці`;
      } else {
        const cashierEmployeeIds = new Set(
          cashierEntries
            .filter((item) => item.cashier_hours > 0)
            .map((item) => item.employee_id),
        );

        const activeCashierEmployees = employees.filter((emp) =>
          cashierEmployeeIds.has(emp.id),
        );

        const { missingEmployees } = matchEmployeesWithSheet(
          activeCashierEmployees,
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
    columnError,
    employeeError,
    isAvailable: !isLoading && !monthError && !columnError && !employeeError,
    isLoading,
    monthError,
  };
}
