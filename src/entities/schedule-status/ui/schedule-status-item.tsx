import { TouchableOpacity, View } from 'react-native';

import { Lock, Trash } from '@/assets/svg';
import { cn } from '@/shared/lib/cn';
import { HexStatusBadge } from '@/shared/ui/hex-status-badge';
import { Text } from '@/shared/ui/text';

interface ScheduleStatusItemProps {
  className?: string;
  color?: string | null;
  description: string;
  isLocked?: boolean;
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
  isLocked,
  onPress,
  onDelete,
  className,
}: ScheduleStatusItemProps) {
  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={onPress}
      className={cn(
        'flex-row items-center gap-3 rounded-12 border border-primary bg-white px-4 py-2 shadow-card',
        className,
      )}
    >
      <HexStatusBadge color={color} className='w-10 h-10'>
        {isLocked ? <Lock className='text-white' /> : status}
      </HexStatusBadge>

      <View className='flex-1 gap-1'>
        <Text
          className='font-semibold text-[16px] leading-[22px] text-primary'
          numberOfLines={1}
        >
          {title}
        </Text>
        <Text
          className='text-[14px] leading-[18px] text-grey'
          numberOfLines={1}
        >
          {description}
        </Text>
      </View>

      {onDelete && (
        <TouchableOpacity onPress={onDelete} className='p-2'>
          <Trash className='text-danger' />
        </TouchableOpacity>
      )}
    </TouchableOpacity>
  );
}
