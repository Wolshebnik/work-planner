import {
  colIndexToA1Letter,
  fetchSpreadsheetValues,
  updateSpreadsheetValues,
} from '@/entities/google-sheets';
import { getEmployees } from '@/features/get-employees';
import { getScheduleByMonth } from '@/features/get-schedule-by-month';

const DEFAULT_DAYS = [17, 18, 19, 20, 21, 22, 23];
const DEFAULT_SHEET = 'Серпень';
const DEFAULT_YEAR = 2026;

export async function sendWeekSchedule({
  spreadsheetId,
  accessToken,
  sheetName = DEFAULT_SHEET,
  targetDays = DEFAULT_DAYS,
  year = DEFAULT_YEAR,
}: {
  spreadsheetId: string;
  accessToken: string;
  sheetName?: string;
  targetDays?: number[];
  year?: number;
}): Promise<number> {
  const rows = await fetchSpreadsheetValues({
    spreadsheetId,
    range: sheetName,
    accessToken,
  });

  if (rows.length === 0) {
    throw new Error(`Вкладка "${sheetName}" не містить даних`);
  }

  let startColIndex = -1;
  let endColIndex = -1;

  for (let r = 0; r < Math.min(5, rows.length); r++) {
    const row = rows[r] || [];
    const colIndices = targetDays.map((day) =>
      row.findIndex((cell) => cell?.toString().trim() === String(day)),
    );
    if (colIndices.every((idx) => idx !== -1)) {
      startColIndex = colIndices[0]!;
      endColIndex = colIndices[colIndices.length - 1]!;
      break;
    }
  }

  if (startColIndex === -1 || endColIndex === -1) {
    throw new Error('Не вдалося знайти колонки для днів 17–23');
  }

  const startColLetter = colIndexToA1Letter(startColIndex);
  const endColLetter = colIndexToA1Letter(endColIndex);

  const [employees, scheduleEntries] = await Promise.all([
    getEmployees(),
    getScheduleByMonth(`${year}-08-01`),
  ]);

  let updatedCount = 0;

  for (const emp of employees) {
    const surname = (emp.last_name || emp.first_name || '')
      .trim()
      .split(/\s+/)[0]
      ?.trim()
      .toLowerCase();

    if (!surname) continue;

    let empRowNumber = -1;
    for (let r = 0; r < rows.length; r++) {
      const row = rows[r] || [];
      const matches = row.some((cell) => {
        const cellSurname = cell
          ?.toString()
          .trim()
          .split(/\s+/)[0]
          ?.trim()
          .toLowerCase();
        return cellSurname && cellSurname === surname;
      });
      if (matches) {
        empRowNumber = r + 1;
        break;
      }
    }

    if (empRowNumber === -1) {
      continue;
    }

    const rowValues: string[] = targetDays.map((day) => {
      const dateStr = `${year}-08-${String(day).padStart(2, '0')}`;
      const entry = scheduleEntries.find(
        (e) => e.employee_id === emp.id && e.work_date === dateStr,
      );
      return entry?.status?.excel_mark ?? '';
    });

    const targetRange = `'${sheetName}'!${startColLetter}${empRowNumber}:${endColLetter}${empRowNumber}`;

    await updateSpreadsheetValues({
      spreadsheetId,
      range: targetRange,
      values: [rowValues],
      accessToken,
    });

    updatedCount++;
  }

  return updatedCount;
}
