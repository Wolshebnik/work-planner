import { useWindowDimensions } from 'react-native';

import { BottomSheetMobile } from './bottom-sheet-mobile';
import { BottomSheetTablet } from './bottom-sheet-tablet';
import { type BottomSheetProps } from './types';

const MAX_SHEET_WIDTH = 640;

export function BottomSheet(props: BottomSheetProps) {
  const { width: windowWidth } = useWindowDimensions();
  const isWide = windowWidth > MAX_SHEET_WIDTH;

  if (isWide) {
    return <BottomSheetTablet {...props} />;
  }

  return <BottomSheetMobile {...props} />;
}
export { type BottomSheetProps } from './types';
