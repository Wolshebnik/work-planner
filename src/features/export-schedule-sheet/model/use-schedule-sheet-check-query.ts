import { useQuery, useQueryClient } from '@tanstack/react-query';

import { useGoogleAuth } from '@/entities/google-auth';

import { exportScheduleSheetKeys } from './query-keys';
import { runScheduleSheetCheck } from './run-schedule-sheet-check';
import type { UseScheduleSheetCheckQueryParams } from './types';

export function useScheduleSheetCheckQuery({
  employeeSignature,
  enabled = true,
  month,
  monthKey,
  monthLabel,
  spreadsheetId,
}: UseScheduleSheetCheckQueryParams) {
  const { ensureSheetsScopeAndGetToken } = useGoogleAuth();
  const queryClient = useQueryClient();

  return useQuery({
    enabled,
    gcTime: 0,
    queryFn: () =>
      runScheduleSheetCheck({
        ensureSheetsScopeAndGetToken,
        month,
        monthKey,
        monthLabel,
        queryClient,
        spreadsheetId,
      }),
    queryKey: exportScheduleSheetKeys.check(
      spreadsheetId,
      monthKey,
      employeeSignature,
    ),
    refetchOnMount: 'always',
    retry: false,
    staleTime: 0,
  });
}
