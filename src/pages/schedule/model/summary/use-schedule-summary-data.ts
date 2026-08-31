import { useCallback, useMemo, useState } from 'react';

import type dayjs from 'dayjs';

import { useCashierHours, useSaveCashierHours } from '@/entities/cashier-hours';
import type { Employee } from '@/entities/employee';
import { useScheduleByMonth } from '@/entities/schedule';
import type { AvatarColor } from '@/shared/config/avatar-color';
import { getEmployeeAvatarColor } from '@/shared/config/get-avatar-color';
import {
  buildMonthSummaries,
  formatMonthTotal,
  type EmployeeSummaryItem,
} from '@/widgets/summary-list';

interface UseScheduleSummaryDataParams {
  activeEmployees: Employee[];
  colorMap: Map<string, AvatarColor>;
  date: dayjs.Dayjs;
}

export function useScheduleSummaryData({
  activeEmployees,
  colorMap,
  date,
}: UseScheduleSummaryDataParams) {
  const [isCashSheetOpen, setIsCashSheetOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<
    EmployeeSummaryItem | undefined
  >();

  const {
    data: scheduleEntries,
    isPending: isSchedulePending,
    isLoading: isScheduleLoading,
    isFetching: isScheduleFetching,
  } = useScheduleByMonth(date);

  const { data: cashierHoursEntries } = useCashierHours(date);
  const saveCashierHoursMutation = useSaveCashierHours();

  const cashierHoursMap = useMemo(() => {
    const map = new Map<string, { cashier_hours: number; exists: boolean }>();
    if (cashierHoursEntries) {
      for (const item of cashierHoursEntries) {
        map.set(item.employee_id, {
          cashier_hours: item.cashier_hours,
          exists: true,
        });
      }
    }
    return map;
  }, [cashierHoursEntries]);

  const summaries = useMemo(
    () => buildMonthSummaries(activeEmployees, scheduleEntries ?? [], date),
    [activeEmployees, scheduleEntries, date],
  );

  const summaryEmployees: EmployeeSummaryItem[] = useMemo(() => {
    return summaries.map((summary) => {
      const employee = activeEmployees.find(
        (e) => e.id === summary.employeeId,
      );
      const name = employee
        ? [employee.last_name, employee.first_name].filter(Boolean).join(' ')
        : '';
      const initials = employee
        ? [employee.last_name, employee.first_name]
            .filter(Boolean)
            .map((n) => n[0])
            .join('')
            .toUpperCase()
            .slice(0, 2)
        : '';

      const stat = cashierHoursMap.get(summary.employeeId);
      const cashTotal = stat ? stat.cashier_hours : 0;

      return {
        id: summary.employeeId,
        name,
        initials,
        avatarColor: getEmployeeAvatarColor(summary.employeeId, colorMap),
        weeklyHours: summary.weeklyHours.map((hours) =>
          formatMonthTotal(hours),
        ),
        weeklyWorkDays: summary.weeklyWorkDays,
        weekLabels: summary.weekLabels,
        monthlyHours: summary.monthlyHours,
        monthTotal: formatMonthTotal(summary.monthlyHours),
        cashTotal,
      };
    });
  }, [summaries, activeEmployees, colorMap, cashierHoursMap]);

  const monthLabel = useMemo(() => {
    return (
      date.format('MMMM').charAt(0).toUpperCase() +
      date.format('MMMM').slice(1) +
      ' ' +
      date.format('YYYY')
    );
  }, [date]);

  const handleCashPress = useCallback((employee: EmployeeSummaryItem) => {
    setSelectedEmployee(employee);
    setIsCashSheetOpen(true);
  }, []);

  const handleCloseCashSheet = useCallback(() => {
    setIsCashSheetOpen(false);
    setSelectedEmployee(undefined);
  }, []);

  const canResetCash = Boolean(
    selectedEmployee &&
      (cashierHoursMap.get(selectedEmployee.id)?.cashier_hours ?? 0) > 0,
  );

  const handleSaveCash = useCallback(
    async (data: { amount: string }) => {
      if (!selectedEmployee) {
        return;
      }

      const year = date.year();
      const month = date.month() + 1;
      const amountNumber = Number(data.amount.replace(',', '.'));
      const stat = cashierHoursMap.get(selectedEmployee.id);

      await saveCashierHoursMutation.mutateAsync({
        employeeId: selectedEmployee.id,
        year,
        month,
        cashierHours: amountNumber,
        exists: Boolean(stat?.exists),
      });
    },
    [selectedEmployee, date, cashierHoursMap, saveCashierHoursMutation],
  );

  const isLoading =
    isSchedulePending ||
    isScheduleLoading ||
    !scheduleEntries ||
    (isScheduleFetching && scheduleEntries.length === 0);

  return {
    handleCashPress,
    handleCloseCashSheet,
    handleSaveCash,
    canResetCash,
    isCashSheetOpen,
    isLoading,
    monthLabel,
    selectedEmployee,
    summaryEmployees,
  };
}
