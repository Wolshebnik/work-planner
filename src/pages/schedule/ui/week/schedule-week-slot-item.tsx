import { memo } from 'react';

import type dayjs from 'dayjs';

import type { Employee } from '@/entities/employee';

import { ScheduleWeekContent } from './schedule-week-content';

export interface ScheduleWeekSlotItemProps {
  employees: Employee[];
  date: dayjs.Dayjs;
  isCurrent: boolean;
  onCellPress: (
    employeeId: string | undefined,
    employeeIndex: number,
    dayIndex: number,
  ) => void;
  selectedCell: {
    dayIndex: number;
    employeeIndex: number;
  } | null;
  selectedDate?: dayjs.Dayjs | null;
}

export const ScheduleWeekSlotItem = memo(
  function ScheduleWeekSlotItem({
    date,
    employees,
    isCurrent,
    selectedCell,
    selectedDate,
    onCellPress,
  }: ScheduleWeekSlotItemProps) {
    return (
      <ScheduleWeekContent
        date={date}
        isCurrent={isCurrent}
        employees={employees}
        selectedCell={isCurrent ? selectedCell : null}
        selectedDate={isCurrent ? selectedDate : null}
        onCellPress={onCellPress}
      />
    );
  },
  (prev, next) => {
    if (!prev.date.isSame(next.date, 'day')) return false;
    if (prev.employees !== next.employees) return false;
    if (prev.isCurrent !== next.isCurrent) return false;
    if (prev.selectedCell !== next.selectedCell) return false;
    if (prev.selectedDate !== next.selectedDate) return false;

    return true;
  },
);
