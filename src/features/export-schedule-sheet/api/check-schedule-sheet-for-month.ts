import {
  fetchSpreadsheetSheetTitles,
  fetchSpreadsheetValues,
  findSpreadsheetSheetTitle,
} from '@/entities/google-sheets';

import { compareScheduleWithSheet } from '../model/compare-schedule-with-sheet';
import type {
  CheckScheduleSheetForMonthParams,
  ScheduleSheetComparison,
} from '../model/types';

export async function checkScheduleSheetForMonth({
  accessToken,
  employees,
  month,
  monthLabel,
  spreadsheetId,
  scheduleEntries,
}: CheckScheduleSheetForMonthParams): Promise<
  ScheduleSheetComparison & { sheetTitle: string }
> {
  const sheetTitles = await fetchSpreadsheetSheetTitles({
    accessToken,
    spreadsheetId,
  });
  const sheetTitle = findSpreadsheetSheetTitle(sheetTitles, monthLabel);

  if (!sheetTitle) {
    throw new Error(`Вкладку "${monthLabel}" не знайдено в таблиці`);
  }

  const startDate = month.startOf('month');
  const endDate = month.endOf('month');

  const rows = await fetchSpreadsheetValues({
    accessToken,
    range: `'${sheetTitle}'`,
    spreadsheetId,
  });

  return {
    ...compareScheduleWithSheet({
      employees,
      endDate,
      rows,
      scheduleEntries,
      startDate,
    }),
    sheetTitle,
  };
}
