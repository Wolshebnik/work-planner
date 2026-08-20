import { memo, useCallback } from 'react';
import type dayjs from 'dayjs';
import { Pressable, View } from 'react-native';

import { OffPeople, WorkPeople } from '@/assets/svg';
import { type CalendarDay } from '@/entities/calendar';
import { cn } from '@/shared/lib/cn';
import { Text } from '@/shared/ui/text';

import type { DayEmployeeStats } from '../model/types';

interface CalendarCellProps {
  day: CalendarDay;
  isSelected: boolean;
  onPress?: (date: dayjs.Dayjs) => void;
  stats?: DayEmployeeStats;
}

export const CalendarCell = memo(function CalendarCell({
  day,
  isSelected,
  onPress,
  stats,
}: CalendarCellProps) {
  const hasData = stats && (stats.workingCount > 0 || stats.absentCount > 0);
  const handlePress = useCallback(() => onPress?.(day.date), [onPress, day.date]);

  return (
    <Pressable
      className={cn(
        'mx-0.5 h-18 flex-1 justify-between rounded-8 border border-[#b8c3cc] border-b-4 border-b-[#aeb8c0] bg-background px-1.5 pt-1.5 pb-1 shadow-card',

        !day.isCurrentMonth && 'opacity-35',

        day.isToday &&
          !isSelected &&
          'border-button border-b-button bg-button/20',

        isSelected && 'border-primary/20 border-b-primary/20 bg-primary/20',
      )}
      onPress={handlePress}
    >

      <Text
        className={cn(
          'pl-0.5 text-[10px] font-bold leading-none text-text',

          day.isToday && !isSelected && 'text-primary',

          isSelected && 'text-white',
        )}
      >
        {day.number}
      </Text>

      {hasData && (
        <View className='gap-1 pb-0.5'>
          <View className='h-4 flex-row items-center justify-between rounded-full border border-success/30 bg-success/15 px-1.5'>
            <Text className='font-bold text-[9.5px] leading-none text-success'>
              {stats.workingCount}
            </Text>
            <WorkPeople className='text-success' height={9.5} width={9.5} />
          </View>

          <View className='h-4 flex-row items-center justify-between rounded-full border border-danger/30 bg-danger/15 px-1.5'>
            <Text className='font-bold text-[9.5px] leading-none text-danger'>
              {stats.absentCount}
            </Text>
            <OffPeople className='text-danger' height={9.5} width={9.5} />
          </View>
        </View>
      )}
    </Pressable>
  );
});









