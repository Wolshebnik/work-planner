import { useState } from 'react';

import { View } from 'react-native';

import { Button } from '@/shared/ui/button';
import { Header } from '@/shared/ui/header';
import { BottomSheet } from '@/shared/ui/bottom-sheet';
import { StatusBadge } from '@/shared/ui/status-badge';
import { SectionTitle } from '@/shared/ui/section-title';
import { EmployeeStatus } from '@/shared/config/employee-status';

export function MorePage() {
  const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(false);
  return (
    <View className='flex-1'>
      <Header title='Ще' />

      <SectionTitle text='ПІДСУМКИ ЗА БЕРЕЗЕНЬ' />

      <View className='items-center justify-center'>
        <View className='flex-row gap-2 mb-4'>
          <StatusBadge variant={EmployeeStatus.OFF.variant}>{EmployeeStatus.OFF.short}</StatusBadge>
          <StatusBadge variant={EmployeeStatus.ABSENT.variant}>{EmployeeStatus.ABSENT.short}</StatusBadge>
          <StatusBadge variant={EmployeeStatus.SICK.variant}>{EmployeeStatus.SICK.short}</StatusBadge>
          <StatusBadge variant={EmployeeStatus.VACATION.variant}>{EmployeeStatus.VACATION.short}</StatusBadge>
          <StatusBadge variant={EmployeeStatus.FIRED.variant}>{EmployeeStatus.FIRED.short}</StatusBadge>
        </View>

        <Button variant='warning'>warning</Button>
        <Button variant='success'>success</Button>
        <Button variant='danger'>danger</Button>
        <Button variant='maroon'>maroon</Button>
        <Button variant='purple'>purple</Button>

        <Button variant='warning' appearance='outline' className='mt-4'>
          warning
        </Button>
        <Button variant='success' appearance='outline'>
          success
        </Button>
        <Button variant='danger' appearance='outline'>
          danger
        </Button>
        <Button variant='maroon' appearance='outline'>
          maroon
        </Button>
        <Button variant='purple' appearance='outline'>
          purple
        </Button>
        <Button appearance='outline'>primary</Button>
      </View>

      <BottomSheet
        isOpen={isBottomSheetOpen}
        onClose={() => setIsBottomSheetOpen(false)}
        title='Ср, 4 березня'
      >
        <View className='flex-row gap-2 mb-4'>
          <StatusBadge variant={EmployeeStatus.OFF.variant}>{EmployeeStatus.OFF.short}</StatusBadge>
          <StatusBadge variant={EmployeeStatus.ABSENT.variant}>{EmployeeStatus.ABSENT.short}</StatusBadge>
          <StatusBadge variant={EmployeeStatus.SICK.variant}>{EmployeeStatus.SICK.short}</StatusBadge>
          <StatusBadge variant={EmployeeStatus.VACATION.variant}>{EmployeeStatus.VACATION.short}</StatusBadge>
          <StatusBadge variant={EmployeeStatus.FIRED.variant}>{EmployeeStatus.FIRED.short}</StatusBadge>
        </View>
      </BottomSheet>
    </View>
  );
}
