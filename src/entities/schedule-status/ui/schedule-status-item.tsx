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
        'flex-row items-center gap-3 p-3 bg-white rounded-12 border border-border shadow-card',
        className,
      )}
    >
      <HexStatusBadge color={color} className='w-10 h-10'>
        {isLocked ? <Lock className='text-white' /> : status}
      </HexStatusBadge>

      <View className='flex-1'>
        <Text
          className='font-bold text-[14px] text-primary'
          numberOfLines={1}
        >
          {title}
        </Text>
        <Text
          className='text-[12px] text-grey'
          numberOfLines={1}
        >
          {description}
        </Text>
      </View>

      {onDelete && (
        <TouchableOpacity onPress={onDelete} className='p-1'>
          <Trash className='text-danger' />
        </TouchableOpacity>
      )}
    </TouchableOpacity>
  );
}
