import type { ReactNode } from 'react';
import { Pressable, View } from 'react-native';

import { ArrowLeft } from '@/assets/svg';
import { cn } from '@/shared/lib/cn';
import { Text } from '@/shared/ui/text';

interface HeaderProps {
  className?: string;
  onBackPress?: () => void;
  title: string;
  rightAction?: ReactNode;
}

export function Header({
  title,
  onBackPress,
  rightAction,
  className,
}: HeaderProps) {
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
      ) : null}
    </View>
  );
}
