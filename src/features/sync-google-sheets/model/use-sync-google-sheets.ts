import { useState } from 'react';

import { useGoogleAuth } from '@/entities/google-auth';
import { extractSpreadsheetId, type GoogleSheetItem } from '@/entities/google-sheets';
import { showToast } from '@/shared/ui/toast';

import { syncGoogleSheets } from './sync-google-sheets';

export function useSyncGoogleSheets() {
  const [isSyncing, setIsSyncing] = useState(false);
  const { ensureSheetsScopeAndGetToken } = useGoogleAuth();

  const sync = async (sheet?: GoogleSheetItem | null) => {
    if (!sheet) {
      showToast({
        type: 'error',
        text1: 'Немає підключених таблиць',
        text2: 'Спочатку додайте Google Таблицю',
      });
      return;
    }

    const spreadsheetId = extractSpreadsheetId(sheet.url);
    if (!spreadsheetId) {
      showToast({
        type: 'error',
        text1: 'Некоректне посилання',
        text2: 'Не вдалося витягти spreadsheetId з посилання',
      });
      return;
    }

    try {
      setIsSyncing(true);

      const accessToken = await ensureSheetsScopeAndGetToken();
      await syncGoogleSheets({ spreadsheetId, accessToken });

      showToast({
        type: 'success',
        text1: 'Синхронізація успішна',
        text2: 'Всі вкладки перевірено',
        visibilityTime: 3000,
      });
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Невідома помилка';
      showToast({
        type: 'error',
        text1: 'Помилка синхронізації',
        text2: errorMessage,
        visibilityTime: 3000,
      });
    } finally {
      setIsSyncing(false);
    }
  };

  return {
    sync,
    isSyncing,
  };
}
