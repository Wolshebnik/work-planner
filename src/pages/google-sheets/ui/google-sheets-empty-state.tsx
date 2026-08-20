import { TouchableOpacity, View } from 'react-native';

import { Table } from '@/assets/svg';
import { Text } from '@/shared/ui/text';

interface GoogleSheetsEmptyStateProps {
  onPress: () => void;
}

export function GoogleSheetsEmptyState({
  onPress,
}: GoogleSheetsEmptyStateProps) {
  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={onPress}
      className='flex-row items-center bg-white rounded-12 border border-dashed border-border p-5 gap-3 shadow-card'
    >
      <View className='h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/20'>
        <Table className='text-primary' height={20} width={20} />
      </View>

      <View className='flex-1 gap-1'>
        <Text className='font-bold text-[15px] text-primary'>
          Немає підключених таблиць
        </Text>

        <Text className='text-[13px] text-placeholder leading-4.5'>
          Натисніть сюди або на кнопку «+ Додати», щоб підключити Google Таблицю
        </Text>
      </View>
    </TouchableOpacity>
  );
}
