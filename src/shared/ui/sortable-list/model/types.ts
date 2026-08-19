import { type ReactNode } from 'react';

import { type StyleProp, type ViewStyle } from 'react-native';
import { type SortableRenderItemProps } from 'react-native-reanimated-dnd';

export interface SortableData {
  id: string;
}

export interface SortableListProps<TData extends SortableData> {
  contentContainerStyle?: StyleProp<ViewStyle>;
  data: TData[];
  enableDynamicHeights?: boolean;
  estimatedItemHeight?: number;
  itemHeight?: number;
  itemKeyExtractor?: (item: TData, index: number) => string;
  onHeightsMeasured?: (heights: Record<string, number>) => void;
  renderItem: (props: SortableRenderItemProps<TData>) => ReactNode;
  style?: StyleProp<ViewStyle>;
  useFlatList?: boolean;
}
