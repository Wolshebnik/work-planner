import { View } from 'react-native';

import { cn } from '@/shared/lib/cn';
import { Text } from '@/shared/ui/text';
import type { AvatarColor } from '@/shared/config/avatar-color';

interface EmployeeSummaryCardProps {
  name: string;
  initials: string;
  className?: string;
  avatarColor: AvatarColor;
  monthTotal: string | number;
  values: readonly (string | number)[];
}

export function EmployeeSummaryCard({
  initials,
  name,
  avatarColor,
  values,
  monthTotal,
  className,
}: EmployeeSummaryCardProps) {
  return (
    <View
      className={cn(
        'mx-3 h-[75px] flex-row justify-between items-center rounded-12 border border-border bg-white px-3 shadow-card',
        className,
      )}
    >
      <View
        className='items-center justify-center flex-shrink-0 w-10 h-10 rounded-full'
        style={{ backgroundColor: avatarColor.backgroundColor }}
      >
        <Text
          className='font-bold text-[16px] leading-[24px]'
          style={{ color: avatarColor.textColor }}
        >
          {initials}
        </Text>
      </View>

      <View className='gap-1'>
        <Text className='font-bold text-[14px] leading-[20px]'>{name}</Text>

        <View className='flex-row gap-1'>
          {values.map((value, index) => (
            <View
              key={`${value}-${index}`}
              className='h-6 w-[30px] items-center justify-center rounded-6 bg-neutral'
            >
              <Text className='font-medium text-[11px] leading-[16px] text-primary'>
                {value}
              </Text>
            </View>
          ))}
        </View>
      </View>

      <View className='my-3 h-[49px] w-16 flex-shrink-0 items-center justify-center rounded-12 bg-blue-light'>
        <Text className='font-bold text-[9px] leading-[13.5px]'>МІСЯЦЬ</Text>
        <Text className='font-bold text-[17px] leading-[17px]'>
          {monthTotal}
        </Text>
      </View>
    </View>
  );
}
