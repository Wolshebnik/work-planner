import { memo } from 'react';
import type React from 'react';
import type dayjs from 'dayjs';
import { type LayoutChangeEvent, View } from 'react-native';
import {
  type ComposedGesture,
  type GestureType,
  GestureDetector,
} from 'react-native-gesture-handler';
import Animated, { type StyleProps } from 'react-native-reanimated';

import type { PhysicalSlot } from '../model/use-schedule-pager';

interface SchedulePeriodPagerProps {
  animatedStyle: StyleProps;
  onLayout: (event: LayoutChangeEvent) => void;
  pageWidth: number;
  renderPage: (date: dayjs.Dayjs, isCurrentPage: boolean) => React.ReactNode;
  slots: PhysicalSlot[];
  swipeGesture: GestureType | ComposedGesture;
}

export const SchedulePeriodPager = memo(function SchedulePeriodPager({
  pageWidth,
  slots,
  swipeGesture,
  animatedStyle,
  onLayout,
  renderPage,
}: SchedulePeriodPagerProps) {
  const currentSlot = slots.find((s) => s.isCurrent) ?? slots[0];

  return (
    <View className='w-full overflow-hidden' onLayout={onLayout}>
      {pageWidth > 0 ? (
        <GestureDetector gesture={swipeGesture}>
          <Animated.View style={animatedStyle} collapsable={false}>
            {slots.map((slot) => (
              <View
                key={`slot-${slot.index}`}
                style={[
                  {
                    left: slot.logicalPage * pageWidth,
                    width: pageWidth,
                  },
                  slot.isCurrent
                    ? undefined
                    : {
                        position: 'absolute',
                        top: 0,
                      },
                ]}
              >
                {slot.isCurrent || slot.isReady
                  ? renderPage(slot.date, slot.isCurrent)
                  : null}
              </View>
            ))}
          </Animated.View>
        </GestureDetector>
      ) : (
        renderPage(currentSlot.date, true)
      )}
    </View>
  );
});






