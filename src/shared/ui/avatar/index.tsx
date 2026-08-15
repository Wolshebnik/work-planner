import { View } from 'react-native';

import {
  defaultAvatarColor,
  type AvatarColor,
} from '@/shared/config/avatar-color';
import { cn } from '@/shared/lib/cn';
import { Text } from '@/shared/ui/text';

interface AvatarProps {
  initials: string;
  color?: AvatarColor;
  className?: string;
}

export function Avatar({
  initials,
  color = defaultAvatarColor,
  className,
}: AvatarProps) {
  return (
    <View
      className={cn(
        'items-center justify-center w-10 h-10 rounded-full shrink-0',
        className,
      )}
      style={{ backgroundColor: color.backgroundColor }}
    >
      <Text
        className='font-bold text-[16px] leading-[24px]'
        style={{ color: color.textColor }}
      >
        {initials}
      </Text>
    </View>
  );
}
