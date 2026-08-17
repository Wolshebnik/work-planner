import { View } from 'react-native';

import { cn } from '@/shared/lib/cn';
import { Text } from '@/shared/ui/text';

export function CalendarHeader() {
  return (
    <View className='flex-row justify-between pb-3 mb-3 border-b border-border'>
      {['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Нд'].map((label, i) => (
        <View key={label + i} className='flex-1 items-center'>
          <Text
            className={cn(
              'text-[12px] text-text/60',
              (i === 5 || i === 6) && 'text-danger',
            )}
          >
            {label}
          </Text>
        </View>
      ))}
    </View>
  );
}
