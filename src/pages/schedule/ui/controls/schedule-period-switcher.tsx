import { PeriodSwitcher } from '@/shared/ui/period-switcher';

import { useScheduleSlotContext } from '../../model/context/schedule-slot-context';
import { useScheduleViewMode } from '../../model/navigation/use-schedule-view-mode';

interface SchedulePeriodSwitcherProps {
  className?: string;
}

export function SchedulePeriodSwitcher({
  className,
}: SchedulePeriodSwitcherProps) {
  const viewMode = useScheduleViewMode();
  const {
    weekPeriod,
    weekLabel,
    monthLabel,
    handleResetToCurrent,
    handlePrev,
    handleNext,
  } = useScheduleSlotContext();

  return (
    <PeriodSwitcher
      className={className}
      weekPeriod={viewMode === 'week' ? weekPeriod : undefined}
      week={viewMode === 'week' ? weekLabel : undefined}
      month={viewMode !== 'week' ? monthLabel : undefined}
      onCalendarPress={handleResetToCurrent}
      onPreviousPress={handlePrev}
      onNextPress={handleNext}
    />
  );
}
