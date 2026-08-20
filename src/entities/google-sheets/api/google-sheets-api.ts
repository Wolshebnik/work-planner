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
