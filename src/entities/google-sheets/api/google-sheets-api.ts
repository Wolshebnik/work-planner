export function extractSpreadsheetId(url: string): string | null {
  const match = url.match(/\/spreadsheets\/d\/([a-zA-Z0-9-_]+)/);
  return match?.[1] ?? null;
}

export function colIndexToA1Letter(index: number): string {
  let temp = index;
  let letter = '';
  while (temp >= 0) {
    letter = String.fromCharCode((temp % 26) + 65) + letter;
    temp = Math.floor(temp / 26) - 1;
  }
  return letter;
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

export async function updateSpreadsheetValues({
  spreadsheetId,
  range,
  values,
  accessToken,
}: {
  spreadsheetId: string;
  range: string;
  values: string[][];
  accessToken: string;
}): Promise<void> {
  const rangeUrl = encodeURIComponent(range);
  const response = await fetch(
    `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${rangeUrl}?valueInputOption=USER_ENTERED`,
    {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        range,
        majorDimension: 'ROWS',
        values,
      }),
    },
  );

  if (!response.ok) {
    let message = `Помилка запису в Google Sheets (${response.status})`;
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
