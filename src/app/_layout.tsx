import { Stack } from 'expo-router';
import { useFonts } from 'expo-font';
import { cssInterop } from 'nativewind';
import { View } from 'react-native';
import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context';

import { BottomNavigation } from '@/widgets/bottom-navigation';

import '../../global.css';

const StyledSafeAreaView = cssInterop(SafeAreaView, { className: 'style' });

export default function RootLayout() {
  useFonts({
    RobotoFlex_400Regular: require('@/assets/fonts/RobotoFlex-400.ttf'),
    RobotoFlex_500Medium: require('@/assets/fonts/RobotoFlex-500.ttf'),
    RobotoFlex_600SemiBold: require('@/assets/fonts/RobotoFlex-600.ttf'),
    RobotoFlex_700Bold: require('@/assets/fonts/RobotoFlex-700.ttf'),
    RobotoFlex_800ExtraBold: require('@/assets/fonts/RobotoFlex-800.ttf'),
  });

  return (
    <SafeAreaProvider>
      <StyledSafeAreaView className='flex-1 bg-[#F2EDED]' edges={['top']}>
        <StyledSafeAreaView className='flex-1 bg-[#E7E8EB]' edges={['bottom']}>
          <View className='flex-1'>
            <Stack screenOptions={{ headerShown: false }} />
            <BottomNavigation />
          </View>
        </StyledSafeAreaView>
      </StyledSafeAreaView>
    </SafeAreaProvider>
  );
}
