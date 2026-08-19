import { useMemo, useState } from 'react';

import { ScrollView, View } from 'react-native';

import { ArchivedEmployeesCard, EmployeeCard } from '@/entities/employee';
import { useAddEmployee } from '@/features/add-employee';
import {
  EmployeeAddSheet,
  type EmployeeData,
  EmployeeDetailsSheet,
} from '@/features/employee-details';
import { useGetEmployees } from '@/features/get-employees';
import { useUpdateEmployee } from '@/features/update-employee';
import {
  createEmployeeColorMap,
  getEmployeeAvatarColor,
} from '@/shared/config/get-avatar-color';
import { ButtonBase } from '@/shared/ui/button-base';
import { CircularProgressLoader } from '@/shared/ui/circular-progress-loader';
import { Header } from '@/shared/ui/header';
import { SectionTitle } from '@/shared/ui/section-title';

export function TeamPage() {
  const [selectedEmployee, setSelectedEmployee] = useState<EmployeeData | null>(
    null,
  );
  const [isAddOpen, setIsAddOpen] = useState(false);

  const { data: employees = [], isLoading } = useGetEmployees();
  const addEmployeeMutation = useAddEmployee();
  const updateEmployeeMutation = useUpdateEmployee();

  const colorMap = useMemo(
    () => createEmployeeColorMap(employees),
    [employees],
  );

  const mappedEmployees: EmployeeData[] = employees.map((e) => ({
    id: e.id,
    name: [e.last_name, e.first_name, e.patronymic].filter(Boolean).join(' '),
    isActive: e.is_active,
    color: getEmployeeAvatarColor(e.id, colorMap),
  }));

  const activeEmployees = mappedEmployees.filter((e) => e.isActive);
  const archivedEmployeesCount =
    mappedEmployees.length - activeEmployees.length;

  const handleAddEmployee = async (data: {
    lastName: string;
    firstName: string;
    middleName?: string;
  }) => {
    setIsAddOpen(false);
    addEmployeeMutation.mutate({
      lastName: data.lastName,
      firstName: data.firstName,
      patronymic: data.middleName,
    });
  };

  const handleUpdateEmployee = async (data: {
    lastName: string;
    firstName: string;
    middleName?: string;
  }) => {
    if (!selectedEmployee) return;
    const employeeId = selectedEmployee.id;
    setSelectedEmployee(null);
    updateEmployeeMutation.mutate({
      id: employeeId,
      lastName: data.lastName,
      firstName: data.firstName,
      patronymic: data.middleName,
    });
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

      {isLoading ? (
        <View className='flex-1 items-center justify-center'>
          <CircularProgressLoader size='large' />
        </View>
      ) : (
        <ScrollView className='px-4' contentContainerClassName='gap-3 pb-6'>
          {activeEmployees.map((employee) => (
            <EmployeeCard
              key={employee.id}
              employee={employee}
              onPress={() => setSelectedEmployee(employee)}
            />
          ))}

          {archivedEmployeesCount > 0 && (
            <ArchivedEmployeesCard count={archivedEmployeesCount} />
          )}
        </ScrollView>
      )}

      <EmployeeDetailsSheet
        employee={selectedEmployee}
        isOpen={!!selectedEmployee}
        onClose={() => setSelectedEmployee(null)}
        onSave={handleUpdateEmployee}
      />

      <EmployeeAddSheet
        employee={isAddOpen ? { id: 'new', name: '', isActive: true } : null}
        isOpen={isAddOpen}
        initialMode='edit'
        onClose={() => setIsAddOpen(false)}
        onSave={handleAddEmployee}
      />
    </View>
  );
}
