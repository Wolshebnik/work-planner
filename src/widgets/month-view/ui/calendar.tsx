import { useState } from 'react';

import dayjs from 'dayjs';
import { View } from 'react-native';

import { cn } from '@/shared/lib/cn';
import { Text } from '@/shared/ui/text';
import { BottomSheet } from '@/shared/ui/bottom-sheet';
import { generateCalendarDays } from '@/entities/calendar/model';

import { CalendarCell } from './calendar-cell/calendar-cell';

interface CalendarProps {
  className?: string;
  startDate: dayjs.Dayjs;
}

export function Calendar({ startDate, className }: CalendarProps) {
  const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<dayjs.Dayjs | null>(null);

  const days = generateCalendarDays(startDate);

  const weeks = [];
  for (let i = 0; i < days.length; i += 7) {
    weeks.push(days.slice(i, i + 7));
  }

  const handleDayPress = (day: dayjs.Dayjs) => {
    setSelectedDate(day);
    setIsBottomSheetOpen(true);
  };

  return (
    <View className={cn('px-4 py-4', className)}>
      <View className='flex-row justify-between pb-3 mb-3 border-b border-border'>
        {['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Нд'].map((label, i) => (
          <View key={label + i} className='flex-1 items-center'>
            <Text
              className={cn(
                'text-[12px] text-text/60',
                (i === 5 || i === 6) && 'text-danger',
              )}
            >
              {label}
            </Text>
          </View>
        ))}
      </View>
      <View className='gap-2'>
        {weeks.map((week, weekIndex) => (
          <View key={weekIndex} className='flex-row justify-between'>
            {week.map((day) => (
              <CalendarCell
                key={day.date.toISOString()}
                day={day}
                isSelected={selectedDate?.isSame(day.date, 'day') ?? false}
                onPress={() => handleDayPress(day.date)}
              />
            ))}
          </View>
        ))}
      </View>

      <BottomSheet
        isOpen={isBottomSheetOpen}
        title={selectedDate ? selectedDate.format('D MMMM') : 'Деталі зміни'}
        onClose={() => {
          setIsBottomSheetOpen(false);
          setSelectedDate(null);
        }}
      >
        <Text>На {selectedDate?.format('D MMMM')} наразі немає даних.</Text>
      </BottomSheet>
    </View>
  );
}
