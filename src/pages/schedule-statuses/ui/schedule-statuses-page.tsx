import { useRouter } from 'expo-router';
import { View } from 'react-native';

import { EditScheduleStatusSheet } from '@/features/edit-schedule-status';
import { ROUTES } from '@/shared/config/routes';
import { ButtonBase } from '@/shared/ui/button-base';
import { DeleteConfirmationSheet } from '@/shared/ui/delete-confirmation-sheet';
import { Header } from '@/shared/ui/header';
import { SectionTitle } from '@/shared/ui/section-title';
import { Text } from '@/shared/ui/text';
import { ScheduleStatusesList } from '@/widgets/schedule-statuses-list';

import { useScheduleStatusesPage } from '../model/use-schedule-statuses-page';

export function ScheduleStatusesPage() {
  const router = useRouter();
  const {
    editingId,
    editingStatus,
    deletingStatus,
    setDeletingStatus,
    isSheetOpen,
    isEditing,
    isArchivePending,
    handleClose,
    handleOpenAdd,
    handleSave,
    handleDelete,
    handleStatusPress,
  } = useScheduleStatusesPage();

  return (
    <View className='flex-1'>
      <Header
        title='Статуси графіка'
        onBackPress={() => router.push(ROUTES.MORE)}
      />

      <View className='flex-row items-center justify-between px-6 mb-5'>
        <SectionTitle text='Статуси' className='font-bold text-[18px]' />

        <ButtonBase
          variant='primary'
          appearance='solid'
          onPress={handleOpenAdd}
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
          isLoading={isArchivePending}
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
