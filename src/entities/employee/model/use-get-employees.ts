import { useQuery } from '@tanstack/react-query';

import { employeeQueryOptions } from './query-keys';

export function useGetEmployees() {
  return useQuery(employeeQueryOptions());
}