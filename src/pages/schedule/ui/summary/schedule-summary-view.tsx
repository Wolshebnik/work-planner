import type dayjs from 'dayjs';

import type { Employee } from '@/entities/employee';
import { ScheduleSummaryContent } from './schedule-summary-content';
import type { AvatarColor } from '@/shared/config/avatar-color';

import { useScheduleSlotContext } from '../../model/context/schedule-slot-context';

interface ScheduleSummaryViewProps {
  activeEmployees?: Employee[];
  colorMap?: Map<string, AvatarColor>;
  date?: dayjs.Dayjs;
}

export function ScheduleSummaryView(props: ScheduleSummaryViewProps) {
  const context = useScheduleSlotContext();
  const date = props.date ?? context.currentDate;
  const activeEmployees = props.activeEmployees ?? context.activeEmployees;
  const colorMap = props.colorMap ?? context.colorMap;

  return (
    <ScheduleSummaryContent
      date={date}
      activeEmployees={activeEmployees}
      colorMap={colorMap}
    />
  );
}
