import { useState } from 'react';

import { Pressable, View } from 'react-native';

import { cn } from '@/shared/lib/cn';
import { Text } from '@/shared/ui/text';

import { ColorPickerDialog } from './color-picker-dialog';

interface ColorPickerInputProps {
  error?: string;
  label?: string;
  onChange: (color: string) => void;
  required?: boolean;
  value?: string;
}

const COLOR_PREVIEW_SIZE = 24;

export function ColorPickerInput({
  label,
  value,
  onChange,
  required,
  error,
}: ColorPickerInputProps) {
  const [modalVisible, setModalVisible] = useState(false);

  const hasError = Boolean(error);

  const borderClassName = hasError ? 'border-danger' : 'border-primary';

  const initialColor = value || '#E1E2E5FF';

  return (
    <View className='w-full'>
      <Pressable
        className={cn(
          'relative h-14 justify-center rounded-8 border px-4',
          borderClassName,
        )}
        onPress={() => setModalVisible(true)}
      >
        <View
          className='absolute -top-2.5 left-3 z-10 flex-row items-center px-1'
          style={{ backgroundColor: '#fff' }}
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

        <View className='flex-row items-center gap-2'>
          <View
            style={{
              width: COLOR_PREVIEW_SIZE,
              height: COLOR_PREVIEW_SIZE,
              borderRadius: COLOR_PREVIEW_SIZE / 2,
              backgroundColor: initialColor,
            }}
          />

          <Text className='text-[16px] text-text'>
            {value || 'Натисніть для вибору'}
          </Text>
        </View>
      </Pressable>

      {hasError && (
        <Text className='ml-1 mt-1 text-[12px] text-danger'>{error}</Text>
      )}

      {modalVisible && (
        <ColorPickerDialog
          initialColor={initialColor}
          onClose={() => setModalVisible(false)}
          onSelect={(color) => {
            onChange(color);
            setModalVisible(false);
          }}
        />
      )}
    </View>
  );
}
