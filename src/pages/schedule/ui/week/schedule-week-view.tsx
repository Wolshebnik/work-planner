import { useEffect } from 'react';

import type dayjs from 'dayjs';
import { View } from 'react-native';
import { GestureDetector } from 'react-native-gesture-handler';
import Animated from 'react-native-reanimated';

import type { Employee } from '@/entities/employee';
import { ExportScheduleSheet } from '@/features/export-schedule-sheet';

import { useScheduleSlotContext } from '../../model/context/schedule-slot-context';
import { useScheduleWeekPager } from '../../model/week/use-schedule-week-pager';
import { ScheduleWeekEditSheet } from './schedule-week-edit-sheet';
import { ScheduleWeekSlotItem } from './schedule-week-slot-item';

interface ScheduleWeekViewProps {
  activeEmployees?: Employee[];
  currentDate?: dayjs.Dayjs;
  onCellPress?: (employeeIndex: number, dayIndex: number) => void;
  onDateChange?: (newDate: dayjs.Dayjs) => void;
  selectedCell?: {
    dayIndex: number;
    employeeIndex: number;
  } | null;
  selectedDate?: dayjs.Dayjs | null;
}

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
