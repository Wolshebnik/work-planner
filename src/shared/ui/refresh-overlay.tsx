import { ActivityIndicator, View } from 'react-native';

interface RefreshOverlayProps {
  isRefreshing: boolean;
}

export function RefreshOverlay({ isRefreshing }: RefreshOverlayProps) {
  if (!isRefreshing) {
    return null;
  }

  return (
    <View
      accessible
      accessibilityLabel='Оновлення'
      accessibilityRole='progressbar'
      className='absolute inset-0 z-50 items-center justify-center'
      pointerEvents='none'
    >
      <ActivityIndicator color='#02658B' size='large' />
    </View>
  );
}
