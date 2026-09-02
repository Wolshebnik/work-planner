import type dayjs from 'dayjs';

import { getEmployees } from '@/entities/employee';
import {
  batchUpdateSpreadsheetValues,
  fetchSpreadsheetSheetTitles,
  fetchSpreadsheetValues,
  findSpreadsheetDateColumns,
  findSpreadsheetSheetTitle,
} from '@/entities/google-sheets';
import { getScheduleByMonth } from '@/entities/schedule';

function getColumnLetter(colIndex: number): string {
  let temp = colIndex;
  let letter = '';
  while (temp >= 0) {
    letter = String.fromCharCode((temp % 26) + 65) + letter;
    temp = Math.floor(temp / 26) - 1;
  }
  return letter;
}

export interface ExportScheduleParams {
  accessToken: string;
  endDate: dayjs.Dayjs;
  monthLabel: string;
  spreadsheetId: string;
  startDate: dayjs.Dayjs;
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

  const updates: { range: string; values: string[][] }[] = [];
  const usedRows = new Set<number>();
  let curr = startDate;

  for (const employee of employees) {
    const lastName = employee.last_name.trim().toLowerCase();
    const firstName = employee.first_name.trim().toLowerCase();
    const firstInitial = firstName.charAt(0);

    let targetRowIndex: number | null = null;
    let highestScore = 0;

    for (let r = 0; r < sheetRows.length; r++) {
      if (usedRows.has(r)) {
        continue;
      }

      const row = sheetRows[r] ?? [];
      const nameCells = row
        .slice(0, 5)
        .map((c) => String(c ?? '').trim().toLowerCase());

      for (const cell of nameCells) {
        if (!cell || !cell.includes(lastName)) {
          continue;
        }

        let score = 10;

        if (firstName && cell.includes(firstName)) {
          score = 100;
        } else if (
          firstInitial &&
          (cell.includes(`${lastName} ${firstInitial}`) ||
            cell.includes(`${lastName}  ${firstInitial}`) ||
            cell.includes(`${firstInitial}.`) ||
            cell.includes(` ${firstInitial}`))
        ) {
          score = 80;
        } else if (cell === lastName) {
          score = 50;
        }

        if (score > highestScore) {
          highestScore = score;
          targetRowIndex = r;
        }
      }
    }

    if (targetRowIndex === null) {
      continue;
    }

    usedRows.add(targetRowIndex);

    curr = startDate;
    while (curr.isBefore(endDate, 'day') || curr.isSame(endDate, 'day')) {
      const dateKey = curr.format('YYYY-MM-DD');
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

      curr = curr.add(1, 'day');
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
