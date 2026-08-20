import { memo, useMemo } from 'react';

import type dayjs from 'dayjs';
import { View } from 'react-native';

import { generateCalendarDays } from '@/entities/calendar';
import { cn } from '@/shared/lib/cn';

import type { DayEmployeeStats } from '../model/types';
import { CalendarGrid } from './calendar-grid';
import { CalendarHeader } from './calendar-header';

interface CalendarProps {
  className?: string;
  onDayPress?: (day: dayjs.Dayjs) => void;
  selectedDate?: dayjs.Dayjs | null;
  startDate: dayjs.Dayjs;
  statsByDate?: Map<string, DayEmployeeStats>;
}

export const Calendar = memo(function Calendar({
  startDate,
  className,
  statsByDate,
  selectedDate,
  onDayPress,
}: CalendarProps) {
  const days = useMemo(() => generateCalendarDays(startDate), [startDate]);

  return (
    <View className={cn('px-4 py-4', className)}>
      <CalendarHeader />
      <CalendarGrid
        days={days}
        selectedDate={selectedDate}
        statsByDate={statsByDate}
        onDayPress={onDayPress}
      />
    </View>
  );
});
