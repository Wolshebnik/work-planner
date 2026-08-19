import { View } from 'react-native';

import { cn } from '@/shared/lib/cn';
import { Text } from '@/shared/ui/text';

import type { WeekDay } from '../model/types';

interface ScheduleDayProps {
  day: WeekDay;
  className?: string;
  isSelected?: boolean;
}

export function ScheduleDay({ day, className, isSelected }: ScheduleDayProps) {
  const getLabelColorClass = () => {
    if (isSelected) {
      return 'text-primary font-semibold';
    }
    if (day.isToday) {
      return 'text-[#a16207] font-medium';
    }
    return 'text-text font-medium';
  };

  const getNumberColorClass = () => {
    if (isSelected) {
      return 'text-primary font-bold';
    }
    if (day.isToday) {
      return 'text-[#a16207] font-semibold';
    }
    return 'text-text font-bold';
  };

  const getNumberStyle = () => {
    if (isSelected) {
      return { fontFamily: 'RobotoFlex_800ExtraBold' };
    }
    if (day.isToday) {
      return { fontFamily: 'RobotoFlex_600SemiBold' };
    }
    return {};
  };

  return (
    <View className={cn('items-center justify-center gap-1', className)}>
      <Text className={cn('text-[12px] leading-4', getLabelColorClass())}>
        {day.label}
      </Text>
      <Text
        style={getNumberStyle()}
        className={cn('text-[14px] leading-4', getNumberColorClass())}
      >
        {day.number}
      </Text>
    </View>
  );
}

