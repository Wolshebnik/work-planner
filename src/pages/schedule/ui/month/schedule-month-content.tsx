import { memo, useCallback, useMemo } from 'react';

import type dayjs from 'dayjs';
import { View } from 'react-native';

import { generateCalendarDays } from '@/entities/calendar';
import type { Employee } from '@/entities/employee';
import { useScheduleMonths } from '@/entities/schedule';
import { CircularProgressLoader } from '@/shared/ui/circular-progress-loader';
import { buildMonthEmployeeStats, Calendar, type DayEmployeeStats } from '@/widgets/month-view';

import { useScheduleMonthMismatches } from '../../model/month/use-schedule-month-mismatches';

interface ScheduleMonthContentProps {
  activeEmployees: Employee[];
  date: dayjs.Dayjs;
  isCurrentPage?: boolean;
  onDayPress?: (
    day: dayjs.Dayjs,
    statsByDate?: Map<string, DayEmployeeStats>,
  ) => void;
  selectedDate?: dayjs.Dayjs | null;
}

export const ScheduleMonthContent = memo(function ScheduleMonthContent({
  date,
  activeEmployees,
  selectedDate,
  onDayPress,
  isCurrentPage = true,
}: ScheduleMonthContentProps) {
  const days = generateCalendarDays(date);
  const gridMonthSet = new Set<string>();

  for (const d of days) {
    gridMonthSet.add(d.date.format('YYYY-MM'));
  }

  const gridMonthKeys = Array.from(gridMonthSet);

  const { data: scheduleEntries = [], isPending } =
    useScheduleMonths(gridMonthKeys);

  const statsByDate = useMemo(() => {
    return buildMonthEmployeeStats(activeEmployees, scheduleEntries);
  }, [activeEmployees, scheduleEntries]);

  const { mismatchDates } = useScheduleMonthMismatches({
    days,
    gridMonthKeys,
    scheduleEntries,
  });

  const handleCalendarDayPress = useCallback(
    (day: dayjs.Dayjs) => {
      if (!isCurrentPage) return;
      onDayPress?.(day, statsByDate);
    },
    [isCurrentPage, onDayPress, statsByDate],
  );

  if (isPending && scheduleEntries.length === 0) {
    return (
      <View className='h-96 items-center justify-center'>
        <CircularProgressLoader size='large' />
      </View>
    );
  }

  return (
    <Calendar
      startDate={date}
      statsByDate={statsByDate}
      mismatchDates={mismatchDates}
      selectedDate={selectedDate}
      onDayPress={handleCalendarDayPress}
    />
  );
});
