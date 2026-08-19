import { memo, useMemo } from 'react';

import type dayjs from 'dayjs';
import { View } from 'react-native';

import { type CalendarDay } from '@/entities/calendar';

import type { DayEmployeeStats } from '../model/types';
import { CalendarCell } from './calendar-cell';

interface CalendarGridProps {
  days: CalendarDay[];
  onDayPress: (day: dayjs.Dayjs) => void;
  selectedDate: dayjs.Dayjs | null;
  statsByDate?: Map<string, DayEmployeeStats>;
}

export const CalendarGrid = memo(function CalendarGrid({
  days,
  selectedDate,
  statsByDate,
  onDayPress,
}: CalendarGridProps) {
  const weeks = useMemo(() => {
    const result = [];
    for (let i = 0; i < days.length; i += 7) {
      result.push(days.slice(i, i + 7));
    }
    return result;
  }, [days]);

  return (
    <View className='gap-2'>
      {weeks.map((week, weekIndex) => (
        <View key={weekIndex} className='flex-row justify-between'>
          {week.map((day) => (
            <CalendarCell
              key={day.date.toISOString()}
              day={day}
              isSelected={selectedDate?.isSame(day.date, 'day') ?? false}
              stats={statsByDate?.get(day.date.format('YYYY-MM-DD'))}
              onPress={onDayPress}
            />
          ))}
        </View>
      ))}
    </View>
  );
});
