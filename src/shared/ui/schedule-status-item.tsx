import { TouchableOpacity, View } from 'react-native';

import { Trash } from '@/assets/svg';
import { cn } from '@/shared/lib/cn';
import { StatusBadge } from '@/shared/ui/status-badge';
import { type BadgeVariant } from '@/shared/ui/status-badge/status-badge-appearance';
import { Text } from '@/shared/ui/text';

interface ScheduleStatusItemProps {
  description: string;
  onDelete?: () => void;
  onPress?: () => void;
  status: string;
  title: string;
  variant: BadgeVariant;
}

export function ScheduleStatusItem({
  title,
  description,
  status,
  variant,
  onPress,
  onDelete,
}: ScheduleStatusItemProps) {
  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={onPress}
      className={cn(
        'mx-4 mb-3 flex-row items-center gap-3 rounded-12 border border-primary bg-white/40 px-4 py-2 shadow-card',
      )}
    >
      <StatusBadge variant={variant} className='w-10 h-10'>
        {status}
      </StatusBadge>

      <View className='flex-1 gap-1'>
        <Text className='font-semibold text-[16px] text-primary'>{title}</Text>
        <Text className='text-[14px] text-grey'>{description}</Text>
      </View>

      {onDelete && (
        <TouchableOpacity onPress={onDelete} className='p-2'>
          <Trash className='text-danger' />
        </TouchableOpacity>
      )}
    </TouchableOpacity>
  );
}
