import { MutationCache, QueryCache, QueryClient } from '@tanstack/react-query';
import { z } from 'zod';

import { showToast } from '@/shared/ui/toast';

function formatErrorMessage(error: unknown): { title: string; message: string } {
  if (error instanceof z.ZodError) {
    const issues = error.issues
      .map((issue) => `${issue.path.join('.') || 'root'}: ${issue.message}`)
      .join('; ');
    return {
      title: 'Помилка валідації (Zod)',
      message: issues,
    };
  }

  if (error instanceof Error) {
    return {
      title: 'Помилка',
      message: error.message,
    };
  }

  return {
    title: 'Помилка',
    message: String(error),
  };
}

export const queryClient = new QueryClient({
  queryCache: new QueryCache({
    onError: (error) => {
      const { title, message } = formatErrorMessage(error);
      showToast({
        type: 'error',
        text1: title,
        text2: message,
      });
    },
  }),
  mutationCache: new MutationCache({
    onError: (error) => {
      const { title, message } = formatErrorMessage(error);
      showToast({
        type: 'error',
        text1: title,
        text2: message,
      });
    },
  }),
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 1000 * 60,
    },
  },
});
