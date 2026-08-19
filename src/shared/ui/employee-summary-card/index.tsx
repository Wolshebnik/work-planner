import { View } from 'react-native';

import type { AvatarColor } from '@/shared/config/avatar-color';
import { cn } from '@/shared/lib/cn';
import { Avatar } from '@/shared/ui/avatar';
import { Text } from '@/shared/ui/text';

interface EmployeeSummaryCardProps {
  avatarColor?: AvatarColor;
  className?: string;
  initials: string;
  monthTotal: string | number;
  name: string;
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
              className='h-6 min-w-7.5 px-1 items-center justify-center rounded-6 bg-neutral'
            >
              <Text
                className={cn(
                  'font-medium text-primary text-center',
                  String(value).length > 3
                    ? 'text-[9px] leading-[13px]'
                    : 'text-[11px] leading-[16px]',
                )}
                numberOfLines={1}
                adjustsFontSizeToFit
              >
                {value}
              </Text>
            </View>
          ))}
        </View>
      </View>

      <View className='my-3 h-12.25 min-w-16 px-1.5 shrink-0 items-center justify-center rounded-12 bg-blue-light/70'>
        <Text className='font-bold text-[9px] leading-[13.5px]'>МІСЯЦЬ</Text>
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
  );
}
