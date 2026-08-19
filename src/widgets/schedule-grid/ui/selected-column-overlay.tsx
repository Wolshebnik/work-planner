import { View } from 'react-native';

interface SelectedColumnOverlayProps {
  dayColumnWidth: number;
  leftOffset: number;
}

export function SelectedColumnOverlay({
  dayColumnWidth,
  leftOffset,
}: SelectedColumnOverlayProps) {
  return (
    <View
      pointerEvents='none'
      className='absolute top-0 bottom-0 rounded-8 border border-button/60 bg-button/[0.09]'
      style={{
        left: leftOffset + 1,
        width: dayColumnWidth - 2,
        backgroundColor: 'rgba(0, 101, 143, 0.09)',
        borderColor: 'rgba(0, 101, 143, 0.65)',
        borderWidth: 1,
        borderRadius: 8,
        zIndex: 1,
      }}
    />
  );
}

