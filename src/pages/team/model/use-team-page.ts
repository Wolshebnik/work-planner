import { useCallback, useMemo, useState } from 'react';

import {
  type Employee,
  useAddEmployee,
  useGetEmployees,
  useReorderEmployees,
  useUpdateEmployee,
} from '@/entities/employee';
import { type EmployeeData } from '@/features/employee-details';
import {
  createEmployeeColorMap,
  getEmployeeAvatarColor,
} from '@/shared/config/get-avatar-color';

export function useTeamPage() {
  const [selectedEmployee, setSelectedEmployee] = useState<EmployeeData | null>(
    null,
  );
  const [isAddOpen, setIsAddOpen] = useState(false);

  const { data: employees = [], isLoading } = useGetEmployees();
  const addEmployeeMutation = useAddEmployee();
  const updateEmployeeMutation = useUpdateEmployee();
  const reorderEmployeesMutation = useReorderEmployees();

  const colorMap = useMemo(
    () => createEmployeeColorMap(employees),
    [employees],
  );

  const activeEmployees = useMemo(
    () => employees.filter((e) => e.is_active),
    [employees],
  );
  const archivedEmployeesCount = employees.length - activeEmployees.length;

  const handleAddEmployee = async (data: {
    firstName: string;
    lastName: string;
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
    firstName: string;
    lastName: string;
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

  const handleDrop = useCallback(
    (_id: string, _position: number, allPositions?: Record<string, number>) => {
      if (!allPositions) return;

      const count = activeEmployees.length;
      const orderedActive = new Array<Employee>(count);
      const seenPositions = new Set<number>();

      for (const emp of activeEmployees) {
        const pos = allPositions[emp.id];
        if (
          pos === undefined ||
          pos < 0 ||
          pos >= count ||
          seenPositions.has(pos)
        ) {
          return;
        }
        seenPositions.add(pos);
        orderedActive[pos] = emp;
      }

      if (seenPositions.size !== count) {
        return;
      }

      const reorderedEmployees: Employee[] = orderedActive.map(
        (employee, index) => ({
          ...employee,
          sort_order: (index + 1) * 10,
        }),
      );

      reorderEmployeesMutation.mutate(reorderedEmployees);
    },
    [activeEmployees, reorderEmployeesMutation],
  );

  const getCardData = useCallback(
    (item: Employee): EmployeeData => ({
      id: item.id,
      name: [item.last_name, item.first_name, item.patronymic]
        .filter(Boolean)
        .join(' '),
      isActive: item.is_active,
      color: getEmployeeAvatarColor(item.id, colorMap),
    }),
    [colorMap],
  );

  return {
    activeEmployees,
    archivedEmployeesCount,
    getCardData,
    handleAddEmployee,
    handleDrop,
    handleUpdateEmployee,
    isAddOpen,
    isLoading,
    selectedEmployee,
    setIsAddOpen,
    setSelectedEmployee,
  };
}
