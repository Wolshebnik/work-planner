import { useCallback, useEffect, useState } from 'react';

import { Text, TouchableOpacity, View } from 'react-native';

import { getNetworkErrorMessage } from '@/shared/lib/get-network-error-message';
import { CircularProgressLoader } from '@/shared/ui/circular-progress-loader';
import { showToast } from '@/shared/ui/toast';

import { ensureSession } from '../model/ensure-session';

type SessionInitializerProps = {
  children: React.ReactNode;
};

type AuthStatus = 'loading' | 'ready' | 'error';

export function SessionInitializer({ children }: SessionInitializerProps) {
  const [status, setStatus] = useState<AuthStatus>('loading');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [retryCount, setRetryCount] = useState(0);

  const handleRetry = useCallback(() => {
    setStatus('loading');
    setErrorMessage(null);
    setRetryCount((prev) => prev + 1);
  }, []);

  useEffect(() => {
    let mounted = true;

    ensureSession()
      .then(() => {
        if (mounted) {
          setStatus('ready');
        }
      })
      .catch((error: unknown) => {
        const message =
          getNetworkErrorMessage(error) ??
          (error instanceof Error ? error.message : 'Невідома помилка');
        if (!mounted) return;
        setStatus('error');
        setErrorMessage(message);
        showToast({
          type: 'error',
          text1: 'Не вдалося авторизуватись',
          text2: message,
        });
      });

    return () => {
      mounted = false;
    };
  }, [retryCount]);

  if (status === 'loading') {
    return (
      <View className='flex-1 items-center justify-center'>
        <CircularProgressLoader size='large' />
      </View>
    );
  }

  if (status === 'error') {
    return (
      <View className='flex-1 items-center justify-center px-6'>
        <Text className='mb-4 text-center text-base text-red-500'>
          {errorMessage ?? 'Помилка авторизації'}
        </Text>
        <TouchableOpacity
          onPress={handleRetry}
          className='rounded-lg bg-black px-6 py-3'
        >
          <Text className='font-semibold text-white'>Спробувати знову</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return <>{children}</>;
}
