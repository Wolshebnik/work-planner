import { useState } from 'react';

import { useRouter } from 'expo-router';
import { ScrollView, View } from 'react-native';

import {
  type ScheduleStatus,
  ScheduleStatusItem,
} from '@/entities/schedule-status';
import { useGetScheduleStatuses } from '@/features/get-schedule-statuses';
import { useRestoreScheduleStatus } from '@/features/restore-schedule-status';
import { ROUTES } from '@/shared/config/routes';
import { CircularProgressLoader } from '@/shared/ui/circular-progress-loader';
import { DeleteConfirmationSheet } from '@/shared/ui/delete-confirmation-sheet';
import { Header } from '@/shared/ui/header';
import { SectionTitle } from '@/shared/ui/section-title';
import { Text } from '@/shared/ui/text';

export function ScheduleStatusesArchivedPage() {
  const router = useRouter();

  const { data: statuses = [], isLoading } = useGetScheduleStatuses();
  const restoreStatusMutation = useRestoreScheduleStatus();

  const [restoringStatus, setRestoringStatus] = useState<ScheduleStatus | null>(
    null,
  );

  const archivedStatuses = statuses.filter((s) => !s.is_active);

  const handleRestore = () => {
    if (!restoringStatus) return;
    const statusId = restoringStatus.id;
    setRestoringStatus(null);
    restoreStatusMutation.mutate(statusId);
  };

  if (isLoading) {
    return (
      <View className='flex-1 items-center justify-center'>
        <CircularProgressLoader size='large' />
      </View>
    );
  }

  return (
    <View className='flex-1'>
      <Header
        title='Архів статусів'
        onBackPress={() => router.push(ROUTES.MORE_SCHEDULE_STATUSES)}
      />

      <View className='px-6 mb-3'>
        <SectionTitle
          text={`${archivedStatuses.length} АРХІВОВАНИХ СТАТУСІВ`}
          className='font-bold text-[14px]'
        />
      </View>

      <ScrollView className='flex-1 mb-5' contentContainerClassName='pb-6'>
        {archivedStatuses.map((status) => (
          <ScheduleStatusItem
            key={status.id}
            title={status.name}
            description={status.description ?? ''}
            status={status.schedule_mark ?? ''}
            color={status.color}
            isLocked={status.is_locked}
            onPress={() => setRestoringStatus(status)}
          />
        ))}
      </ScrollView>

      {restoringStatus && (
        <DeleteConfirmationSheet
          isOpen={!!restoringStatus}
          onClose={() => setRestoringStatus(null)}
          onConfirm={handleRestore}
          isLoading={restoreStatusMutation.isPending}
          title='Відновлення статусу'
          confirmText='Відновити'
          confirmVariant='success'
          description={
            <View className='gap-2'>
              <Text className='text-[16px] text-text text-center'>
                Ви впевнені, що хочете відновити статус &nbsp;
                <Text className='text-[18px] text-success'>
                  {`"${restoringStatus.name}"`}
                </Text>
                ?
              </Text>
              <Text className='text-[14px] text-placeholder text-center'>
                Статус знову з&apos;явиться в списку активних і буде доступний
                для вибору в графіках.
              </Text>
            </View>
          }
        />
      )}
    </View>
  );
}
