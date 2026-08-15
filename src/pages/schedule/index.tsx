import { useState } from 'react';

import { View, ScrollView } from 'react-native';

import { Button } from '@/shared/ui/button';
import { Header } from '@/shared/ui/header';
import { BottomSheet } from '@/shared/ui/bottom-sheet';
import { StatusBadge } from '@/shared/ui/status-badge';
import { SectionTitle } from '@/shared/ui/section-title';
import { PeriodSwitcher } from '@/shared/ui/period-switcher';
import { EmployeeSummaryCard } from '@/shared/ui/employee-summary-card';
import { ViewSwitcher, type ViewMode } from '@/shared/ui/view-switcher';

const employees = Array.from({ length: 5 }, () => ({
  initials: 'ЧІ',
  name: 'Чумаченко Інна',
  values: [0, 2, 4, 5, 4.5, 1],
  monthTotal: 16.5,
}));

export function SchedulePage() {
  const [viewMode, setViewMode] = useState<ViewMode>('week');
  const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(false);

  return (
    <View className='flex-1 bg-background'>
      <Header title='Графік роботи' onBackPress={() => {}} />
      <ScrollView className='flex-1'>
        <PeriodSwitcher
          weekPeriod='2–8 березня 2026'
          week='Тиждень 10'
          className='mb-5'
          onCalendarPress={() => setIsBottomSheetOpen(true)}
        />

        <PeriodSwitcher
          month='Березень 2026'
          className='mb-5'
          onCalendarPress={() => setIsBottomSheetOpen(true)}
        />

        <ViewSwitcher
          value={viewMode}
          onChange={setViewMode}
          className='mb-5'
        />

        <SectionTitle text='ПІДСУМКИ ЗА БЕРЕЗЕНЬ' />

        {employees.map((employee, index) => (
          <EmployeeSummaryCard
            {...employee}
            key={index}
            className='mb-5'
          />
        ))}

        <View className='items-center justify-center'>
          <View className='flex-row gap-2 mb-4'>
            <StatusBadge variant='success'>Р</StatusBadge>
            <StatusBadge variant='danger'>В</StatusBadge>
            <StatusBadge variant='warning'>П</StatusBadge>
            <StatusBadge variant='purple'>Л</StatusBadge>
            <StatusBadge variant='maroon'>Б</StatusBadge>
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
      </ScrollView>

      <BottomSheet
        isOpen={isBottomSheetOpen}
        onClose={() => setIsBottomSheetOpen(false)}
        title='Ср, 4 березня'
      >
        <View className='flex-row gap-2 mb-4'>
          <StatusBadge variant='success'>Р</StatusBadge>
          <StatusBadge variant='danger'>В</StatusBadge>
          <StatusBadge variant='warning'>П</StatusBadge>
          <StatusBadge variant='purple'>Л</StatusBadge>
          <StatusBadge variant='maroon'>Б</StatusBadge>
        </View>
      </BottomSheet>
    </View>
  );
}
