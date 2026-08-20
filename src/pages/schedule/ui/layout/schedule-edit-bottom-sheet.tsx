import { EditSchedule } from '@/features/edit-schedule';
import { BottomSheet } from '@/shared/ui/bottom-sheet';

import { useScheduleSlotContext } from '../../model/context/schedule-slot-context';

export function ScheduleEditBottomSheet() {
  const {
    isBottomSheetOpen,
    bottomSheetTitle,
    handleClose,
    handleClearCell,
    handleStatusSelect,
  } = useScheduleSlotContext();

  return (
    <BottomSheet
      title={bottomSheetTitle}
      isOpen={isBottomSheetOpen}
      onClose={handleClose}
    >
      <EditSchedule
        onClear={handleClearCell}
        onSelectStatus={handleStatusSelect}
      />
    </BottomSheet>
  );
}
