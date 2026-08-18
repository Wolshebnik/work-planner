import { useState } from 'react';

import { useRouter } from 'expo-router';
import { View } from 'react-native';

import { DeleteConfirmationSheet } from '@/features/delete-employee/ui/delete-confirmation-sheet';
import {
  EditScheduleStatusForm,
  type FormValues,
} from '@/features/edit-schedule-status';
import { ScheduleStatus } from '@/features/get-schedule-statuses';
import { useAddScheduleStatus } from '@/features/add-schedule-status';
import { useUpdateScheduleStatus } from '@/features/update-schedule-status';
import { ROUTES } from '@/shared/config/routes';
import { BottomSheet } from '@/shared/ui/bottom-sheet';
import { ButtonBase } from '@/shared/ui/button-base';
import { Header } from '@/shared/ui/header';
import { SectionTitle } from '@/shared/ui/section-title';
import { Text } from '@/shared/ui/text';
import { ScheduleStatusesList } from '@/widgets/schedule-statuses-list';

export function ScheduleStatusesPage() {
  const router = useRouter();

  const [editingId, setEditingId] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [editingStatus, setEditingStatus] = useState<FormValues | null>(null);
  const [deletingStatus, setDeletingStatus] = useState<ScheduleStatus | null>(
    null,
  );

  const addStatus = useAddScheduleStatus();
  const updateStatus = useUpdateScheduleStatus();

  const handleClose = (): void => {
    setEditingId(null);
    setIsAdding(false);
    setEditingStatus(null);
    setDeletingStatus(null);
  };

  const handleSave = async (data: FormValues): Promise<void> => {
    if (editingId) {
      await updateStatus.mutateAsync({
        id: editingId,
        name: data.name,
        description: data.description,
        scheduleMark: data.scheduleMark,
        excelMark: data.excelMark,
        color: data.color,
        isActive: true,
      });
    } else {
      await addStatus.mutateAsync({
        name: data.name,
        description: data.description,
        scheduleMark: data.scheduleMark,
        excelMark: data.excelMark,
        color: data.color,
        isActive: true,
      });
    }

    handleClose();
  };

  const handleDelete = async (): Promise<void> => {
    handleClose();
  };

  const handleStatusPress = (status: ScheduleStatus): void => {
    setEditingId(status.id);
    setIsAdding(false);
    setEditingStatus({
      name: status.name,
      description: status.description ?? '',
      scheduleMark: status.schedule_mark ?? '',
      excelMark: status.excel_mark ?? '',
      color: status.color ?? '#E1E2E5',
      isLocked: false,
    });
  };

  const isSheetOpen = editingId !== null || isAdding;
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
          onPress={() => {
            setEditingId(null);
            setEditingStatus(null);
            setIsAdding(true);
          }}
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
        title={isEditing ? 'Редагувати статус' : 'Додати статус'}
      >
        <EditScheduleStatusForm
          onCancel={handleClose}
          onSave={handleSave}
          initialValues={editingStatus ?? undefined}
        />
      </BottomSheet>

      {deletingStatus && (
        <DeleteConfirmationSheet
          isOpen={!!deletingStatus}
          onClose={handleClose}
          onConfirm={handleDelete}
          isLoading={false}
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
