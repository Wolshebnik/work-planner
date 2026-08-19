import type dayjs from 'dayjs';
import { ScrollView, View } from 'react-native';

import { EditSchedule } from '@/features/edit-schedule';
import { BottomSheet } from '@/shared/ui/bottom-sheet';
import { CircularProgressLoader } from '@/shared/ui/circular-progress-loader';
import { Header } from '@/shared/ui/header';
import { PeriodSwitcher } from '@/shared/ui/period-switcher';
import { type ViewMode, ViewSwitcher } from '@/shared/ui/view-switcher';
import { MonthViewPlaceholder } from '@/widgets/month-view';

import { useSchedulePage } from '../model/use-schedule-page';
import { useSchedulePager } from '../model/use-schedule-pager';
import { SchedulePeriodPager } from './schedule-period-pager';
import { ScheduleSummaryContent } from './schedule-summary-content';
import { ScheduleWeekContent } from './schedule-week-content';

export function SchedulePage() {
  const {
    viewMode,
    setViewMode,
    currentDate,
    isBottomSheetOpen,
    selectedCell,
    activeEmployees,
    colorMap,
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

  const {
    pageWidth,
    pageOffset,
    previousDate,
    nextDate,
    swipeGesture,
    animatedStyle,
    handleLayout,
    commitNext,
    commitPrev,
    resetPager,
  } = useSchedulePager({
    currentDate,
    viewMode,
    onNext: handleNext,
    onPrev: handlePrev,
  });

  const onCalendarPress = () => {
    resetPager();
    handleResetToCurrent();
  };

  const onViewModeChange = (mode: ViewMode) => {
    resetPager();
    setViewMode(mode);
  };

  const renderPage = (pageDate: dayjs.Dayjs, isCurrentPage: boolean) => {
    if (viewMode === 'week') {
      return (
        <ScheduleWeekContent
          date={pageDate}
          activeEmployees={activeEmployees}
          selectedCell={isCurrentPage ? selectedCell : null}
          onCellPress={handleCellPress}
        />
      );
    }

    if (viewMode === 'month') {
      return (
        <MonthViewPlaceholder
          startDate={pageDate}
          isCurrentPage={isCurrentPage}
        />
      );
    }

    return (
      <ScheduleSummaryContent
        date={pageDate}
        activeEmployees={activeEmployees}
        colorMap={colorMap}
      />
    );
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
            onCalendarPress={onCalendarPress}
            onPreviousPress={commitPrev}
            onNextPress={commitNext}
          />
          <ViewSwitcher value={viewMode} onChange={onViewModeChange} />
        </View>

        {isLoading ? (
          <View className='h-64 items-center justify-center'>
            <CircularProgressLoader size='large' />
          </View>
        ) : (
          <SchedulePeriodPager
            animatedStyle={animatedStyle}
            pageOffset={pageOffset}
            pageWidth={pageWidth}
            renderCurrent={() => renderPage(currentDate, true)}
            renderNext={() => renderPage(nextDate, false)}
            renderPrevious={() => renderPage(previousDate, false)}
            swipeGesture={swipeGesture}
            viewModeKey={viewMode}
            onLayout={handleLayout}
          />
        )}
      </ScrollView>

      <BottomSheet
        title={bottomSheetTitle}
        isOpen={isBottomSheetOpen}
        onClose={handleClose}
      >
        <EditSchedule
          onClear={handleClearCell}
          onSelectStatus={handleStatusSelect}
        />
      </BottomSheet>
    </View>
  );
}


