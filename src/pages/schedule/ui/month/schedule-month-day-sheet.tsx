import type dayjs from 'dayjs';

import type { AvatarColor } from '@/shared/config/avatar-color';
import { BottomSheet } from '@/shared/ui/bottom-sheet';
import {
  type DayEmployeeStats,
  DayScheduleDetails,
} from '@/widgets/month-view';

interface ScheduleMonthDaySheetProps {
  colorMap?: Map<string, AvatarColor>;
  dayStats?: DayEmployeeStats;
  isOpen: boolean;
  onClose: () => void;
  selectedDate: dayjs.Dayjs | null;
}

export function ScheduleMonthDaySheet({
  isOpen,
  selectedDate,
  dayStats,
  colorMap,
  onClose,
}: ScheduleMonthDaySheetProps) {
  const formattedDate = selectedDate ? selectedDate.format('dd, D MMMM') : '';
  const title = formattedDate
    ? formattedDate.charAt(0).toUpperCase() + formattedDate.slice(1)
    : 'Деталі зміни';

  return (
    <BottomSheet isOpen={isOpen} title={title} onClose={onClose}>
      <DayScheduleDetails
        selectedDate={selectedDate}
        dayStats={dayStats}
        colorMap={colorMap}
      />
    </BottomSheet>
  );
}
