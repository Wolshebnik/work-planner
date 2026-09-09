import { useCallback, useRef, useState } from 'react';
import type { LayoutChangeEvent, View } from 'react-native';

import * as Clipboard from 'expo-clipboard';
import * as Sharing from 'expo-sharing';
import { captureRef } from 'react-native-view-shot';

import { showToast } from '@/shared/ui/toast';

export function useExportSummaryScreenshot(monthLabel?: string) {
  const [isExporting, setIsExporting] = useState(false);
  const exportRef = useRef<View>(null);
  const layoutResolverRef = useRef<(() => void) | null>(null);

  const handleLayout = useCallback((_event: LayoutChangeEvent) => {
    if (layoutResolverRef.current) {
      layoutResolverRef.current();
      layoutResolverRef.current = null;
    }
  }, []);

  const exportScreenshot = useCallback(async () => {
    if (isExporting) {
      return;
    }

    setIsExporting(true);

    try {
      if (!exportRef.current) {
        showToast({
          type: 'error',
          text1: 'Помилка',
          text2: 'Не вдалося знайти область для створення скриншоту',
        });

        return;
      }

      const base64Data = await captureRef(exportRef.current, {
        format: 'png',
        quality: 1,
        result: 'base64',
      });

      try {
        await Clipboard.setImageAsync(base64Data);
      } catch {}

      const fileUri = await captureRef(exportRef.current, {
        format: 'png',
        quality: 1,
        result: 'tmpfile',
      });

      const isSharingAvailable = await Sharing.isAvailableAsync();

      if (isSharingAvailable) {
        const dialogTitle = monthLabel
          ? `Поділитися підсумками за ${monthLabel}`
          : 'Поділитися підсумками';

        await Sharing.shareAsync(fileUri, {
          mimeType: 'image/png',
          dialogTitle,
          UTI: 'public.png',
        });
      }
    } catch {
      showToast({
        type: 'error',
        text1: 'Помилка',
        text2: 'Не вдалося зберегти або надіслати скриншот',
      });
    } finally {
      layoutResolverRef.current = null;
      setIsExporting(false);
    }
  }, [isExporting, monthLabel]);

  return {
    exportRef,
    exportScreenshot,
    handleLayout,
    isExporting,
  };
}
