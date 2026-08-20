import type dayjs from 'dayjs';

import { BottomSheet } from '@/shared/ui/bottom-sheet';

import { useExportSchedule } from '../model/use-export-schedule';
import { ExportScheduleConfirmation } from './export-schedule-confirmation';

interface ExportScheduleSheetProps {
  date: dayjs.Dayjs;
  isOpen: boolean;
  onClose: () => void;
}

export function ExportScheduleSheet({
  date,
  isOpen,
  onClose,
}: ExportScheduleSheetProps) {
  const { isLoading, handleExport } = useExportSchedule(onClose);

  return (
    <BottomSheet
      title='Відправка у Google Sheets'
      isOpen={isOpen}
      onClose={onClose}
    >
      <ExportScheduleConfirmation
        key={date.format('YYYY-MM-DD')}
        date={date}
        isLoading={isLoading}
        onCancel={onClose}
        onConfirm={handleExport}
      />
    </BottomSheet>
  );
}
