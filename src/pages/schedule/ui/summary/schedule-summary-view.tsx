import { useEffect } from 'react';

import type dayjs from 'dayjs';
import { View } from 'react-native';
import { GestureDetector } from 'react-native-gesture-handler';
import Animated from 'react-native-reanimated';

import type { Employee } from '@/entities/employee';
import { ExportSummarySheet } from '@/features/export-summary-sheet';
import type { AvatarColor } from '@/shared/config/avatar-color';

import { useScheduleSlotContext } from '../../model/context/schedule-slot-context';
import { useScheduleSummaryPager } from '../../model/summary/use-schedule-summary-pager';
import { ScheduleSummarySlotItem } from './schedule-summary-slot-item';

interface ScheduleSummaryViewProps {
  activeEmployees?: Employee[];
  colorMap?: Map<string, AvatarColor>;
  date?: dayjs.Dayjs;
  onDateChange?: (newDate: dayjs.Dayjs) => void;
}

export function ScheduleSummaryView(props: ScheduleSummaryViewProps) {
  const context = useScheduleSlotContext();

  const currentDate = props.date ?? context.currentDate;
  const onDateChange = props.onDateChange ?? context.setCurrentDate;
  const activeEmployees = props.activeEmployees ?? context.activeEmployees;
  const colorMap = props.colorMap ?? context.colorMap;

  const {
    slots,
    pageWidth,
    swipeGesture,
    animatedStyle,
    handleLayout,
    navigate,
  } = useScheduleSummaryPager({
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

  return (
    <View className='w-full overflow-hidden' onLayout={handleLayout}>
      {pageWidth > 0 ? (
        <GestureDetector gesture={swipeGesture}>
          <Animated.View style={animatedStyle} collapsable={false}>
            {slots.map((slot) => (
              <View
                key={`summary-slot-${slot.index}`}
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
                  <ScheduleSummarySlotItem
                    date={slot.date}
                    activeEmployees={activeEmployees}
                    colorMap={colorMap}
                    isCurrent={slot.isCurrent}
                  />
                ) : null}
              </View>
            ))}
          </Animated.View>
        </GestureDetector>
      ) : (
        <ScheduleSummarySlotItem
          date={currentSlot.date}
          activeEmployees={activeEmployees}
          colorMap={colorMap}
          isCurrent
        />
      )}

      <ExportSummarySheet
        date={currentDate}
        isOpen={isExportOpen}
        onClose={handleCloseExport}
      />
    </View>
  );
}
