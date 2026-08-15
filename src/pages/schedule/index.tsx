import { useState } from 'react';

import { View, ScrollView } from 'react-native';

import { Button } from '@/shared/ui/button';
import { Header } from '@/shared/ui/header';
import { StatusBadge } from '@/shared/ui/status-badge';
import { SectionTitle } from '@/shared/ui/section-title';
import { PeriodSwitcher } from '@/shared/ui/period-switcher';
import { shuffleAvatarColors } from '@/shared/config/avatar-color';
import { EmployeeSummaryCard } from '@/shared/ui/employee-summary-card';
import { ViewSwitcher, type ViewMode } from '@/shared/ui/view-switcher';

const employees = Array.from({ length: 5 }, () => ({
  initials: 'ЧІ',
  name: 'Чумаченко Ірина',
  values: [0, 2, 4, 5, 4.5, 1],
  monthTotal: 16.5,
}));

export function SchedulePage() {
  const [viewMode, setViewMode] = useState<ViewMode>('week');
  const shuffledAvatarColors = shuffleAvatarColors();

  return (
    <View className='flex-1 bg-background'>
      <Header title='Графік роботи' onBackPress={() => {}} />
      <ScrollView className='flex-1'>
        <PeriodSwitcher weekPeriod='2–8 березня 2026' week='Тиждень 10' className='mb-5' />

        <PeriodSwitcher month='Березень 2026' className='mb-5' />

        <ViewSwitcher value={viewMode} onChange={setViewMode} className='mb-5' />

        <SectionTitle text='ПІДСУМКИ ЗА БЕРЕЗЕНЬ' />

        {employees.map((employee, index) => (
          <EmployeeSummaryCard
            {...employee}
            key={index}
            avatarColor={shuffledAvatarColors[index % shuffledAvatarColors.length]}
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
          <Button>primary</Button>
        </View>
      </ScrollView>
    </View>
  );
}
