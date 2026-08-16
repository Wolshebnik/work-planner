import { useState } from 'react';
import { View, ScrollView } from 'react-native';

import { Header } from '@/shared/ui/header';
import { Button } from '@/shared/ui/button';
import { SectionTitle } from '@/shared/ui/section-title';
import { EmployeeCard, ArchivedEmployeesCard, employees } from '@/entities/employee';
import { EmployeeDetailsWidget } from '@/widgets/employee-details/ui/employee-details-widget';

export function TeamPage() {
  const [employeesList, setEmployeesList] = useState(employees);
  const [selectedEmployee, setSelectedEmployee] = useState<
    (typeof employeesList)[number] | null
  >(null);

  const activeEmployees = employeesList.filter((e) => e.isActive);
  const archivedEmployeesCount = employeesList.length - activeEmployees.length;

  const handleArchive = (id: string) => {
    setEmployeesList((prev) =>
      prev.map((e) =>
        e.id === id ? { ...e, isActive: false } : e,
      ),
    );
    setSelectedEmployee(null);
  };

  return (
    <View className='flex-1'>
      <Header title='Команда' />

      <View className='flex-row items-center justify-between px-6 mb-5'>
        <SectionTitle
          text={`${activeEmployees.length} активних працівників`}
          className='font-bold text-[18px]'
        />
        <Button variant='primary' appearance='solid'>
          + Додати
        </Button>
      </View>

      <ScrollView className='px-4' contentContainerClassName='gap-3 pb-6'>
        {activeEmployees.map((employee) => (
          <EmployeeCard
            key={employee.name}
            employee={employee}
            onPress={() => setSelectedEmployee(employee)}
          />
        ))}

        {archivedEmployeesCount > 0 && (
          <ArchivedEmployeesCard count={archivedEmployeesCount} />
        )}
      </ScrollView>

      <EmployeeDetailsWidget
        employee={selectedEmployee}
        isOpen={!!selectedEmployee}
        onClose={() => setSelectedEmployee(null)}
        onAction={handleArchive}
        actionLabel='Архівувати працівника'
        isArchiveAction
      />
    </View>
  );
}
