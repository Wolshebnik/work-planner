import { View } from 'react-native';

interface SelectedColumnOverlayProps {
  leftOffset: number;
  width: number;
}

export function SelectedColumnOverlay({
  leftOffset,
  width,
}: SelectedColumnOverlayProps) {
  return (
    <View
      pointerEvents='none'
      className='absolute top-0 bottom-0 rounded-8 border border-button/60 bg-button/[0.09]'
      style={{
        left: leftOffset,
        width,
        backgroundColor: 'rgba(0, 101, 143, 0.09)',
        borderColor: 'rgba(0, 101, 143, 0.65)',
        borderWidth: 1,
        borderRadius: 8,
        zIndex: 1,
      }}
    />
  );
}

