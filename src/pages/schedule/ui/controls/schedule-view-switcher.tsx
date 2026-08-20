import { useRouter } from 'expo-router';

import { ROUTES } from '@/shared/config/routes';
import { type ViewMode, ViewSwitcher } from '@/shared/ui/view-switcher';

import { useScheduleViewMode } from '../../model/navigation/use-schedule-view-mode';

export function ScheduleViewSwitcher() {
  const router = useRouter();
  const viewMode = useScheduleViewMode();

  const handleViewModeChange = (mode: ViewMode) => {
    if (mode === 'week') {
      router.replace(ROUTES.SCHEDULE_WEEK);
    }
    if (mode === 'month') {
      router.replace(ROUTES.SCHEDULE_MONTH);
    }
    if (mode === 'summary') {
      router.replace(ROUTES.SCHEDULE_SUMMARY);
    }
  };

  return <ViewSwitcher value={viewMode} onChange={handleViewModeChange} />;
}
