import { cn } from '@/shared/lib/cn';
import { StatusBadge } from '@/shared/ui/status-badge';
import { type ColorVariant } from '@/shared/config/color-variant';

import type { DayCell } from '../model';

interface ScheduleCellProps {
  value: DayCell;
  className?: string;
  onPress?: () => void;
}

const CELL_TO_VARIANT: Record<DayCell, ColorVariant> = {
  П: 'success',
  В: 'danger',
  '½': 'warning',
  lock: 'maroon',
};

export function ScheduleCell({ value, className, onPress }: ScheduleCellProps) {
  // Замок рендерим пустым StatusBadge (иконка вне ответственности этой задачи).
  const showContent = value !== 'lock';

  return (
    <StatusBadge
      variant={CELL_TO_VARIANT[value]}
      className={cn('h-8.5 w-8.5', className)}
      onPress={onPress}
    >
      {showContent ? value : undefined}
    </StatusBadge>
  );
}
