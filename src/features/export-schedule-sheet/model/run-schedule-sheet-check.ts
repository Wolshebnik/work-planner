import { employeeQueryOptions } from '@/entities/employee';
import { scheduleMonthQueryOptions } from '@/entities/schedule';

import { checkScheduleSheetForMonth } from '../api/check-schedule-sheet-for-month';
import { setScheduleSheetCheck } from './schedule-sheet-check-store';
import type { RunScheduleSheetCheckParams } from './types';

export async function runScheduleSheetCheck({
  ensureSheetsScopeAndGetToken,
  month,
  monthLabel,
  monthKey,
  queryClient,
  spreadsheetId,
}: RunScheduleSheetCheckParams) {
  if (!spreadsheetId) {
    throw new Error('Google Таблицю не підключено');
  }

  const accessToken = await ensureSheetsScopeAndGetToken();

  const [employees, scheduleEntries] = await Promise.all([
    queryClient.ensureQueryData(employeeQueryOptions()),
    queryClient.ensureQueryData(scheduleMonthQueryOptions(monthKey)),
  ]);

  const result = await checkScheduleSheetForMonth({
    accessToken,
    employees,
    month,
    monthLabel,
    spreadsheetId,
    scheduleEntries,
  });

  setScheduleSheetCheck(spreadsheetId, monthKey, result);

  return result;
}
