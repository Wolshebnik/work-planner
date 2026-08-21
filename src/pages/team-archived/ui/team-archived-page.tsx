import { useRouter } from 'expo-router';
import { ScrollView, View } from 'react-native';

import { EmployeeCard } from '@/entities/employee';
import { ROUTES } from '@/shared/config/routes';
import { CircularProgressLoader } from '@/shared/ui/circular-progress-loader';
import { DeleteConfirmationSheet } from '@/shared/ui/delete-confirmation-sheet';
import { Header } from '@/shared/ui/header';
import { ResponsiveContainer } from '@/shared/ui/responsive-container';
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
      <Header
        title='Архів'
        onBackPress={() => router.push(ROUTES.TEAM)}
        className='mb-3'
      />

      {isLoading ? (
        <View className='flex-1 items-center justify-center'>
          <CircularProgressLoader size='large' />
        </View>
      ) : (
        <ScrollView className='flex-1' contentContainerClassName='px-4'>
          <ResponsiveContainer>
            <SectionTitle
              text={`${archivedEmployees.length} АРХІВОВАНИХ ПРАЦІВНИКІВ`}
              className='font-bold text-[14px] pl-2 mb-3'
            />

            <View className='gap-3 mb-5'>
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
            </View>
          </ResponsiveContainer>
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
