import type dayjs from 'dayjs';

import { getCashierHours } from '@/entities/cashier-hours';
import { findEmployeeRowIndex, getEmployees } from '@/entities/employee';
import {
  batchUpdateSpreadsheetValues,
  fetchSpreadsheetValues,
} from '@/entities/google-sheets';


function getColumnLetter(colIndex: number): string {
  let temp = colIndex;
  let letter = '';
  while (temp >= 0) {
    letter = String.fromCharCode((temp % 26) + 65) + letter;
    temp = Math.floor(temp / 26) - 1;
  }
  return letter;
}

export interface ExportSummaryParams {
  accessToken: string;
  columnTitle: string;
  date: dayjs.Dayjs;
  spreadsheetId: string;
}

export async function exportSummaryToGoogleSheet({
  accessToken,
  columnTitle,
  date,
  spreadsheetId,
}: ExportSummaryParams): Promise<void> {
  const year = date.year();
  const month = date.month() + 1;
  const monthName = date.format('MMMM');
  const monthLabel =
    monthName.charAt(0).toUpperCase() +
    monthName.slice(1) +
    ' ' +
    date.format('YYYY');

  let sheetRows: (string | number)[][] = [];
  let targetSheetName = monthName;

  try {
    sheetRows = await fetchSpreadsheetValues({
      accessToken,
      range: `'${monthName}'!A1:AZ100`,
      spreadsheetId,
    });
  } catch {
    sheetRows = await fetchSpreadsheetValues({
      accessToken,
      range: `'${monthLabel}'!A1:AZ100`,
      spreadsheetId,
    });
    targetSheetName = monthLabel;
  }

  if (sheetRows.length === 0) {
    throw new Error(`Вкладка "${targetSheetName}" порожня`);
  }

  const [employees, cashierEntries] = await Promise.all([
    getEmployees(),
    getCashierHours(year, month),
  ]);

  const cashierMap = new Map<string, number>();
  for (const item of cashierEntries) {
    cashierMap.set(item.employee_id, item.cashier_hours);
  }

  let cashColIndex: number | null = null;
  const targetTitleClean = columnTitle.trim().toLowerCase();

  for (let r = 0; r < Math.min(5, sheetRows.length); r++) {
    const row = sheetRows[r] ?? [];
    for (let c = 0; c < row.length; c++) {
      const cell = String(row[c] ?? '').trim().toLowerCase();
      if (
        cell.length > 0 &&
        (cell === targetTitleClean || cell.includes(targetTitleClean))
      ) {
        cashColIndex = c;
        break;
      }
    }
    if (cashColIndex !== null) {
      break;
    }
  }

  if (cashColIndex === null) {
    throw new Error(`Столбець "${columnTitle}" не знайдено в таблиці`);
  }

  const updates: { range: string; values: string[][] }[] = [];
  const usedRows = new Set<number>();

  for (const employee of employees) {
    const targetRowIndex = findEmployeeRowIndex(employee, sheetRows, usedRows);

    if (targetRowIndex === null) {
      continue;
    }

    usedRows.add(targetRowIndex);

    const cashHours = cashierMap.get(employee.id) ?? 0;
    const colLetter = getColumnLetter(cashColIndex);
    const cellAddress = `'${targetSheetName}'!${colLetter}${targetRowIndex + 1}`;

    updates.push({
      range: cellAddress,
      values: [[String(cashHours)]],
    });
  }

  if (updates.length > 0) {
    await batchUpdateSpreadsheetValues({
      accessToken,
      data: updates,
      spreadsheetId,
    });
  }
}
