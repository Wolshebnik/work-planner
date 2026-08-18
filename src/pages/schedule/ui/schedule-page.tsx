import { ScrollView, View } from 'react-native';

import { EditSchedule } from '@/features/edit-schedule';
import { BottomSheet } from '@/shared/ui/bottom-sheet';
import { CircularProgressLoader } from '@/shared/ui/circular-progress-loader';
import { Header } from '@/shared/ui/header';
import { PeriodSwitcher } from '@/shared/ui/period-switcher';
import { ViewSwitcher } from '@/shared/ui/view-switcher';
import { MonthViewPlaceholder } from '@/widgets/month-view';
import { ScheduleGrid } from '@/widgets/schedule-grid';
import { SummaryList } from '@/widgets/summary-list';

import { employeesSummaryMock } from '../model/mock';
import { useSchedulePage } from '../model/use-schedule-page';

export function SchedulePage() {
  const {
    viewMode,
    setViewMode,
    currentDate,
    isBottomSheetOpen,
    selectedStatusId,
    isClearing,
    selectedCell,
    weeklyData,
    weekPeriod,
    weekLabel,
    monthLabel,
    isLoading,
    bottomSheetTitle,
    handlePrev,
    handleNext,
    handleResetToCurrent,
    handleCellPress,
    handleClose,
    handleStatusSelect,
    handleClearCell,
  } = useSchedulePage();

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
            onCalendarPress={handleResetToCurrent}
            onPreviousPress={handlePrev}
            onNextPress={handleNext}
          />
          <ViewSwitcher value={viewMode} onChange={setViewMode} />
        </View>

        {viewMode === 'week' && (
          isLoading ? (
            <View className='h-64 items-center justify-center'>
              <CircularProgressLoader size='large' />
            </View>
          ) : (
            <ScheduleGrid
              className='mb-5'
              startDate={currentDate}
              data={weeklyData}
              selectedCell={selectedCell}
              onCellPress={handleCellPress}
            />
          )
        )}

        {viewMode === 'month' && (
          <MonthViewPlaceholder startDate={currentDate} />
        )}

        {viewMode === 'summary' && (
          <SummaryList
            employees={employeesSummaryMock}
            monthLabel={monthLabel}
            className='px-4'
          />
        )}
      </ScrollView>

      <BottomSheet
        title={bottomSheetTitle}
        isOpen={isBottomSheetOpen}
        onClose={handleClose}
      >
        <EditSchedule
          isClearing={isClearing}
          loadingStatusId={selectedStatusId}
          onClear={handleClearCell}
          onSelectStatus={handleStatusSelect}
        />
      </BottomSheet>
    </View>
  );
}
