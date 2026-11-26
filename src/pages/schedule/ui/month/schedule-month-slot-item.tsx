import { memo } from 'react';

import type dayjs from 'dayjs';

import type { Employee } from '@/entities/employee';
import type { DayEmployeeStats } from '@/widgets/month-view';

import { ScheduleMonthContent } from './schedule-month-content';

export interface ScheduleMonthSlotItemProps {
  employees: Employee[];
  date: dayjs.Dayjs;
  isCurrentPage: boolean;
  onDayPress?: (
    day: dayjs.Dayjs,
    statsByDate?: Map<string, DayEmployeeStats>,
  ) => void;
  selectedDate?: dayjs.Dayjs | null;
}

export const ScheduleMonthSlotItem = memo(
  function ScheduleMonthSlotItem({
    date,
    employees,
    isCurrentPage,
    selectedDate,
    onDayPress,
  }: ScheduleMonthSlotItemProps) {
    return (
      <ScheduleMonthContent
        date={date}
        employees={employees}
        isCurrentPage={isCurrentPage}
        selectedDate={selectedDate}
        onDayPress={onDayPress}
      />
    );
  },
  (prev, next) => {
    if (!prev.date.isSame(next.date, 'month')) return false;
    if (prev.employees !== next.employees) return false;
    if (prev.isCurrentPage !== next.isCurrentPage) return false;
    if (prev.selectedDate !== next.selectedDate) return false;

    return true;
  },
);
