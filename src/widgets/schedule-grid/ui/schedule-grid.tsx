import { useMemo, useState } from 'react';

import dayjs from 'dayjs';
import { View } from 'react-native';

import { cn } from '@/shared/lib/cn';
import { Text } from '@/shared/ui/text';

import { ScheduleCell } from './schedule-cell';
import { ScheduleDay } from './schedule-day';
import { SelectedColumnOverlay } from './selected-column-overlay';
import { getSelectedDayIndex } from '../model/get-selected-day-index';
import { getWeekDays } from '../model/get-week-days';
import { type EmployeeRow } from '../model/types';

interface ScheduleGridProps {
  className?: string;
  data?: EmployeeRow[];
  daysCount?: number;
  onCellPress?: (employeeIndex: number, dayIndex: number) => void;
  selectedCell?: {
    dayIndex: number;
    employeeIndex: number;
  } | null;
  selectedDate?: dayjs.Dayjs;
  startDate?: dayjs.Dayjs;
  weekStartDay?: number;
}

export function ScheduleGrid({
  className,
  startDate = dayjs(),
  daysCount = 7,
  weekStartDay = 0,
  onCellPress,
  data = [],
  selectedCell,
  selectedDate,
}: ScheduleGridProps) {
  const week = useMemo(() => getWeekDays(startDate), [startDate]);
  const [leftColWidth, setLeftColWidth] = useState(96);
  const [daysAreaWidth, setDaysAreaWidth] = useState(0);

  const selectedDayIndex = useMemo(
    () => getSelectedDayIndex({ selectedCell, selectedDate, week }),
    [selectedCell, selectedDate, week],
  );

  const dayColumnWidth = daysCount > 0 && daysAreaWidth > 0 ? daysAreaWidth / daysCount : 0;
  const selectedLeft = leftColWidth + selectedDayIndex * dayColumnWidth;

  return (
    <View className={cn('overflow-hidden rounded-12 mx-3 relative', className)}>
      {selectedDayIndex >= 0 && daysAreaWidth > 0 && (
        <SelectedColumnOverlay
          dayColumnWidth={dayColumnWidth}
          leftOffset={selectedLeft}
        />
      )}

      <View className='flex-row items-stretch border-b border-border/60'>
        <View
          onLayout={(e) => setLeftColWidth(e.nativeEvent.layout.width)}
          className='w-[96px] shrink-0 items-center justify-end pr-1 pb-2'
        >
          <Text className='font-medium text-[9px] leading-3 text-text/60'>
            СПІВРОБІТНИК
          </Text>
        </View>

        <View
          onLayout={(e) => setDaysAreaWidth(e.nativeEvent.layout.width)}
          className='flex-1 flex-row relative z-10'
          style={{ zIndex: 2 }}
        >
          {week.slice(weekStartDay, weekStartDay + daysCount).map((day, dayIndex) => (
            <View
              key={day.date.format('YYYY-MM-DD')}
              className='flex-1 items-center justify-center py-2'
            >
              <ScheduleDay
                day={day}
                isSelected={dayIndex === selectedDayIndex}
              />
            </View>
          ))}
        </View>
      </View>

      {data.map((row, employeeIndex) => (
        <View
          key={row.id ?? `${row.name}-${employeeIndex}`}
          className={cn(
            'flex-row items-stretch py-2',
            employeeIndex % 2 === 1 ? 'bg-neutral/80' : 'bg-transparent',
          )}
        >
          <View className='items-start justify-center pl-2 py-2 w-[96px]'>
            <Text
              className='font-medium text-[13px] leading-5 text-text'
              numberOfLines={1}
              ellipsizeMode='tail'
            >
              {row.name}
            </Text>
          </View>

          <View className='flex-1 flex-row relative z-10' style={{ zIndex: 2 }}>
            {row.values.map((value, dayIndex) => (
              <View
                key={`-${row.id ?? employeeIndex}-${dayIndex}`}
                className='flex-1 items-center justify-center'
              >
                <ScheduleCell
                  value={value}
                  isSelected={
                    selectedCell?.employeeIndex === employeeIndex &&
                    selectedCell?.dayIndex === dayIndex
                  }
                  onPress={() => {
                    onCellPress?.(employeeIndex, dayIndex);
                  }}
                />
              </View>
            ))}
          </View>
        </View>
      ))}
    </View>
  );
}

