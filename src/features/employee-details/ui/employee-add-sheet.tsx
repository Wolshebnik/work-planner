import { BottomSheet } from '@/shared/ui/bottom-sheet';

import { type EmployeeDetailsSheetProps } from '../model/schema';
import { EditView } from './edit-view';

export function EmployeeAddSheet({
  employee,
  isOpen,
  onClose,
  onSave,
}: EmployeeDetailsSheetProps) {
  if (!employee || !isOpen) return null;

  return (
    <BottomSheet isOpen={isOpen} onClose={onClose} title='Додати працівника'>
      <EditView
        defaultValues={{
          lastName: employee.name.split(' ')[0] ?? '',
          firstName: employee.name.split(' ')[1] ?? '',
          middleName: employee.name.split(' ')[2] ?? '',
        }}
        onSave={onSave}
        onCancel={onClose}
        onClose={onClose}
      />
    </BottomSheet>
  );
}
