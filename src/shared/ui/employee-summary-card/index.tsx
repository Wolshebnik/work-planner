import { View } from 'react-native';

import { cn } from '@/shared/lib/cn';
import { Text } from '@/shared/ui/text';
import { Avatar } from '@/shared/ui/avatar';
import type { AvatarColor } from '@/shared/config/avatar-color';

interface EmployeeSummaryCardProps {
  name: string;
  initials: string;
  className?: string;
  avatarColor?: AvatarColor;
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
        'h-18.75 flex-row justify-between items-center rounded-12 border border-border bg-white px-3 shadow-card',
        className,
      )}
    >
      <Avatar initials={initials} color={avatarColor} />

      <View className='gap-1'>
        <Text className='font-bold text-[14px] leading-[20px]'>{name}</Text>

        <View className='flex-row gap-1'>
          {values.map((value, index) => (
            <View
              key={`${value}-${index}`}
              className='h-6 w-7.5 items-center justify-center rounded-6 bg-neutral'
            >
              <Text className='font-medium text-[11px] leading-[16px] text-primary'>
                {value}
              </Text>
            </View>
          ))}
        </View>
      </View>

      <View className='my-3 h-12.25 w-16 shrink-0 items-center justify-center rounded-12 bg-blue-light'>
        <Text className='font-bold text-[9px] leading-[13.5px]'>МІСЯЦЬ</Text>
        <Text className='font-bold text-[17px] leading-4.25'>{monthTotal}</Text>
      </View>
    </View>
  );
}
