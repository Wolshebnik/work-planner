import { useMemo, useState } from 'react';

import { useRouter } from 'expo-router';

import {
  useGetEmployees,
  useRestoreEmployee,
} from '@/entities/employee';
import { getEmployeeAvatarColor } from '@/shared/config/get-avatar-color';
import { ROUTES } from '@/shared/config/routes';

export function useTeamArchivedPage() {
  const router = useRouter();

  const { data: employees = [], isLoading } = useGetEmployees();
  const restoreEmployeeMutation = useRestoreEmployee();

  const [restoringEmployee, setRestoringEmployee] = useState<{
    id: string;
    name: string;
  } | null>(null);

  const archivedEmployees = useMemo(
    () =>
      employees
        .filter((e) => !e.is_active)
        .map((e) => ({
          id: e.id,
          name: [e.last_name, e.first_name, e.patronymic]
            .filter(Boolean)
            .join(' '),
          isActive: e.is_active,
          color: getEmployeeAvatarColor(e.id),
        })),
    [employees],
  );

  const handleRestore = () => {
    if (!restoringEmployee) return;
    const employeeId = restoringEmployee.id;
    const isLastEmployee = archivedEmployees.length <= 1;
    setRestoringEmployee(null);
    restoreEmployeeMutation.mutate(employeeId);
    if (isLastEmployee) {
      router.push(ROUTES.TEAM);
    }
  };

  const handleClose = () => {
    setRestoringEmployee(null);
  };

  return {
    archivedEmployees,
    isLoading,
    restoringEmployee,
    setRestoringEmployee,
    isRestorePending: restoreEmployeeMutation.isPending,
    handleRestore,
    handleClose,
  };
}
