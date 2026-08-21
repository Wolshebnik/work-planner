import { useWindowDimensions } from 'react-native';

import { ColorPickerDialogMobile } from './color-picker-dialog-mobile';
import { ColorPickerDialogTablet } from './color-picker-dialog-tablet';
import { type ColorPickerDialogProps } from './types';

export function ColorPickerDialog(props: ColorPickerDialogProps) {
  const { width: windowWidth } = useWindowDimensions();
  const isWide = windowWidth > 640;

  if (isWide) {
    return <ColorPickerDialogTablet {...props} />;
  }

  return <ColorPickerDialogMobile {...props} />;
}
