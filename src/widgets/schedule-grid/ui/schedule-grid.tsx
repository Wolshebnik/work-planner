import { View } from 'react-native';
import dayjs from 'dayjs';

import { cn } from '@/shared/lib/cn';
import { Text } from '@/shared/ui/text';

import { ScheduleDay } from './schedule-day';
import { ScheduleCell } from './schedule-cell';
import { getWeekDays, scheduleData } from '../model';
/** Ширина колонки с именем сотрудника (px). Фиксированная, чтобы не «расползалась» по длине строки. */
interface ScheduleGridProps {
  className?: string;
  startDate?: dayjs.Dayjs;
  /** Кол-во колонок-дней (по умолчанию 7). */
  daysCount?: number;
  /** Начальная колонка-день для сетки (по умолчанию Пн). */
  weekStartDay?: number;
  /** Клик по ячейке. */
  onCellPress?: (employeeIndex: number, dayIndex: number) => void;
}

export function ScheduleGrid({
  className,
  startDate = dayjs(),
  daysCount = 7,
  weekStartDay = 0,
  onCellPress,
}: ScheduleGridProps) {
  const week = getWeekDays(startDate);

  return (
    <View className={cn('overflow-hidden rounded-12 mx-3', className)}>
      {/* Шапка */}
      <View className='flex-row items-stretch border-b border-border'>
        <View className='w-[96px] shrink-0 items-center justify-center py-3'>
          <Text className='font-medium text-[11px] leading-4 text-text/60'>
            СПІВРОБІТНИК
          </Text>
        </View>

        <View className='flex-1 flex-row justify-between'>
          {week.slice(weekStartDay, weekStartDay + daysCount).map((day) => (
            <View
              key={day.date.format('YYYY-MM-DD')}
              className='w-8.5 items-center justify-center py-3'
            >
              <ScheduleDay day={day} />
            </View>
          ))}
        </View>
      </View>

      {/* Строки сотрудников */}
      {scheduleData.map((row, employeeIndex) => (
        <View
          key={row.name}
          className='flex-row items-stretch border-b border-border/40 last:border-b-0 py-2'
        >
          <View
            className='items-start justify-center pl-2 py-2 w-[96px]'
            // style={{ width: NAME_COLUMN_WIDTH }}
          >
            <Text className='font-medium text-[13px] leading-5 text-text'>
              {row.name}
            </Text>
          </View>

          {/* Зазор 4px между бейджами */}

          <View className='flex-1 flex-row justify-between'>
            {row.values
              .slice(weekStartDay, weekStartDay + daysCount)
              .map((value, offset) => {
                const dayIndex = weekStartDay + offset;

                return (
                  <ScheduleCell
                    key={`-${employeeIndex}-${dayIndex}`}
                    value={value}
                    onPress={() => onCellPress?.(employeeIndex, dayIndex)}
                  />
                );
              })}
          </View>
        </View>
      ))}
    </View>
  );
}
