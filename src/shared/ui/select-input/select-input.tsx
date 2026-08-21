import { useState } from 'react';

import { Pressable, View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';

import { Chevron } from '@/assets/svg';
import { cn } from '@/shared/lib/cn';
import { Text } from '@/shared/ui/text';

import type { SelectInputProps } from './types';

export function SelectInput<T = string | number>({
  className,
  dimOnDisable = false,
  disabled = false,
  error,
  label,
  labelColor = '#f8f9fc',
  leftIcon,
  onChange,
  options,
  optionsMaxHeight = 190,
  placeholder,
  required,
  value,
}: SelectInputProps<T>) {
  const [isOpen, setIsOpen] = useState(false);

  const hasError = Boolean(error);
  const selectedOption = options.find((option) => option.value === value);

  const borderClassName = hasError ? 'border-danger' : 'border-primary';

  return (
    <View className={cn('w-full', className)}>
      <Pressable
        accessibilityRole='combobox'
        disabled={disabled}
        className={cn(
          'relative h-14 flex-row items-center justify-between rounded-8 border px-4',
          borderClassName,
          disabled && dimOnDisable && 'bg-grey/10',
        )}
        onPress={() => setIsOpen((prev) => !prev)}
      >
        {label && (
          <View
            className='absolute -top-2.5 left-3 z-10 flex-row items-center px-1'
            style={{ backgroundColor: labelColor }}
          >
            <Text
              className={cn(
                'text-[12px]',
                hasError ? 'text-danger' : 'text-primary',
              )}
            >
              {label}
            </Text>

            {required && (
              <Text className='ml-0.5 text-[12px] text-danger'>*</Text>
            )}
          </View>
        )}

        {leftIcon && <View className='mr-3 shrink-0'>{leftIcon}</View>}

        <Text
          className={cn(
            'flex-1 pr-2 text-[16px]',
            selectedOption ? 'text-text' : 'text-placeholder',
            disabled && dimOnDisable && 'text-placeholder',
          )}
          numberOfLines={1}
        >
          {selectedOption ? selectedOption.label : placeholder}
        </Text>

        {!disabled && (
          <View
            style={{ transform: [{ rotate: isOpen ? '-90deg' : '90deg' }] }}
          >
            <Chevron
              className={hasError ? 'text-danger' : 'text-primary'}
              height={14}
              width={10}
            />
          </View>
        )}
      </Pressable>

      {hasError && (
        <Text className='ml-1 mt-1 text-[12px] text-danger'>{error}</Text>
      )}

      {isOpen && (
        <View
          className='mt-2 overflow-hidden rounded-8 border border-primary bg-white shadow-card'
          style={{ maxHeight: optionsMaxHeight }}
        >
          <ScrollView bounces={false} disallowInterruption nestedScrollEnabled>
            {options.map((option, index) => {
              const isSelected = option.value === value;
              const isDisabled = Boolean(option.disabled);

              return (
                <Pressable
                  key={String(option.value)}
                  disabled={isDisabled}
                  className={cn(
                    'flex-row items-center justify-between px-4 py-3',
                    index > 0 && 'border-t border-primary/15',
                    isSelected && 'bg-primary/10',
                    !isSelected && !isDisabled && 'active:bg-neutral/10',
                    isDisabled && 'opacity-40',
                  )}
                  onPress={() => {
                    onChange(option.value);
                    setIsOpen(false);
                  }}
                >
                  <View className='flex-1 pr-2'>
                    <Text
                      className={cn(
                        'text-[15px]',
                        isSelected ? 'font-bold text-primary' : 'text-text',
                      )}
                    >
                      {option.label}
                    </Text>

                    {option.description && (
                      <Text className='mt-0.5 text-[12px] text-grey'>
                        {option.description}
                      </Text>
                    )}
                  </View>
                </Pressable>
              );
            })}
          </ScrollView>
        </View>
      )}
    </View>
  );
}
