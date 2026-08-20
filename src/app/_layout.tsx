import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { QueryClientProvider } from '@tanstack/react-query';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import { styled } from 'nativewind';
import { NavigationBar } from 'expo-navigation-bar';
import { StatusBar, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

import { SessionInitializer } from '@/entities/auth-session';
import { queryClient } from '@/shared/api/query-client';
import { ToastRoot } from '@/shared/ui/toast';
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
    <QueryClientProvider client={queryClient}>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <BottomSheetModalProvider>
          <SafeAreaProvider>
            <StyledSafeAreaView
              edges={['top', 'bottom']}
              className='flex-1 bg-neutral'
            >
              <StatusBar
                barStyle='dark-content'
                backgroundColor='transparent'
                translucent
              />

              <NavigationBar style='dark' />

              <SessionInitializer>
                <View className='flex-1 bg-background'>
                  <Stack screenOptions={{ headerShown: false }} />
                  <BottomNavigation />
                  <ToastRoot />
                </View>
              </SessionInitializer>
            </StyledSafeAreaView>
          </SafeAreaProvider>
        </BottomSheetModalProvider>
      </GestureHandlerRootView>
    </QueryClientProvider>
  );
}
