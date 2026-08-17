import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';
import { View } from 'react-native';

import { ButtonBase } from '@/shared/ui/button-base';
import { ButtonLoader } from '@/shared/ui/button-loader';
import { ColorPickerInput } from '@/shared/ui/color-picker-input';
import { InputBase } from '@/shared/ui/input-base';

import { type FormValues, schema } from '../model/schema';

interface Props {
  onCancel: () => void;
  onSave: (data: FormValues) => Promise<void>;
}

export const EditScheduleStatusForm = ({ onCancel, onSave }: Props) => {
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: '',
      shortName: '',
      dbMark: '',
      color: '#E1E2E5',
      workingHours: '',
    },
  });

  return (
    <View className='flex-1 gap-4'>
      <Controller
        control={control}
        name='name'
        render={({ field: { onChange, value } }) => (
          <InputBase
            bottomSheet
            label='Назва'
            placeholder='Назва'
            labelColor='#fff'
            required
            value={value}
            onChangeText={onChange}
            error={errors.name?.message}
          />
        )}
      />

      <Controller
        control={control}
        name='shortName'
        render={({ field: { onChange, value } }) => (
          <InputBase
            bottomSheet
            label='Позначка в графіку'
            placeholder='Позначка в графіку'
            labelColor='#fff'
            required
            value={value}
            onChangeText={onChange}
            error={errors.shortName?.message}
          />
        )}
      />

      <Controller
        control={control}
        name='dbMark'
        render={({ field: { onChange, value } }) => (
          <InputBase
            bottomSheet
            label='Позначка в базе'
            placeholder='Позначка в базе'
            labelColor='#fff'
            required
            value={value}
            onChangeText={onChange}
            error={errors.dbMark?.message}
          />
        )}
      />

      <Controller
        control={control}
        name='color'
        render={({ field: { onChange, value } }) => (
          <ColorPickerInput
            label='Колір'
            value={value}
            onChange={onChange}
            required
            error={errors.color?.message}
          />
        )}
      />

      <Controller
        control={control}
        name='workingHours'
        render={({ field: { onChange, value } }) => (
          <InputBase
            bottomSheet
            label='Рахується як робочий день'
            placeholder='Введіть кількість робочих годин'
            labelColor='#fff'
            required
            value={value}
            onChangeText={onChange}
            error={errors.workingHours?.message}
          />
        )}
      />

      <View className='flex-row gap-3 justify-end'>
        <ButtonBase
          variant='primary'
          appearance='outline'
          className='w-30'
          disabled={isSubmitting}
          onPress={onCancel}
        >
          Скасувати
        </ButtonBase>

        <ButtonLoader
          variant='primary'
          appearance='solid'
          className='w-35'
          loaderColor='#fff'
          loading={isSubmitting}
          onPress={handleSubmit(onSave)}
        >
          Зберегти
        </ButtonLoader>
      </View>
    </View>
  );
};
