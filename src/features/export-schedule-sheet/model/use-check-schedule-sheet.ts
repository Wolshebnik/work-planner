import { useCallback, useState } from 'react';

import { useQueryClient } from '@tanstack/react-query';

import { useGoogleAuth } from '@/entities/google-auth';
import { extractSpreadsheetId, useGoogleSheets } from '@/entities/google-sheets';
import { showToast } from '@/shared/ui/toast';

import { runScheduleSheetCheck } from './run-schedule-sheet-check';
import type { UseCheckScheduleSheetParams } from './types';

export function useCheckScheduleSheet({
  currentDate,
  monthLabel,
}: UseCheckScheduleSheetParams) {
  const { data: sheets = [] } = useGoogleSheets();
  const { ensureSheetsScopeAndGetToken } = useGoogleAuth();
  const queryClient = useQueryClient();
  const [isChecking, setIsChecking] = useState(false);

  const activeSheet = sheets[0];
  const spreadsheetId = activeSheet
    ? extractSpreadsheetId(activeSheet.url)
    : null;

  const handleCheck = useCallback(async () => {
    if (isChecking) return;

    if (!spreadsheetId) {
      showToast({
        text1: 'Google Таблицю не підключено',
        text2: 'Спочатку додайте таблицю у налаштуваннях',
        type: 'error',
      });
      return;
    }

    setIsChecking(true);
    try {
      const result = await runScheduleSheetCheck({
        ensureSheetsScopeAndGetToken,
        month: currentDate,
        monthLabel,
        monthKey: currentDate.format('YYYY-MM'),
        queryClient,
        spreadsheetId,
      });

      if (
        result.missingDays.length > 0 ||
        result.missingEmployees.length > 0 ||
        result.ambiguousEmployees.length > 0
      ) {
        showToast({
          text1: 'Перевірка не завершена',
          text2: 'Перевірте дні та працівників у Google Таблиці',
          type: 'error',
        });
        return;
      }

      if (result.differences.length > 0) {
        showToast({
          text1: 'Знайдено розбіжності',
          text2: `Кількість: ${result.differences.length}`,
          type: 'info',
        });
      }
    } catch (error) {
      showToast({
        text1: 'Помилка перевірки Google Таблиці',
        text2: error instanceof Error ? error.message : 'Невідома помилка',
        type: 'error',
      });
    } finally {
      setIsChecking(false);
    }
  }, [
    currentDate,
    ensureSheetsScopeAndGetToken,
    isChecking,
    monthLabel,
    queryClient,
    spreadsheetId,
  ]);

  return {
    handleCheck,
    isChecking,
  };
}
