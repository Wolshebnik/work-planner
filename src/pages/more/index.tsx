import { View } from 'react-native';

import { Header } from '@/shared/ui/header';
import { Text } from '@/shared/ui/text';

export function MorePage() {
  return (
    <View className='flex-1 bg-background'>
      <Header title='Ще' />
      <View className='flex-1 items-center justify-center px-6'>
        <Text className='text-center font-medium text-[20px]'>Додаткові налаштування з’являться тут</Text>
      </View>
    </View>
  );
}
