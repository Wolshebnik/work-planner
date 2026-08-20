import { usePathname } from 'expo-router';

import type { ViewMode } from '@/shared/ui/view-switcher';

export function useScheduleViewMode(): ViewMode {
  const pathname = usePathname();

  if (pathname.includes('/schedule/month')) {
    return 'month';
  }

  if (pathname.includes('/schedule/summary')) {
    return 'summary';
  }

  return 'week';
}
