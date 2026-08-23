import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient, processLock } from '@supabase/supabase-js';
import { focusManager } from '@tanstack/react-query';
import { AppState, type AppStateStatus, Platform } from 'react-native';

export const supabase = createClient(
  process.env.EXPO_PUBLIC_SUPABASE_URL!,
  process.env.EXPO_PUBLIC_SUPABASE_KEY!,
  {
    auth: {
      storage: AsyncStorage,
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: false,
      lock: processLock,
    },
  },
);

focusManager.setEventListener((onFocus) => {
  let isListenerActive = true;
  let focusOperation = 0;

  const subscription = AppState.addEventListener(
    'change',
    (status: AppStateStatus) => {
      if (Platform.OS === 'web') {
        return;
      }

      focusOperation += 1;
      const currentOperation = focusOperation;

      if (status !== 'active') {
        void supabase.auth.stopAutoRefresh();
        onFocus(false);
        return;
      }

      void supabase.auth.startAutoRefresh();
      void supabase.auth
        .getSession()
        .catch(() => undefined)
        .finally(() => {
          if (
            isListenerActive &&
            currentOperation === focusOperation &&
            AppState.currentState === 'active'
          ) {
            onFocus(true);
          }
        });
    },
  );

  return () => {
    isListenerActive = false;
    focusOperation += 1;
    subscription.remove();
  };
});
