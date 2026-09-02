import type dayjs from 'dayjs';

export function extractSpreadsheetId(url: string): string | null {
  const match = url.match(/\/spreadsheets\/d\/([a-zA-Z0-9-_]+)/);
  return match?.[1] ?? null;
}

export async function fetchSpreadsheetValues({
  spreadsheetId,
  range,
  accessToken,
}: {
  spreadsheetId: string;
  range: string;
  accessToken: string;
}): Promise<string[][]> {
  const rangeUrl = encodeURIComponent(range);
  const response = await fetch(
    `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${rangeUrl}`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    },
  );

  if (!response.ok) {
    let message = `Помилка сервера Google (${response.status})`;
    try {
      const errorJson = (await response.json()) as {
        error?: { message?: string };
      };
      if (errorJson?.error?.message) {
        message = errorJson.error.message;
      }
    } catch {
      const text = await response.text();
      if (text) message = text;
    }
    throw new Error(message);
  }

  const data = (await response.json()) as {
    values?: string[][];
  };

  return data.values ?? [];
}

export async function fetchSpreadsheetSheetTitles({
  spreadsheetId,
  accessToken,
}: {
  accessToken: string;
  spreadsheetId: string;
}): Promise<string[]> {
  const response = await fetch(
    `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}?fields=sheets.properties.title`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    },
  );

  if (!response.ok) {
    let message = `Помилка сервера Google (${response.status})`;
    try {
      const errorJson = (await response.json()) as {
        error?: { message?: string };
      };
      if (errorJson?.error?.message) {
        message = errorJson.error.message;
      }
    } catch {
      const text = await response.text();
      if (text) message = text;
    }
    throw new Error(message);
  }

  const data = (await response.json()) as {
    sheets?: {
      properties?: {
        title?: string;
      };
    }[];
  };

  return (
    data.sheets
      ?.map((sheet) => sheet.properties?.title)
      .filter((title): title is string => Boolean(title)) ?? []
  );
}

export function findSpreadsheetSheetTitle(
  sheetTitles: string[],
  expectedTitle: string,
): string | null {
  const normalizedExpectedTitle = expectedTitle.trim().toLowerCase();

  return (
    sheetTitles.find(
      (title) => title.trim().toLowerCase() === normalizedExpectedTitle,
    ) ?? null
  );
}

function getSpreadsheetDayNumber(value: string): number | null {
  const cell = value.trim().toLowerCase().replace(/\s+/g, ' ');
  const match = cell.match(/^(\d{1,2})(?:\.\d{1,2}(?:\.\d{2,4})?|\s|$)/);
  const day = match ? Number(match[1]) : NaN;

  return day >= 1 && day <= 31 ? day : null;
}

export function findSpreadsheetDateColumns(
  rows: string[][],
  startDate: dayjs.Dayjs,
  endDate: dayjs.Dayjs,
): Map<string, number> {
  let bestRun: { columns: number[]; days: number[] } | null = null;

  for (const row of rows) {
    let runColumns: number[] = [];
    let runDays: number[] = [];

    for (let column = 0; column < row.length; column += 1) {
      const day = getSpreadsheetDayNumber(String(row[column] ?? ''));
      const continuesRun =
        day !== null &&
        (runDays.length === 0 || day === runDays[runDays.length - 1] + 1);

      if (!continuesRun) {
        if (runDays[0] === 1 && runDays.length >= 3) {
          if (!bestRun || runDays.length > bestRun.days.length) {
            bestRun = { columns: runColumns, days: runDays };
          }
        }

        runColumns = day === 1 ? [column] : [];
        runDays = day === 1 ? [day] : [];
        continue;
      }

      runColumns.push(column);
      runDays.push(day);
    }

    if (runDays[0] === 1 && runDays.length >= 3) {
      if (!bestRun || runDays.length > bestRun.days.length) {
        bestRun = { columns: runColumns, days: runDays };
      }
    }
  }

  const dateColumns = new Map<string, number>();
  if (!bestRun) return dateColumns;

  let current = startDate;
  while (current.isBefore(endDate, 'day') || current.isSame(endDate, 'day')) {
    const dayIndex = bestRun.days.indexOf(current.date());
    if (dayIndex >= 0) {
      dateColumns.set(current.format('YYYY-MM-DD'), bestRun.columns[dayIndex]);
    }
    current = current.add(1, 'day');
  }

  return dateColumns;
}

export async function batchUpdateSpreadsheetValues({
  accessToken,
  data,
  spreadsheetId,
}: {
  accessToken: string;
  data: { range: string; values: string[][] }[];
  spreadsheetId: string;
}): Promise<void> {
  const response = await fetch(
    `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values:batchUpdate`,
    {
      body: JSON.stringify({
        data,
        valueInputOption: 'USER_ENTERED',
      }),
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      method: 'POST',
    },
  );

  if (!response.ok) {
    let message = `Помилка сервера Google (${response.status})`;
    try {
      const errorJson = (await response.json()) as {
        error?: { message?: string };
      };
      if (errorJson?.error?.message) {
        message = errorJson.error.message;
      }
    } catch {
      const text = await response.text();
      if (text) message = text;
    }
    throw new Error(message);
  }
}
