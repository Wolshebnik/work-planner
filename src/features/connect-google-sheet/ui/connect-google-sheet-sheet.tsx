import { BottomSheet } from '@/shared/ui/bottom-sheet';

import { type ConnectGoogleSheetFormValues } from '../model/schema';
import { ConnectGoogleSheetForm } from './connect-google-sheet-form';

interface ConnectGoogleSheetSheetProps {
  initialValues?: ConnectGoogleSheetFormValues | null;
  isEditing?: boolean;
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: ConnectGoogleSheetFormValues) => void | Promise<void>;
  sheetId?: string | null;
}

export function ConnectGoogleSheetSheet({
  isOpen,
  isEditing = false,
  sheetId,
  initialValues,
  onClose,
  onSave,
}: ConnectGoogleSheetSheetProps) {
  return (
    <BottomSheet
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? 'Редагувати таблицю' : 'Додати Google Таблицю'}
    >
      <ConnectGoogleSheetForm
        key={sheetId ?? (isOpen ? 'add' : 'closed')}
        initialValues={initialValues ?? undefined}
        onCancel={onClose}
        onSave={onSave}
      />
    </BottomSheet>
  );
}
