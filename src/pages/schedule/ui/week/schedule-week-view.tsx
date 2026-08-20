import { memo, useEffect } from 'react';

import type dayjs from 'dayjs';
import { View } from 'react-native';
import { GestureDetector } from 'react-native-gesture-handler';
import Animated from 'react-native-reanimated';

import type { Employee } from '@/entities/employee';
import { ExportScheduleSheet } from '@/features/export-schedule-sheet';

import { useScheduleSlotContext } from '../../model/context/schedule-slot-context';
import { useScheduleWeekPager } from '../../model/week/use-schedule-week-pager';
import { ScheduleWeekContent } from './schedule-week-content';
import { ScheduleWeekEditSheet } from './schedule-week-edit-sheet';

interface ScheduleWeekViewProps {
  activeEmployees?: Employee[];
  currentDate?: dayjs.Dayjs;
  onCellPress?: (employeeIndex: number, dayIndex: number) => void;
  onDateChange?: (newDate: dayjs.Dayjs) => void;
  selectedCell?: {
 dayIndex: number; employeeIndex: number 
} | null;
  selectedDate?: dayjs.Dayjs | null;
}
interface ScheduleWeekSlotItemProps {
  activeEmployees: Employee[];
  date: dayjs.Dayjs;
  isCurrent: boolean;
  onCellPress: (employeeIndex: number, dayIndex: number) => void;
  selectedCell: {
 dayIndex: number; employeeIndex: number 
} | null;
  selectedDate?: dayjs.Dayjs | null;
}

const ScheduleWeekSlotItem = memo(
  function ScheduleWeekSlotItem({
    date,
    activeEmployees,
    isCurrent,
    selectedCell,
    selectedDate,
    onCellPress,
  }: ScheduleWeekSlotItemProps) {
    return (
      <ScheduleWeekContent
        date={date}
        activeEmployees={activeEmployees}
        selectedCell={isCurrent ? selectedCell : null}
        selectedDate={isCurrent ? selectedDate : null}
        onCellPress={onCellPress}
      />
    );
  },
  (prev, next) => {
    if (!prev.date.isSame(next.date, 'day')) return false;
    if (prev.activeEmployees !== next.activeEmployees) return false;
    if (prev.isCurrent !== next.isCurrent) return false;
    if (prev.selectedCell !== next.selectedCell) return false;
    if (prev.selectedDate !== next.selectedDate) return false;
    return true;
  },
);

export function ScheduleWeekView(props: ScheduleWeekViewProps) {
  const context = useScheduleSlotContext();

  const currentDate = props.currentDate ?? context.currentDate;
  const onDateChange = props.onDateChange ?? context.setCurrentDate;
  const activeEmployees = props.activeEmployees ?? context.activeEmployees;
  const selectedCell = props.selectedCell ?? context.selectedCell;
  const selectedDate = props.selectedDate ?? context.selectedDate;
  const onCellPress = props.onCellPress ?? context.handleCellPress;

  const {
    slots,
    pageWidth,
    swipeGesture,
    animatedStyle,
    handleLayout,
    navigate,
  } = useScheduleWeekPager({
    currentDate,
    onDateChange,
  });

  const { registerNavigateHandler, isExportOpen, handleCloseExport } = context;

  useEffect(() => {
    registerNavigateHandler(navigate);
    return () => {
      registerNavigateHandler(null);
    };
  }, [navigate, registerNavigateHandler]);

  const currentSlot = slots.find((s) => s.isCurrent) ?? slots[0];
  const activeDate = currentSlot.date;

  return (
    <View className='w-full overflow-hidden' onLayout={handleLayout}>
      {pageWidth > 0 ? (
        <GestureDetector gesture={swipeGesture}>
          <Animated.View style={animatedStyle} collapsable={false}>
            {slots.map((slot) => (
              <View
                key={`slot-${slot.index}`}
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
                  <ScheduleWeekSlotItem
                    date={slot.date}
                    activeEmployees={activeEmployees}
                    isCurrent={slot.isCurrent}
                    selectedCell={selectedCell}
                    selectedDate={selectedDate}
                    onCellPress={onCellPress}
                  />
                ) : null}
              </View>
            ))}
          </Animated.View>
        </GestureDetector>
      ) : (
        <ScheduleWeekSlotItem
          date={currentSlot.date}
          activeEmployees={activeEmployees}
          isCurrent
          selectedCell={selectedCell}
          selectedDate={selectedDate}
          onCellPress={onCellPress}
        />
      )}

      <ScheduleWeekEditSheet />

      <ExportScheduleSheet
        date={activeDate}
        isOpen={isExportOpen}
        onClose={handleCloseExport}
      />
    </View>
  );
}
