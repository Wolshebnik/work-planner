import { View, Pressable } from 'react-native';

import { cn } from '@/shared/lib/cn';
import { Text } from '@/shared/ui/text';
import { ArrowLeft } from '@/assets/svg';

interface HeaderProps {
  title: string;
  className?: string;
  onBackPress?: () => void;
}

export function Header({ title, onBackPress, className }: HeaderProps) {
  return (
    <View
      className={cn(
        'h-14 items-center justify-center border-b border-border bg-[#F2EDED] px-16 shadow-card',
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
    </View>
  );
}
