import { useState } from 'react';

import { ScrollView, View } from 'react-native';

import { Text } from '@/shared/ui/text';
import { Button } from '@/shared/ui/button';
import { Header } from '@/shared/ui/header';
import { StatusBadge } from '@/shared/ui/status-badge';
import { SectionTitle } from '@/shared/ui/section-title';
import { PeriodSwitcher } from '@/shared/ui/period-switcher';
import { ViewSwitcher, type ViewMode } from '@/shared/ui/view-switcher';

export default function HomeScreen() {
  const [viewMode, setViewMode] = useState<ViewMode>('week');

  return (
    <View className='flex-1 bg-background'>
      <Header title='Графік роботи' onBackPress={() => {}} />
      <ScrollView className='flex-1'>
        <PeriodSwitcher
          weekPeriod='2–8 березня 2026'
          week='Тиждень 10'
          className='mb-5'
        />
        <PeriodSwitcher month='Березень 2026' className='mb-5' />
        <ViewSwitcher value={viewMode} onChange={setViewMode} className='mb-5' />

        <SectionTitle text='ПІДСУМКИ ЗА БЕРЕЗЕНЬ' />

        <View className='items-center justify-center'>
          <View className='mb-4 flex-row gap-2'>
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
