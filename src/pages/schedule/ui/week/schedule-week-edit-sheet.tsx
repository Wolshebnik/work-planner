import { EditSchedule } from '@/features/edit-schedule';
import { BottomSheet } from '@/shared/ui/bottom-sheet';

import { useScheduleSlotContext } from '../../model/context/schedule-slot-context';

export function ScheduleWeekEditSheet() {
  const {
    isBottomSheetOpen,
    bottomSheetTitle,
    handleClose,
    handleClearCell,
    handleFillDayForAll,
    handleStatusSelect,
    isFillingDay,
  } = useScheduleSlotContext();

  return (
    <BottomSheet
      title={bottomSheetTitle}
      isOpen={isBottomSheetOpen}
      onClose={handleClose}
    >
      <EditSchedule
        isFillingDay={isFillingDay}
        onClear={handleClearCell}
        onFillDayForAll={handleFillDayForAll}
        onSelectStatus={handleStatusSelect}
      />
    </BottomSheet>
  );
}
