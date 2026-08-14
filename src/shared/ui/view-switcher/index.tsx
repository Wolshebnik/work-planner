import { View, Pressable } from 'react-native';

import { cn } from '@/shared/lib/cn';
import { Text } from '@/shared/ui/text';

export type ViewMode = 'week' | 'month' | 'summary';
interface ViewSwitcherProps {
  className?: string;
  value: ViewMode;
  onChange: (value: ViewMode) => void;
}

const options: ReadonlyArray<{ label: string; value: ViewMode }> = [
  { label: 'Тиждень', value: 'week' },
  { label: 'Місяць', value: 'month' },
  { label: 'Підсумки', value: 'summary' },
];

export function ViewSwitcher({ className, value, onChange }: ViewSwitcherProps) {
  return (
    <View className={cn('mx-4 h-10 flex-row rounded-12 bg-neutral p-1', className)}>
      {options.map((option) => {
        const isSelected = option.value === value;

        return (
          <Pressable
            key={option.value}
            accessibilityRole='tab'
            accessibilityState={{ selected: isSelected }}
            className={cn(
              ' flex-1 items-center justify-center rounded-8',
              isSelected && 'bg-button',
            )}
            onPress={() => onChange(option.value)}
          >
            <Text
              className={cn(
                'font-medium text-[14px] leading-[20px] text-[#40484F]',
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
