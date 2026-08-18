import { View } from 'react-native';

import { cn } from '@/shared/lib/cn';
import { Text } from '@/shared/ui/text';

import type { WeekDay } from '../model/types';

interface ScheduleDayProps {
  day: WeekDay;
  className?: string;
}

export function ScheduleDay({ day, className }: ScheduleDayProps) {
  return (
    <View className={cn('items-center justify-center gap-1', className)}>
      <Text
        className={cn(
          'text-[12px] leading-4',
          day.isToday ? 'text-button font-medium' : 'text-text font-medium',
        )}
      >
        {day.label}
      </Text>
      <Text
        style={day.isToday ? { fontFamily: 'RobotoFlex_700Bold' } : {}}
        className={cn(
          'text-[14px] leading-4',
          day.isToday ? 'text-button font-bold' : 'text-text font-bold',
        )}
      >
        {day.number}
      </Text>
    </View>
  );
}
