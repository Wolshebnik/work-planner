import { useQuery } from '@tanstack/react-query';

import { useGoogleAuth } from '@/entities/google-auth';
import {
  extractSpreadsheetId,
  fetchSpreadsheetValues,
  useGoogleSheets,
} from '@/entities/google-sheets';

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

  const range = `'${monthName}'!1:5`;

  const {
    data: rows,
    error: queryError,
    isFetching,
    isLoading: isLoadingValues,
  } = useQuery({
    queryKey: ['spreadsheet-period-check', spreadsheetId, monthName],
    queryFn: async () => {
      if (!spreadsheetId) return null;
      const accessToken = await ensureSheetsScopeAndGetToken();
      try {
        return await fetchSpreadsheetValues({
          spreadsheetId,
          range,
          accessToken,
        });
      } catch (err) {
        try {
          return await fetchSpreadsheetValues({
            spreadsheetId,
            range: `'${monthLabel}'!1:5`,
            accessToken,
          });
        } catch {
          throw err;
        }
      }
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

  if (!isLoading) {
    if (!activeSheet || !spreadsheetId) {
      monthError = 'Google Таблицю не підключено';
    } else if (queryError || !rows) {
      monthError = `Вкладку "${monthLabel}" не знайдено в таблиці`;
    } else {
      const allCells = rows.flat().map((c) => String(c).trim().toLowerCase());

      let missingDay: number | null = null;
      let curr = startDate;

      while (curr.isBefore(endDate, 'day') || curr.isSame(endDate, 'day')) {
        const dayNum = curr.date();
        const dayNumStr = String(dayNum);
        const dayPadStr = curr.format('DD');
        const dayDotStr = curr.format('DD.MM');

        const hasDay = allCells.some((cell) => {
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
      }
    }
  }

  return {
    isAvailable: !isLoading && !monthError && !weekError,
    isLoading,
    monthError,
    weekError,
  };
}