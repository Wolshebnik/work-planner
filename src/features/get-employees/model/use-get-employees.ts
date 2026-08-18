import { useQuery } from '@tanstack/react-query';

import { type Employee } from '@/entities/employee';

import { getEmployees } from '../api/get-employees';

export function useGetEmployees() {
  return useQuery({
    queryKey: ['employees'],
    queryFn: getEmployees,
  });
}

export type { Employee };