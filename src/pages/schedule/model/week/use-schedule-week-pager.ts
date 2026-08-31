/* eslint-disable react-hooks/immutability, react-hooks/refs, react-hooks/set-state-in-effect */
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { useQueryClient } from '@tanstack/react-query';
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

import { preparePagerMonths } from '@/entities/schedule';

export type CurrentSlotIndex = 0 | 1 | 2;
export interface PhysicalSlot {
  date: dayjs.Dayjs;
  index: CurrentSlotIndex;
  isCurrent: boolean;
  isReady: boolean;
  logicalPage: number;
}
interface UseScheduleWeekPagerProps {
  currentDate: dayjs.Dayjs;
  onDateChange?: (newDate: dayjs.Dayjs) => void;
}

export function useScheduleWeekPager({
  currentDate,
  onDateChange,
}: UseScheduleWeekPagerProps) {
  const queryClient = useQueryClient();
  const [pageWidth, setPageWidth] = useState(0);

  const [urgentState, setUrgentState] = useState<{
    currentDate: dayjs.Dayjs;
    currentSlotIndex: CurrentSlotIndex;
    logicalPageIndex: number;
  }>({
    currentDate,
    currentSlotIndex: 0,
    logicalPageIndex: 0,
  });
  const urgentStateRef = useRef(urgentState);

  const [slotMapping, setSlotMapping] = useState<
    Record<
      CurrentSlotIndex,
      { date: dayjs.Dayjs; isReady: boolean; logicalPage: number }
    >
  >({
    0: { date: currentDate, logicalPage: 0, isReady: true },
    1: { date: currentDate.add(1, 'week'), logicalPage: 1, isReady: false },
    2: { date: currentDate.subtract(1, 'week'), logicalPage: -1, isReady: false },
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
      urgentStateRef.current = {
        currentDate,
        currentSlotIndex: 0,
        logicalPageIndex: 0,
      };
      setSlotMapping({
        0: { date: currentDate, logicalPage: 0, isReady: true },
        1: { date: currentDate.add(1, 'week'), logicalPage: 1, isReady: true },
        2: {
          date: currentDate.subtract(1, 'week'),
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

  useEffect(() => {
    void preparePagerMonths(urgentState.currentDate, 'week', queryClient);
  }, [urgentState.currentDate, queryClient]);

  const commitNavigation = useCallback(
    (direction: -1 | 1) => {
      const currentState = urgentStateRef.current;
      const nextDate = currentState.currentDate.add(direction, 'week');
      setSyncedPropDate(nextDate);

      const nextSlotIndex = ((currentState.currentSlotIndex + direction + 3) %
        3) as CurrentSlotIndex;
      const nextLogicalPage = currentState.logicalPageIndex + direction;

      const farSlotIndex = ((nextSlotIndex + direction + 3) %
        3) as CurrentSlotIndex;
      const farLogicalPage = nextLogicalPage + direction;
      const farDate = nextDate.add(direction, 'week');

      const nextState = {
        currentDate: nextDate,
        currentSlotIndex: nextSlotIndex,
        logicalPageIndex: nextLogicalPage,
      };
      urgentStateRef.current = nextState;
      setUrgentState(nextState);
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
    [onDateChange, setSyncedPropDate],
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
  };
}
