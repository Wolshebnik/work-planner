import { useCallback, useState } from 'react';

import dayjs from 'dayjs';
import weekOfYear from 'dayjs/plugin/weekOfYear';

import { type ScheduleStatus } from '@/entities/schedule-status';
import { useClearScheduleEntry } from '@/features/clear-schedule-entry';
import { useGetEmployees } from '@/features/get-employees';
import { useScheduleByMonth } from '@/features/get-schedule-by-month';
import { useSetScheduleEntry } from '@/features/set-schedule-entry';
import { type ViewMode } from '@/shared/ui/view-switcher';
import { type DayCell, type EmployeeRow } from '@/widgets/schedule-grid';

import 'dayjs/locale/uk';

dayjs.extend(weekOfYear);
dayjs.locale('uk');

export function useSchedulePage() {
  const [viewMode, setViewMode] = useState<ViewMode>('week');
  const [currentDate, setCurrentDate] = useState(dayjs());
  const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(false);
  const [selectedStatusId, setSelectedStatusId] = useState<string | null>(null);
  const [isClearing, setIsClearing] = useState(false);
  const [selectedCell, setSelectedCell] = useState<{
    employeeIndex: number;
    dayIndex: number;
  } | null>(null);

  const { data: employees = [], isLoading: isLoadingEmployees } =
    useGetEmployees();
  const { data: scheduleEntries = [], isLoading: isLoadingSchedule } =
    useScheduleByMonth(currentDate);

  const setScheduleEntryMutation = useSetScheduleEntry();
  const clearScheduleEntryMutation = useClearScheduleEntry();

  const handleCellPress = useCallback(
    (employeeIndex: number, dayIndex: number) => {
      setSelectedCell({ employeeIndex, dayIndex });
      setIsBottomSheetOpen(true);
    },
    [],
  );

  const handleClose = useCallback(() => {
    setIsBottomSheetOpen(false);
    setSelectedCell(null);
  }, []);

  const startOfWeek = currentDate.startOf('isoWeek');
  const endOfWeek = startOfWeek.add(6, 'day');

  const activeEmployees = employees.filter((e) => e.is_active);

  const weeklyData: EmployeeRow[] = activeEmployees.map((employee) => {
    const values: (DayCell | null)[] = [];
    for (let i = 0; i < 7; i += 1) {
      const day = startOfWeek.add(i, 'day');
      const dateStr = day.format('YYYY-MM-DD');

      const entry = scheduleEntries.find(
        (e) => e.employee_id === employee.id && e.work_date === dateStr,
      );

      if (entry) {
        values.push({
          scheduleMark: entry.status.schedule_mark,
          isLocked: entry.status.is_locked,
          color: entry.status.color,
        });
      } else {
        values.push(null);
      }
    }

    return {
      id: employee.id,
      name: employee.last_name,
      values,
    };
  });

  const weekPeriod = `${startOfWeek.format('D')}–${endOfWeek.format('D')} ${startOfWeek.format('MMMM YYYY')}`;
  const weekLabel = `Тиждень ${currentDate.week()}`;

  const monthLabel =
    currentDate.format('MMMM').charAt(0).toUpperCase() +
    currentDate.format('MMMM').slice(1) +
    ' ' +
    currentDate.format('YYYY');

  const handlePrev = () => {
    setCurrentDate((prev) =>
      viewMode === 'week'
        ? prev.subtract(1, 'week')
        : prev.subtract(1, 'month'),
    );
  };

  const handleNext = () => {
    setCurrentDate((prev) =>
      viewMode === 'week' ? prev.add(1, 'week') : prev.add(1, 'month'),
    );
  };

  const handleResetToCurrent = () => {
    setCurrentDate(dayjs());
  };

  const handleStatusSelect = async (status: ScheduleStatus) => {
    if (!selectedCell) return;
    const employee = activeEmployees[selectedCell.employeeIndex];
    if (!employee) return;
    const day = startOfWeek.add(selectedCell.dayIndex, 'day');
    const dateStr = day.format('YYYY-MM-DD');

    try {
      setSelectedStatusId(status.id);
      await setScheduleEntryMutation.mutateAsync({
        employeeId: employee.id,
        workDate: dateStr,
        statusId: status.id,
      });
      setIsBottomSheetOpen(false);
      setSelectedCell(null);
    } catch {
      // Error handled by global queryClient onError toast
    } finally {
      setSelectedStatusId(null);
    }
  };

  const handleClearCell = async () => {
    if (!selectedCell) return;
    const employee = activeEmployees[selectedCell.employeeIndex];
    if (!employee) return;
    const day = startOfWeek.add(selectedCell.dayIndex, 'day');
    const dateStr = day.format('YYYY-MM-DD');

    try {
      setIsClearing(true);
      await clearScheduleEntryMutation.mutateAsync({
        employeeId: employee.id,
        workDate: dateStr,
      });
      setIsBottomSheetOpen(false);
      setSelectedCell(null);
    } catch {
      // Error handled by global queryClient onError toast
    } finally {
      setIsClearing(false);
    }
  };

  const bottomSheetTitle = (() => {
    if (!selectedCell) return 'Деталі зміни';
    const employee = activeEmployees[selectedCell.employeeIndex];
    if (!employee) return 'Деталі зміни';
    const employeeName = [employee.last_name, employee.first_name]
      .filter(Boolean)
      .join(' ');
    const day = startOfWeek.add(selectedCell.dayIndex, 'day');
    return `${employeeName}, ${day.format('D MMMM')}`;
  })();

  return {
    viewMode,
    setViewMode,
    currentDate,
    isBottomSheetOpen,
    selectedStatusId,
    isClearing,
    selectedCell,
    weeklyData,
    weekPeriod,
    weekLabel,
    monthLabel,
    isLoading: isLoadingEmployees || isLoadingSchedule,
    bottomSheetTitle,
    handlePrev,
    handleNext,
    handleResetToCurrent,
    handleCellPress,
    handleClose,
    handleStatusSelect,
    handleClearCell,
  };
}
