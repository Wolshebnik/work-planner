import { queryOptions } from '@tanstack/react-query';

import { runScheduleSheetCheck } from './run-schedule-sheet-check';
import type { CheckScheduleSheetQueryOptionsParams } from './types';

export const exportScheduleSheetKeys = {
  all: ['export-schedule-sheet'] as const,
  check: (
    spreadsheetId: string | null,
    monthKey: string,
    employeeSignature: string,
  ) =>
    [
      ...exportScheduleSheetKeys.all,
      'check',
      spreadsheetId,
      monthKey,
      employeeSignature,
    ] as const,
};

export function checkScheduleSheetQueryOptions({
  employeeSignature,
  enabled = true,
  ensureSheetsScopeAndGetToken,
  month,
  monthKey,
  monthLabel,
  queryClient,
  spreadsheetId,
}: CheckScheduleSheetQueryOptionsParams) {
  return queryOptions({
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
