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
