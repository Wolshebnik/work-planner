import { View } from 'react-native';

interface SelectedColumnOverlayProps {
  leftOffset: number;
  variant?: 'selected' | 'today';
  width: number;
}

export function SelectedColumnOverlay({
  leftOffset,
  width,
  variant = 'selected',
}: SelectedColumnOverlayProps) {
  const isToday = variant === 'today';

  return (
    <View
      pointerEvents='none'
      className='absolute top-0 bottom-0 rounded-8'
      style={{
        left: leftOffset,
        width,
        backgroundColor: isToday
          ? 'rgba(245, 158, 11, 0.05)'
          : 'rgba(0, 101, 143, 0.09)',
        borderColor: isToday
          ? 'rgba(217, 119, 6, 0.30)'
          : 'rgba(0, 101, 143, 0.65)',
        borderWidth: 1,
        borderRadius: 8,
        zIndex: 1,
      }}
    />
  );
}

