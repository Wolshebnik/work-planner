import { memo } from 'react';
import { View } from 'react-native';

import { Lock } from '@/assets/svg';
import { cn } from '@/shared/lib/cn';
import { HexStatusBadge } from '@/shared/ui/hex-status-badge';

import type { DayCell } from '../model/types';

interface ScheduleCellProps {
  className?: string;
  isSelected?: boolean;
  onPress?: () => void;
  value?: DayCell | null;
}

export const ScheduleCell = memo(function ScheduleCell({
  value,
  className,
  onPress,
  isSelected,
}: ScheduleCellProps) {
  const isEmpty = !value || !value.color;
  const isLocked = !isEmpty && !!value.isLocked;

  return (
    <HexStatusBadge
      color={isEmpty ? 'transparent' : value.color}
      className={cn(
        'h-8.5 w-8.5',
        isSelected && 'ring-2 ring-primary ring-offset-1',
        isEmpty && 'shadow-none border border-primary',
        className,
      )}
      onPress={onPress}
    >
      {isLocked ? (
        <View className='items-center justify-center'>
          <Lock className='h-4 w-4 text-white' />
        </View>
      ) : (
        !isEmpty && value.scheduleMark
      )}
    </HexStatusBadge>
  );
});
