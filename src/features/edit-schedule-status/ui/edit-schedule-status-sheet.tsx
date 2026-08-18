import { BottomSheet } from '@/shared/ui/bottom-sheet';

import { type FormValues } from '../model/schema';
import { EditScheduleStatusForm } from './edit-schedule-status-form';

interface EditScheduleStatusSheetProps {
  initialValues?: FormValues | null;
  isEditing?: boolean;
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: FormValues) => Promise<void>;
  statusId?: string | null;
}

export function EditScheduleStatusSheet({
  isOpen,
  isEditing = false,
  statusId,
  initialValues,
  onClose,
  onSave,
}: EditScheduleStatusSheetProps) {
  return (
    <BottomSheet
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? 'Редагувати статус' : 'Додати статус'}
    >
      <EditScheduleStatusForm
        key={statusId ?? (isOpen ? 'add' : 'closed')}
        onCancel={onClose}
        onSave={onSave}
        initialValues={initialValues ?? undefined}
      />
    </BottomSheet>
  );
}
