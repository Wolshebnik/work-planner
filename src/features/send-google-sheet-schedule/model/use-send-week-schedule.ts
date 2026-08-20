import { useState } from 'react';

import { useGoogleAuth } from '@/entities/google-auth';
import { extractSpreadsheetId, type GoogleSheetItem } from '@/entities/google-sheets';
import { showToast } from '@/shared/ui/toast';

import { sendWeekSchedule } from '../api/send-week-schedule';

export function useSendWeekSchedule() {
  const [isSending, setIsSending] = useState(false);
  const { user, signIn, getAccessToken } = useGoogleAuth();

  const send = async (sheet?: GoogleSheetItem | null) => {
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
      setIsSending(true);

      if (!user) {
        await signIn();
      }

      const accessToken = await getAccessToken();
      const updatedCount = await sendWeekSchedule({
        spreadsheetId,
        accessToken,
      });

      showToast({
        type: 'success',
        text1: 'Дані відправлено',
        text2: `Оновлено працівників: ${updatedCount}`,
        visibilityTime: 3000,
      });
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Невідома помилка';
      showToast({
        type: 'error',
        text1: 'Помилка відправки',
        text2: errorMessage,
        visibilityTime: 3000,
      });
    } finally {
      setIsSending(false);
    }
  };

  return {
    send,
    isSending,
  };
}
