import { View } from 'react-native';

import { Header } from '@/shared/ui/header';
import { Text } from '@/shared/ui/text';

export function TeamPage() {
  return (
    <View className='flex-1 bg-background'>
      <Header title='Команда' />
      <View className='flex-1 items-center justify-center px-6'>
        <Text className='text-center font-medium text-[20px]'>Список команди з’явиться тут</Text>
      </View>
    </View>
  );
}
