import { useEffect, useState } from 'react';

import { View } from 'react-native';

import { CircularProgressLoader } from '@/shared/ui/circular-progress-loader';
import { showToast } from '@/shared/ui/toast';

import { ensureSession } from '../model/ensure-session';

type SessionInitializerProps = {
  children: React.ReactNode;
};

export function SessionInitializer({ children }: SessionInitializerProps) {
  const [isSessionReady, setIsSessionReady] = useState(false);

  useEffect(() => {
    let mounted = true;

    ensureSession()
      .then(() => {
        if (mounted) setIsSessionReady(true);
      })
      .catch((error) => {
        if (!mounted) return;
        const err =
          error instanceof Error ? error : new Error('Невідома помилка');
        showToast({
          type: 'error',
          text1: 'Не вдалося авторизуватись',
          text2: err.message,
        });
      });

    return () => {
      mounted = false;
    };
  }, []);

  if (!isSessionReady) {
    return (
      <View className='flex-1 items-center justify-center'>
        <CircularProgressLoader size='large' />
      </View>
    );
  }

  return <>{children}</>;
}
