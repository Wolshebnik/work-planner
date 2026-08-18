import { Pressable, View } from 'react-native';

import { Check } from '@/assets/svg';
import { cn } from '@/shared/lib/cn';
import { Text } from '@/shared/ui/text';

interface CheckboxProps {
  checked: boolean;
  className?: string;
  label: string;
  onCheckedChange: (checked: boolean) => void;
}

export function Checkbox({
  checked,
  label,
  onCheckedChange,
  className,
}: CheckboxProps) {
  return (
    <Pressable
      onPress={() => onCheckedChange(!checked)}
      className={cn('flex-row items-center gap-3', className)}
    >
      <View
        className={cn(
          'h-6 w-6 items-center justify-center rounded-6 border-2',
          checked
            ? 'border-primary bg-primary'
            : 'border-primary bg-transparent',
        )}
      >
        {checked && <Check className='text-white' />}
      </View>

      <Text className='text-[14px] text-primary'>{label}</Text>
    </Pressable>
  );
}
