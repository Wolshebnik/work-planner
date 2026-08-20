/* eslint-disable react-hooks/immutability, react-hooks/set-state-in-effect */
import { useCallback, useEffect, useMemo, useState } from 'react';

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

export type CurrentMonthSlotIndex = 0 | 1 | 2;
export interface PhysicalMonthSlot {
  date: dayjs.Dayjs;
  index: CurrentMonthSlotIndex;
  isCurrent: boolean;
  isReady: boolean;
  logicalPage: number;
}
interface UseScheduleMonthPagerProps {
  currentDate: dayjs.Dayjs;
  onDateChange?: (newDate: dayjs.Dayjs) => void;
}

export function useScheduleMonthPager({
  currentDate,
  onDateChange,
}: UseScheduleMonthPagerProps) {
  const [pageWidth, setPageWidth] = useState(0);

  const [urgentState, setUrgentState] = useState<{
    currentDate: dayjs.Dayjs;
    currentSlotIndex: CurrentMonthSlotIndex;
    logicalPageIndex: number;
  }>({
    currentDate,
    currentSlotIndex: 0,
    logicalPageIndex: 0,
  });

  const [slotMapping, setSlotMapping] = useState<
    Record<
      CurrentMonthSlotIndex,
      { date: dayjs.Dayjs; isReady: boolean; logicalPage: number }
    >
  >({
    0: { date: currentDate, logicalPage: 0, isReady: true },
    1: { date: currentDate.add(1, 'month'), logicalPage: 1, isReady: false },
    2: { date: currentDate.subtract(1, 'month'), logicalPage: -1, isReady: false },
  });

  useEffect(() => {
    const timer = setTimeout(() => {
      setSlotMapping((prev) => ({
        0: { ...prev[0], isReady: true },
        1: { ...prev[1], isReady: true },
        2: { ...prev[2], isReady: true },
      }));
    }, 60);
    return () => clearTimeout(timer);
  }, []);

  const offsetShared = useSharedValue(0);
  const dragX = useSharedValue(0);
  const isAnimating = useSharedValue(false);
  const isGestureActive = useSharedValue(false);
  const gestureBlocked = useSharedValue(false);

  const [syncedPropDate, setSyncedPropDate] = useState(currentDate);

  useEffect(() => {
    if (!currentDate.isSame(syncedPropDate, 'day')) {
      setSyncedPropDate(currentDate);
      offsetShared.value = 0;
      dragX.value = 0;
      isAnimating.value = false;
      isGestureActive.value = false;
      gestureBlocked.value = false;

      setUrgentState({
        currentDate,
        currentSlotIndex: 0,
        logicalPageIndex: 0,
      });
      setSlotMapping({
        0: { date: currentDate, logicalPage: 0, isReady: true },
        1: { date: currentDate.add(1, 'month'), logicalPage: 1, isReady: true },
        2: {
          date: currentDate.subtract(1, 'month'),
          logicalPage: -1,
          isReady: true,
        },
      });
    }
  }, [
    currentDate,
    syncedPropDate,
    offsetShared,
    dragX,
    isAnimating,
    isGestureActive,
    gestureBlocked,
  ]);

  const commitNavigation = useCallback(
    (direction: -1 | 1) => {
      const nextDate = urgentState.currentDate.add(direction, 'month');
      setSyncedPropDate(nextDate);

      const nextSlotIndex = ((urgentState.currentSlotIndex + direction + 3) %
        3) as CurrentMonthSlotIndex;
      const nextLogicalPage = urgentState.logicalPageIndex + direction;

      const farSlotIndex = ((nextSlotIndex + direction + 3) %
        3) as CurrentMonthSlotIndex;
      const farLogicalPage = nextLogicalPage + direction;
      const farDate = nextDate.add(direction, 'month');

      setUrgentState({
        currentDate: nextDate,
        currentSlotIndex: nextSlotIndex,
        logicalPageIndex: nextLogicalPage,
      });
      setSlotMapping((prev) => ({
        ...prev,
        [farSlotIndex]: {
          date: farDate,
          logicalPage: farLogicalPage,
          isReady: true,
        },
      }));
      onDateChange?.(nextDate);
    },
    [onDateChange, urgentState, setSyncedPropDate],
  );

  const navigate = useCallback(
    (direction: -1 | 1) => {
      if (isAnimating.value || isGestureActive.value || pageWidth <= 0) return;
      commitNavigation(direction);
      dragX.value = withTiming(
        -direction * pageWidth,
        { duration: 200 },
        (finished) => {
          'worklet';
          if (finished) {
            offsetShared.value += direction;
            dragX.value = 0;
          }
          isAnimating.value = false;
        },
      );
    },
    [
      pageWidth,
      commitNavigation,
      isAnimating,
      isGestureActive,
      dragX,
      offsetShared,
    ],
  );

  const handleLayout = useCallback((event: LayoutChangeEvent) => {
    const width = event.nativeEvent.layout.width;
    if (width > 0) {
      setPageWidth(width);
    }
  }, []);

  const swipeGesture = useMemo(() => {
    return Gesture.Pan()
      .activeOffsetX([-15, 15])
      .failOffsetY([-30, 30])
      .onBegin(() => {
        'worklet';
        if (isAnimating.value) {
          gestureBlocked.value = true;
          return;
        }
        gestureBlocked.value = false;
        isGestureActive.value = true;
      })
      .onUpdate((event) => {
        'worklet';
        if (gestureBlocked.value || isAnimating.value || pageWidth <= 0) return;
        dragX.value = event.translationX;
      })
      .onEnd((event) => {
        'worklet';
        if (gestureBlocked.value || isAnimating.value || pageWidth <= 0) return;

        const threshold = 60;
        const velocityThreshold = 400;
        const shouldGoNext =
          event.translationX <= -threshold ||
          (event.translationX < -20 && event.velocityX <= -velocityThreshold);
        const shouldGoPrev =
          event.translationX >= threshold ||
          (event.translationX > 20 && event.velocityX >= velocityThreshold);

        if (shouldGoNext) {
          isAnimating.value = true;
          isGestureActive.value = false;
          runOnJS(commitNavigation)(1);
          dragX.value = withTiming(
            -pageWidth,
            { duration: 200 },
            (finished) => {
              'worklet';
              if (finished) {
                offsetShared.value += 1;
                dragX.value = 0;
              }
              isAnimating.value = false;
            },
          );
        } else if (shouldGoPrev) {
          isAnimating.value = true;
          isGestureActive.value = false;
          runOnJS(commitNavigation)(-1);
          dragX.value = withTiming(pageWidth, { duration: 200 }, (finished) => {
            'worklet';
            if (finished) {
              offsetShared.value -= 1;
              dragX.value = 0;
            }
            isAnimating.value = false;
          });
        } else {
          isGestureActive.value = false;
          dragX.value = withSpring(0, {
            damping: 20,
            stiffness: 200,
          });
        }
      })
      .onFinalize(() => {
        'worklet';
        gestureBlocked.value = false;
        isGestureActive.value = false;
      });
  }, [
    commitNavigation,
    pageWidth,
    dragX,
    isAnimating,
    gestureBlocked,
    isGestureActive,
    offsetShared,
  ]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { translateX: -offsetShared.value * pageWidth + dragX.value },
      ],
    };
  });

  const slots: PhysicalMonthSlot[] = useMemo(() => {
    const indices: CurrentMonthSlotIndex[] = [0, 1, 2];
    return indices.map((i) => {
      const mapping = slotMapping[i];
      const isCurrent = i === urgentState.currentSlotIndex;
      return {
        index: i,
        logicalPage: mapping.logicalPage,
        date: mapping.date,
        isCurrent,
        isReady: mapping.isReady,
      };
    });
  }, [slotMapping, urgentState.currentSlotIndex]);

  return {
    currentDate: urgentState.currentDate,
    slots,
    pageWidth,
    swipeGesture,
    animatedStyle,
    handleLayout,
    navigate,
  };
}
