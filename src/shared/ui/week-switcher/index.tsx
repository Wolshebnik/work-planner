import { View, Pressable } from 'react-native';

import { cn } from '@/shared/lib/cn';
import { Text } from '@/shared/ui/text';
import { Chevron, Calendar } from '@/assets/svg';

interface WeekSwitcherProps {
  week: string;
  period: string;
  className?: string;
  onNextPress?: () => void;
  onCalendarPress?: () => void;
  onPreviousPress?: () => void;
}

export function WeekSwitcher({
  period,
  week,
  onCalendarPress,
  onNextPress,
  onPreviousPress,
  className,
}: WeekSwitcherProps) {
  return (
    <View
      className={cn(
        'relative mx-4 mt-2 rounded-8 border border-border bg-[#F5F5F5] px-2 py-2.5',
        className,
      )}
    >
      <View className='h-16 flex-row items-center justify-between'>
        <Pressable
          accessibilityLabel='Попередній тиждень'
          accessibilityRole='button'
          className='h-11 w-8 items-center justify-center'
          hitSlop={8}
          onPress={onPreviousPress}
        >
          <Chevron className='rotate-180 text-primary' height={24} width={16} />
        </Pressable>

        <View className='flex-row items-center justify-center gap-2'>
          <Pressable
            accessibilityLabel='Обрати дату'
            accessibilityRole='button'
            className='h-10 w-10 items-center justify-center'
            hitSlop={8}
            onPress={onCalendarPress}
          >
            <Calendar className='text-primary' height={24} width={24} />
          </Pressable>

          <View className='flex-col items-center justify-center'>
            <Text
              adjustsFontSizeToFit
              className='text-center font-bold leading-[24px] text-primary'
              minimumFontScale={0.7}
              numberOfLines={1}
            >
              {period}
            </Text>

            <Text className='font-medium text-[12px] leading-[16px] text-[#40484F]'>
              {week}
            </Text>
          </View>
        </View>

        <Pressable
          accessibilityLabel='Наступний тиждень'
          accessibilityRole='button'
          className='h-11 w-8 items-center justify-center'
          hitSlop={8}
          onPress={onNextPress}
        >
          <Chevron className='text-primary' height={24} width={16} />
        </Pressable>
      </View>
    </View>
  );
}
