import { fetchSpreadsheetValues } from '@/entities/google-sheets';

const DEFAULT_SHEET_NAMES = ['Серпень', 'Вересень'];

export async function syncGoogleSheets({
  spreadsheetId,
  accessToken,
  sheetNames = DEFAULT_SHEET_NAMES,
}: {
  spreadsheetId: string;
  accessToken: string;
  sheetNames?: string[];
}): Promise<void> {
  for (const sheetName of sheetNames) {
    await fetchSpreadsheetValues({
      spreadsheetId,
      range: sheetName,
      accessToken,
    });
  }
}
