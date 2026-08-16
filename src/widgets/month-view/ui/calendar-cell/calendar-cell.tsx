import { Pressable } from 'react-native';
import { cn } from '@/shared/lib/cn';
import { Text } from '@/shared/ui/text';
import { type CalendarDay } from '@/entities/calendar/model';

interface CalendarCellProps {
  day: CalendarDay;
  isSelected: boolean;
  onPress: () => void;
}

export function CalendarCell({ day, isSelected, onPress }: CalendarCellProps) {
  return (
    <Pressable
      className={cn(
        'flex-1 h-16 border border-border rounded-8 mx-0.5 border-b-4 relative',
        !day.isCurrentMonth && 'opacity-40',
        day.isToday && !isSelected && 'border-button',
        isSelected && 'border-danger',
      )}
      onPress={onPress}
    >
      <Text
        className={cn(
          'absolute top-1 left-1 text-[8px] text-text font-bold',
          day.isToday && !isSelected && 'text-button',
          isSelected && 'text-danger',
        )}
      >
        {day.number}
      </Text>
    </Pressable>
  );
}
