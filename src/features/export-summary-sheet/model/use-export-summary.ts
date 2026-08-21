import { useCallback, useState } from 'react';

import type dayjs from 'dayjs';

import { useGoogleAuth } from '@/entities/google-auth';
import {
  extractSpreadsheetId,
  useGoogleSheets,
} from '@/entities/google-sheets';
import { showToast } from '@/shared/ui/toast';

import { exportSummaryToGoogleSheet } from './export-summary-to-google-sheet';

interface ExportSummaryHookParams {
  columnTitle: string;
  date: dayjs.Dayjs;
}

export function useExportSummary(onSuccess?: () => void) {
  const [isLoading, setIsLoading] = useState(false);
  const { data: sheets = [] } = useGoogleSheets();
  const { ensureSheetsScopeAndGetToken } = useGoogleAuth();

  const handleExport = useCallback(
    async ({ columnTitle, date }: ExportSummaryHookParams) => {
      if (isLoading) {
        return;
      }

      const activeSheet = sheets[0];
      if (!activeSheet) {
        showToast({
          text1: 'Google Таблицю не підключено',
          text2: 'Спочатку додайте таблицю у налаштуваннях',
          type: 'error',
        });
        return;
      }

      const spreadsheetId = extractSpreadsheetId(activeSheet.url);
      if (!spreadsheetId) {
        showToast({
          text1: 'Некоректне посилання на таблицю',
          type: 'error',
        });
        return;
      }

      setIsLoading(true);
      try {
        const accessToken = await ensureSheetsScopeAndGetToken();

        await exportSummaryToGoogleSheet({
          accessToken,
          columnTitle,
          date,
          spreadsheetId,
        });

        showToast({
          text1: 'Дані каси успішно відправлено',
          text2: 'Дані збережено у Google Таблицю',
          type: 'success',
        });

        onSuccess?.();
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : 'Невідома помилка';
        showToast({
          text1: 'Помилка відправки',
          text2: errorMessage,
          type: 'error',
        });
      } finally {
        setIsLoading(false);
      }
    },
    [ensureSheetsScopeAndGetToken, isLoading, onSuccess, sheets],
  );

  return {
    handleExport,
    isLoading,
  };
}
