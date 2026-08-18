import { TouchableOpacity, View } from 'react-native';

import { Trash } from '@/assets/svg';
import { cn } from '@/shared/lib/cn';
import { HexStatusBadge } from '@/shared/ui/hex-status-badge';
import { Text } from '@/shared/ui/text';

interface ScheduleStatusItemProps {
  color?: string | null;
  description: string;
  onDelete?: () => void;
  onPress?: () => void;
  status: string;
  title: string;
}

export function ScheduleStatusItem({
  title,
  description,
  status,
  color,
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
      <HexStatusBadge color={color} className='w-10 h-10'>
        {status}
      </HexStatusBadge>

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
