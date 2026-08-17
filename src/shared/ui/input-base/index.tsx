import { BottomSheetTextInput } from '@gorhom/bottom-sheet';
import { TextInput, type TextInputProps, View } from 'react-native';

import { cn } from '@/shared/lib/cn';

import { Text } from '../text';

export interface InputBaseProps extends TextInputProps {
  bottomSheet?: boolean;
  error?: string;
  label?: string;
  required?: boolean;
}

export function InputBase({
  error,
  label,
  bottomSheet = false,
  className,
  required,
  ...props
}: InputBaseProps) {
  const hasError = Boolean(error);

  const InputComponent = bottomSheet ? BottomSheetTextInput : TextInput;

  const borderClassName = hasError ? 'border-danger' : 'border-primary';

  const inputClassName = cn(
    'pl-4 pr-4',
    'text-[16px] text-text',
    'outline-none',
    'placeholder:text-placeholder',
  );

  return (
    <View className={cn('w-full', className)}>
      {label ? (
        <View className={cn('relative h-14 rounded-8 border', borderClassName)}>
          <View className='absolute -top-2.5 left-3 z-10 flex-row items-center bg-background px-1'>
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

          <InputComponent className={cn(inputClassName, 'flex-1')} {...props} />
        </View>
      ) : (
        <InputComponent
          className={cn(
            inputClassName,
            'h-14 rounded-8 border',
            borderClassName,
          )}
          {...props}
        />
      )}

      {hasError && (
        <Text className='ml-1 mt-1 text-[12px] text-danger'>{error}</Text>
      )}
    </View>
  );
}
