import { EditSchedule } from '@/features/edit-schedule';
import { BottomSheet } from '@/shared/ui/bottom-sheet';
import { Text } from 'react-native';

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
    blockedMessage,
  } = useScheduleSlotContext();

  return (
    <BottomSheet
      title={bottomSheetTitle}
      isOpen={isBottomSheetOpen}
      onClose={handleClose}
    >
      {blockedMessage ? (
        <Text className='px-5 py-4 text-base text-foreground'>
          {blockedMessage}
        </Text>
      ) : (
        <EditSchedule
          isFillingDay={isFillingDay}
          onClear={handleClearCell}
          onFillDayForAll={handleFillDayForAll}
          onSelectStatus={handleStatusSelect}
        />
      )}
    </BottomSheet>
  );
}
