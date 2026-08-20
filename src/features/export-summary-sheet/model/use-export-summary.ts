import { useCallback, useState } from 'react';

export function useExportSummary(onSuccess?: () => void) {
  const [isLoading, setIsLoading] = useState(false);

  const handleExport = useCallback(async () => {
    if (isLoading) return;
    setIsLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 2000));
      onSuccess?.();
    } finally {
      setIsLoading(false);
    }
  }, [isLoading, onSuccess]);

  return {
    isLoading,
    handleExport,
  };
}
