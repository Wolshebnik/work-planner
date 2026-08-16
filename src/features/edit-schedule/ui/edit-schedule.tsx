import { View } from 'react-native';
import { Lock } from '@/assets/svg';
import { Text } from '@/shared/ui/text';
import { Button } from '@/shared/ui/button';
import { EmployeeStatus } from '@/shared/config/employee-status';
import type { ButtonVariant } from '@/shared/ui/button/button-appearance';

interface EditScheduleProps {
  onStatusChange: (statusKey: string) => void;
  onLock: () => void;
}

export function EditSchedule({ onStatusChange, onLock }: EditScheduleProps) {
  return (
    <View className='flex-row flex-wrap gap-2'>
      {(['WORK', 'OFF'] as const).map((key) => {
        const config = EmployeeStatus[key];
        return (
          <Button
            key={key}
            appearance='solid'
            variant={config.variant as ButtonVariant}
            className='grow'
            onPress={() => onStatusChange(key)}
          >
            {config.label}
          </Button>
        );
      })}

      <Button
        appearance='solid'
        variant='danger'
        className='grow flex-row items-center justify-center gap-2'
        onPress={onLock}
      >
        <Lock className='h-4 w-4 text-white' />
        <Text className='text-white font-bold text-[14px] leading-[20px]'>
          Вихідний
        </Text>
      </Button>

      {(['SICK', 'VACATION', 'ABSENT', 'ST'] as const).map((key) => {
        const config = EmployeeStatus[key];
        return (
          <Button
            key={key}
            appearance='solid'
            variant={config.variant as ButtonVariant}
            className='grow'
            onPress={() => onStatusChange(key)}
          >
            {config.label}
          </Button>
        );
      })}

      <View className='flex-row gap-2 w-full'>
        <Button
          appearance='solid'
          variant={EmployeeStatus.FIRED.variant as ButtonVariant}
          className='flex-1'
          onPress={() => onStatusChange('FIRED')}
        >
          {EmployeeStatus.FIRED.label}
        </Button>
        <Button
          appearance='solid'
          variant={EmployeeStatus.NA.variant as ButtonVariant}
          className='flex-2'
          onPress={() => onStatusChange('NA')}
        >
          {EmployeeStatus.NA.label}
        </Button>
      </View>
    </View>
  );
}
