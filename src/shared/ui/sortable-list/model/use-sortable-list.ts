import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import {
  scrollTo,
  useAnimatedReaction,
  useAnimatedRef,
  useAnimatedScrollHandler,
  useSharedValue,
} from 'react-native-reanimated';
import {
  type DropProviderRef,
  listToObject,
  ScrollDirection,
} from 'react-native-reanimated-dnd';

import { resolveItemHeight } from '../lib/resolve-item-height';
import { type SortableData } from './types';

interface UseSortableListOptions<TData extends SortableData> {
  data: TData[];
  enableDynamicHeights?: boolean;
  estimatedItemHeight?: number;
  itemHeight?: number;
  itemKeyExtractor?: (item: TData, index: number) => string;
  onHeightsMeasured?: (heights: Record<string, number>) => void;
}

export function useSortableList<TData extends SortableData>({
  data,
  itemHeight,
  enableDynamicHeights = false,
  estimatedItemHeight = 60,
  onHeightsMeasured,
  itemKeyExtractor = (item) => item.id,
}: UseSortableListOptions<TData>) {
  const isDynamicHeight = useMemo(() => {
    if (enableDynamicHeights) return true;
    if (typeof itemHeight === 'number') return false;
    return false;
  }, [enableDynamicHeights, itemHeight]);

  const needsMeasurement = enableDynamicHeights;

  const positions = useSharedValue(listToObject(data));
  const scrollY = useSharedValue(0);
  const autoScroll = useSharedValue(ScrollDirection.None);
  const scrollViewRef = useAnimatedRef();
  const dropProviderRef = useRef<DropProviderRef | null>(null);

  useEffect(() => {
    positions.set(listToObject(data));
  }, [data, positions]);

  const initialHeights = useMemo(() => {
    if (!isDynamicHeight) return {};
    const heights: Record<string, number> = {};
    data.forEach((item, index) => {
      const id = itemKeyExtractor(item, index);
      heights[id] = resolveItemHeight(
        itemHeight,
        item,
        index,
        estimatedItemHeight,
      );
    });
    return heights;
  }, [data, estimatedItemHeight, isDynamicHeight, itemHeight, itemKeyExtractor]);

  const itemHeightsSV = useSharedValue(initialHeights);

  const baseContentHeight = useMemo(() => {
    if (typeof itemHeight === 'number') {
      return data.length * itemHeight;
    }
    let total = 0;
    data.forEach((item, index) => {
      total += resolveItemHeight(
        itemHeight,
        item,
        index,
        estimatedItemHeight,
      );
    });
    return total;
  }, [data, estimatedItemHeight, itemHeight]);

  const [measuredHeight, setMeasuredHeight] = useState<number | null>(null);

  const scheduleHeightUpdate = useCallback(
    (id: string, height: number) => {
      const rounded = Math.round(height);
      const prev = itemHeightsSV.value[id];
      if (prev !== undefined && Math.abs(prev - rounded) < 1) {
        return;
      }
      const newHeights = { ...itemHeightsSV.value, [id]: rounded };
      itemHeightsSV.set(newHeights);
      let total = 0;
      data.forEach((item, index) => {
        const itemId = itemKeyExtractor(item, index);
        total += newHeights[itemId] ?? estimatedItemHeight;
      });
      setMeasuredHeight(total);
      if (onHeightsMeasured) {
        onHeightsMeasured(newHeights);
      }
    },
    [
      data,
      estimatedItemHeight,
      itemHeightsSV,
      itemKeyExtractor,
      onHeightsMeasured,
    ],
  );

  useAnimatedReaction(
    () => scrollY.value,
    (scrolling) => {
      scrollTo(scrollViewRef, 0, scrolling, false);
    },
  );

  const handleScroll = useAnimatedScrollHandler({
    onScroll: (event) => {
      'worklet';
      scrollY.set(event.contentOffset.y);
    },
  });

  const handleScrollEnd = useCallback(() => {
    const timeout = setTimeout(() => {
      dropProviderRef.current?.requestPositionUpdate();
    }, 50);
    return () => clearTimeout(timeout);
  }, []);

  const contentHeight =
    isDynamicHeight && measuredHeight !== null
      ? measuredHeight
      : baseContentHeight;

  const getItemProps = useCallback(
    (item: TData, index: number) => {
      const id = itemKeyExtractor(item, index);
      return {
        id,
        positions,
        lowerBound: scrollY,
        autoScrollDirection: autoScroll,
        itemsCount: data.length,
        itemHeight: typeof itemHeight === 'number' ? itemHeight : undefined,
        isDynamicHeight,
        estimatedItemHeight,
        itemHeights: isDynamicHeight ? itemHeightsSV : undefined,
        scheduleHeightUpdate: needsMeasurement
          ? scheduleHeightUpdate
          : undefined,
      };
    },
    [
      autoScroll,
      data.length,
      estimatedItemHeight,
      isDynamicHeight,
      itemHeight,
      itemHeightsSV,
      itemKeyExtractor,
      needsMeasurement,
      positions,
      scheduleHeightUpdate,
      scrollY,
    ],
  );

  return {
    contentHeight,
    dropProviderRef,
    getItemProps,
    handleScroll,
    handleScrollEnd,
    scrollViewRef,
  };
}
