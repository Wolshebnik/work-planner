import { useState } from 'react';

import { type LayoutChangeEvent, Pressable, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';

import { cn } from '@/shared/lib/cn';
import { Text } from '@/shared/ui/text';

export type ViewMode = 'week' | 'month' | 'summary';
interface ViewSwitcherProps {
  className?: string;
  onChange: (value: ViewMode) => void;
  value: ViewMode;
}

const options: readonly { label: string; value: ViewMode }[] = [

{ label: 'Тиждень', value: 'week' },
  { label: 'Місяць', value: 'month' },
  { label: 'Підсумки', value: 'summary' },
];

export function ViewSwitcher({
  className,
  value,
  onChange,
}: ViewSwitcherProps) {
  const [containerWidth, setContainerWidth] = useState(0);
  const indicatorX = useSharedValue(0);

  const selectedIndex = options.findIndex((option) => option.value === value);
  const itemWidth =
    containerWidth > 0 ? (containerWidth - 8) / options.length : 0;

  const handleLayout = ({ nativeEvent }: LayoutChangeEvent) => {
    const width = nativeEvent.layout.width;
    setContainerWidth(width);
    const calculatedWidth = (width - 8) / options.length;
    indicatorX.value = calculatedWidth * selectedIndex;
  };

  const handlePress = (optionValue: ViewMode, index: number) => {
    if (itemWidth > 0) {
      indicatorX.value = withTiming(itemWidth * index, { duration: 75 });
    }
    onChange(optionValue);
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: indicatorX.value }],
    width: itemWidth,
  }));

  return (
    <View
      className={cn(
        'h-12 flex-row rounded-12 bg-[#DBDCDF] p-1 border border-neutral',
        className,
      )}
      onLayout={handleLayout}
    >
      {containerWidth > 0 && (
        <Animated.View
          className='absolute bottom-1 left-1 top-1 rounded-8 bg-button'
          style={animatedStyle}
        />
      )}

      {options.map((option, index) => {
        const isSelected = option.value === value;

        return (
          <Pressable
            key={option.value}
            accessibilityRole='tab'
            accessibilityState={{ selected: isSelected }}
            className='flex-1 items-center justify-center rounded-8'
            onPress={() => handlePress(option.value, index)}
          >
            <Text
              className={cn(
                'font-medium text-[14px] leading-[20px]',
                isSelected && 'font-bold text-white',
              )}
            >
              {option.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}
