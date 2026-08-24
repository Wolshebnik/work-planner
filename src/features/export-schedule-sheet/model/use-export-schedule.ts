import { useCallback, useState } from 'react';

import type dayjs from 'dayjs';

import { useGoogleAuth } from '@/entities/google-auth';
import { extractSpreadsheetId, useGoogleSheets } from '@/entities/google-sheets';
import { showToast } from '@/shared/ui/toast';

import { exportScheduleToGoogleSheet } from './export-schedule-to-google-sheet';

interface ExportParams {
  endDate: dayjs.Dayjs;
  monthLabel: string;
  startDate: dayjs.Dayjs;
}

export function useExportSchedule(onSuccess?: () => void) {
  const [isLoading, setIsLoading] = useState(false);
  const { data: sheets = [] } = useGoogleSheets();
  const { ensureSheetsScopeAndGetToken } = useGoogleAuth();

  const handleExport = useCallback(
    async ({ endDate, monthLabel, startDate }: ExportParams) => {
      if (isLoading) return;

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

        await exportScheduleToGoogleSheet({
          accessToken,
          endDate,
          monthLabel,
          spreadsheetId,
          startDate,
        });

        showToast({
          text1: 'Графік успішно відправлено',
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
