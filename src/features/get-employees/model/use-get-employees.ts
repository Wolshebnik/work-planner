import { useQuery } from '@tanstack/react-query';

import { getEmployees, type Employee } from '../api/get-employees';

export function useGetEmployees() {
  return useQuery({
    queryKey: ['employees'],
    queryFn: getEmployees,
  });
}

export type { Employee };