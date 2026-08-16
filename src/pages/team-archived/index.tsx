import { useState } from 'react';

import { useRouter } from 'expo-router';
import { View, ScrollView } from 'react-native';

import { Button } from '@/shared/ui/button';
import { Header } from '@/shared/ui/header';
import { ROUTES } from '@/shared/config/routes';
import { SectionTitle } from '@/shared/ui/section-title';
import { employees, EmployeeCard } from '@/entities/employee';

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
            key={employee.id}
            employee={employee}
            rightElement={
              <Button
                variant='grey'
                appearance='outline'
                className='border-grey py-1'
                onPress={() => handleUnarchive(employee.id)}
              >
                Видалити
              </Button>
            }
          />
        ))}
      </ScrollView>
    </View>
  );
}
