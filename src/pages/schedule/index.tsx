import { useState } from 'react';

import dayjs from 'dayjs';
import { View, ScrollView } from 'react-native';
import weekOfYear from 'dayjs/plugin/weekOfYear';

import { Header } from '@/shared/ui/header';
import { SummaryList } from '@/widgets/summary-list';
import { ScheduleGrid } from '@/widgets/schedule-grid';
import { MonthViewPlaceholder } from '@/widgets/month-view';
import { PeriodSwitcher } from '@/shared/ui/period-switcher';
import { ViewSwitcher, type ViewMode } from '@/shared/ui/view-switcher';

import 'dayjs/locale/uk';

dayjs.extend(weekOfYear);
dayjs.locale('uk');

const employees = [
  {
    initials: 'ТН',
    name: 'Тесленко Наталія',
    values: [1, 4.5, 5, 5, 5, 2],
    monthTotal: 22.5,
  },
  {
    initials: 'ЧІ',
    name: 'Чумаченко Інна',
    values: [0, 2, 4, 5, 4.5, 1],
    monthTotal: 16.5,
  },
  {
    initials: 'ПМ',
    name: 'Панько Максим',
    values: [1, 5, 5, 5, 5, 2],
    monthTotal: 23,
  },
  {
    initials: 'ЧВ',
    name: 'Черник Віктор',
    values: [0, 3.5, 5, 5, 4.5, 2],
    monthTotal: 20,
  },
  {
    initials: 'КО',
    name: 'Кашкар Олена',
    values: [5, 5, 4, 4.5, 3, 1],
    monthTotal: 22.5,
  },
  {
    initials: 'ПА',
    name: 'Привал Андрій',
    values: [2, 4, 5, 5, 4, 2],
    monthTotal: 22,
  },
  {
    initials: 'ЖН',
    name: 'Жукова Наталія',
    values: [4.5, 5, 3.5, 5, 4, 1],
    monthTotal: 23,
  },
];

export function SchedulePage() {
  const [viewMode, setViewMode] = useState<ViewMode>('week');
  const [currentDate, setCurrentDate] = useState(dayjs());

  const startOfWeek = currentDate.startOf('isoWeek');
  const endOfWeek = startOfWeek.add(6, 'day');

  const weekPeriod = `${startOfWeek.format('D')}–${endOfWeek.format('D')} ${startOfWeek.format('MMMM YYYY')}`;
  const weekLabel = `Тиждень ${currentDate.week()}`;
  const monthLabel =
    currentDate.format('MMMM').charAt(0).toUpperCase() +
    currentDate.format('MMMM').slice(1) +
    ' ' +
    currentDate.format('YYYY');

  const handlePrev = () => {
    setCurrentDate((prev) =>
      viewMode === 'week'
        ? prev.subtract(1, 'week')
        : prev.subtract(1, 'month'),
    );
  };
  const handleNext = () => {
    setCurrentDate((prev) =>
      viewMode === 'week' ? prev.add(1, 'week') : prev.add(1, 'month'),
    );
  };

  return (
    <View className='flex-1 bg-background'>
      <Header title='Графік роботи' onBackPress={() => {}} />

      <ScrollView className='flex-1'>
        <View className='mt-2 mb-3 px-4'>
          <PeriodSwitcher
            className='mb-5'
            weekPeriod={viewMode === 'week' ? weekPeriod : undefined}
            week={viewMode === 'week' ? weekLabel : undefined}
            month={viewMode !== 'week' ? monthLabel : undefined}
            onPreviousPress={handlePrev}
            onNextPress={handleNext}
          />
          <ViewSwitcher value={viewMode} onChange={setViewMode} />
        </View>

        {viewMode === 'week' && (
          <ScheduleGrid className='mb-5' startDate={currentDate} />
        )}
        {viewMode === 'month' && <MonthViewPlaceholder />}
        {viewMode === 'summary' && (
          <SummaryList employees={employees} monthLabel={monthLabel} className='px-4' />
        )}
      </ScrollView>
    </View>
  );
}
