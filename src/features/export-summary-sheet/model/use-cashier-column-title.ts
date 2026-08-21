import { useCallback, useEffect, useState } from 'react';

import AsyncStorage from '@react-native-async-storage/async-storage';

export const DEFAULT_CASHIER_COLUMN_TITLE =
  'Кол-во часов на кассе (за месяц)';
const STORAGE_KEY = '@work_planner_cashier_column_title';

export function useCashierColumnTitle() {
  const [columnTitle, setColumnTitleState] = useState<string>(
    DEFAULT_CASHIER_COLUMN_TITLE,
  );
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    let isMounted = true;

    async function loadSavedTitle() {
      try {
        const saved = await AsyncStorage.getItem(STORAGE_KEY);
        if (isMounted && saved !== null && saved.trim() !== '') {
          setColumnTitleState(saved);
        }
      } catch {
        
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    void loadSavedTitle();

    return () => {
      isMounted = false;
    };
  }, []);

  const setColumnTitle = useCallback((newTitle: string) => {
    setColumnTitleState(newTitle);
    void AsyncStorage.setItem(STORAGE_KEY, newTitle);
  }, []);

  return {
    columnTitle,
    setColumnTitle,
    isLoading,
  };
}
