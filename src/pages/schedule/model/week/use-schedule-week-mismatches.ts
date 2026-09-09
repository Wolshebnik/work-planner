import { useMemo } from 'react';

import type dayjs from 'dayjs';

import { extractSpreadsheetId, useGoogleSheets } from '@/entities/google-sheets';
import type { ScheduleEntry } from '@/entities/schedule';
import { useScheduleSheetCheckStore } from '@/features/export-schedule-sheet';

interface UseScheduleWeekMismatchesParams {
  scheduleEntries: ScheduleEntry[];
  startOfWeek: dayjs.Dayjs;
}

export function useScheduleWeekMismatches({
  scheduleEntries,
  startOfWeek,
}: UseScheduleWeekMismatchesParams) {
  const { data: sheets = [] } = useGoogleSheets();
  const spreadsheetId = sheets[0]
    ? extractSpreadsheetId(sheets[0].url)
    : null;

  const startMonthKey = startOfWeek.format('YYYY-MM');
  const endMonthKey = startOfWeek.add(6, 'day').format('YYYY-MM');

  const startMonthCheck = useScheduleSheetCheckStore(
    (state) => state.checks[`${spreadsheetId ?? ''}:${startMonthKey}`],
  );
  const endMonthCheck = useScheduleSheetCheckStore(
    (state) => state.checks[`${spreadsheetId ?? ''}:${endMonthKey}`],
  );

  const mismatchKeys = useMemo(() => {
    const keys = new Set<string>();

    if (!spreadsheetId) {
      return keys;
    }

    const checksByMonth = new Map([
      [startMonthKey, startMonthCheck],
      [endMonthKey, endMonthCheck],
    ]);

    const scheduleMarks = new Map(
      scheduleEntries.map(({ employee_id, status, work_date }) => [
        `${employee_id}:${work_date}`,
        status.excel_mark?.trim() ?? '',
      ]),
    );

    for (let dayIndex = 0; dayIndex < 7; dayIndex += 1) {
      const day = startOfWeek.add(dayIndex, 'day');
      const monthKey = day.format('YYYY-MM');
      const result = checksByMonth.get(monthKey);

      result?.differences.forEach(({ date, employeeId, sheetMark }) => {
        const key = `${employeeId}:${date}`;
        const currentMark = scheduleMarks.get(key) ?? '';

        if (currentMark !== sheetMark) {
          keys.add(key);
        }
      });
    }

    return keys;
  }, [
    endMonthCheck,
    endMonthKey,
    scheduleEntries,
    startMonthCheck,
    startMonthKey,
    startOfWeek,
    spreadsheetId,
  ]);

  return { mismatchKeys };
}
