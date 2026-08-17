import { View } from 'react-native';

import { Lock } from '@/assets/svg';
import { EmployeeStatus } from '@/shared/config/employee-status';
import { ButtonBase } from '@/shared/ui/button-base';
import type { ButtonVariant } from '@/shared/ui/button-base/button-appearance';
import { Text } from '@/shared/ui/text';

interface EditScheduleProps {
  onLock: () => void;
  onStatusChange: (statusKey: string) => void;
}

export function EditSchedule({ onStatusChange, onLock }: EditScheduleProps) {
  return (
    <View className='flex-row flex-wrap gap-2'>
      {(['WORK', 'OFF'] as const).map((key) => {
        const config = EmployeeStatus[key];
        return (
          <ButtonBase
            key={key}
            appearance='solid'
            variant={config.variant as ButtonVariant}
            className='grow'
            onPress={() => onStatusChange(key)}
          >
            {config.label}
          </ButtonBase>
        );
      })}

      <ButtonBase
        appearance='solid'
        variant='danger'
        className='grow flex-row items-center justify-center gap-2'
        onPress={onLock}
      >
        <Lock className='h-4 w-4 text-white' />
        <Text className='text-white font-bold text-[14px] leading-[20px]'>
          Вихідний
        </Text>
      </ButtonBase>

      {(['SICK', 'VACATION', 'ABSENT', 'ST'] as const).map((key) => {
        const config = EmployeeStatus[key];
        return (
          <ButtonBase
            key={key}
            appearance='solid'
            variant={config.variant as ButtonVariant}
            className='grow'
            onPress={() => onStatusChange(key)}
          >
            {config.label}
          </ButtonBase>
        );
      })}

      <View className='flex-row gap-2 w-full'>
        <ButtonBase
          appearance='solid'
          variant={EmployeeStatus.FIRED.variant as ButtonVariant}
          className='flex-1'
          onPress={() => onStatusChange('FIRED')}
        >
          {EmployeeStatus.FIRED.label}
        </ButtonBase>
        <ButtonBase
          appearance='solid'
          variant={EmployeeStatus.NA.variant as ButtonVariant}
          className='flex-2'
          onPress={() => onStatusChange('NA')}
        >
          {EmployeeStatus.NA.label}
        </ButtonBase>
      </View>
    </View>
  );
}
