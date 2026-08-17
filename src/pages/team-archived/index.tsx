import { useState } from 'react';

import { useRouter } from 'expo-router';
import { ScrollView, TouchableOpacity, View } from 'react-native';

import { Trash } from '@/assets/svg';
import { EmployeeCard, employees } from '@/entities/employee';
import { DeleteConfirmationSheet } from '@/features/delete-employee/ui/delete-confirmation-sheet';
import { EmployeeData } from '@/features/employee-details';
import { ROUTES } from '@/shared/config/routes';
import { Header } from '@/shared/ui/header';
import { SectionTitle } from '@/shared/ui/section-title';
import { Text } from '@/shared/ui/text';

export function TeamArchivedPage() {
  const router = useRouter();
  const [employeesList, setEmployeesList] = useState(employees);
  const [deletingEmployee, setDeletingEmployee] = useState<EmployeeData | null>(
    null,
  );
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!deletingEmployee) return;
    setIsDeleting(true);
    await new Promise((resolve) => setTimeout(resolve, 2000));

    setEmployeesList((prev) =>
      prev.map((e) =>
        e.id === deletingEmployee.id ? { ...e, isActive: true } : e,
      ),
    );
    setIsDeleting(false);
    setDeletingEmployee(null);
  };

  const archivedEmployees = employeesList.filter((e) => !e.isActive);

  return (
    <View className='flex-1'>
      <Header title='Архів' onBackPress={() => router.push(ROUTES.TEAM)} />

      <View className='px-6 mb-3'>
        <SectionTitle
          text={`${archivedEmployees.length} АРХІВОВАНИЙ ПРАЦІВНИК`}
          className='font-bold text-[14px]'
        />
      </View>

      <ScrollView className='px-4' contentContainerClassName='gap-3 pb-6'>
        {archivedEmployees.map((employee) => (
          <EmployeeCard
            isArchived
            key={employee.id}
            employee={employee}
            rightElement={
              <View className='flex-row items-center gap-2'>
                <TouchableOpacity
                  onPress={() => setDeletingEmployee(employee)}
                  className='p-2'
                >
                  <Trash className='text-danger' />
                </TouchableOpacity>
              </View>
            }
          />
        ))}
      </ScrollView>

      {deletingEmployee && (
        <DeleteConfirmationSheet
          isOpen={!!deletingEmployee}
          onClose={() => setDeletingEmployee(null)}
          onConfirm={handleDelete}
          isLoading={isDeleting}
          title='Видалення працівника'
          description={
            <Text className='text-[16px] text-text'>
              Ви впевнені, що хочете видалити працівника &nbsp;
              <Text className='text-[18px] text-danger'>
                {`"${deletingEmployee.name}"`}
              </Text>
              ?
            </Text>
          }
        />
      )}
    </View>
  );
}
