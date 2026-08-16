import { Stack } from 'expo-router';
import { styled } from 'nativewind';
import { View } from 'react-native';
import { useFonts } from 'expo-font';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context';

import { BottomNavigation } from '@/widgets/bottom-navigation';

import '../../global.css';

const StyledSafeAreaView = styled(SafeAreaView, { className: 'style' });

export default function RootLayout() {
  useFonts({
    RobotoFlex_400Regular: require('@/assets/fonts/RobotoFlex-400.ttf'),
    RobotoFlex_500Medium: require('@/assets/fonts/RobotoFlex-500.ttf'),
    RobotoFlex_600SemiBold: require('@/assets/fonts/RobotoFlex-600.ttf'),
    RobotoFlex_700Bold: require('@/assets/fonts/RobotoFlex-700.ttf'),
    RobotoFlex_800ExtraBold: require('@/assets/fonts/RobotoFlex-800.ttf'),
  });

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <BottomSheetModalProvider>
        <SafeAreaProvider>
          <StyledSafeAreaView
            edges={['top', 'bottom']}
            className='flex-1 bg-neutral'
          >
            <View className='flex-1 bg-background'>
              <Stack screenOptions={{ headerShown: false }} />
              <BottomNavigation />
            </View>
          </StyledSafeAreaView>
        </SafeAreaProvider>
      </BottomSheetModalProvider>
    </GestureHandlerRootView>
  );
}
