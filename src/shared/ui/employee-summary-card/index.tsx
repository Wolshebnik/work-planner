import { useState } from 'react';

import { Pressable, View, type LayoutChangeEvent } from 'react-native';

import type { AvatarColor } from '@/shared/config/avatar-color';
import { cn } from '@/shared/lib/cn';
import { Avatar } from '@/shared/ui/avatar';
import { Text } from '@/shared/ui/text';

import { getWeeklyChipMetrics } from './get-weekly-chip-metrics';

interface EmployeeSummaryCardProps {
  avatarColor?: AvatarColor;
  cashTotal?: string | number;
  className?: string;
  initials: string;
  monthTotal: string | number;
  name: string;
  onCashPress?: () => void;
  weekLabels: readonly string[];
  values: readonly (string | number)[];
}

export function EmployeeSummaryCard({
  initials,
  name,
  avatarColor,
  values,
  monthTotal,
  cashTotal = 0,
  onCashPress,
  weekLabels,
  className,
}: EmployeeSummaryCardProps) {
  const [weeklyRowWidth, setWeeklyRowWidth] = useState(0);
  const weeklyChipMetrics = getWeeklyChipMetrics(values.length, weeklyRowWidth);

  const handleWeeklyRowLayout = ({
    nativeEvent: { layout },
  }: LayoutChangeEvent) => {
    setWeeklyRowWidth((previousWidth) =>
      previousWidth === layout.width ? previousWidth : layout.width,
    );
  };

  return (
    <View
      className={cn(
        'h-34 flex-row justify-between items-center rounded-12 border border-border bg-white px-3 shadow-card',
        className,
      )}
    >
      <Avatar initials={initials} color={avatarColor} />

      <View className='gap-1 flex-1 min-w-0 px-1.5'>
        <Text className='font-bold text-[20px] leading-[26px]' numberOfLines={1}>
          {name}
        </Text>

        <View
          className={cn(
            'flex-row',
            weeklyChipMetrics.isCompact ? 'gap-0.5' : 'gap-0.75',
          )}
          onLayout={handleWeeklyRowLayout}
        >
          {values.map((value, index) => (
            <View key={`${value}-${index}`} className='flex-1 min-w-0 items-center'>
              <View
                className='w-full items-center justify-center rounded-6 bg-neutral'
                style={{
                  height: weeklyChipMetrics.chipHeight,
                  paddingHorizontal: weeklyChipMetrics.chipPadding,
                }}
              >
                <Text
                  className='font-medium text-primary text-center'
                  style={{
                    fontSize: weeklyChipMetrics.valueFontSize,
                    lineHeight: weeklyChipMetrics.valueLineHeight,
                  }}
                  numberOfLines={1}
                  adjustsFontSizeToFit
                  minimumFontScale={0.7}
                >
                  {value}
                </Text>
                <Text
                  className='text-primary text-center'
                  style={{
                    fontSize: weeklyChipMetrics.labelFontSize,
                    lineHeight: weeklyChipMetrics.labelLineHeight,
                  }}
                  numberOfLines={1}
                  adjustsFontSizeToFit
                  minimumFontScale={0.6}
                >
                  {weekLabels[index]}
                </Text>
              </View>
            </View>
          ))}
        </View>
      </View>

      <View className='my-3 flex-col shrink-0 items-center overflow-hidden rounded-12'>
        <Pressable
          onPress={onCashPress}
          className='h-12.25 min-w-17 px-1.5 items-center justify-center rounded-t-12 rounded-b-none bg-[#FEF3D6] active:opacity-80'
        >
          <Text className='font-bold text-[9px] leading-[13.5px] text-[#8A5E00]'>
            КАСА
          </Text>
          <Text
            className={cn(
              'font-bold text-[#8A5E00] text-center',
              String(cashTotal).length > 4
                ? 'text-[12px] leading-[16px]'
                : 'text-[16px] leading-[20px]',
            )}
            numberOfLines={1}
            adjustsFontSizeToFit
          >
            {cashTotal}
          </Text>
        </Pressable>

        <View className='h-12.25 min-w-17 px-1.5 items-center justify-center rounded-b-12 rounded-t-none bg-blue-light/70'>
          <Text className='font-bold text-[9px] leading-[13.5px] text-primary'>
            МІСЯЦЬ
          </Text>
          <Text
            className={cn(
              'font-bold text-primary text-center',
              String(monthTotal).length > 4
                ? 'text-[12px] leading-[16px]'
                : 'text-[16px] leading-[20px]',
            )}
            numberOfLines={1}
            adjustsFontSizeToFit
          >
            {monthTotal}
          </Text>
        </View>
      </View>
    </View>
  );
}
