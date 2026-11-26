
import { useCallback, useMemo, useRef, useState } from 'react';

import dayjs from 'dayjs';
import weekOfYear from 'dayjs/plugin/weekOfYear';

import {
  isEmployeeScheduleDateLocked,
  isEmployeeVisibleOnDate,
  useGetEmployees,
} from '@/entities/employee';
import {
  useClearScheduleEntry,
  useSetScheduleEntry,
} from '@/entities/schedule';
import { type ScheduleStatus } from '@/entities/schedule-status';
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
    employeeId: string;
  } | null>(null);
  const [blockedMessage, setBlockedMessage] = useState<string | null>(null);
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

  const screenshotHandlerRef = useRef<(() => void | Promise<void>) | null>(null);
  const [isExportingScreenshot, setIsExportingScreenshot] = useState(false);

  const registerScreenshotHandler = useCallback(
    (handler: (() => void | Promise<void>) | null) => {
      screenshotHandlerRef.current = handler;
    },
    [],
  );

  const handleExportScreenshot = useCallback(async () => {
    if (screenshotHandlerRef.current) {
      await screenshotHandlerRef.current();
    }
  }, []);

  const { data: employees = [], isLoading: isLoadingEmployees } =
    useGetEmployees();

  const setScheduleEntryMutation = useSetScheduleEntry();
  const clearScheduleEntryMutation = useClearScheduleEntry();

  const startOfWeek = currentDate.startOf('isoWeek');

  const handleCellPress = useCallback(
    (employeeId: string | undefined, employeeIndex: number, dayIndex: number) => {
      if (!employeeId) return;
      const clickedDate = startOfWeek.add(dayIndex, 'day');
      const employee = employees.find((item) => item.id === employeeId);

      if (!employee) return;

      setSelectedDate(clickedDate);
      setEditingCell({ employeeId, employeeIndex, dayIndex });
      setIsFillingDay(false);
      setBlockedMessage(null);

      if (!isEmployeeVisibleOnDate(employee, clickedDate.format('YYYY-MM-DD'))) {
        setBlockedMessage('Працівник не відображається в цьому періоді.');
      }

      if (isEmployeeScheduleDateLocked(employee, clickedDate.format('YYYY-MM-DD'))) {
        setBlockedMessage('Дані працівника за цей день не можна змінювати.');
      }

      setIsBottomSheetOpen(true);
    },
    [employees, startOfWeek],
  );

  const handleClose = useCallback(() => {
    setIsBottomSheetOpen(false);
    setEditingCell(null);
    setIsFillingDay(false);
    setBlockedMessage(null);
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

    if (blockedMessage) return;

    setIsBottomSheetOpen(false);
    setEditingCell(null);
    setIsFillingDay(false);

    if (isFillingDay) {
      const eligibleEmployees = activeEmployees.filter(
        (employee) => !isEmployeeScheduleDateLocked(employee, dateStr),
      );

      if (eligibleEmployees.length < activeEmployees.length) {
        setBlockedMessage('Архівованих працівників не змінено.');
      }

      eligibleEmployees.forEach((employee) => {
        setScheduleEntryMutation.mutate({
          employeeId: employee.id,
          workDate: dateStr,
          statusId: status.id,
          status,
        });
      });

      if (eligibleEmployees.length < activeEmployees.length) {
        setIsBottomSheetOpen(true);
      }

      return;
    }

    const employee = employees.find((item) => item.id === editingCell.employeeId);
    if (!employee) return;
    if (isEmployeeScheduleDateLocked(employee, dateStr)) return;

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

    if (blockedMessage) return;

    setIsBottomSheetOpen(false);
    setEditingCell(null);
    setIsFillingDay(false);

    if (isFillingDay) {
      const eligibleEmployees = activeEmployees.filter(
        (employee) => !isEmployeeScheduleDateLocked(employee, dateStr),
      );

      if (eligibleEmployees.length < activeEmployees.length) {
        setBlockedMessage('Архівованих працівників не змінено.');
      }

      eligibleEmployees.forEach((employee) => {
        clearScheduleEntryMutation.mutate({
          employeeId: employee.id,
          workDate: dateStr,
        });
      });

      if (eligibleEmployees.length < activeEmployees.length) {
        setIsBottomSheetOpen(true);
      }

      return;
    }

    const employee = employees.find((item) => item.id === editingCell.employeeId);
    if (!employee) return;
    if (isEmployeeScheduleDateLocked(employee, dateStr)) return;

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
    if (blockedMessage) return 'Дані недоступні для змін';
    const employee = employees.find((item) => item.id === editingCell.employeeId);
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
    isExportingScreenshot,
    setIsExportingScreenshot,
    registerScreenshotHandler,
    handleExportScreenshot,
    selectedCell: editingCell,
    selectedDate,
    activeEmployees,
    employees,
    colorMap,
    weekPeriod,
    weekLabel,
    monthLabel,
    isLoading: isLoadingEmployees,
    bottomSheetTitle,
    blockedMessage,
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
