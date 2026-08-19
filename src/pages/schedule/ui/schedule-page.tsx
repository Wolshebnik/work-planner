import { useCallback, useEffect } from 'react';

import type dayjs from 'dayjs';
import { ScrollView, View } from 'react-native';
import { useQueryClient } from '@tanstack/react-query';

import { EditSchedule } from '@/features/edit-schedule';
import { preparePagerMonths } from '@/features/get-schedule-by-month';
import { BottomSheet } from '@/shared/ui/bottom-sheet';
import { CircularProgressLoader } from '@/shared/ui/circular-progress-loader';
import { Header } from '@/shared/ui/header';
import { PeriodSwitcher } from '@/shared/ui/period-switcher';
import { type ViewMode, ViewSwitcher } from '@/shared/ui/view-switcher';
import { ScheduleMonthContent } from './schedule-month-content';
import { SchedulePeriodPager } from './schedule-period-pager';
import { ScheduleSummaryContent } from './schedule-summary-content';
import { ScheduleWeekContent } from './schedule-week-content';
import { useSchedulePage } from '../model/use-schedule-page';
import { useSchedulePager } from '../model/use-schedule-pager';

export function SchedulePage() {
  const queryClient = useQueryClient();
  const {
    viewMode,
    setViewMode,
    currentDate,
    setCurrentDate,
    isBottomSheetOpen,
    selectedCell,
    activeEmployees,
    colorMap,
    weekPeriod,
    weekLabel,
    monthLabel,
    isLoading,
    bottomSheetTitle,
    handleResetToCurrent,
    handleCellPress,
    handleClose,
    handleStatusSelect,
    handleClearCell,
  } = useSchedulePage();

  const {
    currentDate: pagerCurrentDate,
    slots,
    pageWidth,
    swipeGesture,
    animatedStyle,
    handleLayout,
    navigate,
    resetPager,
  } = useSchedulePager({
    initialDate: currentDate,
    viewMode,
    onDateChange: setCurrentDate,
  });

  useEffect(() => {
    if (viewMode === 'month') {
      void preparePagerMonths(pagerCurrentDate, viewMode, queryClient);
    }
  }, [pagerCurrentDate, viewMode, queryClient]);

  const onCalendarPress = () => {
    resetPager();
    handleResetToCurrent();
  };

  const onViewModeChange = (mode: ViewMode) => {
    resetPager(pagerCurrentDate);
    setViewMode(mode);
  };

  const renderPage = useCallback(
    (pageDate: dayjs.Dayjs, isCurrentPage: boolean) => {
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
          <ScheduleMonthContent
            date={pageDate}
            activeEmployees={activeEmployees}
            colorMap={colorMap}
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
    },
    [viewMode, activeEmployees, selectedCell, handleCellPress, colorMap],
  );

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
            onPreviousPress={() => navigate(-1)}
            onNextPress={() => navigate(1)}
          />
          <ViewSwitcher value={viewMode} onChange={onViewModeChange} />
        </View>

        {isLoading ? (
          <View className='h-96 items-center justify-center'>
            <CircularProgressLoader size='large' />
          </View>
        ) : (
          <SchedulePeriodPager
            animatedStyle={animatedStyle}
            pageWidth={pageWidth}
            renderPage={renderPage}
            slots={slots}
            swipeGesture={swipeGesture}
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



