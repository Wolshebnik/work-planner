import { useCallback, useState } from 'react';

import { useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'expo-router';
import { RefreshControl, ScrollView, View } from 'react-native';

import {
  ScheduleStatusItem,
  scheduleStatusesQueryKey,
} from '@/entities/schedule-status';
import { ROUTES } from '@/shared/config/routes';
import { CircularProgressLoader } from '@/shared/ui/circular-progress-loader';
import { DeleteConfirmationSheet } from '@/shared/ui/delete-confirmation-sheet';
import { Header } from '@/shared/ui/header';
import { ResponsiveContainer } from '@/shared/ui/responsive-container';
import { SectionTitle } from '@/shared/ui/section-title';
import { Text } from '@/shared/ui/text';

import { useScheduleStatusesArchivedPage } from '../model/use-schedule-statuses-archived-page';

export function ScheduleStatusesArchivedPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [refreshing, setRefreshing] = useState(false);

  const {
    archivedStatuses,
    isLoading,
    restoringStatus,
    setRestoringStatus,
    isRestorePending,
    handleRestore,
    handleClose,
  } = useScheduleStatusesArchivedPage();

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await queryClient.invalidateQueries({
        queryKey: scheduleStatusesQueryKey,
      });
    } finally {
      setRefreshing(false);
    }
  }, [queryClient]);

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
        className='mb-3'
      />

      <ScrollView
        className='flex-1'
        contentContainerClassName='px-4'
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            colors={['#02658B']}
            tintColor='#02658B'
          />
        }
      >
        <ResponsiveContainer>
          <SectionTitle
            text={`${archivedStatuses.length} АРХІВОВАНИХ СТАТУСІВ`}
            className='font-bold text-[14px] pl-2 mb-3'
          />

          <View className='gap-3 pb-6'>
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
          </View>
        </ResponsiveContainer>
      </ScrollView>

      {restoringStatus && (
        <DeleteConfirmationSheet
          isOpen={!!restoringStatus}
          onClose={handleClose}
          onConfirm={handleRestore}
          isLoading={isRestorePending}
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
