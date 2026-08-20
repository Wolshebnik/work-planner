import { Header } from '@/shared/ui/header';
import { ScheduleExportButton } from './schedule-export-button';

export function ScheduleSlotHeader() {
  return (
    <Header
      title='Графік роботи'
      rightAction={<ScheduleExportButton />}
    />
  );
}
