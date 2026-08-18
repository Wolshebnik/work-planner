import { useState } from 'react';

import { useRouter } from 'expo-router';
import { ScrollView, View } from 'react-native';

import { EmployeeCard } from '@/entities/employee';
import { DeleteConfirmationSheet } from '@/features/delete-employee/ui/delete-confirmation-sheet';
import { useGetEmployees } from '@/features/get-employees';
import { useRestoreEmployee } from '@/features/restore-employee';
import { ROUTES } from '@/shared/config/routes';
import { CircularProgressLoader } from '@/shared/ui/circular-progress-loader';
import { Header } from '@/shared/ui/header';
import { SectionTitle } from '@/shared/ui/section-title';
import { Text } from '@/shared/ui/text';

export function TeamArchivedPage() {
  const router = useRouter();

  const { data: employees = [], isLoading } = useGetEmployees();
  const restoreEmployeeMutation = useRestoreEmployee();

  const [restoringEmployee, setRestoringEmployee] = useState<{
    id: string;
    name: string;
  } | null>(null);

  const archivedEmployees = employees
    .filter((e) => !e.is_active)
    .map((e) => ({
      id: e.id,
      name: [e.last_name, e.first_name, e.patronymic].filter(Boolean).join(' '),
      isActive: e.is_active,
    }));

  const handleRestore = async () => {
    if (!restoringEmployee) return;
    await restoreEmployeeMutation.mutateAsync(restoringEmployee.id);
    setRestoringEmployee(null);
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
      <Header title='Архів' onBackPress={() => router.push(ROUTES.TEAM)} />

      <View className='px-6 mb-3'>
        <SectionTitle
          text={`${archivedEmployees.length} АРХІВОВАНИХ ПРАЦІВНИКІВ`}
          className='font-bold text-[14px]'
        />
      </View>

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

      {restoringEmployee && (
        <DeleteConfirmationSheet
          isOpen={!!restoringEmployee}
          onClose={() => setRestoringEmployee(null)}
          onConfirm={handleRestore}
          isLoading={restoreEmployeeMutation.isPending}
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
