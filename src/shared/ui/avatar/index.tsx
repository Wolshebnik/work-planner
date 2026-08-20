import { Image, View } from 'react-native';

import { User } from '@/assets/svg';
import {
  defaultAvatarColor,
  type AvatarColor,
} from '@/shared/config/avatar-color';
import { cn } from '@/shared/lib/cn';
import { Text } from '@/shared/ui/text';

interface AvatarProps {
  initials?: string;
  imageUri?: string;
  color?: AvatarColor;
  className?: string;
  size?: number;
}

export function Avatar({
  initials,
  imageUri,
  color = defaultAvatarColor,
  className,
  size = 40,
}: AvatarProps) {
  if (imageUri) {
    return (
      <View
        className={cn(
          'items-center justify-center rounded-full shrink-0 overflow-hidden',
          className,
        )}
        style={{
          width: size,
          height: size,
        }}
      >
        <Image
          accessibilityRole='image'
          resizeMode='cover'
          source={{ uri: imageUri }}
          style={{ width: size, height: size }}
        />
      </View>
    );
  }

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
      {initials ? (
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
      ) : (
        <User
          color={color.textColor}
          height={size * 0.55}
          width={size * 0.55}
        />
      )}
    </View>
  );
}
