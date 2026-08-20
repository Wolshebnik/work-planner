import { queryOptions } from '@tanstack/react-query';

import { getEmployees } from '../api/get-employees';

export const employeeKeys = {
  all: ['employees'] as const,
};

export function employeeQueryOptions() {
  return queryOptions({
    queryKey: employeeKeys.all,
    queryFn: getEmployees,
    staleTime: Infinity,
    gcTime: Infinity,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });
}
