import { useEffect, useState } from 'react';
import type React from 'react';
import { type LayoutChangeEvent, View } from 'react-native';
import { type ComposedGesture, type GestureType, GestureDetector } from 'react-native-gesture-handler';
import Animated, { type StyleProps } from 'react-native-reanimated';

interface SchedulePeriodPagerProps {
  animatedStyle: StyleProps;
  onLayout: (event: LayoutChangeEvent) => void;
  pageOffset: number;
  pageWidth: number;
  renderCurrent: () => React.ReactNode;
  renderNext: () => React.ReactNode;
  renderPrevious: () => React.ReactNode;
  swipeGesture: GestureType | ComposedGesture;
  viewModeKey?: string;
}

export function SchedulePeriodPager({
  pageWidth,
  pageOffset,
  swipeGesture,
  animatedStyle,
  onLayout,
  viewModeKey,
  renderPrevious,
  renderCurrent,
  renderNext,
}: SchedulePeriodPagerProps) {
  const [prevViewModeKey, setPrevViewModeKey] = useState(viewModeKey);
  const [isAdjacentReady, setIsAdjacentReady] = useState(false);

  if (prevViewModeKey !== viewModeKey) {
    setPrevViewModeKey(viewModeKey);
    setIsAdjacentReady(false);
  }

  useEffect(() => {
    if (!isAdjacentReady) {
      const frameId = requestAnimationFrame(() => {
        setIsAdjacentReady(true);
      });
      return () => cancelAnimationFrame(frameId);
    }
  }, [isAdjacentReady]);

  return (
    <View className='w-full overflow-hidden' onLayout={onLayout}>
      {pageWidth > 0 ? (
        <GestureDetector gesture={swipeGesture}>
          <Animated.View style={animatedStyle} collapsable={false}>
            {isAdjacentReady && (
              <View
                key={`prev-${pageOffset - 1}`}
                style={{
                  position: 'absolute',
                  left: (pageOffset - 1) * pageWidth,
                  width: pageWidth,
                  top: 0,
                }}
              >
                {renderPrevious()}
              </View>
            )}
            <View
              key={`curr-${pageOffset}`}
              style={{
                left: pageOffset * pageWidth,
                width: pageWidth,
              }}
            >
              {renderCurrent()}
            </View>
            {isAdjacentReady && (
              <View
                key={`next-${pageOffset + 1}`}
                style={{
                  position: 'absolute',
                  left: (pageOffset + 1) * pageWidth,
                  width: pageWidth,
                  top: 0,
                }}
              >
                {renderNext()}
              </View>
            )}
          </Animated.View>
        </GestureDetector>
      ) : (
        renderCurrent()
      )}
    </View>
  );
}

