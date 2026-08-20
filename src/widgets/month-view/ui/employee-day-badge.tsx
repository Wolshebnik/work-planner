import { View } from 'react-native';

import { Lock } from '@/assets/svg';
import type { Employee } from '@/entities/employee';
import { isWorkStatus } from '@/entities/schedule';
import type { ScheduleStatus } from '@/entities/schedule-status';
import type { AvatarColor } from '@/shared/config/avatar-color';
import { cn } from '@/shared/lib/cn';
import { Avatar } from '@/shared/ui/avatar';
import { Text } from '@/shared/ui/text';

export interface EmployeeDayBadgeProps {
  className?: string;
  color?: AvatarColor;
  employee: Employee;
  status?: ScheduleStatus | null;
}

function StatusIndicator({ status }: { status: ScheduleStatus }) {
  if (status.is_locked) {
    return (
      <View className='flex-row items-center gap-1'>
        <Text className='text-[13px] text-grey'>·</Text>
        <Lock
          color={status.color ?? undefined}
          className={status.color ? undefined : 'text-grey'}
          height={12}
          width={12}
        />
      </View>
    );
  }

  if (status.schedule_mark) {
    return (
      <View className='flex-row items-center gap-1'>
        <Text className='text-[13px] text-grey'>·</Text>
        <Text
          style={status.color ? { color: status.color } : undefined}
          className={cn('font-semibold text-[13px]', !status.color && 'text-grey')}
        >
          {status.schedule_mark}
        </Text>
      </View>
    );
  }

  return null;
}

export function EmployeeDayBadge({
  employee,
  status,
  color,
  className,
}: EmployeeDayBadgeProps) {
  const initials = [employee.last_name, employee.first_name]
    .filter(Boolean)
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  const isWorking = isWorkStatus(status?.excel_mark);

  return (
    <View
      className={cn(
        'flex-row items-center gap-2 rounded-12 border border-border/80 bg-white px-2.5 py-1.5 shadow-card',
        className,
      )}
    >
      <Avatar initials={initials} color={color} size={28} />

      <Text className='font-semibold text-[13px] text-primary'>
        {employee.last_name}
      </Text>

      {!isWorking && status && <StatusIndicator status={status} />}
    </View>
  );
}
