import { useCallback, useMemo, useState } from 'react';

import dayjs from 'dayjs';
import { View } from 'react-native';

import { cn } from '@/shared/lib/cn';
import { Text } from '@/shared/ui/text';

import { ScheduleCell } from './schedule-cell';
import { ScheduleDay } from './schedule-day';
import { SelectedColumnOverlay } from './selected-column-overlay';
import { getSelectedDayIndex, getTodayDayIndex } from '../model/get-selected-day-index';
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
  selectedDate?: dayjs.Dayjs | null;
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

  const [columnLayouts, setColumnLayouts] = useState<
    Record<number, { width: number; x: number }>
  >({});

  const handleColumnLayout = useCallback(
    (index: number, layout: { width: number; x: number }) => {
      setColumnLayouts((prev) => {
        const existing = prev[index];
        if (
          existing &&
          Math.abs(existing.x - layout.x) < 0.5 &&
          Math.abs(existing.width - layout.width) < 0.5
        ) {
          return prev;
        }
        return { ...prev, [index]: layout };
      });
    },
    [],
  );

  const todayDayIndex = useMemo(() => getTodayDayIndex(week), [week]);

  const selectedDayIndex = useMemo(
    () => getSelectedDayIndex({ selectedCell, selectedDate, week }),
    [selectedCell, selectedDate, week],
  );

  const getColumnGeometry = useCallback(
    (dayIndex: number) => {
      if (dayIndex < 0) return null;
      const colLayout = columnLayouts[dayIndex];
      if (colLayout) {
        return {
          left: leftColWidth + colLayout.x + 1,
          width: colLayout.width - 2,
        };
      }
      if (daysAreaWidth > 0 && daysCount > 0) {
        const colWidth = daysAreaWidth / daysCount;
        return {
          left: leftColWidth + dayIndex * colWidth + 1,
          width: colWidth - 2,
        };
      }
      return null;
    },
    [columnLayouts, daysAreaWidth, daysCount, leftColWidth],
  );

  const selectedColumnGeom = getColumnGeometry(selectedDayIndex);
  const showTodayColumn =
    todayDayIndex >= 0 && todayDayIndex !== selectedDayIndex;
  const todayColumnGeom = showTodayColumn
    ? getColumnGeometry(todayDayIndex)
    : null;

  return (
    <View className={cn('overflow-hidden rounded-12 mx-3 relative', className)}>
      {todayColumnGeom && (
        <SelectedColumnOverlay
          variant='today'
          width={todayColumnGeom.width}
          leftOffset={todayColumnGeom.left}
        />
      )}
      {selectedColumnGeom && (
        <SelectedColumnOverlay
          variant='selected'
          width={selectedColumnGeom.width}
          leftOffset={selectedColumnGeom.left}
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
              onLayout={(e) => {
                const { x, width } = e.nativeEvent.layout;
                handleColumnLayout(dayIndex, { x, width });
              }}
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

