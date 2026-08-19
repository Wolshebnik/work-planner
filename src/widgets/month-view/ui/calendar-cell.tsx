import { Pressable } from 'react-native';

import { type CalendarDay } from '@/entities/calendar';
import { cn } from '@/shared/lib/cn';
import { Text } from '@/shared/ui/text';

interface CalendarCellProps {
  day: CalendarDay;
  isSelected: boolean;
  onPress: () => void;
}

export function CalendarCell({ day, isSelected, onPress }: CalendarCellProps) {
  return (
    <Pressable
      className={cn(
        'relative mx-0.5 h-16 flex-1 rounded-8 border border-[#b8c3cc] border-b-4 border-b-[#aeb8c0] bg-background shadow-card',

        !day.isCurrentMonth && 'opacity-35',

        day.isToday &&
          !isSelected &&
          'border-button border-b-button bg-button/20',

        isSelected && 'border-primary/20 border-b-primary/20 bg-primary/20',
      )}
      onPress={onPress}
    >
      <Text
        className={cn(
          'absolute left-1.5 top-1.5 text-[9px] font-bold text-text',

          day.isToday && !isSelected && 'text-primary',

          isSelected && 'text-white',
        )}
      >
        {day.number}
      </Text>
    </Pressable>
  );
}
