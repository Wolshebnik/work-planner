import { memo } from 'react';

import type dayjs from 'dayjs';
import { View } from 'react-native';
import { GestureDetector } from 'react-native-gesture-handler';
import Animated from 'react-native-reanimated';

import type { Employee } from '@/entities/employee';
import type { AvatarColor } from '@/shared/config/avatar-color';

import { useScheduleSlotContext } from '../../model/context/schedule-slot-context';
import { useScheduleMonthPager } from '../../model/month/use-schedule-month-pager';
import { ScheduleMonthContent } from './schedule-month-content';

interface ScheduleMonthViewProps {
  activeEmployees?: Employee[];
  colorMap?: Map<string, AvatarColor>;
  date?: dayjs.Dayjs;
  onDateChange?: (newDate: dayjs.Dayjs) => void;
}

interface ScheduleMonthSlotItemProps {
  activeEmployees: Employee[];
  colorMap: Map<string, AvatarColor>;
  date: dayjs.Dayjs;
  isCurrentPage: boolean;
}

const ScheduleMonthSlotItem = memo(
  function ScheduleMonthSlotItem({
    date,
    activeEmployees,
    colorMap,
    isCurrentPage,
  }: ScheduleMonthSlotItemProps) {
    return (
      <ScheduleMonthContent
        date={date}
        activeEmployees={activeEmployees}
        colorMap={colorMap}
        isCurrentPage={isCurrentPage}
      />
    );
  },
  (prev, next) => {
    if (!prev.date.isSame(next.date, 'month')) return false;
    if (prev.activeEmployees !== next.activeEmployees) return false;
    if (prev.colorMap !== next.colorMap) return false;
    return true;
  },
);

export function ScheduleMonthView(props: ScheduleMonthViewProps) {
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
  } = useScheduleMonthPager({
    currentDate,
    onDateChange,
  });

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
                    colorMap={colorMap}
                    isCurrentPage={slot.isCurrent}
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
          colorMap={colorMap}
          isCurrentPage
        />
      )}
    </View>
  );
}
