import { useCallback } from 'react';

import { StyleSheet, View } from 'react-native';
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
    <GestureHandlerRootView style={styles.flex}>
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
            onScroll={handleScroll}
            scrollEventThrottle={16}
            style={[styles.scrollView, style]}
            contentContainerStyle={[
              { minHeight: contentHeight },
              contentContainerStyle,
            ]}
            onScrollEndDrag={handleScrollEnd}
            onMomentumScrollEnd={handleScrollEnd}
            simultaneousHandlers={dropProviderRef}
            showsVerticalScrollIndicator={false}
          />
        ) : (
          <AnimatedScrollView
            ref={scrollViewRef}
            onScroll={handleScroll}
            scrollEventThrottle={16}
            style={[styles.scrollView, style]}
            contentContainerStyle={[
              { minHeight: contentHeight },
              contentContainerStyle,
            ]}
            onScrollEndDrag={handleScrollEnd}
            onMomentumScrollEnd={handleScrollEnd}
            simultaneousHandlers={dropProviderRef}
            showsVerticalScrollIndicator={false}
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

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  scrollView: {
    backgroundColor: 'transparent',
    flex: 1,
    position: 'relative',
  },
});
