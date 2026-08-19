/* eslint-disable react-hooks/immutability */
import {
  startTransition,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';

import dayjs from 'dayjs';
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

export type CurrentSlotIndex = 0 | 1 | 2;
export interface PhysicalSlot {
  date: dayjs.Dayjs;
  index: CurrentSlotIndex;
  isCurrent: boolean;
  isReady: boolean;
  logicalPage: number;
}

export function getRelativeOffset(
  slotIndex: CurrentSlotIndex,
  currentSlotIndex: CurrentSlotIndex,
): -1 | 0 | 1 {
  const delta = (slotIndex - currentSlotIndex + 3) % 3;
  return delta === 2 ? -1 : (delta as 0 | 1);
}

interface UseSchedulePagerProps {
  initialDate?: dayjs.Dayjs;
  onDateChange?: (newDate: dayjs.Dayjs) => void;
  viewMode: ViewMode;
}

export function useSchedulePager({
  initialDate,
  viewMode,
  onDateChange,
}: UseSchedulePagerProps) {
  const [pageWidth, setPageWidth] = useState(0);

  // 1. Urgent pager state: drives header, active slot index, and logical position
  const [urgentState, setUrgentState] = useState<{
    currentDate: dayjs.Dayjs;
    currentSlotIndex: CurrentSlotIndex;
    logicalPageIndex: number;
  }>({
    currentDate: initialDate ?? dayjs(),
    currentSlotIndex: 0,
    logicalPageIndex: 0,
  });

  const unit = viewMode === 'week' ? 'week' : 'month';
  const initialBaseDate = initialDate ?? dayjs();

  const [slotMapping, setSlotMapping] = useState<
    Record<
      CurrentSlotIndex,
      { date: dayjs.Dayjs; isReady: boolean; logicalPage: number }
    >
  >({
    0: { date: initialBaseDate, logicalPage: 0, isReady: true },
    1: { date: initialBaseDate.add(1, unit), logicalPage: 1, isReady: false },
    2: {
      date: initialBaseDate.subtract(1, unit),
      logicalPage: -1,
      isReady: false,
    },
  });

  useEffect(() => {
    startTransition(() => {
      setSlotMapping((prev) => ({
        0: { ...prev[0], isReady: true },
        1: { ...prev[1], isReady: true },
        2: { ...prev[2], isReady: true },
      }));
    });
  }, []);

  const offsetShared = useSharedValue(0);
  const dragX = useSharedValue(0);
  const isAnimating = useSharedValue(false);
  const isGestureActive = useSharedValue(false);
  const gestureBlocked = useSharedValue(false);

  const commitNavigation = useCallback(
    (direction: -1 | 1) => {
      const currentUnit = viewMode === 'week' ? 'week' : 'month';
      const nextDate = urgentState.currentDate.add(direction, currentUnit);
      const nextSlotIndex = ((urgentState.currentSlotIndex + direction + 3) %
        3) as CurrentSlotIndex;
      const nextLogicalPage = urgentState.logicalPageIndex + direction;

      setUrgentState({
        currentDate: nextDate,
        currentSlotIndex: nextSlotIndex,
        logicalPageIndex: nextLogicalPage,
      });
      onDateChange?.(nextDate);
      isAnimating.value = false;

      startTransition(() => {
        const farSlotIndex = ((nextSlotIndex + direction + 3) %
          3) as CurrentSlotIndex;
        const farLogicalPage = nextLogicalPage + direction;
        const farDate = nextDate.add(direction, currentUnit);

        setSlotMapping((prev) => ({
          ...prev,
          [farSlotIndex]: {
            date: farDate,
            logicalPage: farLogicalPage,
            isReady: true,
          },
        }));
      });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [viewMode, onDateChange, urgentState],
  );

  const navigate = useCallback(
    (direction: -1 | 1) => {
      if (isAnimating.value || isGestureActive.value || pageWidth <= 0) return;
      isAnimating.value = true;
      dragX.value = withTiming(
        -direction * pageWidth,
        { duration: 200 },
        (finished) => {
          'worklet';
          if (finished) {
            offsetShared.value += direction;
            dragX.value = 0;
            runOnJS(commitNavigation)(direction);
          } else {
            isAnimating.value = false;
          }
        },
      );
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [pageWidth, commitNavigation],
  );

  const handleLayout = useCallback((event: LayoutChangeEvent) => {
    const width = event.nativeEvent.layout.width;
    if (width > 0) {
      setPageWidth(width);
    }
  }, []);

  const resetPager = useCallback(
    (newDate?: dayjs.Dayjs) => {
      offsetShared.value = 0;
      dragX.value = 0;
      isAnimating.value = false;
      isGestureActive.value = false;
      gestureBlocked.value = false;
      const targetDate = newDate ?? dayjs();
      const currentUnit = viewMode === 'week' ? 'week' : 'month';

      setUrgentState({
        currentDate: targetDate,
        currentSlotIndex: 0,
        logicalPageIndex: 0,
      });
      onDateChange?.(targetDate);

      setSlotMapping({
        0: { date: targetDate, logicalPage: 0, isReady: true },
        1: {
          date: targetDate.add(1, currentUnit),
          logicalPage: 1,
          isReady: false,
        },
        2: {
          date: targetDate.subtract(1, currentUnit),
          logicalPage: -1,
          isReady: false,
        },
      });

      startTransition(() => {
        setSlotMapping((prev) => ({
          0: { ...prev[0], isReady: true },
          1: { ...prev[1], isReady: true },
          2: { ...prev[2], isReady: true },
        }));
      });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [viewMode, onDateChange],
  );

  const swipeGesture = useMemo(() => {
    return Gesture.Pan()
      .activeOffsetX([-20, 20])
      .failOffsetY([-15, 15])
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
          isGestureActive.value = false;
          dragX.value = withTiming(
            -pageWidth,
            { duration: 200 },
            (finished) => {
              'worklet';
              if (finished) {
                offsetShared.value += 1;
                dragX.value = 0;
                runOnJS(commitNavigation)(1);
              } else {
                isAnimating.value = false;
              }
            },
          );
        } else if (shouldGoPrev) {
          isAnimating.value = true;
          isGestureActive.value = false;
          dragX.value = withTiming(pageWidth, { duration: 200 }, (finished) => {
            'worklet';
            if (finished) {
              offsetShared.value -= 1;
              dragX.value = 0;
              runOnJS(commitNavigation)(-1);
            } else {
              isAnimating.value = false;
            }
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [commitNavigation, pageWidth]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { translateX: -offsetShared.value * pageWidth + dragX.value },
      ],
    };
  });

  const slots: PhysicalSlot[] = useMemo(() => {
    const indices: CurrentSlotIndex[] = [0, 1, 2];
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
    resetPager,
  };
}
