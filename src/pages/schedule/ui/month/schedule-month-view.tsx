import { memo, useCallback, useEffect, useState } from 'react';

import type dayjs from 'dayjs';
import { View } from 'react-native';
import { GestureDetector } from 'react-native-gesture-handler';
import Animated from 'react-native-reanimated';

import type { Employee } from '@/entities/employee';
import type { AvatarColor } from '@/shared/config/avatar-color';
import type { DayEmployeeStats } from '@/widgets/month-view';

import { useScheduleSlotContext } from '../../model/context/schedule-slot-context';
import { useScheduleMonthPager } from '../../model/month/use-schedule-month-pager';
import { ScheduleMonthContent } from './schedule-month-content';
import { ScheduleMonthDaySheet } from './schedule-month-day-sheet';

interface ScheduleMonthViewProps {
  activeEmployees?: Employee[];
  colorMap?: Map<string, AvatarColor>;
  date?: dayjs.Dayjs;
  onDateChange?: (newDate: dayjs.Dayjs) => void;
}

interface ScheduleMonthSlotItemProps {
  activeEmployees: Employee[];
  date: dayjs.Dayjs;
  isCurrentPage: boolean;
  onDayPress?: (
    day: dayjs.Dayjs,
    statsByDate?: Map<string, DayEmployeeStats>,
  ) => void;
  selectedDate?: dayjs.Dayjs | null;
}

const ScheduleMonthSlotItem = memo(
  function ScheduleMonthSlotItem({
    date,
    activeEmployees,
    isCurrentPage,
    selectedDate,
    onDayPress,
  }: ScheduleMonthSlotItemProps) {
    return (
      <ScheduleMonthContent
        date={date}
        activeEmployees={activeEmployees}
        isCurrentPage={isCurrentPage}
        selectedDate={selectedDate}
        onDayPress={onDayPress}
      />
    );
  },
  (prev, next) => {
    if (!prev.date.isSame(next.date, 'month')) return false;
    if (prev.activeEmployees !== next.activeEmployees) return false;
    if (prev.isCurrentPage !== next.isCurrentPage) return false;
    if (prev.selectedDate !== next.selectedDate) return false;
    return true;
  },
);

export function ScheduleMonthView(props: ScheduleMonthViewProps) {
  const context = useScheduleSlotContext();

  const currentDate = props.date ?? context.currentDate;
  const onDateChange = props.onDateChange ?? context.setCurrentDate;
  const activeEmployees = props.activeEmployees ?? context.activeEmployees;
  const colorMap = props.colorMap ?? context.colorMap;

  const [selectedDay, setSelectedDay] = useState<dayjs.Dayjs | null>(null);
  const [selectedDayStats, setSelectedDayStats] = useState<
    DayEmployeeStats | undefined
  >(undefined);
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  const handleDayPress = useCallback(
    (day: dayjs.Dayjs, statsByDate?: Map<string, DayEmployeeStats>) => {
      setSelectedDay(day);
      const dateKey = day.format('YYYY-MM-DD');
      setSelectedDayStats(statsByDate?.get(dateKey));
      setIsSheetOpen(true);
    },
    [],
  );

  const handleSheetClose = useCallback(() => {
    setIsSheetOpen(false);
    setSelectedDay(null);
    setSelectedDayStats(undefined);
  }, []);

  const {
    slots,
    pageWidth,
    swipeGesture,
    animatedStyle,
    handleLayout,
    navigate,
  } = useScheduleMonthPager({
    currentDate,
    onDateChange,
  });

  const { registerNavigateHandler } = context;

  useEffect(() => {
    registerNavigateHandler(navigate);
    return () => {
      registerNavigateHandler(null);
    };
  }, [navigate, registerNavigateHandler]);

  const currentSlot = slots.find((s) => s.isCurrent) ?? slots[0];

  return (
    <View className='w-full overflow-hidden' onLayout={handleLayout}>
      {pageWidth > 0 ? (
        <GestureDetector gesture={swipeGesture}>
          <Animated.View style={animatedStyle} collapsable={false}>
            {slots.map((slot) => (
              <View
                key={`month-slot-${slot.index}`}
                style={[
                  {
                    left: slot.logicalPage * pageWidth,
                    width: pageWidth,
                  },
                  slot.isCurrent
                    ? undefined
                    : {
                        position: 'absolute',
                        top: 0,
                      },
                ]}
              >
                {slot.isCurrent || slot.isReady ? (
                  <ScheduleMonthSlotItem
                    date={slot.date}
                    activeEmployees={activeEmployees}
                    isCurrentPage={slot.isCurrent}
                    selectedDate={slot.isCurrent ? selectedDay : null}
                    onDayPress={slot.isCurrent ? handleDayPress : undefined}
                  />
                ) : null}
              </View>
            ))}
          </Animated.View>
        </GestureDetector>
      ) : (
        <ScheduleMonthSlotItem
          date={currentSlot.date}
          activeEmployees={activeEmployees}
          isCurrentPage
          selectedDate={selectedDay}
          onDayPress={handleDayPress}
        />
      )}

      <ScheduleMonthDaySheet
        isOpen={isSheetOpen}
        selectedDate={selectedDay}
        dayStats={selectedDayStats}
        colorMap={colorMap}
        onClose={handleSheetClose}
      />
    </View>
  );
}
