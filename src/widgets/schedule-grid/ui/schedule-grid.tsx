import dayjs from 'dayjs';
import { View } from 'react-native';

import { cn } from '@/shared/lib/cn';
import { Text } from '@/shared/ui/text';

import { ScheduleCell } from './schedule-cell';
import { ScheduleDay } from './schedule-day';
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
}: ScheduleGridProps) {
  const week = getWeekDays(startDate);

  return (
    <View className={cn('overflow-hidden rounded-12 mx-3', className)}>
      <View className='flex-row items-stretch border-b border-border gap-y-1'>
        <View className='w-[96px] shrink-0 items-center justify-end pr-1 pb-4'>
          <Text className='font-medium text-[9px] leading-3 text-text/60'>
            СПІВРОБІТНИК
          </Text>
        </View>

        <View className='flex-1 flex-row justify-between pr-1 py-3'>
          {week.slice(weekStartDay, weekStartDay + daysCount).map((day) => (
            <View
              key={day.date.format('YYYY-MM-DD')}
              className='w-8.5 items-center justify-center '
            >
              <ScheduleDay day={day} />
            </View>
          ))}
        </View>
      </View>

      {data.map((row, employeeIndex) => (
        <View
          key={row.id ?? `${row.name}-${employeeIndex}`}
          className='flex-row items-stretch border-b border-border/40 last:border-b-0 py-2'
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

          <View className='flex-1 flex-row justify-between pr-1'>
            {row.values.map((value, dayIndex) => (
              <ScheduleCell
                key={`-${row.id ?? employeeIndex}-${dayIndex}`}
                value={value}
                isSelected={
                  selectedCell?.employeeIndex === employeeIndex &&
                  selectedCell?.dayIndex === dayIndex
                }
                onPress={() => {
                  onCellPress?.(employeeIndex, dayIndex);
                }}
              />
            ))}
          </View>
        </View>
      ))}
    </View>
  );
}
