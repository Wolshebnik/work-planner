import type { QueryClient } from '@tanstack/react-query';
import type dayjs from 'dayjs';

import type { Employee } from '@/entities/employee';
import type { ScheduleEntry } from '@/entities/schedule';

export interface ScheduleSheetDifference {
  date: string;
  employeeId: string;
  rowIndex: number;
  scheduleMark: string;
  sheetMark: string;
}

export interface ScheduleSheetComparison {
  ambiguousEmployees: Employee[];
  differences: ScheduleSheetDifference[];
  employeeSignature: string;
  missingDays: string[];
  missingEmployees: Employee[];
}

export interface CompareScheduleWithSheetParams {
  employees: Employee[];
  endDate: dayjs.Dayjs;
  rows: (string | number)[][];
  scheduleEntries: ScheduleEntry[];
  startDate: dayjs.Dayjs;
}

export interface ExportPeriodOption {
  endDate: dayjs.Dayjs;
  monthKey: string;
  monthLabel: string;
  startDate: dayjs.Dayjs;
  weekLabel: string;
}

export interface CheckPeriodParams {
  endDate: dayjs.Dayjs;
  monthLabel: string;
  startDate: dayjs.Dayjs;
}

export interface ExportScheduleParams {
  accessToken: string;
  endDate: dayjs.Dayjs;
  monthLabel: string;
  spreadsheetId: string;
  startDate: dayjs.Dayjs;
}

export interface CheckScheduleSheetForMonthParams {
  accessToken: string;
  employees: Employee[];
  month: dayjs.Dayjs;
  monthLabel: string;
  scheduleEntries: ScheduleEntry[];
  spreadsheetId: string;
}

export interface RunScheduleSheetCheckParams {
  ensureSheetsScopeAndGetToken: () => Promise<string>;
  month: dayjs.Dayjs;
  monthKey: string;
  monthLabel: string;
  queryClient: QueryClient;
  spreadsheetId: string | null;
}

export interface CheckScheduleSheetQueryOptionsParams {
  employeeSignature: string;
  enabled?: boolean;
  ensureSheetsScopeAndGetToken: () => Promise<string>;
  month: dayjs.Dayjs;
  monthKey: string;
  monthLabel: string;
  queryClient: QueryClient;
  spreadsheetId: string | null;
}

export interface UseScheduleSheetCheckQueryParams {
  employeeSignature: string;
  enabled?: boolean;
  month: dayjs.Dayjs;
  monthKey: string;
  monthLabel: string;
  spreadsheetId: string | null;
}

export interface UseCheckScheduleSheetParams {
  currentDate: dayjs.Dayjs;
  monthLabel: string;
}

export interface GetCheckSheetAvailabilityStateParams {
  employeesError: unknown;
  hasSpreadsheet: boolean;
  isLoading: boolean;
  monthLabel: string;
  queryError: unknown;
  result: ScheduleSheetComparison | undefined;
}
