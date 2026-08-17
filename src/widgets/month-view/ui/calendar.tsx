import { useState } from 'react';

import dayjs from 'dayjs';
import { View } from 'react-native';

import { cn } from '@/shared/lib/cn';
import { Text } from '@/shared/ui/text';
import { BottomSheet } from '@/shared/ui/bottom-sheet';
import { generateCalendarDays } from '@/entities/calendar/model';

import { CalendarHeader } from './calendar-header';
import { CalendarGrid } from './calendar-grid';

interface CalendarProps {
  className?: string;
  startDate: dayjs.Dayjs;
}

export function Calendar({ startDate, className }: CalendarProps) {
  const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<dayjs.Dayjs | null>(null);

  const days = generateCalendarDays(startDate);

  const handleDayPress = (day: dayjs.Dayjs) => {
    setSelectedDate(day);
    setIsBottomSheetOpen(true);
  };

  return (
    <View className={cn('px-4 py-4', className)}>
      <CalendarHeader />
      <CalendarGrid
        days={days}
        selectedDate={selectedDate}
        onDayPress={handleDayPress}
      />

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
