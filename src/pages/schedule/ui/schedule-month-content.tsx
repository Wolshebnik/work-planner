import { memo, useMemo } from 'react';

import type dayjs from 'dayjs';
import { View } from 'react-native';

import { generateCalendarDays } from '@/entities/calendar';
import type { Employee } from '@/entities/employee';
import {
  useScheduleByMonth,
  useScheduleMonths,
} from '@/features/get-schedule-by-month';
import type { AvatarColor } from '@/shared/config/avatar-color';
import { CircularProgressLoader } from '@/shared/ui/circular-progress-loader';
import { buildMonthEmployeeStats, Calendar } from '@/widgets/month-view';

interface ScheduleMonthContentProps {
  activeEmployees: Employee[];
  colorMap: Map<string, AvatarColor>;
  date: dayjs.Dayjs;
  isCurrentPage?: boolean;
}

export const ScheduleMonthContent = memo(function ScheduleMonthContent({
  date,
  activeEmployees,
  colorMap,
  isCurrentPage = true,
}: ScheduleMonthContentProps) {
  const gridMonthKeys = useMemo(() => {
    const days = generateCalendarDays(date);
    const set = new Set<string>();
    for (const d of days) {
      set.add(d.date.format('YYYY-MM'));
    }
    return Array.from(set);
  }, [date]);

  const {
    data: currentMonthEntries,
    isPending: isCurrentPending,
    isLoading: isCurrentLoading,
  } = useScheduleByMonth(date);

  const { data: scheduleEntries } = useScheduleMonths(gridMonthKeys);

  const statsByDate = useMemo(() => {
    const entries =
      scheduleEntries && scheduleEntries.length > 0
        ? scheduleEntries
        : (currentMonthEntries ?? []);
    return buildMonthEmployeeStats(activeEmployees, entries);
  }, [activeEmployees, scheduleEntries, currentMonthEntries]);

  if (isCurrentPending || isCurrentLoading || !currentMonthEntries) {
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
      colorMap={colorMap}
      isCurrentPage={isCurrentPage}
    />
  );
});
