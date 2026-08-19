import { useCallback, useMemo, useState } from 'react';

import dayjs from 'dayjs';
import weekOfYear from 'dayjs/plugin/weekOfYear';

import { type ScheduleStatus } from '@/entities/schedule-status';
import { useClearScheduleEntry } from '@/features/clear-schedule-entry';
import { useGetEmployees } from '@/features/get-employees';
import { useSetScheduleEntry } from '@/features/set-schedule-entry';
import { createEmployeeColorMap } from '@/shared/config/get-avatar-color';
import { type ViewMode } from '@/shared/ui/view-switcher';


import 'dayjs/locale/uk';

dayjs.extend(weekOfYear);
dayjs.locale('uk');

export function useSchedulePage() {
  const [viewMode, setViewMode] = useState<ViewMode>('week');
  const [currentDate, setCurrentDate] = useState(dayjs());
  const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<dayjs.Dayjs | null>(null);
  const [editingCell, setEditingCell] = useState<{
    dayIndex: number;
    employeeIndex: number;
  } | null>(null);

  const { data: employees = [], isLoading: isLoadingEmployees } =
    useGetEmployees();

  const setScheduleEntryMutation = useSetScheduleEntry();
  const clearScheduleEntryMutation = useClearScheduleEntry();

  const startOfWeek = currentDate.startOf('isoWeek');
  const endOfWeek = startOfWeek.add(6, 'day');

  const handleCellPress = useCallback(
    (employeeIndex: number, dayIndex: number) => {
      const clickedDate = startOfWeek.add(dayIndex, 'day');
      setSelectedDate(clickedDate);
      setEditingCell({ employeeIndex, dayIndex });
      setIsBottomSheetOpen(true);
    },
    [startOfWeek],
  );

  const handleClose = useCallback(() => {
    setIsBottomSheetOpen(false);
    setEditingCell(null);
  }, []);

  const activeEmployees = useMemo(
    () => employees.filter((e) => e.is_active),
    [employees],
  );

  const colorMap = useMemo(
    () => createEmployeeColorMap(employees),
    [employees],
  );

  const weekPeriod = useMemo(() => {
    const isSameMonth = startOfWeek.isSame(endOfWeek, 'month');
    const isSameYear = startOfWeek.isSame(endOfWeek, 'year');

    if (isSameMonth) {
      return `${startOfWeek.format('D')}–${endOfWeek.format('D')} ${startOfWeek.format('MMMM YYYY')}`;
    }

    if (isSameYear) {
      return `${startOfWeek.format('D MMM')} – ${endOfWeek.format('D MMM YYYY')}`;
    }

    return `${startOfWeek.format('D MMM YYYY')} – ${endOfWeek.format('D MMM YYYY')}`;
  }, [startOfWeek, endOfWeek]);

  const weekLabel = useMemo(
    () => `Тиждень ${currentDate.week()}`,
    [currentDate],
  );

  const monthLabel = useMemo(
    () =>
      currentDate.format('MMMM').charAt(0).toUpperCase() +
      currentDate.format('MMMM').slice(1) +
      ' ' +
      currentDate.format('YYYY'),
    [currentDate],
  );

  const handlePrev = useCallback(() => {
    setCurrentDate((prev) =>
      viewMode === 'week'
        ? prev.subtract(1, 'week')
        : prev.subtract(1, 'month'),
    );
  }, [viewMode]);

  const handleNext = useCallback(() => {
    setCurrentDate((prev) =>
      viewMode === 'week' ? prev.add(1, 'week') : prev.add(1, 'month'),
    );
  }, [viewMode]);

  const handleResetToCurrent = useCallback(() => {
    setCurrentDate(dayjs());
  }, []);

  const handleStatusSelect = (status: ScheduleStatus) => {
    if (!editingCell) return;
    const employee = activeEmployees[editingCell.employeeIndex];
    if (!employee) return;
    const day = startOfWeek.add(editingCell.dayIndex, 'day');
    const dateStr = day.format('YYYY-MM-DD');

    setIsBottomSheetOpen(false);
    setEditingCell(null);

    setScheduleEntryMutation.mutate({
      employeeId: employee.id,
      workDate: dateStr,
      statusId: status.id,
      status,
    });
  };

  const handleClearCell = () => {
    if (!editingCell) return;
    const employee = activeEmployees[editingCell.employeeIndex];
    if (!employee) return;
    const day = startOfWeek.add(editingCell.dayIndex, 'day');
    const dateStr = day.format('YYYY-MM-DD');

    setIsBottomSheetOpen(false);
    setEditingCell(null);

    clearScheduleEntryMutation.mutate({
      employeeId: employee.id,
      workDate: dateStr,
    });
  };

  const bottomSheetTitle = (() => {
    if (!editingCell) return 'Деталі зміни';
    const employee = activeEmployees[editingCell.employeeIndex];
    if (!employee) return 'Деталі зміни';
    const employeeName = [employee.last_name, employee.first_name]
      .filter(Boolean)
      .join(' ');
    const day = startOfWeek.add(editingCell.dayIndex, 'day');
    return `${employeeName}, ${day.format('D MMMM')}`;
  })();

  return {
    viewMode,
    setViewMode,
    currentDate,
    setCurrentDate,
    isBottomSheetOpen,

    selectedCell: editingCell,
    selectedDate,
    activeEmployees,
    colorMap,
    weekPeriod,
    weekLabel,
    monthLabel,
    isLoading: isLoadingEmployees,
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


