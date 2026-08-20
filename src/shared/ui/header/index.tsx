import type { ReactNode } from 'react';
import { Pressable, View } from 'react-native';

import { ArrowLeft } from '@/assets/svg';
import type { AvatarColor } from '@/shared/config/avatar-color';
import { cn } from '@/shared/lib/cn';
import { Avatar } from '@/shared/ui/avatar';
import { Text } from '@/shared/ui/text';

interface HeaderProps {
  className?: string;
  onBackPress?: () => void;
  title: string;
  showAvatar?: boolean;
  avatarUrl?: string;
  avatarInitials?: string;
  avatarColor?: AvatarColor;
  onAvatarPress?: () => void;
  rightAction?: ReactNode;
}

export function Header({
  title,
  onBackPress,
  showAvatar,
  avatarUrl,
  avatarInitials,
  avatarColor,
  onAvatarPress,
  rightAction,
  className,
}: HeaderProps) {
  const shouldShowAvatar =
    showAvatar !== undefined ? showAvatar : !onBackPress || Boolean(onAvatarPress);

  return (
    <View
      className={cn(
        'h-14 items-center justify-center border-b border-border bg-neutral px-16 shadow-card',
        className,
      )}
    >
      {onBackPress ? (
        <Pressable
          accessibilityLabel='Назад'
          accessibilityRole='button'
          className='absolute items-center justify-center left-4 h-11 w-11 rounded-6 active:scale-[1.1]'
          hitSlop={8}
          onPress={onBackPress}
        >
          <ArrowLeft className='text-primary' height={24} width={24} />
        </Pressable>
      ) : null}

      <Text
        adjustsFontSizeToFit
        className='font-bold text-[22px] text-primary'
        minimumFontScale={0.65}
        numberOfLines={1}
      >
        {title}
      </Text>

      {rightAction ? (
        <View className='absolute right-4 items-center justify-center'>
          {rightAction}
        </View>
      ) : shouldShowAvatar ? (
        <Pressable
          accessibilityLabel='Аватар'
          accessibilityRole='button'
          className='absolute items-center justify-center right-4 h-11 w-11 rounded-full active:scale-[1.05]'
          hitSlop={8}
          onPress={onAvatarPress}
        >
          <Avatar
            className='border border-border'
            color={
              avatarColor ?? {
                backgroundColor: '#FFFFFF',
                textColor: '#004B71',
              }
            }
            imageUri={avatarUrl}
            initials={avatarInitials}
            size={36}
          />
        </Pressable>
      ) : null}
    </View>
  );
}
