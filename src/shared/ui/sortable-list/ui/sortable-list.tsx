import { useCallback } from 'react';

import { View } from 'react-native';
import {
  FlatList,
  GestureHandlerRootView,
  ScrollView,
} from 'react-native-gesture-handler';
import Animated from 'react-native-reanimated';
import {
  DropProvider,
  SortableDirection,
  type SortableRenderItemProps,
} from 'react-native-reanimated-dnd';

import { type SortableData, type SortableListProps } from '../model/types';
import { useSortableList } from '../model/use-sortable-list';

const AnimatedFlatList = Animated.createAnimatedComponent(FlatList);
const AnimatedScrollView = Animated.createAnimatedComponent(ScrollView);

export function SortableList<TData extends SortableData>({
  data,
  renderItem,
  itemHeight,
  enableDynamicHeights = false,
  estimatedItemHeight = 60,
  onHeightsMeasured,
  refreshControl,
  scrollEnabled,
  style,
  contentContainerStyle,
  itemKeyExtractor = (item) => item.id,
  useFlatList = false,
  ListFooterComponent,
}: SortableListProps<TData>) {
  const {
    scrollViewRef,
    dropProviderRef,
    handleScroll,
    handleScrollEnd,
    contentHeight,
    getItemProps,
  } = useSortableList({
    data,
    itemHeight,
    enableDynamicHeights,
    estimatedItemHeight,
    onHeightsMeasured,
    itemKeyExtractor,
  });

  const memoizedVerticalRenderItem = useCallback(
    ({ item, index }: { index: number; item: TData }) => {
      const itemProps = getItemProps(item, index);
      const sortableItemProps: SortableRenderItemProps<TData> = {
        item,
        index,
        direction: SortableDirection.Vertical,
        ...itemProps,
      };
      return renderItem(sortableItemProps);
    },
    [getItemProps, renderItem],
  );

  return (
    <GestureHandlerRootView className='flex-1'>
      <DropProvider ref={dropProviderRef}>
        {useFlatList ? (
          <AnimatedFlatList
            ref={scrollViewRef}
            data={data}
            keyExtractor={(item, index) =>
              itemKeyExtractor(item as TData, index)
            }
            renderItem={memoizedVerticalRenderItem as never}
            ListFooterComponent={ListFooterComponent as never}
            refreshControl={refreshControl as never}
            scrollEnabled={scrollEnabled}
            onScroll={handleScroll}
            scrollEventThrottle={16}
            className='flex-1 bg-transparent relative'
            style={style}
            contentContainerStyle={[
              { flexGrow: 1, minHeight: contentHeight },
              contentContainerStyle,
            ]}
            onScrollEndDrag={handleScrollEnd}
            onMomentumScrollEnd={handleScrollEnd}
            simultaneousHandlers={dropProviderRef}
            showsVerticalScrollIndicator={false}
            overScrollMode='always'
            alwaysBounceVertical
          />
        ) : (
          <AnimatedScrollView
            ref={scrollViewRef}
            refreshControl={refreshControl as never}
            scrollEnabled={scrollEnabled}
            onScroll={handleScroll}
            scrollEventThrottle={16}
            className='flex-1 bg-transparent relative'
            style={style}
            contentContainerStyle={[
              { flexGrow: 1, minHeight: contentHeight },
              contentContainerStyle,
            ]}
            onScrollEndDrag={handleScrollEnd}
            onMomentumScrollEnd={handleScrollEnd}
            simultaneousHandlers={dropProviderRef}
            showsVerticalScrollIndicator={false}
            overScrollMode='always'
            alwaysBounceVertical
          >
            <View style={{ height: contentHeight }}>
              {data.map((item, index) => {
                const itemProps = getItemProps(item, index);
                const sortableItemProps: SortableRenderItemProps<TData> = {
                  item,
                  index,
                  direction: SortableDirection.Vertical,
                  ...itemProps,
                };
                return renderItem(sortableItemProps);
              })}
            </View>
            {ListFooterComponent}
          </AnimatedScrollView>
        )}
      </DropProvider>
    </GestureHandlerRootView>
  );
}
