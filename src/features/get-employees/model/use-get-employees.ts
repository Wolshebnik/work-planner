import { useQuery } from '@tanstack/react-query';

import { type Employee } from '@/entities/employee';

import { employeeKeys } from './query-keys';
import { getEmployees } from '../api/get-employees';

export function useGetEmployees() {
  return useQuery({
    queryKey: employeeKeys.all,
    queryFn: getEmployees,
  });
}

export type { Employee };