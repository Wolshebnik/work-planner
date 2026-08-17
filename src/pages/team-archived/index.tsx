import { useState } from 'react';

import { useRouter } from 'expo-router';
import { ScrollView, View } from 'react-native';

import { EmployeeCard, employees } from '@/entities/employee';
import { ROUTES } from '@/shared/config/routes';
import { ButtonBase } from '@/shared/ui/button-base';
import { Header } from '@/shared/ui/header';
import { SectionTitle } from '@/shared/ui/section-title';

export function TeamArchivedPage() {
  const router = useRouter();
  const [employeesList, setEmployeesList] = useState(employees);

  const handleUnarchive = (id: string) => {
    setEmployeesList((prev) =>
      prev.map((e) => (e.id === id ? { ...e, isActive: true } : e)),
    );
  };

  const archivedEmployees = employeesList.filter((e) => !e.isActive);

  return (
    <View className='flex-1'>
      <Header title='Архів' onBackPress={() => router.push(ROUTES.TEAM)} />

      <View className='px-6 mb-5'>
        <SectionTitle
          text={`${archivedEmployees.length} АРХІВОВАНИЙ ПРАЦІВНИК`}
          className='font-bold text-[18px]'
        />
      </View>

      <ScrollView className='px-4' contentContainerClassName='gap-3 pb-6'>
        {archivedEmployees.map((employee) => (
          <EmployeeCard
            isArchived
            key={employee.id}
            employee={employee}
            rightElement={
              <ButtonBase
                variant='grey'
                appearance='outline'
                className='border-grey py-1'
                onPress={() => handleUnarchive(employee.id)}
              >
                Видалити
              </ButtonBase>
            }
          />
        ))}
      </ScrollView>
    </View>
  );
}
