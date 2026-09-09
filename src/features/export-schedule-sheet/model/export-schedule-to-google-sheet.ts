import { getEmployees, matchEmployeesWithSheet } from '@/entities/employee';
import {
  batchUpdateSpreadsheetValues,
  fetchSpreadsheetSheetTitles,
  fetchSpreadsheetValues,
  findSpreadsheetDateColumns,
  findSpreadsheetSheetTitle,
} from '@/entities/google-sheets';
import { getScheduleByMonth } from '@/entities/schedule';

import type { ExportScheduleParams } from './types';

function getColumnLetter(colIndex: number): string {
  let temp = colIndex;
  let letter = '';

  for (; temp >= 0; temp = Math.floor(temp / 26) - 1) {
    letter = String.fromCharCode((temp % 26) + 65) + letter;
  }

  return letter;
}

export async function exportScheduleToGoogleSheet({
  accessToken,
  endDate,
  monthLabel,
  spreadsheetId,
  startDate,
}: ExportScheduleParams): Promise<void> {
  const sheetTitles = await fetchSpreadsheetSheetTitles({
    accessToken,
    spreadsheetId,
  });
  const sheetTitle = findSpreadsheetSheetTitle(sheetTitles, monthLabel);

  if (!sheetTitle) {
    throw new Error(`Вкладку "${monthLabel}" не знайдено в таблиці`);
  }

  const [sheetRows, employees, scheduleEntries] = await Promise.all([
    fetchSpreadsheetValues({
      accessToken,
      range: `'${sheetTitle}'`,
      spreadsheetId,
    }),
    getEmployees(),
    getScheduleByMonth(startDate),
  ]);

  if (sheetRows.length === 0) {
    throw new Error(`Вкладка "${sheetTitle}" порожня`);
  }

  const dateColMap = findSpreadsheetDateColumns(sheetRows, startDate, endDate);

  const { ambiguousEmployees, matchedMap } = matchEmployeesWithSheet(
    employees,
    sheetRows,
  );

  if (ambiguousEmployees.length > 0) {
    const names = ambiguousEmployees.map((employee) =>
      `${employee.last_name} ${employee.first_name}`.trim(),
    );

    throw new Error(
      `Неоднозначні працівники в Google Таблиці: ${names.join(', ')}`,
    );
  }

  const updates: { range: string; values: string[][] }[] = [];
  const totalDays = endDate.diff(startDate, 'day');

  for (const employee of employees) {
    const targetRowIndex = matchedMap.get(employee.id);

    if (targetRowIndex === undefined) {
      continue;
    }

    for (let dayOffset = 0; dayOffset <= totalDays; dayOffset += 1) {
      const currentDay = startDate.add(dayOffset, 'day');
      const dateKey = currentDay.format('YYYY-MM-DD');
      const colIndex = dateColMap.get(dateKey);

      if (colIndex !== undefined) {
        const entry = scheduleEntries.find(
          (e) => e.employee_id === employee.id && e.work_date === dateKey,
        );

        const mark = entry?.status?.excel_mark ?? '';
        const colLetter = getColumnLetter(colIndex);
        const cellAddress = `'${sheetTitle}'!${colLetter}${targetRowIndex + 1}`;

        updates.push({
          range: cellAddress,
          values: [[mark]],
        });
      }
    }
  }

  if (updates.length > 0) {
    await batchUpdateSpreadsheetValues({
      accessToken,
      data: updates,
      spreadsheetId,
    });
  }
}
