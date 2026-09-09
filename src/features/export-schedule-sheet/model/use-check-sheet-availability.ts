import { useGetEmployees } from '@/entities/employee';
import { extractSpreadsheetId, useGoogleSheets } from '@/entities/google-sheets';

import { getScheduleSheetEmployeeSignature } from './compare-schedule-with-sheet';
import { getCheckSheetAvailabilityState } from './get-check-sheet-availability-state';
import { useScheduleSheetCheckStore } from './schedule-sheet-check-store';
import { useScheduleSheetCheckQuery } from './use-schedule-sheet-check-query';
import { type CheckPeriodParams } from './types';

export function useCheckSheetAvailability({
  monthLabel,
  startDate,
}: CheckPeriodParams) {
  const { data: sheets = [], isLoading: isLoadingSheets } = useGoogleSheets();
  const {
    data: employees = [],
    error: employeesError,
    isLoading: isLoadingEmployees,
  } = useGetEmployees();

  const activeSheet = sheets[0];
  const spreadsheetId = activeSheet
    ? extractSpreadsheetId(activeSheet.url)
    : null;
  const monthKey = startDate.format('YYYY-MM');

  const cachedResult = useScheduleSheetCheckStore(
    (state) => state.checks[`${spreadsheetId ?? ''}:${monthKey}`],
  );

  const employeeSignature = getScheduleSheetEmployeeSignature(employees);

  const hasValidCachedResult =
    !isLoadingEmployees &&
    Boolean(cachedResult) &&
    cachedResult?.employeeSignature === employeeSignature;

  const shouldCheck =
    Boolean(spreadsheetId) &&
    !isLoadingEmployees &&
    !employeesError &&
    !hasValidCachedResult;

  const {
    data: queryResult,
    error: queryError,
    isFetching,
    isLoading: isLoadingValues,
  } = useScheduleSheetCheckQuery({
    employeeSignature,
    enabled: shouldCheck,
    month: startDate,
    monthKey,
    monthLabel,
    spreadsheetId,
  });

  const isLoading =
    isLoadingSheets ||
    isLoadingEmployees ||
    (shouldCheck && (isLoadingValues || isFetching));

  const result = hasValidCachedResult ? cachedResult : queryResult;

  const availabilityState = getCheckSheetAvailabilityState({
    employeesError,
    hasSpreadsheet: Boolean(activeSheet && spreadsheetId),
    isLoading,
    monthLabel,
    queryError,
    result,
  });

  return {
    ...availabilityState,
    isLoading,
  };
}
