import { useMutation, useQueryClient } from '@tanstack/react-query';

import { saveCashierHours } from '../api/save-cashier-hours';
import { cashierHoursKeys } from './query-keys';

interface SaveCashierHoursParams {
  cashierHours: number;
  employeeId: string;
  exists?: boolean;
  month: number;
  year: number;
}

export function useSaveCashierHours() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      employeeId,
      year,
      month,
      cashierHours,
      exists,
    }: SaveCashierHoursParams) =>
      saveCashierHours(employeeId, year, month, cashierHours, exists),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: cashierHoursKeys.month(variables.year, variables.month),
      });
    },
  });
}
