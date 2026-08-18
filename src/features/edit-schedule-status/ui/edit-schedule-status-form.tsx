import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';
import { View } from 'react-native';

import { ButtonBase } from '@/shared/ui/button-base';
import { ButtonLoader } from '@/shared/ui/button-loader';
import { Checkbox } from '@/shared/ui/checkbox';
import { ColorPickerInput } from '@/shared/ui/color-picker-input';
import { InputBase } from '@/shared/ui/input-base';

import { type FormValues, schema } from '../model/schema';

interface Props {
  initialValues?: FormValues | undefined;
  onCancel: () => void;
  onSave: (data: FormValues) => Promise<void>;
}

export const EditScheduleStatusForm = ({
  onCancel,
  onSave,
  initialValues,
}: Props) => {
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema) as any,
    defaultValues: initialValues ?? {
      name: '',
      description: '',
      scheduleMark: '',
      excelMark: '',
      color: '#E1E2E5',
      isLocked: false,
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
        name='description'
        render={({ field: { onChange, value } }) => (
          <InputBase
            bottomSheet
            label='Опис'
            placeholder='Короткий опис статусу'
            labelColor='#fff'
            required
            value={value}
            onChangeText={onChange}
            error={errors.description?.message}
          />
        )}
      />

      <Controller
        control={control}
        name='scheduleMark'
        render={({ field: { onChange, value } }) => (
          <InputBase
            bottomSheet
            label='Позначка в графіку'
            placeholder='Позначка в графіку'
            labelColor='#fff'
            required
            value={value}
            onChangeText={onChange}
            error={errors.scheduleMark?.message}
          />
        )}
      />

      <Controller
        control={control}
        name='excelMark'
        render={({ field: { onChange, value } }) => (
          <InputBase
            bottomSheet
            label='Позначка в Excel'
            placeholder='Позначка в Excel'
            labelColor='#fff'
            required
            value={value}
            onChangeText={onChange}
            error={errors.excelMark?.message}
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
        name='isLocked'
        render={({ field: { onChange, value } }) => (
          <Checkbox
            checked={value}
            className='mb-4'
            label='Забронювати вихідний'
            onCheckedChange={onChange}
          />
        )}
      />

      <View className='flex-row gap-3 justify-end'>
        <ButtonBase
          variant='primary'
          appearance='outline'
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
