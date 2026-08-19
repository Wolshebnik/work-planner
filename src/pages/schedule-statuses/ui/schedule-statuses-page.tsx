import { useState } from 'react';

import { useRouter } from 'expo-router';
import { View } from 'react-native';

import { type ScheduleStatus } from '@/entities/schedule-status';
import { useAddScheduleStatus } from '@/features/add-schedule-status';
import { useArchiveScheduleStatus } from '@/features/archive-schedule-status';
import {
  EditScheduleStatusSheet,
  type FormValues,
} from '@/features/edit-schedule-status';
import { useUpdateScheduleStatus } from '@/features/update-schedule-status';
import { ROUTES } from '@/shared/config/routes';
import { ButtonBase } from '@/shared/ui/button-base';
import { DeleteConfirmationSheet } from '@/shared/ui/delete-confirmation-sheet';
import { Header } from '@/shared/ui/header';
import { SectionTitle } from '@/shared/ui/section-title';
import { Text } from '@/shared/ui/text';
import { ScheduleStatusesList } from '@/widgets/schedule-statuses-list';

export function ScheduleStatusesPage() {
  const router = useRouter();

  const addStatus = useAddScheduleStatus();
  const updateStatus = useUpdateScheduleStatus();
  const archiveStatus = useArchiveScheduleStatus();

  const [editingId, setEditingId] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [editingStatus, setEditingStatus] = useState<FormValues | null>(null);
  const [deletingStatus, setDeletingStatus] = useState<ScheduleStatus | null>(
    null,
  );

  const handleClose = (): void => {
    setEditingId(null);
    setIsAdding(false);
    setEditingStatus(null);
    setDeletingStatus(null);
  };

  const handleSave = async (data: FormValues): Promise<void> => {
    const currentEditingId = editingId;
    handleClose();

    if (currentEditingId) {
      updateStatus.mutate({
        id: currentEditingId,
        name: data.name,
        description: data.description,
        scheduleMark: data.scheduleMark,
        excelMark: data.excelMark,
        color: data.color,
        isLocked: data.isLocked,
        isActive: true,
      });
    } else {
      addStatus.mutate({
        name: data.name,
        description: data.description,
        scheduleMark: data.scheduleMark,
        excelMark: data.excelMark,
        color: data.color,
        isLocked: data.isLocked,
        isActive: true,
      });
    }
  };

  const handleDelete = async (): Promise<void> => {
    if (deletingStatus) {
      const statusId = deletingStatus.id;
      handleClose();
      archiveStatus.mutate(statusId);
    } else {
      handleClose();
    }
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
      isLocked: status.is_locked ?? false,
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

      <EditScheduleStatusSheet
        isOpen={isSheetOpen}
        isEditing={isEditing}
        statusId={editingId}
        initialValues={editingStatus}
        onClose={handleClose}
        onSave={handleSave}
      />

      {deletingStatus && (
        <DeleteConfirmationSheet
          isOpen={!!deletingStatus}
          onClose={handleClose}
          onConfirm={handleDelete}
          isLoading={archiveStatus.isPending}
          title='Архівування статусу'
          confirmText='В архів'
          description={
            <View className='gap-2'>
              <Text className='text-[16px] text-text text-center'>
                Ви впевнені, що хочете перевести в архів статус &nbsp;
                <Text className='text-[18px] text-danger'>
                  {`"${deletingStatus.name}"`}
                </Text>
                ?
              </Text>
              <Text className='text-[14px] text-placeholder text-center'>
                Архівування статусу приховає його для нових графіків. Історія
                старих графіків залишиться незмінною.
              </Text>
            </View>
          }
        />
      )}
    </View>
  );
}
