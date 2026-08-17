import { useState } from 'react';

import { ScrollView, View } from 'react-native';

import {
  ArchivedEmployeesCard,
  EmployeeCard,
  employees,
} from '@/entities/employee';
import {
  EmployeeAddSheet,
  type EmployeeData,
  EmployeeDetailsSheet,
} from '@/features/employee-details';
import { ButtonBase } from '@/shared/ui/button-base';
import { Header } from '@/shared/ui/header';
import { SectionTitle } from '@/shared/ui/section-title';

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export function TeamPage() {
  const [employeesList, setEmployeesList] = useState(employees);
  const [selectedEmployee, setSelectedEmployee] = useState<EmployeeData | null>(
    null,
  );
  const [isAddOpen, setIsAddOpen] = useState(false);

  const activeEmployees = employeesList.filter((e) => e.isActive);
  const archivedEmployeesCount = employeesList.length - activeEmployees.length;

  const handleArchive = (id: string) => {
    setEmployeesList((prev) =>
      prev.map((e) => (e.id === id ? { ...e, isActive: false } : e)),
    );
    setSelectedEmployee(null);
  };

  const handleSaveEmployee = async (data: {
    lastName: string;
    firstName: string;
    middleName?: string;
  }) => {
    await delay(2000);
    if (!selectedEmployee) return;
    const fullName = [data.lastName, data.firstName, data.middleName]
      .filter(Boolean)
      .join(' ');
    setEmployeesList((prev) =>
      prev.map((e) =>
        e.id === selectedEmployee.id ? { ...e, name: fullName } : e,
      ),
    );
  };

  const handleAddEmployee = async (data: {
    lastName: string;
    firstName: string;
    middleName?: string;
  }) => {
    await delay(2000);
    const fullName = [data.lastName, data.firstName, data.middleName]
      .filter(Boolean)
      .join(' ');
    const newEmployee = {
      id: String(employeesList.length + 1),
      name: fullName,
      isActive: true,
    };
    setEmployeesList((prev) => [...prev, newEmployee]);
    setIsAddOpen(false);
  };

  return (
    <View className='flex-1'>
      <Header title='Команда' />

      <View className='flex-row items-center justify-between px-6 mb-5'>
        <SectionTitle
          text={`${activeEmployees.length} активних працівників`}
          className='font-bold text-[18px]'
        />
        <ButtonBase
          variant='primary'
          appearance='solid'
          onPress={() => setIsAddOpen(true)}
        >
          + Додати
        </ButtonBase>
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

      <EmployeeDetailsSheet
        employee={selectedEmployee}
        isOpen={!!selectedEmployee}
        onClose={() => setSelectedEmployee(null)}
        onArchive={handleArchive}
        onSave={handleSaveEmployee}
      />

      <EmployeeAddSheet
        employee={isAddOpen ? { id: 'new', name: '', isActive: true } : null}
        isOpen={isAddOpen}
        initialMode='edit'
        onClose={() => setIsAddOpen(false)}
        onArchive={() => {}}
        onSave={handleAddEmployee}
      />
    </View>
  );
}
