import { useRouter } from 'expo-router';
import { ScrollView, View } from 'react-native';

import { ScheduleStatusItem } from '@/entities/schedule-status';
import { ROUTES } from '@/shared/config/routes';
import { CircularProgressLoader } from '@/shared/ui/circular-progress-loader';
import { DeleteConfirmationSheet } from '@/shared/ui/delete-confirmation-sheet';
import { Header } from '@/shared/ui/header';
import { SectionTitle } from '@/shared/ui/section-title';
import { Text } from '@/shared/ui/text';

import { useScheduleStatusesArchivedPage } from '../model/use-schedule-statuses-archived-page';

export function ScheduleStatusesArchivedPage() {
  const router = useRouter();
  const {
    archivedStatuses,
    isLoading,
    restoringStatus,
    setRestoringStatus,
    isRestorePending,
    handleRestore,
    handleClose,
  } = useScheduleStatusesArchivedPage();

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

      <ScrollView
        className='flex-1 mb-5 px-4'
        contentContainerClassName='gap-3 pb-6'
      >
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
