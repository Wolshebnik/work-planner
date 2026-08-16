import { useState, useCallback } from 'react';

import dayjs from 'dayjs';
import { View, ScrollView } from 'react-native';
import weekOfYear from 'dayjs/plugin/weekOfYear';

import { Header } from '@/shared/ui/header';
import { SummaryList } from '@/widgets/summary-list';
import { BottomSheet } from '@/shared/ui/bottom-sheet';
import { ScheduleGrid } from '@/widgets/schedule-grid';
import { EditSchedule } from '@/features/edit-schedule';
import { MonthViewPlaceholder } from '@/widgets/month-view';
import { PeriodSwitcher } from '@/shared/ui/period-switcher';
import { scheduleData } from '@/widgets/schedule-grid/model';
import { EmployeeStatus } from '@/shared/config/employee-status';
import { ViewSwitcher, type ViewMode } from '@/shared/ui/view-switcher';
import { prepareWeeklyData } from '@/widgets/schedule-grid/lib/prepare-weekly-data';

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
  const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(false);
  const [data, setData] = useState(scheduleData);
  const [selectedCell, setSelectedCell] = useState<{
    employeeIndex: number;
    dayIndex: number;
  } | null>(null);

  const handleCellPress = useCallback(
    (employeeIndex: number, dayIndex: number) => {
      setSelectedCell({ employeeIndex, dayIndex });
      setIsBottomSheetOpen(true);
    },
    [],
  );

  const handleClose = useCallback(() => {
    setIsBottomSheetOpen(false);
    setSelectedCell(null);
  }, []);

  const startOfWeek = currentDate.startOf('isoWeek');
  const endOfWeek = startOfWeek.add(6, 'day');

  const weeklyData = prepareWeeklyData(data, startOfWeek);

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

  const handleStatusChange = (statusKey: string) => {
    if (!selectedCell) return;

    setData((prev) => {
      const newData = [...prev];
      const { employeeIndex, dayIndex } = selectedCell;
      const day = startOfWeek.add(dayIndex, 'day');
      const dateStr = day.format('YYYY-MM-DD');

      const employee = newData[employeeIndex];
      const valueIndex = employee.values.findIndex((v) => v.date === dateStr);

      if (valueIndex !== -1) {
        newData[employeeIndex].values[valueIndex] = {
          ...newData[employeeIndex].values[valueIndex],
          short: EmployeeStatus[statusKey as keyof typeof EmployeeStatus].short,
        };
      } else {
        newData[employeeIndex].values.push({
          date: dateStr,
          short: EmployeeStatus[statusKey as keyof typeof EmployeeStatus].short,
        });
      }
      return newData;
    });

    setIsBottomSheetOpen(false);
    setSelectedCell(null);
  };

  const getBottomSheetTitle = () => {
    if (!selectedCell) return 'Деталі зміни';
    const employeeName = data[selectedCell.employeeIndex].name;
    const day = startOfWeek.add(selectedCell.dayIndex, 'day');
    return `${employeeName}, ${day.format('D MMMM')}`;
  };

  const handleLockCell = () => {
    if (!selectedCell) return;

    setData((prev) => {
      const newData = [...prev];
      const { employeeIndex, dayIndex } = selectedCell;
      const day = startOfWeek.add(dayIndex, 'day');
      const dateStr = day.format('YYYY-MM-DD');

      const employee = newData[employeeIndex];
      const valueIndex = employee.values.findIndex((v) => v.date === dateStr);

      if (valueIndex !== -1) {
        newData[employeeIndex].values[valueIndex] = {
          ...newData[employeeIndex].values[valueIndex],
          short: '-',
          isLocked: true,
        };
      } else {
        newData[employeeIndex].values.push({
          date: dateStr,
          short: '-',
          isLocked: true,
        });
      }
      return newData;
    });

    setIsBottomSheetOpen(false);
    setSelectedCell(null);
  };

  return (
    <View className='flex-1'>
      <Header title='Графік роботи' />

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
          <ScheduleGrid
            className='mb-5'
            startDate={currentDate}
            data={weeklyData}
            selectedCell={selectedCell}
            onCellPress={handleCellPress}
          />
        )}
        {viewMode === 'month' && <MonthViewPlaceholder startDate={currentDate} />}
        {viewMode === 'summary' && (
          <SummaryList
            employees={employees}
            monthLabel={monthLabel}
            className='px-4'
          />
        )}
      </ScrollView>

      <BottomSheet
        title={getBottomSheetTitle()}
        isOpen={isBottomSheetOpen}
        onClose={handleClose}
      >
        <EditSchedule onStatusChange={handleStatusChange} onLock={handleLockCell} />
      </BottomSheet>
    </View>
  );
}
