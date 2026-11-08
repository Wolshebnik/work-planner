import { memo, useEffect, useMemo } from 'react';

import type dayjs from 'dayjs';
import { View } from 'react-native';

import type { Employee } from '@/entities/employee';
import { useScheduleByWeek } from '@/entities/schedule';
import { useExportSummaryScreenshot } from '@/features/export-summary-screenshot';
import { CircularProgressLoader } from '@/shared/ui/circular-progress-loader';
import { ScheduleGrid } from '@/widgets/schedule-grid';

import { useScheduleSlotContext } from '../../model/context/schedule-slot-context';
import { getWeekPeriodLabel } from '../../model/navigation/get-schedule-period-labels';
import { buildScheduleWeeklyData } from '../../model/week/build-schedule-weekly-data';
import { useScheduleWeekMismatches } from '../../model/week/use-schedule-week-mismatches';

interface ScheduleWeekContentProps {
  activeEmployees: Employee[];
  date: dayjs.Dayjs;
  isCurrent: boolean;
  onCellPress: (employeeIndex: number, dayIndex: number) => void;
  selectedCell: {
    dayIndex: number;
    employeeIndex: number;
  } | null;
  selectedDate?: dayjs.Dayjs | null;
}

export const ScheduleWeekContent = memo(function ScheduleWeekContent({
  date,
  isCurrent,
  activeEmployees,
  selectedCell,
  selectedDate,
  onCellPress,
}: ScheduleWeekContentProps) {
  const { data: scheduleEntries = [], isPending } = useScheduleByWeek(date);
  const { exportRef, exportScreenshot, isExporting } =
    useExportSummaryScreenshot(
      `Поділитися графіком за ${getWeekPeriodLabel(date)}`,
    );
  const { registerScreenshotHandler, setIsExportingScreenshot } =
    useScheduleSlotContext();
  const startOfWeek = date.startOf('isoWeek');

  useEffect(() => {
    if (!isCurrent) {
      return;
    }

    setIsExportingScreenshot(isExporting);
  }, [isCurrent, isExporting, setIsExportingScreenshot]);

  useEffect(() => {
    if (!isCurrent) {
      return;
    }

    registerScreenshotHandler(exportScreenshot);

    return () => {
      registerScreenshotHandler(null);
    };
  }, [exportScreenshot, isCurrent, registerScreenshotHandler]);

  const weeklyData = useMemo(() => {
    return buildScheduleWeeklyData({
      activeEmployees,
      scheduleEntries,
      startOfWeek,
    });
  }, [activeEmployees, scheduleEntries, startOfWeek]);

  const { mismatchKeys } = useScheduleWeekMismatches({
    scheduleEntries,
    startOfWeek,
  });

  if (isPending && scheduleEntries.length === 0) {
    return (
      <View className='h-96 items-center justify-center'>
        <CircularProgressLoader size='large' />
      </View>
    );
  }

  return (
    <View ref={exportRef} collapsable={false}>
      <ScheduleGrid
        className='mb-5'
        startDate={date}
        data={weeklyData}
        mismatchKeys={mismatchKeys}
        selectedCell={selectedCell}
        selectedDate={selectedDate}
        onCellPress={onCellPress}
      />
    </View>
  );
});
