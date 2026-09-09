import { memo, useMemo } from 'react';

import type dayjs from 'dayjs';
import { View } from 'react-native';

import type { Employee } from '@/entities/employee';
import { useScheduleByWeek } from '@/entities/schedule';
import { CircularProgressLoader } from '@/shared/ui/circular-progress-loader';
import { ScheduleGrid } from '@/widgets/schedule-grid';

import { buildScheduleWeeklyData } from '../../model/week/build-schedule-weekly-data';
import { useScheduleWeekMismatches } from '../../model/week/use-schedule-week-mismatches';

interface ScheduleWeekContentProps {
  activeEmployees: Employee[];
  date: dayjs.Dayjs;
  onCellPress: (employeeIndex: number, dayIndex: number) => void;
  selectedCell: {
    dayIndex: number;
    employeeIndex: number;
  } | null;
  selectedDate?: dayjs.Dayjs | null;
}

export const ScheduleWeekContent = memo(function ScheduleWeekContent({
  date,
  activeEmployees,
  selectedCell,
  selectedDate,
  onCellPress,
}: ScheduleWeekContentProps) {
  const { data: scheduleEntries = [], isPending } = useScheduleByWeek(date);
  const startOfWeek = date.startOf('isoWeek');

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
    <ScheduleGrid
      className='mb-5'
      startDate={date}
      data={weeklyData}
      mismatchKeys={mismatchKeys}
      selectedCell={selectedCell}
      selectedDate={selectedDate}
      onCellPress={onCellPress}
    />
  );
});
