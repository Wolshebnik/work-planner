import { useState } from 'react';

import { useRouter } from 'expo-router';
import { View } from 'react-native';

import { DeleteConfirmationSheet } from '@/features/delete-employee/ui/delete-confirmation-sheet';
import {
  EditScheduleStatusForm,
  type FormValues,
} from '@/features/edit-schedule-status';
import { ROUTES } from '@/shared/config/routes';
import { BottomSheet } from '@/shared/ui/bottom-sheet';
import { ButtonBase } from '@/shared/ui/button-base';
import { Header } from '@/shared/ui/header';
import { SectionTitle } from '@/shared/ui/section-title';
import { Text } from '@/shared/ui/text';
import { ScheduleStatusesList } from '@/widgets/schedule-statuses-list';
import { ScheduleStatus } from '@/features/get-schedule-statuses';
import { useUpdateScheduleStatus } from '@/features/update-schedule-status';

const emptyFormValues: FormValues = {
  name: '',
  description: '',
  scheduleMark: '',
  excelMark: '',
  color: '#E1E2E5',
};

export function ScheduleStatusesPage() {
  const router = useRouter();

  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<FormValues | null>(null);
  const [deletingStatus, setDeletingStatus] = useState<ScheduleStatus | null>(
    null,
  );

  const updateStatus = useUpdateScheduleStatus();

  const handleClose = (): void => {
    setEditingId(null);
    setFormData(null);
    setDeletingStatus(null);
  };

  const handleSave = async (data: FormValues): Promise<void> => {
    if (!editingId) return;

    await updateStatus.mutateAsync({
      id: editingId,
      name: data.name,
      description: data.description,
      scheduleMark: data.scheduleMark,
      excelMark: data.excelMark,
      color: data.color,
      isActive: true,
    });

    handleClose();
  };

  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async (): Promise<void> => {
    setIsDeleting(true);
    console.log('Deleted:', deletingStatus?.name);
    setIsDeleting(false);
    handleClose();
  };

  const handleAddStatus = (): void => {
    setEditingId(null);
    setFormData(emptyFormValues);
  };

  const handleStatusPress = (status: ScheduleStatus): void => {
    setEditingId(status.id);
    setFormData({
      name: status.name,
      description: status.description ?? '',
      scheduleMark: status.schedule_mark ?? '',
      excelMark: status.excel_mark ?? '',
      color: status.color ?? '#E1E2E5',
    });
  };

  const isSheetOpen = editingId !== null || formData !== null;
  const isEditing = editingId !== null;

  return (
    <View className='flex-1'>
      <Header
        title='Статуси графіка'
        onBackPress={() => router.push(ROUTES.MORE)}
      />

      <View className='flex-row items-center justify-between px-6 mb-3'>
        <SectionTitle text={'Статуси'} className='font-bold text-[18px]' />

        <ButtonBase
          variant='primary'
          appearance='solid'
          onPress={handleAddStatus}
        >
          + Додати
        </ButtonBase>
      </View>

      <ScheduleStatusesList
        onStatusPress={handleStatusPress}
        onDeleteStatus={setDeletingStatus}
      />

      <BottomSheet
        isOpen={isSheetOpen}
        onClose={handleClose}
        title={
          isEditing && formData
            ? `Редагувати — ${formData.name}`
            : 'Додати статус'
        }
      >
        <EditScheduleStatusForm
          onCancel={handleClose}
          onSave={handleSave}
          initialValues={formData ?? undefined}
        />
      </BottomSheet>

      {deletingStatus && (
        <DeleteConfirmationSheet
          isOpen={!!deletingStatus}
          onClose={handleClose}
          onConfirm={handleDelete}
          isLoading={isDeleting}
          title='Видалення статусу'
          description={
            <View className='gap-2'>
              <Text className='text-[16px] text-text text-center'>
                Ви впевнені, що хочете видалити статус &nbsp;
                <Text className='text-[18px] text-danger'>
                  {`"${deletingStatus.name}"`}
                </Text>
                ?
              </Text>
              <Text className='text-[14px] text-placeholder text-center'>
                Видалення статусу приховає його для нових графіків. Історія
                старих графіків залишиться незмінною.
              </Text>
            </View>
          }
        />
      )}
    </View>
  );
}