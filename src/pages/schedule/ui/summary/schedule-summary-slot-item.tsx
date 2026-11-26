import { memo } from 'react';

import type dayjs from 'dayjs';

import type { Employee } from '@/entities/employee';
import type { AvatarColor } from '@/shared/config/avatar-color';

import { ScheduleSummaryContent } from './schedule-summary-content';

export interface ScheduleSummarySlotItemProps {
  employees: Employee[];
  colorMap: Map<string, AvatarColor>;
  date: dayjs.Dayjs;
  isCurrent: boolean;
}

export const ScheduleSummarySlotItem = memo(
  function ScheduleSummarySlotItem({
    date,
    employees,
    colorMap,
    isCurrent,
  }: ScheduleSummarySlotItemProps) {
    return (
      <ScheduleSummaryContent
        date={date}
        employees={employees}
        colorMap={colorMap}
        isCurrent={isCurrent}
      />
    );
  },
  (prev, next) => {
    if (prev.isCurrent !== next.isCurrent) return false;
    if (!prev.date.isSame(next.date, 'month')) return false;
    if (prev.employees !== next.employees) return false;
    if (prev.colorMap !== next.colorMap) return false;

    return true;
  },
);
