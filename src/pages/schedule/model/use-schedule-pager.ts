import { useCallback, useMemo, useState } from 'react';

import type dayjs from 'dayjs';
import type { LayoutChangeEvent } from 'react-native';
import { Gesture } from 'react-native-gesture-handler';
import {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';

import type { ViewMode } from '@/shared/ui/view-switcher';

interface UseSchedulePagerProps {
  currentDate: dayjs.Dayjs;
  onNext: () => void;
  onPrev: () => void;
  viewMode: ViewMode;
}

export function useSchedulePager({
  currentDate,
  viewMode,
  onNext,
  onPrev,
}: UseSchedulePagerProps) {
  const [pageWidth, setPageWidth] = useState(0);
  const [pageOffset, setPageOffset] = useState(0);
  const offsetShared = useSharedValue(0);
  const dragX = useSharedValue(0);
  const isAnimating = useSharedValue(false);

  const commitNext = () => {
    setPageOffset((prev) => prev + 1);
    offsetShared.value += 1;
    dragX.value = 0;
    isAnimating.value = false;
    onNext();
  };

  const commitPrev = () => {
    setPageOffset((prev) => prev - 1);
    offsetShared.value -= 1;
    dragX.value = 0;
    isAnimating.value = false;
    onPrev();
  };

  const resetPager = () => {
    setPageOffset(0);
    offsetShared.value = 0;
    dragX.value = 0;
    isAnimating.value = false;
  };

  const previousDate = useMemo(() => {
    return viewMode === 'week'
      ? currentDate.subtract(1, 'week')
      : currentDate.subtract(1, 'month');
  }, [currentDate, viewMode]);

  const nextDate = useMemo(() => {
    return viewMode === 'week'
      ? currentDate.add(1, 'week')
      : currentDate.add(1, 'month');
  }, [currentDate, viewMode]);

  const handleLayout = useCallback((event: LayoutChangeEvent) => {
    const width = event.nativeEvent.layout.width;
    if (width > 0) {
      setPageWidth(width);
    }
  }, []);

  const swipeGesture = Gesture.Pan()
    .activeOffsetX([-20, 20])
    .failOffsetY([-15, 15])
    .onUpdate((event) => {
      'worklet';
      if (pageWidth <= 0 || isAnimating.value) return;
      dragX.value = event.translationX;
    })
    .onEnd((event) => {
      'worklet';
      if (pageWidth <= 0 || isAnimating.value) return;

      const threshold = 70;
      const velocityThreshold = 500;
      const shouldGoNext =
        event.translationX <= -threshold ||
        (event.translationX < -20 && event.velocityX <= -velocityThreshold);
      const shouldGoPrev =
        event.translationX >= threshold ||
        (event.translationX > 20 && event.velocityX >= velocityThreshold);

      if (shouldGoNext) {
        isAnimating.value = true;
        dragX.value = withTiming(
          -pageWidth,
          { duration: 200 },
          (finished) => {
            if (finished) {
              runOnJS(commitNext)();
            }
          },
        );
      } else if (shouldGoPrev) {
        isAnimating.value = true;
        dragX.value = withTiming(
          pageWidth,
          { duration: 200 },
          (finished) => {
            if (finished) {
              runOnJS(commitPrev)();
            }
          },
        );
      } else {
        dragX.value = withSpring(0, {
          damping: 20,
          stiffness: 200,
        });
      }
    });

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { translateX: -offsetShared.value * pageWidth + dragX.value },
      ],
    };
  });

  return {
    pageWidth,
    pageOffset,
    previousDate,
    nextDate,
    swipeGesture,
    animatedStyle,
    handleLayout,
    commitNext,
    commitPrev,
    resetPager,
  };
}
