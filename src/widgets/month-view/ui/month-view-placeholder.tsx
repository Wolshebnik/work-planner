import { View } from 'react-native';
import { Text } from '@/shared/ui/text';

export function MonthViewPlaceholder() {
  return (
    <View className='flex-1 items-center justify-center p-10'>
      <Text className='text-center text-text/60'>
        Вигляд місяця скоро буде доступний
      </Text>
    </View>
  );
}
