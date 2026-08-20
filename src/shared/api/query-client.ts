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

  if (typeof error === 'object' && error !== null) {
    const obj = error as Record<string, unknown>;
    const message =
      (typeof obj.message === 'string' && obj.message) ||
      (typeof obj.error_description === 'string' && obj.error_description) ||
      (typeof obj.details === 'string' && obj.details) ||
      (typeof obj.hint === 'string' && obj.hint);

    if (message) {
      return {
        title: 'Помилка',
        message,
      };
    }

    try {
      return {
        title: 'Помилка',
        message: JSON.stringify(error),
      };
    } catch {
      return {
        title: 'Помилка',
        message: String(error),
      };
    }
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
