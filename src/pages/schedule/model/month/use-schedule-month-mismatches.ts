import { useMemo } from 'react';

import type { CalendarDay } from '@/entities/calendar';
import { extractSpreadsheetId, useGoogleSheets } from '@/entities/google-sheets';
import type { ScheduleEntry } from '@/entities/schedule';
import { useScheduleSheetCheckStore } from '@/features/export-schedule-sheet';

interface UseScheduleMonthMismatchesParams {
  days: CalendarDay[];
  gridMonthKeys: string[];
  scheduleEntries: ScheduleEntry[];
}

export function useScheduleMonthMismatches({
  days,
  gridMonthKeys,
  scheduleEntries,
}: UseScheduleMonthMismatchesParams) {
  const { data: sheets = [] } = useGoogleSheets();
  const spreadsheetId = sheets[0]
    ? extractSpreadsheetId(sheets[0].url)
    : null;

  const firstMonthKey = gridMonthKeys[0] ?? '';
  const secondMonthKey = gridMonthKeys[1] ?? '';
  const thirdMonthKey = gridMonthKeys[2] ?? '';

  const firstMonthCheck = useScheduleSheetCheckStore(
    (state) => state.checks[`${spreadsheetId ?? ''}:${firstMonthKey}`],
  );
  const secondMonthCheck = useScheduleSheetCheckStore(
    (state) => state.checks[`${spreadsheetId ?? ''}:${secondMonthKey}`],
  );
  const thirdMonthCheck = useScheduleSheetCheckStore(
    (state) => state.checks[`${spreadsheetId ?? ''}:${thirdMonthKey}`],
  );

  const mismatchDates = useMemo(() => {
    const dates = new Set<string>();

    if (!spreadsheetId) {
      return dates;
    }

    const checksByMonth = new Map([
      [firstMonthKey, firstMonthCheck],
      [secondMonthKey, secondMonthCheck],
      [thirdMonthKey, thirdMonthCheck],
    ]);

    const scheduleMarks = new Map(
      scheduleEntries.map(({ employee_id, status, work_date }) => [
        `${employee_id}:${work_date}`,
        status.excel_mark?.trim() ?? '',
      ]),
    );

    for (const day of days) {
      const monthKey = day.date.format('YYYY-MM');
      const result = checksByMonth.get(monthKey);

      result?.differences.forEach(({ date, employeeId, sheetMark }) => {
        const currentMark =
          scheduleMarks.get(`${employeeId}:${date}`) ?? '';

        if (currentMark !== sheetMark) {
          dates.add(date);
        }
      });
    }

    return dates;
  }, [
    days,
    firstMonthCheck,
    firstMonthKey,
    scheduleEntries,
    secondMonthCheck,
    secondMonthKey,
    thirdMonthCheck,
    thirdMonthKey,
    spreadsheetId,
  ]);

  return { mismatchDates };
}
