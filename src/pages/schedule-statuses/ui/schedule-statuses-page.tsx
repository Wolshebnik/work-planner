import { useState } from 'react';

import { useRouter } from 'expo-router';
import { View } from 'react-native';

import {
  EditScheduleStatusForm,
  type FormValues,
} from '@/features/edit-schedule-status';
import { DeleteConfirmationSheet } from '@/features/delete-employee/ui/delete-confirmation-sheet';
import { ROUTES } from '@/shared/config/routes';
import { BottomSheet } from '@/shared/ui/bottom-sheet';
import { Header } from '@/shared/ui/header';
import { SectionTitle } from '@/shared/ui/section-title';
import { Text } from '@/shared/ui/text';
import { ScheduleStatusesList } from '@/widgets/schedule-statuses-list';

export function ScheduleStatusesPage() {
  const router = useRouter();

  const [selectedStatus, setSelectedStatus] = useState<{
    title: string;
  } | null>(null);
  const [deletingStatus, setDeletingStatus] = useState<{
    title: string;
  } | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleClose = () => {
    setSelectedStatus(null);
    setDeletingStatus(null);
  };

  const handleSave = async (data: FormValues) => {
    await new Promise((resolve) => setTimeout(resolve, 2000));
    console.log('Form data:', data);
    handleClose();
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    await new Promise((resolve) => setTimeout(resolve, 2000));
    console.log('Deleted:', deletingStatus?.title);
    setIsDeleting(false);
    handleClose();
  };

  return (
    <View className='flex-1'>
      <Header
        title='Статуси графіка'
        onBackPress={() => router.push(ROUTES.MORE)}
      />

      <View className='px-6'>
        <SectionTitle text='Статуси' className='font-bold text-[14px] pl-4' />
      </View>

      <ScheduleStatusesList
        onStatusPress={setSelectedStatus}
        onDeleteStatus={setDeletingStatus}
      />

      <BottomSheet
        isOpen={!!selectedStatus}
        onClose={handleClose}
        title={
          selectedStatus ? `Деталі — ${selectedStatus.title}` : 'Деталі статусу'
        }
      >
        <EditScheduleStatusForm onCancel={handleClose} onSave={handleSave} />
      </BottomSheet>

      {deletingStatus && (
        <DeleteConfirmationSheet
          isOpen={!!deletingStatus}
          onClose={handleClose}
          onConfirm={handleDelete}
          isLoading={isDeleting}
          title='Видалення статусу'
          description={
            <Text className='text-[16px] text-text'>
              Ви впевнені, що хочете видалити статус &nbsp;
              <Text className='text-[18px] text-danger'>
                {`"${deletingStatus.title}"`}
              </Text>
              ?
            </Text>
          }
        />
      )}
    </View>
  );
}
