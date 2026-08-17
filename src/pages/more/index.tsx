import { View, Platform, ScrollView, KeyboardAvoidingView } from 'react-native';

import { Header } from '@/shared/ui/header';
import { InputBase } from '@/shared/ui/input-base';
import { ButtonBase } from '@/shared/ui/button-base';
import { StatusBadge } from '@/shared/ui/status-badge';
import { ButtonLoader } from '@/shared/ui/button-loader';
import { SectionTitle } from '@/shared/ui/section-title';
import { EmployeeStatus } from '@/shared/config/employee-status';

export function MorePage() {
  return (
    <View className='flex-1'>
      <Header title='Ще' />
      <KeyboardAvoidingView
        className='flex-1'
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          className='flex-1'
          contentContainerClassName='items-center px-4 pb-6'
        >
          <SectionTitle text='ПІДСУМКИ ЗА БЕРЕЗЕНЬ' className='mb-4' />

          <View className='flex-row gap-2 mb-4'>
            <StatusBadge variant={EmployeeStatus.OFF.variant}>
              {EmployeeStatus.OFF.short}
            </StatusBadge>
            <StatusBadge variant={EmployeeStatus.ABSENT.variant}>
              {EmployeeStatus.ABSENT.short}
            </StatusBadge>
            <StatusBadge variant={EmployeeStatus.SICK.variant}>
              {EmployeeStatus.SICK.short}
            </StatusBadge>
            <StatusBadge variant={EmployeeStatus.VACATION.variant}>
              {EmployeeStatus.VACATION.short}
            </StatusBadge>
            <StatusBadge variant={EmployeeStatus.FIRED.variant}>
              {EmployeeStatus.FIRED.short}
            </StatusBadge>
          </View>

          <ButtonBase variant='warning'>warning</ButtonBase>
          <ButtonBase variant='success'>success</ButtonBase>
          <ButtonBase variant='danger'>danger</ButtonBase>
          <ButtonBase variant='maroon'>maroon</ButtonBase>
          <ButtonBase variant='purple'>purple</ButtonBase>

          <ButtonBase variant='warning' appearance='outline' className='mt-4'>
            warning
          </ButtonBase>
          <ButtonBase variant='success' appearance='outline'>
            success
          </ButtonBase>
          <ButtonBase variant='danger' appearance='outline'>
            danger
          </ButtonBase>
          <ButtonBase variant='maroon' appearance='outline'>
            maroon
          </ButtonBase>
          <ButtonBase variant='purple' appearance='outline'>
            purple
          </ButtonBase>
          <ButtonBase appearance='outline'>primary</ButtonBase>
          <ButtonLoader loading className='mt-4 ' loaderColor='#fff'>
            Button
          </ButtonLoader>
          <ButtonLoader
            loading
            loaderSize='large'
            loaderColor='#ff0000'
            appearance='outline'
            variant='danger'
            className='my-4 w-64 py-4'
          >
            Large red loader
          </ButtonLoader>

          <InputBase
            label='Email'
            placeholder='Email'
            className='mb-2 w-full max-w-[320px]'
          />
          <InputBase
            placeholder='Пароль'
            error='Неверный пароль'
            className='mb-2 w-full max-w-[320px]'
          />
          <InputBase
            label='Пароль'
            placeholder='Пароль'
            error='Неверный пароль'
            className='mb-2 w-full max-w-[320px]'
          />
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}
