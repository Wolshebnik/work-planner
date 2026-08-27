import { useCallback, useMemo, useRef, useState } from 'react';

import dayjs from 'dayjs';
import weekOfYear from 'dayjs/plugin/weekOfYear';

import {
  useClearScheduleEntry,
  useSetScheduleEntry,
} from '@/entities/schedule';
import { type ScheduleStatus } from '@/entities/schedule-status';
import { useGetEmployees } from '@/entities/employee';
import { createEmployeeColorMap } from '@/shared/config/get-avatar-color';

import {
  getMonthLabel,
  getWeekNumberLabel,
  getWeekPeriodLabel,
} from '../navigation/get-schedule-period-labels';
import { useScheduleViewMode } from '../navigation/use-schedule-view-mode';

import 'dayjs/locale/uk';

dayjs.extend(weekOfYear);
dayjs.locale('uk');

export function useScheduleSlot() {
  const viewMode = useScheduleViewMode();
  const [currentDate, setCurrentDate] = useState(dayjs());
  const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<dayjs.Dayjs | null>(null);
  const [editingCell, setEditingCell] = useState<{
    dayIndex: number;
    employeeIndex: number;
  } | null>(null);
  const [isFillingDay, setIsFillingDay] = useState(false);

  const [isExportOpen, setIsExportOpen] = useState(false);

  const handleOpenExport = useCallback(() => {
    setIsExportOpen(true);
  }, []);

  const handleCloseExport = useCallback(() => {
    setIsExportOpen(false);
  }, []);

  const navigateHandlerRef = useRef<((direction: -1 | 1) => void) | null>(null);

  const registerNavigateHandler = useCallback(
    (handler: ((direction: -1 | 1) => void) | null) => {
      navigateHandlerRef.current = handler;
    },
    [],
  );

  const { data: employees = [], isLoading: isLoadingEmployees } =
    useGetEmployees();

  const setScheduleEntryMutation = useSetScheduleEntry();
  const clearScheduleEntryMutation = useClearScheduleEntry();

  const startOfWeek = currentDate.startOf('isoWeek');

  const handleCellPress = useCallback(
    (employeeIndex: number, dayIndex: number) => {
      const clickedDate = startOfWeek.add(dayIndex, 'day');
      setSelectedDate(clickedDate);
      setEditingCell({ employeeIndex, dayIndex });
      setIsFillingDay(false);
      setIsBottomSheetOpen(true);
    },
    [startOfWeek],
  );

  const handleClose = useCallback(() => {
    setIsBottomSheetOpen(false);
    setEditingCell(null);
    setIsFillingDay(false);
  }, []);

  const activeEmployees = useMemo(
    () => employees.filter((e) => e.is_active),
    [employees],
  );

  const colorMap = useMemo(
    () => createEmployeeColorMap(employees),
    [employees],
  );

  const weekPeriod = useMemo(
    () => getWeekPeriodLabel(currentDate),
    [currentDate],
  );

  const weekLabel = useMemo(
    () => getWeekNumberLabel(currentDate),
    [currentDate],
  );

  const monthLabel = useMemo(
    () => getMonthLabel(currentDate),
    [currentDate],
  );

  const handlePrev = useCallback(() => {
    if (navigateHandlerRef.current) {
      navigateHandlerRef.current(-1);
    } else {
      setCurrentDate((prev) => {
        if (viewMode === 'week') {
          return prev.subtract(1, 'week');
        }
        return prev.subtract(1, 'month');
      });
    }
  }, [viewMode]);

  const handleNext = useCallback(() => {
    if (navigateHandlerRef.current) {
      navigateHandlerRef.current(1);
    } else {
      setCurrentDate((prev) => {
        if (viewMode === 'week') {
          return prev.add(1, 'week');
        }
        return prev.add(1, 'month');
      });
    }
  }, [viewMode]);

  const handleResetToCurrent = useCallback(() => {
    setCurrentDate(dayjs());
  }, []);

  const handleStatusSelect = (status: ScheduleStatus) => {
    if (!editingCell) return;
    const day = startOfWeek.add(editingCell.dayIndex, 'day');
    const dateStr = day.format('YYYY-MM-DD');

    setIsBottomSheetOpen(false);
    setEditingCell(null);
    setIsFillingDay(false);

    if (isFillingDay) {
      activeEmployees.forEach((employee) => {
        setScheduleEntryMutation.mutate({
          employeeId: employee.id,
          workDate: dateStr,
          statusId: status.id,
          status,
        });
      });
      return;
    }

    const employee = activeEmployees[editingCell.employeeIndex];
    if (!employee) return;

    setScheduleEntryMutation.mutate({
      employeeId: employee.id,
      workDate: dateStr,
      statusId: status.id,
      status,
    });
  };

  const handleClearCell = () => {
    if (!editingCell) return;
    const day = startOfWeek.add(editingCell.dayIndex, 'day');
    const dateStr = day.format('YYYY-MM-DD');

    setIsBottomSheetOpen(false);
    setEditingCell(null);
    setIsFillingDay(false);

    if (isFillingDay) {
      activeEmployees.forEach((employee) => {
        clearScheduleEntryMutation.mutate({
          employeeId: employee.id,
          workDate: dateStr,
        });
      });
      return;
    }

    const employee = activeEmployees[editingCell.employeeIndex];
    if (!employee) return;

    clearScheduleEntryMutation.mutate({
      employeeId: employee.id,
      workDate: dateStr,
    });
  };

  const handleFillDayForAll = () => {
    if (editingCell) setIsFillingDay((isActive) => !isActive);
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
    currentDate,
    setCurrentDate,
    isBottomSheetOpen,
    isFillingDay,
    isExportOpen,
    selectedCell: editingCell,
    selectedDate,
    activeEmployees,
    colorMap,
    weekPeriod,
    weekLabel,
    monthLabel,
    isLoading: isLoadingEmployees,
    bottomSheetTitle,
    registerNavigateHandler,
    handleOpenExport,
    handleCloseExport,
    handlePrev,
    handleNext,
    handleResetToCurrent,
    handleCellPress,
    handleClose,
    handleStatusSelect,
    handleFillDayForAll,
    handleClearCell,
  };
}
