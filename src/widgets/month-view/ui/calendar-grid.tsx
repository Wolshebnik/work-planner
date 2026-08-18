import dayjs from 'dayjs';
import { View } from 'react-native';

import { type CalendarDay } from '@/entities/calendar';

import { CalendarCell } from './calendar-cell';

interface CalendarGridProps {
  days: CalendarDay[];
  selectedDate: dayjs.Dayjs | null;
  onDayPress: (day: dayjs.Dayjs) => void;
}

export function CalendarGrid({
  days,
  selectedDate,
  onDayPress,
}: CalendarGridProps) {
  const weeks = [];

  for (let i = 0; i < days.length; i += 7) {
    weeks.push(days.slice(i, i + 7));
  }

  return (
    <View className='gap-2'>
      {weeks.map((week, weekIndex) => (
        <View key={weekIndex} className='flex-row justify-between'>
          {week.map((day) => (
            <CalendarCell
              key={day.date.toISOString()}
              day={day}
              isSelected={selectedDate?.isSame(day.date, 'day') ?? false}
              onPress={() => onDayPress(day.date)}
            />
          ))}
        </View>
      ))}
    </View>
  );
}
