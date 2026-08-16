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
  size?: number;
}

export function Avatar({
  initials,
  color = defaultAvatarColor,
  className,
  size = 40,
}: AvatarProps) {
  return (
    <View
      className={cn(
        'items-center justify-center rounded-full shrink-0',
        className,
      )}
      style={{
        backgroundColor: color.backgroundColor,
        width: size,
        height: size,
      }}
    >
      <Text
        className='font-bold'
        style={{
          color: color.textColor,
          fontSize: size / 2.5,
          lineHeight: size / 2.5,
        }}
      >
        {initials}
      </Text>
    </View>
  );
}
