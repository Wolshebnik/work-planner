import { View } from 'react-native';

import { Lock } from '@/assets/svg';
import { cn } from '@/shared/lib/cn';
import { StatusBadge } from '@/shared/ui/status-badge';
import { EmployeeStatus, SHORT_TO_STATUS } from '@/shared/config/employee-status';

import type { DayCell } from '../model';

interface ScheduleCellProps {
  value: DayCell;
  className?: string;
  isSelected?: boolean;
  onPress?: () => void;
}

export function ScheduleCell({ value, className, onPress, isSelected }: ScheduleCellProps) {
  const statusKey = SHORT_TO_STATUS[value.short];
  const statusConfig = statusKey ? EmployeeStatus[statusKey] : undefined;
  const isLocked = !!value.isLocked;
  const isEmpty = !value.short || value.short === ''; // Определяем пустое состояние

  const displayShort = statusConfig?.short ?? value.short;
  
  // Если пусто, используем outline, иначе solid
  const appearance = isEmpty ? 'outline' : 'solid';
  const variant = statusConfig?.variant ?? 'primary'; 

  return (
    <StatusBadge
      variant={variant}
      appearance={appearance}
      className={cn(
        'h-8.5 w-8.5',
        isSelected && 'ring-2 ring-primary ring-offset-1',
        isEmpty && 'shadow-none', // Убираем тень для пустых ячеек
        className,
      )}
      onPress={() => {
        onPress?.();
      }}
    >
      {isLocked ? (
        <View className='items-center justify-center'>
          <Lock className='h-4 w-4 text-white' />
        </View>
      ) : (
        !isEmpty && displayShort
      )}
    </StatusBadge>
  );
}
