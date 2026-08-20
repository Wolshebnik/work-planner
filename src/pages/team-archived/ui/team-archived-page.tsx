import { useRouter } from 'expo-router';
import { ScrollView, View } from 'react-native';

import { EmployeeCard } from '@/entities/employee';
import { ROUTES } from '@/shared/config/routes';
import { CircularProgressLoader } from '@/shared/ui/circular-progress-loader';
import { DeleteConfirmationSheet } from '@/shared/ui/delete-confirmation-sheet';
import { Header } from '@/shared/ui/header';
import { SectionTitle } from '@/shared/ui/section-title';
import { Text } from '@/shared/ui/text';

import { useTeamArchivedPage } from '../model/use-team-archived-page';

export function TeamArchivedPage() {
  const router = useRouter();
  const {
    archivedEmployees,
    isLoading,
    restoringEmployee,
    setRestoringEmployee,
    isRestorePending,
    handleRestore,
    handleClose,
  } = useTeamArchivedPage();

  return (
    <View className='flex-1'>
      <Header title='Архів' onBackPress={() => router.push(ROUTES.TEAM)} />

      <View className='px-6 mb-3'>
        <SectionTitle
          text={`${archivedEmployees.length} АРХІВОВАНИХ ПРАЦІВНИКІВ`}
          className='font-bold text-[14px]'
        />
      </View>

      {isLoading ? (
        <View className='flex-1 items-center justify-center'>
          <CircularProgressLoader size='large' />
        </View>
      ) : (
        <ScrollView className='px-4' contentContainerClassName='gap-3 pb-6'>
          {archivedEmployees.map((employee) => (
            <EmployeeCard
              isArchived
              key={employee.id}
              employee={employee}
              onPress={() =>
                setRestoringEmployee({
                  id: employee.id,
                  name: employee.name,
                })
              }
            />
          ))}
        </ScrollView>
      )}

      {restoringEmployee && (
        <DeleteConfirmationSheet
          isOpen={!!restoringEmployee}
          onClose={handleClose}
          onConfirm={handleRestore}
          isLoading={isRestorePending}
          title='Відновлення працівника'
          confirmText='Відновити'
          confirmVariant='success'
          description={
            <Text className='text-[16px] text-text'>
              Ви впевнені, що хочете відновити працівника &nbsp;
              <Text className='text-[18px] text-success'>
                {`"${restoringEmployee.name}"`}
              </Text>
              ?
            </Text>
          }
        />
      )}
    </View>
  );
}
