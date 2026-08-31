import { Pressable, View } from 'react-native';

import type { AvatarColor } from '@/shared/config/avatar-color';
import { cn } from '@/shared/lib/cn';
import { Avatar } from '@/shared/ui/avatar';
import { Text } from '@/shared/ui/text';

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
  return (
    <View
      className={cn(
        'h-18.75 flex-row justify-between items-center rounded-12 border border-border bg-white px-3 shadow-card',
        className,
      )}
    >
      <Avatar initials={initials} color={avatarColor} />

      <View className='gap-1 flex-1 min-w-0 px-2.5'>
        <Text className='font-bold text-[14px] leading-[20px]' numberOfLines={1}>
          {name}
        </Text>

        <View className='flex-row gap-1'>
          {values.map((value, index) => (
            <View key={`${value}-${index}`} className='items-center'>
              <View className='h-6 min-w-7.5 px-1 items-center justify-center rounded-6 bg-neutral'>
                <Text className='font-medium text-[11px] leading-[16px] text-primary text-center'>
                  {value}
                </Text>
              </View>
              <Text className='text-[8px] leading-[11px] text-grey' numberOfLines={1}>
                {weekLabels[index]}
              </Text>
            </View>
          ))}
        </View>
      </View>

      <View className='my-3 flex-row shrink-0 items-center overflow-hidden rounded-12'>
        <Pressable
          onPress={onCashPress}
          className='h-12.25 min-w-14 px-1.5 items-center justify-center rounded-l-12 rounded-r-none bg-[#FEF3D6] active:opacity-80'
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

        <View className='h-12.25 min-w-14 px-1.5 items-center justify-center rounded-r-12 rounded-l-none bg-blue-light/70'>
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
