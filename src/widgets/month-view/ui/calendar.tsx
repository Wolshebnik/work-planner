import type dayjs from 'dayjs';
import { View } from 'react-native';

import { generateCalendarDays } from '@/entities/calendar';
import { cn } from '@/shared/lib/cn';

import type { DayEmployeeStats } from '../model/types';
import { CalendarGrid } from './calendar-grid';
import { CalendarHeader } from './calendar-header';

interface CalendarProps {
  className?: string;
  mismatchDates?: ReadonlySet<string>;
  onDayPress?: (day: dayjs.Dayjs) => void;
  selectedDate?: dayjs.Dayjs | null;
  startDate: dayjs.Dayjs;
  statsByDate?: Map<string, DayEmployeeStats>;
}

export function Calendar({
  startDate,
  mismatchDates,
  className,
  statsByDate,
  selectedDate,
  onDayPress,
}: CalendarProps) {
  const days = generateCalendarDays(startDate);

  return (
    <View className={cn('px-4 py-4', className)}>
      <CalendarHeader />
      <CalendarGrid
        days={days}
        mismatchDates={mismatchDates}
        selectedDate={selectedDate}
        statsByDate={statsByDate}
        onDayPress={onDayPress}
      />
    </View>
  );
}
