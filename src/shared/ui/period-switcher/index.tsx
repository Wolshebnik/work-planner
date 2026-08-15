import { View, Pressable } from 'react-native';

import { cn } from '@/shared/lib/cn';
import { Text } from '@/shared/ui/text';
import { Chevron, Calendar } from '@/assets/svg';

interface PeriodSwitcherProps {
  week?: string;
  month?: string;
  className?: string;
  weekPeriod?: string;
  onNextPress?: () => void;
  onCalendarPress?: () => void;
  onPreviousPress?: () => void;
}

export function PeriodSwitcher({
  weekPeriod,
  week,
  month,
  onCalendarPress,
  onNextPress,
  onPreviousPress,
  className,
}: PeriodSwitcherProps) {
  const isWeek = weekPeriod !== undefined && week !== undefined;

  if (!isWeek && month === undefined) {
    return null;
  }

  return (
    <View
      className={cn(
        'relative mx-4 mt-2 rounded-8 border border-border bg-[#F5F5F5] px-2 py-2.5 shadow-card',
        className,
      )}
    >
      <View className='h-16 flex-row items-center justify-between'>
        <Pressable
          accessibilityLabel='Попередній період'
          accessibilityRole='button'
          className='h-11 w-8 items-center justify-center active:scale-[1.1]'
          hitSlop={8}
          onPress={onPreviousPress}
        >
          <Chevron className='rotate-180 text-primary' height={24} width={16} />
        </Pressable>

        <View className='flex-row items-center justify-center gap-1'>
          <Pressable
            accessibilityLabel='Обрати дату'
            accessibilityRole='button'
            className='h-10 w-10 items-center justify-center active:scale-[1.1]'
            hitSlop={8}
            onPress={onCalendarPress}
          >
            <Calendar className='text-primary' height={24} width={24} />
          </Pressable>

          {isWeek && (
            <View className='flex-col items-center justify-center'>
              <Text
                adjustsFontSizeToFit
                className='text-center font-bold leading-[24px] text-primary'
                minimumFontScale={0.7}
                numberOfLines={1}
              >
                {weekPeriod}
              </Text>

              <Text className='font-medium text-[12px] leading-[16px]'>
                {week}
              </Text>
            </View>
          )}

          {month && (
            <Text className='text-center font-bold text-[20px] leading-[24px] text-primary'>
              {month}
            </Text>
          )}
        </View>

        <Pressable
          accessibilityLabel='Наступний період'
          accessibilityRole='button'
          className='h-11 w-8 items-center justify-center active:scale-[1.1]'
          hitSlop={8}
          onPress={onNextPress}
        >
          <Chevron className='text-primary' height={24} width={16} />
        </Pressable>
      </View>
    </View>
  );
}
