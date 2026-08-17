import { useState } from 'react';

import { BottomSheet } from '@/shared/ui/bottom-sheet';

import {
  type EmployeeDetailsMode,
  type EmployeeDetailsSheetProps,
} from '../model/schema';
import { DetailsView } from './details-view';
import { EditView } from './edit-view';

export function EmployeeDetailsSheet({
  employee,
  isOpen,
  onClose,
  onArchive,
  onSave,
  initialMode = 'details',
}: EmployeeDetailsSheetProps) {
  const [mode, setMode] = useState<EmployeeDetailsMode>(initialMode);

  if (!employee || !isOpen) return null;

  const handleEditPress = () => {
    setMode('edit');
  };

  const handleBack = () => {
    setMode('details');
  };

  const handleClose = () => {
    setMode('details');
    onClose();
  };

  return (
    <BottomSheet
      isOpen={isOpen}
      onClose={handleClose}
      title={mode === 'details' ? 'Працівник' : 'Редагувати ім’я'}
    >
      {mode === 'details' ? (
        <DetailsView
          employee={employee}
          onEditPress={handleEditPress}
          onArchive={onArchive}
        />
      ) : (
        <EditView
          defaultValues={{
            lastName: employee.name.split(' ')[0] ?? '',
            firstName: employee.name.split(' ')[1] ?? '',
            middleName: employee.name.split(' ')[2] ?? '',
          }}
          onSave={onSave}
          onCancel={handleBack}
          onClose={handleClose}
        />
      )}
    </BottomSheet>
  );
}
