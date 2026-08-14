import { useState } from 'react';

import {
  View,
  Animated,
  Pressable,
  type LayoutChangeEvent,
} from 'react-native';

import { cn } from '@/shared/lib/cn';
import { Text } from '@/shared/ui/text';

export type ViewMode = 'week' | 'month' | 'summary';
interface ViewSwitcherProps {
  value: ViewMode;
  className?: string;
  onChange: (value: ViewMode) => void;
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
  const [indicatorX] = useState(() => new Animated.Value(0));
  const [containerWidth, setContainerWidth] = useState(0);

  const selectedIndex = options.findIndex((option) => option.value === value);
  const itemWidth = (containerWidth - 8) / options.length;

  const handleLayout = ({ nativeEvent }: LayoutChangeEvent) => {
    const width = nativeEvent.layout.width;

    setContainerWidth(width);
    indicatorX.setValue(((width - 8) / options.length) * selectedIndex);
  };

  const handleChange = (nextValue: ViewMode, index: number) => {
    Animated.timing(indicatorX, {
      toValue: itemWidth * index,
      duration: 150,
      useNativeDriver: true,
    }).start();

    onChange(nextValue);
  };

  return (
    <View
      className={cn(
        'mx-4 h-10 flex-row rounded-12 bg-neutral p-1 shadow-card',
        className,
      )}
      onLayout={handleLayout}
    >
      {containerWidth > 0 && (
        <Animated.View
          className='absolute bottom-1 left-1 top-1 rounded-8 bg-button'
          style={{
            transform: [{ translateX: indicatorX }],
            width: itemWidth,
          }}
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
            onPress={() => handleChange(option.value, index)}
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
