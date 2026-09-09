import { create } from 'zustand';

import type { ScheduleSheetComparison } from './types';

interface ScheduleSheetCheckStore {
  checks: Record<string, ScheduleSheetComparison>;
  clear: (spreadsheetId: string, monthKey: string) => void;
  clearDifferences: (
    spreadsheetId: string,
    monthKey: string,
    startDate: string,
    endDate: string,
  ) => void;
  get: (
    spreadsheetId: string,
    monthKey: string,
  ) => ScheduleSheetComparison | undefined;
  set: (
    spreadsheetId: string,
    monthKey: string,
    result: ScheduleSheetComparison,
  ) => void;
}

export const useScheduleSheetCheckStore = create<ScheduleSheetCheckStore>(
  (set, get) => ({
    checks: {},
    clear: (spreadsheetId, monthKey) => {
      const key = `${spreadsheetId}:${monthKey}`;
      set(({ checks }) => {
        const nextChecks = { ...checks };
        delete nextChecks[key];
        return { checks: nextChecks };
      });
    },
    clearDifferences: (spreadsheetId, monthKey, startDate, endDate) => {
      const key = `${spreadsheetId}:${monthKey}`;
      set(({ checks }) => {
        const result = checks[key];

        if (!result) {
          return { checks };
        }

        const differences = result.differences.filter(
          (difference) =>
            difference.date < startDate || difference.date > endDate,
        );

        if (differences.length === result.differences.length) {
          return { checks };
        }

        return {
          checks: {
            ...checks,
            [key]: { ...result, differences },
          },
        };
      });
    },
    get: (spreadsheetId, monthKey) =>
      get().checks[`${spreadsheetId}:${monthKey}`],
    set: (spreadsheetId, monthKey, result) => {
      if (
        result.ambiguousEmployees.length > 0 ||
        result.missingDays.length > 0 ||
        result.missingEmployees.length > 0
      ) {
        return;
      }

      set(({ checks }) => ({
        checks: {
          ...checks,
          [`${spreadsheetId}:${monthKey}`]: result,
        },
      }));
    },
  }),
);

export function getScheduleSheetCheck(
  spreadsheetId: string,
  monthKey: string,
) {
  return useScheduleSheetCheckStore.getState().get(spreadsheetId, monthKey);
}

export function setScheduleSheetCheck(
  spreadsheetId: string,
  monthKey: string,
  result: ScheduleSheetComparison,
) {
  useScheduleSheetCheckStore.getState().set(spreadsheetId, monthKey, result);
}

export function clearScheduleSheetCheck(
  spreadsheetId: string,
  monthKey: string,
) {
  useScheduleSheetCheckStore.getState().clear(spreadsheetId, monthKey);
}

export function clearScheduleSheetDifferences(
  spreadsheetId: string,
  monthKey: string,
  startDate: string,
  endDate: string,
) {
  useScheduleSheetCheckStore
    .getState()
    .clearDifferences(spreadsheetId, monthKey, startDate, endDate);
}
