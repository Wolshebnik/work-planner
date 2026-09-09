import type dayjs from 'dayjs';
import { View } from 'react-native';

import { type CalendarDay } from '@/entities/calendar';

import type { DayEmployeeStats } from '../model/types';
import { CalendarCell } from './calendar-cell';

interface CalendarGridProps {
  days: CalendarDay[];
  mismatchDates?: ReadonlySet<string>;
  onDayPress?: (day: dayjs.Dayjs) => void;
  selectedDate?: dayjs.Dayjs | null;
  statsByDate?: Map<string, DayEmployeeStats>;
}

export function CalendarGrid({
  days,
  mismatchDates,
  onDayPress,
  selectedDate,
  statsByDate,
}: CalendarGridProps) {
  const weeks: CalendarDay[][] = [];

  for (let index = 0; index < days.length; index += 7) {
    weeks.push(days.slice(index, index + 7));
  }

  return (
    <View className='gap-2'>
      {weeks.map((week, weekIndex) => (
        <View key={weekIndex} className='flex-row justify-between'>
          {week.map((day) => (
            <CalendarCell
              key={day.date.toISOString()}
              day={day}
              isMismatch={mismatchDates?.has(day.date.format('YYYY-MM-DD'))}
              isSelected={selectedDate?.isSame(day.date, 'day') ?? false}
              stats={statsByDate?.get(day.date.format('YYYY-MM-DD'))}
              onPress={onDayPress}
            />
          ))}
        </View>
      ))}
    </View>
  );
}
